import kue from 'kue';


const queue = kue.createQueue();

const jobData = {
    phoneNumber: '123-456-7890',
    message: 'Hello, this is a notification message!',
};

const job = queue.create('push_notification_code', jobData)
    .save((err) => {
        if (!err) {
            console.log(`Notification job created: ${job.id}`);
        }
    });

job.on('complete', () => {
    console.log('Notification job completed');
});

job.on('failed', (errorMessage) => {
    console.log(`Notification job failed: ${errorMessage}`);
});
