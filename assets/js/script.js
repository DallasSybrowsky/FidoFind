var breedSearch = document.querySelector("#breed-list");
var breedInput = document.querySelector("#breed-search");
var zipcodeInput = document.querySelector("#zip-code-search");
var dropDownItem = document.querySelector(".dropdown-menu");

// Extract Bearer Token
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
    console.log(expiration);
    console.log(bearerToken);
    fetchData(bearerToken);
  })
  .catch(error => console.log('error', error));

// Get Dog Data
function fetchData(bearerToken) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://api.petfinder.com/v2/animals?type=dog&page=1&location=91941&distance=50", requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log(result);
      console.log(result.animals[0].name);
      console.log(result.animals[0].age);
      console.log(result.animals[0].contact.email);
      console.log(result.animals[0].contact.phone);
      console.log(result.animals[0].contact.address);
      console.log(result.animals[0].description);
      console.log(result.animals[0].organization_id);
    })
    .catch(error => console.log('error', error));


  fetch("https://api.petfinder.com/v2/types/dog/breeds", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      for (let i = 0; i < result.breeds.length; i++) {
        const element = result.breeds[i];
        breedSearch
          .appendChild(document.createElement("option"))
          .value = element.name;
      }
    })
    .catch(error => console.log('error', error));

}

var formInput = function (event) {  
  event.preventDefault();
  var radiusSearch = event.target.textContent.split(" ");
  var radius = radiusSearch[0];
  var zipCode = zipcodeInput.value;
  var breed = breedInput.value;
  var parameters = `animals?type=dog&breed=${breed}&page=1&location=${zipCode}&distance=${radius}`;
  window.location.href = `https://dallassybrowsky.github.io/FidoFind/search_results.html?${parameters}`;
}

dropDownItem.addEventListener("click", formInput);

// Name
// Age
// Location
// For Radius, use distance attribute in API.
// Breed
// Description/Bio
// Contact info and Organization