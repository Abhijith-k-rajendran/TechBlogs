const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const fs = require('fs')
const multer = require("multer");
dotenv.config();

// multer config
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//db connection
mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to database!');
}).catch((err) => {
    console.error(err);
});

//   defining schema for a  blog

const blogSchema = new mongoose.Schema({
    blogTitle: 'string',
    blogContent: 'string',
    image: Buffer
})

const blogItem = mongoose.model('blogs', blogSchema)

//defining  routes
  
app.get('/showBlogs', (req, res) => {
    blogItem.find().then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
        res.send(err)
    })
})

//sending blogs from db to front end 
app.get('/showBlogs', async(req, res) => {

})


//deleting a specific blog as a result of user action
app.delete('/blogs/:id', async (req,res)=>{
    try {
        const blog = await blogItem.findById(req.params.id);
        if (!blog) {
          return res.status(404).json({ msg: "Blog not found" });
        }
        await blogItem.findByIdAndRemove(req.params.id);
        res.json({ msg: "Blog deleted successfully" });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
})
//handling request from frontend to add a new blog to db 
app.post('/addBlogs', (req, res) => {
    const blogTitle = req.body.blogTitle
    const blogContent = req.body.blogContent
    const blogImage = req.body.blogImage;

    const newBlog = new blogItem({
        blogTitle: blogTitle,
        blogContent: blogContent,
        blogImage: {
            data: blogImage,
            contentType: 'image/jpg'
        }
    })

    newBlog.save()
        .then(() => {
            res.send('Saved')
            console.log('Data Saved Successfully!!!')
        }
        )
        .catch(err => console.log(err))
})

//connecting to local server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});