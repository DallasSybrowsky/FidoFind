var breedSearch = document.querySelector("#breed-list");
var breedInput = document.querySelector("#breed-search");
var zipcodeInput = document.querySelector("#zip-code-search");
var dropDownItem = document.querySelector(".dropdown-menu");
var resultsEl = document.querySelector(".search-results");
const recentSearchBtnEl = document.querySelector("#history");
var funfactEl = document.querySelector(".fun-facts");
var bearerToken = [];

// Extract Bearer Token
getBearerToken();
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
      fetchData(bearerToken[0], window.location.search);
    })
    .catch((error) => console.log("error", error));
}

// Recent searches
var createRecentButtons = function () {
  var template = "";
  var data = localStorage.getItem("searchInput") || []; //We need to parse the search data and input into the quotes to store in
  var parsedOldSearches = data.split(",");
  console.log(parsedOldSearches);
  for (let i = 0; i < parsedOldSearches.length; i++) {
    if (parsedOldSearches[i] ===  "") {
      continue;
    }
    const element = parsedOldSearches[i].replace("animals?", "");
    var searchParameters = parsedOldSearches[i];
    var splitUrl = element.split("&");
    for (let x = 0; x < splitUrl.length; x++) {
      const splitElement = splitUrl[x];
      var splitParameter = splitElement.split("=");
      if (splitParameter[0] === "location") {
        var zipCode = `Zip Code: ${splitParameter[1]}, `;
      }
      if (splitParameter[0] === "breed") {
        var breed = `Breed: ${splitParameter[1]}, `;
      }
      if (splitParameter[0] === "distance") {
        var distance = `Radius: ${splitParameter[1]}`;
      }
    }
    var breed = breed ?? "";
    console.log(breed);
    template += `<button value="${searchParameters}" class="recent-search">${breed}${zipCode}${distance}</button>`;
    
  }
  document.querySelector("#history").innerHTML = template;
};

createRecentButtons();
document.querySelector("#history").addEventListener("click", function (event) {
  window.location.href= `./search_results.html?${event.target.value}`;
});

// Get Dog Data
function fetchData(bearerToken, url) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);
  console.log(url.substring(1));
  var parameters = url.substring(1);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    // mode: "no-cors",
  };

  fetch(`https://api.petfinder.com/v2/${parameters}&sort=distance`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Start Appending
      console.log(result);
      for (i = 0; i < 20; i++) {
        var animal = result.animals[i];
        var name = result.animals[i].name;
        var age = result.animals[i].age;
        var gender = result.animals[i].gender;
        var sterilizedGen = result.animals[i].gender; 
        if (gender == "Male") {
            sterilizedGen = "Neutered:"
        } else {
            sterilizedGen = "Spayed:"
        }
        var sterilizedVal =
          result.animals[i].attributes.spayed_neutered ?? "Not specified";
        if (animal.attributes.spayed_neutered) {
          sterilized = "Yes";
        } else {
          sterilized = "No";
        }
        var houseTrain =
          result.animals[i].attributes.house_trained ?? "Not specified";
        if (animal.attributes.house_trained) {
          houseTrain = "Yes";
        } else {
          houseTrain = "No";
        }
        var vaccinated =
          result.animals[i].attributes.shots_current ?? "Not specified";
        if (animal.attributes.shots_current) {
          vaccinated = "Yes";
        } else {
          vaccinated = "No";
        }
        var kidsOk =
          result.animals[i].environment?.children ?? "Not specified";
        if (animal.environment.children) {
          kidsOk = "Yes";
        } else {
          kidsOk = "No";
        }
        var dogsOk =
          result.animals[i].environment?.dogs ?? "Not specified";
        if (animal.environment.dogs) {
          dogsOk = "Yes";
        } else {
          dogsOk = "No";
        }
        var catsOk =
          result.animals[i].environment?.cats ?? "Not specified";
        if (animal.environment.cats) {
          catsOk = "Yes";
        } else {
          catsOk = "No";
        }
        var croppedPhoto = result.animals[i].primary_photo_cropped; // secondary image to populate if null
        var photo = Boolean(croppedPhoto)
          ? croppedPhoto.full
          : "./assets/images/no-photo.png";
        var email = animal.contact.email ?? "No email provided";
        var phone = animal.contact.phone ?? "No phone number given";
        if (animal.contact.phone) {
          phone = animal.contact.phone;
        }
        var address =
          animal.contact.address?.address1 ?? "No street address given";
        var city = animal.contact.address.city;
        var state = animal.contact.address.state;
        var zipcode = animal.contact.address.postcode;
        var description =
          animal.description ?? "Call or email to find out more about me!";
        // var orgId = result.animals[i].organization_id;
        var distance = Math.round(result.animals[i].distance);
        if (distance === null) {
          var distance = `The distance to ${name} could not be determined.`;
        } else {
          var distance = `${Math.round(
            result.animals[i].distance
          )} miles away from you`;
        }
        resultsEl.appendChild(document.createElement("div")).className =
          "result-template";
        resultsEl.lastChild.innerHTML = `<div class="pet-info-basics row">
      <div class="col-3">
        <h4 class="row pet-name text-capitalize d-flex justify-content-center">${name}</h4>
        <img
          class="pet-img justify-content-center"
          src="${photo}"
        />
      </div>
      <div class="col-6 container">
        <div class="pet-info-details">
          <h4>Description:</h4>
          <h6 class="pet-description">
            ${description}
          </h6>
          <h5 class="col-12 distance text-center">
          <span class="pet-name">${name}</span> is ${distance}
          </h5>
          <h5 class="col-12 text-left">Location:</h5>
          <h5 class="col-9 org-address-1">${address}</h5>
          <h5 class="col-9 org-address-2">${city}, ${state} ${zipcode}</h5>
          </div>
          </div>
          <div class="pet-info-contact col-3">
          <h4>More Information:</h4>
          <a class="organization-email justify-content-around"
          >${email}</a>
          <h5 class="organization-phone justify-content-around">${phone}</h5>
          <h5>More about ${name}:</h5>
          <div class="animal-details">
          <h6 class="gender">Gender: ${gender}<h6>
          <h6 class="age">Age: ${age}<h6>
          <h6 class="spay-neuter">${sterilizedGen} ${sterilized}</h6>
          <h6 class="house-trained">Potty trained: ${houseTrain}</h6>
          <h6 class="vaccinated">Shots up to date: ${vaccinated}</h6>
          <h6 class="kids-ok">Good with kids: ${kidsOk}</h6>
          <h6 class="dogs-ok">Good with dogs: ${dogsOk}</h6>
          <h6 class="cats-ok">Good with cats: ${catsOk}</h6>
          </div>
      </div>
    </div>`;
      }
      // Stop Appending
    })
    .catch((error) => console.log("error", error));
}

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
