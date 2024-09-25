import redis from 'redis';


const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

function createHash() {
    const key = 'HolbertonSchools';
    const values = {
        Portland: 50,
        Seattle: 80,
        NewYork: 20,
        Bogota: 20,
        Cali: 40,
        Paris: 2,
    };
    for (const [city, value] of Object.entries(values)) {
        client.hSet(key, city, value, redis.print);
    }
}

function displayHash() {
    const key = 'HolbertonSchools';

    client.hGetAll(key, (err, reply) => {
        if (err) {
            console.log(`Error fetching hash for ${key}: ${err.message}`);
        } else {
            console.log(`Hash for ${key}:`, reply);
        }
    });
}

createHash();
displayHash();