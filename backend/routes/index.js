import usercontroller from '../controllers/UserControllers';
import authcontroller from '../controllers/Authcontrollers';
const express = require('express');
const router = express.Router();

router.post('/users', (req, res) => {
    usercontroller.createNew(req, res);
});

router.get('/connect', (req, res) => {
    authcontroller.connect(req, res);
});
export default router;