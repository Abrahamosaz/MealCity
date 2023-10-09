import sha1  from 'sha1';
import { uuidV4} from 'uuid';
import mealcity from '../utils/database';

class UserController {
    async createNew(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (!email) {
            return res.status(400).send({error: 'Missing email'});
        }

        if (!password) {
            return res.status(400).send({error: 'Missing password'});
        }
        
        const hashed_password = sha1(password);
        // const User = {
        //     email,
        //     password: hashed_password,
        // }
        const createUser = await mealcity.db.collection('users').insertOne({ email, password: hashed_password });
        if (createUser) {
          return res.status(201).send({ id: createUser.insertedId, email: email });
        }
        const findEmail = await mealcity.db.collection('users').findOne({ email });
        
        if (findEmail) {
          return res.status(400).send({error: 'Already exist'});
        }
    }
}

const usercontroller = new UserController();
export default usercontroller;