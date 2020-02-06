const router = require("express").Router();
const Twitter = require("twit");
const util = require("util");
let io = process.io
let socket = process.socket

let T = new Twitter({
    consumer_key: 'hZNQ9dmgAFfIZpNls5OTv426c',
    consumer_secret: 'IqDxule0qm6YByv7ZL9u81R5QnJFGkIm10e2pSzwTMLf5h91Fq',
    access_token: '1192319315946508288-O7fY1ApApYWJ1SfBKUCmI0hGUVKc6q',
    access_token_secret: 'Sc3xSWqRrz1D7m31ilf0YHoXV17V17EJuCpZSQyCETEGB'
});
// router.get("/", (req, res) => {

//     twitter.stream('statuses/filter', { track: "#SOTU" }, (stream) => {

//         stream.on('tweet', (data) => {
//             console.log(util.inspect(data), "Getting....");
//             stream.destroy();
//         });
//         stream.on('error', (err) => { throw err })
//     })
//     res.send({ message: "Getting tweets !" })
// })
let twitterStream;
const startTwitterStream = (term) => {
    console.log('Creating new Twitter stream.')
    stopStreaming();
    twitterStream = T.stream('statuses/filter', { track: term })
    twitterStream.on('tweet', function (tweet) {
        io.emit("newTweet", tweet);
    });
}
const stopStreaming = () => {
    if (twitterStream) {
        twitterStream.stop()
        twitterStream = null;
    };
}
io.on('connection', (s) => {
    s.on('searchChanged', (term) => {
        startTwitterStream(term)

    });
    s.on('disconnect', () => {
        stopStreaming();
    });
    
    s.on('stop_streaming', () => {
        stopStreaming();
    });

    
});
module.exports = router;