"use strict"

/**
 * An Object containing useful methods to create a Spotify Token and make calls to Spotify API.
 *
 * After a token has been created, this object will contain in addition to the settings provided in the constructor, a token object:
 *
 * @param {Object}  token - A SpotifyAPI token object
 * @param {String}  token.access_token    - The actual access token
 * @param {String}  token.token_type      - The token type (e.g. "Bearer")
 * @param {Number}  token.expires_in      - The amount of seconds that the token can be used for before it expires, starting from its creation
 * @param {Number}  token.expires_in_ms   - The amount of milliseconds that the token can be used for before it expires, starting from its creation
 * @param {Number}  token.expire_time     - The Date.now() milliseconds on which the token will expire
 * @param {String}  token.scope           - A series of strings separated by a comma "," of the allowed authorization scopes
 * @param {Object}  token.refresh_timeout - The Timeout object of the auto refresh
 * @param {Number}  token.expires_now_in  - (Getter) The amount of milliseconds that the token can be used for before it expires, starting from now
 * @param {Boolean} token.is_expired      - (Getter) Whether the token is expired
 * @param {Boolean} token.auto_refresh    - (Getter/Setter) Whether the token is going to automatically refresh when expired
 * @param {String}  token.error             - If the token creation was unsuccessful, displays the type of error encountered
 * @param {String}  token.error_description - If the token creation was unsuccessful, displays the description of the error encountered
 */
class SpotifyAPI
{
   /**
    * Creates a SpotifyAPI object with the provided default settings
    * @param {Boolean} autoRefreshToken Sets the token to auto-refresh when expired on its creation
    * @param {Number} precautionSeconds Seconds to tick off of token.expires_in to try refresh the token in advance before it expires. Recommended 2 to 5.
    * @returns {SpotifyAPI} A SpotifyAPI object
    */
   constructor({autoRefreshToken=true, precautionSeconds=5}={})
   {
      this.autoRefreshToken = autoRefreshToken
      this.precautionSeconds = precautionSeconds
      this.token = {}
   }


   /* AUTHORIZATION FLOWS */

   /**
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-flow Authorization code flow} to get an URL to the Spotify Login page
    *
    * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
    *
    * @param {String} clientID The Spotify app Client ID
    * @param {String} clientSecret The Spotify app Client Secret
    * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
    * @param {Object} opts Optional settings on the authorization token behavior
    * @param {Array<String>} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
    * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they’ve already done so
    * @returns {String} Returns the URL that the user has to open to authenticate.
    */
   authorizationCodeFlow(clientID, clientSecret, redirectURI, {scope=[], show_dialog=false}={})
   {
      let refreshFun = () =>
      {
         if (this.token.refresh_token)
         {
            let request = createPostRequest(
               {
                  grant_type: "refresh_token",
                  refresh_token: this.token.refresh_token,
                  client_id: clientID,
                  client_secret: clientSecret,
               }
            )

            return this.requestToken(request)
               .then(token => this.setToken({...token, refresh: refreshFun}))
         }
      }

      this.token.resolve = (authCode) =>
      {
         let request = createPostRequest(
            {
               grant_type: "authorization_code",
               code: authCode.code ?? authCode,
               redirect_uri: redirectURI,
               client_id: clientID,
               client_secret: clientSecret,
            }
         )

         return this.requestToken(request)
         .then(token => this.setToken({...token, refresh: refreshFun}))
      }

      return this.token.url = getAuthURL("code", clientID, redirectURI, {scope: scope, show_dialog: show_dialog})
   }

