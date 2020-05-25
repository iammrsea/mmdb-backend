const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const cors = require('cors');

//import routes handler
const router = require('./modules/router/router.service');

//import custom modules
const { handleError } = require('./utils');
const authorizationService = require('./modules/authorization/authorization.service');

//Creates express app
const app = express();

//Initialize middleware stack
dotEnv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authorizationService);

//Handle route requests
app.use('/api', router);

//Handle errors
// app.use(handleError);

//Connect to database
mongoose
	.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((value) => {
		console.log(`Successfully connected to database: ${process.env.DB_HOST}`);

		return app.listen(process.env.PORT || 5000);
	})
	.then(() => {
		console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 5000}`);
	})
	.catch((error) => {
		console.log(error);
	});
