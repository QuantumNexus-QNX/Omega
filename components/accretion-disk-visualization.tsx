"use client"

import { useEffect, useRef, useState } from "react"

type QualityTier = "ultra-low" | "low" | "medium" | "high" | "ultra"

function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium"

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isOlderAndroid = /Android [1-7]\./i.test(navigator.userAgent)

  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4
  const screenArea = window.screen.width * window.screen.height

  if (isMobile && !isTablet) {
    if (isOlderAndroid || cores <= 2 || memory <= 1) return "ultra-low"
    if (cores <= 4 || memory <= 2) return "low"
    if (isIOS) return "medium"
    return "medium"
  }

  if (isTablet) {
    if (cores <= 2 || memory <= 2) return "low"
    if (cores <= 4 || memory <= 3) return "medium"
    return "high"
  }

  if (cores >= 8 && memory >= 8 && screenArea >= 2073600) return "ultra"
  if (cores >= 4 && memory >= 4) return "high"
  if (cores <= 2) return "low"
  return "medium"
}

function getQualitySettings(tier: QualityTier) {
  const settings = {
    "ultra-low": {
      maxSteps: 128,
      pixelRatio: 0.75,
      diskSamples: 2,
      jetEnabled: true,
      bloomEnabled: false,
      targetFPS: 30,
      adaptiveStep: 0.05,
    },
    low: {
      maxSteps: 160,
      pixelRatio: 0.85,
      diskSamples: 2,
      jetEnabled: true,
      bloomEnabled: false,
      targetFPS: 30,
      adaptiveStep: 0.045,
    },
    medium: {
      maxSteps: 192,
      pixelRatio: 0.85,
      diskSamples: 2,
      jetEnabled: true,
      bloomEnabled: false,
      targetFPS: 45,
      adaptiveStep: 0.04,
    },
    high: {
      maxSteps: 320,
      pixelRatio: 1.15,
      diskSamples: 3,
      jetEnabled: true,
      bloomEnabled: true,
      targetFPS: 60,
      adaptiveStep: 0.03,
    },
    ultra: {
      maxSteps: 450,
      pixelRatio: 1.4,
      diskSamples: 3,
      jetEnabled: true,
      bloomEnabled: true,
      targetFPS: 60,
      adaptiveStep: 0.02,
    },
  }
  return settings[tier]
}

