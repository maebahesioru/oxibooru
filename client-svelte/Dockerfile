FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build && npm prune --omit=dev

FROM node:22-slim AS release
WORKDIR /app
ENV NODE_ENV=production PORT=3000 BODY_SIZE_LIMIT=8G NODE_OPTIONS=--dns-result-order=ipv4first
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "build"]
