const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare exchange
    await channel.assertExchange('events', 'topic', { durable: true });
    console.log('RabbitMQ exchange declared');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
};

const publishEvent = async (eventType, data) => {
  try {
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    });
    
    await channel.publish('events', eventType, Buffer.from(message));
    console.log(`Event published: ${eventType}`);
  } catch (error) {
    console.error('Failed to publish event:', error);
  }
};

module.exports = { connectRabbitMQ, publishEvent };
