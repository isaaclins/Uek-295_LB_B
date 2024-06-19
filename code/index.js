//alle kommentäre wurden mit KI erstellt, inklusive die Swagger Dokumentation.
const express = require('express');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const crypto = require('crypto');
const session = require('express-session');
const bodyParser = require('body-parser');

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
const app = express();
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let tasks = [];
fs.readFile('../data/tasks.json', 'utf8', (err, data) => {
    if (err) {
        console.error('error:',err);
        return;
    }
    tasks = JSON.parse(data);
});

const secretKey = crypto.randomBytes(64).toString('hex');
app.use(bodyParser.json());
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

function authenticate(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Authentication required' });
    }
  }
  
  function generateToken() {
    return Math.random().toString(36).substr(2);
  }

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
app.get('/tasks', authenticate,(req, res) => {
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
app.get('/tasks/:id',  authenticate,(req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(task);
});


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
 * 
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
    fs.writeFile('../data/tasks.json', JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('error:', err);
            return res.status(500).json({ error: 'An error occurred while saving the task.' });
        }
        res.status(201).json(newTask);
    });
});

/**
 * 
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
app.put('/tasks/:id',  authenticate,express.json(), (req, res) => {
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
    fs.writeFile('../data/tasks.json', JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('error:', err);
            return res.status(500).json({ error: 'An error occurred while updating the task.' });
        }
        res.json(tasks[taskIndex]);
    });
});

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

app.delete('/tasks/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    fs.writeFile('../data/tasks.json', JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('error:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the task.' });
        }
        res.json(deletedTask);
    });
});



/**
 * @openapi
 * /login:
 *   post:
 *     tags: 
 *      - token
 *     summary: Logs in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
app.post('/login', (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      if (password === 'error') {
        throw new Error('Simulated error in login');
      }
  
      if (password === 'm295') {
        const token = generateToken();
        req.session.user = { username: username, token: token };
        res.json({ message: 'Login successful', username: username, token: token });
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      console.error(`Error in login endpoint: ${err.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

/**
 * @openapi
 * /verify:
 *   get:
 *     tags: 
 *      - token
 *     summary: Verifies the session token
 *     responses:
 *       200:
 *         description: Token is still usable
 *       403:
 *         description: Forbidden, Authentication required
 *       500:
 *         description: Internal Server Error
 */
app.get('/verify', authenticate, (req, res, next) => {
  try {
    res.json({ token: req.session.user.token, message: 'Token is still usable' });
  } catch (err) {
    console.error(`Error in verify endpoint: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /logout:
 *   delete:
 *     tags: 
 *      - token
 *     summary: Logs out the current user
 *     responses:
 *       204:
 *         description: Logout successful
 *       403:
 *         description: Forbidden, Authentication required
 *       500:
 *         description: Internal Server Error
 *
 */
app.delete('/logout', authenticate, (req, res, next) => {
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

  
  app.use((req, res) => {
    res.status(404).json({ Error: 'Site Not found' });
  });

app.listen(3000, () => {
    console.log('Server lauft uf port 3000');
});