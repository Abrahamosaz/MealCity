import sha1  from 'sha1';
import { uuidV4} from 'uuid';
import mealcity from '../utils/database';
import redisClient from '../utils/redis-db';
import { ObjectId } from 'mongodb';

class UserController {
    async createNew(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const names = req.body.names;

        if (!names) {
          return res.status(400).send({error: 'Missing name'});
        }

        if (!email) {
            return res.status(400).send({error: 'Missing email'});
        }

        if (!password) {
            return res.status(400).send({error: 'Missing password'});
        }

        const findEmail = await mealcity.db.collection('users').findOne({ email });
        
        if (findEmail) {
           return res.status(400).send({ error: 'Already exists' });
        }
        const hashed_password = sha1(password);
        
        const createUser = await mealcity.db.collection('users').insertOne({ names, email, password: hashed_password });
        if (createUser) {
          return res.status(201).send({ id: createUser.insertedId, email: email });
        }
        
    }
    async getMe(req, res) {
        const token = req.header('X-Token');
        if (!token) {
            return res.status(400).send({'error': 'Unauthorized'});
        }

        const myKey = `auth_${token}`;

        const userId = await redisClient.get(myKey);
        if (userId) {
          const user_id = await mealcity.db.collection('users').findOne({ _id: new ObjectId(userId)});
          if (!user_id) {
            return res.status(401).send({'error': 'Unauthorized'});
          }
          return res.status(201).send({id: userId, email: user_id.email});
        
        }
    }
}

export default new UserController();