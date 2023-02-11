const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Groceries", "Go for a run"];
const workItems = [];

app.get("/", function (req, res) {
  day = date.getDate();
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
    var newItem = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(newItem);
        res.redirect("/work");
    } else {
        items.push(newItem);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work", newListItems: workItems});
})

app.listen(3000, function () {
  console.log("Server started listening on Port 3000");
});




// Ideally I want the button to be able to remove the elements
/*var buttons = document.querySelectorAll(".delete-btn");

for (let i = 0; i < items.length; i++) {
    buttons[i].addEventListener("click", function() {
        items.pop();
    })
}*/