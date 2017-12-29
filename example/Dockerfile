FROM node:8.9-alpine
WORKDIR /app/

ADD package.json yarn.lock /app/
RUN yarn install

ADD . /app
RUN yarn build

FROM node:8.9-alpine
WORKDIR /app/

ADD package.json yarn.lock /app/
RUN yarn install --production

ADD . /app/
COPY --from=0 /app/dist /app/dist

ENV NODE_ENV=production
CMD ["./node_modules/.bin/dashbling", "start"]