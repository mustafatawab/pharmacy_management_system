FROM node:22-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

EXPOSE 3000

# Standard dev command
CMD ["npm", "run", "dev"]