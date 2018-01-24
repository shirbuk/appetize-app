var mongoose = require('mongoose');


var RecipeSchema = new mongoose.Schema({
    url: String,
    title: String,
    imageUrl: String,
    healthLabels: String,
    likes: Number
});
// { usePushEach: true });

var Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;