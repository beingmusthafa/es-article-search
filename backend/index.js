import express from "express";
import elasticClient from "./elastic.js";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const entries = await elasticClient.search({
    index: "articles",
    query: {
      match_all: {},
    },
  });
  const results = entries.hits.hits.map((hit) => hit._source);
  res.json(results);
});

app.get("/search/:title", async (req, res) => {
  const entries = await elasticClient.search({
    index: "articles",
    query: {
      fuzzy: {
        title: {
          value: req.params.title,
          fuzziness: "AUTO",
        },
      },
    },
    pretty: true,
  });
  const results = entries.hits.hits.map((hit) => hit._source);
  res.json(results);
});

app.post("/", async (req, res) => {
  const { title, content } = req.body;
  const id = Math.random().toString(36).substring(2, 9);
  const article = { title, content, id };
  console.log("received create req : ", title);
  const response = await elasticClient.index({
    index: "articles",
    document: article,
  });
  res.status(201).json(response);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await elasticClient.deleteByQuery({
    index: "articles",
    query: {
      match: {
        id,
      },
    },
  });
  res.status(200).json(response);
});

app.listen(3000, () => {
  console.log("server started");
});
