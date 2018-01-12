const DispatchHandler = require('./base/DispatchHandler');
const testHandler = require('./handler/testHandler');

const dispatcher = new DispatchHandler();


dispatcher.route(0xFF,testHandler.test);


module.exports = dispatcher;
