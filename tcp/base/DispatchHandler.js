const proto = require('../proto');
const Codec = require('./Codec');

class DispatchHandler {
  constructor(socket) {
    this.socket = socket;
    this.map = {};
  }


  decode(data) {
    let { body, head } = proto;
    let cmd = data.readUInt8(3)
    console.log(cmd);
    let ret;

    Object.keys(body).forEach(key => {
      let p = body[key].data.d;
      let targetCmd = String(body[key].cmd);
      if(targetCmd == cmd) {
        return ret = Codec.decode(data,p);
      }
    })
    console.log(ret);
    return ret;
  }

  encode() {

  }

  init(socket) {
    this.socket = socket;
  }

  use(data) {
    data = Buffer.from(data);
    var structData = this.decode(data);
    console.log(structData);
    // this.socket.data = structData
    // var handler = this.map[structData.cmd];
    // handler && handler(this.socket);
  }

  route(message,fn) {
    this.map[message] = fn;
  }
}


module.exports = DispatchHandler;
