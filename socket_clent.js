var net = require('net');
let {Packet} = require('./Packet');
var port = 8096;
var host = '127.0.0.1';
var client= new net.Socket();
//创建socket客户端
// client.setEncoding('binary');


//连接到服务端
client.connect(port,host,function(){

    setInterval(()=>{
        client.write(Buffer.from([0,0]));
    },2000)
 
    setInterval(()=>{
        let eventData = Buffer.from([0,2]);
        //2字节是内容长度
        let length = Buffer.from([0,2]);
        //3个字节是
        let seqNum = Buffer.alloc(3)

        //随意指定内容，这里演示就返回了2个字节的0，对应length的长度2
        var contentData = Buffer.alloc(2)
        contentData.writeInt16BE(0)
        let packet = new Packet(eventData,length,seqNum,contentData)
        console.log("send = "+packet.getdata().toString('hex'))
        client.write(packet.getdata())
    },5000)
    


 //向端口写入数据到达服务端
});

client.on('data',function(data){
    console.log('receive = ' + data.toString("hex"));
 //得到服务端返回来的数据
});

client.on('error',function(error){
//错误出现之后关闭连接
 console.log('error:'+error);
 client.destory();
});

client.on('close',function(){
//正常关闭连接
 console.log('Connection closed');
});
