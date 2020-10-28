// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

// Tells node that we are creating an "express" server app
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routers
// The below points the server to a series of "route" files
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API routes - GET
app.get("/api/notes", function (req, res) {
    let db = require("./db/db.json");
    res.json(db);
});

// API routes - POST
app.post("/api/notes", function (req, res) {
    let db = require("./db/db.json");
    let newNote = req.body;
    // A unique ID will be assigned to a new note
    newNote.id = uuid.v1();
    db.push(newNote);
    db = JSON.stringify(db);
    fs.writeFileSync("./db/db.json", db, "utf-8", (err) => {
        if (err) throw err;
        console.log("Note created sucessfully!");
    })
    res.json(db);
});

// API routes - DELETE
app.get("/api/notes/:id", function (req, res) {
    let db = require("./db/db.json");
    let id = req.params.id;
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            db.splice(i, 1);
            db = JSON.stringify(db);
            fs.writeFileSync("./db/db.json", db, "utf-8", (err) => {
                if (err) throw err;
                console.log("Note removed sucessfully!");
            });
        };
    };
    res.send(JSON.parse(db));
});


// Listener
// The below code effectively "starts" our server
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});
