const { getChannel } = require('../config/rabbitmq');

const consumeQueue = async (queueName, taskHandler) => {
  const channel = getChannel();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log('Message received:', content);

      await taskHandler(content);

      channel.ack(msg);
    }
  });
};

module.exports = { consumeQueue };
