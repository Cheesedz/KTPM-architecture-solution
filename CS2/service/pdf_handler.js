const { createPDF } = require("../utils/pdf");
const connectRabbitMQ = require("../config/rabbitmq");

const queueName = "pdf_queue";

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

      const fileName = receivedData.path.split("/")[1];
      // Process the PDF creation task
      const rs = await createPDF(receivedData.text, fileName);
      console.log(
        `Process time for ${fileName}: ${
          (Date.now() - receivedData.timestamp) / 1000
        }s `
      );
      // Acknowledge the message
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Error in PDF worker:", error);
  }
};

connectAndConsume();
