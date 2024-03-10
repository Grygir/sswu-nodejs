#!/bin/sh

npx sequelize-cli db:create --env development
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
node index.js
