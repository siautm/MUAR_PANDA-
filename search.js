const express=require('express');
const restaurant=require('./liveSearch');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');

const URI='mongodb+srv://leehom2004:LeeHom%40123@cluster0.bqd6jef.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(URI,{dbName:'MUAR_PANDA',useNewUrlParser:true,useUnifiedTopology:true})


const db=mongoose.connection;
db.on('error',error=>console.log(error));
db.once('open',()=>{
    console.log('Connected to Mongoose')
});

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('style.css'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

app.post('/getRestaurant',async(req,res)=>{
    let payload=req.body.payload.trim();
    //console.log(payload);
    let search=await restaurant.find({name:{$regex: new RegExp('^'+payload+'.*','i')}}).exec();
    //Limit Search result to 5
    search=search.slice(0,5);
    //res.send({payload:search});
    res.send({
        payload: search.map(item => ({
            name: item.name,
            link: `${item.name}.html`
        }))

});
})

app.get('/:link', (req, res) => {
    const requestedLink = req.params.link;
    // Handle the logic for displaying content based on requestedLink
    res.sendFile(__dirname + '/public/' + requestedLink);
});

app.listen (process.env.PORT||3000,()=>{
  console.log('Server has started on PORT 3000');
});
