#! /bin/bash

# To run the server on `production mode` using ___PM2___,
# copy the `start.sample.sh` bash file to `start.sh`,
# modify the parameters, and change the file into `execute` mode:
#```
# $ cp start.sample.sh  start.sh
# $ chmod a+x start.sh
#```                                                                                                                                                                                                                                                                                                       ange the file mode to execute (`chmod a+x start.sh`).
#                                                                                                                                                                                                                                   																																						                                                                                                                                                                Then, run the `start.sh`.
#* [PM2](http://pm2.keymetrics.io/) - Advanced, production process manager for Node.js
#```
## Install `PM2` globally:
# $ yarn global add pm2
## Or, use this command `sudo npm install -g pm2`
# $
# $ pm2 --help
#```
#
# Run `start.sh` script:
#```
# $ ./start.sh
#
# Check the server running status:
# $ pm2 status
#```
#
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
pm2 start $(dirname "$0")/dist/server --name "smartplug"
