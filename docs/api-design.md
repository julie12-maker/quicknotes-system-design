# QuickNotes API Design

This is the contract for the real QuickNotes backend. All requests and responses use JSON over HTTPS. Every endpoint except register and login needs the header `Authorization: Bearer <token>`.

## Endpoints

| # | Method | Path | Description | Success |
|---|--------|------|-------------|---------|
| 1 | POST | `/auth/register` | Create an account. | 201 |
| 2 | POST | `/auth/login` | Log in and receive a token. | 200 |
| 3 | GET | `/notes` | List my notes (supports `?tag=` and `?q=`). | 200 |
| 4 | POST | `/notes` | Create a note. | 201 |
| 5 | GET | `/notes/{id}` | Get one note with its tags. | 200 |
| 6 | PUT | `/notes/{id}` | Update a note's text or category. | 200 |
| 7 | DELETE | `/notes/{id}` | Delete a note. | 204 |
| 8 | POST | `/notes/{id}/tags` | Add a tag to a note. | 201 |
| 9 | DELETE | `/notes/{id}/tags/{tag_id}` | Remove a tag from a note. | 204 |

## Example request bodies

`POST /auth/login`

```json
{ "email": "amina@example.com", "password": "secret123" }
```

`POST /notes`

```json
{ "text": "Buy milk and bread", "category": "personal" }
```

`PUT /notes/42`

```json
{ "text": "Buy milk, bread and eggs", "category": "personal" }
```

`POST /notes/42/tags`

```json
{ "name": "shopping" }
```

## Example success response

`GET /notes/42` returns 200:

```json
{
  "id": 42,
  "text": "Buy milk and bread",
  "category": "personal",
  "tags": ["shopping"],
  "created_at": "2026-10-11T09:30:00Z"
}
```

## Standard error response

Every error uses the same body, so the front end can handle all failures in one place:

```json
{
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "No note with id 42 exists.",
    "status": 404
  }
}
```

## Status codes

- **400 Bad Request:** invalid input, for example text over 200 characters or an empty note.
- **401 Unauthorized:** no token, or the token is invalid or expired.
- **403 Forbidden:** the user is logged in but the note belongs to someone else.
- **404 Not Found:** the note or tag does not exist.
- **409 Conflict:** registering with an email that is already in use.