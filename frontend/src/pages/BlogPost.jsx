import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BlogPost = () => {

    const { id } = useParams();

    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');


    useEffect(() => {

        const fetchBlogPost = async () => {

            try {

                const response = await axios.get(`blogs/get-post-details/${id}`);
                setTitle(response.data.title)
                setContent(response.data.content)

            } catch (error) {

            }

        }

        fetchBlogPost();
    }, [])


    return (
        <div>
            <h2 className='text-2xl my-8'>{title}</h2>

            <div>
                {content}
            </div>
        </div>
    )
}

export default BlogPost