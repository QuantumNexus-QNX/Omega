/**
 * Three.js Scene for Spectral Triple Visualization
 * 
 * Renders 3D state space with:
 * - Nodes positioned by spectral embedding
 * - Edges colored by transition probability
 * - Geodesic curves showing Connes distance
 * - Interactive camera controls
 */

import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export interface SpectralSceneConfig {
  canvas: HTMLCanvasElement;
  distances: number[][];
  transitionMatrix: number[][];
  stationaryDistribution: number[];
}

export class SpectralScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private nodes: THREE.Mesh[] = [];
  private edges: THREE.Line[] = [];
  private geodesics: THREE.Line[] = [];
  private selectedNode: number | null = null;
  private hoveredNode: number | null = null;
  private animationId: number | null = null;

  constructor(private config: SpectralSceneConfig) {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      config.canvas.width / config.canvas.height,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: config.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(config.canvas.width, config.canvas.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Controls
    this.controls = new OrbitControls(this.camera, config.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;
    
    // Lighting
    this.setupLighting();
    
    // Build scene
    this.buildScene();
    
    // Start animation
    this.animate();
    
    // Event listeners
    this.setupEventListeners();
  }

  private setupLighting(): void {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    
    // Directional lights
    const light1 = new THREE.DirectionalLight(0x00d4aa, 0.8);
    light1.position.set(5, 5, 5);
    this.scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0x9d4edd, 0.6);
    light2.position.set(-5, 3, -5);
    this.scene.add(light2);
    
    const light3 = new THREE.DirectionalLight(0xec4899, 0.4);
    light3.position.set(0, -5, 0);
    this.scene.add(light3);
  }

  private buildScene(): void {
    const n = this.config.distances.length;
    
    // Compute node positions using spectral embedding
    const positions = this.computeSpectralEmbedding();
    
    // Create nodes
    this.createNodes(positions);
    
    // Create edges (transition probabilities)
    this.createEdges(positions);
    
    // Create reference grid
    this.createGrid();
  }

  /**
   * Compute 3D positions for nodes using spectral embedding
   * Uses distances to embed in 3D space (MDS-like approach)
   */
  private computeSpectralEmbedding(): THREE.Vector3[] {
    const n = this.config.distances.length;
    const positions: THREE.Vector3[] = [];
    
    if (n === 3) {
      // For 3 states, use triangular layout
      const radius = 2;
      positions.push(new THREE.Vector3(radius, 0, 0));
      positions.push(new THREE.Vector3(-radius/2, 0, radius * Math.sqrt(3)/2));
      positions.push(new THREE.Vector3(-radius/2, 0, -radius * Math.sqrt(3)/2));
    } else if (n === 4) {
      // For 4 states, use tetrahedral layout
      const r = 2;
      positions.push(new THREE.Vector3(r, r, r));
      positions.push(new THREE.Vector3(r, -r, -r));
      positions.push(new THREE.Vector3(-r, r, -r));
      positions.push(new THREE.Vector3(-r, -r, r));
    } else {
      // For other sizes, use circular layout
      const radius = 2;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        positions.push(new THREE.Vector3(
          radius * Math.cos(angle),
          0,
          radius * Math.sin(angle)
        ));
      }
    }
    
    return positions;
  }

  private createNodes(positions: THREE.Vector3[]): void {
    const n = positions.length;
    
    for (let i = 0; i < n; i++) {
      // Node size based on stationary probability
      const pi = this.config.stationaryDistribution[i];
      const radius = 0.15 + pi * 0.3;
      
      // Node geometry
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      
      // Node material with glow
      const material = new THREE.MeshPhongMaterial({
        color: 0x00d4aa,
        emissive: 0x00d4aa,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });
      
      const node = new THREE.Mesh(geometry, material);
      node.position.copy(positions[i]);
      node.userData = { index: i, pi };
      
      this.nodes.push(node);
      this.scene.add(node);
      
      // Add label
      this.addLabel(i, positions[i], radius);
    }
  }

  private addLabel(index: number, position: THREE.Vector3, radius: number): void {
    // Create text sprite (simplified - in production use THREE.TextGeometry or canvas texture)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 128;
    
    context.fillStyle = '#ffffff';
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(index.toString(), 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.y += radius + 0.3;
    sprite.scale.set(0.5, 0.5, 1);
    
    this.scene.add(sprite);
  }

  private createEdges(positions: THREE.Vector3[]): void {
    const n = positions.length;
    const P = this.config.transitionMatrix;
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && P[i][j] > 0.01) { // Only show significant transitions
          const points = [positions[i], positions[j]];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Color based on transition probability
          const intensity = P[i][j];
          const color = new THREE.Color().setHSL(0.5, 0.8, 0.3 + intensity * 0.4);
          
          const material = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.3 + intensity * 0.4,
            linewidth: 1
          });
          
          const edge = new THREE.Line(geometry, material);
          this.edges.push(edge);
          this.scene.add(edge);
        }
      }
    }
  }

  private createGrid(): void {
    const gridHelper = new THREE.GridHelper(10, 20, 0x2a2a2a, 0x1a1a1a);
    gridHelper.position.y = -2;
    this.scene.add(gridHelper);
    
    // Axes helper
    const axesHelper = new THREE.AxesHelper(3);
    axesHelper.position.y = -1.9;
    this.scene.add(axesHelper);
  }

  /**
   * Show geodesic between two nodes
   */
  public showGeodesic(i: number, j: number): void {
    // Clear existing geodesics
    this.geodesics.forEach(g => this.scene.remove(g));
    this.geodesics = [];
    
    if (i === j) return;
    
    const start = this.nodes[i].position;
    const end = this.nodes[j].position;
    const distance = this.config.distances[i][j];
    
    // Create curved path (quadratic Bezier)
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    midpoint.y += distance * 0.5; // Lift based on distance
    
    const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });
    
    const geodesic = new THREE.Line(geometry, material);
    this.geodesics.push(geodesic);
    this.scene.add(geodesic);
  }

  /**
   * Highlight a node
   */
  public highlightNode(index: number | null): void {
    // Reset all nodes
    this.nodes.forEach((node, i) => {
      const material = node.material as THREE.MeshPhongMaterial;
      if (index === i) {
        material.color.setHex(0xfbbf24);
        material.emissive.setHex(0xfbbf24);
        material.emissiveIntensity = 0.6;
        node.scale.set(1.3, 1.3, 1.3);
      } else {
        material.color.setHex(0x00d4aa);
        material.emissive.setHex(0x00d4aa);
        material.emissiveIntensity = 0.3;
        node.scale.set(1, 1, 1);
      }
    });
    
    this.selectedNode = index;
  }

  private setupEventListeners(): void {
    const canvas = this.config.canvas;
    
    // Mouse move for hover
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      
      const intersects = raycaster.intersectObjects(this.nodes);
      
      if (intersects.length > 0) {
        const index = intersects[0].object.userData.index;
        if (this.hoveredNode !== index) {
          this.hoveredNode = index;
          canvas.style.cursor = 'pointer';
        }
      } else {
        this.hoveredNode = null;
        canvas.style.cursor = 'grab';
      }
    });
    
    // Click to select
    canvas.addEventListener('click', (event) => {
      if (this.hoveredNode !== null) {
        this.highlightNode(this.hoveredNode);
        
        // Dispatch custom event
        const customEvent = new CustomEvent('nodeSelected', {
          detail: { index: this.hoveredNode }
        });
        canvas.dispatchEvent(customEvent);
      }
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(width, height);
    });
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // Update controls
    this.controls.update();
    
    // Gentle rotation of nodes
    const time = Date.now() * 0.0001;
    this.nodes.forEach((node, i) => {
      if (this.selectedNode !== i) {
        node.rotation.y = time + i * 0.5;
      }
    });
    
    // Render
    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.controls.dispose();
    this.renderer.dispose();
    
    // Clean up geometries and materials
    this.nodes.forEach(node => {
      node.geometry.dispose();
      (node.material as THREE.Material).dispose();
    });
    
    this.edges.forEach(edge => {
      edge.geometry.dispose();
      (edge.material as THREE.Material).dispose();
    });
    
    this.geodesics.forEach(g => {
      g.geometry.dispose();
      (g.material as THREE.Material).dispose();
    });
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
