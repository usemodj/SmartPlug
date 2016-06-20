#! /bin/bash
#NODE_ENV=production PORT=3800  npm start
NODE_ENV=production \
PORT=3800 \
DOMAIN='http://makrlamp.com' \
POST_MAILER='postmaster@makrlamp.com' \
MONGO_URI='mongodb://localhost/makrlamp_com' \
SESSION_SECRET='makrlamp-secret' \
FACEBOOK_ID='app-id' \
FACEBOOK_SECRET='secret' \
TWITTER_ID='app-id' \
TWITTER_SECRET='secret' \
GOOGLE_ID='254143463317-v5i2cbc8ge0co2e1n70kgbu9oqrpp51s.apps.googleusercontent.com' \
GOOGLE_SECRET='LmNueIMpMOUkLscJyqy2_aK-' \
pm2 start server
