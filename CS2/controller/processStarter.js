const amqp = require("amqplib");

const sendToQueue = async (queueName, message) => {
  try {
    console.log(`Sending message to queue: ${JSON.stringify(message)}`);

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    if (typeof message !== "object" || !message) {
      throw new Error("Invalid message");
    }

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message sent to ${queueName}:`, message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = { sendToQueue };
