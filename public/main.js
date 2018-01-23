// search for recipes form:
var $recipeList = $(".recipe-list");

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
        } else (
          alert ("Sorry we dont have a recipe match")
        )
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  function likeRecipe(index) {
    var recipe = recipes[index];
    $.ajax({
      method: "POST",
      url: 'recipes',
      data: recipe,
      success: function (data) {
        savedRecipes.push(data);
        console.log(savedRecipes);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  // 5.	Add renderPage() function in main.js. It goes through the recipes array and puts them on the screen,
  //  using the handlebars template.

  function _renderPage () {
    $recipeList.empty();
    var source = $('#recipe-template').html();
    var template = Handlebars.compile(source);
    var recipeData = { "recipeArray": recipes };
    var newHTML = template(recipeData);
    $('.recipe-list').append(newHTML);

  }



  // function addRecipe(newRecipe) {
  //   $.ajax({
  //     type: "POST",
  //     dataType: "json",
  //     // url: '', // from server
  //     data: {
  //       text: newRecipe,
  //     },
  //     success: function (data) {
  //       recipes.push(data);
  //       _renderPage();
  //     }
  //   });
  // }

  return {
    findRecipe: findRecipe,
    likeRecipe: likeRecipe,
    // deletePopularRecipe: deletePopularRecipe
  }
}

var deletePopularRecipe = function(index) {
  $.ajax ({
    type: 'DELETE',
    url: '/recipes' + recipes[index]._id,
    success: function (data) {
      savedRecipes.splice(index, 1);
      renderPage();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
  }
  })
}

var app = recipesApp();

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


$recipeList.on('click', '.remove-recipe', function() {
  var index = $(this).closest('.reacipe-containter').index();
  app.deletePopularRecipe(index);
})