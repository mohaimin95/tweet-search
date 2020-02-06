import React, { Component } from 'react';
import { connect } from "react-redux";
import './App.css';
import Toolbar from './components/layouts/toolbar';
import socketIOClient from 'socket.io-client'
import environment from "./environment/environment";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      isSearched: false,
      limit: environment.tweets_limit,
      tweetsContainer: []
    }
  }
  onChangeSearch = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
  }

  changeSearch = () => {
    this.socket.emit('searchChanged', this.state.searchTerm);
    this.setState({
      isSearched: true,
      tweetsContainer: [],
      limit: environment.tweets_limit
    })
    this.props.clearTweets();
  }
  onNewTweet = (tweet) => {
    this.props.onNewTweet(tweet);
  }
  pushToTweetsContainer = (newTweet) => {
    if (this.state.tweetsContainer.length <= this.state.limit) {
      this.setState({
        tweetsContainer: [newTweet, ...this.state.tweetsContainer]
      })
      this.setState(prevState => {
        return {
          ...prevState,
          tweetsContainer: [...prevState.tweetsContainer, newTweet]
        }
      })
    } else {
      this.onNewTweet(newTweet);
    }
  }
  componentDidMount() {
    this.socket = socketIOClient(environment.server);
    this.socket.on('connect', () => {
      this.socket.on('newTweet', (tweet) => {
        this.pushToTweetsContainer(tweet)
      })
    })

  }
  loadMore = () => {
    this.setState({
      limit: this.state.limit + environment.tweets_limit
    });
    this.props.clearTweets();
  }
  stopStreaming = () => {
    this.setState({
      isSearched: false
    })
    this.socket.emit('stop_streaming');
  }
  clearTweets = () => {
    this.setState({
      tweetsContainer: [],
      limit: environment.tweets_limit
    })
    this.props.clearTweets();
  }
  render() {
    return (
      <div className="container">
        <Toolbar onStopStream={this.stopStreaming} isSearched={this.state.isSearched} clearTweets={this.clearTweets} />
        <h4 className="text-center">Twitter Search</h4>
        <div className="row mt-3">
          <div className="col-10">
            <input type="text" placeholder="Search" className="form-control" onChange={this.onChangeSearch} value={this.state.searchTerm} />
          </div>
          <div className="col-2">
            <button className="btn btn-primary" onClick={this.changeSearch}><i className="fa fa-search"></i>&nbsp;Search</button>
          </div>
        </div>
        <div className="mt-4 hr"></div>
        <hr />
        {
          this.state.tweetsContainer.length > 0 ? (
            <div className="container">
              <div className="list-group">
                {
                  this.state.tweetsContainer.map((obj, i) => {
                    return (
                      <div className="list-group-item p-3 mt-4" key={i}>
                        <p>
                          <b>{obj.user.name}</b>
                        </p>
                        <p>
                          {obj.text}
                        </p>
                        <p className="footer">
                          <i className="fa fa-heart-o"></i>&nbsp;{obj.favorite_count}
                        </p>
                      </div>
                    )
                  })
                }
              </div>
              <div className="mt-5 text-center">
                {
                  (this.state.tweetsContainer.length >= this.state.limit) ?
                    (
                      <button onClick={this.loadMore} className="btn btn-primary mb-5">Load More</button>
                    ) : null
                }
              </div>
            </div>
          )
            :
            (
              <div>
                {
                  this.state.isSearched ? (
                    <h4><i className="fa fa-refresh fa-spin"></i>&nbsp;Streaming tweets...</h4>
                  ) : (
                      <p>Steam tweets by searching a keyword <i>"Example: India"</i></p>
                    )
                }
              </div>
            )
        }
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    tweets: state.tweets
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onNewTweet: (tweet) => {
      dispatch({ type: "ON_NEW_TWEET", payload: tweet })
    },
    clearTweets: () => {
      dispatch({ type: "CLEAR_TWEETS" })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);