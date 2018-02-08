import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor (props) {
    super(props)
// Set default state
    this.state = {
      term: ''
    }
// Bind methods to SearchBar
    this.search = this.search.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
  }
// Change search term when field changes
  handleTermChange (event) {
    this.setState({ term: event.target.value })
  }

// Pass the search term to search function
  search () {
    this.props.onSearch(this.state.term)
  }

  render () {
    return (
      <div className='SearchBar'>
        <input placeholder='Enter A Song, Album, or Artist' onChange={this.handleTermChange} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;
