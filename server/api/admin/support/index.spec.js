'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var adminSupportCtrlStub = {
  index: 'adminSupportCtrl.index',
  show: 'adminSupportCtrl.show',
  create: 'adminSupportCtrl.create',
  update: 'adminSupportCtrl.update',
  destroy: 'adminSupportCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var adminSupportIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './support.controller': adminSupportCtrlStub
});

describe('AdminSupport API Router:', function() {

  it('should return an express router instance', function() {
    adminSupportIndex.should.equal(routerStub);
  });

  describe('GET /api/admin/supports', function() {

    it('should route to adminSupport.controller.index', function() {
      routerStub.get
        .withArgs('/', 'adminSupportCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/admin/supports/:id', function() {

    it('should route to adminSupport.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'adminSupportCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/admin/supports', function() {

    it('should route to adminSupport.controller.create', function() {
      routerStub.post
        .withArgs('/', 'adminSupportCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/admin/supports/:id', function() {

    it('should route to adminSupport.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'adminSupportCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/admin/supports/:id', function() {

    it('should route to adminSupport.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'adminSupportCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/admin/supports/:id', function() {

    it('should route to adminSupport.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'adminSupportCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
