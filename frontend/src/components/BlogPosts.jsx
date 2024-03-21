import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const BlogPosts = ({ blogPosts, setBlogPosts }) => {
   const { user, setUser } = useContext(UserContext);
   const [authors, setAuthors] = useState([])

   useEffect(() => {

      const fetchAuthors = async () => {
         try {
            const response = await axios.get('users/profiles')
            setAuthors(response.data)
         } catch (error) {
            console.log(error)
         }

      }

      fetchAuthors()
   }, [])

   const handleDeletePost = async (id) => {
      try {
         // get JWT from the cookie
         const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

         const response = await axios.delete(`/blogs/${id}`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (response.data.error) {
            toast.error(response.data.error);
         } else {
            setBlogPosts(prevBlogPosts => prevBlogPosts.filter(post => post._id !== id));
            toast.success('Blog post is deleted!');
            navigate('/');
         }

      } catch (error) {
         console.log(`Error: ${err.message}`);
      }
   }


   return (

      blogPosts && blogPosts.length > 0 ? (

         blogPosts.map((post) => {

            const postAuthor = authors.find(author => author.id === post.author)

            return (
               <div key={post.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className="w-full mb-10">
                     <Link to={`/post/${post._id}`}><div className="mb-8 overflow-hidden rounded-lg border-4 border-blue-200 hover:border-blue-400">
                        <img
                           src={`http://localhost:8000/uploads/${post.image}`}
                           alt="image"
                           className="w-full"
                        />
                     </div></Link>
                     <div>
                        <span
                           className="mr-5 inline-block px-4 py-1 mb-5 text-xs font-semibold leading-loose text-center text-white rounded bg-blue-500">
                           {new Date(post.createdAt).toLocaleString()}
                        </span>
                        <span
                           className="inline-block px-4 py-1 mb-5 text-xs font-semibold leading-loose text-center rounded bg-gray-100">
                           {postAuthor && <span>Author: {postAuthor.name}</span>} </span>
                        <h3>
                           <Link
                              to={`/post/${post._id}`}
                              className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-blue-500 sm:text-2xl lg:text-xl xl:text-2xl">
                              {post.title}
                           </Link>
                        </h3>
                        <p className="text-base text-body-color dark:text-dark-6">
                           {post.content.length > 100
                              ? post.content.substring(0, 100) + "..."
                              : post.content}
                        </p>
                     </div>
                     {postAuthor && (
                        <div className="text-right">
                           {user && (postAuthor.id === user.id) && (
                              <>
                                 <button onClick={() => handleDeletePost(post._id)} className="float-right text-red-500 font-bold">delete</button>
                                 <Link to={`/edit-post/${post._id}`} className="mr-5 float-right text-red-500 font-bold">edit post</Link>

                              </>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            )
         })

      ) : (
         <div className="mx-auto text-center">No blog posts</div>
      )

   )
}

export default BlogPosts