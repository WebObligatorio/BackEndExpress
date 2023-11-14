const express= require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/user");
const activitysRoutes = require("./routes/activity");



const app= express();
const port= process.env.PORT || 3000;

// midedelware
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", activitysRoutes);




//mongodb conexion
//Aca se va a conectar a mongo.
mongoose
.connect(process.env.DATABASE_URL).then(()=> console.log("Se conecto a la base de Mongo"))
.catch((error)=> console.error(error));



app.listen(port, () => console.log('Servidor iniciado en el puerto ', port));