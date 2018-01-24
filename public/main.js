var $recipeList = $(".recipe-list"); // search for recipes form
var $popularRecipes = $('.popular-recipes');

var recipesApp = function () {
    var recipes = [];
    var savedRecipes = [];

    function findRecipe(text) {
        var url = 'recipes?recipe=' + text;
        $.ajax({
            method: "GET",
            url: url,
            success: function (data) {
                if (data.length) {
                    console.log(data);
                    recipes = data;
                    _renderPage();
                } else {
                    alert("Sorry we dont have a recipe match");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    function findIndexByUrlAndTitle(recipe, array) {
        return array.findIndex(function(element) {
            return element.url === recipe.url && element.title === recipe.title;
        });
    }

    function likeRecipe(index, clickedOnPopular = false) {
        var recipe = {};
        if (clickedOnPopular) {
            recipe = savedRecipes[index];
        } else {
            recipe = recipes[index];
        }
        console.log(recipe);
        $.ajax({
            method: "POST",
            url: 'recipes',
            data: recipe,
            success: function (data) {
                if (data.likes > 1) {
                    var i = savedRecipes.findIndex(function(element) {
                        return element._id === data._id;
                    });
                    savedRecipes[i].likes++;
                } else {
                    savedRecipes.push(data);
                }

                if (recipes.length && findIndexByUrlAndTitle(data, recipes) > -1) {
                    recipes[findIndexByUrlAndTitle(data, recipes)].likes++;
                    _renderPage();
                }

                console.log(savedRecipes);
                _renderPopular();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    function popularRecipes() {
        $.ajax({
            method: "GET",
            url: 'popular',
            success: function (data) {
                savedRecipes = data;
                _renderPopular();

            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    function deletePopularRecipe(index) {
        console.log(savedRecipes[index]._id);
        $.ajax({
            type: 'DELETE',
            url: '/recipes/' + savedRecipes[index]._id,
            success: function (data) {
                savedRecipes.splice(index, 1);
                _renderPopular();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    // goes through the recipes array and puts them on the screen, using the handlebars template
    function _renderPage() {
        $recipeList.empty();
        var source = $('#recipe-template').html();
        var template = Handlebars.compile(source);
        var recipeData = { "recipeArray": recipes };
        var newHTML = template(recipeData);
        $('.recipe-list').append(newHTML);
    }

    function _renderPopular() {
        $(".popular-recipes").empty();
        var source = $('#popular-template').html();
        var template = Handlebars.compile(source);
        var popularData = { "popularArray": savedRecipes };
        var newHTML = template(popularData);
        $('.popular-recipes').append(newHTML);
    }

    return {
        findRecipe: findRecipe,
        likeRecipe: likeRecipe,
        popularRecipes: popularRecipes,
        deletePopularRecipe: deletePopularRecipe
    }
}

var app = recipesApp();


app.popularRecipes();


// click button "get recipes": 
$(".main-btn").on('click', function () {
    var $input = $(".main-input");
    if ($input.val() === "") {
        alert("Please enter text");
    }
    else {
        app.findRecipe($input.val());
        $input.val("");
    }
})

$recipeList.on('click', '.like-button', function () {
    var index = $(this).closest('.recipe-container').index();
    app.likeRecipe(index);    
});

$popularRecipes.on('click', '.like-button', function () {
    var index = $(this).closest('.popular-container').index();
    app.likeRecipe(index, true);    
});


// $(".find-popular").on('click', function () {
    
// });

$('.popular-recipes').on('click', '.remove-recipe', function () {
    var index = $(this).closest('.popular-container').index();
    app.deletePopularRecipe(index);
});