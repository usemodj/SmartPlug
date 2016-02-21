'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var adminForumCtrlStub = {
  index: 'adminForumCtrl.index',
  show: 'adminForumCtrl.show',
  create: 'adminForumCtrl.create',
  update: 'adminForumCtrl.update',
  destroy: 'adminForumCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var adminForumIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './forum.controller': adminForumCtrlStub
});

describe('AdminForum API Router:', function() {

  it('should return an express router instance', function() {
    adminForumIndex.should.equal(routerStub);
  });

  describe('GET /api/admin/forums', function() {

    it('should route to adminForum.controller.index', function() {
      routerStub.get
        .withArgs('/', 'adminForumCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/admin/forums/:id', function() {

    it('should route to adminForum.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'adminForumCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/admin/forums', function() {

    it('should route to adminForum.controller.create', function() {
      routerStub.post
        .withArgs('/', 'adminForumCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/admin/forums/:id', function() {

    it('should route to adminForum.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'adminForumCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/admin/forums/:id', function() {

    it('should route to adminForum.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'adminForumCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/admin/forums/:id', function() {

    it('should route to adminForum.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'adminForumCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
