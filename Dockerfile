# ================================
# PantiCare - Next.js Dockerfile
# ================================

# Base image
FROM node:20-alpine

# Folder kerja di dalam container
WORKDIR /app

# Salin package.json
COPY package.json ./

# Install dependencies
# Project belum memiliki package-lock.json,
# sehingga menggunakan npm install.
RUN npm install

# Salin seluruh source code PantiCare
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Port default Next.js
EXPOSE 3000

# Jalankan aplikasi dalam mode production
CMD ["npm", "start"]
