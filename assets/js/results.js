var breedSearch = document.querySelector("#breed-list");
var breedInput = document.querySelector("#breed-search");
var zipcodeInput = document.querySelector("#zip-code-search");
var dropDownItem = document.querySelector(".dropdown-menu");
var resultsEl = document.querySelector(".search-results");
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

  fetch(`https://api.petfinder.com/v2/${parameters}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Start Appending
      console.log(result);
      for (i = 0; i < 20; i++) {
        var animal = result.animals[i];
        var name = result.animals[i].name;
        var age = result.animals[i].age;
        var croppedPhoto = result.animals[i].primary_photo_cropped; // secondary image to populate if null
        var photo = Boolean(croppedPhoto) ? croppedPhoto.full : './assets/images/no-photo.png';
        var email = animal.contact.email ?? 'No email provided';
        var phone = animal.contact.phone ?? 'No phone number given';
        if(animal.contact.phone){
            phone = animal.contact.phone;
        }
        var address = animal.contact.address?.address1 ?? 'No street address given';
        var city = animal.contact.address.city;
        var state = animal.contact.address.state;
        var zipcode = animal.contact.address.postcode;
        var description = animal.description;
        // var orgId = result.animals[i].organization_id;
        var distance = Math.round(result.animals[i].distance);
        if (distance === null) {
          var distance = `The distance to ${name} could not be determined.`
        } else {
          var distance = `${Math.round(result.animals[i].distance)} miles away from you.`;
        }
        resultsEl.appendChild(document.createElement("div")).className =
          "result-template";
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
          <h5 class="col-12">Location:</h5>
          <h5 class="col-9 org-address-1">${address}</h5>
          <h5 class="col-9 org-address-2">${city}, ${state} ${zipcode}</h5>
          <button
          class="refine-search col-10 d-flex justify-content-center"
          >
          Get Directions to ${name}!
          </button>
          <h5 class="col-9 distance">
          <span class="pet-name">${name}</span> is: ${distance}
          </h5>
          </div>
          </div>
          <div class="pet-info-contact col-3">
          <h4>Shelter Information:</h4>
          <a class="organization-URL justify-content-around"
          >${email}</a>
          <h5 class="organization-phone justify-content-around">${phone}</h5>
      </div>
    </div>`;
      }
      // Stop Appending
    })
    .catch((error) => console.log("error", error));    
}
