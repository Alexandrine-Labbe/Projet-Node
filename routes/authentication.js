const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const secret = 'thisismysecret'
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const axios = require('axios');
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
    // // usually this would be a database call:
    // const user = users.find(user => user.email === payload.user)


    const fetchUser = axios.get(baseUrl + '/accounts', {headers: config, "login": payload.user});

    fetchUser.then(async user_json => {

        let user = user_json.data;

        if (user) {
            next(null, user)
        } else {
            next(null, false)
        }
    }).catch(handleError)


})

passport.use('jwtStrategy', jwtStrategy);





router.post('/login', urlEncodedParser, function(req, res) {

    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password) {
        res.status(401).json({ error: 'Login or password was not provided.' })
        return
    }


    const fetchUser = axios.get(baseUrl + '/accounts', {
        headers: config,
        params: { login: 'user1' }
    });

    fetchUser.then(async user_json => {

        let user = user_json.data;

        if (!user || user.password !== password) {
            res.json(user)
            // res.status(401).json({ error: 'Login / password do not match.' })
            return
        }

        const userJwt = jwt.sign({ user: user.login }, secret)

        res.json({ jwt: userJwt })

    }).catch(handleError)

})


router.get('/register',  function(req, res) {


})

function handleError(err) {
    console.error(err)
}


module.exports = router;
