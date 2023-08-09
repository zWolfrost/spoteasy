function tracksParser(item)
{
   let foundTracks = filterObject(item, (obj) => obj.type == "track" | obj.type == "episode")

   if (foundTracks.length == 0) return item

   switch(item.type)
   {
      case "album":
         foundTracks = foundTracks.map(track =>
         {
            track.album = item
            return parseTrackObject(track)
         })
         break;

      case "show":
         foundTracks = foundTracks.map(track =>
         {
            track.album = item
            return parseTrackObject(track)
         })
         break;

      default:
         foundTracks = foundTracks.map(parseTrackObject)
   }

   item.parsed_tracks = foundTracks

   return item
}


function filterObject(obj, condition)
{
   let array = []

   iterateObj(obj, (obj) => {if (condition(obj)) array.push(obj)} )

   return array
}
function iterateObj(obj, callback)
{
   callback(obj)

   for (let key of Object.keys(obj))
   {
      if (obj[key] && typeof obj[key] === "object")
      {
         iterateObj(obj[key], callback)
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
      url: track.external_urls.spotify,
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