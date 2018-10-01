const FeedParser = require("feedparser");
const request = require("request");
const twitter_credentials = require("./twitter-api-credentials");
const Twitter = require("twitter");
const airbrake_credentials = require("./airbrake-credentials");
const AirbrakeClient = require("airbrake-js");
let airbrake = new AirbrakeClient(airbrake_credentials);

let feedparser = new FeedParser();
let feed = request("https://airbrake.io/blog/feed/atom");
// Use exported secret credentials.
let twitter = new Twitter(twitter_credentials);

// Article collection.
let articles = [];

/**
 * Fires when feed request receives a response from server.
 */
feed.on("response", function(response) {
  if (response.statusCode !== 200) {
    this.emit("error", new Error("Bad status code"));
  } else {
    // Pipes request to feedparser for processing.
    this.pipe(feedparser);
  }
});

/**
 * Invoked when feedparser completes processing request.
 */
feedparser.on("end", function() {
  tweetRandomArticle(articles);
});

/**
 * Executes when feedparser contains readable stream data.
 */
feedparser.on("readable", function() {
  let article;

  // Iterate through all items in stream.
  while ((article = this.read())) {
    // Output each Article to console.
    console.log(`Gathered '${article.title}' published ${article.date}`);
    // Add Article to collection.
    articles.push(article);
  }
});

/**
 * Tweet the passed Article object.
 *
 * @param article Article to be tweeted.
 */
function tweetArticle(article) {
  if (article == null) return;
  twitter.post(
    "statuses/update",
    {
      status: `${article.title} ${article.link}`
    },
    function(error, tweet, response) {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log("---- TWEETED ARTICLE ----");
      console.log(tweet);
    }
  );
}

/**
 * Tweet a random Article.
 */
function tweetRandomArticle() {
  // Tweet a random article.
  tweetArticle(articles[Math.floor(Math.random() * articles.length)]);
}

/**
 * Tweet the passed string message.
 *
 * @param message String to be tweeted.
 */
function tweet(message) {
  if (message === null || message === "") return;
  twitter.post(
    "statuses/update",
    {
      status: message
    },
    tweetCallback
  );
}
/**
 * Callback for tweet attempts.
 *
 * @param error Caught error.
 * @param tweet Tweet.
 * @param response Response.
 */
function tweetCallback(error, tweet, response) {
  if (error) {
    console.log(error);
    throw new Error(error[0].message);
  }
  console.log("---- TWEETED ----");
  console.log(tweet);
}
tweet("Hello world again.");
// Perform a test tweet.
// twitter.post(
//   "statuses/update",
//   {
//     status: "Am I a robot?"
//   },
//   function(error, tweet, response) {
//     if (error) {
//       console.log(error);
//       throw error;
//     }
//     console.log("---- TWEET ----");
//     console.log(tweet);
//     console.log("---- RESPONSE ----");
//     console.log(response);
//   }
// );
