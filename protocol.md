架构缺失

session
广播
Channel
Connection

tool
粘包半包处理
编解码
事件分发

编码16进制形式的字符串
Buffer.from(str,'hex');

1. 握手
c => s
68 00 10 FF02   00 00 00 00 00 00 00 01  64  0F 00 01 16
decode

68 固定字段，1Byte, hex
00 10 长度, 2Byte readInt16BE
FF 命令字， 1Byte, hex
02 版本号，1Byte, hex
- [ ]  00 00 00 00 00 00 00 01 设备编号，压缩bcd码，0000 0000 * 7 + 0000 0001 * 1
64 充电接口数量， 1Byte, readInt8
0F 充电模式
- [ ]  00 01 站地址 2Byte readInt16BE
16 结束字符

s => c
回复相同报文
0x 68 00 10 FF02   00 00 00 00 00 00 00 01 64  0F  00 01 16

2. 心跳
68 00 15  0e 02 00 01 00 01 00 00 00 00 00 00 00 00 00 ，00 01 16
c => s
68 固定字段，1Byte, hex
00 15 长度, 2Byte readInt16BE
OE 命令字， 1Byte, hex
02 可变结构限定词 1Byte ?
00 01 传送原因 readInt16BE ？ 2Byte
00 01 仓地址 readInt16BE 2Byte
00 00 00 信息对象地址1 readIntBE(offset,3) 3Byte
00 00 00 00 00 00 00 00 00 信息对象 8Byte
16 结束字符 1Byte hex

s => c
socket.pipe(buffer);

3. 时间同步
s => c
68 00 14  67 02 00 06  00 01 00 10 00 d9 da b 15 78 05 11 16

编码
68 固定字段，1Byte, hex
00 14 长度, 2Byte readInt16BE
67 命令字， 1Byte, hex
02 可变结构限定词 1Byte ?
00 06 传送原因 ？
00 01 仓地址 readInt16BE 2Byte
00 10 00 信息对象地址1 readIntBE(offset,3) 3Byte
d9 da b 15 78 05 11  信息对象 7Byte
16 结束字符 1Byte hex

c => s

4. 远程启动
s=>c
编码
68 固定字段，1Byte, hex
00 14 长度, 2Byte readInt16BE
85 命令字， 1Byte, hex
0B 可变结构限定词 1Byte ?
00 06 传送原因 ？
00 01 仓地址 readInt16BE 2Byte
00 00 00 信息对象地址1 readIntBE(offset,3) 3Byte
- [ ]  00 00 00 00 00 00 00 01 设备编号，压缩bcd码，0000 0000 * 7 + 0000 0001 * 1
00 00 01 信息对象地址2 readIntBE(offset,3) 3Byte
01 充电插槽编号 1Byte readInt8
00 3000 信息对象地址2 readIntBE(offset,3) 3Byte
00 00 00 00 00 00 00 00 用户id 压缩bcd码，0000 0000 * 7 + 0000 0001 * 1
00 3001 信息对象地址3 readIntBE(offset,3) 3Byte
01  BCD码 1字节 hex 00 自动；01 按电量；02 按时间；默认是自动00
003002  信息对象地址4
00 01 01 01  待充电参数(BIN)

响应
c=>s
解码

68 固定字段，1Byte, hex
00 14 长度, 2Byte readInt16BE
82 命令字， 1Byte, hex
00 06 传送原因 ？
00 01 仓地址 readInt16BE 2Byte
00 00 00 信息对象地址1 readIntBE(offset,3) 3Byte
- [ ]  00 00 00 00 00 00 00 01 设备编号，压缩bcd码，0000 0000 * 7 + 0000 0001 * 1
00 00 01 信息对象地址2 readIntBE(offset,3) 3Byte
01 充电插槽编号 1Byte readInt8
00 00 03 信息对象地址2 readIntBE(offset,3) 3Byte
01 充电插槽编号 1Byte readInt8
16个字节  交易流水号（压缩BCD码） 不管成功失败都有数据？
3004 信息对象地址
00 readInt8
16


5. 远程终止
s=>c
编码
68 固定字段，1Byte, hex
00 14 长度, 2Byte readInt16BE
85 命令字， 1Byte, hex
