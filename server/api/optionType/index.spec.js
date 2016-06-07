'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var optionTypeCtrlStub = {
  index: 'optionTypeCtrl.index',
  show: 'optionTypeCtrl.show',
  create: 'optionTypeCtrl.create',
  update: 'optionTypeCtrl.update',
  destroy: 'optionTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var optionTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './optionType.controller': optionTypeCtrlStub
});

describe('OptionType API Router:', function() {

  it('should return an express router instance', function() {
    optionTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/optionTypes', function() {

    it('should route to optionType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'optionTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/optionTypes/:id', function() {

    it('should route to optionType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'optionTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/optionTypes', function() {

    it('should route to optionType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'optionTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/optionTypes/:id', function() {

    it('should route to optionType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'optionTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/optionTypes/:id', function() {

    it('should route to optionType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'optionTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/optionTypes/:id', function() {

    it('should route to optionType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'optionTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
