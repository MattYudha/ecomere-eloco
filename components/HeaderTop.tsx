'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CiLocationOn, CiTimer, CiPhone, CiMail } from 'react-icons/ci';

const HeaderTop = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="hidden bg-black text-gray-300 py-3 text-sm md:block">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex items-center justify-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CiLocationOn size={16} className="text-yellow-500" />
            <span>Restaurant St, Delicious City, London 9578, UK</span>
          </div>

          <div className="w-2 h-2 border border-yellow-500 transform rotate-45"></div>

          <div className="flex items-center gap-2">
            <CiTimer size={16} className="text-yellow-500" />
            <span>Daily : 9.00 am to 10.00 pm</span>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex items-center gap-8">
          <Link
            href="tel:+11234567890"
            className="flex items-center gap-2 hover:text-yellow-500"
          >
            <CiPhone size={16} className="text-yellow-500" />
            <span>+1 123 456 7890</span>
          </Link>

          <div className="w-2 h-2 border border-yellow-500 transform rotate-45"></div>

          <Link
            href="mailto:booking@restaurant.com"
            className="flex items-center gap-2 hover:text-yellow-500"
          >
            <CiMail size={16} className="text-yellow-500" />
            <span>booking@restaurant.comm</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
