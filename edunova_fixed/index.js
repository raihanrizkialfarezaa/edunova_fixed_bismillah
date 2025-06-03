const sequelize = require('./db');
const initModels = require('./models/init-models');
const models = initModels(sequelize);

(async () => {
  await sequelize.sync({ alter: false, force: false });
  const users = await models.User.findAll();
  console.log(users);
})();
