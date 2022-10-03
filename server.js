const express = require('express');
const { get, join, rest } = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: '',
        password: '',
        database: 'smart-brain'
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
})

const app = express();
app.use(express.json());
app.use(cors());

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 3,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '900',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }

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

    res.json('succes');
})

app.post('/signin', (req, res) => {
    theReqShow(req);
    //express poate raspunde cu json
    // if (req.body.email === database.users[0].email
    //     && req.body.password === database.users[0].password) {

    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('Error login: Incorect User or Password');
    // }


    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {

            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);


            if (isValid) {
                db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                // .catch(err => res.status(400).json('unable to get user'))
            } else {
                return res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    // bcrypt.hash(password, null, null, (err, hash) => {
    //     console.log(hash);
    // })
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert(
                        {
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        }
                    )
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))

    /* without db
     // database.users.push({
     //     id: '125',
     //     name: name,
     //     email: email,
     //     entries: 0,
     //     joined: new Date()
  }) */
    //with db

})

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    /* without db
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // }) 
    if (!found) {
        res.status(400).json('no such user');
    }
    */
    //with db
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))


})

app.put('/image', (req, res) => {

    theReqShow(req);
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
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