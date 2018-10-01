# [Create a Serverless Twitter Bot with Airbrake and AWS Lambda – Part 1](https://airbrake.io/blog/nodejs/serverless-twitter-bot-airbrake-lambda-part-1)

---

# [Create a Serverless Twitter Bot with Airbrake and AWS Lambda – Part 2](https://airbrake.io/blog/nodejs/serverless-twitter-bot-airbrake-lambda-part-2)

---

# [Create a Serverless Twitter Bot with Airbrake and AWS Lambda – Part 3](https://airbrake.io/blog/nodejs/serverless-twitter-bot-airbrake-lambda-part-3)

## Create AWS Lambda Function

To create an AWS Lambda function, start by navigating to the AWS Lambda console and then click Create Function.

Make sure Author from scratch is selected, since we’ll be using our own custom code and exported handler. For this example I’ve named my function airbrake-article-twitter-bot.

For the Runtime dropdown you’ll want to use the latest version of Node.js, or the one closest to your own version. At the time of writing Node.js 6.10 is the latest supported version.

If this is your first Lambda function you’ll likely need to Create a new role from template(s) in the Role dropdown. Then enter a descriptive Role name, such as airbrakeArticleTwitterBotRole. For this basic bot we don’t need any advanced permissions, so leave Policy templates blank and click Create function.

Once created you’ll be looking at the airbrake-article-twitter-bot function dashboard, which includes the Designer panel, where a graphical layout of your function is displayed. Below that is the Function code screen, which includes a default handler function. From there, most of the sections can be ignored for now.

To upload the zip package we created simply click on the Function code > Code entry type dropdown box and select Upload a .ZIP file, then click Upload and select the twitter-bot.zip file.

Next, we need to tell AWS Lambda which particular handler function it should invoke when executing this function, so we’ll change Function code > Handler to index.tweetHelloWorld. The index portion is the name of the app file (index.js), and the second portion is the handler function. Now click Save at the top right and the zip will be uploaded!

## Testing a Lambda Function

Our code is uploaded and ready to go, but we need to actually tell AWS Lambda when and how to invoke our handler function. In this case, it’s easiest to start with a manual execution test.

Click the Test button at the top right, select Create new test event, choose Hello World from the Event template dropdown, then enter any Event name you wish and click Create. The actual parameters of the test aren’t relevant to this particular example, but feel free to change them before creating your test.

Now your new test will be selected in the test dropdown, so just click the Test button and this will invoke the AWS Lambda function, which will call the handler function in your code (index.tweetHelloWorld, in this case).

Once execution completes you’ll see the result dialog at the top, which can be expanded for more detail. In this case, the function result shows:
