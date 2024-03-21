import { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPost from './pages/NewPost';
import Profile from './pages/Profile'
import EditPost from './pages/EditPost';
import BlogPost from './pages/BlogPost';
import axios from 'axios';
import { UserContextProvider } from './context/userContext';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="new-post" element={<NewPost />} />
          <Route path="edit-post/:id" element={<EditPost />} />
          <Route path="profile" element={<Profile />} />
          <Route path="post/:id" element={<BlogPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
