const router = require("express").Router();
const Twitter = require("twit");
let io = process.io;

let twitter = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

let twitterStream;
const startTwitterStream = (term) => {
    console.log('Creating new Twitter stream.')
    stopStreaming();
    twitterStream = twitter.stream('statuses/filter', { track: term })
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