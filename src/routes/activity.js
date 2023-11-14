const express = require("express");
const router = express.Router();
const activitySchema = require("../models/activity");

//Crear Actividad

router.post("/activity/create", async  (req,res)=>{
    const activity= activitySchema(req.body);
    var Yaexiste = await activitySchema.findOne({ 'title': activity.title}); // Busca si existe el titulo
    if (Yaexiste==undefined){
    activity.save() //si esta bien la estructura, la crea.
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message: error}));
    }
    else{
        res.status(200).send({message: "Ya existe el titulo que desea crear."});
    }});

// Obtener Lista de Actividades

router.get("/activity", async  (req,res)=>{
    activitySchema
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message: error}));
});


    module.exports=router;