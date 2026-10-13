const http = require("http");
const { Pool } = require("pg");

const port = process.env.PORT || 80;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  ssl: {
    rejectUnauthorized: false
  },

  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

const server = http.createServer(async (req, res) => {
  // --------------------------------------------------
  // Application health check
  // --------------------------------------------------

  if (req.url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    return res.end(
      JSON.stringify({
        status: "ok",
        service: "propertyops"
      })
    );
  }

  // --------------------------------------------------
  // Database health check
  // --------------------------------------------------

  if (req.url === "/db-health") {
    try {
      const result = await pool.query("SELECT 1 AS connected");

      res.writeHead(200, {
        "Content-Type": "application/json"
      });

      return res.end(
        JSON.stringify({
          status: "ok",
          service: "propertyops",
          database: "connected",
          result: result.rows[0]
        })
      );
    } catch (error) {
      console.error("Database connection failed:", error.message);

      res.writeHead(503, {
        "Content-Type": "application/json"
      });

      return res.end(
        JSON.stringify({
          status: "error",
          service: "propertyops",
          database: "unavailable"
        })
      );
    }
  }

  // --------------------------------------------------
  // Homepage
  // --------------------------------------------------

  res.writeHead(200, {
    "Content-Type": "text/html"
  });

  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>PropertyOps</title>
      </head>
      <body>
        <h1>PropertyOps</h1>
        <p>Cloud-native property maintenance platform</p>
        <p>
          Infrastructure powered by AWS ECS Fargate,
          Amazon RDS and Terraform.
        </p>
      </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`PropertyOps running on port ${port}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down.");

  await pool.end();

  server.close(() => {
    process.exit(0);
  });
});