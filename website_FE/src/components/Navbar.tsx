import { useState, useEffect } from 'react';
import { Menu, X, Lock, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { PHOTOGRAPHER_NAME } from '../data/photographyData';

import { useAdmin } from '../context/AdminContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openClientPortal: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, openClientPortal, theme, toggleTheme }: NavbarProps) {
  const { navItems } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine background transparency
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      id="navbar"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled 
          ? 'bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left focus:outline-none"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Links */}
        <div id="desktop-menu" className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} className="relative">
                  <button
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 focus:outline-none ${
                      isActive 
                        ? 'text-amber-500 font-medium' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-amber-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <button
            id="theme-switcher-btn-desktop"
            onClick={toggleTheme}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-500 hover:border-amber-500/50 transition-all duration-300 focus:outline-none cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            id="nav-client-portal"
            onClick={openClientPortal}
            className="flex items-center space-x-1 px-4 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-500 hover:border-amber-500/50 hover:bg-neutral-900/60 transition-all duration-300 font-mono text-[10px] tracking-widest uppercase focus:outline-none cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Client Vault</span>
          </button>
        </div>

        {/* Mobile Menu Action */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            id="theme-switcher-btn-mobile"
            onClick={toggleTheme}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="nav-client-portal-mobile"
            onClick={openClientPortal}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-500 transition-colors"
            title="Client Proofing Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
          
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-neutral-950 border-b border-neutral-900 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        id={`mobile-nav-item-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`font-sans text-sm tracking-widest uppercase block w-full text-left py-2 border-l-2 pl-4 transition-all duration-200 focus:outline-none ${
                          isActive 
                            ? 'border-amber-500 text-amber-500 font-medium bg-neutral-900/40' 
                            : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                id="mobile-nav-client-portal"
                onClick={() => {
                  openClientPortal();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-500 hover:border-amber-500/50 transition-all font-mono text-xs tracking-widest uppercase focus:outline-none"
              >
                <Lock className="w-4 h-4" />
                <span>Client Vault Login</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
