const UserController = require('./UserControllers');
const Mealcity = require('../utils/database');
const RedisClient = require('../utils/redis-db');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');


describe('UserController', () => {
    let sandbox;
  
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    describe('createNew', () => {
      it('should create a new user', async () => {
        const req = {
          body: {
            email: 'testing@yahoo.com',
            password: 'drinko',
            names: 'test User'
          }
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
        };

        const usersCollection = sandbox.stub(Mealcity.db, 'collection').withArgs('users');
        usersCollection.returns({
            findOne: sandbox.stub().resolves(null),
            insertOne: sandbox.stub().resolves({
                insertedId: '123'
            })
        })
        await UserController.createNew(req, res);
  
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.send.calledWith({ id: '123', email: 'testing@yahoo.com' })).to.be.true;
      });
    });
  
    describe('login', () => {
      it('should login a user', async () => {
        const req = {
          body: {
            email: 'testing@yahoo.com',
            password: 'drinko'
          }
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
        };
  
        const testUser = {
          _id: '123',
          email: 'testing@yahoo.com',
          password: await bcrypt.hash('drinko', 10)
        };
  
        sandbox.stub(Mealcity.db.collection('users'), 'findOne').resolves(testUser);
        sandbox.stub(bcrypt, 'compare').resolves(true);
        sandbox.stub(RedisClient, 'set').resolves();
        sandbox.stub(jwt, 'sign').returns('token');
  
        await UserController.login(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledWith({ token: 'token' })).to.be.true;
      });
    });
  
    describe('disconnect', () => {
      it('should log out a user', async () => {
        const req = {
          header: sinon.stub().returns('token')
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
        };
  
        sandbox.stub(RedisClient, 'get').resolves('userId');
        sandbox.stub(RedisClient, 'del').resolves();
  
        await UserController.disconnect(req, res);
  
        expect(RedisClient.del.calledWith('auth_token')).to.be.true;
        expect(res.status.calledWith(204)).to.be.true;
        expect(res.send.calledWith({})).to.be.true;
      });
  
      it('should return 401 if user is not found', async () => {
        const req = {
          header: sinon.stub().returns('token')
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
        };
  
        sandbox.stub(RedisClient, 'get').resolves(null);
  
        await UserController.disconnect(req, res);
  
        expect(RedisClient.del.notCalled).to.be.true;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.send.calledWith({ error: 'Unauthorized' })).to.be.true;
      });
    });
  
    describe('getMe', () => {
      it('should get authenticated user', async () => {
        const req = {
          header: sinon.stub().returns('X-Token')
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
        };
  
        const userId = 'userId';
        sandbox.stub(RedisClient, 'get').resolves(userId);
  
        const user = {
          _id: userId,
          email: 'user@example.com'
        };
  
        const getMestub = sandbox.stub(Mealcity.db, 'collection').withArgs('users');
        getMestub.returns({
            findOne: sandbox.stub().resolves(user)
        })
        await UserController.getMe(req, res);
  
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.send.calledWith({ id: userId, email: 'user@example.com' })).to.be.true;
      });
  
      it('should return 401 if user is not found', async () => {
        const req = {
          header: sinon.stub().returns('token')
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
        };
  
        sandbox.stub(RedisClient, 'get').resolves(null);
  
        await UserController.getMe(req, res);
  
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.send.calledWith({ error: 'Unauthorized' })).to.be.true;
      });
    });
  });