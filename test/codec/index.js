'use strict';

/**
 *
 * Based on lei-proto
 * https://github.com/leizongmin/node-lei-proto
 *
 */


const DATA_TYPES = [ 'int', 'uint', 'float', 'double', 'string', 'buffer' ];

function NotSupportDataType(parameter, type) {
  const err = new Error('not support type `' + type + '`');
  err.code = 'NOT_SUPPORT_TYPE';
  err.parameter = parameter;
  err.type = type;
  return err;
}

// eslint-disable-next-line
function InvalidDataType(parameter, type) {
  const err = new Error('`' + parameter + '` is not a ' + type);
  err.code = 'INVALID_TYPE';
  err.parameter = parameter;
  err.type = type;
  return err;
}

function InvalidDataSize(parameter, size) {
  const err = new Error('invalid size for `' + parameter + '`');
  err.code = 'INVALID_DATA_SIZE';
  err.parameter = parameter;
  err.size = size;
  return err;
}

function InvalidParameterNameFormat(name) {
  const err = new Error('invalid parameter format `' + name + '`');
  err.code = 'INVALID_PARAMETER_FORMAT';
  err.name = name;
  return err;
}

function InvalidProtocolInfo(msg) {
  const err = new Error('invalid protocol info: ' + msg);
  err.code = 'INVALID_PROTOCOL_INFO';
  err.info = msg;
  return err;
}


/*
  proto = [
    ['a', 'uint', 2, 'be'],
    ['b', 'uint', 4, 'le'],
    ['c', 'buffer', 10],
    ['d', 'string', 5]
  ];

  function encode(a, b, c, d) {
    if (typeof a !== 'number' || isNaN(a)) throw new InvalidDataType('a', 'uint');
    if (typeof a !== 'number' || isNaN(b)) throw new InvalidDataType('b', 'uint');
    if (!Buffer.isBuffer(c)) InvalidDataType('c', 'buffer');
    if (typeof d !== 'string') InvalidDataType('d', 'string');
    var $buf = new Buffer(21);
    $buf.writeUInt16BE(a, 0);
    $buf.writeUInt32LE(b, 2);
    c.copy($buf, 6, 0, 10);
    $buf.write(d, 16, 5);
    return $buf;
  }

  function decode($buf) {
    return {
      a: $buf.readUInt16BE(0),
      b: $buf.readUInt32LE(2),
      c: $buf.slice(6, 16),
      d: $buf.slice(16, 21).toString()
    };
  }

  function encodeEx(data) {
    return encode(data.a, data.b, data.c, data.d);
  }
*/

function generateFunction(encodeSource, encodeExSource, encodeStrictSource, encodeExStrictSource, decodeSource, decodeStrictSource, offset) {
  const proto = {
    // 编码器
    encode: eval(encodeSource),
    // 编码器，参数为一个对象
    encodeEx: eval(encodeExSource),
    // 严格模式的编码器
    encodeStrict: eval(encodeStrictSource),
    // 严格模式的编码器，参数为一个对象
    encodeExStrict: eval(encodeExStrictSource),
    // 解码器
    decode: eval(decodeSource),
    // 严格模式的解码器
    decodeStrict: eval(decodeStrictSource),
     // 数据包长度，如果最后一项是不定长的，则总长度为size+最后一项的长度
    size: offset,
  };
  return proto;
}

