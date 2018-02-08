let accessToken
const clientId = '6e7aa35d78dd41c58dc8d09e0ccb903f'
const redirectURI = 'http://localhost:3000/'

const Spotify = {

  getAccessToken () {
    if (accessToken) {
      return accessToken
    } else {
      const getAccessToken = window.location.href.match(/access_token=([^&]*)/)
      const getExpiresTime = window.location.href.match(/expires_in=([^&]*)/)

      if (getAccessToken && getExpiresTime) {
        let accessToken = getAccessToken[1]
        const expiresIn = getExpiresTime[1]
        window.setTimeout(() => accessToken = '', expiresIn * 1000)
        window.history.pushState('Access Token', null, '/')
        return accessToken
      } else {
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        window.location = authUrl
      }
    }
  },

  search (term) {
    let accessToken = Spotify.getAccessToken()

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
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
            ).then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                }).then(response => response.json()
                    ).then(jsonResponse => {
                        const playlistId = jsonResponse.id;
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
