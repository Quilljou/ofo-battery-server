const EventEmitter = require('events');

// maxFrameLength 这个定义最大帧的长度
// lengthFieldOffset 长度属性的起始指针(偏移量)
// lengthFieldLength 长度属性的长度，即存放数据包长度的变量的的字节所占的长度
// lengthFieldEndOffset 这个是一个快捷属性，是根据lengthFieldOffset和lengthFieldLength计算出来的，即就是起始偏移量+长度=结束偏移量
// lengthAdjustment 这个是一个长度调节值，例如当总长包含头部信息的时候，这个可以是个负数，就比较好实现了
// initialBytesToStrip 这个属性也比较好理解，就是解码后的数据包需要跳过的头部信息的字节数
// failFast 这个和DelimiterBasedFrameDecoder是一致的，就是如果设置成true，当发现解析的数据超过maxFrameLenght就立马报错，否则当整个帧的数据解析完后才报错
// discardingTooLongFrame 这个也是一个导出属性，就是当前编码器的状态，是不是处于丢弃超长帧的状态
// tooLongFrameLength 这个是当出现超长帧的时候，这个超长帧的长度
// bytesToDiscard 这个来定义，当出现超长帧的时候，丢弃的数据的字节数

// 1)若n<m，则表明数据流包含多包数据，从其头部截取n个字节存入临时缓冲区，剩余部分数据依此继续循环处理，直至结束。
//
// 　　2)若n=m，则表明数据流内容恰好是一完整结构数据，直接将其存入临时缓冲区即可。
//
// 　　3)若n>m，则表明数据流内容尚不够构成一完整结构数据，需留待与下一包数据合并后再行处理。
//

class ZqBuffer extends EventEmitter{
  constructor(
    lengthFieldOffset = 0,
    lengthFieldLength = 0,
    lengthAdjustment = 0,
    initialBytesToStrip = 0,
    maxFrameLength = 1024 * 1024 * 1024
  ) {
    super();
    this.maxFrameLength = maxFrameLength;
    this.lengthFieldOffset = lengthFieldOffset;
    this.lengthFieldLength = lengthFieldLength;
    this.lengthAdjustment = lengthAdjustment;
    this.initialBytesToStrip = initialBytesToStrip;
    this._bufferLength = 1024;

    this._buffer = null;
  }

  putData(data) {
    if(typeof data === 'string') {
      data = Buffer.from(data);
    }

    if(!(data instanceof Buffer)) {
      throw new Error('Data must be instance of Buffer or String')
    }

    var dLength = Buffer.byteLength(data);

    if(!data || dLength < this.lengthFieldLength) {
      return null;
    }
    if(dLength > this.maxFrameLength) {
      this.emit('error','Buffer byteLength is greater than maxFrameLength');
      return;
    }
    var idleLength = thi.getIdleLength();
    // data 比缓冲区空闲空间长
    if(dLength > idleLength) {
      this._bufferLength = Math.ceil(dLength / this._bufferLength) * this._bufferLength;
      var tmpBuffer = Buffer.from(this._bufferLength);
      this._buffer.copy(tmpBuffer,0,0,this.getUsedLength());
      this._buffer = tmpBuffer;
    }


    else {

    }
    this.process();
  }

  process() {
    var bodyLengthNum = this._buffer
  }

  getUsedLength() {
    return (this._buffer.length || 0);
  }

  getIdleLength() {
    return this._bufferLength - this.getUsedLength();
  }
}


module.exports = ZqBuffer;


// putData
//
