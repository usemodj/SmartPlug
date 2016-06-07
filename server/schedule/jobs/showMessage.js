/**
 * Created by jinny on 16. 6. 7.
 */
exports.showMessage = function(agenda) {
  agenda.define('show message', function(job, done) {
    console.log("Shows message.");
    done();
  });
}
