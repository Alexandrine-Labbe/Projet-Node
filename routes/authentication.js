const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const secret = 'wowasecret'
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


router.post('/login', urlEncodedParser, function(req, res) {

    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password) {
        res.status(401).json({ error: 'Login or password was not provided.' });
        return;
    }


    const fetchUser = axios.get(baseUrl + '/accounts?q={"login": "' + login +'"}', {
        headers: config,

    });

    fetchUser.then(async user_json => {

        let user = user_json.data[0];


        if (!user || user.password !== password) {
            res.status(401).json({ error: 'Login / password do not match.' });
            return;
        }

        const userJwt = jwt.sign({ user: user.login }, secret);

        res.json({ jwt: userJwt, id: user.id });

    }).catch(handleError)

})


router.post('/register', urlEncodedParser,  function(req, res) {

    let login = req.body.login;
    let password = req.body.password;

    const createUser = axios.post(baseUrl + '/accounts',{ login: login, password: password}, {
        headers:config,

        json: true
    });

    createUser.then(async () => {
        res.sendStatus(200);

    }).catch(handleError)

})

function handleError(err) {
    console.error(err)
}


module.exports = router;
