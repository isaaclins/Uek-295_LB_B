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

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: 
 *      - tasks
 *     summary: Get a task by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task id
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 done:
 *                   type: boolean
 *                 dueDate:
 *                   type: string
 *             example:
 *               id: 123
 *               title: Another Task
 *               description: This is task 123
 *               done: false
 *               dueDate: "2024-01-31"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Task not found
 */
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(task);
});




// bis linie 64 von 6.2 kopiert.
/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: 
 *      - tasks
 *     summary: Post a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               done:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *             example:
 *               title: Another Task
 *               description: This is task 1
 *               done: false
 *               dueDate: "2024-01-31"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
app.post('/tasks', express.json(), (req, res) => {
    const newTask = req.body;
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (typeof newTask.title !== 'string' || typeof newTask.description !== 'string' || typeof newTask.dueDate !== 'string') {
        return res.status(400).json({ error: 'Invalid field types.' });
    }
    if (typeof newTask.done !== 'boolean') {
        return res.status(400).json({ error: 'Invalid field type for "done".' });
    }
    let id = 1;
    while (tasks.find(task => task.id === id)) {
        id++;
    }
    newTask.id = id;
    tasks.push(newTask);
    fs.writeFile('tasks.json', JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('error:', err);
            return res.status(500).json({ error: 'An error occurred while saving the task.' });
        }
        res.status(201).json(newTask);
    });
});


/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags: 
 *      - tasks
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               done:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *             example:
 *               title: Updated Task
 *               description: This is an updated task
 *               done: true
 *               dueDate: "2024-01-31"
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 done:
 *                   type: boolean
 *                 dueDate:
 *                   type: string
 *             example:
 *               id: 123
 *               title: Updated Task
 *               description: This is an updated task
 *               done: true
 *               dueDate: "2024-01-31"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Task not found
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Missing required fields.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: An error occurred while updating the task.
 */
app.put('/tasks/:id', express.json(), (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    const updatedTask = req.body;
    if (!updatedTask.title || !updatedTask.description || !updatedTask.dueDate) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (typeof updatedTask.title !== 'string' || typeof updatedTask.description !== 'string' || typeof updatedTask.dueDate !== 'string') {
        return res.status(400).json({ error: 'Invalid field types.' });
    }
    if (typeof updatedTask.done !== 'boolean') {
        return res.status(400).json({ error: 'Invalid field type for "done".' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    fs.writeFile('tasks.json', JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('error:', err);
            return res.status(500).json({ error: 'An error occurred while updating the task.' });
        }
        res.json(tasks[taskIndex]);
    });
});


app.listen(3000, () => {
    console.log('Server lauft uf port 3000');
});