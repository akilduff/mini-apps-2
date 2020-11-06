const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
import ReactPaginate from 'react-paginate';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      value: '',
      perPage: 10,
      pageCount: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchResults = this.searchResults.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault()
    axios(`http://localhost:3000/events?q=${this.state.value}&_page=${1}&_limit=${this.state.perPage}`)
      .then(res => {
        var data = res.data;
        this.setState({
          posts: data,
          pageCount: Math.ceil(data.length / this.state.perPage)
        })
      })
      .then(() => {
        console.log('PageCount: ', this.state.pageCount)
        this.searchResults();
      })
      .catch((err) => {
        console.log('Err: ', err)
      })
  }

  handlePageClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({ offset: offset }, () => {
      this.loadCommentsFromServer();
    });
  };

  searchResults() {
    if (this.state.posts.length === 0) {
      console.log('No Posts: ', this.state.posts.length)
      return (
        <div>
          Search for a keyword within the historical database
        </div>
      );
    } else {
      console.log('Posts Length: ', this.state.posts.length)
      var events = this.state.posts
      return (
        <div>
          {events.map((event, index) => (
            <div>
              <h3> Date: {event.date}</h3>
              <p> Description: {event.description}</p>
            </div>
          ))}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Keyword:
            <input type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>
          {this.searchResults()}
        </div>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

