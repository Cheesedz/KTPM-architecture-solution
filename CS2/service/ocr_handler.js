const amqp = require('amqplib');
const ocr = require('../utils/ocr');

const queueName = 'ocr_queue';
const nextQueue = 'translate_queue';

const connectAndConsume = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Waiting for messages in ${queueName}...`);
    
    channel.consume(queueName, async (msg) => {
      const path = msg.content.toString();
      console.log(`Received message: ${path}`);

      try {
        const ocrText = await ocr.image2text(path);

        // Send the result to the next queue (translate_queue)
        await channel.assertQueue(nextQueue, { durable: true });
        channel.sendToQueue(nextQueue, Buffer.from(ocrText), { persistent: true });

        channel.ack(msg);
      }
      catch (error) {
        console.error('Something wrong with the path!')
      }
    });
  } catch (error) {
    console.error('Error in OCR worker:', error);
  }
};

connectAndConsume();
