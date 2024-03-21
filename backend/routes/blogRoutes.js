const express = require('express');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const { newBlogPost, getAllPosts, getBlogPost, editBlogPost, deleteBlogPost, getBlogPostDetails } = require('../controllers/blogControllers');
const authenticateToken = require('../helpers/authMiddleware');

// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    }
});
const upload = multer({ storage: storage });


router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));


router.post('/', authenticateToken, upload.single('image'), newBlogPost);
router.get('/', getAllPosts);
router.put('/:id', authenticateToken, upload.single('image'), editBlogPost);
router.delete('/:id', authenticateToken, deleteBlogPost);
router.get('/get-post/:id', authenticateToken, getBlogPost);
router.get('/get-post-details/:id', getBlogPostDetails);


module.exports = router;
