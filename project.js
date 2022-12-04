const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

const serviceAccount = require("./examp.json");
const request = require('request');
initializeApp({
    credential: cert(serviceAccount)
});
  
const db = getFirestore();

const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', (req, res) => {
  res.render("homepage2");
})

app.get('/register', (req, res) => {
  res.render("register");
})

app.get('/registersubmit',(req,res)=>{
    const username=req.query.uname;
    
    const email=req.query.email;
    const password=req.query.pass;

    db.collection('clients').add({
      username:username,
      email:email,
      password:password
    })
    .then(() =>{
      res.render("login");
    })
});



app.get('/login', (req, res) => {
  res.render("login");
})
app.get('/loginFail',(req,res)=>{
  res.render("loginFail");
})
app.get('/loginSubmit',(req,res) =>{
  const username=req.query.user;
  const password=req.query.pwd;
  console.log(username);
  console.log(password);
   db.collection('clients')
   .where("username","==",username)
   .where("password","==",password)
   .get()
   .then((docs) =>{
    if(docs.size> 0){
      res.render("page");
    }
    else{
      res.render("loginFail");
    }
   });
});

app.get("/page",function (req,res){
    res.render('page');

});

app.get('/food',(req,res) =>{
  const item = req.query.item;
  const options = {
    method: 'GET',
    url: 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition',
    qs: {query: item},
    headers: {
      'X-RapidAPI-Key': '52515c88abmshb72cc3ec31cbaf6p1ee0d1jsn27afa7bfca0d',
      'X-RapidAPI-Host': 'nutrition-by-api-ninjas.p.rapidapi.com',
      useQueryString: true
    }
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const name = JSON.parse(body)[0].name;
    const calories = JSON.parse(body)[0].calories;
    const serving_size_g = JSON.parse(body)[0].serving_size_g;
    const fat_total_g = JSON.parse(body)[0].fat_total_g;  
    const protein_g = JSON.parse(body)[0].protein_g;
    const potassium_mg = JSON.parse(body)[0].potassium_mg; 
    const cholesterol_mg = JSON.parse(body)[0].cholesterol_mg;
    const carbohydrates_total_g = JSON.parse(body)[0].carbohydrates_total_g;
    const sugar_g = JSON.parse(body)[0].sugar_g; 

           res.render('page1',{
            name:  name,
            calories: calories,
            serving_size_g: serving_size_g,
            fat_total_g: fat_total_g,
            protein_g: protein_g,
            potassium_mg: potassium_mg,
            cholesterol_mg: cholesterol_mg,
            carbohydrates_total_g: carbohydrates_total_g,
            sugar_g: sugar_g
            
          });
  
    
  });
  

  
});


app.listen(3000, function(){
    console.log('Example app listening on port 3000!');
});
