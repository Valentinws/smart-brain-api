const express = require('express');
const { get } = require('lodash');

const app = express();
app.use(express.json());
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Diana',
            email: 'diana@gmail.com',
            password: 'diana',
            entries: 0,
            joined: new Date()
        }
    ]
}

const theReqShow = (req) => {
    console.log('___________________ ');
    console.log('_____New REQUEST::::');
    console.log('HEADER:', req.headers);
    console.log('METHOD:', req.method);
    console.log('body:', req.body);
    console.log('URL:', req.url);
    console.log('___________________');
}

app.get('/', (req, res) => {
    theReqShow(req);

    res.send(database.users);
})

app.post('/signin', (req, res) => {
    theReqShow(req);
    //express poate raspunde cu json
    if (req.body.email === database.users[0].email
        && req.body.password === database.users[0].password) {

        res.json('succes');
    } else {
        res.status(400).json('Error login: Incorect User or Password');
    }
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
    // res.json('registered');
})

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('no such user');
    }
})

app.put('/image', (req, res) => {

    theReqShow(req);
    const { id } = req.body;
    console.log(req.body.id);
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('no such user');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/*
/ --> res this is working
/signin --> POST = succes/fail 
/register --> POST = use
/profile/:userId --> GET = user
/image --> PUT --> user

*/