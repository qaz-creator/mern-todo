const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = express.Router();

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;
let Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

// Connect to mongodb
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`MongoDB Connected...`))
  .catch((err) => console.log(err));

app.use("/todos", todoRoutes);

// endpoint for the main page(delivering all todos items)
todoRoutes.route("/").get(function (req, res) {
  Todo.find(function (err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

// endpoint for retrieving a todo itme by providing an ID
todoRoutes.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Todo.findById(id, function (err, todo) {
    res.json(todo);
  });
});
// endpoint for adding new todo item
todoRoutes.route("/add").post(function (req, res) {
  let todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new todo failed");
    });
});
// endpoint for updating an exist todo item
todoRoutes.route("/update/:id").post(function (req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if (!todo) res.status(404).send("data is not found");
    else todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;

    todo
      .save()
      .then((todo) => {
        res.json("Todo updated!");
      })
      .catch((err) => {
        res.status(400).send("Update not possible");
      });
  });
});

app.listen(PORT, function () {
  console.log(`Server is running on Port:  ${PORT}`);
});
