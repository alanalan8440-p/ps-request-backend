const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const routes = require("./routes");
const errorHandler = require("./common/errors/errorHandler");

const app = express();
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});


app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("combined"));

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
