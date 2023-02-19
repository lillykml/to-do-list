// Imports
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

// Set-Ups
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB");

// List Items Schema
const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

// Lists Schema
const listSchema = { name: String, listItems: [itemsSchema]};
const List = mongoose.model("List", listSchema);

// Home Route
app.get("/", function (req, res) {

    Item.find(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render("list", { listTitle: "Today", newListItems: items });
        }
    })
});

app.get("/:listName", (req, res) => {

    const listName = _.capitalize(req.params.listName);

    List.findOne({name: listName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({name: listName, items: []});
                list.save();
                res.redirect("/" + listName);
            } else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.listItems});
            }
        }
    })
})

app.post("/", function (req, res) {

    const newItemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item(({name: newItemName}));

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.listItems.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
});

// Delte an Item from the List when the checkbox is ticked
app.post("/delete", (req, res) => {
    const checkedItemID = req.body.checkBox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemID, (err) => {
            err ? console.log(err) : console.log("Successfully removed item");
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull: {listItems: {_id: checkedItemID}}}, 
            function(err, foundList) {
                if(!err) {
                    res.redirect("/" + listName);
                }
        });
    }
})


app.listen(3000, function () {
  console.log("Server started listening on Port 3000");
});