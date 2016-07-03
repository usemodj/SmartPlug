#! /bin/bash
#NODE_ENV=production PORT=3800  npm start
NODE_ENV=production \
PORT=3800 \
DOMAIN='http://localhost' \
POST_MAILER='postmaster@localhost' \
DATA_SERVICE_KEY='data.go.kr serviceKey' \
MONGO_URI='mongodb://localhost/smartplug' \
SESSION_SECRET='smartplug-secret' \
FACEBOOK_ID='app-id' \
FACEBOOK_SECRET='secret' \
TWITTER_ID='app-id' \
TWITTER_SECRET='secret' \
GOOGLE_ID='app-id' \
GOOGLE_SECRET='secret' \
pm2 start $(dirname "$0")/server --name "smartplug"
