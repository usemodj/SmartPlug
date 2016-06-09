/**
 * Created by jinny on 16. 6. 10.
 */

import moment from 'moment';
import _ from 'lodash';
import async from 'async';
import Order from '../../api/order/order.model';
import Variant from '../../api/variant/variant.model';

exports.rollbackOrder = function(agenda) {
  agenda.define('rollback order', function(job, done) {
    console.log("Rollback Order Job.");
    try {
      //var date = moment().subtract(3, 'days');
      var date = moment().subtract(2, 'minutes')
      //console.log('>>Date: ', date);
      Order.find({
        $and:[
          {updated_at: {$lt: date}},
          {$or:[
            {state: {$in:['Address','Shipping','Payment','Confirm']}},
            {state: 'Complete', payment_state: 'Balance-Due'}
          ]}
        ]
      })
      .populate('order_items')
      .sort('updated_at')
      .limit(500)
      .execAsync()
      .then(orders => {
          console.log('>>count: ', orders.length);

          var result = null;
          async.each(orders, (order, callback) => {
            console.log('>> rollback order: ', order.number, ': ', order.state, ': ', order.payment_state, ': ', order.updated_at);

            async.each(order.order_items, (item, cb) => {
              console.log(item);
              Variant.findByIdAsync(item.variant._id)
              .then(variant => {
                variant.quantity += item.quantity;
                return variant.saveAsync();
              })
              .then(updated => {
                  item.removeAsync();
                  cb();
                })
              .catch(err => {
                  cb();
                })
            }, err => {
              result = order;
              callback();
            });

          }, (err) => {
            if(result) result.removeAsync();
            done();
          });
        })
      .catch(err => {
          console.error(err);
          done(err);
        });

    } catch(err){
      console.error(err);
    }

  });

}
