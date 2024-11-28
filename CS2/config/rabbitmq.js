const amqp = require('amqplib');

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || '5672';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';

let channel = null;

const connectRabbitMQ = async () => {
  if (channel) return channel; // Return the existing channel if already created

  try {
    const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
    return channel; // Return the created channel
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error.message);
    throw error;
  }
};

module.exports = connectRabbitMQ;
