const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/images',express.static(__dirname + 'public/images'))

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");


initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


app.set('views','./views')
app.set('view engine', 'ejs');


app.get('/index', (req, res) => {
  res.render('index');
})



app.get('/signup', (req, res) => {
  res.render('signup');
}) 
 app.get('/signupsubmit',(req,res)=> {
  const firstname = req.query.firstname;
 
  const lastname = req.query.lastname;
 
  const email = req.query.email;
  
  const password = req.query.password;
  

  db.collection('users').add({
    name: firstname + lastname,
    email:email,
    password:password,
})
.then(()=>{
  res.render('home');
})

 })



app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/loginsubmit',(req,res)=>{
  const email = req.query.email;
  const password = req.query.password;

  db.collection('users')
  .where("email","==",email)
  .where("password",'==', password)
  .get()
  .then((docs)=>{
    if(docs.size>0){
      res.render('home')
    }else{
      res.render('signup')
    }
  });

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

 