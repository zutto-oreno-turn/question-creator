const twitter = require('twitter');
const env = require('dotenv').config().parsed;

const client = new twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});

const params = {
  screen_name: 'realDonaldTrump',
  // since_id: 1314402920474042400,
  count: 10,
  include_rts: false,
  tweet_mode: 'extended'
};

const formatText = text => {
  const words = text.split(' ');
  if (words.length == 1) {
    return '';
  }

  let formated = [];
  words.forEach((word, index) => {
    if (word.substring(0, 1) === '#') {
      return;
    }
    if (word.substring(0, 5) === 'https' && index == words.length - 1) {
      return;
    }
    formated.push(word);
  });
  return formated.join(' ');
};

client.get('statuses/user_timeline', params, (error, tweets) => {
  if (error) {
    return;
  }
  tweets.forEach(tweet => {
    // console.log(tweet.id);
    // console.log(tweet.user.name);
    // console.log(tweet.user.profile_image_url_https.replace('_normal', '_400x400'));
    console.log(formatText(tweet.full_text));
  });
});
