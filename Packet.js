"use strict";
exports.__esModule = true;
var EVENTS = require("./config");
var net = require('net');
var Packet = /** @class */ (function () {
    function Packet() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.eventData = Buffer.alloc(0);
        this.contentLengthData = Buffer.alloc(0);
        this.seqnumData = Buffer.alloc(0);
        this.contentData = Buffer.alloc(0);
        this.eventData = args[0];
        this.contentLengthData = args[1];
        this.seqnumData = args[2];
        this.contentData = args[3];
    }
    Packet.prototype.getdata = function () {
        return Buffer.concat([this.eventData, this.contentLengthData, this.seqnumData, this.contentData], this.eventData.length + this.contentLengthData.length + this.seqnumData.length + this.contentData.length);
    };
    return Packet;
}());
exports.Packet = Packet;
