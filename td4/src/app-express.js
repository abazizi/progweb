import express from 'express';
import morgan from 'morgan';
import { MongoClient, ObjectId } from 'mongodb';

process.loadEnvFile();
const host = process.env.HOST;
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DABASE_NAME;

const app = express(); 
app.use(morgan('combined'));
app.use(express.json());

const client = new MongoClient(mongoUrl);
await client.connect();
const db = client.db(dbName);
const contacts = db.collection('contacts');
console.log('Successfully connected to MongoDB.');

app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.send('Hello !');
});

app.get('/home', function(req, res) {
  res.send('Maison :-)');
});

app.get('/user/:uid', function(req, res) {
  res.render('user', {uid: req.params.uid});
});

app.get('/contacts', async function(req, res){
  const results = await contacts.find({}, {projection: {_id: 1}}).toArray();
  res.json(results);


})

app.get('/contacts/:id', async function(req, res){
  const id = new ObjectId(req.params.id);
  const contact = await contacts.findOne({ _id: id });
  res.json(contact);


})

app.post('/contacts', async function(req, res){
  const newClient = req.body;
  await contacts.insertOne(newClient);
  res.status(201).json(newClient);

}
)

app.put('/contacts/:id', async function(req, res){
  const id = new ObjectId(req.params.id);
  const result = await contacts.updateOne({ _id: id }, { $set: req.body });
  res.json(result);
})

app.delete('/contacts/:id', async function(req, res){
  const id = new ObjectId(req.params.id);
  const result = await contacts.deleteOne({ _id: id });
  res.json(result);


})

app.use(function(req, res){
  res.status(404).send('Page introuvable !');
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
});
