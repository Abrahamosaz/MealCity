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
});