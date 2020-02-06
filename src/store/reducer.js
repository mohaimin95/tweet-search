const initalState = {
    tweetsCount: 0,
    tweets: []
}
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case 'CLEAR_NOTIFICATION': {
            return {
                ...state,
                tweets: []
            }
        }; break;

        case 'ON_NEW_TWEET': {
            return {
                ...state,
                tweets: [action.payload, ...state.tweets]

            }
        }; break;

        case 'CLEAR_TWEETS': {
            return {
                ...state,
                tweets: []
            }
        }; break;

        case 'STOP_STREAMING': {
            return {
                ...state,
                tweets: []
            }
        }; break;

        default: {
            console.log("Unknown Action !");
            return state;
        }; break;

    }
}

export default reducer;