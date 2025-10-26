import express from "express";
import elasticClient from "./elastic.js";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const entries = await elasticClient.search({
    index: "articles",
    query: {
      fuzzy: {
        title: {
          value: req.query.title,
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
  const article = { title, content };
  const response = await elasticClient.index({
    index: "articles",
    document: article,
  });
  res.status(201).json(response);
});

app.listen(3000, () => {
  console.log("server started");
});
