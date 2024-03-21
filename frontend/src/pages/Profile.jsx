import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Profile = () => {

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('users/profile');
        setData({ name: response.data.name, email: response.data.email })
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfileData();
  }, [])

  const editProfile = async (e) => {
    e.preventDefault();

    const { name, email, password } = data

    try {
      const { data } = await axios.post('users/edit-profile', { name, email, password })

      if (data.error) {

        toast.error(data.error)

      } else {

        setData({})
        setUser(data.user);
        toast.success('Profile updated!')
        navigate('/')

      }

    } catch (error) {
      console.log(error)
    }

  }
  return (
    <form className='signup' onSubmit={editProfile}>
      <h3 className='text-2xl my-8'>Edit Profile</h3>


      <label>Name</label>
      <input
        className='input mb-4 mt-1'
        type="text"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <label>Email</label>
      <input
        className='input mb-4 mt-1'
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <label>New Password</label>
      <input
        className='input mt-1'
        type="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button className='mt-7 px-5 py-3 border font-palanquin text-sm leading-none bg-blue-500 hover:bg-coral-red rounded-xl text-white'>Submit</button>

    </form>
  )
}

export default Profile