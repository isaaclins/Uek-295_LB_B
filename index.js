const express = require('express');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');              // Von 6.2 kopiert.
const swaggerUi = require('swagger-ui-express');            // Von 6.2 kopiert.
const app = express();


                                                            // Von Linie 6 bis 23 von 6.2 kopiert. 
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Isaac's LB B",
            version: '1.0.0',
            description: 'Praktische Prüfung 295',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


let tasks = [];
fs.readFile('tasks.json', 'utf8', (err, data) => {
    if (err) {
        console.error('error:',err);
        return;
    }
    tasks = JSON.parse(data);
});

// bis linie 64 von 6.2 kopiert.
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: 
 *      - tasks
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: 1
 *                   title: Task 1
 *                   description: This is task 1
 *                   done: false
 *                   dueDate: "2024-01-31"
 *                 - id: 2
 *                   title: Task 2
 *                   description: This is task 3
 *                   done: true
 *                   dueDate: "2024-04-26"
 */
app.get('/tasks', (req, res) => {
    res.json(tasks);
});





app.listen(3000, () => {
    console.log('Server lauft uf port 3000');
});