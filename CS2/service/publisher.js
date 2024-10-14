const { getChannel } = require('../config/rabbitmq');

const publishToQueue = async (queueName, message) => {
  const channel = getChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`Message sent to queue: ${queueName}`);
};

module.exports = { publishToQueue };
