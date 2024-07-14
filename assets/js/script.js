// Variables start
let sidebarContentWidth = $(".sidebar-content").outerWidth();
let MainRow = document.getElementById("cardsRow");
let l;
// Variables End

function helper() {
  $("#cardsRow").empty();
  $("#contact").css({ display: "none" });
  closeNav();
}

// auto functions start
$(".sidebar").css("left", `-${sidebarContentWidth}px`);
$(document).ready(function () {
  getData();
  $(".loading").fadeOut(700);
});

// auto functions End
function closeNav() {
  $(".sidebar").css("left", `-${sidebarContentWidth}px`);
  $(".open-close-icon").removeClass("fa-xmark").addClass("fa-align-justify");
  $(".links li").animate(
    {
      top: 300,
    },
    750
  );
}

function openNav() {
  $(".sidebar").css("left", "0px");
  $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-xmark");
  $(".links li").animate(
    {
      top: 0,
    },
    750
  );
}
// SideNav Toggler Start
$(".toggler").click(function () {
  if ($(".sidebar").css("left") == "0px") {
    closeNav();
  } else if ($(".sidebar").css("left") == `-${sidebarContentWidth}px`) {
    openNav();
  }
});

// SideNav Toggler End

// Get Main Data Start

async function getData(dishName = "") {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`
  );
  let res = await data.json();
  let meals = res.meals;

  showData(meals);
}

// Get Main Data End

// Show Main Data Start

function showData(meals) {
  helper();

  let cartoona = "";

  if (meals.length < 20) {
    l = meals.length;
  } else {
    l = 20;
  }

  for (let i = 0; i < l; i++) {
    cartoona = `
    <div class="col-md-3 p-2">
      <div class="dishCard position-relative rounded-2" >
        <div class="dishOverLay px-4">
          <h2>${meals[i].strMeal}</h2>
        </div>
        <div class="dishImg">
          <img
            src="${meals[i].strMealThumb}"
            alt="${meals[i].strMeal}"
            class="w-100"
          />
        </div>
      </div>
    </div>
    `;
    cartoona = $(cartoona).on("click", function () {
      getIdDetails(meals[i].idMeal);
    });

    $("#cardsRow").append(cartoona);
  }
}
// Show Main Data End

// Get Id Details Start
async function getIdDetails(mealId) {
  $(".loading").fadeIn(100);
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let res = await data.json();
  let meal = res.meals[0];

  showIdDetails(meal);
  $(".loading").fadeOut(500);
}
// Get Id Details End

// Show Id Details Start

function showIdDetails(meal) {
  helper();
  $("#searchRow").css({ display: "none" });
  let cartoona = `
    <div class="col-md-4">
           <h2>${meal.strMeal}</h2>
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
    </div>
  
    <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
      <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap" id="recipes">
      </ul>
  
      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap" id="tags">
          <li class="alert alert-danger m-2 p-1" id="tagItem">${meal.strTags}</li>
      </ul>
  
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `;

  MainRow.innerHTML = cartoona;

  let recipesHtml = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      recipesHtml += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  document.getElementById("recipes").innerHTML = recipesHtml;

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];
  let tagsHtml = "";
  for (let i = 0; i < tags.length; i++) {
    tagsHtml += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  document.getElementById("tags").innerHTML = tagsHtml;
}

// Show Id Details End

function showSearch() {
  helper();
  $("#searchRow").css({ display: "flex" });
  closeNav();
  $("#searchRow input").val("");
}

function searchByName(event) {
  let name = event.target.value;
  if (name.length > 0) {
    getData(name);
  }
}

function searchByLetter(event) {
  let letter = event.target.value;
  if (letter.length == 1) {
    getLetterDetails(letter);
  }
}

async function getLetterDetails(letter) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let res = await data.json();
  let meals = res.meals;
  showData(meals);
}

// categories start

async function getCategories() {
  helper();
  $("#searchRow").css({ display: "none" });
  let data = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let res = await data.json();

  let categories = res.categories;

  showCategories(categories);
}

function showCategories(categories) {
  let cartoona = "";
  for (let i = 0; i < categories.length; i++) {
    cartoona = `

    <div class="col-md-3 p-2">
          <div class="dishCard position-relative rounded-2" >
            <div class="dishOverLay px-4 text-center d-flex flex-column align-items-center overflow-hidden">
              <h2>${categories[i].strCategory}</h2>
              <p>${categories[i].strCategoryDescription}</p>
            </div>
            <div class="dishImg">
              <img
                src="${categories[i].strCategoryThumb}"
                alt=" ${categories[i].strCategory}"
                class="w-100 h-100"
              />
            </div>
          </div>
        </div>

    `;

    cartoona = $(cartoona).on("click", function () {
      getCategoryId(categories[i].strCategory);
    });

    $("#cardsRow").append(cartoona);
  }
}
async function getCategoryId(key) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${key}`
  );
  let res = await data.json();
  let meals = res.meals;
  showData(meals);
}

async function showAreaCard() {
  $(".loading").fadeIn(100);
  let data = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let res = await data.json();
  let area = res.meals;
  showArea(area);
  $(".loading").fadeOut(100);
}

