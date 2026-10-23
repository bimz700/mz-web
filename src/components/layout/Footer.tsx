import { Link } from 'react-router-dom'
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Mail, label: 'Email', href: 'mailto:hello@bimz.dev' },
  ]

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-mono text-xl font-bold text-primary">BIMZ</span>
            </Link>
            <p className="text-text-dim text-sm leading-relaxed">
              Developer, modder, experimenter. Building digital experiences and exploring technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-text-dim hover:text-primary text-sm transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/lab" className="text-text-dim hover:text-primary text-sm transition-colors">
                  Lab
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-dim hover:text-primary text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-dim hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Connect</h3>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-dim hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-text-dimmer">
          <p>© {currentYear} BIMZ. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-text-dim transition-colors flex items-center">
              Admin <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
