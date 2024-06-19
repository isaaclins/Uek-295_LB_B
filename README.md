# m295_LB_B
Please not that the commit messages cna be seen at https://github.com/isaaclins/m295_LB_B/commits/main/. I do not have the patience to do that in the zip. Excuse me.
## Author
Isaac Lins

## Project Setup

1. Install the project dependencies by running `npm install` in the project root directory.

```sh
npm install
```

2. Start the server by running `node index.js` in the [`code`]("c:\Users\markus\Documents\GitHub\m295_LB_B\code") directory.

```sh
cd code
node index.js
```
OR
```sh
nodemon index.js
```
The server will start and listen on port 3000.

## Runtime

The application is a Node.js server built with Express. It uses `express-session` for session management, `jsonwebtoken` for token generation, `swagger-jsdoc` for API documentation, and `swagger-ui-express` for displaying the API documentation.

## Endpoints

### GET /tasks/:id

This endpoint retrieves a task by its ID. It requires authentication.

### POST /tasks

This endpoint creates a new task. It requires authentication and the following fields in the request body:

- `title`: string
- `description`: string
- `done`: boolean
- `dueDate`: string

### DELETE /logout

This endpoint logs out the current user. It requires authentication.

## API Documentation

The API documentation is generated using Swagger and is available at `/swagger-ui` when the server is running.

## Development Environment

The project uses Node.js and Express. The code is written in JavaScript.

## Dependencies

The project's dependencies are listed in the [package.json](code/package.json) file. They include `express`, `express-session`, `jsonwebtoken`, `swagger-jsdoc`, and `swagger-ui-express`.

## Data

The tasks data is stored in a JSON file located at `data/tasks.json`.

###### Thank you very much and have a nice day.
