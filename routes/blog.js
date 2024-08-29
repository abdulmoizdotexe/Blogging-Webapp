const express = require('express');
const multer = require('multer');
const Blog = require('../models/blog.model.js');
const Comment = require('../models/comment.model.js');

const path = require('path');
const router = express.Router();

router.get('/add-new', (req,res)=>{
    return res.render('add-blog',{
        user: req.user,
    });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const fileName =`${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/', upload.single('CoverImageUrl'), async(req,res)=>{
    const {title, body} = req.body;
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            CoverImageUrl: `/uploads/${req.file.filename}`
    
    })
        

    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id', async(req,res)=>{
    const comments = await Comment.find({blog_id:req.params.id}).populate('createdBy');
    const id = req.params.id;
    const blog =  await Blog.findById(id).populate('createdBy');
    console.log(req.user);
    console.log(blog);
    return res.render('blog',{
        user: req.user,
        blog,
        comments
    })
})

router.post('/comment/:blog_id', async(req,res)=>{
    await Comment.create({
        content: req.body.content,
        blog_id: req.params.blog_id,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blog_id}`);
})

module.exports = router;