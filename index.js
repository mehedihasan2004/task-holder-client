const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dotpwg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const tasksCollection = client.db("task_holder").collection("tasks");

    app.get("/my-tasks", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email, isCompleted: false };
      const myTasks = await tasksCollection.find(query).toArray();
      res.send(myTasks);
    });

    app.get("/completed-tasks", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email, isCompleted: true };
      const completedTasks = await tasksCollection.find(query).toArray();
      res.send(completedTasks);
    });

    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const tasks = await tasksCollection.insertOne(task);
      res.send(tasks);
    });

    app.put("/my-tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isCompleted: true,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.put("/completed-tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isCompleted: false,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.put("/update-task/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id, req.body);

      // const filter = {_id : ObjectId(id)}
      // const options = {upsert : true}
      // const updateDoc = {
      //   $set : {

      //   }
      // }
    });

    app.delete("/my-tasks/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log("The error is ---->", err));

app.get("/", (req, res) => {
  res.send("The Task Holder is running......................");
});
app.listen(port, () => {
  console.log("The server (Task Holder) is runnig on Port", port);
});
