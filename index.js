const port = 3001;

var http = require('http').Server(),
    express = require('express'),
    app = express(),
    mongodb = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chat';

app.use(express.json());//para poder usar json

app.get('/user', function(req, res){
    res.sendFile(__dirname + '/crud_user.html');
} );
app.post('/user/save', function(req, res){
    let user = req.body;
    mongodb.connect(url, function(err, client){
    if(err) console.log(err);
    const db = client.db(dbName);
    db.collection('user').insertOne(user, function(err, result){
        if(err) throw err;
        res.send(result);
    });
});
});


app.get('/user/list', function(req, res){
    mongodb.connect(url, function(err, client){
        if( err ) console.log('Error al conectarse a la BD', err);
        const db = client.db(dbName);
        db.collection('user').find({}).toArray(function(er, users){
            res.send(users);
        });

    });
});


app.listen(port, function(){
    console.log(`Server running at http://localhost:${port}/`);
});
    
