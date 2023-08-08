# spoteasy
An easy-to-use zero-dependencies node.js wrapper for the Spotify API.

All versions are written in node.js v18.17.0 and have no dependencies.

Some of the most notable capabilities:
- Fetching a Spotify Token in each one of the [four ways]((https://developer.spotify.com/documentation/web-api/concepts/authorization)) specified in the Spotify API documentation;
- Generalized method to request **anything** from the api
- Token auto-refresh when expired


&nbsp;
## How to use

### Importing & Initialization
```js
const SpotifyAPI = require("spoteasy");
```

To fetch the Spotify API, you must first create a token. The purpose of this library is to make that as easy as possible. [There are four ways](https://developer.spotify.com/documentation/web-api/concepts/authorization) to create one, as described in the Spotify API documentation, and each one has its advantages and disadvantages.

Note that each method requires a Spotify Client ID (and sometimes a Spotify Client Secret). You can get both of them by creating an app in the [Spotify Dashboard](https://developer.spotify.com/dashboard) and accessing the app credentials.

I've made two examples that use the [Client Credentials Flow](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow) and the [Authorization Code PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)


&nbsp;
### [Client Credentials Flow](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow)
```js
let spoteasy = new SpotifyAPI()
await spoteasy.clientCredentialsFlow("<Client ID>", "<Client Secret>")
```

Adds a "token" property to the "spoteasy" object. The "token" property contains an object with various useful properties, beyond the actual access token.

Now let's try to fetch an album from the Spotify API, following the same rules in [their documentation](https://developer.spotify.com/documentation/web-api/reference/get-an-album):

<img src="https://i.imgur.com/8IcIyN3.png" width="1000"/>

```js
let request = {
  method: "GET",
  url: "https://open.spotify.com/album/6PFPjumGRpZnBzqnDci6qJ?si=4f75fc27072949c2",
  query: {
    market: "US"
  }
}
//the url gets parsed into the endpoint "/albums/6PFPjumGRpZnBzqnDci6qJ"

let response = await spoteasy.request(request)

console.log(response.tracks.items.map(items => items.name))
/*
  [
    'Papercut',
    'One Step Closer',
    'With You',
    'Points of Authority',
    'Crawling',
    'Runaway',
    'By Myself',
    'In the End',
    'A Place for My Head',
    'Forgotten',
    'Cure for the Itch',
    'Pushing Me Away'
  ]
*/
```


&nbsp;
### [Authorization Code PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
Once again, let's follow the Spotify API documentation to [create a playlist](https://developer.spotify.com/documentation/web-api/reference/create-playlist) in a logged user's account. To do this, we have to make the user log in into his spotify account. The next examples will use the express.js library to do that. (Note: they are very barebones implementations. For a real implementation, you should attach a SpotifyAPI object to every user that makes a request)

<img src="https://i.imgur.com/jqrXNCI.png" alt="Spotify Create Playlist Docs - Authorization Scopes" width="1000"/>

As you can see, it's stated that to do that we need two [authorization scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes): "playlist-modify-public" and "playlist-modify-private". We can pass them as arguments in the authorization code PKCE method, like any other token creation method (except for client credentials).

```js
const SpotifyAPI = require("spoteasy")
let spoteasy = new SpotifyAPI()

app.get("/auth", async (req, res) => {

  let url = spoteasy.authorizationCodePKCEFlow(
    "<Client ID>",
    "<Redirect URL>", //WARNING! you must whitelist this URL in the redirect URI section of the spotify app settings
    {
      scope: ["playlist-modify-public", "playlist-modify-private"]
    }
  )

  res.redirect(200, url)
})
```

This will redirect the user to the Spotify login page

Once the user has logged in, they will be redirected again to the specified "Redirect URL" parameter with a code in the url query, which needs to be passed as an argument to the "resolveToken" method.

Finally, calling the "resolveToken" method will create an access token in the "spoteasy" object.

Now let's try to create a playlist in a logged user's account by following the Spotify API documentation:

<img src="https://i.imgur.com/G9YvoZF.png" width="1000"/>

```js
app.get("/login", async (req, res) => {

  // Checking if the auth code is in the URL query & if token is waiting to be resolved
  if ("code" in req.query && "resolve" in spoteasy.token) { 

    // Waiting for the token to resolve with the URL query
    await spoteasy.resolveToken(req.query) 
  
    res.status(200).send({ info: "Login completed" })
  
    // The ID of the current user can be obtained via the Get Current User's Profile endpoint (/me)
    let userID = "<User ID>" 
  
    let request = {
      method: "POST",
      endpoint: `/users/${userID}/playlists`,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: "Hello World",
        public: false,
        description: "Your coolest playlist"
      })
    }
    let response = await spoteasy.request(request)
    
    // Print out the url of the just created playlist
    console.log( response.external_urls.spotify )
  }
  // If user rejected the authentication request
  else if ("error" in req.query) {
    res.status(401).send({ error: "Login rejected" })
  }
})
```

&nbsp;
## SpotifyAPI Object Methods
*Note that the methods and parameters are fully documented in the JSDOC methods comments*

| Method                    | Description
|:-:                        |:-
| **new SpotifyAPI()**      | Creates a SpotifyAPI object with some optional settings passed as argument, such as "autoRefreshToken".
| authorizationCodeFlow     | Uses the [Authorization code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) method to get an authorization token.
| authorizationCodePKCEFlow | Uses the [Authorization code PKCE flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) method to get an authorization token.
| clientCredentialsFlow     | Uses the [Client credentials flow](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow) method to get an authorization token.
| implicitGrantFlow         | Uses the [Implicit grant flow](https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow) method to get an authorization token.
| resolveToken              | This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
| setToken                  | Sets the token with the provided properties.
| refreshToken              | Tries to refresh the authorization token.
| request                   | Make an API request to the spotify API with the given options.
| searchTrack               | Shorthand for fetching a "search for item" request with limit 1 and type track, then returning the first item.
| (static) tracksParser     | The "request" method default parser. Adds a "parsed_tracks" property to the response which is an array of EVERY track found in it, even episodes.
| (static) parseURL         | Extractes important information out of a Spotify URL (like type and id).
| (static) isValidURL       | Returns true if a given string is a valid Spotify URL.


&nbsp;
## SpotifyAPI "token" properties
*These are the properties that the token object might have during or after its creation with one of the 4 methods*

| Property          | Description
|:-:                |:-
| access_token      | The actual access token
| token_type        | The token type (e.g. "Bearer")
| expires_in        | The amount of seconds that the token can be used for before it expires, starting from its creation
| expires_in_ms     | The amount of milliseconds that the token can be used for before it expires, starting from its creation
| expire_time       | The Date.now() milliseconds on which the token will expire
| scope             | A series of strings separated by a comma "," of the allowed authorization scopes
| refresh_timeout   | The Timeout object of the auto refresh
| expires_now_in    | (Getter) The amount of milliseconds that the token can be used for before it expires, starting from now
| is_expired        | (Getter) Whether the token is expired
| auto_refresh      | (Getter/Setter) Whether the token is going to automatically refresh when expired


&nbsp;
## Changelog & Breaking Changes
**Watch out for this section if you wish to migrate to a different version.** <br>

- **v1.1.0**: Added "searchTrack" method, declaration file & bugfixes. Removed minified version.

- **v1.2.0**: Added "tracksParser" parser, and placed it as the default parser of the "request" method.

- **v1.3.0**: Added "precautionSeconds" option on constructor. Also added "refresh_timeout", "expires_now_in" and "auto_refresh" token properties.
  - *v1.3.1*: Fixed bug where the "searchTrack" method wouldn't parse its track.

- **v1.4.0**: Added "isValidURL" method. Fixed trackParser bug regarding episodes.


&nbsp;
## Found a bug and/or need help?
Please [open an issue](https://github.com/zWolfrost/spoteasy/issues) on Github to request a change, report a bug or ask for help about something and i will gladly look into it.