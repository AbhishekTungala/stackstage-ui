# Multi-stage build for production-optimized Node.js backend
FROM node:18-alpine AS base

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S stackstage -u 1001

# Install only runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    tini

WORKDIR /app

# Copy built application and dependencies
COPY --from=build --chown=stackstage:nodejs /app/dist ./dist
COPY --from=build --chown=stackstage:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=stackstage:nodejs /app/package*.json ./

# Copy any static assets if needed
COPY --from=build --chown=stackstage:nodejs /app/client/dist ./client/dist

# Security: Use non-root user
USER stackstage

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { \
        process.exit(res.statusCode === 200 ? 0 : 1) \
    }).on('error', () => process.exit(1))"

# Expose port
EXPOSE 5000

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "dist/index.js"]

# Docker build args and labels
ARG BUILD_VERSION
ARG BUILD_DATE
ARG GIT_COMMIT

LABEL maintainer="StackStage Team" \
      version="${BUILD_VERSION}" \
      build-date="${BUILD_DATE}" \
      git-commit="${GIT_COMMIT}" \
      description="StackStage AI-Powered Multi-Cloud Analytics Platform Backend"