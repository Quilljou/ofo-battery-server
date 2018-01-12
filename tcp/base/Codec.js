

// ['start','int',1],
// ['length','int',2],
// ['cmd','int',1],
// ['version','cbcd',1],
// ['equipmentId','cbcd',8],
// ['moduleNum','cbcd',1],
// ['chargeMode','int',1],
// ['stationAddr','cbcd',1],
// ['end','int',1]
var TYPES = {
  uint8: 'UInt8'
};

function decimal2bcd(num1) {
  if (num1 == 0)
  return "00000000";
  else if (num1 == 1)
  return "00000001";
  else if (num1 == 2)
  return "00000010";
  else if (num1 == 3)
  return "00000011";
  else if (num1 == 4)
  return "00000100";
  else if (num1 == 5)
  return "00000101";
  else if (num1 == 6)
  return "00000110";
  else if (num1 == 7)
  return "00000111";
  else if (num1 == 8)
  return "00001000";
  else if (num1 == 9)
  return "00001001";
}

function decimal2cbcd(num1) {
  if (num1 == 0)
  return "0000";
  else if (num1 == 1)
  return "0001";
  else if (num1 == 2)
  return "0010";
  else if (num1 == 3)
  return "0011";
  else if (num1 == 4)
  return "0100";
  else if (num1 == 5)
  return "0101";
  else if (num1 == 6)
  return "0110";
  else if (num1 == 7)
  return "0111";
  else if (num1 == 8)
  return "1000";
  else if (num1 == 9)
  return "1001";
}


function decimal2bcd(num1) {
  //alert(num1);
  if (num1 == '0' || num1 == '00' || num1 == '000' || num1 == '0000')
  return 0;
  else if (num1 == '1' || num1 == '01' || num1 == '001' || num1 == '0001')
  return 1;
  else if (num1 == '10' || num1 == '010' || num1 == '0010')
  return 2;
  else if (num1 == '11' || num1 == '011' || num1 == '0011')
  return 3;
  else if (num1 == '100' || num1 == '0100')
  return 4;
  else if (num1 == '101' || num1 == '0101')
  return 5;
  else if (num1 == '110' || num1 == '0110')
  return 6;
  else if (num1 == '111' || num1 == '0111')
  return 7;
  else if (num1 == 1000)
  return 8;
  else if (num1 == 1001)
  return 9;
}

function decode(data,schema) {
  var obj = {};
  var head = 5;

  data = Buffer.from(data);

  if(!Array.isArray(schema)) {
    return data;
  }


  schema.forEach( item => {
    var key = String(item[0]);
    var type = String(item[1]);
    var length = Number(item[2]);
    var value = 0;
    var fn = function(){};

    switch (type) {
      case 'uint8':
        fn = () => {
          value += data.readUInt8(head);
        }
      break;
      default:
        fn = () => {
          value += data.slice(head,head + length).toString('hex');
        }
    }

    run(length,function(){
      head = head + 1;
      fn()
    })

    obj[key] = value;
  })

  return obj;
}

function run(n,fn) {
  for (let i = 0; i < n; i++) {
    fn();
  }
}


function encode(data,schema) {

}

module.exports = {
  decode,
  encode
};


// var buf = new Buffer(4),
//     num = 0x0c; // 0x0c是整数12的十六进制形式
// buf.fill(); // 清空
//
// buf.writeInt8(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeUInt8(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeInt16BE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeUInt16BE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeInt16LE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeUInt16LE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeInt32BE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeUInt32BE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeInt32LE(num,0);
// console.log(buf); //buf.fill();
//
// buf.writeUInt32LE(num,0);
// console.log(buf); //buf.fill();
