# QuickNotes API Design

## 1. Overview

The QuickNotes API client uses the JSONPlaceholder test API to demonstrate how to retrieve, create, and delete notes using HTTP requests.

**Base URL:** `https://jsonplaceholder.typicode.com`

**Resource:** `/posts`

JSONPlaceholder is a testing service. It simulates creating and deleting posts, but changes are not permanently saved on its server.

## 2. Endpoints

### GET — Retrieve notes

- **Endpoint:** `GET /posts?_limit=10`
- **Purpose:** Retrieve up to 10 notes (posts).
- **Success response:** `200 OK`
- **Response format:** JSON array of posts.

Example response:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "Sample note",
    "body": "This is an example note."
  }
]
```

### POST — Create a note

- **Endpoint:** `POST /posts`
- **Purpose:** Submit a new note.
- **Success response:** `201 Created`
- **Content-Type:** `application/json`

Example request body:

```json
{
  "title": "My first note",
  "body": "I am learning APIs.",
  "userId": 1
}
```

The API returns a simulated created post, including an ID. The change is not permanently stored.

### DELETE — Delete a note

- **Endpoint:** `DELETE /posts/{id}`
- **Purpose:** Request deletion of a post by its ID.
- **Typical success response:** `200 OK`

The client removes the note from its local list after a successful response. JSONPlaceholder does not permanently delete the original server record.

## 3. Error handling

The reusable `request()` function checks `response.ok`. If the server returns an unsuccessful HTTP status, it throws an error so the calling function can handle it.

| HTTP status | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `201 Created` | Resource creation was simulated successfully |
| `204 No Content` | Request succeeded without a response body |
| `400 Bad Request` | Request data is invalid |
| `404 Not Found` | Resource could not be found |
| `500 Internal Server Error` | Server encountered an error |

Network failures can also occur if the client cannot reach the server.

The interface displays loading, success, error, and empty-state messages. Buttons are disabled during relevant requests to help prevent repeated submissions.

## 4. Validation and security

- A note title is required.
- Titles cannot exceed 100 characters.
- User-provided note text is displayed with `textContent` to reduce the risk of HTML injection.
- The client checks HTTP responses and catches request errors.

## 5. Future improvements

A production API should use persistent storage, authenticate users, authorize access to individual notes, validate data on the server, apply rate limits, and return consistent error responses.