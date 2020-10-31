const twitter = require('twitter');
const fs = require('fs');
const moment = require("moment");
const env = require('dotenv').config().parsed;
const name = process.argv[2];
const path = `./json/${name}.json`;

let previous = null;
if (fs.existsSync(path)) {
  previous = require(path);
}

let params = {
  screen_name: name,
  include_rts: false,
  tweet_mode: 'extended',
  count: 10
};
if (previous != null) {
  params.since_id = previous.questions.slice(-1)[0].id;
  console.log(JSON.stringify(params));
}

const client = new twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});

const formatText = text => {
  let formated = text;

  const ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]',
    '\ud7c9[\ude00-\udeff]',
    '[\u2600-\u27BF]'
  ];
  const regexp = new RegExp(ranges.join('|'), 'g');
  formated = formated.replace(regexp, '');
  formated = formated.replace(/\n/g, '');
  formated = formated.trim();

  const words = formated.split(' ');
  if (words.length == 1) {
    return '';
  }

  const excluded = words.filter((word, index) => {
    if (word.substring(0, 1) === '#') {
      return false;
    }
    if (word.substring(0, 5) === 'https' && index == words.length - 1) {
      return false;
    }
    return true;
  });
  return excluded.join(' ').trim();
};

const outputTweets = (error, tweets) => {
  if (error) {
    return;
  }

  console.log('new tweets: ' + tweets.length);

  let outputs = [];
  tweets.forEach(tweet => {
    const text = formatText(tweet.full_text);
    if (text.length == 0) {
      return;
    }
    if (tweet.id == params.since_id) {
      return;
    }
    const date = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en');
    const output = {
      id: tweet.id,
      date: date.format("YYYY/MM/DD HH:mm:ss"),
      profile: {
        name: tweet.user.name,
        image: tweet.user.profile_image_url_https.replace('_normal', '_400x400')
      },
      sentence: text
    };
    outputs.push(output);
  });

  console.log('add tweets: ' + outputs.length);
  outputs = outputs.reverse();

  if (previous != null) {
    outputs = previous.questions.concat(outputs);
    fs.unlinkSync(path);
  }

  console.log('total tweets: ' + outputs.length);
  
  const questions = {
    questions: outputs
  };
  fs.appendFileSync(path, JSON.stringify(questions));
}

client.get('statuses/user_timeline', params, outputTweets);
