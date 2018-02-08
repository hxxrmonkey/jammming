import React from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor (props) {
    super(props)
// Set default states
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }

// bind methods to App
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }
// When user clicks + on track, add track to list of tracks in playlist
  addTrack (track) {
    let tracks = this.state.playlistTracks
    tracks.push(track)
    this.setState({ playlistTracks: tracks })
  }

// When user clicks - on track, remove track from list of tracks in playlist
  removeTrack (track) {
    let tracks = this.state.playlistTracks
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)
    this.setState({ playlistTracks: tracks })
  }

// Change the playlist name
  updatePlaylistName (name) {
    this.setState({ playlistName: name })
  }

// Save the playlist to Spotify. Spotify.savePlaylist in Spotify.js
// Reset the playlist name and list of tracks in the playlist
  savePlaylist () {
    const trackURIs = this.state.playlistTracks.map(function (track) { return track.uri })
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
  }

//Spotify.search located in spotify.js, search Spotify for search term
  search (term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  render () {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search} />
          <div className='App-playlist'>
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
                     />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
