# ---- Stage 1: Build the app ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app with Turbopack
RUN npm run build

# ---- Stage 2: Run the app ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.* ./

# ✅ Copy node_modules for production from builder
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
