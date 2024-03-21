import React, { useState, useEffect } from 'react'
import axios from 'axios';
import BlogPosts from '../components/BlogPosts';

const Home = () => {

   const [blogPosts, setBlogPosts] = useState([])

   useEffect(() => {
      const fetchBlogPosts = async () => {
         try {
            const response = await axios.get('blogs');
            setBlogPosts(response.data)
         } catch (error) {
            console.log(error);
         }
      }

      fetchBlogPosts();
   }, [])


     // Sorting the entire list of invoices first
  const sortedBlogPosts = blogPosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   return (

      <section className="pt-20 pb-10 lg:pt-[50px] lg:pb-20 bg-white dark:bg-dark">
         <div className="container mx-auto">
            <div className="flex flex-wrap justify-center -mx-4">
               <div className="w-full px-4">
                  <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
                     <span className="block mb-2 text-lg font-semibold text-primary">
                        Latest
                     </span>
                     <h2
                        className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px] dark:text-white"
                     >
                        Blog Posts
                     </h2>
                  </div>
               </div>
            </div>
            <div className="flex flex-wrap -mx-4">

               <BlogPosts blogPosts={sortedBlogPosts} setBlogPosts={setBlogPosts} />

            </div>
         </div>
      </section>

   )
}

export default Home