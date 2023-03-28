# syntax=docker/dockerfile:1

FROM node:18

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .
EXPOSE 80
CMD [ "npm", "start" ]