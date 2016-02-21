'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var mailCtrlStub = {
  index: 'mailCtrl.index',
  show: 'mailCtrl.show',
  create: 'mailCtrl.create',
  update: 'mailCtrl.update',
  destroy: 'mailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mailIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './mail.controller': mailCtrlStub
});

describe('Mail API Router:', function() {

  it('should return an express router instance', function() {
    mailIndex.should.equal(routerStub);
  });

  describe('GET /api/mails', function() {

    it('should route to mail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'mailCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/mails/:id', function() {

    it('should route to mail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'mailCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/mails', function() {

    it('should route to mail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'mailCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/mails/:id', function() {

    it('should route to mail.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'mailCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/mails/:id', function() {

    it('should route to mail.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'mailCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/mails/:id', function() {

    it('should route to mail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'mailCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
