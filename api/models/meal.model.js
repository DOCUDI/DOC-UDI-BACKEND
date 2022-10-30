const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    range: Number,
    dietPlan: [],
    exercisePlan: []
});

let Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
