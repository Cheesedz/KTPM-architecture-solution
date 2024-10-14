const amqp = require('amqplib');
const { createPDF } = require("../utils/pdf");

const queueName = 'pdf_queue';

const connectAndConsume = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Waiting for messages in ${queueName}...`);
    
    channel.consume(queueName, async (msg) => {
      const data = msg.content.toString();
      console.log(`Received message: ${data}`);

      // Process the PDF creation task
      await createPDF(data);

      // Acknowledge the message
      channel.ack(msg);
    });
  } catch (error) {
    console.error('Error in PDF worker:', error);
  }
};

connectAndConsume();
