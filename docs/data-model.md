# QuickNotes Data Model

## 1. Overview

QuickNotes needs a database to store users, their notes, and tags used to organize notes. This design uses a relational database such as PostgreSQL because the data has clear relationships and requires reliable transactions.

## 2. Database tables

### Users table

Stores account information.

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### Notes table

Stores notes created by users.

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key referencing users(id) |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | Can be empty |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Tags table

Stores tag names.

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(50) | UNIQUE, NOT NULL |

### Note_tags table

Connects notes to tags. A note can have multiple tags, and a tag can belong to multiple notes.

| Column | Type | Constraints |
|---|---|---|
| note_id | INTEGER | Foreign key referencing notes(id) |
| tag_id | INTEGER | Foreign key referencing tags(id) |

The combination of `note_id` and `tag_id` is the composite primary key.

## 3. Relationships

- One user can own many notes.
- One note belongs to one user.
- Notes and tags have a many-to-many relationship through `note_tags`.
- Foreign keys help prevent references to nonexistent users, notes, or tags.

## 4. SQL schema

```sql
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

## 5. Example queries

Retrieve a user's notes, newest first:

```sql
SELECT id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC;
```

Search notes by title:

```sql
SELECT id, title
FROM notes
WHERE title ILIKE '%study%';
```

Find notes with their tags:

```sql
SELECT n.title, t.name AS tag
FROM notes n
JOIN note_tags nt ON nt.note_id = n.id
JOIN tags t ON t.id = nt.tag_id
WHERE n.user_id = 1;
```

## 6. Indexing

Create an index on `notes.user_id` to speed up queries that retrieve notes belonging to a user.

```sql
CREATE INDEX idx_notes_user_id ON notes(user_id);
```

For larger collections, a search index may also help with searches across note titles and bodies.

## 7. SQL versus NoSQL

A relational SQL database is a good starting choice because users, notes, and tags have clear relationships. SQL supports foreign keys, constraints, joins, and transactions, which help maintain data integrity.

A NoSQL database could be useful if the application later needs a flexible document structure or a different scaling strategy. The choice should depend on measured workload and requirements rather than assuming one database is always faster.