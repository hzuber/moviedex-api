require('dotenv').config({ path: './.env'});
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MDB = require('./smallMDB')

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN;
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get('/movie', handleGetSearch);

function handleGetSearch(req, res){
    let response = MDB;

    if(req.query.genre){
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if(req.query.country){
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if (req.query.avg_vote){
        const requestNum = Number(req.query.avg_vote);
        response = response.filter(movie =>
            Number(movie.avg_vote) >= requestNum)
    }
    res.json(response);
}

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});