FROM node:20-alpine
WORKDIR /workspace
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY prisma ./prisma
RUN npm install --workspace @molecule/backend --include-workspace-root
COPY apps/backend ./apps/backend
WORKDIR /workspace/apps/backend
EXPOSE 4000
CMD ["npm", "run", "dev"]
