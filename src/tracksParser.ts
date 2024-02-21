function tracksParser(response: any)
{
   let isList = (obj: any) => ["album", "show", "audiobook"].includes(obj.type)
   let isItem = (obj: any) => ["track", "episode", "chapter"].includes(obj.type)


   let parsedItems: any[] = []


   /* Lists */

   let foundLists = extractObjects(response, isList)

   for (let list of foundLists)
   {
      let foundItems = extractObjects(list, isItem)

      for (let item of foundItems)
      {
         parsedItems.push( parseTrackObject({...item, album: list}) )
      }
   }

   //console.log(`Lists added. There are ${parsedItems.length} parsed items`)


   /* Mixed */

   let mixedResponse = filterObjects(response, (obj: any) => (isList(obj) && extractObjects(obj, isItem).length > 0) == false)
   let foundMixedItems = extractObjects(mixedResponse ?? {}, isItem)

   for (let item of foundMixedItems)
   {
      parsedItems.push( parseTrackObject(item) )
   }

   //console.log(`Mixed items added. There are ${parsedItems.length} parsed items`)


   response.parsed_tracks = parsedItems

   return response
}


function extractObjects(obj: any, condition: Function)
{
   let array: any[] = []

   forEachObject(obj, (obj: any) =>
   {
      if (condition(obj)) array.push(obj)
   })

   return array
}
function filterObjects(obj: any, condition: Function)
{
   function forEachObjectKey(obj: any, callback: Function)
   {
      for (let key in obj)
      {
         if (obj[key] && typeof obj[key] === "object")
         {
            callback(obj, key)
            forEachObjectKey(obj[key], callback)
         }
      }
   }

   let copy = structuredClone(obj)

   if (condition(copy) == false) return null

   forEachObjectKey(copy, (obj: any, key: string) =>
   {
      if (condition(obj[key]) == false) delete obj[key]
   })

   return copy
}

function forEachObject(obj: any, callback: Function)
{
   callback(obj)

   for (let key in obj)
   {
      if (obj[key] && typeof obj[key] === "object")
      {
         forEachObject(obj[key], callback)
      }
   }
}


function parseTrackObject(track: any)
{
   let info = {
      ...track,

      album: {
         ...track.album,

         artists: parseArtistsObject(track.album?.artists) ?? [{name: track.album?.publisher}],
         authors: getAuthors(track.album?.artists) ?? [track.album?.publisher],
         url: track.album?.external_urls.spotify,
      },

      artists: parseArtistsObject(track.artists) ?? [{name: track.album?.publisher}],
      authors: getAuthors(track.artists) ?? [track.album?.publisher],

      cover: track.images ?? track.album?.images,
      url: track.external_urls?.spotify,
   }

   info.query = `${track.name} ${info.authors.join(" ")} ${track.album?.name}`;
   info.title = `${track.name} - ${info.authors.join(", ")} (${track.album?.name})`;

   return info
}
function parseArtistsObject(artists: any)
{
   return artists?.map((art: any) =>
   {
      art.url = art.external_urls?.spotify ?? undefined
      return art
   })
}
function getAuthors(artists: any)
{
   return artists?.map((art: any) => art.name)
}


export = tracksParser