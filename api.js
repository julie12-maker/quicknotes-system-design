const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.querySelector("#load-btn");
const statusMessage = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitButton = document.querySelector("#submit-btn");

let notes = [];

// Reusable function for making API requests
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    // Some DELETE responses have no body.
    if (response.status === 204) {
        return { data: null, status: response.status };
    }

    const data = await response.json();

    return { data, status: response.status };
}

// Display a status message
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Display notes safely using textContent
function renderNotes() {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes to display.";
        notesList.appendChild(emptyMessage);
        return;
    }

    notes.forEach(function (note) {
        const item = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body || "No body provided.";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id, deleteButton);
        });

        item.appendChild(title);
        item.appendChild(body);
        item.appendChild(deleteButton);
        notesList.appendChild(item);
    });
}

// Task 1: GET - load 10 notes
async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);
        notes = result.data;

        renderNotes();

        if (notes.length === 0) {
            showStatus("No notes were found.", "");
        } else {
            showStatus(`Loaded ${notes.length} notes from the server.`, "success");
        }
    } catch (error) {
        showStatus("Sorry, we could not load notes. Please try again.", "error");
        console.error(error);
    } finally {
        loadButton.disabled = false;
    }
}

// Task 2: POST - create a note
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (title === "") {
        showStatus("Please enter a title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus("The title must be 100 characters or fewer.", "error");
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    showStatus("Creating note...");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        // JSONPlaceholder simulates creation; it does not permanently save the note.
        const newNote = result.data;
        

        notes.unshift(newNote);
        renderNotes();

        showStatus(
            `Note created (status ${result.status}, id ${newNote.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        showStatus("Sorry, we could not create the note. Please try again.", "error");
        console.error(error);
    } finally {
        submitButton.disabled = false;
    }
}

// Task 3: DELETE - delete a note
async function deleteNote(id, button) {
    button.disabled = true;
    showStatus("Deleting note...");

    try {
        await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        notes = notes.filter(function (note) {
            return note.id !== id;
        });

        renderNotes();
        showStatus(`Note ${id} deleted successfully.`, "success");
    } catch (error) {
        showStatus("Sorry, we could not delete the note. Please try again.", "error");
        console.error(error);
        button.disabled = false;
    }
}

// Connect buttons and form to their functions
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);

// Show the initial empty state
renderNotes();
