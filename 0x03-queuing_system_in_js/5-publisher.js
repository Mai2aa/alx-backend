import redis from 'redis';


const publisher = redis.createClient();

publisher.on('connect', () => {
    console.log('Redis client connected to the server');
});

publisher.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

function publishMessage(message, time) {
    setTimeout(() => {
        console.log(`About to send ${message}`);
        publisher.publish('holberton school channel', message);
    }, time);

}


publishMessage('Hello, World', 3000);
publishMessage('KILL_SERVER', 5000);