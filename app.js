const fs = require("fs");
const path = require("path");
const express = require("express");
const { uuid } = require("uuidv4");

var app = express();
var PORT = process.env.PORT || 3000;

var data = fs.readFileSync("db.json");
var notes = JSON.parse(data);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.json(notes);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote.id = uuid();
    notes.push(newNote);
    if (newNote) {
        fs.writeFile("db.json", JSON.stringify(notes, null, 4), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Success!");
        });
        res.json(newNote);
    }
});

app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;

    notes = notes.filter((note) => {
        return note.id != id;
    });

    fs.writeFile("db.json", JSON.stringify(notes, null, 4), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    });
    res.json(notes);
});

app.listen(PORT, function () {
    console.log(`Listening on PORT: ${PORT}`);
});
