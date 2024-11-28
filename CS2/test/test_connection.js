const amqp = require("amqplib");

const testConnection = async () => {
  try {
    console.log("Connecting to RabbitMQ...");
    const connection = await amqp.connect("amqp://localhost");
    console.log("Connected to RabbitMQ successfully");
    connection.close();
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
};

testConnection();
