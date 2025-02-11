FROM node:18-alpine3.16

RUN apk upgrade && apk update && apk add g++ make py3-pip curl

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY tsconfig.json /app/tsconfig.json
COPY src /app/src
COPY resource /app/resource

RUN yarn install --frozen-lockfile

RUN mkdir /app/tmp

CMD [ "yarn", "start" ]
