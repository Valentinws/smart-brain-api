const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log('HEADER:', req.headers);
    console.log('METHOD:', req.method);
    console.log('URL:', req.url);

    res.send('This is working');
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/*
/ --> res this is working
/signin --> POST = succes/fail 
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/