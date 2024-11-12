FROM --platform=linux/amd64 node:22.11.0-alpine3.20
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . ./
RUN npm run build-ci
WORKDIR /opt/app/packages/zero-cache
EXPOSE 4848
ENTRYPOINT ["/bin/sh", "-c"]
ENV ZERO_LOG_LEVEL=debug
ENV ZERO_LOG_FORMAT=json
CMD ["npx tsx ./src/server/main.ts"]
