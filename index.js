const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());

const db =  mongoose.connect("mongodb://localhost/gpsTest")
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error(('Could not connect to MongoDB...\n'), err))

const testSchema = new mongoose.Schema({
    name: {
        type: String
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {type: [Number], default: [0,0]}
    }
});
const Test = mongoose.model('tests', testSchema);
Test.create({
    name: "test",
    location: {
        type: "point",
        coordinates: [-123, 123]
    }
});

app.listen(3030, () => {
    console.log(`listening port: 3030`);
})