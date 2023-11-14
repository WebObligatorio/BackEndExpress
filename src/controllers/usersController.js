const bcryptjs = require("bcryptjs");               // Key encriptation
const jwt = require("jsonwebtoken");                // Token generator

const userSchema = require("../models/user");

const usersController = {

    // To get all users information
    getAllUsers: async (req, res) => {
        userSchema
            .find()
            .then((data)=> res.json(data))
            .catch((error)=> res.json({message: error}));
    },

    // To get a specified user by a given id
    getUserById: async (req, res) => {
        const userId = parseInt(req.params.id);
   
        userSchema
            .findbyID(userId)
            .then((data)=> res.json(data))
            .catch((error)=> res.json({message: error}));
    },

    // User login (in login success, access token is returned)
    login: async (req, res) => {
        const {email, password} = req.body;
    
        const user = await userSchema.findOne({ "email": email});
        if (!user){
            return res.status(404).json({ message: 'User not found' });
        }

        let checkPassword = bcryptjs.compareSync(password, user.password);
        if (checkPassword) {
            jwt.sign({usuario: user}, process.env.JWT_SECRET_KEY, (err, token)=>{
                res.json({"access_token": token})
            });
        } else {
            res.status(401).send({message: "Invalid password!"});
        }
    },

    // To sign up a new host user
    signUp: async (req, res) => {

        const user = userSchema(req.body);
        
        var userExists = await userSchema.findOne({ 'email': user.email});
        
        if ( userExists == undefined) {
            let salt = bcryptjs.genSaltSync(8);
            let hash = await bcryptjs.hash(user.password,salt);
            user.password= hash;
            user.save()
                .then((data)=> res.json(data))
                .catch((error)=> res.json({message: error}));
        } else {
            res.status(409).send({message: "User already exists!"});
        }
    }

};

module.exports = usersController;
