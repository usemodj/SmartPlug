'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var topicCtrlStub = {
  index: 'topicCtrl.index',
  show: 'topicCtrl.show',
  create: 'topicCtrl.create',
  update: 'topicCtrl.update',
  destroy: 'topicCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var topicIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './topic.controller': topicCtrlStub
});

describe('Topic API Router:', function() {

  it('should return an express router instance', function() {
    topicIndex.should.equal(routerStub);
  });

  describe('GET /api/topics', function() {

    it('should route to topic.controller.index', function() {
      routerStub.get
        .withArgs('/', 'topicCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/topics/:id', function() {

    it('should route to topic.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'topicCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/topics', function() {

    it('should route to topic.controller.create', function() {
      routerStub.post
        .withArgs('/', 'topicCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/topics/:id', function() {

    it('should route to topic.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'topicCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/topics/:id', function() {

    it('should route to topic.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'topicCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/topics/:id', function() {

    it('should route to topic.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'topicCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
