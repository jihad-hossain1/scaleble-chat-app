import { Server } from "socket.io";

import Redis from "ioredis";
import prisma from "./prisma";
import { producerMessage } from "./kafka";
import dotenv from "dotenv";
dotenv.config();

const host = process.env.REDIS_HOST as string;
const port = process.env.REDIS_PORT as string;
const password = process.env.REDIS_PASSWORD as string;
const useName = process.env.REDIS_USERNAME as string;

const pub = new Redis({
  host: host,
  port: +port,
  username: useName,
  password: password,
});
const sub = new Redis({
  host: host,
  port: +port,
  username: useName,
  password: password,
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log('socket service created')
        this._io = new Server({
            cors: {
                origin: "*",
                allowedHeaders: "*",

            }
        });

        sub.subscribe('MESSAGES')

    }

    public initListener() {
        const io = this.io
        // console.log("init socket listener")


        io.on('connect', (socket) => {
            console.log('new connection id: ', socket.id)

            socket.on('event:message', async ({message}:{message:string}) => {
                // console.log('new message: ', message)
                // io.emit('chat message', msg)

                await pub.publish('MESSAGES', JSON.stringify({message}))
            })

            sub.on("message",async (channel, message) => {
                if (channel === 'MESSAGES') {
                    // const msg = JSON.parse(message)
                    io.emit("message", message);

                    // await prisma.message.create({
                    //     data: {
                    //        text: message
                    //     }
                    // })

                    await producerMessage(message)
                    // console.log('new message: ', message)
                }
            })
            

            socket.on('disconnect', () => {
                console.log('user disconnected')    
            })
        })
    }
    
    get io() {
        return this._io
    }
}

export default SocketService