'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var stateChangeCtrlStub = {
  index: 'stateChangeCtrl.index',
  show: 'stateChangeCtrl.show',
  create: 'stateChangeCtrl.create',
  update: 'stateChangeCtrl.update',
  destroy: 'stateChangeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var stateChangeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './stateChange.controller': stateChangeCtrlStub
});

describe('StateChange API Router:', function() {

  it('should return an express router instance', function() {
    stateChangeIndex.should.equal(routerStub);
  });

  describe('GET /api/stateChanges', function() {

    it('should route to stateChange.controller.index', function() {
      routerStub.get
        .withArgs('/', 'stateChangeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/stateChanges/:id', function() {

    it('should route to stateChange.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'stateChangeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/stateChanges', function() {

    it('should route to stateChange.controller.create', function() {
      routerStub.post
        .withArgs('/', 'stateChangeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/stateChanges/:id', function() {

    it('should route to stateChange.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'stateChangeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/stateChanges/:id', function() {

    it('should route to stateChange.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'stateChangeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/stateChanges/:id', function() {

    it('should route to stateChange.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'stateChangeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
