// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

// Tells node that we are creating an "express" server app
const app = express();
let db = require("./db/db.json");

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

// API route - GET
app.get("/api/notes", function (req, res) {
    console.log("/api/notes-get");
    res.json(db);
});

//API route - POST
app.post("/api/notes", function (req, res) {
    let note = req.body;
    note.id = uuid.v1();
    db.push(note);
    logToDB(db);
    return res.json(db);
});


// API route - DELETE
app.delete("/api/notes/:id", function (req, res) {
    let id = req.params.id;
    for (let i = 0; i < db.length; i++) {
        if (id === db[i].id) {
            db.splice(i, 1);
            logToDB(db);
            res.json(db);
        }
    }
});

// Listener
// The below code effectively "starts" our server
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});

//Log into db.json function
function logToDB(array) {
    fs.writeFileSync("./db/db.json", JSON.stringify(array));
}
