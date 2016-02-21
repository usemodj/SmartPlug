'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var supportCtrlStub = {
  index: 'supportCtrl.index',
  show: 'supportCtrl.show',
  create: 'supportCtrl.create',
  update: 'supportCtrl.update',
  destroy: 'supportCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var supportIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './support.controller': supportCtrlStub
});

describe('Support API Router:', function() {

  it('should return an express router instance', function() {
    supportIndex.should.equal(routerStub);
  });

  describe('GET /api/supports', function() {

    it('should route to support.controller.index', function() {
      routerStub.get
        .withArgs('/', 'supportCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/supports/:id', function() {

    it('should route to support.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'supportCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/supports', function() {

    it('should route to support.controller.create', function() {
      routerStub.post
        .withArgs('/', 'supportCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/supports/:id', function() {

    it('should route to support.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'supportCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/supports/:id', function() {

    it('should route to support.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'supportCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/supports/:id', function() {

    it('should route to support.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'supportCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
