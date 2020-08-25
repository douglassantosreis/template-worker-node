FROM node:12.16.3-alpine as build

WORKDIR /build

ADD . .

RUN set -x \
    && apk update \
    && npm i \
    && npm run build

FROM node:12.16.3-alpine as runtime

WORKDIR /app

COPY --from=build /build/dist .
COPY --from=build /build/package.json  .
COPY --from=build /build/package-lock.json .

RUN npm i --production

CMD npm start
