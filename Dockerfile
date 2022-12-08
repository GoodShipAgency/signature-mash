FROM node:18-alpine3.16

RUN apk upgrade
RUN apk update
RUN apk add g++ make py3-pip

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY tsconfig.json /app/tsconfig.json
COPY src /app/src
COPY resource /app/resource

RUN yarn install --frozen-lockfile

CMD [ "yarn", "start" ]
