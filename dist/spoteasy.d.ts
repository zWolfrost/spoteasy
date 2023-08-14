export = SpotifyAPI;
/**
 * An Object containing useful methods to create a Spotify Token and make calls to Spotify API.
 *
 * After a token has been created, this object will contain in addition to the settings provided in the constructor, a token object:
 *
 * @param {Object}                 token - A SpotifyAPI token object
 * @param {String}    token.access_token - The actual access token
 * @param {String}      token.token_type - The token type (e.g. "Bearer")
 * @param {Number}      token.expires_in - The amount of seconds that the token can be used for before it expires, starting from its creation
 * @param {Number}   token.expires_in_ms - The amount of milliseconds that the token can be used for before it expires, starting from its creation
 * @param {Number}     token.expire_time - The Date.now() milliseconds on which the token will expire
 * @param {Array<String>}    token.scope - An array of the allowed authorization scopes
 * @param {Object} token.refresh_timeout - The Timeout object of the auto refresh
 * @param {Number}  token.expires_now_in - (Getter) The amount of milliseconds that the token can be used for before it expires, starting from now
 * @param {Boolean}     token.is_expired - (Getter) Whether the token is expired
 * @param {Boolean}   token.auto_refresh - (Getter/Setter) Whether the token is going to automatically refresh when expired
 * @param {Promise}        token.promise - When creating or refreshing token, this will be the fetch request Promise
 *
 * @param {String}  token.error             - If the token creation was unsuccessful, displays the type of error encountered
 * @param {String}  token.error_description - If the token creation was unsuccessful, displays the description of the error encountered
 */
