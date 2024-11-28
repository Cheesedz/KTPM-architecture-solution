const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@1fc7-42-118-50-140.ngrok-free.app');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
};
