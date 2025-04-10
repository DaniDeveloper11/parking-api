# entrypoint.sh
#!/bin/sh

echo "Sequelize was added"
npm install -g sequelize-cli

echo "🛠 Runing migrations..."
npx sequelize-cli db:migrate

echo " 🌱 Filling Data Base..."
npx sequelize-cli db:seed:all

echo "🚀 Server is ready to use..."
npm run dev