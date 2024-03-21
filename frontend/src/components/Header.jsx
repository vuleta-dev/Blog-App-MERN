import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Header = () => {

  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [accountIsOpen, setAccountIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setAccountIsOpen(!accountIsOpen);
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setAccountIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      await axios.post('users/logout');
      setUser(null);
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      toast.success('Logout successful!')
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <header className="bg-blue-500 shadow-lg shadow-blue-500/40 py-6 px-4 sm:px-10 bg-white font-[sans-serif]  rounded-bl-xl rounded-br-xl bg-gradient-to-b from-blue-400 to-blue-500 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-[30px] font-[700] mb-2 md:mb-0">
          <Link className='font-montserrat' to="/">MERN<span className='text-3xl text-gray-300'>blog</span></Link>
        </div>
        <div className='flex items-center'>
          {user ? (
            <>
              <div className='mr-3 mt-1'>Hi {user.name}!</div>
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                  onClick={toggleDropdown}
                >
                  Account
                </button>
                {accountIsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link to="/profile"
                        className="text-center block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Edit your profile
                      </Link>
                      <Link
                        to="/new-post"
                        className="text-center block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Add new post
                      </Link>
                      <button
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 bg-blue-500 font-bold mr-2 px-5 text-sm rounded-xl text-white hover:bg-blue-800 bg-blue-500 py-1 font-montserrat">
                Login
              </Link>
              <Link to="/register" className="py-2 font-bold mr-2 px-5 py-1 text-sm rounded-xl text-white hover:bg-green-800 bg-green-600 font-montserrat">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
