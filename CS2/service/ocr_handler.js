const amqp = require("amqplib");
const ocr = require("../utils/ocr");
const connectRabbitMQ = require("../config/rabbitmq");

const queueName = "ocr_queue";
const nextQueue = "translate_queue";

const connectAndConsume = async () => {
  try {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName}...`);
    await channel.prefetch(1);

    channel.consume(queueName, async (msg) => {
      const path = msg.content.toString();
      // console.log(`Received message: ${path}`);

      try {
        const startTime = Date.now();
        const ocrText = await ocr.image2text(path);

        // Send the result to the next queue (translate_queue)
        await channel.assertQueue(nextQueue, { durable: true });
        const sendingData = {
          text: ocrText,
          path: path,
          timestamp: startTime,
        };
        channel.sendToQueue(
          nextQueue,
          Buffer.from(JSON.stringify(sendingData)),
          { persistent: true }
        );

        channel.ack(msg);
      } catch (error) {
        console.error("Something wrong with the path!");
      }
    });
  } catch (error) {
    console.error("Error in OCR worker:", error);
  }
};

connectAndConsume();
