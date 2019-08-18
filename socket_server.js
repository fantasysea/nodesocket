var net = require('net');
let {Stick} = require('./Stick');
let {Packet} = require('./Packet');
let EVENTS = require("./config")
require('console-stamp')(console, '[HH:MM:ss.l]');

var server = net.createServer(function (connection) { //'connection' listener
  console.log('client connected'+connection.remoteAddress);

  connection.on('end', function () {
    console.log('client disconnected');
  });

  let stick = new Stick();

  connection.on('error', function (e) {
    console.log('e = ' + e);
    connection.end();
  });


  //收到数据
  connection.on('data', function (data) {
    //console.log('data = ' + data.toString("hex"));
    stick.putData(data);  
  });
  
  //一个完整的包
  stick.on("packet",data=>{
    console.log('packet data = ' + data.toString("hex"));
    let eventData = Buffer.alloc(2);
    data.copy(eventData, 0, 0, 2);

    let event = parseInt(eventData.toString("hex"), 16)
    console.log("event = " + parseInt(eventData.toString("hex"), 16))

  
    if (event == EVENTS.PING[0]) {
        var a = Buffer.from("0001", "hex")
        console.log('send = ' + a.toString("hex"));
      connection.write(a);
      return;
    }

    if (event == EVENTS.PONG[0]) {
      connection.write(Buffer.from("0000", "hex"));
      return;
    }
    
    //2字节是内容长度
    let length = Buffer.alloc(2);
    //3个字节是
    let seqNum = Buffer.alloc(3);
    data.copy(length, 0, 2, 4);
    data.copy(seqNum, 0, 4, 7);
    console.log("length = " + parseInt(length.toString("hex"), 16))
    console.log("seqnum = " + parseInt(seqNum.toString("hex"), 16))
    if (event == EVENTS.REGISTER[0]) {
        var codeData = Buffer.alloc(2)
        codeData.writeInt16BE(1)
        packet = new Packet(eventData,Buffer.from([0,2]),seqNum,codeData)
        console.log(packet.getdata().toString('hex'))
        connection.write(packet.getdata())
      return;
    }


  });

});

server.listen(8096, function () { //'listening' listenerv
  console.log('server bound');
});

