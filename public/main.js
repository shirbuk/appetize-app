var $recipeList = $(".recipe-list"); // search for recipes form
var $popularRecipes = $('.popular-recipes');

var recipesApp = function () {
    var recipes = [];
    var savedRecipes = [];

    function findRecipe(text, diet) {
        var url = "";
        if (diet === "0") {
            url = 'recipes?recipe=' + text;
        } else {
            url = url = 'recipes?recipe=' + text + '&diet=' + diet;
        }

        $.ajax({
            method: "GET",
            url: url,
            success: function (data) {
                if (data.length) {
                    console.log(data);
                    recipes = data;
                    for (var i=0; i < recipes.length; i++) {
                        var index = findIndexByUrlAndTitle(recipes[i], savedRecipes);
                        if (index > -1) {
                            recipes[i].likes = savedRecipes[index].likes;
                        }
                    }
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
        return array.findIndex(function (element) {
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

        $.ajax({
            method: "POST",
            url: 'recipes',
            data: recipe,
            success: function (data) {
                if (data.likes > 1) {
                    var i = savedRecipes.findIndex(function (element) {
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
    }

    function deletePopularRecipe(index, clickedOnPopular = false) {
        if (!clickedOnPopular) {
            index = findIndexByUrlAndTitle(recipes[index], savedRecipes);
        }

        if (index > -1) {
            var recipe = savedRecipes[index];
            $.ajax({
                type: 'DELETE',
                url: 'recipes/' + recipe._id + '?likes=' + recipe.likes,
                success: function (data) {
                    var indexInSaved = findIndexByUrlAndTitle(data, savedRecipes);
                    var currRecipe = savedRecipes[indexInSaved];
                    var indexInRecipes = findIndexByUrlAndTitle(currRecipe, recipes);
                    
                    if (indexInRecipes > -1 && recipes[indexInRecipes].likes > 0) {
                        recipes[indexInRecipes].likes--;
                        _renderPage();
                    }

                    if (currRecipe.likes > 1) { // recipe still have enough likes to stay in popular section
                        currRecipe.likes--;
                    } else {
                        savedRecipes.splice(indexInSaved, 1);
                    }
                    
                    _renderPopular();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        }
    }

    // goes through the recipes array and puts them on the screen, using the handlebars template
    function _renderPage() {
        $('.spinner').removeClass('show');
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
        savedRecipes = savedRecipes.sort(function(a, b) {
            return b.likes - a.likes;
        });
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
    $recipeList.empty();
    var $input = $(".main-input");
    var $dietType = $('.diet:selected');

    if ($input.val() === "") {
        alert("Please enter text");
    }
    else {
        $('.spinner').addClass('show');
        app.findRecipe($input.val(), $dietType.val());
        // $('.recipe-list').toggleClass('show');
        $input.val("");
    }
});

$recipeList.on('click', '.like-button', function () {
    var index = $(this).closest('.recipe-container').index();
    app.likeRecipe(index);
});

$popularRecipes.on('click', '.like-button', function () {
    var index = $(this).closest('.popular-container').index();
    app.likeRecipe(index, true);
});

$recipeList.on('click', '.dislike-button', function () {
    var index = $(this).closest('.recipe-container').index();
    app.deletePopularRecipe(index);
});

$popularRecipes.on('click', '.dislike-button', function () {
    var index = $(this).closest('.popular-container').index();
    app.deletePopularRecipe(index, true);
});