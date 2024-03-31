const express =  require("express");
const req = require("express/lib/request");
const path = require('path');
const PocketBase = require('pocketbase/cjs');

var auth = false;

const app = express();
const pb = new PocketBase("https://pb.p3n.cat/");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.get('/', (req, res) => {
    if (pb.authStore.isValid) {
        res.redirect('/app');
    } else {
        res.redirect('/login');        
    }
  })

app.get('/app', (req, res) => {
    if (pb.authStore.isValid) {
        res.render('index');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/auth', async (req, res) => {
    const tmp = await pb.collection('users').authWithPassword(
        req.body['username'],
        req.body['password'],
    ).then(() => res.redirect("/"));
})

app.listen(3000);