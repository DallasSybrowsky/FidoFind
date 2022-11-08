
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

}

// Name
// Age
// Location
// For Radius, use distance attribute in API.
// Breed
// Description/Bio
// Contact info and Organization