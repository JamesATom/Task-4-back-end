const express = require('express');
const router = express.Router();
const { Users } = require('../models');

const changeToArray = (req, res, next) => {
    let { block } = req.body;
    req.arr = JSON.parse(block);
    next();
}

router.get('/', async (req, res) => {
    const wholeTable = await Users.findAll();
    res.send(wholeTable);
});

router.post('/sign-up', async (req, res) => {
    const { username, email, password } = req.body;
    const [user, created] = await Users.findOrCreate(
        { where: { email },
          defaults: { 
            "name": username,
            "email": email,
            "password": password,
            "status": "active"
        }
    });
    res.status(created ? 201 : 409).send(created ? 'success' : 'failure');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await Users.findOne({ where: [{"email": email}, {"password": password}] });
    res.status(result == null ? 404 : 202).send(result == null ? 'failure' : 'success');
});

router.put('/delete', changeToArray, async (req, res) => {
    await Users.destroy({ where: { id: [...req.arr] }});
    res.status(req.arr == 0 ? 204 : 200).send(req.arr == 0 ? 'failure' : 'success');
});

router.put('/unblock', changeToArray, async (req, res) => {
    await Users.update({ status: "active" }, { where: { id: [...req.arr] } });
    res.status(req.arr == 0 ? 204 : 200).send(req.arr == 0 ? 'failure' : 'success');
});

router.put('/block', changeToArray, async (req, res) => {
    await Users.update({ status: "blocked" }, { where: { id: [...req.arr] } });
    res.status(req.arr == 0 ? 204 : 200).send(req.arr == 0 ? 'failure' : 'success');
});

module.exports = router;