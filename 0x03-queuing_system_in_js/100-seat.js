import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const PORT = 1245;

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


const INITIAL_SEATS = 50;
const AVAILABLE_SEATS_KEY = 'available_seats';
let reservationEnabled = true;

setAsync(AVAILABLE_SEATS_KEY, INITIAL_SEATS);


const queue = kue.createQueue();


app.get('/available_seats', async (req, res) => {
    const availableSeats = await getAsync(AVAILABLE_SEATS_KEY);
    res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: "Reservations are blocked" });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: "Reservation failed" });
        }
        return res.json({ status: "Reservation in process" });
    });
});


app.get('/process', async (req, res) => {
    res.json({ status: "Queue processing" });

    queue.process('reserve_seat', async (job, done) => {
        try {
            const availableSeats = await getAsync(AVAILABLE_SEATS_KEY);
            const newAvailableSeats = availableSeats - 1;

            if (newAvailableSeats < 0) {
                throw new Error('Not enough seats available');
            }

            await setAsync(AVAILABLE_SEATS_KEY, newAvailableSeats);

            if (newAvailableSeats === 0) {
                reservationEnabled = false; // Disable reservations if no seats are left
            }

            done();
        } catch (error) {
            done(new Error(error.message));
        }
    });
});

queue.on('job complete', (id) => {
    console.log(`Seat reservation job ${id} completed`);
});

queue.on('job failed', (id, err) => {
    console.log(`Seat reservation job ${id} failed: ${err.message}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
