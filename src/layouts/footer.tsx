'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const footerLinks = [
  {
    title: 'Company',
    items: [
      { href: '/about-us', label: 'About Us' },
      { href: '/blogs', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
    ],
  },
  {
    title: 'Resource',
    items: [
      { href: '/agent/signup', label: 'Be Agent' },
    ],
  },
]

const socialLinks = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://www.instagram.com/emergency_credit/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/emergency-credits/', icon: Linkedin, label: 'LinkedIn' },
]

const Footer = () => {
  return (
    <footer className=" border-t px-6 md:px-12">
      <div className="max-w-7xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-primary">Emergency Credit</span>
            </Link>
            <p className="mt-4 text-sm text-slate-600">
              Helping contractors and home service businesses get more leads,
              book more estimates, and win more projects.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-slate-500 hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold">{section.title}</h4>
              <ul className="mt-4 space-y-2">
                {section.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} MoreEstimates. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Made with ❤️ for home service businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
