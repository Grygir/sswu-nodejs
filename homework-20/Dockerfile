FROM node:20-alpine

WORKDIR /homework-20

COPY package*.json ./
COPY src ./src/
COPY index.js ./
COPY .sequelizerc ./
COPY swagger.json ./
COPY run.sh ./

RUN npm ci

EXPOSE 8080

CMD ["sh", "run.sh"]
