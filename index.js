import express from "express";
import "./configs/db.config.js";
import routes from "./Routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();
const port = process.env.PORT || 8081;

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))
app.use(cookieParser())
app.use(express.json());
app.use('/api', routes)
app.route("/").get((req, res) => res.send("Application is Running..."));
app.get("*", (req, res) => res.send("404! This is an invalid URL."));



app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})



