FROM node:20-alpine

WORKDIR /homework-13

COPY package*.json ./
COPY src ./src/
COPY index.js ./
COPY swagger.json ./

RUN npm ci

EXPOSE 8080

CMD ["node", "index.js"]
