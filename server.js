var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');

mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/appetizeDB');

var Recipe = require('./models/recipeModel');

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get recipes from Edamam API and send to client
app.get('/recipes', function (req, res) {
    var url = "";
    if (req.query.diet) {
        url = `https://api.edamam.com/search?q=${req.query.recipe}&app_id=a41229b4&app_key=
                e271a0d52d0ae4abe4ecd96af53df16a&from=0&to=8&diet=${req.query.diet}`;
    } else {
        url = `https://api.edamam.com/search?q=${req.query.recipe}&app_id=a41229b4&app_key=
                e271a0d52d0ae4abe4ecd96af53df16a&from=0&to=8`;
    }

    request(url, function (error, response, body) {
        if (error) { return console.error(error); }
        if (response.statusCode == 200) {
            var recipes = JSON.parse(body);
            recipes = recipes.hits.map(function (element) {
                return {
                    url: element.recipe.url, title: element.recipe.label, imageUrl: element.recipe.image,
                    dietLabels: element.recipe.dietLabels, likes: 0
                };
            });

            // for (let i = 0; i < recipes.length; i++) {
            //     var element = recipes[i];
            //     Recipe.find({ url: element.url, title: element.title }, function (error, result) {
            //         if (error) { return console.error(error); }
            //         if (result.length) {
            //             recipes[i].likes = result[0].likes;
            //             console.log(element.likes);
            //         }
            //     });
            // }

            res.send(recipes);
        } else if (response.statusCode == 403 || response.statusCode == 401) {
            res.send([]);
        }
    });
});

// add a recipe to the DB
app.post('/recipes', function (req, res) {
    if (req.body.likes > 0) {
        req.body.likes++;
        Recipe.findOneAndUpdate({ url: req.body.url, title: req.body.title }, { $set: req.body }, { new: true },
            function (error, result) {
                if (error) { return console.error(error); }
                res.send(result);
            });
    } else {
        req.body.likes++;
        var newRecipe = new Recipe(req.body);
        newRecipe.save(function (err, data) {
            if (err) { return console.error(err); }
            res.send(data);
        });
    }
});

// delete a recipe from DB
app.delete('/recipes/:recipeId', function (req, res) {
    if (req.query.likes > 1) {
        Recipe.findById(req.params.recipeId, function (error, result) {
                if (error) { return console.error(error); }
                result.likes--;
                result.save(function(err, data) {
                    if (err) { return console.error(err); }
                    res.send(data);
                });
            });
    } else {
        Recipe.findByIdAndRemove(req.params.recipeId, function (err, data) {
            if (err) { return console.error(err); }
            res.send(data);
        });
    }
});

// get all saved recipes from DB and send to client
app.get('/popular', function (req, res) {
    Recipe.find(function (error, result) {
        if (error) { return console.error(error); }
        res.send(result);
    });
});

app.listen(process.env.PORT || '8000', function () {
    console.log('you r connected to port 8000!');
});