   /**
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow Authorization code PKCE flow} to get an authorization token
    *
    * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
    *
    * @param {String} clientID The Spotify app Client ID
    * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
    * @param {Object} opts Optional settings on the authorization token behavior
    * @param {Array<String>} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
    * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they’ve already done so
    * @returns {String} Returns the URL that the user has to open to authenticate.
    */
   authorizationCodePKCEFlow(clientID, redirectURI, {scope=[], show_dialog=false}={})
   {
      let refreshFun = () =>
      {
         if (this.token.refresh_token)
         {
            let request = createPostRequest(
               {
                  grant_type: "refresh_token",
                  refresh_token: this.token.refresh_token,
                  client_id: clientID
               }
            )

            return this.requestToken(request)
               .then(token => this.setToken({...token, refresh: refreshFun}))
         }
      }

      function generateCodeChallenge(codeVerifier)
      {
         const encoder = new TextEncoder();
         const data = encoder.encode(codeVerifier);
         const digest = require("crypto").createHash("sha256").update(data).digest("base64url");

         return digest;
      }

      let codeVerifier = generateRandomString(128);
      let codeChallenge = generateCodeChallenge(codeVerifier)

      this.token.resolve = (authCode) =>
      {
         let request = createPostRequest(
            {
               grant_type: "authorization_code",
               code: authCode.code ?? authCode,
               redirect_uri: redirectURI,
               client_id: clientID,
               code_verifier: codeVerifier,
            }
         )

         return this.requestToken(request)
            .then(token => this.setToken({...token, refresh: refreshFun}))
      }

      return this.token.url = getAuthURL("code", clientID, redirectURI, {scope: scope, show_dialog: show_dialog, code_challenge: codeChallenge})
   }

   /**
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow Client credentials flow} to get an authorization token
    *
    * Sets the created token's properties to the SpotifyAPI object "token" property
    *
    * @param {String} clientID The Spotify app Client ID
    * @param {String} clientSecret The Spotify app Client Secret
    * @returns {Object} Returns the SpotifyAPI object "token" property
    */
   clientCredentialsFlow(clientID, clientSecret)
   {
      let refreshFun = () =>
      {
         this.clientCredentialsFlow(...arguments)
      }

      let request = createPostRequest(
         {
            grant_type: "client_credentials",
            client_id: clientID,
            client_secret: clientSecret,
         }
      )

      return this.requestToken(request)
         .then(token => this.setToken({...token, refresh: refreshFun}))
   }

   /**
    * @deprecated This authentication flow is not secure and the URL query is an hash fragment, so the client needs to send the query to the server! Use {@link authorizationCodePKCEFlow} instead.
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow Implicit grant flow} to get an authorization token
    *
    * After the authentication, set the token by calling {@link setToken} with the redirect URL query
    *
    * @param {String} clientID The Spotify app Client ID
    * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
    * @param {Object} opts Optional settings on the authorization token behavior
    * @param {Array<String>} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
    * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they’ve already done so
    * @returns {String} Returns the URL that the user has to open to authenticate.
    */
   implicitGrantFlow(clientID, redirectURI, {scope=[], show_dialog=false}={})
   {
      this.token.resolve = this.setToken

      return this.token.url = SpotifyAPI.getAuthURL("token", clientID, redirectURI, {scope: scope, show_dialog: show_dialog})
   }


   /* TOKEN MANAGEMENT */

   /**
    * This method is not supposed to be used by itself!
    */
   async requestToken(request)
   {
      let res = await fetch("https://accounts.spotify.com/api/token", request).then(res => res.json())

      if ("error" in res) throw new Error(res.error_description ?? res.error.message)

      return res
   }

   /**
    * Sets the token with the provided properties
    * @returns {Object} Returns the SpotifyAPI object "token" property
    */
   setToken(properties)
   {
      properties.expires_in -= this.precautionSeconds

      this.token = {
         ...properties,

         expires_in_ms: properties.expires_in*1000,
         expire_time: Date.now() + properties.expires_in*1000,
         get expires_now_in() { return this.expire_time - Date.now() },
         get is_expired() { return Date.now() > this.expire_time },
         get auto_refresh() { return Boolean(this.refresh_timeout) },
         set auto_refresh(bool)
         {
            if (bool != this.auto_refresh)
            {
               if (bool)
               {
                  this.refresh_timeout = setTimeout(() => this?.refresh(), this.expires_now_in)
               }
               else
               {
                  clearTimeout(this.refresh_timeout)
                  delete this.refresh_timeout
               }
            }
         }
      }

      if (this.autoRefreshToken) this.token.auto_refresh = true

      return this.token
   }

