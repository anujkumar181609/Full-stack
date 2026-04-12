FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/api/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api/package*.json ./
COPY apps/api/src ./src
USER node
EXPOSE 4000
CMD ["node", "src/index.js"]
