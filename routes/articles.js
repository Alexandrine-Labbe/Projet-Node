const express = require('express');
const axios = require('axios');
const passport = require('passport')
const passportJWT = require('passport-jwt')
const secret = 'wowasecret'


const router = express.Router();

const baseUrl = "https://testdatabase-c74f.restdb.io/rest"
const config = {
	'cache-control': 'no-cache',
	'x-apikey': '91cde88d7c740120212fa43dac25eec673551'
};

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secret
}

const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, next) {
	const fetchUser = axios.get(baseUrl + '/accounts?q={"login": "' + payload.user +'"}', {headers: config});

	fetchUser.then(async user_json => {

		let user = user_json.data[0];

		if (user) {
			next(null, user)
		} else {
			next(null, false)
		}
	}).catch(handleError)


})

passport.use('jwt', jwtStrategy);


router.get('/', function(req, res) {
	const fetchPosts = axios.get(baseUrl + '/articles', {headers: config});

	const posts = fetchPosts.then(async post_list => {

		let data = post_list.data;

		res.send(data);
	}).catch(handleError)
})


router.get('/:id',  function(req, res) {

	const fetchPosts = axios.get(baseUrl + '/articles/' + req.params.id, {headers: config});



	const posts = fetchPosts.then(async post => {

		data = post.data;
		res.send(data);




	}).catch(handleError)

})



router.post('/create', passport.authenticate('jwt', { session: false }),function(req, res){
	if(!req.body.title || !req.body.content || !req.body.userId){
		res.sendStatus(400).send("Missing value")
	}
	else{
		const createArticle = axios.post(baseUrl + '/articles',{ title: req.body.title, body: req.body.content, userId: req.body.userId}, {
			headers: config,
			json: true
		});

		createArticle.then(async post => {
			console.log(post)
			res.json({ _id: post.data._id }).sendStatus(200);
		}).catch(handleError)
	}
})


router.post('/update/:identifier', passport.authenticate('jwt', { session: false }), function(req, res){
	if(!req.body.title && !req.body.content && !req.body.userId){
		res.sendStatus(400).send("Missing updating data")
	}
	else{
		let user_auth = req.user;

		const fetchPosts = axios.get(baseUrl + '/articles/' + req.params.identifier, {headers: config});

		const posts = fetchPosts.then(async post => {

			let data = post.data;

			if ( data.userId === user_auth.id) {

				const updateArticle = axios.put(baseUrl + '/articles/' + req.params.identifier, {
					title: req.body.title,
					body: req.body.content,
					userId: req.body.userId

				}, {
					headers: config,
					json: true
				});

				updateArticle.then(async () => {
					res.sendStatus(200);

				}).catch(handleError)
			} else {

				res.status(401).json({ error: 'Unauthorized.' });
			}

		}).catch(handleError)

	}
})

router.get('/delete/:identifier', passport.authenticate('jwt', { session: false }),function(req, res){




	let user_auth = req.user;

	const fetchPosts = axios.get(baseUrl + '/articles/' + req.params.identifier, {headers: config});

	const posts = fetchPosts.then(async post => {

		let data = post.data;

		if ( data.userId === user_auth.id) {
			const deleteArticle = axios.delete(baseUrl + '/articles/' + req.params.identifier, {
				headers:config,
				json: true
			});

			deleteArticle.then(async () => {
				res.sendStatus(200);

			}).catch(handleError)
		} else {

			res.status(401).json({ error: 'Unauthorized.' });
		}

	}).catch(handleError)






})


function handleError(err) {
	console.error(err)
}



module.exports = router;
