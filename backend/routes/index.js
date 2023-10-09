import usercontroller from '../controllers/UserControllers';

const express = require('express');
const router = express.Router();

router.post('/users', (res, req) => {
    usercontroller.createNew(res, req)
});

export default router;