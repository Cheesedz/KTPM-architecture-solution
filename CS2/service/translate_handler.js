const { translate } = require("../utils/translate");
const connectRabbitMQ = require("../config/rabbitmq");

const queueName = "translate_queue";
const nextQueue = "pdf_queue";

const connectAndConsume = async () => {
  try {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });
    await channel.prefetch(1);

    console.log(`Waiting for messages in ${queueName}...`);

    channel.consume(queueName, async (msg) => {
      const message = msg.content.toString();

      const receivedData = JSON.parse(message);
      // console.log(`Received message: ${receivedData.text}`);

      // Process the translation task
      const translatedText = await translate(receivedData.text);

      const sendingData = {
        ...receivedData,
        text: translatedText,
      };
      // Send the result to the next queue (pdf_queue)
      await channel.assertQueue(nextQueue, { durable: true });
      channel.sendToQueue(nextQueue, Buffer.from(JSON.stringify(sendingData)), {
        persistent: true,
      });

      // Acknowledge the message
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Error in Translation worker:", error);
  }
};

connectAndConsume();
