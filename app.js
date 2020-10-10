const twitter = require('twitter');
const fs = require('fs');
const env = require('dotenv').config().parsed;
const path = '.\\tweets.json';

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
  const formated = words.filter((word, index) => {
    if (word.substring(0, 1) === '#') {
      return false;
    }
    if (word.substring(0, 5) === 'https' && index == words.length - 1) {
      return false;
    }
    return true;
  });
  return formated.join(' ');
};

const outputTweets = (error, tweets) => {
  if (error) {
    return;
  }
  const outputs = [];
  tweets.forEach(tweet => {
    const text = formatText(tweet.full_text);
    if (text.length > 0) {
      const output = {
        id: tweet.id,
        profile: {
          name: tweet.user.name,
          image: tweet.user.profile_image_url_https.replace('_normal', '_400x400')
        },
        sentence: text
      };
      outputs.push(output);
    }
  });
  const questions = {
    questions: outputs
  };
  fs.appendFileSync(path, JSON.stringify(questions));
}

client.get('statuses/user_timeline', params, outputTweets);
