const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');

//Database Connection
connectDB();

//App Configuration
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
const {objectiveRoute,page2Route,page3Route} = require("./routes");
app.use('/api', objectiveRoute)
app.use('/api', page2Route)
app.use('/api', page3Route)





//Default Route
app.get("/", (req, res) => {
  res.send('Welcome!');
});

//Server Configuration
const { PORT } = require("./config/environment");
const port = PORT || 3600;
app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
