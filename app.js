const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const mongoose = require('mongoose');
const service = require('feathers-mongoose');

const Model = require('./Model');

mongoose.Promise = global.Promise;

// Connect to your MongoDB instance(s)
mongoose.connect("mongodb+srv://admin:admin@cluster1-hcdlb.mongodb.net/feathers-rest-api-example?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create an Express compatible Feathers application instance.
const app = express(feathers());

// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable Socket.io services
app.configure(socketio());
// Connect to the db, create and register a Feathers service.
app.use('/messages', service({
    Model,
    lean: true, // set to false if you want Mongoose documents returned
    paginate: {
        default: 2,
        max: 4
    }
}));
app.use(express.errorHandler());

// Create a dummy Message
// app.service('messages').create({
//     text: 'Message created on server'
// }).then(function (message) {
//     console.log('Created message', message);
// });
const appService = app.service("messages");
appService.on("created", (data) => console.log("Nova mensagem cridada\n", data));
appService.on("removed", (data) => console.log("Mensagem removida\n", data));
appService.on("updated", (data) => console.log("Mensagem atualizada\n", data));
appService.on("patched", (data) => console.log("Mensagem corrigida\n", data));



// Start the server.
const port = 3135;
app.listen(port, () => {
    console.log(`Feathers server listening on port ${port}`);
});