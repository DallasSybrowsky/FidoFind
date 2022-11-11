var breedSearch = document.querySelector("#breed-list");
var breedInput = document.querySelector("#breed-search");
var zipcodeInput = document.querySelector("#zip-code-search");
var dropDownItem = document.querySelector(".dropdown-menu");
var resultsEl = document.querySelector(".search-results");
var funfactEl = document.querySelector(".fun-facts");
var bearerToken = [];

// Extract Bearer Token
function getBearerToken() {
  fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "hYLLBlFvMKtqc5fCv228G4ipLa01BiIm7j4HZwjpoccdp2Qb6d",
      client_secret: "AHsC8QDmODplLu6YSziXLQMobIg5N3022Jo24b8m",
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      var bearerTokenValue = result.access_token;
      var expiration = result.expires_in;
      console.log(bearerTokenValue);
      bearerToken.push(bearerTokenValue);
      console.log(bearerToken);
      breedList();
    })
    .catch((error) => console.log("error", error));
}

// Breed list API
getBearerToken();
function breedList() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  fetch("https://api.petfinder.com/v2/types/dog/breeds", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      for (let i = 0; i < result.breeds.length; i++) {
        const element = result.breeds[i];
        breedSearch.appendChild(document.createElement("option")).value =
          element.name;
      }
    })
    .catch((error) => console.log("error", error));
}

var formInput = function (event) {
  event.preventDefault();
  var radiusSearch = event.target.textContent.split(" ");
  if (zipcodeInput.value != "") {
    var zipCode = `&location=${zipcodeInput.value}`;
    var radius = `&distance=${radiusSearch[0]}`;
  } else {
    var zipCode = "";
    var radius = "";
  }
  if (breedInput.value != "") {
    var breed = `&breed=${breedInput.value}`;
  } else {
    var breed = "";
  }
  var parameters = `animals?type=dog${breed}&page=1${zipCode}${radius}`;
  window.location.href = `./search_results.html?${parameters}`;
};

dropDownItem.addEventListener("click", formInput);

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b302a7d270msh7ca022982f8c082p16f50ajsn570b6cc641e0',
		'X-RapidAPI-Host': 'funny-joke-dataset.p.rapidapi.com'
	}
};

fetch('https://funny-joke-dataset.p.rapidapi.com/users?category=animal ', options)
	.then(response => response.json())
	.then(response => {
    console.log(response.users);
    for (let i = 0; i < response.users.length; i++) {
      var random = Math.floor(Math.random() * response.users.length);
      if (response.users[random].category === "Animal") {
        console.log(response.users[random].category);
        funfactEl.textContent = `
        ${response.users[random].body}`;
        return;
      } 
    }
  })
	.catch(err => console.error(err));