const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Set-Up Database
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

// Home Route
app.get("/", function (req, res) {

    day = date.getDate();

    Item.find(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render("list", { listTitle: day, newListItems: items });
        }
    })
});

app.post("/", function (req, res) {
    const newItemName = req.body.newItem;
    const newItem = new Item(({name: newItemName}));
    newItem.save();
    res.redirect("/");
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work", newListItems: workItems});
})


app.listen(3000, function () {
  console.log("Server started listening on Port 3000");
});