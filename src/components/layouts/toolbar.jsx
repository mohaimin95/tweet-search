import React from 'react';
import './toolbar.css'
import { connect } from "react-redux";
function Toolbar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary">
                <a className="navbar-brand" href="#"><i className="fa fa-twitter"></i></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item toolbar">
                            <a className="nav-link" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-bell"></i>&nbsp;<span className="badge badge-primary">{props.notificationCount}</span></a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" onClick={() => { props.onClickCount(); props.clearTweets() }} >Clear Tweets</a>
                                {
                                    props.isSearched ? (
                                        <React.Fragment>
                                            <a class="dropdown-item" onClick={props.onStopStream}>Stop Streaming</a>
                                        </React.Fragment>
                                    ) : null
                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        notificationCount: state.tweets.length
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onClickCount: () => {
            dispatch({
                type: 'CLEAR_NOTIFICATION'
            })
        },

        stopStreaming: () => {
            dispatch({
                type: 'STOP_STREAMING'
            })
        },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);