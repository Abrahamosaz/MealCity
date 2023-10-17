import UserController from '../controllers/UserControllers';
import Authcontroller from '../controllers/AuthController';
import express from 'express';

export default function Routes(app) {
const router = express.Router();
app.use('/', router);
router.post('/users', (req, res) => {
    UserController.createNew(req, res);
});

router.get('/connect', (req, res) => {
    Authcontroller.connect(req, res);
});
}