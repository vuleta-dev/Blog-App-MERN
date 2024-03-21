const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema ({ 
    title: String,
    image: String,
    content: String,
    author: String
}, {timestamps: true})

const BlogModel = mongoose.model('Blog', BlogSchema);

module.exports = BlogModel;