function showArea(area) {
  helper();
  $("#searchRow").css({ display: "none" });
  let cartoona = "";
  for (let i = 0; i < area.length; i++) {
    cartoona = `
      <div class="col-md-3 py-2">
          <div  class="rounded-2 text-center cursor-pointer">
                  <i class="fa-solid fa-house-laptop fa-4x"></i>
                  <h3>${area[i].strArea}</h3>
          </div>
      </div>
      `;

    cartoona = $(cartoona).on("click", function () {
      getAreaId(area[i].strArea);
    });
    $("#cardsRow").append(cartoona);
  }
}

async function getAreaId(key) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${key}`
  );
  let res = await data.json();
  let meals = res.meals;
  showData(meals);
}

async function showIngredients() {
  $(".loading").fadeIn(100);
  helper();

  let data = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let res = await data.json();
  let ingredients = res.meals;

  showIngredientsCard(ingredients);
  $(".loading").fadeOut(300);
}

function showIngredientsCard(ingredients) {
  helper();
  $("#searchRow").css({ display: "none" });
  let cartoona = "";
  for (let i = 0; i < 20; i++) {
    cartoona = `
    <div class="col-md-3 p-4">
                <div  class="rounded-2 text-center ing-card ">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3> ${ingredients[i].strIngredient}</h3>
                        <p>${ingredients[i].strDescription}</p>
                </div>
        </div>
    `;

    cartoona = $(cartoona).on("click", function () {
      getIngredientsMeals(ingredients[i].strIngredient);
    });
    $("#cardsRow").append(cartoona);
  }
}

async function getIngredientsMeals(key) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${key}`
  );
  let res = await data.json();
  let meals = res.meals;
  showData(meals);
}

function showContact() {
  helper();
  $("#searchRow").css({ display: "none" });
  $("#contact").css({ display: "flex" });
}

function validateName() {
  let name = $("#name").val();
  let rgx = /^[a-zA-Z]{3,}$/;
  if (name == "") {
    $("#name").addClass("is-invalid");
    $("#name").removeClass("is-valid");
    $("#nameAlert").css("display", "block");
  } else if (!rgx.test(name)) {
    $("#name").addClass("is-invalid");
    $("#name").removeClass("is-valid");
    $("#nameAlert").css("display", "block");
  } else {
    $("#name").addClass("is-valid");
    $("#name").removeClass("is-invalid");
    $("#nameAlert").css("display", "none");
  }
  checkAll();
}

function validateEmail() {
  let email = $("#email").val();
  let rgx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email == "") {
    $("#email").addClass("is-invalid");
    $("#email").removeClass("is-valid");
    $("#emailAlert").css("display", "block");
  } else if (!rgx.test(email)) {
    $("#email").addClass("is-invalid");
    $("#email").removeClass("is-valid");
    $("#emailAlert").css("display", "block");
  } else {
    $("#email").addClass("is-valid");
    $("#email").removeClass("is-invalid");
    $("#emailAlert").css("display", "none");
  }
  checkAll();
}

function validatePhone() {
  let phone = $("#phone").val();
  let rgx = /^01[0-9]{9}$/;
  if (phone == "") {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    $("#phoneAlert").css("display", "block");
  } else if (!rgx.test(phone)) {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    $("#phoneAlert").css("display", "block");
  } else {
    $("#phone").addClass("is-valid");
    $("#phone").removeClass("is-invalid");
    $("#phoneAlert").css("display", "none");
  }
  checkAll();
}

function validateAge() {
  let age = $("#age").val();
  if (age == "") {
    $("#age").addClass("is-invalid");
    $("#age").removeClass("is-valid");
    $("#ageAlert").css("display", "block");
  } else if (age < 13) {
    $("#age").addClass("is-invalid");
    $("#age").removeClass("is-valid");
    $("#ageAlert").css("display", "block");
  } else {
    $("#age").addClass("is-valid");
    $("#age").removeClass("is-invalid");
    $("#ageAlert").css("display", "none");
  }
  checkAll();
}

function validatePassword() {
  let password = $("#password").val();
  let rgx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (password == "") {
    $("#password").addClass("is-invalid");
    $("#password").removeClass("is-valid");
    $("#passwordAlert").css("display", "block");
  } else if (!rgx.test(password)) {
    $("#password").addClass("is-invalid");
    $("#password").removeClass("is-valid");
    $("#passwordAlert").css("display", "block");
  } else {
    $("#password").addClass("is-valid");
    $("#password").removeClass("is-invalid");
    $("#passwordAlert").css("display", "none");
  }
  checkAll();
}

function validateRePassword() {
  let password = $("#password").val();
  let repassword = $("#repassword").val();
  if (password != repassword) {
    $("#repassword").addClass("is-invalid");
    $("#repassword").removeClass("is-valid");
    $("#repasswordAlert").css("display", "block");
  } else {
    $("#repassword").addClass("is-valid");
    $("#repassword").removeClass("is-invalid");
    $("#repasswordAlert").css("display", "none");
  }
  checkAll();
}

function checkAll() {
  if (
    $("#name").hasClass("is-valid") &&
    $("#email").hasClass("is-valid") &&
    $("#phone").hasClass("is-valid") &&
    $("#age").hasClass("is-valid") &&
    $("#password").hasClass("is-valid") &&
    $("#repassword").hasClass("is-valid")
  ) {
    $("#submit").removeClass("disabled");
  } else {
    $("#submit").addClass("disabled");
  }
}

$(".logo").on("click", function () {
  window.location.reload();
});
