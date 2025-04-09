# entrypoint.sh
#!/bin/sh

echo "Corriendo el fakin sequelize que no quiere instalarse a menos de que sea de amnera global el hdspm"
npm install -g sequelize-cli

echo "🛠 Corriendo migraciones..."
npx sequelize-cli db:migrate

echo " 🌱 Poblando la base de datos..."
npx sequelize-cli db:seed:all

echo "🚀 Levantando servidor..."
npm run dev