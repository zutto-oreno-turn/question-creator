const twitter = require('twitter');
const fs = require('fs');
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
  params.since_id = previous.questions[0].id;
  console.log(JSON.stringify(params));
}

const client = new twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});

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

  console.log('new tweets: ' + tweets.length);

  let outputs = [];
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

  console.log('add tweets: ' + outputs.length);

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
