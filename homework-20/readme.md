# Homework-20

## As Docker container
```shell
docker compose up -d
```

## Local run
Install npm packages
```shell
npm i
```

Database setup
```shell
npx sequelize-cli db:create --env development
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start server
```shell
npm start
```

See API documentation [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
