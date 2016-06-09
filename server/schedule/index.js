/**
 * Created by jinny on 16. 6. 7.
 */
export default function(config) {
  // Setup agenda
  var Agenda = require("agenda");
  //console.log(config.mongo.uri)
  var agenda = new Agenda({db: { address: config.mongo.uri, collection: 'agendaJobs'}});

  var showMessageJob = require('./jobs/showMessage');
  var rollbackOrderJob = require('./jobs/rollbackOrder');

  agenda.on('ready', function(){
    showMessageJob.showMessage(agenda);
    rollbackOrderJob.rollbackOrder(agenda);
    agenda.cancel({name: {$in:['show message','rollback order']}}, function(err, numRemoved) {
      console.log('>>Jobs Removed: '+ numRemoved);
    });
    //agenda.every('tomorrow at noon', ['printAnalyticsReport', 'sendNotifications', 'updateUserRecords']);
    //agenda.every('5 seconds', 'show message');
    //every 02:00, 03:00 AM
    //agenda.every('0 2,3 * * *', [
    //  'show message',
    //  'rollback order'
    //]);
    agenda.every('60 seconds', [
      'show message',
      'rollback order'
    ]);
  });

  agenda.start();
  return agenda;
}
