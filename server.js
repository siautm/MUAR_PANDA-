// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

const first = mongoose.createConnection('mongodb://localhost/foodOrders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const URI='mongodb+srv://leehom2004:LeeHom%40123@cluster0.bqd6jef.mongodb.net/?retryWrites=true&w=majority'
const second=mongoose.createConnection(URI,{dbName:'MUAR_PANDA',useNewUrlParser:true,useUnifiedTopology:true})


const db=second;
db.on('error',error=>console.log(error));
db.once('open',()=>{
    console.log('Connected to Mongoose')
});

const orderSchema = new mongoose.Schema({
  username: String,
  restaurant: String,
  dish: String,
  quantity: Number,
  orderType: String,
  totalPrice: Number,
  timestamp: { type: Date, default: Date.now },
});

const Order = first.model('Order', orderSchema);


const restaurantSchema= new mongoose.Schema({

    name:{
        type:String,
        required: true
    }
    });

    //module.exports=second.model('restaurants',restaurantSchema);
    const restaurants = second.model('restaurants', restaurantSchema);

    module.exports = restaurants;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.post('/submitOrder', async (req, res) => {
  try {
    const { username, restaurant, dish, quantity, orderType, totalPrice } = req.body;
    const newOrder = new Order({ username, restaurant, dish, quantity, orderType, totalPrice });
    await newOrder.save();
    res.status(201).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/getOrders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: 'desc' });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/deleteOrder/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (deletedOrder) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/getRestaurant',async(req,res)=>{
    let payload=req.body.payload.trim();
    //console.log(payload);
    let search=await restaurants.find({name:{$regex: new RegExp('^'+payload+'.*','i')}}).exec();
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
    res.sendFile(__dirname + '/' + requestedLink);
});



app.get('/guest.html', (req, res) => {
 res.sendFile(__dirname + '/guest.html');
});

app.get('/ourteam.html', (req, res) => {
  res.sendFile(__dirname + '/ourteam.html');
 });

 app.get('/aboutus.html', (req, res) => {
  res.sendFile(__dirname + '/aboutus.html');
 });

 app.get('/Fung Wong Xian Restaurant.html', (req, res) => {
  res.sendFile(__dirname + '/Fung Wong Xian Restaurant.html');
 });

 app.get('/Pizza Hut.html', (req, res) => {
  res.sendFile(__dirname + '/Pizza Hut.html');
 });

 app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/login.html');
 });

 app.get('/signup.html', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
 });

 app.get('/Hai Sing Seafood Restaurant.html', (req, res) => {
  res.sendFile(__dirname + '/Hai Sing Seafood Restaurant.html');
 });


app.get('/starter.html', (req, res) => {
  res.sendFile(__dirname + '/starter.html');
});

app.get('/order.html', (req, res) => {
  res.sendFile(__dirname + '/order.html');
});

app.get('/admin.html', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
