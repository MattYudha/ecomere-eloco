import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      className="relative py-10 px-4 sm:px-6 lg:px-8 text-center bg-cover bg-center font-dm-sans bg-white text-black dark:bg-smoky-black-grilli dark:text-white"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Column 1: Brand and Subscribe */}
          <div className="space-y-6 flex flex-col items-center">
            <Link href="/" className="text-4xl font-forum text-gold-crayola">
              ELOQO.CO
            </Link>
            <address className="not-italic">
              sukapura, Jalan mangga dua no 16 rt03/02
            </address>
            <a href="mailto:eloqoco2025@gmail.com" className="hover:text-gold-crayola">eloqoco2025@gmail.com</a>
            <a href="tel:+6287871563774" className="hover:text-gold-crayola">Contact Order : +62 878-7156-3774</a>
            <p>Open : 09:00 am - 01:00 pm</p>
            
            <div className="w-24 mx-auto my-4">
              <div className="border-t-2 border-gold-crayola w-1/3 mx-auto"></div>
              <div className="border-t-2 border-gold-crayola w-full mx-auto my-1"></div>
              <div className="border-t-2 border-gold-crayola w-1/3 mx-auto"></div>
            </div>

            <p className="font-forum text-3xl text-white">Get News & Offers</p>
            <p>Subscribe us & Get <span className="text-gold-crayola">25% Off.</span></p>
            
            <form action="" className="w-full max-w-sm mx-auto flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                name="email_address" 
                placeholder="Your email" 
                autoComplete="off" 
                className="input-field w-full px-4 py-2 bg-eerie-black-1 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-gold-crayola"
              />
              <button type="submit" className="btn bg-gold-crayola text-eerie-black-1 font-bold py-2 px-6 hover:bg-opacity-90">
                Subscribe
              </button>
            </form>
          </div>

          {/* Column 2: Links */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-forum text-3xl text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gold-crayola">Home</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Menus</a></li>
              <li><a href="#" className="hover:text-gold-crayola">About Us</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Our Chefs</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-forum text-3xl text-white mb-4">Social</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gold-crayola">Facebook</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Instagram</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Twitter</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Youtube</a></li>
              <li><a href="#" className="hover:text-gold-crayola">Google Map</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-700">
          <p className="text-gray-400">
            &copy; 2025 ELOQO.CO. All Rights Reserved | Crafted by <a href="https://github.com/codewithsadee" target="_blank" rel="noopener noreferrer" className="text-gold-crayola hover:underline">codewithsadee</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;