   /**
    * This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
    * @param {Object} query The URL query parameters.
    * @returns {Object} Returns the SpotifyAPI object "token" property
    */
   async resolveToken(query)
   {
      let queryobj = objectFromQuery(query)
      if (queryobj[query] !== "") query = objectFromQuery(query)

      try
      {
         return this.token.resolve(query)
      }
      catch
      {
         throw Error("Query is invalid")
      }
   }

   /**
    * Tries to refresh the token using its "refresh" method
    * @returns {Object | null} Returns the SpotifyAPI object "token" property, or "null" if the token wasn't refreshed by the operation (Spotify API limits refreshes)
    */
   async refreshToken()
   {
      let prevToken;

      try
      {
         prevToken = this.token.access_token
      }
      catch
      {
         throw Error("There is no token to refresh")
      }

      await this.token?.refresh()

      if ("error" in this.token) throw Error(this.token.error_description)
      if (prevToken == this.token.access_token) return null

      return this.token
   }


   /* API REQUESTS */

   /**
    * Make an API request to the spotify API with the given parameters
    * @example spoteasy.request({
    *    url: "https://open.spotify.com/album/6PFPjumGRpZnBzqnDci6qJ?si=4f75fc27072949c2",
    * })
    * // opts.url => opts.endpoint = `/albums/${id}`
    *
    * @example spoteasy.request({
    *    method: "POST",
    *    endpoint: `/users/${userID}/playlists`,
    *    headers: {"Content-Type": "application/json"},
    *    body: JSON.stringify({
    *    name: "Hello World",
    *    public: false,
    *    description: "Your coolest playlist"
    * })
    *
    * @param {String=} opts.url The URL of the spotify item, which will be converted into its respective endpoint. If a match is found, it gets prepended to the endpoint property.
    * @param {String=} opts.location The URL location to make a request at
    * @param {String=} opts.endpoint The URL endpoint to make a request at
    * @param {Object=} opts.query The query to add to the endpoint
    * @param {String=} opts.method The request method
    * @param {Object=} opts.headers The request headers
    * @param {any=} opts.body The request body
    * @param {Function=} opts.parser An optional parser function to pass the request result before returning. The default one is {@link tracksParser}
    * @returns {Object} The request result
    */
   async request( {url=undefined, location="https://api.spotify.com/v1", endpoint="", query={}, method="GET", headers=undefined, body=undefined, parser=SpotifyAPI.tracksParser} )
   {
      if (url)
      {
         endpoint = SpotifyAPI.parseURL(url).endpoint + endpoint
      }

      let reqURL = `${location}${endpoint}?${queryFromObject(query)}`

      let req = {
         method: method,
         headers: {...headers, "Authorization": `Bearer ${this.token.access_token}`},
         body: body
      }

      let res = await fetch(reqURL, req).then(res => res.json())

      if ("error" in res) throw new Error(res.error_description ?? res.error.message)

      if (parser) return parser(res)

      return res
   }

   /**
    * Shorthand for fetching a "search for item" request with limit 1 and type track, then returning the first item.
    * @param {String} searchQuery
    * @returns {Object} The request result
    */
   async searchTrack(searchQuery)
   {
      let searchRequest = {
         endpoint: "/search",
         query: {
            q: searchQuery,
            type: "track",
            limit: 1
         }
      }

      let searchResult = await this.request(searchRequest)

      return searchResult.parsed_tracks?.[0] ?? null
   }


   /* RESPONSE PARSERS */

