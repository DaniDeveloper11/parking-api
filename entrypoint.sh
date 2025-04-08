# entrypoint.sh
#!/bin/sh

echo "Corriendo el fakin sequelize que no quiere instalarse a menos de que sea de amnera global el hdspm"
npm install -g sequelize-cli

echo "🛠 Corriendo migraciones..."
npx sequelize-cli db:migrate

echo "🚀 Levantando servidor..."
npm run dev