const router = require('express').Router();

router.get('/', (req, res) => {
	res.send(process.env.DB_HOST);
});

module.exports = router;