   /**
    * The "{@link request}" method default parser.
    *
    * If tracks are found, this parser will add a "parsed_tracks" property to the response which is an array of EVERY track found in it, even episodes.
    *
    * Then it will also add some handy properties to every track in this array:
    * @param authors An array of all the artists' names;
    * @param cover The track cover (points to the album cover if the track is part of one);
    * @param query A string of relevant track words (title, artists and album) separated by a space for searching purposes
    * @param title Same as query, but the relevant information is separated by relevant characters for displaying purposes, e.g. "Title - Artist1, Artist2 (Album)"
    * @param url Shorthand for external_urls.spotify (the track's Spotify URL)
    *
    * @returns {Object} A parsed response
    */
   static tracksParser(...response)
   {
      return require("./tracksParser")(...response)
   }


   /* UTILS METHODS */

   /**
    * Extractes important information out of a Spotify URL
    * @param {String} url
    * @returns {Object<string>} An object that contains the url "hostname", its "query" as an object, the spotify item "type" and item "id"
    */
   static parseURL(url)
   {
      let urlobj = new URL(url)

      let parsed = {hostname: urlobj.hostname};


      switch (urlobj.hostname)
      {
         case "open.spotify.com":
            parsed.query = objectFromQuery(urlobj.search);
            [parsed.type, parsed.id] = urlobj.pathname.slice(1).split("/")
            break;

         case "api.spotify.com":
            parsed.query = objectFromQuery(urlobj.search);
            if ("ids" in parsed.query)
            {
               parsed.type = urlobj.pathname.split("/").at(-1).slice(0, -1)
            }
            else
            {
               [parsed.type, parsed.id] = urlobj.pathname.split("/").slice(2)
               parsed.type = parsed.type.slice(0, -1)
            }

            break;

         case "":
            [parsed.type, parsed.id] = urlobj.pathname.split(":")
            break;

         default: throw new Error("Invalid or unsupported URL")
      }


      const ENDPOINTS = {
         "album": id => `/albums/${id}`,
         "artist": id => `/artists/${id}`,
         "audiobook": id => `/audiobooks/${id}`,
         "chapter": id => `/chapters/${id}`,
         "episode": id => `/episodes/${id}`,
         "playlist": id => `/playlists/${id}`,
         "show": id => `/shows/${id}`,
         "track": id => `/tracks/${id}`,
         "user": id => `/users/${id}`,
      }

      parsed.endpoint = parsed.type in ENDPOINTS ? ENDPOINTS[parsed.type](parsed.id) : ""

      return parsed
   }

   /**
    * Returns true if a given string is a valid Spotify URL
    * @param {String} string The string to verify
    * @returns {Boolean} Whether the passed string is a valid Spotify URL
    */
   static isValidURL(string)
   {
      try
      {
         SpotifyAPI.parseURL(string)
      }
      catch
      {
         return false
      }

      return true
   }
}

function generateRandomString(length)
{
   let text = "";
   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (let i = 0; i < length; i++)
   {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   }

   return text;
}
function createPostRequest(body)
{
   return {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: queryFromObject(body)
   }
}
function getAuthURL(response_type, client_id, redirect_uri, {scope=[], show_dialog=false, code_challenge=undefined}={})
{
   let query =
   {
      client_id: client_id,
      response_type: response_type,
      redirect_uri: redirect_uri,
      state: generateRandomString(16),
      scope: scope.join(" "),
      show_dialog: show_dialog,
   }

   if (code_challenge)
   {
      query.code_challenge_method = "S256"
      query.code_challenge = code_challenge
   }

   return `https://accounts.spotify.com/authorize?${queryFromObject(query)}`
}

function queryFromObject(obj)
{
   return new URLSearchParams(obj).toString()
}
function objectFromQuery(query)
{
   return Object.fromEntries(new URLSearchParams(query).entries());
}


module.exports = SpotifyAPI