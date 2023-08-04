export = SpotifyAPI;
/**
 * An Object containing useful methods to create a Spotify Token and make calls to Spotify API.
 *
 * After a token has been created, this object will contain in addition to the settings provided in the constructor, a token object:
 *
 * @param {Object}  token - A SpotifyAPI token object
 * @param {String}  token.access_token  - The actual access token
 * @param {String}  token.token_type    - The token type (e.g. "Bearer")
 * @param {Number}  token.expires_in    - The amount of seconds that the token can be used for before it expires
 * @param {Number}  token.expires_in_ms - The amount of milliseconds that the token can be used for before it expires
 * @param {Number}  token.expire_time   - The Date.now() milliseconds on which the token will expire
 * @param {String}  token.scope         - A series of strings separated by a comma "," of the allowed authorization scopes
 * @param {Boolean} token.is_expired    - (Getter) Whether the token is expired
 */
declare class SpotifyAPI {
    /**
     * Extractes important information out of a Spotify URL
     * @param {String} url
     * @returns {Object<string>} An object that contains the url "hostname", its "query" as an object, the spotify item "type" and item "id"
     */
    static parseURL(url: string): any;
    /**
     * Creates a SpotifyAPI object with the provided settings
     * @param {Boolean} autoRefreshToken - The minefield width (1-based)
     * @returns {SpotifyAPI} A SpotifyAPI object
     */
    constructor({ autoRefreshToken }?: {autoRefreshToken: boolean});
    autoRefreshToken: any;
    token: {};
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
    authorizationCodeFlow(clientID: string, clientSecret: string, redirectURI: string, { scope, show_dialog }?: {
        scope: Array<string>;
        show_dialog: boolean;
    }): string;
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
    authorizationCodePKCEFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope: Array<string>;
        show_dialog: boolean;
    }): string;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow Client credentials flow} to get an authorization token
     *
     * Sets the created token's properties to the SpotifyAPI object "token" property
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} clientSecret The Spotify app Client Secret
     * @returns {Object} Returns the SpotifyAPI object "token" property
     */
    clientCredentialsFlow(clientID: string, clientSecret: string): any;
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
    implicitGrantFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope: Array<string>;
        show_dialog: boolean;
    }): string;
    /**
     * This method is not supposed to be used by itself!
     */
    requestToken(request: any, properties: any): Promise<{}>;
    /**
     * Sets the token with the provided properties
     * @returns {Object} Returns the SpotifyAPI object "token" property
     */
    setToken(properties: any): any;
    /**
     * This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
     * @param {Object} query The URL query parameters.
     * @returns {Object} Returns the SpotifyAPI object "token" property
     */
    resolveToken(query: any): any;
    /**
     * Tries to refresh the token using its "refresh" method
     * @returns {Object | null} Returns the SpotifyAPI object "token" property, or "null" if the token wasn't refreshed by the operation (Spotify API limits refreshes)
     */
    refreshToken(): any | null;
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
    request({ url, location, endpoint, query, method, headers, body, parser }?: {
        url?: String,
        location?: String,
        endpoint?: String,
        query?: Object,
        method?: String,
        headers?: Object,
        body?: any,
        parser?: Function
    }): any;
    /**
     * Shorthand for fetching a "search for item" request with limit 1 and type track, then returning the first item.
     * @param {String} searchQuery
     * @returns {Object} The request result
     */
    searchTrack(searchQuery: string): any;
}
//# sourceMappingURL=spoteasy.d.ts.map