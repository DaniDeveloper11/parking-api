# entrypoint.sh
#!/bin/sh

echo "Sequelize was added"
npm install -g sequelize-cli

echo "DB was created"
npm sequelize-cli db:create

echo "🛠 Runing migrations..."
npx sequelize-cli db:migrate

echo " 🌱 Filling Data Base..."
npx sequelize-cli db:seed:all

echo "----------------------------"

echo "DB TEST was created"
npm sequelize-cli db:create --env test

echo "🛠 Runing migrations TEST..."
npx sequelize-cli db:migrate --env test

echo " 🌱 Filling Data Base TEST..."
npx sequelize-cli db:seed:all --env test

echo "🚀 Server is ready to use..."
npm run dev