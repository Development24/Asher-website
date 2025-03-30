import { Facebook, Linkedin, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12  ">
    <div className="max-w-[1400px] mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">ABOUT US</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-red-500">About</Link></li>
            <li><Link href="/press" className="hover:text-red-500">Press Kit</Link></li>
            <li><Link href="/careers" className="hover:text-red-500">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">LEGAL</h3>
          <ul className="space-y-2">
            <li><Link href="/terms" className="hover:text-red-500">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-red-500">Privacy</Link></li>
            <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">CONTACT US</h3>
          <ul className="space-y-2">
            <li><Link href="/support" className="hover:text-red-500">Support</Link></li>
            <li><Link href="/sales" className="hover:text-red-500">Sales</Link></li>
            <li><Link href="/partners" className="hover:text-red-500">Partners</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">SOCIAL</h3>
          <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-red-600">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white hover:text-red-600">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white hover:text-red-600">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white hover:text-red-600">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center">
        <p>&copy; 2024 PropertyRental. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
