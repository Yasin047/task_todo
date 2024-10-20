require("./config/database");
require("dotenv").config();
const Todo = require("./models/todo.model");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/get-todo", async (req, res) => {
  const getTodos = await Todo.find();
  res.status(200).json(getTodos);
});

app.post("/save-todo", (req, res) => {
  const { title, description, status } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the field!" });
  }
  try {
    const newTodo = new Todo({
      title,
      description,
      status,
    });
    newTodo.save();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    success: true,
    message: "Todo is created successfully...",
  });
});

app.post("/update-todo", async (req, res) => {
  const { title, description, _id } = req.body;

  const todo = await Todo.findOne({ _id });

  if (!todo) {
    return res
      .status(400)
      .json({ success: false, message: "Todo is not Found!" });
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id },
    {
      $set: {
        title,
        description,
      },
    }
  );
  if (updatedTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo Updated Successfully!",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  }
});
app.post("/delete-todo", async (req, res) => {
  const { _id } = req.body;
  const todo = await Todo.findOne({ _id });

  if (!todo)
    return res
      .status(400)
      .json({ success: false, message: "Todo is not Found!" });

  const deleteTodo = await Todo.findOneAndDelete({ _id });
  if (deleteTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo deleted Successfully!",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  }
});

app.post("/mark-todo", async (req, res) => {
  const { _id } = req.body;
  const todo = await Todo.findOne({ _id });

  if (!todo)
    return res
      .status(400)
      .json({ success: false, message: "Todo is not Found!" });

  const markTodo = await Todo.findOneAndUpdate(
    { _id },
    {
      $set: {
        status: true,
      },
    }
  );
  if (markTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo mark Successfully!",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  }
});
app.post("/unmark-todo", async (req, res) => {
  const { _id } = req.body;
  const todo = await Todo.findOne({ _id });

  if (!todo)
    return res
      .status(400)
      .json({ success: false, message: "Todo is not Found!" });

  const unmarkTodo = await Todo.findOneAndUpdate(
    { _id },
    {
      $set: {
        status: false,
      },
    }
  );
  if (unmarkTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo unmark Successfully!",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  }
});

app.post("/search", async (req, res) => {
  if (!req.body.title) {
    res.status(404).json({
      message: "Input is missing",
    });
  }
  try {
    const record = await Todo.find({
      title: { $regex: `^${req.body.title}`, $options: "i" },
    });
    if (!record) {
      return res.status(404).json({ message: "Record not Found" });
    } else {
      return res.status(200).json(record);
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/ascend-sort", async (req, res) => {
  try {
    const ascending = await Todo.find({}).sort({ title: 1 });
    if (!ascending) {
      return res.status(404).json({ message: "Something is wrong!" });
    } else {
      return res.status(200).json(ascending);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/descend-sort", async (req, res) => {
  try {
    const descending = await Todo.find({}).sort({ title: -1 });

    if (!descending) {
      return res.status(404).json({ message: "Something is wrong!" });
    } else {
      return res.status(200).json(descending);
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/", (req, res) => {
  res.json({ message: "Server is Running..." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port:${PORT}`);
});
