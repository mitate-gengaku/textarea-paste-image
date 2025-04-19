FROM node:22.14.0-bullseye

USER root

RUN npm i -g npm@latest vercel@latest

COPY ./app /home/node/app
RUN chown -R node:node /home/node/app

RUN groupmod -g 1000 node && usermod -u 1000 -g 1000 node

# RUN npx playwright install-deps
# RUN npx playwright install

USER node
WORKDIR /home/node/app