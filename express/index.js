const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./constants');
const mongodb = require('./app');

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/movies/populate/:id', async(request, response) => {
  const res = request.params.id;
  const result = await mongodb.insert(res);
  response.send(result);
});

app.get('/movies', async(request, response) => {
  const param = request.params;
  const movies = await mongodb.getrandom();
  response.send(movies);
});

app.get("/movies/search", async (request, response) => {
	var limit = parseInt(request.query.limit);
	var metascore = parseInt(request.query.metascore);
	const movies = await mongodb.getsearchmovie(metascore, limit);
	response.send({ limit: limit, total: movies[0], results: movies[1] });
});

app.get('/movies/:id', async(request, response) => {
  const res = request.params.id;
  const result = await mongodb.getmovie_id(res);
  response.send(result);
});


app.post('/movies/:id',async(request,response)=>{
  const res = request.body;
  const id = request.params.id;
  const resultat = await mongodb.addreview(id,res);
  response.send(resultat);
});



app.listen(PORT);
console.log(`Running on port ${PORT}`);
