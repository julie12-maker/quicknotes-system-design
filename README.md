# QuickNotes System Design

## Description

QuickNotes is a simple web application that demonstrates how to retrieve, create, and delete notes using HTTP requests and a test API.

The project uses HTML, CSS, and JavaScript. It connects to JSONPlaceholder to demonstrate GET, POST, and DELETE requests, loading and error messages, input validation, and safe display of user-provided text.

**Important:** JSONPlaceholder is a testing service. Creating and deleting notes are simulated and are not permanently saved on its server.

## Features

- Load up to 10 notes using a GET request.
- Create a note using a POST request.
- Delete a note using a DELETE request.
- Validate required titles and limit titles to 100 characters.
- Display loading, success, error, and empty states.
- Disable buttons while relevant requests are in progress.
- Display note content safely using `textContent`.

## Technologies

- HTML5
- CSS3
- JavaScript (Fetch API and async/await)
- JSONPlaceholder test API
- Markdown documentation
- SQL and PostgreSQL database design concepts

## How to run the API client

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the VS Code Live Server extension.
4. Click **Load notes** to retrieve sample notes.
5. Use the form to create a note and the Delete buttons to remove notes from the current page.

An internet connection is required to contact JSONPlaceholder.

## Documentation

- [API Design](docs/api-design.md) — endpoints, response codes, validation, and error handling.
- [Data Model](docs/data-model.md) — database tables, relationships, SQL schema, and queries.
- [System Architecture](docs/architecture.md) — components, request flows, scaling, and reliability.

## What I learned

1. How to use the Fetch API with `async` and `await` to make HTTP requests.
2. How to handle HTTP errors and display loading, success, and error messages.
3. How to validate form input and safely display text with `textContent`.
4. How relational database tables use primary keys, foreign keys, and indexes.
5. How load balancers, caches, replicas, and background workers can support a scalable web system.
6. Why testing APIs and designing a production system are different tasks.

## Future improvements

- Connect to a backend API with persistent storage.
- Add user registration, login, and authorization.
- Allow notes to be edited and searched.
- Add automated tests and deployment instructions.