declare class SpotifyAPI {
    /**
     * The "{@link request}" method default parser.
     *
     * If tracks are found, this parser will add a "parsed_tracks" property to the response which is an array of EVERY track or episode found in it.
     *
     * Then it will also add some handy properties to every track in this array:
     * @param album If getting a whole album, this album property will be a circular reference to the response album;
     * @param authors An array of all the artists' names;
     * @param cover The track cover (points to the album cover if the track is part of one);
     * @param query A string of relevant track words (title, artists and album) separated by a space for searching purposes;
     * @param title Same as query, but the relevant information is separated by relevant characters for displaying purposes, e.g. "Title - Artist1, Artist2 (Album)";
     * @param url Shorthand for external_urls.spotify (the track's Spotify URL).
     *
     * @returns {Object} A parsed response
     */
    static tracksParser(...response: any[]): any;
    /**
     * Extractes important information out of a Spotify URL
     * @param {String} url
     * @returns {Object} An object that contains the url "hostname", its "query" as an object, the spotify item "type" and item "id"
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
     * Creates a SpotifyAPI object with the provided settings. You can also edit these settings after its creation.
     * @param {Object} opts Optional settings
     * @param {Boolean} opts.autoRefreshToken Whether to set the token to auto-refresh when expired on its creation.
     * @param {Number} opts.precautionSeconds Seconds to tick off of token.expires_in to try refresh the token in advance before it expires. Recommended 2 to 5.
     * @param {Boolean} opts.awaitToken If true, and a token creation is in progress, makes any request wait for the token to be created before continuing.
     * @param {Function} opts.responseParser The response parser to apply to any API response.
     * @param {String} opts.defaultMarket The default country market to apply to requests options.
     * @returns {SpotifyAPI} A SpotifyAPI object.
     */
    constructor({ autoRefreshToken, precautionSeconds, awaitToken, responseParser, defaultMarket }?: {
        autoRefreshToken: boolean;
        precautionSeconds: number;
        awaitToken: boolean;
        responseParser: Function;
        defaultMarket: string;
    });
    token: {};
    autoRefreshToken: boolean;
    precautionSeconds: number;
    awaitToken: boolean;
    responseParser: Function;
    defaultMarket: string;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-flow Authorization code flow} to get an URL to the Spotify Login page
     *
     * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} clientSecret The Spotify app Client Secret
     * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param {Object} opts Optional settings
     * @param {Array<String>=} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param {Boolean=} opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns {String} Returns the URL that the user has to open to authenticate.
     */
    authorizationCodeFlow(clientID: string, clientSecret: string, redirectURI: string, { scope, show_dialog }?: {
        scope?: Array<string> | undefined;
        show_dialog?: boolean | undefined;
    }): string;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow Authorization code PKCE flow} to get an authorization token
     *
     * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param {Object} opts Optional settings
     * @param {Array<String>=} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param {Boolean=} opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns {String} Returns the URL that the user has to open to authenticate.
     */
    authorizationCodePKCEFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope?: Array<string> | undefined;
        show_dialog?: boolean | undefined;
    }): string;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow Client credentials flow} to get an authorization token
     *
     * Sets the created token's properties to the SpotifyAPI object "token" property
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} clientSecret The Spotify app Client Secret
     * @returns {Promise} Returns the SpotifyAPI object "token" property
     */
    clientCredentialsFlow(clientID: string, clientSecret: string): Promise<any>;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow Implicit grant flow} to get an authorization token
     *
     * After the authentication, set the token by calling {@link setToken} with the redirect URL query
     *
     * @param {String} clientID The Spotify app Client ID
     * @param {String} redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param {Object} opts Optional settings
     * @param {Array<String>=} opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param {Boolean=} opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns {String} Returns the URL that the user has to open to authenticate.
     */
    implicitGrantFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope?: Array<string> | undefined;
        show_dialog?: boolean | undefined;
    }): string;
    /**
     * Requests a Spotify Access Token based on a request
     * @param {Object} request The request to make to get the token
     * @returns {Promise} Returns the Promise of the Spotify API token
     * @throws Error if response has an "error" property.
     */
    requestToken(request: any): Promise<any>;
    /**
     * Sets the token with the provided properties
     * @param {Object} properties The properties to set to the token
     * @returns {Object} Returns the SpotifyAPI object "token" property
     */
    setToken(properties: any): any;
    /**
     * This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
     * @param {Object} query The URL query parameters.
     * @returns {Promise} Returns the SpotifyAPI object "token" property.
     * @throws Error if query is invalid.
     */
    resolveToken(query: any): Promise<any>;
    /**
     * Tries to refresh the token using its "refresh" method
     * @returns {Promise} Returns the SpotifyAPI object "token" property, or "null" if the token wasn't refreshed by the operation (Spotify API limits refreshes)
     * @throws Error if there is no token or if token has an "error" property at the end of the refresh.
     */
    refreshToken(): Promise<any>;
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
     * @param {String} opts.location The URL location to make a request at
     * @param {String} opts.endpoint The URL endpoint to make a request at
     * @param {Object} opts.query The query to add to the endpoint
     * @param {String} opts.method The request method
     * @param {Object=} opts.headers The request headers
     * @param {any=} opts.body The request body
     * @returns {Promise} The Promise of the response. If the response is empty, returns the response HTML status code.
     * @throws Error if response has an "error" property.
     */
    request({ url, location, endpoint, query, method, headers, body }: {
        url?: string | undefined;
        location: string;
        endpoint: string;
        query: any;
        method: string;
        headers?: any | undefined;
        body?: any | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single album.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-album Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the album.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} An album.
     */
    getAlbum(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-albums Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of albums.
     */
    getSeveralAlbums(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an album's tracks.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-albums-tracks Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the album.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of tracks.
     */
    getAlbumTracks(id: string, { market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of albums.
     */
    getUserSavedAlbums({ market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Save one or more albums to the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-albums-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns {Promise} The album is saved.
     */
    saveAlbumsforCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Remove one or more albums from the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-albums-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns {Promise} Album(s) have been removed from the library.
     */
    removeUserSavedAlbums(ids: string | Array<string>): Promise<any>;
    /**
     * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-albums Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns {Promise} Array of booleans.
     */
    checkUserSavedAlbums(ids: string | Array<string>): Promise<any>;
    /**
     * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-new-releases Spotify API Reference}.
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} A paged set of albums.
     */
    getNewReleases({ market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artist Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @returns {Promise} An artist.
     */
    getArtist(id: string): Promise<any>;
    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the artists. Maximum: 20 IDs.
     * @returns {Promise} A set of artists.
     */
    getSeveralArtists(ids: string | Array<string>): Promise<any>;
    /**
     * Get Spotify catalog information about an artist's albums.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-albums Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @param {Object} opts Optional settings
     * @param {String | Array<String>=} opts.include_groups A single string or an array of keywords that will be used to filter the response. If not supplied, all album types will be returned.
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of albums.
     */
    getArtistAlbums(id: string, { include_groups, market, limit, offset }?: {
        include_groups?: (string | Array<string>) | undefined;
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an artist's top tracks by country.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-top-tracks Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of tracks.
     */
    getArtistTopTracks(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-related-artists Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID of the artist.
     * @returns {Promise} A set of artists.
     */
    getArtistRelatedArtists(id: string): Promise<any>;
    /**
     * Get Spotify catalog information for a single audiobook. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-audiobook Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the audiobook.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} An Audiobook.
     */
    getAudiobook(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several audiobooks identified by their Spotify IDs. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-audiobooks Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of audiobooks.
     */
    getSeveralAudiobooks(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an audiobook's chapters. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audiobook-chapters Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the audiobook.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of chapters.
     */
    getAudiobookChapters(id: string, { market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-audiobooks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of audiobooks.
     */
    getUserSavedAudiobooks({ limit, offset }?: {
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Save one or more audiobooks to the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-audiobooks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Audiobook(s) are saved to the library.
     */
    saveAudiobooksForCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Remove one or more audiobooks from the Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-audiobooks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Audiobook(s) have been removed from the library.
     */
    removeUserSavedAudiobooks(ids: string | Array<string>): Promise<any>;
    /**
     * Check if one or more audiobooks are already saved in the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-audiobooks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Array of booleans.
     */
    checkUserSavedAudiobooks(ids: string | Array<string>): Promise<any>;
    /**
     * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-categories Spotify API Reference}.
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {String=} opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} A paged set of categories.
     */
    getSeveralBrowseCategories({ country, locale, limit, offset }?: {
        country?: string | undefined;
        locale?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-category Spotify API Reference}.
     *
     * @param {String} category_id The Spotify category ID for the category.
     * @param {Object} opts Optional settings
     * @param {String=} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {String=} opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @returns {Promise} A category.
     */
    getSingleBrowseCategory(category_id: string, { country, locale }?: {
        country?: string | undefined;
        locale?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single chapter. Note: Chapters are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-chapter Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the chapter.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A Chapter.
     */
    getChapter(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several chapters identified by their Spotify IDs. Note: Chapters are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-chapters Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of chapters.
     */
    getSeveralChapters(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-episode Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-position"
     *
     * @param {String} id The Spotify URL or ID for the episode.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} An episode.
     */
    getEpisode(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several episodes based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-position"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the episodes. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of episodes.
     */
    getSeveralEpisodes(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get a list of the episodes saved in the current Spotify user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     * - "user-read-playback-position"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of episodes.
     */
    getUserSavedEpisodes({ market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Save one or more episodes to the current user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-episodes-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Episode saved.
     */
    saveEpisodesForCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Remove one or more episodes from the current user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-episodes-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Episode removed.
     */
    removeEpisodesForCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Check if one or more episodes is already saved in the current Spotify user's 'Your Episodes' library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Array of booleans.
     */
    checkEpisodesForCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Retrieve a list of available genres seed parameter values for recommendations.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres Spotify API Reference}.
     *
     * @returns {Promise} A set of genres.
     */
    getAvailableGenreSeeds(): Promise<any>;
    /**
     * Get the list of markets where Spotify is available.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-available-markets Spotify API Reference}.
     *
     * @returns {Promise} A markets object with an array of country codes.
     */
    getAvailableMarkets(): Promise<any>;
    /**
     * Get information about the user's current playback state, including track or episode, progress, and active device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {String | Array<String>=} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Promise} Information about playback.
     */
    getPlaybackState({ market, additional_types }?: {
        market?: string | undefined;
        additional_types?: (string | Array<string>) | undefined;
    }): Promise<any>;
    /**
     * Transfer playback to a new device and determine if it should start playing.
     * {@link https://developer.spotify.com/documentation/web-api/reference/transfer-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {String | Array<String>=} device_ids A string or an array containing the ID of the device on which playback should be started/transferred.
     * @param {Object} opts Optional settings
     * @param {Boolean=} opts.play Whether to ensure playback happens on new device. Otherwise keep the current playback state.
     * @returns {Promise} Playback transferred.
     */
    transferPlayback(device_ids?: (string | Array<string>) | undefined, { play }?: {
        play?: boolean | undefined;
    }): Promise<any>;
    /**
     * Get information about a user's available devices.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @returns {Promise} A set of devices.
     */
    getAvailableDevices(): Promise<any>;
    /**
     * Get the object currently being played on the user's Spotify account.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-currently-playing"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {String | Array<String>=} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Promise} Information about the currently playing track.
     */
    getCurrentlyPlayingTrack({ market, additional_types }?: {
        market?: string | undefined;
        additional_types?: (string | Array<string>) | undefined;
    }): Promise<any>;
    /**
     * Start a new context or resume current playback on the user's active device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @param {String=} opts.context_uri Spotify URL or URI of the context to play. Valid contexts are albums, artists & playlists.
     * @param {String | Array<String>=} opts.uris A string or an array of the Spotify track URLs or URIs to play.
     * @param {Object<Number, String>=} opts.offset Indicates from where in the context playback should start. Only available when context_uri corresponds to an album or playlist object "position" is zero based and can't be negative.
     * @param {Number=} opts.position_ms The position in ms.
     * @returns {Promise} Playback started.
     */
    startOrResumePlayback({ device_id, context_uri, uris, offset, position_ms }?: {
        device_id?: string | undefined;
        context_uri?: string | undefined;
        uris?: (string | Array<string>) | undefined;
        offset?: any | undefined;
        position_ms?: number | undefined;
    }): Promise<any>;
    /**
     * Pause playback on the user's account.
     * {@link https://developer.spotify.com/documentation/web-api/reference/pause-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Playback paused.
     */
    pausePlayback({ device_id }?: {
        device_id?: string | undefined;
    }): Promise<any>;
    /**
     * Skips to next track in the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-next-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command sent.
     */
    skipToNext({ device_id }?: {
        device_id?: string | undefined;
    }): Promise<any>;
    /**
     * Skips to previous track in the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-previous-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command sent.
     */
    skipToPrevious({ device_id }?: {
        device_id?: string | undefined;
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
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command sent.
     */
    skipToPosition(position_ms: number, { device_id }?: {
        device_id?: string | undefined;
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
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command sent.
     */
    setRepeatMode(state: string, { device_id }?: {
        device_id?: string | undefined;
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
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command sent.
     */
    setPlaybackVolume(volume_percent: number, { device_id }?: {
        device_id?: string | undefined;
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
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command sent.
     */
    togglePlaybackShuffle(state: boolean, { device_id }?: {
        device_id?: string | undefined;
    }): Promise<any>;
    /**
     * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recently-played Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-recently-played"
     *
     * @param {Object} opts Optional settings
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.after A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position. If after is specified, before must not be specified.
     * @param {Number=} opts.before A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position. If before is specified, after must not be specified.
     * @returns {Promise} A paged set of tracks.
     */
    getRecentlyPlayedTracks({ limit, after, before }?: {
        limit?: number | undefined;
        after?: number | undefined;
        before?: number | undefined;
    }): Promise<any>;
    /**
     * Get the list of objects that make up the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-queue Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @returns {Promise} Information about the queue.
     */
    getUserQueue(): Promise<any>;
    /**
     * Add an item to the end of the user's current playback queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/add-to-queue Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param {String} uri The uri of the item to add to the queue. Must be a track or an episode uri.
     * @param {Object} opts Optional settings
     * @param {String=} opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns {Promise} Command received.
     */
    addItemToPlaybackQueue(uri: string, { device_id }?: {
        device_id?: string | undefined;
    }): Promise<any>;
    /**
     * Get a playlist owned by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlist Spotify API Reference}.
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {String | Array<String>=} opts.fields Filters for the query: a single string or an array of the fields to return. If omitted, all fields are returned.
     * @param {String | Array<String>=} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Promise} A playlist.
     */
    getPlaylist(playlist_id: string, { market, fields, additional_types }?: {
        market?: string | undefined;
        fields?: (string | Array<string>) | undefined;
        additional_types?: (string | Array<string>) | undefined;
    }): Promise<any>;
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
     * @param {String=} opts.name The new name for the playlist.
     * @param {Boolean=} opts.public_playlist Whether the playlist will be public.
     * @param {Boolean=} opts.collaborative Whether the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client.
     * @param {String=} opts.description Value for playlist description as displayed in Spotify Clients and in the Web API.
     * @returns {Promise} Playlist updated.
     */
    changePlaylistDetails(playlist_id: string, { name, public_playlist, collaborative, description }?: {
        name?: string | undefined;
        public_playlist?: boolean | undefined;
        collaborative?: boolean | undefined;
        description?: string | undefined;
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
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {String | Array<String>=} opts.fields Filters for the query: a single string or an array of the fields to return. If omitted, all fields are returned.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @param {String | Array<String>=} opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns {Promise} Pages of tracks.
     */
    getPlaylistItems(playlist_id: string, { market, fields, limit, offset, additional_types }?: {
        market?: string | undefined;
        fields?: (string | Array<string>) | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
        additional_types?: (string | Array<string>) | undefined;
    }): Promise<any>;
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
     * @param {String | Array<String>=} opts.uris A single string or an array of Spotify URLs or URIs to set, can be track or episode URIs.
     * @param {Number=} opts.range_start The position of the first item to be reordered.
     * @param {Number=} opts.insert_before The position where the items should be inserted. To reorder the items to the end of the playlist, simply set insert_before to the position after the last item.
     * @param {Number=} opts.range_length The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the range_start position, and includes the range_length subsequent items.
     * @param {String=} opts.snapshot_id The playlist's snapshot ID against which you want to make the changes.
     * @returns {Promise} A snapshot ID for the playlist.
     */
    updatePlaylistItems(playlist_id: string, { uris, range_start, insert_before, range_length, snapshot_id }?: {
        uris?: (string | Array<string>) | undefined;
        range_start?: number | undefined;
        insert_before?: number | undefined;
        range_length?: number | undefined;
        snapshot_id?: string | undefined;
    }): Promise<any>;
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
     * @param {Number=} opts.position The position to insert the items, a zero-based index. If omitted, the items will be appended to the playlist.
     * @param {String | Array<String>=} opts.uris A single string or an array of Spotify URLs or URIs to add, can be track or episode URIs.
     * @returns {Promise} A snapshot ID for the playlist.
     */
    addItemsToPlaylist(playlist_id: string, { uris, position }?: {
        position?: number | undefined;
        uris?: (string | Array<string>) | undefined;
    }): Promise<any>;
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
     * @param {Object} opts.tracks An object or an array of objects containing Spotify URIs of the tracks or episodes to remove.
     * @param {String=} opts.snapshot_id The playlist's snapshot ID against which you want to make the changes.
     * @returns {Promise} A snapshot ID for the playlist.
     */
    removePlaylistItems(playlist_id: string, { tracks, snapshot_id }?: {
        tracks: any;
        snapshot_id?: string | undefined;
    }): Promise<any>;
    /**
     * Get a list of the playlists owned or followed by the current Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     *
     * @param {Object} opts Optional settings
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns {Promise} A paged set of playlists.
     */
    getCurrentUserPlaylists({ limit, offset }?: {
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get a list of the playlists owned or followed by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     * - "playlist-read-collaborative"
     *
     * @param {String} user_id The user's Spotify user URL or ID.
     * @param {Object} opts Optional settings
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns {Promise} A paged set of playlists.
     */
    getUserPlaylist(user_id: string, { limit, offset }?: {
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
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
     * @param {String=} opts.name The name for the new playlist. This name does not need to be unique; a user may have several playlists with the same name.
     * @param {Boolean=} opts.public_playlist Whether the playlist will be public.
     * @param {Boolean=} opts.collaborative Whether the playlist will be collaborative.
     * @param {String=} opts.description Value for playlist description as displayed in Spotify Clients and in the Web API.
     * @returns {Promise} A playlist.
     */
    createPlaylist(user_id: string, { name, public_playlist, collaborative, description }?: {
        name?: string | undefined;
        public_playlist?: boolean | undefined;
        collaborative?: boolean | undefined;
        description?: string | undefined;
    }): Promise<any>;
    /**
     * Get a list of Spotify featured playlists (shown, for example, on a Spotify player's 'Browse' tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-featured-playlists Spotify API Reference}.
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {String=} opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @param {String=} opts.timestamp A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user's local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} A paged set of playlists.
     */
    getFeaturedPlaylists({ country, locale, timestamp, limit, offset }?: {
        country?: string | undefined;
        locale?: string | undefined;
        timestamp?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get a list of Spotify playlists tagged with a particular category.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-categories-playlists Spotify API Reference}.
     *
     * @param {String} category_id The Spotify category URL or ID for the category.
     * @param {Object} opts Optional settings
     * @param {String=} opts.country An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} A paged set of playlists.
     */
    getCategoryPlaylists(category_id: string, { country, limit, offset }?: {
        country?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get the current image associated with a specific playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlist-cover Spotify API Reference}.
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @returns {Promise} A set of images.
     */
    getPlaylistCoverImage(playlist_id: string): Promise<any>;
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
     * @param {Object} opts Optional settings
     * @param {String=} opts.image Base64 encoded JPEG image data, maximum payload size is 256 KB. You can obtain that by doing:
     * @example fs.readFileSync("./path/to/image.jpeg", "base64")
     *
     * @returns {Promise} Image uploaded.
     */
    addCustomPlaylistCoverImage(playlist_id: string, { image }?: {
        image?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
     * {@link https://developer.spotify.com/documentation/web-api/reference/search Spotify API Reference}.
     *
     * @param {String} q You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
     * @param {String | Array<String>} type A single string or an array of item types to search across. Search results include hits from all the specified item types.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of results to return in each item type.
     * @param {Number=} opts.offset The index of the first item to return. Use with limit to get the next page of search results.
     * @param {String=} opts.include_external If "audio" it signals that the client can play externally hosted audio content, and marks the content as playable in the response.
     * @returns {Promise} Search response.
     */
    searchForItem(q: string, type: string | Array<string>, { market, limit, offset, include_external }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
        include_external?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single show identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-show Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the show.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A show.
     */
    getShow(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several shows based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-shows Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of shows.
     */
    getSeveralShows(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an show's episodes. Optional parameters can be used to limit the number of episodes returned.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the show.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of episodes.
     */
    getShowEpisodes(id: string, { market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get a list of shows saved in the current Spotify user's library. Optional parameters can be used to limit the number of shows returned.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-shows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of shows.
     */
    getUserSavedShows({ limit, offset }?: {
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Save one or more shows to current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-shows-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @returns {Promise} Show saved.
     */
    saveShowsforCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Delete one or more shows from current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-shows-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} Show removed.
     */
    removeUserSavedShows(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Check if one or more shows is already saved in the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-shows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Array<String>} ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @returns {Promise} Array of booleans.
     */
    checkUserSavedShows(ids: Array<string>): Promise<any>;
    /**
     * Get Spotify catalog information for a single track identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-track Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the track.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A track.
     */
    getTrack(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for multiple tracks based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-tracks Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @returns {Promise} A set of tracks.
     */
    getSeveralTracks(ids: string | Array<string>, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {Object} opts Optional settings
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of tracks.
     */
    getUserSavedTracks({ market, limit, offset }?: {
        market?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Save one or more tracks to the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-tracks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Track saved.
     */
    saveTracksForCurrentUser(ids: string | Array<string>): Promise<any>;
    /**
     * Remove one or more tracks from the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-tracks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Track removed.
     */
    removeUserSavedTracks(ids: string | Array<string>): Promise<any>;
    /**
     * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns {Promise} Array of booleans.
     */
    checkUserSavedTracks(ids: string | Array<string>): Promise<any>;
    /**
     * Get audio features for multiple tracks based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features Spotify API Reference}.
     *
     * @param {String | Array<String>} ids A single string or an array of the Spotify URLs or IDs for the tracks. Maximum: 100 IDs.
     * @returns {Promise} A set of audio features.
     */
    getTracksAudioFeatures(ids: string | Array<string>): Promise<any>;
    /**
     * Get audio feature information for a single track identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audio-features Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the track.
     * @returns {Promise} Audio features for one track.
     */
    getTrackAudioFeatures(id: string): Promise<any>;
    /**
     * Get a low-level audio analysis for a track in the Spotify catalog. The audio analysis describes the track's structure and musical content, including rhythm, pitch, and timbre.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis Spotify API Reference}.
     *
     * @param {String} id The Spotify URL or ID for the track.
     * @returns {Promise} Audio analysis for one track.
     */
    getTrackAudioAnalysis(id: string): Promise<any>;
    /**
     * Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks. If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendations Spotify API Reference}.
     *
     * @param {String} seed_artists An array of Spotify IDs for seed artists.
     * @param {String} seed_genres An array of any genres in the set of available genre seeds.
     * @param {String} seed_tracks An array of Spotify IDs for a seed track.
     *
     * @param {Object} opts See the {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendations Spotify API Reference} for a full list of all the remaining options
     * @param {String=} opts.market An ISO 3166-1 alpha-2 country code.
     * @param {Number=} opts.limit The target size of the list of recommended tracks. Default: 20. Minimum: 1. Maximum: 100.
     *
     * @param {Number=} opts.min_acousticness
     * @param {Number=} opts.max_acousticness
     * @param {Number=} opts.target_acousticness
     *
     * @param {Number=} opts.min_danceability
     * @param {Number=} opts.max_danceability
     * @param {Number=} opts.target_danceability
     *
     * @param {Number=} opts.min_duration_ms
     * @param {Number=} opts.max_duration_ms
     * @param {Number=} opts.target_duration_ms
     *
     * @param {Number=} opts.min_energy
     * @param {Number=} opts.max_energy
     * @param {Number=} opts.target_energy
     *
     * @param {Number=} opts.min_instrumentalness
     * @param {Number=} opts.max_instrumentalness
     * @param {Number=} opts.target_instrumentalness
     *
     * @param {Number=} opts.min_key
     * @param {Number=} opts.max_key
     * @param {Number=} opts.target_key
     *
     * @param {Number=} opts.min_liveness
     * @param {Number=} opts.max_liveness
     * @param {Number=} opts.target_liveness
     *
     * @param {Number=} opts.min_loudness
     * @param {Number=} opts.max_loudness
     * @param {Number=} opts.target_loudness
     *
     * @param {Number=} opts.min_mode
     * @param {Number=} opts.max_mode
     * @param {Number=} opts.target_mode
     *
     * @param {Number=} opts.min_popularity
     * @param {Number=} opts.max_popularity
     * @param {Number=} opts.target_popularity
     *
     * @param {Number=} opts.min_speechiness
     * @param {Number=} opts.max_speechiness
     * @param {Number=} opts.target_speechiness
     *
     * @param {Number=} opts.min_tempo
     * @param {Number=} opts.max_tempo
     * @param {Number=} opts.target_tempo
     *
     * @param {Number=} opts.min_time_signature
     * @param {Number=} opts.max_time_signature
     * @param {Number=} opts.target_time_signature
     *
     * @param {Number=} opts.min_valence
     * @param {Number=} opts.max_valence
     * @param {Number=} opts.target_valence
     *
     * @returns {Promise} A set of recommendations.
     */
    getRecommendations(seed_artists: string, seed_genres: string, seed_tracks: string, { limit, market, min_acousticness, max_acousticness, target_acousticness, min_danceability, max_danceability, target_danceability, min_duration_ms, max_duration_ms, target_duration_ms, min_energy, max_energy, target_energy, min_instrumentalness, max_instrumentalness, target_instrumentalness, min_key, max_key, target_key, min_liveness, max_liveness, target_liveness, min_loudness, max_loudness, target_loudness, min_mode, max_mode, target_mode, min_popularity, max_popularity, target_popularity, min_speechiness, max_speechiness, target_speechiness, min_tempo, max_tempo, target_tempo, min_time_signature, max_time_signature, target_time_signature, min_valence, max_valence, target_valence }: {
        market?: string | undefined;
        limit?: number | undefined;
        min_acousticness?: number | undefined;
        max_acousticness?: number | undefined;
        target_acousticness?: number | undefined;
        min_danceability?: number | undefined;
        max_danceability?: number | undefined;
        target_danceability?: number | undefined;
        min_duration_ms?: number | undefined;
        max_duration_ms?: number | undefined;
        target_duration_ms?: number | undefined;
        min_energy?: number | undefined;
        max_energy?: number | undefined;
        target_energy?: number | undefined;
        min_instrumentalness?: number | undefined;
        max_instrumentalness?: number | undefined;
        target_instrumentalness?: number | undefined;
        min_key?: number | undefined;
        max_key?: number | undefined;
        target_key?: number | undefined;
        min_liveness?: number | undefined;
        max_liveness?: number | undefined;
        target_liveness?: number | undefined;
        min_loudness?: number | undefined;
        max_loudness?: number | undefined;
        target_loudness?: number | undefined;
        min_mode?: number | undefined;
        max_mode?: number | undefined;
        target_mode?: number | undefined;
        min_popularity?: number | undefined;
        max_popularity?: number | undefined;
        target_popularity?: number | undefined;
        min_speechiness?: number | undefined;
        max_speechiness?: number | undefined;
        target_speechiness?: number | undefined;
        min_tempo?: number | undefined;
        max_tempo?: number | undefined;
        target_tempo?: number | undefined;
        min_time_signature?: number | undefined;
        max_time_signature?: number | undefined;
        target_time_signature?: number | undefined;
        min_valence?: number | undefined;
        max_valence?: number | undefined;
        target_valence?: number | undefined;
    }, ...args: any[]): Promise<any>;
    /**
     * Get detailed profile information about the current user (including the current user's username).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-private"
     * - "user-read-email"
     *
     * @returns {Promise} A user.
     */
    getCurrentUserProfile(): Promise<any>;
    /**
     * Get the current user's top artists or tracks based on calculated affinity.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-top-read"
     *
     * @param {String} type The type of entity to return. Valid values: "artists" or "tracks"
     * @param {Object} opts Optional settings
     * @param {String=} opts.time_range Over what time frame the affinities are computed. Valid values: "long_term"," medium_term", "short_term".
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number=} opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns {Promise} Pages of artists or tracks.
     */
    getUserTopItems(type: string, { time_range, limit, offset }?: {
        time_range?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }): Promise<any>;
    /**
     * Get public profile information about a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-profile Spotify API Reference}.
     *
     * @param {String} user_id The user's Spotify user URL or ID.
     * @returns {Promise} A user.
     */
    getUserProfile(user_id: string): Promise<any>;
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
     * @param {Boolean=} opts.public_playlist Whether to include the playlist in user's public playlists.
     * @returns {Promise} Playlist followed.
     */
    followPlaylist(playlist_id: string, { public_playlist }?: {
        public_playlist?: boolean | undefined;
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
     * @returns {Promise} Playlist unfollowed.
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
     * @param {String=} opts.after The last artist URL or ID retrieved from the previous request.
     * @param {Number=} opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @returns {Promise} A paged set of artists.
     */
    getFollowedArtists(type: string, { after, limit }?: {
        after?: string | undefined;
        limit?: number | undefined;
    }): Promise<any>;
    /**
     * Add the current user as a follower of one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/follow-artists-users Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the artist or user Spotify URLs or IDs.
     * @param {String} type The ID type.
     * @returns {Promise} Artist or user followed.
     */
    followArtistsOrUsers(ids: string | Array<string>, type: string): Promise<any>;
    /**
     * Remove the current user as a follower of one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/unfollow-artists-users Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-modify"
     *
     * @param {String | Array<String>} ids A single string or an array of the artist or user Spotify URLs or IDs.
     * @param {String} type The ID type: either "artist" or "user".
     * @returns {Promise} Artist or user unfollowed.
     */
    unfollowArtistsOrUsers(ids: string | Array<string>, type: string): Promise<any>;
    /**
     * Check to see if the current user is following one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-current-user-follows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-read"
     *
     * @param {String | Array<String>} ids A single string or an array of the artist or the user Spotify URLs or IDs to check.
     * @param {String} type The ID type: either "artist" or "user".
     * @returns {Promise} Array of booleans.
     */
    checkIfUserFollowsArtistsOrUsers(ids: string | Array<string>, type: string): Promise<any>;
    /**
     * Check to see if one or more Spotify users are following a specified playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-if-user-follows-playlist Spotify API Reference}.
     *
     * @param {String} playlist_id The Spotify URL or ID of the playlist.
     * @param {String} ids An array of the Spotify User URLs or IDs that you want to check to see if they follow the playlist. Maximum: 5 ids.
     * @returns {Promise} Array of booleans.
     */
    checkIfUsersFollowPlaylist(playlist_id: string, ids: string): Promise<any>;
    /**
     * Shorthand for calling the {@link searchForItem} method with type track and limit 1, then returning the track item.
     * @param {String} q You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
     * @returns {Promise} Search response.
     */
    searchTrack(q: string): Promise<any>;
    /**
     * If passed a search Query, returns "{@link searchTrack}(q)" with that query as argument.
     *
     * If passed a Spotify URL, parses it and returns a response based on its Spotify Item type:
     * - If "album", returns {@link getAlbum}(id)
     * - If "artist", returns {@link getArtistTopTracks}(id)
     * - If "audiobook", returns {@link getAudiobook}(id)
     * - If "chapter", returns {@link getChapter}(id)
     * - If "episode", returns {@link getEpisode}(id)
     * - If "playlist", returns {@link getPlaylist}(id)
     * - If "show", returns {@link getShow}(id)
     * - If "track", returns {@link getTrack}(id)
     * - If "user", returns {@link getUserSavedTracks}(id)
     *
     * @param {String} q Either a search query or a Spotify URL
     * @returns {Promise} Magic response (see above).
     */
    getMagic(q: string): Promise<any>;
}
//# sourceMappingURL=spoteasy.d.ts.map