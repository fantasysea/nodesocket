let EVENTS = require("./config")
var net = require('net');

export class Packet {
    eventData:Buffer = Buffer.alloc(0);
    contentLengthData:Buffer = Buffer.alloc(0);
    seqnumData:Buffer = Buffer.alloc(0);
    contentData:Buffer = Buffer.alloc(0);
    constructor(...args: Buffer[]){
      this.eventData = args[0];
      this.contentLengthData = args[1];
      this.seqnumData = args[2];
      this.contentData = args[3];
    }
    
    getdata(): Buffer {
      return Buffer.concat([this.eventData, this.contentLengthData,this.seqnumData,this.contentData], this.eventData.length+this.contentLengthData.length+this.seqnumData.length+this.contentData.length);
    }

  }