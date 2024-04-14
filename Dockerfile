FROM oven/bun:1.1.3-alpine as base

FROM base as build
WORKDIR /usr/app

COPY . .

RUN bun install --frozen-lockfile
RUN bun run build

FROM base as runtime
WORKDIR /usr/app

ENV NODE_ENV production

COPY --from=build /usr/app/dist /usr/app/dist
COPY --from=build /usr/app/templates /usr/app/templates
COPY --from=build /usr/app/bun.lockb /usr/app/bun.lockb
COPY --from=build /usr/app/package.json /usr/app/package.json

RUN bun install --production

CMD ["bun", "start"]
