require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

const rover_ep = 'https://api.nasa.gov/mars-photos/api/v1';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// API calls

app.get('/rovers/:rover_name', async (req, res) => {
    try {
        let rover = await fetch(`
         ${rover_ep}/manifests/${req.params.rover_name}?api_key=${process.env.API_KEY}
         `).then(res =>
                res.json());
        res.send(rover);
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/rover_photos/:rover_name/:max_date', async (req, res) => {
    try {
        let rover_photos = await fetch(
            `${rover_ep}/rovers/${req.params.rover_name}/photos?earth_date=${req.params.max_date}&api_key=${process.env.API_KEY}
        `).then(res => res.json());
        res.send(rover_photos)
    } catch (err) {
        console.log('error: ', err)
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
