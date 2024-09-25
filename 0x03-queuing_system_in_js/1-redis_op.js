import redis from 'redis';

const client = redis.createClient();
client.on('connect', () => {
    console.log('Redis client connected to the server');
});
client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});
function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, reply) => {
        if (err) {
            console.log(`Error fetching value for ${schoolName}: ${err.message}`);
        }
        else {
            console.log(`Value for ${schoolName}: ${reply}`);
        }
    });

}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
