import { Send, CheckCircle2, Instagram, Globe, Linkedin, Twitter } from 'lucide-react';
import { useState, FormEvent } from 'react';
import Logo from './Logo';
import { PHOTOGRAPHER_NAME } from '../data/photographyData';
import { useAdmin } from '../context/AdminContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Master Gallery' },
    { id: 'about', label: 'About Studio' },
    { id: 'contact', label: 'Inquiries' },
  ];

  const categoryLinks = [
    { id: 'portrait', label: 'Portraiture' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'fineart', label: 'Fine Art' },
  ];

  return (
    <footer id="footer" className="bg-neutral-980 border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-16 border-b border-neutral-900">
          {/* Logo Column */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-xs">
              Capturing raw emotional narratives, high-concept fashion, and timeless legacy prints with editorial precision.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com/creativekg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 border border-neutral-850 hover:border-amber-500/50 hover:bg-neutral-850 text-neutral-400 hover:text-amber-500 rounded transition-all duration-300 cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://behance.net/creativekg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 border border-neutral-850 hover:border-amber-500/50 hover:bg-neutral-850 text-neutral-400 hover:text-amber-500 rounded transition-all duration-300 cursor-pointer"
                title="Behance Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/creativekg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 border border-neutral-850 hover:border-amber-500/50 hover:bg-neutral-850 text-neutral-400 hover:text-amber-500 rounded transition-all duration-300 cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/creativekg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 border border-neutral-850 hover:border-amber-500/50 hover:bg-neutral-850 text-neutral-400 hover:text-amber-500 rounded transition-all duration-300 cursor-pointer"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-5">
              Site Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentPage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-sans text-xs text-neutral-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-5">
              Portfolio Collections
            </h4>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentPage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-sans text-xs text-neutral-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-5">
              Studio Journal
            </h4>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-4">
              Receive private notices of upcoming print series releases, gallery exhibitions, and seasonal commission availability.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-amber-500 font-sans text-xs bg-amber-500/5 border border-amber-500/10 p-3 rounded">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Joined Journal successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  id="newsletter-email-input"
                  required
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 rounded-l px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 flex-1"
                />
                <button
                  type="submit"
                  id="newsletter-submit-btn"
                  className="bg-neutral-900 border-y border-r border-neutral-850 rounded-r px-4 text-neutral-400 hover:text-white hover:bg-neutral-850 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lower copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 font-mono text-[10px] text-neutral-500">
          <span>
            © {new Date().getFullYear()} {PHOTOGRAPHER_NAME}. All rights reserved.
          </span>
          <div className="flex items-center space-x-4">
            <span>Archival Giclée Fine Art Prints Available</span>
            <span>•</span>
            <span>New York City, USA</span>
            <span>•</span>
            <AdminPortalTrigger />
          </div>
        </div>
      </div>
    </footer>
  );
}

function AdminPortalTrigger() {
  const { isAdmin, setShowLoginModal } = useAdmin();
  return (
    <button
      onClick={() => setShowLoginModal(true)}
      className="text-neutral-500 hover:text-amber-400 transition-colors uppercase tracking-wider font-mono text-[10px] cursor-pointer"
    >
      {isAdmin ? '⚡ Admin Mode' : 'Admin Login'}
    </button>
  );
}
