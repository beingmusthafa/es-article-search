import dotenv from "dotenv";
import { Client } from "@elastic/elasticsearch";

dotenv.config();

const elasticClient = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
  },
});

elasticClient
  .ping()
  .then(() => {
    console.log("Connected to Elasticsearch successfully");
  })
  .catch((error) => {
    console.error("Elasticsearch connection failed:", error);
  });

export default elasticClient;
