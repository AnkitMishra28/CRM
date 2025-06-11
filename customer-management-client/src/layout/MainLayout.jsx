import React from 'react'
import Navbar from "../component/Navbar"
import { Outlet } from 'react-router-dom'
import Footer from '../component/Footer'
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <motion.div 
      className="min-h-screen bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </motion.div>
  )
}

export default MainLayout