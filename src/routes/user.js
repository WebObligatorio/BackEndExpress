const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
//para encriptar la clave
const bcryptjs = require("bcryptjs");

//Crear Usuario

router.post("/users/create", async  (req,res)=>{
const user= userSchema(req.body);

//valido si el mismo correo existe o no

var Yaexiste = await userSchema.findOne({ 'email': user.email}); // Busca si existe ya el email.

if (Yaexiste==undefined){
let salt = bcryptjs.genSaltSync(8);
let hash= await bcryptjs.hash(user.password,salt);
user.password= hash;
user.save() //si esta bien la estructura, la crea.
.then((data)=> res.json(data))
.catch((error)=> res.json({message: error}));
}
else{
    res.status(200).send({message: "Ya existe el usuario"});
}});

//Obtener usuarios de la Base

router.get("/users", async  (req,res)=>{
    userSchema
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message: error}));
    });

//Obtener unico Usuario

router.get("/users/:id", async  (req,res)=>{
    const {id} = req.params;
    userSchema
    .findbyID(id)
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message: error}));
});

//Logeo del Usuario
router.post("/users/login", async (req,res)=>{
    const user= userSchema(req.body);
    user.password= await bcryptjs.hash(user.password,8);
    user.save() //si esta bien la estructura, la crea.
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message: error}));
    });


module.exports=router;