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

        
    }).catch(handleError)
})



router.post('/create', function(req, res) {


    if(!req.body.title || !req.body.content || !req.body.userId){
        res.send("Missing value")
    }
    else{
        const fetchPosts = axios.post(baseUrl + '/articles', {headers: config},
        {body: { title:req.body.title, body: req.body.body, userId: req.body.userId}},
        );

        const posts = fetchPosts.then(async post_list => {

            res.send("New Article Created.");
    
            
        }).catch(handleError)

        res.send("Error");
        
    }

    

    
})



function handleError(err) {
    console.error(err)
}


module.exports = router;
