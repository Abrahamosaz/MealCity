import jwt from 'jsonwebtoken';
import sha1 from 'sha1';
import mealcity from '../utils/database';


class AuthController {
    async connect(req, res) {
        const authHead = req.header('Authorization');
        if (!authHead || !authHead.startsWith('Basic ')) {
            return res.status(400).send({'error': 'Unauthorized'});
        }
        const credientials = authHead.split(' ')[1];
        const details = Buffer.from(credientials, 'base64').toString('ascii');
        const password = details.split(':')[1];
        const email = details.split(':')[0];
        const hashed_password = sha1(password);
        // const secret_key = process.env.JWT_SECRET_KEY;
        try {
            const usr = await mealcity.db.collection('users').findOne({ email: email, password: hashed_password });
            if (usr) {
                const token = jwt.sign({email, userId: usr._id.toString()}, '4be41d164a4fdeac0fb4be594853f792e16fdc190101f5c89905ae0ce4aee5d9', { expiresIn: '1h' });
                return res.status(200).send({token});
            } else {
                return res.status(400).send({'error': 'Unauthorized'});
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({'error': 'Oops.... Internal Server Error'});
        }
    }
}

export default new AuthController();