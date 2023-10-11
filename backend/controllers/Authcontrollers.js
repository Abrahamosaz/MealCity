import jwt from 'jsonwebtoken';
import sha1 from 'sha1';
import mealcity from '../utils/database';

class Authcontroller {
    async connect(req, res) {
        const auth = req.header('Authorization');
        const jwtAuth = auth.split(' ')[1];
        const buff = Buffer.from(jwtAuth, 'base64');
        const data = buff.toString('ascii');
        const [ usremail, password ] = data.split(':');
        const hash_password = sha1(password);
        const usr = await mealcity.db.collection('users').findOne({ usremail, hash_password });
        if (usr) {
            const token = jwt.sign({ usremail, userId: usr._id.toString()}, 'a84fb4c2d91f7cd683af221343c4bf25224379771c19d384f691e866f3ed61a6', { expiresIn: '1h'});
            return res.status(201).send({ token });
        } else {
            res.status(400).send({error: 'Unauthorized'});
        }
    }
}

const authcontroller = new Authcontroller();
export default authcontroller;