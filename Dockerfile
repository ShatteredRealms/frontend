FROM node:22-alpine As builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY . .
RUN pnpm run build

FROM nginx:1.27.4-alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
