/**
 * Created by jinny on 16. 6. 7.
 */
export default function(config) {
  // Setup agenda
  var Agenda = require("agenda");
  //console.log(config.mongo.uri)
  var agenda = new Agenda({db: { address: config.mongo.uri, collection: 'agendaJobs'}});

  var showMessageJob = require('./jobs/showMessage');

  agenda.on('ready', function(){
    showMessageJob.showMessage(agenda);
    agenda.every('5 seconds', 'show message');
  });

  agenda.start();
  return agenda;
}
