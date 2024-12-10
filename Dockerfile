# Use Node.js 22 as the base image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Run Prisma deploy and generate
RUN npm run prisma:deploy && npm run prisma:generate

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
