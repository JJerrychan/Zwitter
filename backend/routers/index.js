const usersRoutes = require('./usersRoutes');

const constructorMethod = (app) => {
    app.use("/users", usersRoutes);
}

module.exports = constructorMethod;