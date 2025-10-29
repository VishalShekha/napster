# ---- Base image ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy application source
COPY . .

# Expose backend port (change if needed)
EXPOSE 5000

# Default environment
ENV NODE_ENV=production

# Start the app
CMD ["node", "src/index.js"]
