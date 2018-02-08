let accessToken
const clientId = '6e7aa35d78dd41c58dc8d09e0ccb903f'
const redirectUri = 'http://localhost:3000/'

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
// Get the access token and expiration from the URL
    const accessTokenValue = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
// If both are truthy
    if (accessTokenValue && expiresInMatch) {
// Pull values from match
      accessToken = accessTokenValue[1]
      const expiresIn = Number(expiresInMatch[1])
// Wipe access token and URL parameters
      window.setTimeout(() => accessToken = '', expiresIn * 1000)
      window.history.pushState('Access Token', null, '/')
      return accessToken
    } else {
// If not set redirect to authorize
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      window.location = accessUrl
    }
  },

  search (term) {

// Get access token
    let accessToken = Spotify.getAccessToken()

// Pass search term
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      }
    ).then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    if (!jsonResponse.tracks) {
      return []
    } else {
// If has results, parse results into track array
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri

      }))
    }
  }
)
  },

  savePlaylist(name, trackUris) {
// If playlist is not named or does not have tracks, stop
        if (!name || !trackUris.length) {
            return;
        }

// Authorize
        let accessToken = Spotify.getAccessToken()

        const headers = { Authorization: `Bearer ${accessToken}` }
        let userId
// Get the user ID
        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
            ).then(jsonResponse => {
                userId = jsonResponse.id;
// Post the playlist
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                }).then(response => response.json()
                    ).then(jsonResponse => {
                        const playlistId = jsonResponse.id;
// Post the tracks
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackUris })
                        });
                    });
            });
    }
};

export default Spotify;
