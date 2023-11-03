import mealcity from '../../backend/utils/database';
import UserController from '../../backend/controllers/UserControllers';
import sinon from 'sinon';
import { expect } from 'chai';

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
                    email: 'testing@gmail.com',
                    password: 'pass123',
                    names: 'myname'
                }
            };

            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            sandbox.stub(mealcity.db.collection('users'), 'findOne').resolves(null);
            sandbox.stub(mealcity.db.collection('users'), 'insertOne').resolves({ insertedId: '123' });

            await UserController.createNew(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith({ id: '123', email: 'test@example.com' })).to.be.true;
        })
    })
})