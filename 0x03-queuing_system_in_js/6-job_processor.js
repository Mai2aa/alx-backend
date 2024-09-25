import kue from 'kue';


const queue = kue.createQueue();


function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done();
});


queue.on('job complete', (id) => {
    console.log(`Job ${id} completed`);
});


queue.on('job failed', (id, err) => {
    console.log(`Job ${id} failed: ${err.message}`);
});
