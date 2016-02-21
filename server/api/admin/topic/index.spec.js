'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var adminTopicCtrlStub = {
  index: 'adminTopicCtrl.index',
  show: 'adminTopicCtrl.show',
  create: 'adminTopicCtrl.create',
  update: 'adminTopicCtrl.update',
  destroy: 'adminTopicCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var adminTopicIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './topic.controller': adminTopicCtrlStub
});

describe('AdminTopic API Router:', function() {

  it('should return an express router instance', function() {
    adminTopicIndex.should.equal(routerStub);
  });

  describe('GET /api/admin/topics', function() {

    it('should route to adminTopic.controller.index', function() {
      routerStub.get
        .withArgs('/', 'adminTopicCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/admin/topics/:id', function() {

    it('should route to adminTopic.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'adminTopicCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/admin/topics', function() {

    it('should route to adminTopic.controller.create', function() {
      routerStub.post
        .withArgs('/', 'adminTopicCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/admin/topics/:id', function() {

    it('should route to adminTopic.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'adminTopicCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/admin/topics/:id', function() {

    it('should route to adminTopic.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'adminTopicCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/admin/topics/:id', function() {

    it('should route to adminTopic.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'adminTopicCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
