const router = require('express').Router();
const multer = require('multer')();

//import services
const UserService = require('../user/user.service');
const MarketService = require('../market/market.service');

router.get('/', (req, res) => {
	res.json({ isUserAuth: req.isUserAuth, userId: req.userId });
});

//Market routes
router.post('/markets', multer.array('images', 3), (req, res, next) => {
	const { files, body } = req;
	const marketService = MarketService.getInstance(req.isUserAuth);
	marketService
		.create({ files, body })
		.then((results) => res.json(results))
		.catch((e) => next(e));
});

router.get('/markets', (req, res, next) => {
	const { first, nextCursor } = req.query;
	const marketService = MarketService.getInstance();
	marketService
		.getMarkets({ first, after: nextCursor })
		.then((result) => res.json(result))
		.catch((e) => next(e));
});
router.get('/markets/search', (req, res, next) => {
	const { searchText } = req.query;
	const marketService = MarketService.getInstance();
	marketService
		.search(searchText)
		.then((result) => res.json(result))
		.catch((e) => next(e));
});
router.get('/markets/nearest-market', (req, res, next) => {
	const { coordinates } = req.query;
	const marketService = MarketService.getInstance();
	marketService
		.nearestMarket(coordinates)
		.then((result) => res.json(result))
		.catch((e) => next(e));
});
router.post('/markets/bulk', (req, res, next) => {
	const marketService = MarketService.getInstance();
	marketService
		.createBulk(req.body)
		.then((result) => res.json(result))
		.catch((e) => next(e));
});
router.get('/markets/:id', (req, res, next) => {
	const { id } = req.params;
	const marketService = MarketService.getInstance();
	marketService
		.getMarket(id)
		.then((result) => res.json(result))
		.catch((e) => next(e));
});
router.delete('/markets/:id', (req, res, next) => {
	const { id } = req.params;
	const marketService = MarketService.getInstance(req.isUserAuth);
	marketService
		.delete(id)
		.then((result) => res.json(result))
		.catch((e) => next(e));
});
router.put('/markets/:id', multer.array('images', 3), (req, res, next) => {
	const { files, body } = req;
	const { id } = req.params;
	const marketService = MarketService.getInstance(req.isUserAuth);
	marketService
		.update({ id, files, body })
		.then((result) => res.json(result))
		.catch((e) => next(e));
});

//User routes
router.post('/signin', (req, res, next) => {
	UserService.getInstance()
		.signIn(req.body)
		.then((response) => res.json(response))
		.catch((e) => next(e));
});
router.post('/signup', (req, res, next) => {
	UserService.getInstance()
		.signUp(req.body)
		.then((user) => res.json(user))
		.catch((error) => next(error));
});
router.get('/users', async (req, res) => {
	UserService.getInstance()
		.users()
		.then((user) => res.json(user))
		.catch((error) => next(error));
});
module.exports = router;
