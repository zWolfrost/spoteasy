export = SpotifyAPI;
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
declare class SpotifyAPI {
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
    static tracksParser(...response: any[]): any;
    /**
     * Extractes important information out of a Spotify URL
     * @param {String} url
     * @returns {Object<string>} An object that contains the url "hostname", its "query" as an object, the spotify item "type" and item "id"
     * @throws Error if URL is invalid or unsupported.
     */
    static parseURL(url: string): any;
    /**
     * Returns true if a given string is a valid Spotify URL
     * @param {String} string The string to verify
     * @returns {Boolean} Whether the passed string is a valid Spotify URL
     */
    static isValidURL(string: string): boolean;
    /**
     * Creates a SpotifyAPI object with the provided default settings
     * @param {Object} opts Optional settings
     * @param {Boolean} opts.autoRefreshToken Sets the token to auto-refresh when expired on its creation
     * @param {Number} opts.precautionSeconds Seconds to tick off of token.expires_in to try refresh the token in advance before it expires. Recommended 2 to 5.
     * @param {String} opts.defaultMarket Default country market to apply to requests options
     * @returns {SpotifyAPI} A SpotifyAPI object
     */
    constructor({ autoRefreshToken, precautionSeconds, defaultMarket }?: {
        autoRefreshToken: boolean;
        precautionSeconds: number;
        defaultMarket: string;
    });
    autoRefreshToken: boolean;
    precautionSeconds: number;
    defaultMarket: string;
    token: {};
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-flow Authorization code flow} to get an URL to the Spotify Login page
     *
     * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} clientSecret The Spotify app Client Secret
     * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param {Object} opts Optional settings
     * @param {Array<String>} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
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
     * @param {Object} opts Optional settings
     * @param {Array<String>} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
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
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow Implicit grant flow} to get an authorization token
     *
     * After the authentication, set the token by calling {@link setToken} with the redirect URL query
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param {Object} opts Optional settings
     * @param {Array<String>} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param {Boolean} opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns {String} Returns the URL that the user has to open to authenticate.
     */
    implicitGrantFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope: Array<string>;
        show_dialog: boolean;
    }): string;
    /**
     * Requests a Spotify Access Token based on a request
     * @returns {Promise} Returns the Promise of the Spotify API token
     * @throws Error if response has an "error" property.
     */
    requestToken(request: any): Promise<any>;
    /**
     * Sets the token with the provided properties
     * @returns {Object} Returns the SpotifyAPI object "token" property
     */
    setToken(properties: any): any;
    /**
     * This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
     * @param {Object} query The URL query parameters.
     * @returns {Object} Returns the SpotifyAPI object "token" property.
     * @throws Error if query is invalid.
     */
    resolveToken(query: any): any;
    /**
     * Tries to refresh the token using its "refresh" method
     * @returns {Object | null} Returns the SpotifyAPI object "token" property, or "null" if the token wasn't refreshed by the operation (Spotify API limits refreshes)
     * @throws Error if there is no token or if token has an "error" property at the end of the refresh.
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
     * @param {Object} opts Optional settings
     * @param {String=} opts.url The URL of the spotify item, which will be converted into its respective endpoint. If a match is found, it gets prepended to the endpoint property.
     * @param {String=} opts.location The URL location to make a request at
     * @param {String=} opts.endpoint The URL endpoint to make a request at
     * @param {Object=} opts.query The query to add to the endpoint
     * @param {String=} opts.method The request method
     * @param {Object=} opts.headers The request headers
     * @param {any=} opts.body The request body
     * @param {Function=} opts.parser An optional parser function to pass the request result before returning. The default one is {@link tracksParser}
     * @returns {Promise} The Promise of the response. If the response is empty, returns the response HTML status code.
     * @throws Error if response has an "error" property.
     */
    request({ url, location, endpoint, query, method, headers, body, parser }: {
        url?: string | undefined;
        location?: string | undefined;
        endpoint?: string | undefined;
        query?: any | undefined;
        method?: string | undefined;
        headers?: any | undefined;
        body?: any | undefined;
        parser?: Function | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single album.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-album Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the album.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} An album.
     */
    getAlbum(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-albums Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of albums.
     */
    getSeveralAlbums(ids: Array<string>, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information about an album's tracks.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-albums-tracks Spotify API Reference}.
     *
     * @param {String} idThe Spotify URL or ID of the album.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of tracks.
     */
    getAlbumTracks(id: any, { market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of albums.
     */
    getUserSavedAlbums({ market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Save one or more albums to the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-albums-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns The album is saved.
     */
    saveAlbumsforCurrentUser(ids: Array<string>): Promise<any>;
    /**
     * Remove one or more albums from the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-albums-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns Album(s) have been removed from the library.
     */
    removeUserSavedAlbums(ids: Array<string>): Promise<any>;
    /**
     * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-albums Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkUserSavedAlbums(ids: Array<string>): Array<boolean>;
    /**
     * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-new-releases Spotify API Reference}.
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} A paged set of albums.
     */
    getNewReleases({ market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artist Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @returns {Object} An artist.
     */
    getArtist(id: string): any;
    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the artists. Maximum: 20 IDs.
     * @returns {Object} A set of artists.
     */
    getSeveralArtists(ids: Array<string>): any;
    /**
     * Get Spotify catalog information about an artist's albums.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-albums Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @param {Object} opts Optional settings
     * @param {Array<String>} opts.include_groups A single string or an array of keywords that will be used to filter the response. If not supplied, all album types will be returned.
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of albums.
     */
    getArtistAlbums(id: string, { include_groups, market, limit, offset }?: {
        include_groups: Array<string>;
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get Spotify catalog information about an artist's top tracks by country.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-top-tracks Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of tracks.
     */
    getArtistTopTracks(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-related-artists Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @returns {Object} A set of artists.
     */
    getArtistRelatedArtists(id: string): any;
    /**
     * Get Spotify catalog information for a single audiobook. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-audiobook Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the audiobook.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} An Audiobook.
     */
    getAudiobook(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for several audiobooks identified by their Spotify IDs. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-audiobooks Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of audiobooks.
     */
    getSeveralAudiobooks(ids: Array<string>, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information about an audiobook's chapters. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audiobook-chapters Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the audiobook.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of chapters.
     */
    getAudiobookChapters(id: string, { market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-audiobooks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of audiobooks.
     */
    getUserSavedAudiobooks({ limit, offset }?: {
        limit: number;
        offset: number;
    }): any;
    /**
     * Save one or more audiobooks to the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-audiobooks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Audiobook(s) are saved to the library.
     */
    saveAudiobooksForCurrentUser(ids: Array<string>): Promise<any>;
    /**
     * Remove one or more audiobooks from the Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-audiobooks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Audiobook(s) have been removed from the library.
     */
    removeUserSavedAudiobooks(ids: Array<string>): Promise<any>;
    /**
     * Check if one or more audiobooks are already saved in the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-audiobooks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkUserSavedAudiobooks(ids: Array<string>): Array<boolean>;
    /**
     * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-categories Spotify API Reference}.
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {String} opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} A paged set of categories.
     */
    getSeveralBrowseCategories({ country, locale, limit, offset }?: {
        country: string;
        locale: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-category Spotify API Reference}.
     *
     * @param {String} category_id The Spotify category ID for the category.
     * @param {Object} opts Optional settings
     * @param {String} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {String} opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @returns {Object} A category.
     */
    getSingleBrowseCategory(category_id: string, { country, locale }?: {
        country: string;
        locale: string;
    }): any;
    /**
     * Get Spotify catalog information for a single chapter. Note: Chapters are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-chapter Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the chapter.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A Chapter.
     */
    getChapter(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for several chapters identified by their Spotify IDs. Note: Chapters are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-chapters Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of chapters.
     */
    getSeveralChapters(ids: Array<string>, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-episode Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-position"
     *
     * @param {String} id The Spotify URL or ID for the episode.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} An episode.
     */
    getEpisode(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for several episodes based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-position"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the episodes. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of episodes.
     */
    getSeveralEpisodes(ids: Array<string>, { market }?: {
        market: string;
    }): any;
    /**
     * Get a list of the episodes saved in the current Spotify user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     * - "user-read-playback-position"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of episodes.
     */
    getUserSavedEpisodes({ market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Save one or more episodes to the current user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-episodes-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Episode saved.
     */
    saveEpisodesForCurrentUser(ids: Array<string>): Promise<any>;
    /**
     * Remove one or more episodes from the current user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-episodes-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Episode removed.
     */
    removeEpisodesForCurrentUser(ids: Array<string>): Promise<any>;
    /**
     * Check if one or more episodes is already saved in the current Spotify user's 'Your Episodes' library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkEpisodesForCurrentUser(ids: Array<string>): Array<boolean>;
    /**
     * Retrieve a list of available genres seed parameter values for recommendations.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres Spotify API Reference}.
     *
     * @returns {Object} A set of genres.
     */
    getAvailableGenreSeeds(): any;
    /**
     * Get the list of markets where Spotify is available.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-available-markets Spotify API Reference}.
     *
     * @returns {Object} A markets object with an array of country codes.
     */
    getAvailableMarkets(): any;
    /**
     * Get information about the user's current playback state, including track or episode, progress, and active device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Array<String>} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Object} Information about playback.
     */
    getPlaybackState({ market, additional_types }?: {
        market: string;
        additional_types: Array<string>;
    }): any;
    /**
     * Transfer playback to a new device and determine if it should start playing.
     * {@link https://developer.spotify.com/documentation/web-api/reference/transfer-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Array<String>} device_ids An array containing the ID of the device on which playback should be started/transferred.
     * @param {Object} opts Optional settings
     * @param {Boolean} opts.play Whether to ensure playback happens on new device. Otherwise keep the current playback state.
     * @returns Playback transferred.
     */
    transferPlayback(device_ids: Array<string>, { play }?: {
        play: boolean;
    }): Promise<any>;
    /**
     * Get information about a user's available devices.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @returns {Object} A set of devices.
     */
    getAvailableDevices(): any;
    /**
     * Get the object currently being played on the user's Spotify account.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-currently-playing"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Array<String>} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Object} Information about the currently playing track.
     */
    getCurrentlyPlayingTrack({ market, additional_types }?: {
        market: string;
        additional_types: Array<string>;
    }): any;
    /**
     * Start a new context or resume current playback on the user's active device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @param {String} opts.context_uri Spotify URI of the context to play. Valid contexts are albums, artists & playlists.
     * @param {Array<String>} opts.uris A string or an array of the Spotify track URIs to play.
     * @param {Object<Number, String>} opts.offset Indicates from where in the context playback should start. Only available when context_uri corresponds to an album or playlist object "position" is zero based and can't be negative.
     * @param {Number} opts.position_ms The position in ms.
     * @returns Playback started.
     */
    startOrResumePlayback({ device_id, context_uri, uris, offset, position_ms }?: {
        device_id: string;
        context_uri: string;
        uris: Array<string>;
        offset: any;
        position_ms: number;
    }): Promise<any>;
    /**
     * Pause playback on the user's account.
     * {@link https://developer.spotify.com/documentation/web-api/reference/pause-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Playback paused.
     */
    pausePlayback({ device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Skips to next track in the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-next-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    skipToNext({ device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Skips to previous track in the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-previous-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    skipToPrevious({ device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Seeks to the given position in the user's currently playing track.
     * {@link https://developer.spotify.com/documentation/web-api/reference/seek-to-position-in-currently-playing-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Number} position_ms The position in milliseconds to seek to. Must be a positive number. Passing in a position that is greater than the length of the track will cause the player to start playing the next song.
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    skipToPosition(position_ms: number, { device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Set the repeat mode for the user's playback. Options are repeat-track, repeat-context, and off.
     * {@link https://developer.spotify.com/documentation/web-api/reference/set-repeat-mode-on-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {String} state If "track", will repeat the current track. If "context" will repeat the current context. If "off" will turn repeat off.
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    setRepeatMode(state: string, { device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Set the volume for the user's current playback device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/set-volume-for-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Number} volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    setPlaybackVolume(volume_percent: number, { device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Toggle shuffle on or off for user's playback.
     * {@link https://developer.spotify.com/documentation/web-api/reference/toggle-shuffle-for-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Boolean} state Whether to shuffle user's playback.
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    togglePlaybackShuffle(state: boolean, { device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recently-played Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-recently-played"
     *
     * @param {Object} opts Optional settings
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.after A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position. If after is specified, before must not be specified.
     * @param {Number} opts.before A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position. If before is specified, after must not be specified.
     * @returns {Object} A paged set of tracks.
     */
    getRecentlyPlayedTracks({ limit, after, before }?: {
        limit: number;
        after: number;
        before: number;
    }): any;
    /**
     * Get the list of objects that make up the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-queue Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @returns {Object} Information about the queue.
     */
    getUserQueue(): any;
    /**
     * Add an item to the end of the user's current playback queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/add-to-queue Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {String} uri The uri of the item to add to the queue. Must be a track or an episode uri.
     * @param {Object} opts Optional settings
     * @param {String} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command received.
     */
    addItemToPlaybackQueue(uri: string, { device_id }?: {
        device_id: string;
    }): Promise<any>;
    /**
     * Get a playlist owned by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlist Spotify API Reference}.
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Array<String>} opts.fields Filters for the query: a single string or an array of the fields to return. If omitted, all fields are returned.
     * @param {Array<String>} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Object} A playlist.
     */
    getPlaylist(playlist_id: string, { market, fields, additional_types }?: {
        market: string;
        fields: Array<string>;
        additional_types: Array<string>;
    }): any;
    /**
     * Change a playlist's name and public/private state. (The user must, of course, own the playlist.)
     * {@link https://developer.spotify.com/documentation/web-api/reference/change-playlist-details Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {String} opts.name The new name for the playlist.
     * @param {String} opts.public_playlist Whether the playlist will be public.
     * @param {String} opts.collaborative Whether the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client.
     * @param {String} opts.description Value for playlist description as displayed in Spotify Clients and in the Web API.
     * @returns Playlist updated.
     */
    changePlaylistDetails(playlist_id: string, { name, public_playlist, collaborative, description }?: {
        name: string;
        public_playlist: string;
        collaborative: string;
        description: string;
    }): Promise<any>;
    /**
     * Get full details of the items of a playlist owned by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Array<String>} opts.fields Filters for the query: a single string or an array of the fields to return. If omitted, all fields are returned.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @param {Array<String>} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Object} Pages of tracks.
     */
    getPlaylistItems(playlist_id: string, { market, fields, limit, offset, additional_types }?: {
        market: string;
        fields: Array<string>;
        limit: number;
        offset: number;
        additional_types: Array<string>;
    }): any;
    /**
     * Either reorder or replace items in a playlist depending on the request's parameters.
     * {@link https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {Array<String>} opts.uris A single string or an array of Spotify URLs or URIs to set, can be track or episode URIs.
     * @param {Number} opts.range_start The position of the first item to be reordered.
     * @param {Number} opts.insert_before The position where the items should be inserted. To reorder the items to the end of the playlist, simply set insert_before to the position after the last item.
     * @param {Number} opts.range_length The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the range_start position, and includes the range_length subsequent items.
     * @param {String} opts.snapshot_id The playlist's snapshot ID against which you want to make the changes.
     * @returns {Object} A snapshot ID for the playlist.
     */
    updatePlaylistItems(playlist_id: string, { uris, range_start, insert_before, range_length, snapshot_id }?: {
        uris: Array<string>;
        range_start: number;
        insert_before: number;
        range_length: number;
        snapshot_id: string;
    }): any;
    /**
     * Add one or more items to a user's playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {Number} opts.position The position to insert the items, a zero-based index. If omitted, the items will be appended to the playlist.
     * @param {Array<String>} opts.uris A single string or an array of Spotify URLs or URIs to add, can be track or episode URIs.
     * @returns {Object} A snapshot ID for the playlist.
     */
    addItemsToPlaylist(playlist_id: string, { position, uris }?: {
        position: number;
        uris: Array<string>;
    }): any;
    /**
     * Remove one or more items from a user's playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-tracks-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {Array<Object>} opts.tracks An object or an array of objects containing Spotify URIs of the tracks or episodes to remove.
     * @param {String} opts.snapshot_id The playlist's snapshot ID against which you want to make the changes.
     * @returns {Object} A snapshot ID for the playlist.
     */
    removePlaylistItems(playlist_id: string, { tracks, snapshot_id }?: {
        tracks: Array<any>;
        snapshot_id: string;
    }): any;
    /**
     * Get a list of the playlists owned or followed by the current Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     *
     * @param {Object} opts Optional settings
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns {Object} A paged set of playlists.
     */
    getCurrentUserPlaylists({ limit, offset }?: {
        limit: number;
        offset: number;
    }): any;
    /**
     * Get a list of the playlists owned or followed by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     * - "playlist-read-collaborative"
     *
     * @param {Number} user_id The user's Spotify user URL or ID.
     * @param {Object} opts Optional settings
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns {Object} A paged set of playlists.
     */
    getUserPlaylist(user_id: number, { limit, offset }?: {
        limit: number;
        offset: number;
    }): any;
    /**
     * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.)
     * {@link https://developer.spotify.com/documentation/web-api/reference/create-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} user_id The user's Spotify user URL or ID.
     * @param {Object} opts Optional settings
     * @param {String} opts.name The name for the new playlist. This name does not need to be unique; a user may have several playlists with the same name.
     * @param {Boolean} opts.public_playlist Whether the playlist will be public.
     * @param {Boolean} opts.collaborative Whether the playlist will be collaborative.
     * @param {String} opts.description Value for playlist description as displayed in Spotify Clients and in the Web API.
     * @returns {Object} A playlist.
     */
    createPlaylist(user_id: string, { name, public_playlist, collaborative, description }?: {
        name: string;
        public_playlist: boolean;
        collaborative: boolean;
        description: string;
    }): any;
    /**
     * Get a list of Spotify featured playlists (shown, for example, on a Spotify player's 'Browse' tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-featured-playlists Spotify API Reference}.
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {String} opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @param {String} opts.timestamp A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user's local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} A paged set of playlists.
     */
    getFeaturedPlaylists({ country, locale, timestamp, limit, offset }?: {
        country: string;
        locale: string;
        timestamp: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get a list of Spotify playlists tagged with a particular category.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-categories-playlists Spotify API Reference}.
     *
     * @param {String} category_id The Spotify category URL or ID for the category.
     * @param {Object} opts Optional settings
     * @param {String} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} A paged set of playlists.
     */
    getCategoryPlaylists(category_id: string, { country, limit, offset }?: {
        country: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get the current image associated with a specific playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlist-cover Spotify API Reference}.
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @returns {Object} A set of images.
     */
    getPlaylistCoverImage(playlist_id: string): any;
    /**
     * Replace the image used to represent a specific playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/upload-custom-playlist-cover Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "ugc-image-upload"
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {String} image Base64 encoded JPEG image data, maximum payload size is 256 KB. You can obtain that by doing:
     * @example fs.readFileSync("./path/to/image.jpeg", "base64")
     *
     * @returns Image uploaded.
     */
    addCustomPlaylistCoverImage(playlist_id: string, image: string): Promise<any>;
    /**
     * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
     * {@link https://developer.spotify.com/documentation/web-api/reference/search Spotify API Reference}.
     *
     * @param {String} q You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
     * @param {Array<String>} type A single string or an array of item types to search across. Search results include hits from all the specified item types.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of results to return in each item type.
     * @param {Number} opts.offset The index of the first item to return. Use with limit to get the next page of search results.
     * @param {String} opts.include_external If "audio" it signals that the client can play externally hosted audio content, and marks the content as playable in the response.
     * @returns {Object} Search response.
     */
    searchForItem(q: string, type: Array<string>, { market, limit, offset, include_external }?: {
        market: string;
        limit: number;
        offset: number;
        include_external: string;
    }): any;
    /**
     * Get Spotify catalog information for a single show identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-show Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the show.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A show.
     */
    getShow(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for several shows based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-shows Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of shows.
     */
    getSeveralShows(ids: Array<string>, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information about an show's episodes. Optional parameters can be used to limit the number of episodes returned.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the show.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of episodes.
     */
    getShowEpisodes(id: string, { market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get a list of shows saved in the current Spotify user's library. Optional parameters can be used to limit the number of shows returned.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-shows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of shows.
     */
    getUserSavedShows({ limit, offset }?: {
        limit: number;
        offset: number;
    }): any;
    /**
     * Save one or more shows to current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-shows-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @returns Show saved.
     */
    saveShowsforCurrentUser(ids: Array<string>): Promise<any>;
    /**
     * Delete one or more shows from current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-shows-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns Show removed.
     */
    removeUserSavedShows(ids: Array<string>, { market }?: {
        market: string;
    }): Promise<any>;
    /**
     * Check if one or more shows is already saved in the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-shows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkUserSavedShows(ids: Array<string>): Array<boolean>;
    /**
     * Get Spotify catalog information for a single track identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-track Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the track.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A track.
     */
    getTrack(id: string, { market }?: {
        market: string;
    }): any;
    /**
     * Get Spotify catalog information for multiple tracks based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-tracks Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Object} A set of tracks.
     */
    getSeveralTracks(ids: Array<string>, { market }?: {
        market: string;
    }): any;
    /**
     * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of tracks.
     */
    getUserSavedTracks({ market, limit, offset }?: {
        market: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Save one or more tracks to the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-tracks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Track saved.
     */
    saveTracksForCurrentUser(ids: Array<string>): Promise<any>;
    /**
     * Remove one or more tracks from the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-tracks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Track removed.
     */
    removeUserSavedTracks(ids: Array<string>): Promise<any>;
    /**
     * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkUserSavedTracks(ids: Array<string>): Array<boolean>;
    /**
     * Get audio features for multiple tracks based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features Spotify API Reference}.
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the tracks. Maximum: 100 IDs.
     * @returns {Object} A set of audio features.
     */
    getTracksAudioFeatures(ids: Array<string>): any;
    /**
     * Get audio feature information for a single track identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audio-features Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the track.
     * @returns {Object} Audio features for one track.
     */
    getTrackAudioFeatures(id: string): any;
    /**
     * Get a low-level audio analysis for a track in the Spotify catalog. The audio analysis describes the track's structure and musical content, including rhythm, pitch, and timbre.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the track.
     * @returns {Object} Audio analysis for one track.
     */
    getTrackAudioAnalysis(id: string): any;
    /**
     * Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks. If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendations Spotify API Reference}.
     *
     * @param {String} seed_artists An array of Spotify IDs for seed artists.
     * @param {String} seed_genres An array of any genres in the set of available genre seeds.
     * @param {String} seed_tracks An array of Spotify IDs for a seed track.
     * @param {Object.<any>} opts See the {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendations Spotify API Reference} for a full list of all the remaining options
     * @param {String} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number} opts.limit The target size of the list of recommended tracks. Default: 20. Minimum: 1. Maximum: 100.
     *
     * @returns {Object} A set of recommendations.
     */
    getRecommendations(seed_artists: string, seed_genres: string, seed_tracks: string, { limit, market, min_acousticness, max_acousticness, target_acousticness, min_danceability, max_danceability, target_danceability, min_duration_ms, max_duration_ms, target_duration_ms, min_energy, max_energy, target_energy, min_instrumentalness, max_instrumentalness, target_instrumentalness, min_key, max_key, target_key, min_liveness, max_liveness, target_liveness, min_loudness, max_loudness, target_loudness, min_mode, max_mode, target_mode, min_popularity, max_popularity, target_popularity, min_speechiness, max_speechiness, target_speechiness, min_tempo, max_tempo, target_tempo, min_time_signature, max_time_signature, target_time_signature, min_valence, max_valence, target_valence }: any, ...args: any[]): any;
    /**
     * Get detailed profile information about the current user (including the current user's username).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-private"
     * - "user-read-email"
     *
     * @returns {Object} A user.
     */
    getCurrentUserProfile(): any;
    /**
     * Get the current user's top artists or tracks based on calculated affinity.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-top-read"
     *
     * @param {String} type The type of entity to return. Valid values: "artists" or "tracks"
     * @param {Object} opts Optional settings
     * @param {String} opts.time_range Over what time frame the affinities are computed. Valid values: "long_term"," medium_term", "short_term".
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Object} Pages of artists or tracks.
     */
    getUserTopItems(type: string, { time_range, limit, offset }?: {
        time_range: string;
        limit: number;
        offset: number;
    }): any;
    /**
     * Get public profile information about a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-profile Spotify API Reference}.
     *
     * @param {String} user_id The user's Spotify user URL or ID.
     * @returns {Object} A user.
     */
    getUserProfile(user_id: string): any;
    /**
     * Add the current user as a follower of a playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/follow-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {Boolean} opts.public_playlist Whether to include the playlist in user's public playlists.
     * @returns Playlist followed.
     */
    followPlaylist(playlist_id: string, { public_playlist }?: {
        public_playlist: boolean;
    }): Promise<any>;
    /**
     * Remove the current user as a follower of a playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/unfollow-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @returns Playlist unfollowed.
     */
    unfollowPlaylist(playlist_id: string): Promise<any>;
    /**
     * Get the current user's followed artists.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-followed Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-read"
     *
     * @param {String} type The ID type: currently only "artist" is supported.
     * @param {Object} opts Optional settings
     * @param {String} opts.after The last artist ID retrieved from the previous request.
     * @param {Number} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @returns {Object} A paged set of artists.
     */
    getFollowedArtists(type: string, { after, limit }?: {
        after: string;
        limit: number;
    }): any;
    /**
     * Add the current user as a follower of one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/follow-artists-users Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-modify"
     *
     * @param {Array<String>} ids A single string or an array of the artist or user Spotify URLs or IDs.
     * @param {String} type The ID type.
     * @returns Artist or user followed.
     */
    followArtistsOrUsers(ids: Array<string>, type: string): Promise<any>;
    /**
     * Remove the current user as a follower of one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/unfollow-artists-users Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-modify"
     *
     * @param {Array<String>} ids A single string or an array of the artist or user Spotify URLs or IDs.
     * @param {String} type The ID type: either "artist" or "user".
     * @returns Artist or user unfollowed.
     */
    unfollowArtistsOrUsers(ids: Array<string>, type: string): Promise<any>;
    /**
     * Check to see if the current user is following one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-current-user-follows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-read"
     *
     * @param {Array<String>} ids A single string or an array of the artist or the user Spotify URLs or IDs to check.
     * @param {String} type The ID type: either "artist" or "user".
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkIfUserFollowsArtistsOrUsers(ids: Array<string>, type: string): Array<boolean>;
    /**
     * Check to see if one or more Spotify users are following a specified playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-if-user-follows-playlist Spotify API Reference}.
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {String} ids An array of the Spotify User URLs or IDs that you want to check to see if they follow the playlist. Maximum: 5 ids.
     * @returns {Array<Boolean>} Array of booleans.
     */
    checkIfUsersFollowPlaylist(playlist_id: string, ids: string): Array<boolean>;
    /**
     * Shorthand for calling the {@link searchForItem} method with type track and limit 1, then returning the track item.
     * @param {String} q You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
     * @returns {Object} Search response.
     */
    searchTrack(q: string): any;
}
//# sourceMappingURL=spoteasy.d.ts.map