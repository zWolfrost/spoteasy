"use strict"

const { createHash } = require("crypto");


/**
 * An Object containing useful methods to create a Spotify Token and make calls to Spotify API.
 * 
 * After a token has been created, this object will contain in addition to the settings provided in the constructor, a token object:
 * 
 * @param {Object}   token - A SpotifyAPI token object
 * @param {String}   token.access_token - The actual access token
 * @param {String}   token.token_type   - The token type
 * @param {Number}   token.expires_in   - The amount of seconds that the token can be used for before it expires
 * @param {Number}   token.expire_time  - The Date.now() milliseconds on which the token will expire
 * @param {Function} token.refresh      - A function that refreshes the token if possible
 * @param {String}   token.scope        - 
 * @param {Boolean}  token.is_expired   - (Getter) Whether the token is expired
 */
class SpotifyAPI
{
   /**
    * Creates a SpotifyAPI object with the provided settings
    * @property {Boolean} autoRefreshToken - The minefield width (1-based)
    * @returns {SpotifyAPI} A SpotifyAPI object
    */
   constructor({autoRefreshToken=true}={})
   {
      Object.assign(this, arguments)
      this.token = {}
   }

   
   /* AUTHORIZATION FLOWS */

   /**
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-flow Authorization code flow} to get an URL to the Spotify Login page
    * 
    * After the authentication, get a token by calling {@link getAuthURL} with the redirect URL query
    * 
    * @param {String} clientID The Spotify app Client ID
    * @param {String} clientSecret The Spotify app Client Secret
    * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
    * @param {Object} opts Optional settings on the authorization token behavior
    * @param {Array<String>} opts.scope The desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
    * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they’ve already done so
    * @returns {String} Returns the URL that the user has to open to authenticate.
    */
   authorizationCodeFlow(clientID, clientSecret, redirectURI, opts={scope: [], show_dialog: false})
   {
      let refreshFun = () =>
      {
         let request = createPostRequest(
            {
               grant_type: "refresh_token",
               refresh_token: this.token.refresh_token,
               client_id: clientID,
               client_secret: clientSecret,
            }
         )

         return this.setToken( this.requestToken(request), refreshFun )
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

         return this.setToken( this.requestToken(request), refreshFun )
      }

      return this.token.url = this.constructor.getAuthURL("code", clientID, redirectURI, opts)
   }

   /**
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow Authorization code PKCE flow} to get an authorization token
    * 
    * After the authentication, get a token by calling {@link getAuthURL} with the redirect URL query
    * 
    * @param {String} clientID The Spotify app Client ID
    * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
    * @param {Object} opts Optional settings on the authorization token behavior
    * @param {Array<String>} opts.scope The desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
    * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they’ve already done so
    * @returns {String} Returns the URL that the user has to open to authenticate.
    */
   authorizationCodePKCEFlow(clientID, redirectURI, opts={scope: [], show_dialog: false})
   {
      let refreshFun = () =>
      {
         let request = createPostRequest(
            {
               grant_type: "refresh_token",
               refresh_token: this.token.refresh_token,
               client_id: clientID
            }
         )

         return this.setToken( this.requestToken(request), refreshFun )
      }

      function generateCodeChallenge(codeVerifier)
      {
         const encoder = new TextEncoder();
         const data = encoder.encode(codeVerifier);
         const digest = createHash("sha256").update(data).digest("base64url");
         
         return digest;
      }

      let codeVerifier = generateRandomString(128);
      let codeChallenge = generateCodeChallenge(codeVerifier)
      opts.code_challenge = codeChallenge

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

         return this.setToken( this.requestToken(request), refreshFun )
      }

      return this.token.url = this.constructor.getAuthURL("code", clientID, redirectURI, opts)
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

      return this.setToken( this.requestToken(request), refreshFun )
   }

   /**
    * @deprecated
    * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow Implicit grant flow} to get an authorization token
    * 
    * After the authentication, get a token by calling {@link getAuthURL} with the redirect URL query
    * 
    * @param {String} clientID The Spotify app Client ID
    * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
    * @param {Object} opts Optional settings on the authorization token behavior
    * @param {Array<String>} opts.scope The desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
    * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they’ve already done so
    * @returns {String} Returns the URL that the user has to open to authenticate.
    */
   implicitGrantFlow(clientID, redirectURI, opts={scope: [], show_dialog: false})
   {
      this.token.resolve = this.setToken

      return this.token.url = this.constructor.getAuthURL("token", clientID, redirectURI, opts)
   }

   /**
    * This method is not supposed to be used by itself!
    */
   static getAuthURL(response_type, client_id, redirect_uri, { scope=[], show_dialog=false, code_challenge=undefined }={})
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


   /* TOKEN MANAGEMENT */

   /**
    * This method is not supposed to be used by itself!
    */
   async requestToken(request)
   {
      return fetch("https://accounts.spotify.com/api/token", request).then(res => res.json())
   }
   /**
    * This method is not supposed to be used by itself!
    */
   async setToken(token, refreshFun=undefined)
   {
      this.token = Promise.resolve(token)
      this.token = await this.token

      this.token = {
         ...this.token,

         expire_time: Date.now() + this.token.expires_in*1000,
         get is_expired() { return Date.now() > this.expire_time },

         refresh: refreshFun,
      }

      if (this.autoRefreshToken && refreshFun)
      {
         setTimeout(() => refreshFun(this.token), this.token.expires_in*1000)
      }

      return this.token
   }
   /**
    * This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
    * @param {Object} query The URL query parameters.
    * @returns Returns the SpotifyAPI object "token" property
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
    * Tries to refresh the token using its "refresh" method and "refresh_token" property
    * @returns Returns the SpotifyAPI object "token" property
    * @throws Error if the token can't be refreshed
    */
   async refreshToken()
   {
      let prevToken = this.token.access_token

      try
      {
         await this.token.refresh()
      } catch {}

      if (prevToken == this.token.access_token)
      {
         throw Error("This token can't be refreshed")
      }
      else if ("error" in this.token)
      {
         throw Error(this.token.error_description)
      }

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
    * @param {Function=} opts.parser An optional parser function to pass the request result before returning
    * @returns {Object} The request result
    */
   async request( {url=undefined, location="https://api.spotify.com/v1", endpoint=undefined, query={}, method="GET", headers=undefined, body=undefined, parser=undefined} )
   {
      if (url !== undefined)
      {
         let { type, id } = this.constructor.parseURL(url)

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

         endpoint = (ENDPOINTS[type]?.(id) ?? "") + endpoint
      }
      
      
      let reqURL = `${location}${endpoint}?${queryFromObject(query)}`

      let req = {
         method: method,
         headers: {...headers, "Authorization": `Bearer ${this.token.access_token}`},
         body: body
      }

      let res = await fetch(reqURL, req).then(res => res.json())
      
      if ("error" in res) throw new Error(res.error.message)


      if (parser) return parser(res)

      return res
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

         default: throw new Error("Invalid URL")
      }
   
      return parsed
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

function queryFromObject(obj)
{
   return new URLSearchParams(obj).toString()
}
function objectFromQuery(query)
{
   return Object.fromEntries(new URLSearchParams(query).entries());
}


module.exports = SpotifyAPI