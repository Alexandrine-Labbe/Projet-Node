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

router.get('/:article',  function(req, res) {
    const fetchPosts = axios.get(baseUrl + '/articles?q={"id": ' + req.params.article + '}', {headers: config});

    const posts = fetchPosts.then(async post_list => {

        let data = post_list.data;

        res.send(data);
    }).catch(handleError)
})


router.get('/:post',  function(req, res) {

    const url = 'https://jsonplaceholder.typicode.com/posts/'+ req.params.post;
    const fetchPosts = axios.get(url);

    const posts = fetchPosts.then(async post => {
        let data =  post.data;

        res.send(data);
    }).catch(handleError)
})

function handleError(err) {
    console.error(err)
}


module.exports = router;
