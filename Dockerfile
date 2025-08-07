FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./
COPY public/robots.txt ./robots.txt
COPY public/manifest.webmanifest ./manifest.webmanifest
COPY public/icon-192.png ./icon-192.png
COPY public/icon-512.png ./icon-512.png
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-global.conf /etc/nginx/conf.d/00-global.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/10-security-headers.sh
RUN chmod +x /docker-entrypoint.d/10-security-headers.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


