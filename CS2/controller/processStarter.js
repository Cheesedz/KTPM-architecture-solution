const amqp = require('amqplib');

const sendToQueue = async (queueName, message) => {
    try {
      console.log(`Sending message to queue: ${message}`); // Debug log
  
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, { durable: true });
  
      // Ensure message is valid
      if (typeof message !== 'string' || !message) {
        throw new Error('Invalid message');
      }
  
      channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
      console.log(`Message sent to ${queueName}:`, message);
  
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
module.exports = { sendToQueue }