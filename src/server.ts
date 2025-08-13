import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import { OpenrpcDocument } from "@open-rpc/meta-schema";

const app = express();
app.use(bodyParser.json());

// Config de conexión a Percona
const dbConfig = {
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "test"
};

// Documento OpenRPC
const openrpcDoc: OpenrpcDocument = {
  openrpc: "1.2.6",
  info: {
    title: "Percona JSON-RPC API",
    version: "1.0.0"
  },
  servers: [
    {
      name: "Local",
      url: "http://localhost:3000"
    }
  ],
  methods: [
    {
      name: "getUsers",
      summary: "Obtiene todos los usuarios de la base de datos",
      params: [],
      result: {
        name: "users",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" }
            }
          }
        }
      }
    }
  ]
};

// Endpoint para obtener el documento OpenRPC
app.get("/openrpc.json", (req, res) => {
  res.json(openrpcDoc);
});

// Endpoint JSON-RPC principal
app.post("/", async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== "2.0") {
    return res.status(400).json({ error: "Invalid JSON-RPC version" });
  }

  try {
    if (method === "getUsers") {
      const conn = await mysql.createConnection(dbConfig);
      const [rows] = await conn.query("SELECT * FROM users");
      await conn.end();

      return res.json({ jsonrpc: "2.0", result: rows, id });
    }

    res.status(404).json({ jsonrpc: "2.0", error: "Method not found", id });
  } catch (error) {
    res.status(500).json({ jsonrpc: "2.0", error: (error as Error).message, id });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("JSON-RPC server running on http://localhost:3000");
  console.log("OpenRPC doc available at http://localhost:3000/openrpc.json");
});
