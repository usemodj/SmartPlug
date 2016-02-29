'use strict';

import User from '../api/user/user.model';

User.countAsync({role: 'admin'})
  .then(count => {
    if(count > 0) return;
    User.createAsync({
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
      .then(() => {
        console.log('finished populating admin user');
      });

  });
