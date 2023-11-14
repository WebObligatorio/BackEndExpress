const express = require("express");
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get("/users", usersController.getAllUsers);
router.get("/users/:id", usersController.getUserById);
router.post("/users/login", usersController.login);
router.post("/users/create", usersController.signUp);

module.exports = router;