export default function AccretionDiskVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglError, setWebglError] = useState(false)
  const [shaderError, setShaderError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const qualityTier = detectQualityTier()
    const quality = getQualitySettings(qualityTier)

    const isAndroid = /Android/i.test(navigator.userAgent)

    let glContext: WebGL2RenderingContext | WebGLRenderingContext | null = null
    let isWebGL2 = true

    const contextOptions: WebGLContextAttributes = {
      alpha: false,
      antialias: qualityTier === "high" || qualityTier === "ultra",
      powerPreference: qualityTier === "ultra-low" || qualityTier === "low" ? "low-power" : "high-performance",
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: false,
      desynchronized: true,
    }

    try {
      glContext = canvas.getContext("webgl2", contextOptions) as WebGL2RenderingContext | null
    } catch (e) {
      console.warn("WebGL2 context creation failed, trying WebGL1")
    }

    if (!glContext) {
      isWebGL2 = false
      try {
        glContext = canvas.getContext("webgl", contextOptions) as WebGLRenderingContext | null
        if (!glContext) {
          glContext = canvas.getContext("experimental-webgl", contextOptions) as WebGLRenderingContext | null
        }
      } catch (e) {
        console.error("WebGL context creation failed")
      }
    }

    if (!glContext) {
      setWebglError(true)
      return
    }

    console.log("[v0] Device:", {
      userAgent: navigator.userAgent,
      isAndroid,
      qualityTier,
      webglVersion: isWebGL2 ? "WebGL2" : "WebGL1",
    })

    let contextLost = false
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault()
      contextLost = true
    })

    canvas.addEventListener("webglcontextrestored", () => {
      contextLost = false
      window.location.reload()
    })

    const versionPrefix = isWebGL2 ? "#version 300 es" : ""
    const inKeyword = isWebGL2 ? "in" : "attribute"
    const outKeyword = isWebGL2 ? "out" : "varying"
    const fragInKeyword = isWebGL2 ? "in" : "varying"
    const fragOutKeyword = isWebGL2 ? "out vec4 fragColor;" : ""
    const fragColorVar = isWebGL2 ? "fragColor" : "gl_FragColor"

    const vertexShaderSource = `${versionPrefix}
      ${inKeyword} vec2 a_position;
      ${outKeyword} vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = `${versionPrefix}
      precision highp float;
      precision highp int;
      
      ${fragInKeyword} vec2 v_uv;
      ${fragOutKeyword}
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      const float PI = 3.14159265359;
      const float RS = 0.6;
      const float DISK_INNER = 1.2;
      const float DISK_OUTER = 6.0;
      const int MAX_STEPS = ${quality.maxSteps};
      const float INCLINATION = 0.1045;
      const float ADAPTIVE_STEP = ${quality.adaptiveStep.toFixed(4)};
      
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 = p3 + dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }
      
      // Smooth turbulence using only sine waves - no grid artifacts
      float smoothTurb(vec2 p, float t) {
        float v = 0.0;
        // Layer 1 - large scale swirls
        v = v + sin(p.x * 1.2 + t * 0.7) * cos(p.y * 0.9 - t * 0.5) * 0.5;
        // Layer 2 - medium detail
        v = v + sin(p.x * 2.3 - t * 1.1 + p.y * 1.8) * 0.3;
        v = v + cos(p.y * 2.7 + t * 0.9 - p.x * 0.6) * 0.25;
        // Layer 3 - fine detail flowing
        v = v + sin(p.x * 4.1 + p.y * 3.2 + t * 1.5) * 0.15;
        v = v + cos(p.x * 3.5 - p.y * 4.0 - t * 1.3) * 0.12;
        // Layer 4 - very fine shimmer
        v = v + sin(p.x * 6.0 + t * 2.0) * cos(p.y * 5.5 - t * 1.8) * 0.08;
        return v * 0.5 + 0.5;
      }
      
      vec3 diskColor(float r, float temp) {
        float t = clamp((r - DISK_INNER) / (DISK_OUTER - DISK_INNER), 0.0, 1.0);
        
        vec3 hot = vec3(1.4, 1.4, 1.3);
        vec3 warm = vec3(1.3, 1.0, 0.5);
        vec3 mid = vec3(1.2, 0.65, 0.2);
        vec3 cool = vec3(0.9, 0.3, 0.1);
        
        vec3 c;
        if (t < 0.33) {
          c = mix(hot, warm, t * 3.0);
        } else if (t < 0.66) {
          c = mix(warm, mid, (t - 0.33) * 3.0);
        } else {
          c = mix(mid, cool, (t - 0.66) * 3.0);
        }
        
        return c + vec3(0.3, 0.2, 0.1) * temp;
      }
      
      vec4 sampleDisk(vec3 pos, vec3 vel) {
        float r = sqrt(pos.x * pos.x + pos.z * pos.z);
        
        if (r < DISK_INNER || r > DISK_OUTER) {
          return vec4(0.0);
        }
        
        float angle = atan(pos.z, pos.x);
        
        // Very fast orbital rotation - inner orbits much faster (Keplerian)
        float orbSpeed = 1.0 / (r * sqrt(r));
        float phase = angle - u_time * orbSpeed * 25.0;
        
        // Normalized radius for gradients
        float rNorm = (r - DISK_INNER) / (DISK_OUTER - DISK_INNER);
        
        // Dynamic turbulence using smooth sine-based function
        vec2 diskUV = vec2(phase * 2.0, r * 0.8);
        
        // Smooth flowing turbulence - no grid artifacts
        float turb = smoothTurb(diskUV, u_time * 1.5) * 0.8;
        float turb2 = smoothTurb(diskUV * 1.5 + vec2(3.14, 1.57), u_time * 2.0) * 0.4;
        turb = turb + turb2 - 0.6;
        
        // Prominent spiral arms that rotate rapidly with the disk
        float spiralPhase = phase * 2.5 + r * 2.8;
        float spiralArm = sin(spiralPhase);
        spiralArm = spiralArm * 0.5 + 0.5;
        spiralArm = pow(spiralArm, 1.2) * 0.6;
        
        // Secondary spiral structure - faster
        float spiral2 = sin(phase * 5.0 - r * 2.0 + u_time * 1.5);
        spiral2 = max(0.0, spiral2) * 0.35;
        
        // Bright clumps and hotspots that orbit rapidly
        float clumpPhase = angle - u_time * 3.5 / sqrt(r);
        float hotspot = sin(clumpPhase * 8.0 + r * 4.0) * 0.5 + 0.5;
        hotspot = pow(hotspot, 5.0) * 0.5;
        
        // Strong flickering brightness variation
        float flicker = sin(u_time * 6.0 + r * 8.0) * 0.15 + 1.0;
        
        // Radial brightness profile - hotter inner edge
        float brightness = pow(DISK_INNER / r, 1.8);
        float innerFade = smoothstep(DISK_INNER, DISK_INNER * 1.2, r);
        float outerFade = smoothstep(DISK_OUTER, DISK_OUTER * 0.7, r);
        
        // Strong Doppler effect for visible rotation
        float vOrb = 0.5 / sqrt(r);
        float orbitDirX = -pos.z;
        float orbitDirZ = pos.x;
        float orbitLen = sqrt(orbitDirX * orbitDirX + orbitDirZ * orbitDirZ);
        orbitDirX = orbitDirX / max(orbitLen, 0.001);
        orbitDirZ = orbitDirZ / max(orbitLen, 0.001);
        
        float velLen = sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
        float velNormX = vel.x / max(velLen, 0.001);
        float velNormZ = vel.z / max(velLen, 0.001);
        
        float dopplerDot = orbitDirX * velNormX + orbitDirZ * velNormZ;
        float doppler = clamp(1.0 + 2.5 * dopplerDot * vOrb, 0.2, 3.0);
        doppler = doppler * doppler * doppler;
        
        float intensity = brightness * innerFade * outerFade * doppler * flicker;
        intensity = intensity * (0.6 + turb + spiralArm + spiral2 + hotspot);
        
        // Color shifts with temperature/activity
        float tempVar = hotspot + turb * 0.3;
        
        return vec4(diskColor(r, tempVar) * intensity * 3.5, 1.0);
      }
      
      ${
        quality.jetEnabled
          ? `
      vec4 sampleJet(vec3 pos) {
        float absY = abs(pos.y);
        if (absY < 0.6 || absY > 12.0) return vec4(0.0);
        
        float r = sqrt(pos.x * pos.x + pos.z * pos.z);
        float jetRadius = 0.15 + 0.08 * sqrt(absY);
        float radialFall = exp(-r * r / (jetRadius * jetRadius * 3.0));
        
        if (radialFall < 0.02) return vec4(0.0);
        
        float core = exp(-r * r / (jetRadius * jetRadius * 0.3));
        float baseFade = smoothstep(0.6, 2.5, absY);
        float tipFade = smoothstep(12.0, 6.0, absY);
        
        float wave1 = sin(absY * 0.8 - u_time * 4.0) * 0.5 + 0.5;
        float wave2 = sin(absY * 0.4 - u_time * 2.8) * 0.5 + 0.5;
        float smoothWave = wave1 * 0.7 + wave2 * 0.3;
        
        float density = radialFall * baseFade * tipFade * (0.5 + 0.4 * smoothWave);
        
        vec3 baseColor = vec3(0.35, 0.25, 0.6);
        vec3 coreColor = vec3(0.7, 0.85, 1.0);
        vec3 color = mix(baseColor, coreColor, core * core + smoothWave * 0.2);
        
        return vec4(color, density * 0.6);
      }
      `
          : ""
      }
      
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
        
        float camDist = 11.0;
        float orbitAngle = u_time * 0.25;
        
        float cI = cos(INCLINATION);
        float sI = sin(INCLINATION);
        float cO = cos(orbitAngle);
        float sO = sin(orbitAngle);
        
        float camX = sO * cI * camDist;
        float camY = sI * camDist;
        float camZ = cO * cI * camDist;
        
        float invCamDist = 1.0 / camDist;
        float fwdX = -camX * invCamDist;
        float fwdY = -camY * invCamDist;
        float fwdZ = -camZ * invCamDist;
        
        float rightX = cO;
        float rightY = 0.0;
        float rightZ = -sO;
        
        float upX = rightY * fwdZ - rightZ * fwdY;
        float upY = rightZ * fwdX - rightX * fwdZ;
        float upZ = rightX * fwdY - rightY * fwdX;
        
        float upLen = sqrt(upX * upX + upY * upY + upZ * upZ);
        upX = upX / max(upLen, 0.001);
        upY = upY / max(upLen, 0.001);
        upZ = upZ / max(upLen, 0.001);
        
        float rdX = fwdX + uv.x * rightX + uv.y * upX;
        float rdY = fwdY + uv.x * rightY + uv.y * upY;
        float rdZ = fwdZ + uv.x * rightZ + uv.y * upZ;
        
        float rdLen = sqrt(rdX * rdX + rdY * rdY + rdZ * rdZ);
        rdX = rdX / rdLen;
        rdY = rdY / rdLen;
        rdZ = rdZ / rdLen;
        
        float posX = camX;
        float posY = camY;
        float posZ = camZ;
        float velX = rdX;
        float velY = rdY;
        float velZ = rdZ;
        
        vec3 color = vec3(0.0);
        float alpha = 0.0;
        int diskHits = 0;
        float prevY = posY;
        float stepSize = ADAPTIVE_STEP;
        
        for (int i = 0; i < MAX_STEPS; i++) {
          float r = sqrt(posX * posX + posY * posY + posZ * posZ);
          
          if (r < RS) {
            color = mix(color, vec3(0.0), 1.0 - alpha);
            alpha = 1.0;
            break;
          }
          
          if (r > 30.0) {
            float starVal = hash(vec2(rdX * 400.0 + rdY * 200.0, rdZ * 300.0));
            starVal = pow(starVal, 35.0) * 0.3;
            color = color + vec3(starVal) * (1.0 - alpha);
            break;
          }
          
          float cx = posY * velZ - posZ * velY;
          float cy = posZ * velX - posX * velZ;
          float cz = posX * velY - posY * velX;
          float h2 = cx * cx + cy * cy + cz * cz;
          
          float rInv = 1.0 / r;
          float rHatX = posX * rInv;
          float rHatY = posY * rInv;
          float rHatZ = posZ * rInv;
          float accel = 1.5 * RS * h2 * rInv * rInv * rInv * rInv;
          
          velX = velX - rHatX * accel * stepSize;
          velY = velY - rHatY * accel * stepSize;
          velZ = velZ - rHatZ * accel * stepSize;
          
          float velLen = sqrt(velX * velX + velY * velY + velZ * velZ);
          velX = velX / max(velLen, 0.001);
          velY = velY / max(velLen, 0.001);
          velZ = velZ / max(velLen, 0.001);
          
          stepSize = ADAPTIVE_STEP + 0.06 * smoothstep(RS * 2.0, RS * 8.0, r);
          
          float newPosX = posX + velX * stepSize;
          float newPosY = posY + velY * stepSize;
          float newPosZ = posZ + velZ * stepSize;
          
          if (prevY * newPosY < -0.0001 && diskHits < ${quality.diskSamples}) {
            float t = abs(prevY) / (abs(prevY) + abs(newPosY));
            vec3 hitPos = vec3(
              posX + velX * stepSize * t,
              0.0,
              posZ + velZ * stepSize * t
            );
            
            vec4 diskSample = sampleDisk(hitPos, vec3(velX, velY, velZ));
            if (diskSample.a > 0.0) {
              diskHits = diskHits + 1;
              float contribution = diskSample.a * (1.0 - alpha) * 0.9;
              color = color + diskSample.rgb * contribution;
              alpha = alpha + contribution * 0.7;
            }
          }
          
          ${
            quality.jetEnabled
              ? `
          vec4 jetSample = sampleJet(vec3(posX, posY, posZ));
          if (jetSample.a > 0.01) {
            float a = jetSample.a * 0.008 * (1.0 - alpha);
            color = color + jetSample.rgb * a;
            alpha = alpha + a * 0.2;
          }
          `
              : ""
          }
          
          float prDist = abs(r - RS * 1.5);
          float prPulse = 0.7 + 0.3 * sin(u_time * 4.0 + atan(posZ, posX) * 4.0);
          float prGlow = exp(-prDist * prDist * 100.0) * 0.25 * prPulse * (1.0 - alpha);
          color = color + vec3(1.0, 0.9, 0.7) * prGlow;
          
          prevY = newPosY;
          posX = newPosX;
          posY = newPosY;
          posZ = newPosZ;
          
          if (alpha > 0.95) break;
        }
        
        float rayClosest = -camX * rdX - camY * rdY - camZ * rdZ;
        if (rayClosest > 0.0) {
          float cpX = camX + rdX * rayClosest;
          float cpY = camY + rdY * rayClosest;
          float cpZ = camZ + rdZ * rayClosest;
          float closestR = sqrt(cpX * cpX + cpY * cpY + cpZ * cpZ);
          float erDist = closestR - RS * 2.6;
          float einsteinRing = exp(-erDist * erDist * 70.0);
          color = color + vec3(1.0, 0.8, 0.5) * einsteinRing * 0.4 * (1.0 - alpha * 0.7);
        }
        
        ${
          quality.bloomEnabled
            ? `
        float lum = dot(color, vec3(0.299, 0.587, 0.114));
        float bloomMult = smoothstep(0.6, 2.0, lum) * 0.2;
        color = color + color * bloomMult;
        `
            : ""
        }
        
        color.x = (color.x * (2.51 * color.x + 0.03)) / (color.x * (2.43 * color.x + 0.59) + 0.14);
        color.y = (color.y * (2.51 * color.y + 0.03)) / (color.y * (2.43 * color.y + 0.59) + 0.14);
        color.z = (color.z * (2.51 * color.z + 0.03)) / (color.z * (2.43 * color.z + 0.59) + 0.14);
        
        color = pow(clamp(color, 0.0, 1.0), vec3(0.4545));
        
        float vigDist = length(uv);
        color = color * (0.92 + 0.08 * (1.0 - smoothstep(0.5, 1.4, vigDist)));
        
        ${fragColorVar} = vec4(color, 1.0);
      }
    `

    function compileShader(source: string, type: number): WebGLShader | null {
      const shader = glContext!.createShader(type)
      if (!shader) {
        console.error("[v0] Failed to create shader")
        return null
      }
      glContext!.shaderSource(shader, source)
      glContext!.compileShader(shader)
      if (!glContext!.getShaderParameter(shader, glContext!.COMPILE_STATUS)) {
        const error = glContext!.getShaderInfoLog(shader)
        console.error("[v0] Shader compile error:", error)
        setShaderError(error?.substring(0, 500) || "Unknown shader error")
        return null
      }
      return shader
    }

    const vertexShader = compileShader(vertexShaderSource, glContext.VERTEX_SHADER)
    const fragmentShader = compileShader(fragmentShaderSource, glContext.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) {
      return
    }

    const shaderProgram = glContext.createProgram()
    if (!shaderProgram) {
      setWebglError(true)
      return
    }
    glContext.attachShader(shaderProgram, vertexShader)
    glContext.attachShader(shaderProgram, fragmentShader)
    glContext.linkProgram(shaderProgram)

    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
      const error = glContext.getProgramInfoLog(shaderProgram)
      console.error("[v0] Program link error:", error)
      setShaderError(error?.substring(0, 500) || "Program link failed")
      return
    }

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = glContext.createBuffer()
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer)
    glContext.bufferData(glContext.ARRAY_BUFFER, positions, glContext.STATIC_DRAW)

    const positionLoc = glContext.getAttribLocation(shaderProgram, "a_position")
    glContext.enableVertexAttribArray(positionLoc)
    glContext.vertexAttribPointer(positionLoc, 2, glContext.FLOAT, false, 0, 0)

    const timeLoc = glContext.getUniformLocation(shaderProgram, "u_time")
    const resolutionLoc = glContext.getUniformLocation(shaderProgram, "u_resolution")

    const activateProgram = glContext["useProgram"].bind(glContext)
    activateProgram(shaderProgram)

    let resizeTimeout: NodeJS.Timeout
    function resize() {
      if (!canvas) return
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const dpr = Math.min(window.devicePixelRatio * quality.pixelRatio, 2.5)
        canvas.width = Math.floor(window.innerWidth * dpr)
        canvas.height = Math.floor(window.innerHeight * dpr)
        canvas.style.width = window.innerWidth + "px"
        canvas.style.height = window.innerHeight + "px"
        glContext!.viewport(0, 0, canvas.width, canvas.height)
      }, 150)
    }

    resize()
    window.addEventListener("resize", resize)

    let isVisible = true
    function handleVisibilityChange() {
      isVisible = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    const startTime = performance.now()
    let animationId: number
    let lastFrameTime = 0
    const frameInterval = 1000 / quality.targetFPS

    function render(currentTime: number) {
      animationId = requestAnimationFrame(render)

      if (!isVisible || contextLost) return

      const elapsed = currentTime - lastFrameTime
      if (elapsed < frameInterval) return

      lastFrameTime = currentTime - (elapsed % frameInterval)

      const time = (performance.now() - startTime) / 1000

      glContext!.uniform1f(timeLoc, time)
      glContext!.uniform2f(resolutionLoc, canvas!.width, canvas!.height)
      glContext!.drawArrays(glContext!.TRIANGLE_STRIP, 0, 4)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearTimeout(resizeTimeout)
      cancelAnimationFrame(animationId)
    }
  }, [])

  if (shaderError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center px-6 max-w-lg">
          <div className="text-white/90 text-lg mb-4">Visualization Error</div>
          <div className="text-white/60 text-sm mb-4">The graphics shader failed to compile on your device.</div>
          <details className="text-left">
            <summary className="text-white/70 text-xs cursor-pointer mb-2">Technical Details</summary>
            <pre className="text-white/50 text-xs overflow-auto max-h-32 p-2 bg-white/5 rounded">{shaderError}</pre>
          </details>
        </div>
      </div>
    )
  }

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center px-6 max-w-md">
          <div className="text-white/90 text-lg mb-4">Graphics Not Supported</div>
          <div className="text-white/60 text-sm">This visualization requires WebGL. Please use a modern browser.</div>
        </div>
      </div>
    )
  }

  return <canvas ref={canvasRef} className="w-full h-full block" style={{ background: "#000" }} />
}
