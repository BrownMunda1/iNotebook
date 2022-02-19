const connectToMongo=require('./db');

connectToMongo();

const express = require('express');
const cors=require('cors')
const app = express();

app.use(cors());

app.use(express.json());
// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(5000,()=>{
    console.log('Server is running successfully');
})