const express = require('express');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');              // Von 6.2 kopiert.
const swaggerUi = require('swagger-ui-express');            // Von 6.2 kopiert.
const app = express();
app.use(express.json());


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
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

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
app.get('/tasks/:id',authenticate, (req, res, next) => {
    try {
      res.json(tasks);
    } catch (err) {
      console.error(`Error listing tasks: ${err.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
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
app.get('/tasks/:id', authenticate, (req, res) => {
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
app.post('/tasks', authenticate, express.json(), (req, res) => {
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
app.put('/tasks/:id', authenticate, express.json(), (req, res) => {
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

// bis linie 64 von 6.2 kopiert.
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: 
 *      - tasks
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
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
 *               title: Deleted Task
 *               description: This is a deleted task
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
 *               error: An error occurred while deleting the task.
 */
app.delete('/tasks/logout', authenticate, (req, res, next) => {
    try {
      req.session.destroy(err => {
        if (err) {
          console.error(`Error destroying session: ${err.message}`);
          return res.sendStatus(500);
        }
        res.sendStatus(204);
      });
    } catch (err) {
      console.error(`Error in logout endpoint: ${err.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



/**
 * @openapi
 * /tasks/login:
 *   post:
 *     tags: 
 *      - tasks
 *     summary: Login to the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzE2MzQ4NzEsImV4cCI6MTYzMTYzODQ3MX0.6y6R1vZzJ8Gz6XJ8wJv0Wz3Jw3pYJ2Z0J6QK9zZ0vKk
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
 *               error: Email and password are required
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Invalid credentials
 */

app.post('/tasks/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password === 'm295') {
        const token = Math.random().toString(36).substring(2);
        res.setHeader('Content-Type', 'application/json');
        res.json({ token });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/tasks/verify', authenticate, (req, res, next) => {
    try {
      res.json({ token: req.session.user.token, message: 'Token is still usable' });
    } catch (err) {
      console.error(`Error in verify endpoint: ${err.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
app.listen(3000, () => {
    console.log('Server lauft uf port 3000');
});