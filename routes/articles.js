const express = require('express');
const axios = require('axios');

const router = express.Router();

const baseUrl = "https://testdatabase-c74f.restdb.io/rest"
const config = {
	'cache-control': 'no-cache',
	'x-apikey': '91cde88d7c740120212fa43dac25eec673551'
};

router.get('/',  function(req, res) {
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



router.post('/create', function(req, res){
	if(!req.body.title || !req.body.content || !req.body.userId){
		res.send("Missing value")
	}
	else{
		const createArticle = axios.post('https://testdatabase-c74f.restdb.io/rest/articles',{ title: req.body.title, body: req.body.content, userId: req.body.userId}, {
		headers:
		{ 'cache-control': 'no-cache',
		'x-apikey': '91cde88d7c740120212fa43dac25eec673551',
		'content-type': 'application/json' },
		json: true
	});
	
	createArticle.then(async () => {
		res.sendStatus(200);
		
	}).catch(handleError)
}
})


router.post('/update/:identifier', function(req, res){
	if(!req.body.title && !req.body.content && !req.body.userId){
		res.send("Missing updating data")
	}
	else{
		const updateArticle = axios.put('https://testdatabase-c74f.restdb.io/rest/articles/' + req.params.identifier, { 
		title: req.body.title,
		body: req.body.content,
		userId: req.body.userId
	}, {
		headers:
		{ 'cache-control': 'no-cache',
		'x-apikey': '91cde88d7c740120212fa43dac25eec673551',
		'content-type': 'application/json' },
		json: true
	});
	
	updateArticle.then(async () => {
		res.sendStatus(200);
		
	}).catch(handleError)
}
})

router.get('/delete/:identifier', function(req, res){
	
	const deleteArticle = axios.delete('https://testdatabase-c74f.restdb.io/rest/articles/' + req.params.identifier, {
	headers:
	{ 'cache-control': 'no-cache',
	'x-apikey': '91cde88d7c740120212fa43dac25eec673551',
	'content-type': 'application/json' },
	json: true
});

deleteArticle.then(async () => {
	res.sendStatus(200);
	
}).catch(handleError)

})


function handleError(err) {
	console.error(err)
}


module.exports = router;
