const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const todoModel = require("./model/todoModel");
const app = express();

app.use(express.json());
app.use(cors({origin:'http://localhost:3000'}))
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello Node API");
});


app.post("/create", async (req, res) => {
  try {
    // Assuming the request body includes 'list' and 'image' (binary data)
    const { list, status } = req.body;


    const todo = await todoModel.create({
      list,
      status
    });

    res.status(200).json(todo);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});




app.get("/todo", async (req, res) => {
  try {
    const list = await todoModel.find({});
    console.log(list)
    res.status(200).json({status:200,list:list});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findByIdAndUpdate(id, req.body);
    if (!todo) {
      return res.status(404).json("todo not found");
    }
    const updatedTodo = await todoModel.findById(id);

    res.status(204).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findByIdAndDelete(id, req.body);
    if (!todo) {
      return res.status(404).json("todo not found");
    }
    res.status(204).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://mathewsjacob198pb:mathews191619@cluster0.jkbtton.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3001, () => {
      console.log("Node API is running on port 3001");
    });
  })
  .catch((error) => {
    console.log(error);
  });
