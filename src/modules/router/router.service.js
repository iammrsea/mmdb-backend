const router = require('express').Router();

//import services
const userService = require('../user/user.service');

router.get('/', (req, res) => {
	res.send(process.env.DB_HOST);
});

router.post('/signin', (req, res, next) => {
	userService
		.signIn(req.body)
		.then((response) => res.json(response))
		.catch((e) => next(e));
});
router.post('/signup', (req, res, next) => {
	userService
		.signUp(req.body)
		.then((user) => res.json(user))
		.catch((error) => next(error));
});
router.get('/users', async (req, res) => {
	userService
		.users()
		.then((user) => res.json(user))
		.catch((error) => next(error));
});
module.exports = router;
