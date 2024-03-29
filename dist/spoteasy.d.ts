interface Token {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    expires_in_ms?: number;
    expire_time?: number;
    scope?: string[];
    refresh_token?: string;
    refresh_timeout?: any;
    expires_now_in?: any;
    is_expired?: any;
    auto_refresh?: any;
    refresh?: Function;
    promise?: Promise<any>;
    resolve?: Function;
    url?: string;
    error?: string;
    error_description?: string;
}
/**
 * An Object containing useful methods to create a Spotify Token and make calls to Spotify API.
 *
 * After a token is created, the SpotifyAPI object will contain, in addition to the settings provided in the constructor, a "token" object, with the authentication codes to make requests to the Spotify API.
 */
declare class SpotifyAPI {
    token: Token;
    autoRefreshToken: boolean;
    precautionSeconds: number;
    awaitToken: boolean;
    responseParser: Function;
    defaultMarket: string;
    /**
     * Creates a SpotifyAPI object with the provided settings. You can also edit these settings after its creation.
     * @param opts Optional settings
     * @param opts.autoRefreshToken Whether to set the token to auto-refresh when expired on its creation.
     * @param opts.precautionSeconds Seconds to tick off of token.expires_in to try refresh the token in advance before it expires. Recommended 2 to 5.
     * @param opts.awaitToken If true, and a token creation is in progress, makes any request wait for the token to be created before continuing.
     * @param opts.responseParser The response parser to apply to any API response.
     * @param opts.defaultMarket The default country market to apply to requests options.
     * @returns A SpotifyAPI object.
     */
    constructor({ autoRefreshToken, precautionSeconds, awaitToken, responseParser, defaultMarket }?: {
        autoRefreshToken?: boolean;
        precautionSeconds?: number;
        awaitToken?: boolean;
        responseParser?: Function;
        defaultMarket?: string;
    });
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-flow Authorization code flow} to get an URL to the Spotify Login page
     *
     * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
     *
     * @param clientID The Spotify app Client ID
     * @param clientSecret The Spotify app Client Secret
     * @param redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param opts Optional settings
     * @param opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns Returns the URL that the user has to open to authenticate.
     */
    authorizationCodeFlow(clientID: string, clientSecret: string, redirectURI: string, { scope, show_dialog }?: {
        scope?: string[];
        show_dialog?: boolean;
    }): string;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow Authorization code PKCE flow} to get an authorization token
     *
     * After the authentication, get a token by calling {@link resolveToken} with the redirect URL query
     *
     * @param clientID The Spotify app Client ID
     * @param redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param opts Optional settings
     * @param opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns Returns the URL that the user has to open to authenticate.
     */
    authorizationCodePKCEFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope?: string[];
        show_dialog?: boolean;
    }): string;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow Client credentials flow} to get an authorization token
     *
     * Sets the created token's properties to the SpotifyAPI object "token" property
     *
     * @param clientID The Spotify app Client ID
     * @param clientSecret The Spotify app Client Secret
     * @returns Returns the SpotifyAPI object "token" property
     */
    clientCredentialsFlow(clientID: string, clientSecret: string): Promise<Token>;
    /**
     * Uses the {@link https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow Implicit grant flow} to get an authorization token
     *
     * After the authentication, set the token by calling {@link setToken} with the redirect URL query
     *
     * @param clientID The Spotify app Client ID
     * @param redirectURI The URI to which the user will be redirected after completing the authentication (WARNING: you must whitelist this url in the spotify app settings)
     * @param opts Optional settings
     * @param opts.scope A string array of the desired allowed authorization scopes (see: {@link https://developer.spotify.com/documentation/web-api/concepts/scopes Scopes})
     * @param opts.show_dialog Whether or not to force the user to approve the app again if they've already done so
     * @returns Returns the URL that the user has to open to authenticate.
     */
    implicitGrantFlow(clientID: string, redirectURI: string, { scope, show_dialog }?: {
        scope?: string[];
        show_dialog?: boolean;
    }): string;
    /**
     * Requests a Spotify Access Token based on a request
     * @param request The request to make to get the token
     * @returns Returns the Promise of the Spotify API token
     * @throws Error if response has an "error" property.
     */
    requestToken(request: any): Promise<Token>;
    /**
     * Sets the token with the provided properties. Use this method to set a token manually.
     * The bare minimum properties to create a token are "access_token" and "expires_in".
     * @param properties The properties to set to the token
     * @returns Returns the SpotifyAPI object "token" property
     */
    setToken(properties: any): Token;
    /**
     * This method has to be called after using a Grant Flow that gives you an authentication code in the URL query.
     * @param query The URL query parameters.
     * @returns Returns the SpotifyAPI object "token" property.
     * @throws Error if query is invalid.
     */
    resolveToken(query: any): Promise<Token>;
    /**
     * Tries to refresh the token using its "refresh" method
     * @returns Returns the SpotifyAPI object "token" property, or "null" if the token wasn't refreshed by the operation (Spotify API limits refreshes)
     * @throws Error if there is no token or if token has an "error" property at the end of the refresh.
     */
    refreshToken(): Promise<Token | null>;
    /**
     * Make an API request to the spotify API with the given parameters
     *
     * @example spoteasy.request({
     *     url: "https://open.spotify.com/album/6PFPjumGRpZnBzqnDci6qJ?si=4f75fc27072949c2",
     * })
     * // opts.url => opts.endpoint = `/albums/${id}`
     *
     * @example spoteasy.request({
     *     method: "POST",
     *     endpoint: `/users/${userID}/playlists`,
     *     headers: {"Content-Type": "application/json"},
     *     body: JSON.stringify({
     *     name: "Hello World",
     *     public: false,
     *     description: "Your coolest playlist"
     * })
     *
     * @param opts Optional settings
     * @param opts.url The URL of the spotify item, which will be converted into its respective endpoint. If a match is found, it gets prepended to the endpoint property.
     * @param opts.location The URL location to make a request at
     * @param opts.endpoint The URL endpoint to make a request at
     * @param opts.query The query to add to the endpoint
     * @param opts.method The request method
     * @param opts.headers The request headers
     * @param opts.body The request body
     * @returns The Promise of the response. If the response is empty, returns the response HTML status code.
     * @throws Error if response has an "error" property.
     */
    request({ url, location, endpoint, query, method, headers, body }?: {
        url?: string;
        location?: string;
        endpoint?: string;
        query?: any;
        method?: string;
        headers?: any;
        body?: any;
    }): Promise<any>;
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
     * @returns A parsed response
     */
    static tracksParser(...response: any): any;
    /**
     * Extractes important information out of a Spotify URL
     * @param url
     * @returns An object that contains the url "hostname", its "query" as an object, the spotify item "type" and item "id"
     * @throws Error if URL is invalid or unsupported.
     */
    static parseURL(url: string): any;
    /**
     * Returns true if a given string is a valid Spotify URL
     * @param string The string to verify
     * @returns Whether the passed string is a valid Spotify URL
     */
    static isValidURL(string: string): boolean;
    /**
     * Get Spotify catalog information for a single album.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-album Spotify API Reference}.
     *
     * @param id The Spotify URL or ID of the album.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns An album.
     */
    getAlbum(id: string, { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-albums Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of albums.
     */
    getSeveralAlbums(ids: string | string[], { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an album's tracks.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-albums-tracks Spotify API Reference}.
     *
     * @param id The Spotify URL or ID of the album.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of tracks.
     */
    getAlbumTracks(id: string, { market, limit, offset }?: {
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of albums.
     */
    getUserSavedAlbums({ market, limit, offset }?: {
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Save one or more albums to the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-albums-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns The album is saved.
     */
    saveAlbumsforCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Remove one or more albums from the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-albums-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns Album(s) have been removed from the library.
     */
    removeUserSavedAlbums(ids: string | string[]): Promise<any>;
    /**
     * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-albums Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the albums. Maximum: 20 IDs.
     * @returns Array of booleans.
     */
    checkUserSavedAlbums(ids: string | string[]): Promise<any>;
    /**
     * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-new-releases Spotify API Reference}.
     *
     * @param opts Optional settings
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns A paged set of albums.
     */
    getNewReleases({ limit, offset }?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artist Spotify API Reference}.
     *
     * @param id The Spotify URL or ID of the artist.
     * @returns An artist.
     */
    getArtist(id: string): Promise<any>;
    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the artists. Maximum: 20 IDs.
     * @returns A set of artists.
     */
    getSeveralArtists(ids: string | string[]): Promise<any>;
    /**
     * Get Spotify catalog information about an artist's albums.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-albums Spotify API Reference}.
     *
     * @param id The Spotify URL or ID of the artist.
     * @param opts Optional settings
     * @param opts.include_groups A single string or an array of keywords that will be used to filter the response. If not supplied, all album types will be returned.
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of albums.
     */
    getArtistAlbums(id: string, { include_groups, market, limit, offset }?: {
        include_groups?: string | string[];
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an artist's top tracks by country.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-top-tracks Spotify API Reference}.
     *
     * @param id The Spotify URL or ID of the artist.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of tracks.
     */
    getArtistTopTracks(id: string, { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-artists-related-artists Spotify API Reference}.
     *
     * @param id The Spotify URL or ID of the artist.
     * @returns A set of artists.
     */
    getArtistRelatedArtists(id: string): Promise<any>;
    /**
     * Get Spotify catalog information for a single audiobook. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-audiobook Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the audiobook.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns An Audiobook.
     */
    getAudiobook(id: string, { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several audiobooks identified by their Spotify IDs. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-audiobooks Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of audiobooks.
     */
    getSeveralAudiobooks(ids: string | string[], { market }?: {
        market?: string | undefined;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an audiobook's chapters. Note: Audiobooks are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audiobook-chapters Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the audiobook.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of chapters.
     */
    getAudiobookChapters(id: string, { market, limit, offset }?: {
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-audiobooks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param opts Optional settings
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of audiobooks.
     */
    getUserSavedAudiobooks({ limit, offset }?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Save one or more audiobooks to the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-audiobooks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Audiobook(s) are saved to the library.
     */
    saveAudiobooksForCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Remove one or more audiobooks from the Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-audiobooks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Audiobook(s) have been removed from the library.
     */
    removeUserSavedAudiobooks(ids: string | string[]): Promise<any>;
    /**
     * Check if one or more audiobooks are already saved in the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-audiobooks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Array of booleans.
     */
    checkUserSavedAudiobooks(ids: string | string[]): Promise<any>;
    /**
     * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-categories Spotify API Reference}.
     *
     * @param opts Optional settings
     * @param opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns A paged set of categories.
     */
    getSeveralBrowseCategories({ locale, limit, offset }?: {
        locale?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-category Spotify API Reference}.
     *
     * @param category_id The Spotify category ID for the category.
     * @param opts Optional settings
     * @param opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @returns A category.
     */
    getSingleBrowseCategory(category_id: string, { locale }?: {
        locale?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single chapter. Note: Chapters are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-chapter Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the chapter.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A Chapter.
     */
    getChapter(id: string, { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several chapters identified by their Spotify IDs. Note: Chapters are only available for the US, UK, Ireland, New Zealand and Australia markets.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-chapters Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of chapters.
     */
    getSeveralChapters(ids: string | string[], { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-an-episode Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-position"
     *
     * @param id The Spotify URL or ID for the episode.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns An episode.
     */
    getEpisode(id: string, { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several episodes based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-position"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the episodes. Maximum: 50 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of episodes.
     */
    getSeveralEpisodes(ids: string | string[], { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get a list of the episodes saved in the current Spotify user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     * - "user-read-playback-position"
     *
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of episodes.
     */
    getUserSavedEpisodes({ market, limit, offset }?: {
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Save one or more episodes to the current user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-episodes-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Episode saved.
     */
    saveEpisodesForCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Remove one or more episodes from the current user's library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-episodes-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Episode removed.
     */
    removeEpisodesForCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Check if one or more episodes is already saved in the current Spotify user's 'Your Episodes' library. This API endpoint is in beta and could change without warning.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-episodes Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Array of booleans.
     */
    checkEpisodesForCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Retrieve a list of available genres seed parameter values for recommendations.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres Spotify API Reference}.
     *
     * @returns A set of genres.
     */
    getAvailableGenreSeeds(): Promise<any>;
    /**
     * Get the list of markets where Spotify is available.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-available-markets Spotify API Reference}.
     *
     * @returns A markets object with an array of country codes.
     */
    getAvailableMarkets(): Promise<any>;
    /**
     * Get information about the user's current playback state, including track or episode, progress, and active device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns Information about playback.
     */
    getPlaybackState({ market, additional_types }?: {
        market?: string;
        additional_types?: string | string[];
    }): Promise<any>;
    /**
     * Transfer playback to a new device and determine if it should start playing.
     * {@link https://developer.spotify.com/documentation/web-api/reference/transfer-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param device_ids A string or an array containing the ID of the device on which playback should be started/transferred.
     * @param opts Optional settings
     * @param opts.play Whether to ensure playback happens on new device. Otherwise keep the current playback state.
     * @returns Playback transferred.
     */
    transferPlayback(device_ids: string | string[], { play }?: {
        play?: boolean;
    }): Promise<any>;
    /**
     * Get information about a user's available devices.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @returns A set of devices.
     */
    getAvailableDevices(): Promise<any>;
    /**
     * Get the object currently being played on the user's Spotify account.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-currently-playing"
     *
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns Information about the currently playing track.
     */
    getCurrentlyPlayingTrack({ market, additional_types }?: {
        market?: string;
        additional_types?: string | string[];
    }): Promise<any>;
    /**
     * Start a new context or resume current playback on the user's active device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @param opts.context_uri Spotify URL or URI of the context to play. Valid contexts are albums, artists & playlists.
     * @param opts.uris A string or an array of the Spotify track URLs or URIs to play.
     * @param opts.offset Indicates from where in the context playback should start. Only available when context_uri corresponds to an album or playlist object "position" is zero based and can't be negative.
     * @param opts.position_ms The position in ms.
     * @returns Playback started.
     */
    startOrResumePlayback({ device_id, context_uri, uris, offset, position_ms }?: {
        device_id?: string;
        context_uri?: string;
        uris?: string | string[];
        offset?: {
            position: number;
            uri: string;
        };
        position_ms?: number;
    }): Promise<any>;
    /**
     * Pause playback on the user's account.
     * {@link https://developer.spotify.com/documentation/web-api/reference/pause-a-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Playback paused.
     */
    pausePlayback({ device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Skips to next track in the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-next-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    skipToNext({ device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Skips to previous track in the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-previous-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    skipToPrevious({ device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Seeks to the given position in the user's currently playing track.
     * {@link https://developer.spotify.com/documentation/web-api/reference/seek-to-position-in-currently-playing-track Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param position_ms The position in milliseconds to seek to. Must be a positive number. Passing in a position that is greater than the length of the track will cause the player to start playing the next song.
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    skipToPosition(position_ms: number, { device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Set the repeat mode for the user's playback. Options are repeat-track, repeat-context, and off.
     * {@link https://developer.spotify.com/documentation/web-api/reference/set-repeat-mode-on-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param state If "track", will repeat the current track. If "context" will repeat the current context. If "off" will turn repeat off.
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    setRepeatMode(state: string, { device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Set the volume for the user's current playback device.
     * {@link https://developer.spotify.com/documentation/web-api/reference/set-volume-for-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    setPlaybackVolume(volume_percent: number, { device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Toggle shuffle on or off for user's playback.
     * {@link https://developer.spotify.com/documentation/web-api/reference/toggle-shuffle-for-users-playback Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param state Whether to shuffle user's playback.
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command sent.
     */
    togglePlaybackShuffle(state: string, { device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recently-played Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-recently-played"
     *
     * @param opts Optional settings
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.after A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position. If after is specified, before must not be specified.
     * @param opts.before A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position. If before is specified, after must not be specified.
     * @returns A paged set of tracks.
     */
    getRecentlyPlayedTracks({ limit, after, before }?: {
        limit?: number;
        after?: number;
        before?: number;
    }): Promise<any>;
    /**
     * Get the list of objects that make up the user's queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-queue Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-playback-state"
     *
     * @returns Information about the queue.
     */
    getUserQueue(): Promise<any>;
    /**
     * Add an item to the end of the user's current playback queue.
     * {@link https://developer.spotify.com/documentation/web-api/reference/add-to-queue Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-modify-playback-state"
     *
     * @param uri The uri of the item to add to the queue. Must be a track or an episode uri.
     * @param opts Optional settings
     * @param opts.device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * @returns Command received.
     */
    addItemToPlaybackQueue(uri: string, { device_id }?: {
        device_id?: string;
    }): Promise<any>;
    /**
     * Get a playlist owned by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlist Spotify API Reference}.
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.fields Filters for the query: a single string or an array of the fields to return. If omitted, all fields are returned.
     * @param opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns A playlist.
     */
    getPlaylist(playlist_id: string, { market, fields, additional_types }?: {
        market?: string;
        fields?: string;
        additional_types?: string | string[];
    }): Promise<any>;
    /**
     * Change a playlist's name and public/private state. (The user must, of course, own the playlist.)
     * {@link https://developer.spotify.com/documentation/web-api/reference/change-playlist-details Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.name The new name for the playlist.
     * @param opts.public_playlist Whether the playlist will be public.
     * @param opts.collaborative Whether the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client.
     * @param opts.description Value for playlist description as displayed in Spotify Clients and in the Web API.
     * @returns Playlist updated.
     */
    changePlaylistDetails(playlist_id: string, { name, public_playlist, collaborative, description }?: {
        name?: string;
        public_playlist?: boolean;
        collaborative?: boolean;
        description?: string;
    }): Promise<any>;
    /**
     * Get full details of the items of a playlist owned by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.fields Filters for the query: a single string or an array of the fields to return. If omitted, all fields are returned.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @param opts.additional_types A single string or an array of item types that your client supports besides the default track type. Valid types are: track and episode.
     * @returns Pages of tracks.
     */
    getPlaylistItems(playlist_id: string, { market, fields, limit, offset, additional_types }?: {
        market?: string;
        fields?: string;
        limit?: number;
        offset?: number;
        additional_types?: string | string[];
    }): Promise<any>;
    /**
     * Either reorder or replace items in a playlist depending on the request's parameters.
     * {@link https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.uris A single string or an array of Spotify URLs or URIs to set, can be track or episode URIs.
     * @param opts.range_start The position of the first item to be reordered.
     * @param opts.insert_before The position where the items should be inserted. To reorder the items to the end of the playlist, simply set insert_before to the position after the last item.
     * @param opts.range_length The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the range_start position, and includes the range_length subsequent items.
     * @param opts.snapshot_id The playlist's snapshot ID against which you want to make the changes.
     * @returns A snapshot ID for the playlist.
     */
    updatePlaylistItems(playlist_id: string, { uris, range_start, insert_before, range_length, snapshot_id }?: {
        uris?: string | string[];
        range_start?: number;
        insert_before?: number;
        range_length?: number;
        snapshot_id?: string;
    }): Promise<any>;
    /**
     * Add one or more items to a user's playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.position The position to insert the items, a zero-based index. If omitted, the items will be appended to the playlist.
     * @param opts.uris A single string or an array of Spotify URLs or URIs to add, can be track or episode URIs.
     * @returns A snapshot ID for the playlist.
     */
    addItemsToPlaylist(playlist_id: string, { position, uris }?: {
        position?: number;
        uris?: string | string[];
    }): Promise<any>;
    /**
     * Remove one or more items from a user's playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-tracks-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.tracks An object or an array of objects containing Spotify URIs of the tracks or episodes to remove.
     * @param opts.snapshot_id The playlist's snapshot ID against which you want to make the changes.
     * @returns A snapshot ID for the playlist.
     */
    removePlaylistItems(playlist_id: string, tracks: any[], { snapshot_id }?: {
        snapshot_id?: string;
    }): Promise<any>;
    /**
     * Get a list of the playlists owned or followed by the current Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     *
     * @param opts Optional settings
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns A paged set of playlists.
     */
    getCurrentUserPlaylists({ limit, offset }?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get a list of the playlists owned or followed by a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-read-private"
     * - "playlist-read-collaborative"
     *
     * @param user_id The user's Spotify user URL or ID.
     * @param opts Optional settings
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns A paged set of playlists.
     */
    getUserPlaylist(user_id: string, { limit, offset }?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.)
     * {@link https://developer.spotify.com/documentation/web-api/reference/create-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param user_id The user's Spotify user URL or ID.
     * @param name The name for the new playlist. This name does not need to be unique; a user may have several playlists with the same name.
     * @param opts Optional settings
     * @param opts.public_playlist Whether the playlist will be public.
     * @param opts.collaborative Whether the playlist will be collaborative.
     * @param opts.description Value for playlist description as displayed in Spotify Clients and in the Web API.
     * @returns A playlist.
     */
    createPlaylist(user_id: string, name: string, { public_playlist, collaborative, description }?: {
        public_playlist?: boolean;
        collaborative?: boolean;
        description?: string;
    }): Promise<any>;
    /**
     * Get a list of Spotify featured playlists (shown, for example, on a Spotify player's 'Browse' tab).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-featured-playlists Spotify API Reference}.
     *
     * @param opts Optional settings
     * @param opts.locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns A paged set of playlists.
     */
    getFeaturedPlaylists({ locale, limit, offset }?: {
        locale?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get a list of Spotify playlists tagged with a particular category.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-categories-playlists Spotify API Reference}.
     *
     * @param category_id The Spotify category URL or ID for the category.
     * @param opts Optional settings
     * @param opts.country An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns A paged set of playlists.
     */
    getCategoryPlaylists(category_id: string, { limit, offset }?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get the current image associated with a specific playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-playlist-cover Spotify API Reference}.
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @returns A set of images.
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
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.image Base64 encoded JPEG image data, maximum payload size is 256 KB. You can obtain that by doing:
     * @example fs.readFileSync("./path/to/image.jpeg", "base64")
     *
     * @returns Image uploaded.
     */
    addCustomPlaylistCoverImage(playlist_id: string, { image }?: {
        image?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
     * {@link https://developer.spotify.com/documentation/web-api/reference/search Spotify API Reference}.
     *
     * @param q You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
     * @param type A single string or an array of item types to search across. Search results include hits from all the specified item types.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of results to return in each item type.
     * @param opts.offset The index of the first item to return. Use with limit to get the next page of search results.
     * @param opts.include_external If "audio" it signals that the client can play externally hosted audio content, and marks the content as playable in the response.
     * @returns Search response.
     */
    searchForItem(q: string, type: string | string[], { market, limit, offset, include_external }?: {
        market?: string;
        limit?: number;
        offset?: number;
        include_external?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for a single show identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-show Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the show.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A show.
     */
    getShow(id: string, { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for several shows based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-multiple-shows Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of shows.
     */
    getSeveralShows(ids: string | string[], { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information about an show's episodes. Optional parameters can be used to limit the number of episodes returned.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the show.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of episodes.
     */
    getShowEpisodes(id: string, { market, limit, offset }?: {
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get a list of shows saved in the current Spotify user's library. Optional parameters can be used to limit the number of shows returned.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-shows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param opts Optional settings
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of shows.
     */
    getUserSavedShows({ limit, offset }?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Save one or more shows to current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-shows-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @returns Show saved.
     */
    saveShowsforCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Delete one or more shows from current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-shows-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns Show removed.
     */
    removeUserSavedShows(ids: string | string[], { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Check if one or more shows is already saved in the current Spotify user's library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-shows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the shows. Maximum: 50 IDs.
     * @returns Array of booleans.
     */
    checkUserSavedShows(ids: string | string[]): Promise<any>;
    /**
     * Get Spotify catalog information for a single track identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-track Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the track.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A track.
     */
    getTrack(id: string, { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get Spotify catalog information for multiple tracks based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-tracks Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @returns A set of tracks.
     */
    getSeveralTracks(ids: string | string[], { market }?: {
        market?: string;
    }): Promise<any>;
    /**
     * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param opts Optional settings
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of tracks.
     */
    getUserSavedTracks({ market, limit, offset }?: {
        market?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Save one or more tracks to the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/save-tracks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Track saved.
     */
    saveTracksForCurrentUser(ids: string | string[]): Promise<any>;
    /**
     * Remove one or more tracks from the current user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/remove-tracks-user Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-modify"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Track removed.
     */
    removeUserSavedTracks(ids: string | string[]): Promise<any>;
    /**
     * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-users-saved-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-library-read"
     *
     * @param ids A single string or an array of the Spotify URLs or IDs. Maximum: 50 IDs.
     * @returns Array of booleans.
     */
    checkUserSavedTracks(ids: string | string[]): Promise<any>;
    /**
     * Get audio features for multiple tracks based on their Spotify IDs.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features Spotify API Reference}.
     *
     * @param ids A single string or an array of the Spotify URLs or IDs for the tracks. Maximum: 100 IDs.
     * @returns A set of audio features.
     */
    getTracksAudioFeatures(ids: string | string[]): Promise<any>;
    /**
     * Get audio feature information for a single track identified by its unique Spotify ID.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audio-features Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the track.
     * @returns Audio features for one track.
     */
    getTrackAudioFeatures(id: string): Promise<any>;
    /**
     * Get a low-level audio analysis for a track in the Spotify catalog. The audio analysis describes the track's structure and musical content, including rhythm, pitch, and timbre.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis Spotify API Reference}.
     *
     * @param id The Spotify URL or ID for the track.
     * @returns Audio analysis for one track.
     */
    getTrackAudioAnalysis(id: string): Promise<any>;
    /**
     * Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks. If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendations Spotify API Reference}.
     *
     * @param opts See the {@link https://developer.spotify.com/documentation/web-api/reference/get-recommendations Spotify API Reference} for a full list of all the remaining options
     * @param opts.seed_artists An array of Spotify IDs for seed artists.
     * @param opts.seed_genres An array of any genres in the set of available genre seeds.
     * @param opts.seed_tracks An array of Spotify IDs for a seed track.
     *
     * @param opts.market An ISO 3166-1 alpha-2 country code.
     * @param opts.limit The target size of the list of recommended tracks. Default: 20. Minimum: 1. Maximum: 100.
     *
     * @param opts.min_acousticness
     * @param opts.max_acousticness
     * @param opts.target_acousticness
     *
     * @param opts.min_danceability
     * @param opts.max_danceability
     * @param opts.target_danceability
     *
     * @param opts.min_duration_ms
     * @param opts.max_duration_ms
     * @param opts.target_duration_ms
     *
     * @param opts.min_energy
     * @param opts.max_energy
     * @param opts.target_energy
     *
     * @param opts.min_instrumentalness
     * @param opts.max_instrumentalness
     * @param opts.target_instrumentalness
     *
     * @param opts.min_key
     * @param opts.max_key
     * @param opts.target_key
     *
     * @param opts.min_liveness
     * @param opts.max_liveness
     * @param opts.target_liveness
     *
     * @param opts.min_loudness
     * @param opts.max_loudness
     * @param opts.target_loudness
     *
     * @param opts.min_mode
     * @param opts.max_mode
     * @param opts.target_mode
     *
     * @param opts.min_popularity
     * @param opts.max_popularity
     * @param opts.target_popularity
     *
     * @param opts.min_speechiness
     * @param opts.max_speechiness
     * @param opts.target_speechiness
     *
     * @param opts.min_tempo
     * @param opts.max_tempo
     * @param opts.target_tempo
     *
     * @param opts.min_time_signature
     * @param opts.max_time_signature
     * @param opts.target_time_signature
     *
     * @param opts.min_valence
     * @param opts.max_valence
     * @param opts.target_valence
     *
     * @returns A set of recommendations.
     */
    getRecommendations({ seed_artists, seed_genres, seed_tracks, limit, market, min_acousticness, max_acousticness, target_acousticness, min_danceability, max_danceability, target_danceability, min_duration_ms, max_duration_ms, target_duration_ms, min_energy, max_energy, target_energy, min_instrumentalness, max_instrumentalness, target_instrumentalness, min_key, max_key, target_key, min_liveness, max_liveness, target_liveness, min_loudness, max_loudness, target_loudness, min_mode, max_mode, target_mode, min_popularity, max_popularity, target_popularity, min_speechiness, max_speechiness, target_speechiness, min_tempo, max_tempo, target_tempo, min_time_signature, max_time_signature, target_time_signature, min_valence, max_valence, target_valence }: {
        seed_artists?: string[];
        seed_genres?: string[];
        seed_tracks?: string[];
        limit?: number;
        market?: string;
        min_acousticness?: number;
        max_acousticness?: number;
        target_acousticness?: number;
        min_danceability?: number;
        max_danceability?: number;
        target_danceability?: number;
        min_duration_ms?: number;
        max_duration_ms?: number;
        target_duration_ms?: number;
        min_energy?: number;
        max_energy?: number;
        target_energy?: number;
        min_instrumentalness?: number;
        max_instrumentalness?: number;
        target_instrumentalness?: number;
        min_key?: number;
        max_key?: number;
        target_key?: number;
        min_liveness?: number;
        max_liveness?: number;
        target_liveness?: number;
        min_loudness?: number;
        max_loudness?: number;
        target_loudness?: number;
        min_mode?: number;
        max_mode?: number;
        target_mode?: number;
        min_popularity?: number;
        max_popularity?: number;
        target_popularity?: number;
        min_speechiness?: number;
        max_speechiness?: number;
        target_speechiness?: number;
        min_tempo?: number;
        max_tempo?: number;
        target_tempo?: number;
        min_time_signature?: number;
        max_time_signature?: number;
        target_time_signature?: number;
        min_valence?: number;
        max_valence?: number;
        target_valence?: number;
    }): Promise<any>;
    /**
     * Get detailed profile information about the current user (including the current user's username).
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-read-private"
     * - "user-read-email"
     *
     * @returns A user.
     */
    getCurrentUserProfile(): Promise<any>;
    /**
     * Get the current user's top artists or tracks based on calculated affinity.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-top-read"
     *
     * @param type The type of entity to return. Valid values: "artists" or "tracks"
     * @param opts Optional settings
     * @param opts.time_range Over what time frame the affinities are computed. Valid values: "long_term"," medium_term", "short_term".
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param opts.offset The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
     * @returns Pages of artists or tracks.
     */
    getUserTopItems(type: string, { time_range, limit, offset }?: {
        time_range?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Get public profile information about a Spotify user.
     * {@link https://developer.spotify.com/documentation/web-api/reference/get-users-profile Spotify API Reference}.
     *
     * @param user_id The user's Spotify user URL or ID.
     * @returns A user.
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
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param opts Optional settings
     * @param opts.public_playlist Whether to include the playlist in user's public playlists.
     * @returns Playlist followed.
     */
    followPlaylist(playlist_id: string, { public_playlist }?: {
        public_playlist?: boolean;
    }): Promise<any>;
    /**
     * Remove the current user as a follower of a playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/unfollow-playlist Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "playlist-modify-public"
     * - "playlist-modify-private"
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
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
     * @param type The ID type: currently only "artist" is supported.
     * @param opts Optional settings
     * @param opts.after The last artist URL or ID retrieved from the previous request.
     * @param opts.limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     * @returns A paged set of artists.
     */
    getFollowedArtists(type: string, { after, limit }?: {
        after?: string;
        limit?: number;
    }): Promise<any>;
    /**
     * Add the current user as a follower of one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/follow-artists-users Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-modify"
     *
     * @param ids A single string or an array of the artist or user Spotify URLs or IDs.
     * @param type The ID type.
     * @returns Artist or user followed.
     */
    followArtistsOrUsers(ids: string | string[], type: string): Promise<any>;
    /**
     * Remove the current user as a follower of one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/unfollow-artists-users Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-modify"
     *
     * @param ids A single string or an array of the artist or user Spotify URLs or IDs.
     * @param type The ID type: either "artist" or "user".
     * @returns Artist or user unfollowed.
     */
    unfollowArtistsOrUsers(ids: string | string[], type: string): Promise<any>;
    /**
     * Check to see if the current user is following one or more artists or other Spotify users.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-current-user-follows Spotify API Reference}.
     *
     * Might require the following authorization scopes:
     * - "user-follow-read"
     *
     * @param ids A single string or an array of the artist or the user Spotify URLs or IDs to check.
     * @param type The ID type: either "artist" or "user".
     * @returns Array of booleans.
     */
    checkIfUserFollowsArtistsOrUsers(ids: string | string[], type: string): Promise<any>;
    /**
     * Check to see if one or more Spotify users are following a specified playlist.
     * {@link https://developer.spotify.com/documentation/web-api/reference/check-if-user-follows-playlist Spotify API Reference}.
     *
     * @param playlist_id The Spotify URL or ID of the playlist.
     * @param ids An array of the Spotify User URLs or IDs that you want to check to see if they follow the playlist. Maximum: 5 ids.
     * @returns Array of booleans.
     */
    checkIfUsersFollowPlaylist(playlist_id: string, ids: string | string[]): Promise<any>;
    /**
     * Shorthand for calling the {@link searchForItem} method with type track and limit 1, then returning the track item.
     * @param q You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
     * @returns Search response.
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
     * @param q Either a search query or a Spotify URL
     * @returns Magic response (see above).
     */
    getMagic(q: string): Promise<any>;
}
export = SpotifyAPI;
//# sourceMappingURL=spoteasy.d.ts.map