FROM node:24.21.0-slim
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY src ./src
ENV NODE_ENV=production
CMD ["node", "--import", "tsx", "src/index.ts"]
