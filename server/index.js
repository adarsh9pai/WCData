const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const API = require('./api');
const cors = require('cors');

app.use(cors());
app.use('/api',API);
app.set('json spaces', 4);


app.get('/',(request, response)=>{
    response.json({message : "Access API Endpoint with /api/"});
})

app.listen(PORT, ()=>{
    console.log('Live PORT ' + PORT);
})