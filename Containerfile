# Build: bundle the bot into a single file so the runtime image needs no node_modules.
FROM docker.io/oven/bun:1-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts
COPY tsconfig.json ./
COPY src ./src
RUN bun run build

FROM docker.io/oven/bun:1-alpine
WORKDIR /app
COPY --from=build /app/dist ./
# The data directory must exist and belong to the bun user, so a new named volume is created with that owner.
RUN mkdir -p /data && chown bun:bun /data
USER bun
ENV NODE_ENV=production \
    DATABASE_PATH=/data/basura.sqlite \
    PORT=8080
VOLUME /data
STOPSIGNAL SIGTERM
CMD ["bun", "index.js"]
