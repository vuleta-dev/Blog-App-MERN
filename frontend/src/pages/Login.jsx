import React, { useState, useContext } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';


const Login = () => {

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const loginUser = async (e) => {
    e.preventDefault();

    const { email, password } = data

    try {
      const { data } = await axios.post('users/login', { email, password })
      if (data.error) {
        toast.error(data.error);
      } else {
        setUser(data);
        // reset form
        setData({});
        toast.success('Login successful!')
        navigate('/');
      }

    } catch (error) {

    }
  }

  return (

    <form className='login' onSubmit={loginUser}>
      <h3 className='text-2xl my-8'>Login</h3>

      <label>Email</label>
      <input
        className='input mb-4 mt-1'
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <label className='mt-3'>Password</label>
      <input
        className='input mt-1'
        type="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button className='mt-7 px-5 py-3 border font-palanquin text-sm leading-none bg-blue-500 hover:bg-coral-red rounded-xl text-white'>Login</button>
      
    </form>

  )
}

export default Login