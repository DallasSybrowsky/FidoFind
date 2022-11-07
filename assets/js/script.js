
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
    console.log(bearerToken);
  })
  .catch(error => console.log('error', error));