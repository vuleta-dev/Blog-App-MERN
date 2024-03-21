import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BtnBold, BtnItalic, Editor, EditorProvider, Toolbar, BtnStrikeThrough, BtnUndo } from 'react-simple-wysiwyg';

const NewPost = () => {

    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    const handleNewBlog = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', file);

            // get JWT from the cookie
            const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

            const response = await axios.post('/blogs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success('New Blog post is added!');
                navigate('/');
            }

        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    };

    return (
        <form onSubmit={handleNewBlog}>
            <h3 className='text-2xl my-8'>New Blog Post</h3>

            <label>Title</label>
            <input value={title} className='input mb-6 mt-1' type="text" onChange={(e) => setTitle(e.target.value)} />

            <label>Image</label>
            <input className='mb-5' type="file" onChange={(e) => setFile(e.target.files[0])} />

            <br />

            <label>Blog Content</label>
            <EditorProvider>
                <Editor value={content} onChange={(e) => setContent(e.target.value)}>
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnStrikeThrough />
                        <BtnUndo />
                    </Toolbar>
                </Editor>
            </EditorProvider>

            <button className='mt-3 px-5 py-3 border font-palanquin text-sm leading-none bg-blue-500 hover:bg-coral-red rounded-xl text-white'>Save</button>
        </form>
    );
};

export default NewPost;