function parseProto(list) {
  const encodeArgs = [];
  const encodeCheck = [];
  const encodeBody = [];
  const decodeBody = [];
  let offset = 0;

  list.forEach(function (item, i) {
    if (!Array.isArray(item)) throw new InvalidProtocolInfo('item must be an array');
    if (item.length < 2) throw new InvalidProtocolInfo('missing `name` and `type`');

    const name = String(item[0]);
    const type = String(item[1]).toLowerCase();
    let size = Number(item[2]);
    let bytes = String(item[3]).toUpperCase();

    if (!(size > 0)) size = 0;
    if (bytes !== 'LE') bytes = 'BE';
    if (type === 'float') size = 4;
    if (type === 'double') size = 8;

    if (!/^[a-zA-Z_]/.test(name)) throw new InvalidParameterNameFormat(name);
    if (encodeArgs.indexOf(name) !== -1) throw new InvalidParameterNameFormat(name);

    if (DATA_TYPES.indexOf(type) === -1) throw new NotSupportDataType(name, type);

    if (type === 'string' || type === 'buffer') {
      if (size < 1 && i < list.length - 1) {
        throw new InvalidDataSize(name, size);
      }
    } else if (size < 1) {
      throw new InvalidDataSize(name, size);
    }

    encodeArgs.push(name);
    switch (type) {
    case 'int':
      encodeCheck.push('if (typeof a !== "number" || isNaN(' + name + ')) throw new InvalidDataType("' + name + '", "' + type + '");');
      if (size === 1) {
        encodeBody.push('$buf.writeUInt8(' + name + ', ' + offset + ');');
        decodeBody.push(name + ': $buf.readUInt8(' + offset + ')');
      } else if (size === 2) {
        encodeBody.push('$buf.writeInt16' + bytes + '(' + name + ', ' + offset + ');');
        decodeBody.push(name + ': $buf.readInt16' + bytes + '(' + offset + ')');
      } else if (size === 4) {
        encodeBody.push('$buf.writeInt32' + bytes + '(' + name + ', ' + offset + ');');
        decodeBody.push(name + ': $buf.readInt32' + bytes + '(' + offset + ')');
      } else {
        encodeBody.push('$buf.writeInt' + bytes + '(' + name + ', ' + offset + ', ' + size + ');');
        decodeBody.push(name + ': $buf.readInt' + bytes + '(' + offset + ', ' + size + ')');
      }
      break;
    case 'uint':
      encodeCheck.push('if (typeof a !== "number" || isNaN(' + name + ')) throw new InvalidDataType("' + name + '", "' + type + '");');
      if (size === 1) {
        encodeBody.push('$buf.writeUInt8(' + name + ', ' + offset + ');');
        decodeBody.push(name + ': $buf.readUInt8(' + offset + ')');
      } else if (size === 2) {
        encodeBody.push('$buf.writeUInt16' + bytes + '(' + name + ', ' + offset + ');');
        decodeBody.push(name + ': $buf.readUInt16' + bytes + '(' + offset + ')');
      } else if (size === 4) {
        encodeBody.push('$buf.writeUInt32' + bytes + '(' + name + ', ' + offset + ');');
        decodeBody.push(name + ': $buf.readUInt32' + bytes + '(' + offset + ')');
      } else {
        encodeBody.push('$buf.writeUInt' + bytes + '(' + name + ', ' + offset + ', ' + size + ');');
        decodeBody.push(name + ': $buf.readUInt' + bytes + '(' + offset + ', ' + size + ')');
      }
      break;
    case 'float':
      encodeCheck.push('if (typeof a !== "number" || isNaN(' + name + ')) throw new InvalidDataType("' + name + '", "' + type + '");');
      encodeBody.push('$buf.writeFloat' + bytes + '(' + name + ', ' + offset + ');');
      decodeBody.push(name + ': $buf.readFloat' + bytes + '(' + offset + ')');
      break;
    case 'double':
      encodeCheck.push('if (typeof a !== "number" || isNaN(' + name + ')) throw new InvalidDataType("' + name + '", "' + type + '");');
      encodeBody.push('$buf.writeDouble' + bytes + '(' + name + ', ' + offset + ');');
      decodeBody.push(name + ': $buf.readDouble' + bytes + '(' + offset + ')');
      break;
    case 'string':
      encodeCheck.push('if (typeof ' + name + ' !== "string") throw new InvalidDataType("' + name + '", "' + type + '");');
      if (size > 0) {
        encodeBody.push('new Buffer(' + name + ').copy($buf, ' + offset + ', 0, ' + size + ')');
        decodeBody.push(name + ': $buf.slice(' + offset + ', ' + (offset + size) + ').toString()');
      } else {
        encodeBody.push('new Buffer(' + name + ').copy($buf, ' + offset + ', 0)');
        decodeBody.push(name + ': $buf.slice(' + offset + ').toString()');
      }
      break;
    case 'buffer':
      encodeCheck.push('if (!Buffer.isBuffer(' + name + ')) throw new InvalidDataType("' + name + '", "' + type + '");');
      if (size > 0) {
        encodeBody.push(name + '.copy($buf, ' + offset + ', 0, ' + size + ')');
        decodeBody.push(name + ': $buf.slice(' + offset + ', ' + (offset + size) + ')');
      } else {
        encodeBody.push(name + '.copy($buf, ' + offset + ', 0)');
        decodeBody.push(name + ': $buf.slice(' + offset + ')');
      }
      break;
    default:
      throw new NotSupportDataType(name, type);
    }

    offset += size;
  });

  const lastItemType = String(list[list.length - 1][1]).toLowerCase();
  let lastItemSize = Number(list[list.length - 1][2]);
  if (lastItemType === 'float') lastItemSize = 4;
  if (lastItemType === 'double') lastItemSize = 8;
  const lastItemName = list[list.length - 1][0];
  const encodeSource = '(function (' + encodeArgs.join(', ') + ') {\n' +
                     'var $buf = new Buffer(' + (lastItemSize > 0 ? offset : offset + ' + ' + lastItemName + '.length') + ')\n' +
                     encodeBody.join('\n') + '\n' +
                     'return $buf;\n' +
                     '})';
  const encodeStrictSource = '(function (' + encodeArgs.join(', ') + ') {\n' +
                     encodeCheck.join('\n') + '\n' +
                     'var $buf = new Buffer(' + (lastItemSize > 0 ? offset : offset + ' + ' + lastItemName + '.length') + ')\n' +
                     encodeBody.join('\n') + '\n' +
                     'return $buf;\n' +
                     '})';
  const encodeExSource = '(function (data) {\n' +
                       'return proto.encode(' + encodeArgs.map(function (n) { return 'data.' + n; }).join(', ') + ');\n' +
                       '})';
  const encodeExStrictSource = '(function (data) {\n' +
                       'return proto.encodeStrict(' + encodeArgs.map(function (n) { return 'data.' + n; }).join(', ') + ');\n' +
                       '})';
  const decodeSource = '(function ($buf) {\n' +
                     'return {\n' +
                     decodeBody.join(',\n') + '\n' +
                     '};\n' +
                     '})';
  const decodeStrictSource = '(function ($buf) {\n' +
                     'if ($buf.length < ' + offset + ') throw new IncorrectBufferSize(' + offset + ', $buf.length);\n' +
                     'return {\n' +
                     decodeBody.join(',\n') + '\n' +
                     '};\n' +
                     '})';

  return generateFunction(encodeSource, encodeExSource, encodeStrictSource, encodeExStrictSource, decodeSource, decodeStrictSource, offset);
}

/*
var ret = parseProto([
  ['a', 'int', 1],
  ['b', 'int', 2],
  ['c', 'int', 3],
  ['d', 'int', 4],
  ['e', 'uint', 1],
  ['f', 'uint', 2],
  ['g', 'uint', 3],
  ['h', 'uint', 4],
  ['i', 'float'],
  ['j', 'double'],
  ['k', 'string', 30],
  ['l', 'buffer', 10]
]);
console.log(ret.encode.toString());
console.log(ret.decode.toString());

var b = ret.encode(1, 2, 3, 4, 5, 6, 7, 8, 9.5, 10.10, '今天的天气真好', new Buffer('xxxx2xxxx2xxxx0'));
console.log(b);
console.log(new Buffer('xxxx2xxxx2xxxx0'))

var c = ret.decode(b);
console.log(c);

var c = ret.decode(b.slice(0, -1));
console.log(c);
*/

module.exports = parseProto;
