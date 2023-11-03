import { expect } from 'chai';
import mealcity from '../../utils/database';

describe('Mealcity class', () => {
    it('should connect to database', () => {
        expect(mealcity.client.isConnected()).to.be.true;
    });

    it('should check if connection is alive', () => {
        expect(mealcity.isAlive()).to.be.true;
    });

    it('Should get the number of users from the database', async () => {
        const counter = await mealcity.getUsers();
        expect(counter).to.be.a('number');
        expect(counter).to.be.at.least(0);
    });


    it('Should get the number of users from the database', async () => {
        const counter = await mealcity.getWaitlist();
        expect(counter).to.be.a('number');
        expect(counter).to.be.at.least(0);
    });

    
});