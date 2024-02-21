# spoteasy
An easy-to-use zero-dependencies node.js wrapper for the Spotify API.

All versions are written in node.js v18.17.0 and have no dependencies.

Some of the most notable capabilities:
- Fetching a Spotify Token in **each one** of the [four ways](https://developer.spotify.com/documentation/web-api/concepts/authorization) specified in the Spotify API documentation;
- Simple & documented methods to request **anything** from the api;
- Access token **auto-refreshing**


&nbsp;
## How to use

Note free accounts can only be used for browsing and current playback status. Only premium accounts can be controlled (pause, play, next, etc.).

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
spoteasy.clientCredentialsFlow("<Client ID>", "<Client Secret>")
```

Adds a "token" property to the "spoteasy" object. The "token" property contains an object with [various useful properties](#spotifyapi-token-properties), beyond the actual access token.

For security reasons, do not hardcode the client ID and Secret in your code. Consider using environment variables or configuration files.

Now let's try to fetch an album from the Spotify API.

```js
// Same as spoteasy.getAlbum("6PFPjumGRpZnBzqnDci6qJ")
// Also, if you are in an async function, you can, of course, "await" the Promise.
spoteasy.getAlbum("https://open.spotify.com/album/6PFPjumGRpZnBzqnDci6qJ")
  .then(res => {
    let tracklist = res.tracks.items
    console.log(tracklist.map(track => track.name))
  })

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
Now let's create a playlist in a logged user's account. To do this, we have to make the user log in into his spotify account. The next example will use the express.js library to do that.
(Note: it's a very barebones implementation, useful only for explanation purposes.)

<img src="https://i.imgur.com/jqrXNCI.png" alt="Spotify Create Playlist Docs - Authorization Scopes" width="1000"/>

As you can see (and can also be seen from the JSDOC documentation), it's stated that to do that we need two [authorization scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes): "playlist-modify-public" and "playlist-modify-private". These tell spotify what we are about to do with the user's account. We can pass them as arguments in the authorization code PKCE method.

```js
const SpotifyAPI = require("spoteasy")
let spoteasy = new SpotifyAPI()

app.get("/auth", async (req, res) => {
  // If the URL query is empty (thus user hasn't logged in yet).
  if (Object.keys(req.query).length === 0) {
    // Create the Spotify authentication URL, using the authorization code PKCE flow.
    let url = spoteasy.authorizationCodePKCEFlow(
      // Your Spotify Client ID.
      "<Client ID>",
      // Redirect back to this URL after the user logs in.
      // WARNING! you must whitelist this URL in the redirect URI section of the spotify app settings.
      "https://whatever.webpage.com/auth",
      {
        // The scopes that the user will be asked to authorize.
        scope: ["playlist-modify-public", "playlist-modify-private"]
      }
    )

    // Redirect the user to the Spotify authentication page.
    res.status(100).redirect(url)
  }
  // If the auth code is in the URL query (thus user was redirected back from the spotify auth page).
  // & if the token is waiting to be resolved.
  else if ("code" in req.query && "resolve" in spoteasy.token) {
    // Resolve the authentication code in the URL query to finally create the access token.
    await spoteasy.resolveToken(req.query)

    // We are now logged in. Let's create a playlist.
    // The ID of the current user can be obtained via the Get Current User's Profile endpoint
    let currentUser = await spoteasy.getCurrentUserProfile()

    // Create a playlist in the user's account.
    let response = await spoteasy.createPlaylist(currentUser.id, {
      name: "Hello World",
      public_playlist: false,
      description: "Your coolest playlist"
    })

    // Print out the url of the just created playlist
    console.log( response.external_urls.spotify )

    // Do whatever after the user logs in.
    res.status(202).redirect("https://whatever.webpage.com/")
  }
  // If user rejected the authentication request.
  else {
    // Do whatever after the user rejects the authentication request.
    res.status(401).redirect("https://whatever.webpage.com/")
  }
})
```


&nbsp;
## SpotifyAPI Constructor Options

| Option            | Description
|:-:                |:-
| autoRefreshToken  | Whether to set the token to auto-refresh when expired on its creation.
| precautionSeconds | Seconds to tick off of token.expires_in to try refresh the token in advance before it expires. Recommended 2 to 5.
| awaitToken        | If true, and a token creation is in progress, makes any request wait for the token to be created before continuing.
| responseParser    | The response parser to apply to any API response.
| defaultMarket     | The default country market to apply to requests options.


&nbsp;
## SpotifyAPI Object Main Methods
**Note that the methods and parameters are fully documented in the JSDOC methods comments*

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
| (static) tracksParser     | The "request" method default parser. Adds a "parsed_tracks" property to the response which is an array of EVERY track found in it, even episodes.
| (static) parseURL         | Extractes important information out of a Spotify URL (like type and id).
| (static) isValidURL       | Returns true if a given string is a valid Spotify URL.
| ...other...               | getArtistTopTracks, followPlaylist, getPlaybackState... There is a method for every SpotifyAPI endpoint, fully documented in JSDOC.
| searchTrack               | Shorthand for fetching a "search for item" request with limit 1 and type track, then returning the first item.
| getMagic                  | Returns an API response based on the argument (either a search query or a Spotify URL).


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
| scope             | An array of the allowed authorization scopes
| refresh_timeout   | The Timeout object of the auto refresh
| expires_now_in    | (Getter) The amount of milliseconds that the token can be used for before it expires, starting from now
| is_expired        | (Getter) Whether the token is expired
| auto_refresh      | (Getter/Setter) Whether the token is going to automatically refresh when expired
| promise           | When creating or refreshing token, this will be the fetch request Promise


&nbsp;
## Changelog & Breaking Changes
**Watch out for this section if you wish to migrate to a different version.** <br>

- **v1.1.0**:
<br>- Added "searchTrack" method
<br>- Added declaration file.
<br>- Removed minified version.

- **v1.2.0**:
<br>- Added "tracksParser" parser, and placed it as the default parser of the "request" method.

- **v1.3.0**:
<br>- Added "precautionSeconds" option on constructor.
<br>- Added "refresh_timeout", "expires_now_in" and "auto_refresh" token properties.
  - v1.3.1:
  <br>- Fixed bug where the "searchTrack" method wouldn't parse its track.

  <br>

- **v1.4.0**
<br>- Added "isValidURL" method.
<br>- Fixed trackParser bug regarding episodes.

- **v1.5.0**:
<br>- Added a shorthand for every SpotifyAPI endpoint as of this version upload date.
<br>- Added a "defaultMarket" option on constructor.
<br>- Fixed a bug where an empty response would throw an Exception.

- **v1.6.0**:
<br>- Added URL "id", "ids" and "uris" parsing for every SpotifyAPI endpoint shorthand.
  - v1.6.1:
  <br>- Fixed bug where the "public_playlist" property won't work.
  - v1.6.2:
  <br>- Updated spoteasy declaration file.

  <br>

- **v1.7.0**:
<br>- Added "getMagic" method.
<br>- Added "responseParser" option on constructor.
<br>- Added "promise" token property.
<br>- Fixed declaration file link in package.json.
  - v1.7.1:
  <br>- Fixed wrong JSDOC parameter types.
  <br>- Fixed "startOrResumePlayback" method that won't parse URIs.

  <br>

- **v1.8.0**:
<br>- Added "awaitToken" option on constructor.
<br>- Fixed broken JSDOC optional parameters types, caused by patch v1.7.1

- **v2.0.0**:
<br>- Removed "parser" option from "request" method. You can choose the response parser by setting the "responseParser" property either in the constructor or whenever you need it in the SpotifyAPI class object.
<br>- Made "scope" property in the token obect an Array of scopes, instead of a string of scopes separated by a space " ".
<br>- Made "image" parameter an optional one in the method "addCustomPlaylistCover".
<br>- Made "searchTrack" method return the actual response, not only the parsed track (This will also affect the "getMagic" method).
<br>- Fixed bug where a track object with no external url would crash "trackParser".

- **v2.1.0**:
<br>- Updated shorthands so that they use body instead of query when possible to send requests (to avoid exceeding the maximum length of the request URI).
<br>- Fixed bugs where a lot of Playlists related shorthands used body instead of query to send requests or viceversa, making them unusable.
<br>- Fixed bugs where some shorthands wouldn't parse given URLs/URIs

- **v2.2.0**:
<br>- Added "trackParser" support for getting several albums. This might also generally fix some bugs with the parser, as the previously used method was changed to a more flexible one.

- **v3.0.0**:
<br>- Completely migrated to TypeScript.
<br>- Updated parameters to the ones accepted by current Spotify API.
<br>- Made "name" parameter in the "createPlaylist" method mandatory, and moved it out of the "options" object.
<br>- Made "seed_artists", "seed_genres" and "seed_tracks" parameters in the "getRecommendations" method optional, and moved them in the "options" object.
<br>- Fixed wrong parameter types & a few bugs.


&nbsp;
## Found a bug and/or need help?
Please [open an issue](https://github.com/zWolfrost/spoteasy/issues) on Github to request a change, report a bug or ask for help about something and i will gladly look into it.

If you like this library, consider giving it a star on [Github](https://github.com/zWolfrost/spoteasy). It means a lot :)