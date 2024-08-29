const express = require('express');
const User = require('../models/user.model.js')

const router = express.Router();


router.get('/signup', (req,res)=>{
    res.render('signup');
})

router.get('/signin', (req,res)=>{
    res.render('signin');
})

router.post('/signup', async(req,res)=>{
    const {FullName, email, password} = req.body;
    const takenEmail = await User.find({email});
    if(takenEmail){
        res.render('signup',{
            error: 'Email already taken'
        })
    }
    const user = await User.create({
        FullName,
        email,
        password
    })

    if(!user){console.log('error')}
    return res.redirect('/');
})

router.post('/signin', async(req,res)=>{
    const {email,password} = req.body;
   

    try {
        const token = await User.matchPassword(email,password);
        return res.cookie("token", token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error: 'incorrect email or password'
        });
    }
})

router.get('/logout', (req,res)=>{
    return res.clearCookie('token').redirect('/');
})


module.exports=router;