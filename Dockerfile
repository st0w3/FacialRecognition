FROM node:current-alpine3.16

WORKDIR /usr/src/smart-brain

COPY ./ ./

RUN npm install

CMD ["/bin/sh"]