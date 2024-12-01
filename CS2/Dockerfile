# Stage 1: Build Stage
FROM node:alpine AS builder

# Set environment for building
ENV NODE_ENV=development

# Set up the working directory
WORKDIR /express-docker

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if applicable, e.g., transpile TypeScript or build a frontend)
# RUN npm run build (Optional for build tools like TypeScript)

# Stage 2: Final Stage
FROM node:alpine AS runner

# Set environment for running
ENV NODE_ENV=production

# Set up the working directory
WORKDIR /express-docker

# Copy only the necessary files from the builder stage
COPY --from=builder /express-docker /express-docker

# Install only production dependencies
RUN npm install --omit=optional
# Expose the server port
EXPOSE 3000

# Run multiple commands using a single script
CMD ["sh", "-c", "npm run dev & npm run start:ocr & npm run start:translate & npm run start:pdf"]
