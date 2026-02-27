FROM node:20-alpine
WORKDIR /workspace
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN npm install --workspace @molecule/frontend --include-workspace-root
COPY apps/frontend ./apps/frontend
WORKDIR /workspace/apps/frontend
EXPOSE 3000
CMD ["npm", "run", "dev"]
