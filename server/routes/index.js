const conversations = require('./conversations');
const messages = require('./messages');

const constructorMethod = (app) => {
    app.use("/conversations", conversations);
    app.use("/messages", messages);
}

module.exports = constructorMethod;