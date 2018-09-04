/*
This one is for post request
{
	"name": "test",
	"rank": "red belt",
	"available": true,
	"loc" : {"type": "Point", "coordinates": [-80, 27]}
}
This one is for get request
http://localhost:3030/ninjas?lng=-80&lat=20
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/gpsTest")
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error(('Could not connect to MongoDB...\n'), err))

const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point",
        index: '2dsphere'
    },
    coordinates: {
        type: [Number]
    }
});

const NinjaSchema = new Schema({
    name: {
        type: String,
    },
    rank: {
        type: String,
    },
    available: {
        type: Boolean,
        default: false
    },
    loc: GeoSchema
})
// NinjaSchema.index({geometry: '2dsphere'});

const Ninja = mongoose.model('ninja', NinjaSchema);

app.post('/ninjas', (req, res) => {
    Ninja.create(req.body).then(ninja => {
        res.send(ninja);
    })
})

app.get('/ninjas', (req, res) => {
    Ninja.find({}).where('loc').nearSphere({center: {
        type: 'Point',
        coordinates : [parseFloat(req.query.lng), parseFloat(req.query.lat)],
        spherical: true
    }}
    ).then(ninjas => {
        res.send(ninjas);
    });
})
app.listen(3030, () => {
    console.log(`listening port: 3030`);
})
