const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/',  function(req, res) {
    const fetchPosts = axios.get('https://jsonplaceholder.typicode.com/posts');

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
