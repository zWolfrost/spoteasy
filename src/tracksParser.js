function tracksParser(response)
{
   let isList = (obj) => ["album", "show", "audiobook"].includes(obj.type)
   let isItem = (obj) => ["track", "episode", "chapter"].includes(obj.type)


   let parsedItems = []


   /* Lists */

   let foundLists = extractObjects(response, isList)

   for (list of foundLists)
   {
      let foundItems = extractObjects(list, isItem)

      for (item of foundItems)
      {
         parsedItems.push( parseTrackObject({...item, album: list}) )
      }
   }

   //console.log(`Lists added. There are ${parsedItems.length} parsed items`)


   /* Mixed */

   let mixedResponse = filterObjects(response, (obj) => (isList(obj) && extractObjects(obj, isItem).length > 0) == false)
   let foundMixedItems = extractObjects(mixedResponse ?? {}, isItem)

   for (item of foundMixedItems)
   {
      parsedItems.push( parseTrackObject(item) )
   }

   //console.log(`Mixed items added. There are ${parsedItems.length} parsed items`)


   response.parsed_tracks = parsedItems

   return response
}


function extractObjects(obj, condition)
{
   let array = []

   forEachObject(obj, obj =>
   {
      if (condition(obj)) array.push(obj)
   })

   return array
}
function filterObjects(obj, condition)
{
   function forEachObjectKey(obj, callback)
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

   forEachObjectKey(copy, (obj, key) =>
   {
      if (condition(obj[key]) == false) delete obj[key]
   })

   return copy
}

function forEachObject(obj, callback)
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


function parseTrackObject(track)
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
function parseArtistsObject(artists)
{
   return artists?.map(art =>
   {
      art.url = art.external_urls?.spotify ?? undefined
      return art
   })
}
function getAuthors(artists)
{
   return artists?.map(art => art.name)
}


module.exports = tracksParser