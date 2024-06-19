const express = require('express');
const fs = require('fs');

const applikation = express();

let tasks = [];
fs.readFile('tasks.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    tasks = JSON.parse(data);
});


applikation.listen(3000, () => {
    console.log('Server lauft uf port 3000');
});