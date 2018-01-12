const net = require('net');
const PORT = 2407;
const ZqBuffer = require('./base/ZqBuffer');
const dispatcher = require('./dispatcher');
let count = 0;


const tcpServer = net.createServer((socket) => {
  new Connection(socket);
})
.listen(PORT,() => {
  console.log('TCP SERVER IS LISTENING ON %s', PORT);
})
.on('close',function(){
  console.log('TCP SERVER IS CLOSED');
})



class Connection{
  constructor(socket) {
    this.socket = socket;
    count++;
    console.log('A new client is connected, the connected clients number is %s',count);
    dispatcher.init(socket);
    socket.on('data',this.dataHandler.bind(this));
    socket.on('close',this.closeHandler.bind(this));
  }
  dataHandler(data) {
    // var zqBuffer = new ZqBuffer();
    // zqBuffer.putData(data);
    // zqBuffer.on('data',this.packHandler)
    this.packHandler(data)
  }

  closeHandler() {
    count--;
    console.log('A client is disconnected, the connected clients number is %s',count);
  }

  packHandler(data) {
    dispatcher.use(data);
  }
}



module.exports = tcpServer;
