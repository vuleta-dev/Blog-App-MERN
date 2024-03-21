import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const Layout = () => {

  return (
    <main className="max-container">
      <div className="min-h-screen">
        <Toaster position='top-center' toastOptions={{ duration: 2000 }} />
        <Header />
        <Outlet />
        <Footer />
      </div>

    </main>
  )
}

export default Layout