// const ZqBuffer = require('../app/net/base/ZqBuffer');
//
//
// var buf1 = Buffer.from("68 00 10 FF 02 01 00 00 00 00 00 00 00 01 64".split(" ").map(item => "0x" + item))
// var buf2 = Buffer.from("0F 00 01 16 68 00 10 FF 02 01 00 00 00 00 00 00 00 01 64 0F 00 01 16".split(" ").map(item => "0x" + item))
//
//
//
// var zqBuffer = new ZqBuffer(512,1,2,0,3);
//
// zqBuffer.putData(buf1);
// zqBuffer.putData(buf2);
//
//
// zqBuffer.on('data',function(err,data){
//   if(err) return console.log(err);
//   console.log(data);
// })

const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'
  buf1[i] = i + 97;
}

console.log(buf1.toString());
buf1.copy(buf2, 8, 16, 20);

// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
console.log(buf2.toString('ascii', 0, 25));
