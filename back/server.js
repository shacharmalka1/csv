require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const csv = require("csvtojson");
// const path = require("path");
const Agent = require("./models/AgentSheme");
const port = 8080;

app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch(() => {
    console.log("connection to database failed");
  });

app.use(cors());

app.use(async (req, res, next) => {
  const agentsArray = await Agent.find();
  if (agentsArray.length > 0) {
    return next();
  }
  const jsonArray = await csv().fromFile("./assets/agentsList.csv");
  await jsonArray.forEach(async (agent) => {
    await Agent.create({
      name: agent["שם המתווך"],
      city: agent["עיר מגורים"],
      licenseId: agent["מס רשיון"],
    });
  });
  next();
});

app.get("/cities", async (req, res) => {
  const citiesArray = [];
  const agentsArray = await Agent.find();
  agentsArray.forEach((Agent) => {
    if (!citiesArray.includes(Agent.city.trim())) citiesArray.push(Agent.city);
  });
  res.send(citiesArray);
});

app.get("/agents/", async (req, res) => {
  const queryCity = req.query.city;
  const agentsArray = await Agent.find({ city: queryCity });
  res.send(agentsArray);
});

app.put("/agent/:id/edit", async (req, res) => {
  const id = req.params.id;
  const newCity = req.body.city;
  if ((await Agent.findOne({ licenseId: id })) !== null) {
    await Agent.findOneAndUpdate({ licenseId: id }, { city: newCity });
    res.send("user updated");
  } else res.status(404).send("no user found");
});

app.listen(port, function () {
  console.log(
    `app started listening on port ${port} visit us! http://localhost:8080`
  );
});
