TCP粘包分包处理


[http://blog.chinaunix.net/uid-429659-id-5207848.html](http://blog.chinaunix.net/uid-429659-id-5207848.html)
http://morning.work/page/2015-11/nodejs_buffer.html

通信协议

| 起始标识     | 帧长度(不包括包头，帧长度位之后为正文)     | 命令字 | ... |
| :------------- | :------------- |:------------- |:------------- |
| 1Byte       |    2Byte    | 1Byte | ...|


buffer => String  toString('decode type')
String => buffer Buffer.from('','encode type')




socket.on('data')  => 处理粘包，分包 => 完整包 => 解码，struct => 根据命令字分发控制器处理
=> 编码 => socket.write


协议配置文件
