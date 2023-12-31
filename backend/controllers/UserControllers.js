const { v4: uuidV4 } = require('uuid');
const Mealcity = require('../utils/database');
const RedisClient = require('../utils/redis-db');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');


const bcrypt = require('bcrypt');

//User Controller class for registering, logging in a user, getting a user and logging out a user
class UserController {

    // A function which checks if a user is registered, if not registers the user and add the user to the database
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

        const findEmail = await Mealcity.db.collection('users').findOne({ email });
        
        if (findEmail) {
           return res.status(400).send({ error: 'Already exists' });
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const createUser = await Mealcity.db.collection('users').insertOne({ names, email, password: hashed_password });
        if (createUser) {
          return res.status(201).send({ id: createUser.insertedId, email: email });
        }
        
    }

    async login(req, res) {
      // This is a function which checks, validates a users details and gives the user access to the site
      const { email, password } = req.body;
      try {
        if (!email || !password) {
          return res.status(400).send({error: 'User credientials not provided'});
        }

        const usr_mail = await Mealcity.db.collection('users').findOne({ email });
        if (!usr_mail) {
          return res.status(401).send({error: 'User does not exist'});
        }
        const chkpassword = await bcrypt.compare(password, usr_mail.password);
        if (!chkpassword) {
          return res.status(400).send({error: 'Invalid password'});
        }
        const token = jwt.sign({email, userId: usr_mail._id.toString()}, '4be41d164a4fdeac0fb4be594853f792e16fdc190101f5c89905ae0ce4aee5d9', { expiresIn: '1h' });
        const key = `auth_${token}`;
        await RedisClient.set(key, usr_mail._id.toString(), 86400);
        return res.status(200).send({token});
      } catch (err) {
        console.log(`Error ocurred ${err}`);
        res.status(401).send({error: 'Server Error'});
      }

    }
    
    async disconnect(req, res) {
      // This gets the user key stored in the redis database and deletes it, thereby logging out the user
      const authhead = req.header('X-token');
      if (!authhead) {
          return res.status(401).send({'error': 'Unauthorized'});
      }
      const key = `auth_${authhead}`;
      const userId = await RedisClient.get(key);
      if (userId) {
      await RedisClient.del(key);
      return res.status(204).send({});
      } else {
          return res.status(401).send({error: 'Unauthorized'});
        }
      }
    
    async getMe(req, res) {
      //This function gets the current user authenticated
        const token = req.header('X-Token');
        if (!token) {
            return res.status(400).send({'error': 'Unauthorized'});
        }

        const myKey = `auth_${token}`;

        const userId = await RedisClient.get(myKey);
        if (!userId || !ObjectId.isValid(userId)) {
          return res.status(401).send({'error': 'Unauthorized'});
        }
        if (userId) {
          const user_id = await Mealcity.db.collection('users').findOne({ _id: new ObjectId(userId)});
          if (!user_id) {
            return res.status(401).send({'error': 'Unauthorized'});
          }
          return res.status(201).send({id: userId, email: user_id.email});
        
        }
    }
}

module.exports = new UserController();