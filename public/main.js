var recipesApp = function () {
  var recipes = [];

  // searh for recipes form:
  var $recipeList = $(".recipe-list");

  function findRecipe(text) {
    var url = 'recipes?recipe=' + text;
    $.ajax({
      method: "GET",
      url: url,
      success: function (data) {
        console.log(data);
        recipes = data;
        _renderPage();
        //if array comes back empty, display 'sorry we dont have a recipe match!""
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }
  // function _renderPage() {
  //   $recipeList.empty();
  //   var source = $('#recipe-template').html();
  //   var template = Handlebars.compile(source);
  //   for (var i = 0; i < recipes.length; i++) {
  //     var newHTML = template(recipes[i]);
  //     console.log(newHTML);
  //     $recipeList.append(newHTML);
  //   }
  // }


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
    findRecipe: findRecipe
    // addRecipe: addRecipe

  }

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

