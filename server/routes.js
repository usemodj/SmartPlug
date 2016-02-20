/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/admin/topics', require('./api/admin/topic'));
  app.use('/api/topics', require('./api/topic'));
  app.use('/api/admin/forums', require('./api/admin/forum'));
  app.use('/api/forums', require('./api/forum'));
  app.use('/api/admin/supports', require('./api/admin/support'));
  app.use('/api/supports', require('./api/support'));
  app.use('/api/assets', require('./api/asset'));
  app.use('/api/blogs', require('./api/blog'));
  app.use('/api/mails', require('./api/mail'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
