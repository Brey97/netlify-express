'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const {PORT} = require('./constants');
const mongodb = require('./app');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello</h1>');
  res.write('<h2>this api provide you acces to movies datas</h2>');
  res.write('<h2>you can add movie of several actor by entering /movies/populate/:id (imdb id of the actor) </h2>');
  res.write('<h2>you can have acces to a movie by entering  /movies/:id (imdb id of the movie) </h2>');
  res.write('<h2>you can have acces to a random movie with a metascore greater than 70 by entering /movies</h2>');
  res.write('<h2>you can have acces to list of random movies by entering /movies/search&limit=XX&metascore=YY</h2>');
  res.end();
});

router.get('/movies/populate/:id', async(request, response) => {
  const res = request.params.id;
  const result = await mongodb.insert(res);
  response.send(result);
});

router.get('/movies', async(request, response) => {
  const param = request.params;
  const movies = await mongodb.getrandom();
  response.send(movies);
});

router.get("/movies/search", async (request, response) => {
  var limit = parseInt(request.query.limit);
  var metascore = parseInt(request.query.metascore);
  const movies = await mongodb.getsearchmovie(metascore, limit);
  response.send({ limit: limit, total: movies[0], results: movies[1] });
});

router.get('/movies/:id', async(request, response) => {
  const res = request.params.id;
  const result = await mongodb.getmovie_id(res);
  response.send(result);
});

router.post('/movies/:id',async(request,response)=>{
  const res = request.body;
  const id = request.params.id;
  const resultat = await mongodb.addreview(id,res);
  response.send(resultat);
});


app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
