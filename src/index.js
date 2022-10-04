
const express = require('express');
const app = express();
const nodecache = require('node-cache');
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
  
const cache = new nodecache({ stdTTL : 300});
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/testdata', (req, res, next) => {
    console.log("TEST DATA :");
    res.json({msg: "Hello world."});
})

const TOKEN = "8fa1f9ec71f94018a0161906d5f635ac";
const BASE_URL = 'https://gnews.io/api/v4/search?';

app.get('/title', async (req, res, next) => {
    const body = req.body;
    if(!body.title) throw new Error;

    const cacheKey = `title-${title}`
    if(cache.has(cacheKey)) {
        console.log('using cache');
        return res.json(cache.get(cacheKey))
    }

    let url = `${BASE_URL}q="${encodeURIComponent(body.title)}"&in=title&token=${TOKEN}`;

    let articles = await fetch(url, {method: 'GET'});
    cache.set(cacheKey, articles);

    res.json({body: await articles.json()})
});

app.get('/keywords', async (req, res, next) => {
    const body = req.body;
    if(!body.keywords) throw new Error;

    const keywords = body.keywords.sort();

    let queryString = '';
    keywords.forEach(word => {
        if(!queryString)
            queryString += word;
        queryString += ' and ' + word;
    });

    const cacheKey = `keywords-${queryString}`;
    const cacheKeyWithMax = `keywords-${queryString}-${body.max}`

    if(body.max != undefined && cache.has(cacheKeyWithMax)) {
        console.log('using cache');
        return res.json(cache.get(cacheKeyWithMax))
    }

    if(cache.has(cacheKey)) {
        console.log('using cache');
        let articles = cache.get(cacheKey);


        if(body.max != undefined && body.max < articles.articles.length) {
            const articleArr = articles.articles.splice(0, body.max);
            articles.articles = articleArr;
            articles.totalArticles = body.max;
        }
        return res.json(articles);
    }

    let url = `${BASE_URL}q=${encodeURIComponent(queryString)}`
    if(body.max != undefined) url += `&max=${body.max}`
    url += `&token=${TOKEN}`

    const response = await fetch(url, {method: 'GET'});
    const articles = await response.json();
    if(body.max != undefined) cache.set(cacheKeyWithMax, articles);
    else cache.set(cacheKey, articles);

    res.json(articles);
});


const server = app.listen(3001, function () {
    let host = server.address().address
    let port = server.address().port
    // Starting the Server at the port 3001
})