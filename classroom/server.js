const express = require("express");
const app = express();
const session = require("express-session");

const sessionOption ={
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
}
app.use(session({
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
}));

app.get("/reqcount" ,(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`total number of session is ${req.session.count}`);
})
app.get('/register',(req,res)=>
{
    let{name='anonymous'} = req.query;
    req.session.name = name;
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.send(`hello ${req.session.name}`)
})
app.get("/test" ,(req,res)=>{
    res.send("test succesful!");
})

app.listen(3000,()=>{
    console.log("server is listing to 3000")
})