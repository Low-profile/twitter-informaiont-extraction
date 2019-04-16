import pandas as pd

stop_df=pd.read_csv('stops_portland.txt')
tweet=pd.read_csv('prediction_portaland_geo.csv')
# ,encoding = 'cp1252'


tweet = tweet.dropna()

tweet.stop_id = tweet.stop_id.astype(int)

s=tweet.join(stop_df[['stop_id', 'stop_lat', 'stop_lon']].set_index('stop_id'), on='stop_id')

s.to_csv("portland_tweet_geo.csv")
print("end")


