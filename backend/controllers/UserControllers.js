import { uuidV4} from 'uuid';
import mealcity from '../utils/database';
import redisClient from '../utils/redis-db';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const bcrypt = require('bcrypt');

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
        const hashed_password = await bcrypt.hash(password, 10);
        const createUser = await mealcity.db.collection('users').insertOne({ names, email, password: hashed_password });
        if (createUser) {
          return res.status(201).send({ id: createUser.insertedId, email: email });
        }
        
    }

    async login(req, res) {
      const { email, password } = req.body;
      try {
        if (!email || !password) {
          return res.status(400).send({error: 'User credientials not provided'});
        }

        const usr_mail = await mealcity.db.collection('users').findOne({ email });
        if (!usr_mail) {
          return res.status(401).send({error: 'User does not exist'});
        }
        const chkpassword = await bcrypt.compare(password, usr_mail.password);
        if (!chkpassword) {
          return res.status(400).send({error: 'Invalid password'});
        }
        const token = jwt.sign({email, userId: usr_mail._id.toString()}, '4be41d164a4fdeac0fb4be594853f792e16fdc190101f5c89905ae0ce4aee5d9', { expiresIn: '1h' });
        const key = `auth_${token}`;
        await redisClient.set(key, usr_mail._id.toString(), 86400);
        return res.status(200).send({token});
      } catch (err) {
        console.log(`Error ocurred ${err}`);
        res.status(401).send({error: 'Server Error'});
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