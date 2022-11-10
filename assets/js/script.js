var breedSearch = document.querySelector("#breed-list");
var breedInput = document.querySelector("#breed-search");
var zipcodeInput = document.querySelector("#zip-code-search");
var dropDownItem = document.querySelector(".dropdown-menu");
var resultsEl = document.querySelector(".search-results");

function getCurrentURL() {
  return window.location.href;
}

// Extract Bearer Token
function getBearerToken(url) {
  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': 'hYLLBlFvMKtqc5fCv228G4ipLa01BiIm7j4HZwjpoccdp2Qb6d',
      'client_secret': 'AHsC8QDmODplLu6YSziXLQMobIg5N3022Jo24b8m'
    })
  }).then(response => response.json())
    .then(result => {
      var bearerToken = result.access_token;
      var expiration = result.expires_in;
      fetchData(bearerToken, url);
      console.log(bearerToken);
    })
    .catch(error => console.log('error', error));
}

// Get Dog Data
function fetchData(bearerToken, url) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);
  console.log(url.substring(1));
  var parameters = url.substring(1);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`https://api.petfinder.com/v2/${parameters}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Start Appending
      console.log(result);
      var name = result.animals[0].name;
      var age = result.animals[0].age;
      var photo = result.animals[0].primary_photo_cropped.full;
      var email = result.animals[0].contact.email;
      var phone = result.animals[0].contact.phone;
      var address = result.animals[0].contact.address;
      var description = result.animals[0].description;
      var orgId = result.animals[0].organization_id
      resultsEl.appendChild(document.createElement("div")).className = "result-template";
      resultsEl.lastChild.innerHTML = `<div class="pet-info-basics row">
      <div class="col-3">
        <h4 class="row pet-name d-flex justify-content-center">${name}</h4>
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
          <h5 class="col-12">
            Location:
            <span class="col-9 pet-location-name"
              >Furry Friends Animal Rescue</span
            ><span class="organization-phone justify-content-around"
              >${phone}</span
            >
          </h5>
          <h5 class="col-9 org-address-1">1234 Main St.</h5>
          <h5 class="col-9 org-address-2">San Diego, CA 92010</h5>
          <button
            class="refine-search col-10 d-flex justify-content-center"
          >
            Get Directions to Fido!
          </button>
          <h5 class="col-9 distance">
            <span class="pet-name">Fido</span> is: 26 miles away from your
            location
          </h5>
        </div>
      </div>
      <div class="pet-info-contact col-3">
        <h4>Shelter Information:</h4>
        <img
          class="org-img justify-content-center"
          src="./assets/images/logo-template.jpg"
        />
        <a class="organization-URL justify-content-around"
          >www.animalrescue.com</a
        >
      </div>
    </div>`;
      // Stop Appending
    })
    .catch(error => console.log('error', error));


  fetch("https://api.petfinder.com/v2/types/dog/breeds", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (getCurrentURL().includes("index.html")) {
        console.log("Yes this is the HTML page.");
        for (let i = 0; i < result.breeds.length; i++) {
          const element = result.breeds[i];
          breedSearch
            .appendChild(document.createElement("option"))
            .value = element.name;
        }
      }
    })
    .catch(error => console.log('error', error));

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
  } else { var breed = "" }
  var parameters = `animals?type=dog${breed}&page=1${zipCode}${radius}`;
  window.location.href = `./search_results.html?${parameters}`;
}

dropDownItem.addEventListener("click", formInput);

// Scripts for search_results.html page.
if (getCurrentURL().includes("search_results.html")) {
  var url = window.location.search;
  getBearerToken(url);
}