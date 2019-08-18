const EventEmitter = require('events');
let EVENTS = require("./config")
var net = require('net');
let eventlength  = 2;
let contentlength  = 2;
let seqnumlength  = 3;

export class Stick extends EventEmitter {
    buffdata:Buffer = Buffer.alloc(0);
    eventData:Buffer = Buffer.alloc(0);
    contentLengthData:Buffer = Buffer.alloc(0);
    seqnumData:Buffer = Buffer.alloc(0);
    contentData:Buffer = Buffer.alloc(0);
    ctlength;
    putData(data): void {
      this.buffdata = Buffer.concat([this.buffdata, data], this.buffdata.length+data.length);
      while(true){
        //够不够一个eventlength
        if(this.buffdata.length<eventlength){
          break;
        }
        this.eventData = Buffer.alloc(eventlength);
        this.buffdata.copy(this.eventData, 0, 0, eventlength);
        let event = parseInt(this.eventData.toString("hex"), 16)
        //动态head长度,ping pong 不需要这么多内容
        if (event == EVENTS.PING[0]||event == EVENTS.PONG[0]){
          this.emit('packet',Buffer.concat([this.eventData],eventlength));
          this.buffdata = this.buffdata.slice(eventlength,this.buffdata.length);
          continue;
        }
        //够不够一个contentlength
        if(this.buffdata.length<eventlength+contentlength){
          break;
        }
        this.contentLengthData = Buffer.alloc(contentlength);
        this.buffdata.copy(this.contentLengthData, 0, eventlength, eventlength+contentlength);
        
        //够不够一个seqnumlength
        if(this.buffdata.length<eventlength+contentlength+seqnumlength){
          break;
        }
        this.seqnumData = Buffer.alloc(seqnumlength);
        this.buffdata.copy(this.seqnumData, 0, eventlength+contentlength, eventlength+contentlength+seqnumlength);
        
        this.ctlength = parseInt(this.contentLengthData.toString("hex"), 16)
        //够不够一个ctlength
        if(this.buffdata.length<eventlength+contentlength+seqnumlength+this.ctlength){
          break;
        }

        this.contentData = Buffer.alloc(this.ctlength);
        this.buffdata.copy(this.contentData, 0, eventlength+contentlength+seqnumlength, eventlength+contentlength+seqnumlength+this.ctlength);
        this.emit('packet',Buffer.concat([this.eventData,this.contentLengthData,this.seqnumData,this.contentData],eventlength+contentlength+seqnumlength+this.ctlength));
        this.buffdata = this.buffdata.slice(eventlength+contentlength+seqnumlength+this.ctlength,this.buffdata.length);
       
      }
    }
    

  }
