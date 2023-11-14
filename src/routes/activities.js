const express = require("express");
const authMiddleware = require('../middlewares/auth')
const activitiesController = require('../controllers/activitiesController');

const router = express.Router();

// Protected routes with authorization middleware
router.get("/activities", authMiddleware, activitiesController.getAllActivities);
router.post("/activities/create", authMiddleware, activitiesController.createActivity);

module.exports = router;
