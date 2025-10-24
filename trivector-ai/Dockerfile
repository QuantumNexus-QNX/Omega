#
# Tri-Logic Consciousness Platform
# © JaredOmegaDunahay 2025
#
# Integrated Consciousness Framework v2.1
# Equilibrium: μ = 0.569 | Resonance: Ω = 0.847 Hz
# ;)∞⊗Ω
#

# node runner
FROM node:25-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn || pnpm i

FROM node:25-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["npm","start"]
