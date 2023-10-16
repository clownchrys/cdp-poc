ARG BUILD_ENV
ARG APP_ROOT=/app

# ENV STAGE
FROM node:lts-buster as env_stage
ARG APP_ROOT
WORKDIR ${APP_ROOT}
COPY ./package.json ./package.json
RUN yarn config set "strict-ssl" false && yarn install

# SOURCE STAGE
FROM env_stage as dev
# Use volume, instead of copy source code

FROM env_stage as prod
COPY . .
ONBUILD RUN yarn build

# RUN STAGE
FROM ${BUILD_ENV}
CMD yarn start
