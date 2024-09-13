# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app/backend

# Copy the package.json and package-lock.json files for backend
COPY package.json .

# Install backend dependencies
RUN npm install
# RUN npm install -g nodemon

# Copy backend application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]