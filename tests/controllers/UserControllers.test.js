import UserController from '../../backend/controllers/UserControllers';

import mealcity from '../../backend/utils/database';
import redisClient from '../../backend/utils/redis-db';
import jwt from 'jsonwebtoken';
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

describe('UserController', () => {
    beforeEach(() => {
        sinon.stub(mealcity.db.collection('users'), 'findOne');
        sinon.stub(mealcity.db.collection('users'), 'insertOne');
        sinon.stub(redisClient, 'get');
        sinon.stub(redisClient, 'set');
        sinon.stub(redisClient, 'del');
        sinon.stub(jwt, 'sign');
        sinon.stub(bcrypt, 'hash');
        sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        sinon.restore();
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
                status: sinon.stub(),
                send: sinon.stub()
            };

            mealcity.db.collection('users').findOne.returns(null);
            bcrypt.hash.resolves('hashed_password');
            mealcity.db.collection('users').insertOne.resolves({ insertedId: '123' });

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
            }
            const res = {
                status: sinon.stub(), send: sinon.stub() 
            };

            const test_user = {
                _id: '123',
                email: 'testing@yahoo.com',
                password: 'drinko'
            };
            mealcity.db.collection('users').findOne.returns(test_user);
            bcrypt.compare.resolves(true);
            jwt.sign.returns('token');

            await UserController.login(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({
                token: 'token'
            })).to.be.true;
        });
    });

    describe('disconnect', () => {
        let req, res, redisClient;

        beforeEach(() => {
            req = {
                header: sinon.stub()
            };

            res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            redisClient = {
                get: sinon.stub(),
                del: sinon.stub()
            };
        })
        it('should log out a user', async () => {
            req.header.withArgs('X-token').returns('token');
            redisClient.get.withArgs('auth_token').resolves('userId');

            await disconnect(req, res, redisClient);

            expect(redisClient.del).to.be.calledWith('auth_token');
            expect(res.status).to.be.calledOnceWith(204);
            expect(res.send).to.be.calledOnceWith({});
        });

        it('should return 401 if user is not found', async () => {
            req.header.withArgs('X-token').returns('token');
            redisClient.get.withArgs('auth_token').resolves(null);

            await disconnect(req, res, redisClient);

            expect(redisClient.del).to.not.be.called;
            expect(res.status).to.be.calledOnceWith(401);
            expect(res.send).to.be.calledOnceWith({ 'error': 'Unauthorized' });
        });
    });
});