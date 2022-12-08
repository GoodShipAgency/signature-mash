FROM node:18-alpine3.15

RUN apk add g++ make py3-pip

WORKDIR /app
COPY package.json /app/package.json
COPY src /app/src

RUN yarn install
CMD [ "yarn", "start" ]
