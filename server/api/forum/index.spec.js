'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var forumCtrlStub = {
  index: 'forumCtrl.index',
  show: 'forumCtrl.show',
  create: 'forumCtrl.create',
  update: 'forumCtrl.update',
  destroy: 'forumCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var forumIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './forum.controller': forumCtrlStub
});

describe('Forum API Router:', function() {

  it('should return an express router instance', function() {
    forumIndex.should.equal(routerStub);
  });

  describe('GET /api/forums', function() {

    it('should route to forum.controller.index', function() {
      routerStub.get
        .withArgs('/', 'forumCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/forums/:id', function() {

    it('should route to forum.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'forumCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/forums', function() {

    it('should route to forum.controller.create', function() {
      routerStub.post
        .withArgs('/', 'forumCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/forums/:id', function() {

    it('should route to forum.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'forumCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/forums/:id', function() {

    it('should route to forum.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'forumCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/forums/:id', function() {

    it('should route to forum.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'forumCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
