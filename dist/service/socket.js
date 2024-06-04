"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const kafka_1 = require("./kafka");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;
const useName = process.env.REDIS_USERNAME;
const pub = new ioredis_1.default({
    host: host,
    port: +port,
    username: useName,
    password: password,
});
const sub = new ioredis_1.default({
    host: host,
    port: +port,
    username: useName,
    password: password,
});
class SocketService {
    constructor() {
        console.log('socket service created');
        this._io = new socket_io_1.Server({
            cors: {
                origin: "*",
                allowedHeaders: "*",
            }
        });
        sub.subscribe('MESSAGES');
    }
    initListener() {
        const io = this.io;
        // console.log("init socket listener")
        io.on('connect', (socket) => {
            console.log('new connection id: ', socket.id);
            socket.on('event:message', (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                // console.log('new message: ', message)
                // io.emit('chat message', msg)
                yield pub.publish('MESSAGES', JSON.stringify({ message }));
            }));
            sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
                if (channel === 'MESSAGES') {
                    // const msg = JSON.parse(message)
                    io.emit("message", message);
                    // await prisma.message.create({
                    //     data: {
                    //        text: message
                    //     }
                    // })
                    yield (0, kafka_1.producerMessage)(message);
                    // console.log('new message: ', message)
                }
            }));
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
