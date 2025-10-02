const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.get('/', ctrl.getAll);                         // GET /users?username=&fullName=
router.get('/username/:username', ctrl.getByUsername);// GET /users/username/:username
router.get('/:id', ctrl.getById);                     // GET /users/:id
router.post('/', ctrl.create);                        // POST /users
router.put('/:id', ctrl.update);                      // PUT /users/:id
router.delete('/:id', ctrl.softDelete);               // DELETE /users/:id (soft)
router.post('/verify', ctrl.verifyUser);              // POST /users/verify

module.exports = router;
