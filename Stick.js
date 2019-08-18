"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var EventEmitter = require('events');
var EVENTS = require("./config");
var net = require('net');
var eventlength = 2;
var contentlength = 2;
var seqnumlength = 3;
var Stick = /** @class */ (function (_super) {
    __extends(Stick, _super);
    function Stick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buffdata = Buffer.alloc(0);
        _this.eventData = Buffer.alloc(0);
        _this.contentLengthData = Buffer.alloc(0);
        _this.seqnumData = Buffer.alloc(0);
        _this.contentData = Buffer.alloc(0);
        return _this;
    }
    Stick.prototype.putData = function (data) {
        this.buffdata = Buffer.concat([this.buffdata, data], this.buffdata.length + data.length);
        while (true) {
            //够不够一个eventlength
            if (this.buffdata.length < eventlength) {
                break;
            }
            this.eventData = Buffer.alloc(eventlength);
            this.buffdata.copy(this.eventData, 0, 0, eventlength);
            var event_1 = parseInt(this.eventData.toString("hex"), 16);
            if (event_1 == EVENTS.PING[0] || event_1 == EVENTS.PONG[0]) {
                this.emit('packet', Buffer.concat([this.eventData], eventlength));
                this.buffdata = this.buffdata.slice(eventlength, this.buffdata.length);
                continue;
            }
            //够不够一个contentlength
            if (this.buffdata.length < eventlength + contentlength) {
                break;
            }
            this.contentLengthData = Buffer.alloc(contentlength);
            this.buffdata.copy(this.contentLengthData, 0, eventlength, eventlength + contentlength);
            //够不够一个seqnumlength
            if (this.buffdata.length < eventlength + contentlength + seqnumlength) {
                break;
            }
            this.seqnumData = Buffer.alloc(seqnumlength);
            this.buffdata.copy(this.seqnumData, 0, eventlength + contentlength, eventlength + contentlength + seqnumlength);
            this.ctlength = parseInt(this.contentLengthData.toString("hex"), 16);
            //够不够一个ctlength
            if (this.buffdata.length < eventlength + contentlength + seqnumlength + this.ctlength) {
                break;
            }
            this.contentData = Buffer.alloc(this.ctlength);
            this.buffdata.copy(this.contentData, 0, eventlength + contentlength + seqnumlength, eventlength + contentlength + seqnumlength + this.ctlength);
            this.emit('packet', Buffer.concat([this.eventData, this.contentLengthData, this.seqnumData, this.contentData], eventlength + contentlength + seqnumlength + this.ctlength));
            this.buffdata = this.buffdata.slice(eventlength + contentlength + seqnumlength + this.ctlength, this.buffdata.length);
        }
    };
    return Stick;
}(EventEmitter));
exports.Stick = Stick;
