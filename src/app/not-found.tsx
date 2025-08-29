'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <motion.div
          className="w-[60px] h-[60px] cursor-pointer"
          whileHover={{ rotate: 218 }}
          transition={{ duration: 0.5 }}
          onClick={() => {
            window.location.href = '/';
          }}
        >
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={60} 
            height={60}
          />
        </motion.div>
      </motion.div>

      {/* 404 Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-black tracking-tight leading-none mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-light tracking-wide mb-2">
          page not found
        </p>
        <p className="text-lg text-gray-500 max-w-md mx-auto px-4">
          the page you&apos;re looking for doesn&apos;t exist or has been moved
        </p>
      </motion.div>

      {/* Back Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link 
          href="/"
          className="inline-block px-8 py-3 text-lg font-bold border rounded-full transition-all duration-300"
          style={{ 
            color: '#F8C46F',
            borderColor: '#F8C46F',
            borderWidth: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8C46F';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#F8C46F';
          }}
        >
          back home
        </Link>
      </motion.div>

      {/* Optional: Add some decorative elements that match your site */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-sm text-gray-400">
          lost? try navigating from the{' '}
          <Link href="/" className="underline hover:text-gray-600 transition-colors">
            homepage
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
