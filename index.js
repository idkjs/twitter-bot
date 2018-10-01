const airbrake_credentials = require("./airbrake-credentials");
const AirbrakeClient = require("airbrake-js");
const FeedParser = require("feedparser");
const request = require("request");
const twitter_credentials = require("./twitter-api-credentials");
const Twitter = require("twitter");

// Use exported secret credentials.
let airbrake = new AirbrakeClient(airbrake_credentials);

// Use exported secret credentials.
let twitter = new Twitter(twitter_credentials);

// Article collection.
let articles = [];

/**
 * Gets a random Article from collection.
 *
 * @returns {*} Randomly-chosen article.
 */
function getRandomArticle() {
  return articles[Math.floor(Math.random() * articles.length)];
}

/**
 * Tweet the passed string message.
 *
 * @param message String to be tweeted.
 * @param succeed Success callback function.
 * @param fail Failure callback function.
 */
function tweet(message, succeed, fail) {
  if (message === null || message === "") {
    fail("Blank message cannot be tweeted.");
    return;
  }
  twitter.post(
    "statuses/update",
    {
      status: message
    },
    // Callback function after response or failure.
    function(error, tweet, response) {
      if (error) {
        // If error, output to log.
        console.log(error);
        // Report error to Airbrake.
        airbrake.notify(error[0]).then(() => {
          // Return fail promise, to inform Lambda of failure.
          return fail(error[0].message);
        });
      } else {
        // If success, output to log.
        console.log("---- TWEETED ----");
        console.log(tweet);
        // Inform Lambda of success.
        succeed(`'${tweet.text}' tweeted.`);
      }
      // Bind passed succeed/fail parameters to callback function params.
    }.bind({ succeed: succeed, fail: fail })
  );
}

/**
 * Tweet the passed Article object.
 *
 * @param article Article to be tweeted.
 * @param succeed Success callback function.
 * @param fail Failure callback function.
 */
function tweetArticle(article, succeed, fail) {
  if (article === null) return;
  // Invoke base tweet function.
  tweet(`${article.title} ${article.link}`, succeed, fail);
}

/**
 * Tweets Hello world! via AWS Lambda.
 *
 * @param event AWS Lambda event data for the handler.
 * @param context AWS Lambda runtime information.
 */
exports.tweetHelloWorld = function(event, context) {
  tweet("Hello World", context.succeed, context.fail);
};

/**
 * Tweets a random Airbrake article via AWS Lambda.
 *
 * @param event AWS Lambda event data for the handler.
 * @param context AWS Lambda runtime information.
 */
exports.tweetRandomArticle = function(event, context) {
  let feedparser = new FeedParser();
  let feed = request("https://airbrake.io/blog/feed/atom");

  /**
   * Fires when feed request receives a response from server.
   */
  feed.on("response", function(response) {
    if (response.statusCode !== 200) {
      let error = new Error("Bad status code.");
      this.emit("error", error);
    } else {
      // Pipes request to feedparser for processing.
      this.pipe(feedparser);
    }
  });

  /**
   * Invoked when feedparser completes processing request.
   */
  feedparser.on("end", function() {
    tweetArticle(getRandomArticle(), context.succeed, context.fail);
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
};

/**
 * Tweets the current time via AWS Lambda.
 *
 * @param event AWS Lambda event data for the handler.
 * @param context AWS Lambda runtime information.
 */
exports.tweetTime = function(event, context) {
  let currentdate = new Date();
  tweet(currentdate.toLocaleTimeString(), context.succeed, context.fail);
};
