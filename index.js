const express = require('express');
const {checkValidation} = require('./middlewares/auth.js');
const cookieParser = require('cookie-parser');
const path = require('path');
const User = require('./models/user.model.js');
const Blog = require('./models/blog.model.js');
const userRoute = require('./routes/user.js');
const blogRoute = require('./routes/blog.js');
const ejs = require('ejs');
const mongoose = require('mongoose');
const PORT=8000;

mongoose.connect("mongodb+srv://moizabdul179:TEIiHRy69ojG9z8T@cruddb.sqydmxe.mongodb.net/blogify?retryWrites=true&w=majority&appName=cruddb")
.then((e)=>{console.log("MongoDB connected!")});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cookieParser());
app.use(checkValidation("token"));
app.use(express.static(path.resolve("./public")));

app.get('/', async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})
app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, ()=>console.log(`Server started at ${PORT}...`));