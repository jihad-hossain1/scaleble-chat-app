import { Kafka, Producer } from "kafkajs";
import fs from 'fs';
import path from 'path';
import prisma from "./prisma";

import dotenv from "dotenv";

dotenv.config();

const broker = process.env.KAFKA_BROKER as string;
const userName = process.env.KAFKA_USERNAME as string;
const password = process.env.KAFKA_PASSWORD as string;

const kafka = new Kafka({
  brokers: [broker],

  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },

  sasl: {
    username: userName,
    password: password,
    mechanism: "plain",
  },
});

let producer: null | Producer = null;

export async function createProducer() {
    if (producer) return producer;

    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer
}


export async function producerMessage( message: string) {
    const producer = await createProducer();

   await  producer.send({
        messages: [
            {
                key: `message-${Date.now()}`,
                value: message
            }
        ],
        topic: 'MESSAGES'
    });

    return true
}

export async function startConsumerMessage() {
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'MESSAGES',fromBeginning: true });
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ pause, message }) => {
            if (!message.value) return;
            
            // console.log("new message recieved: ");
           
            try {
                 await prisma.message.create({
                   data: {
                     text: message.value?.toString(),
                   },
                 });
                
            } catch (error) {
                // console.log("something is wrong")
                pause()
                setTimeout(() => {
                    consumer.resume([{ topic: 'MESSAGES'}])
                },60 * 1000)
            }

        },

    });
}

export default kafka;