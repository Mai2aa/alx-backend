import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
    before(() => {
        queue.testMode.enter();
    });

    after(() => {
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw(Error, 'Jobs is not an array');
    });

    it('should create jobs in the queue', () => {
        const jobs = [
            { phoneNumber: '4153518780', message: 'Test message 1' },
            { phoneNumber: '4153518781', message: 'Test message 2' },
        ];

        createPushNotificationsJobs(jobs, queue);

        const queuedJobs = queue.testMode.jobs;

        expect(queuedJobs).to.have.lengthOf(2);
        expect(queuedJobs[0].data).to.deep.equal(jobs[0]);
        expect(queuedJobs[1].data).to.deep.equal(jobs[1]);
    });
});
