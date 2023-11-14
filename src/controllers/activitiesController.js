const jwt = require("jsonwebtoken");

const activitySchema = require("../models/activity");

const activitiesController = {

    // To create a new activity
    createActivity: async (req, res) => {
        const activity = activitySchema(req.body);
        var activityExist = await activitySchema.findOne({ 'title': activity.title}); 

        if (activityExist == undefined) {
            activity.save()
                .then((data)=> res.json(data))
                .catch((error)=> res.json({message: error}));
        } else {
            res.status(200).send({message: 'Activity already exists'});
        }
    },

    // To get all activities
    getAllActivities: async (req, res) => {
        console.log("Getting activities list...")
        activitySchema
            .find()
            .then((data)=> res.json(data))
            .catch((error)=> res.json({message: error}));
    },

};

module.exports = activitiesController;
