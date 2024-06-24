FROM node:alpine3.19

WORKDIR /var/service

COPY dist dist
COPY config config
COPY node_modules node_modules
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm i

EXPOSE 3000

CMD [ "node", "dist/application/main" ]