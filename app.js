const twitter = require('twitter');
const env = require('dotenv').config().parsed;
const moment = require("moment");

const client = new twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});

const params = {
  screen_name: 'realDonaldTrump',
  // since_id: 1314402920474042400,
  include_rts: false,
  tweet_mode: 'extended'
};

client.get('statuses/user_timeline', params, (error, tweets) => {
  if (error) {
    return;
  }
  tweets.forEach(tweet => {
    // console.log(index)
    // console.log(index)
    // console.log(tweet);
    // console.log(tweet.created_at);
    const date = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format("YYYY/MM/DD HH:mm:ss");
    console.log(date);
    // console.log(tweet.id);
    // console.log(tweet.user.name);
    // console.log(tweet.user.profile_image_url_https);
    console.log(tweet.full_text);
    // console.log(tweet.text);
});

  // for (const tweet in tweets) {
  //   console.log(array[index])
  //   console.log(tweets[0].id);
  //   console.log(tweets[0].user.name);
  //   console.log(tweets[0].user.profile_image_url_https);
  //   console.log(tweets[0].text);
  // }  
});

// client.post('statuses/update', {status: 'test'}, function(error, tweet, response){
//     if (!error) {
//         console.log(tweet);
//     } else {
//         console.log('error');
//     }
// });
