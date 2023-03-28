# syntax=docker/dockerfile:1

FROM node:18

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . ./
RUN npm run build

# production env
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]