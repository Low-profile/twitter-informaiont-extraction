
import GetOldTweets3 as got
import codecs
import os


tweetCriteria = got.manager.TweetCriteria().setQuerySearch('trimet')\
                                           .setSince("2016-05-01")\
                                           .setUntil("2018-09-30")\
                                           .setMaxTweets(15000)
tweets = got.manager.TweetManager.getTweets(tweetCriteria)
tweet = tweets[0]
print(tweet.text)

with codecs.open("test.csv", "w","utf-8") as file:
    file.write(",".join(["username","date","geo","link","tweet"]) + os.linesep)
    for tweet in tweets:
        result = [tweet.username,tweet.date.strftime('%Y-%m-%d'),tweet.geo,tweet.permalink,tweet.text]
        file.write(",".join(result) + os.linesep)
    print("done!")





