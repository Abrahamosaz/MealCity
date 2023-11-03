import redisClient from '../../utils/redis-db';
import { expect } from 'chai';


describe('RedisClient Class', () => {
    it('should connect to the redis database', () => {
        expect(redisClient.client.connected).to.be.true;
    });

    it('should check if the redis connection is alive', () => {
        expect(redisClient.isAlive()).to.be.true;
    });
});