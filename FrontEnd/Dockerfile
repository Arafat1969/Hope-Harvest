# Use Node.js 18 Alpine as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
