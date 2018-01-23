
var recipes = [];

// searh for recipes form:
var $recipes = $(".recipes");

function findRecipe() {
    $.ajax({
      method: "GET",
      dataType: 'json',
     //url: ‘/recipes?recipe=<user input value>’, 
      success: function(data) {
        console.log(data);
        recipes = data;
        _renderPage();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }
}); 
  }
  findRecipe();

  // click button "get recipes": 
  $(".mainBtn").on('click', function() {
    var $input = $(".mainInput");
    if ($input.val() === "") {
      alert("Please enter text");
    }
    else {
     // app.addRecipe($input.val());
     $input.val("");
    };
  });

  function _renderPage() {
    $recipes.empty();
    var source = $('recipe-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i <recipes.length; i++) {
      var newHTML = template(recipes[i]);
      console.log(newHTML);
      $recipes.append(newHTML);
      _renderPage(i);
    }
  }

  function addRecipe(newRecipe) {
    $.ajax({
      type: "POST",
      dataType: "json",
      // url: '', // from server
      data: {
        text: newRecipe,
      },
      success: function(data) {
        recipes.push(data);
        _renderPage();
      }
    });
  }