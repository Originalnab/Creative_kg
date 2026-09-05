import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import ClientPortal from './components/ClientPortal';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import { Photo } from './types';
import { motion, AnimatePresence } from 'motion/react';

import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminToolbar from './components/AdminToolbar';
import AdminLoginModal from './components/AdminLoginModal';
import SuperAdminSetupModal from './components/SuperAdminSetupModal';
import AdminClientManagerModal from './components/AdminClientManagerModal';
import PhotoEditorModal from './components/PhotoEditorModal';
import BulkUploadModal from './components/BulkUploadModal';
import BulkManageModal from './components/BulkManageModal';
import MenuEditorModal from './components/MenuEditorModal';
import ReceiptModal from './components/ReceiptModal';
import SMSNotificationToast from './components/SMSNotificationToast';
import SystemMediaModal from './components/SystemMediaModal';
import HeroSliderModal from './components/HeroSliderModal';

export default function App() {
  return (
    <AdminProvider>
      <MainApp />
    </AdminProvider>
  );
}

function MainApp() {
  const { isTeamMember, setShowLoginModal } = useAdmin();
  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [showClientPortal, setShowClientPortal] = useState<boolean>(false);

  // Manage theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Lightbox global state
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Contact prefilled parameters
  const [prefilledCategory, setPrefilledCategory] = useState<string>('');
  const [prefilledTitle, setPrefilledTitle] = useState<string>('');

  // Normalize page IDs
  const setCurrentPage = (page: string) => {
    let normalized = page.toLowerCase().trim();
    if (normalized === 'proptrait') normalized = 'portrait';
    if (normalized === 'fineart') normalized = 'fineart';
    setCurrentPageState(normalized);
  };

  const openLightbox = (photosArr: Photo[], index: number) => {
    setLightboxPhotos(photosArr);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleBookInquiry = (category: string, title: string) => {
    setPrefilledCategory(category);
    setPrefilledTitle(title);
    setLightboxOpen(false);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearPrefills = () => {
    setPrefilledCategory('');
    setPrefilledTitle('');
  };

  // Synchronize browser tab title and favicon
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      home: 'Creative KG | Fine Art Photographer',
      portrait: 'Portrait Collection | Creative KG',
      wedding: 'Weddings of Distinction | Creative KG',
      editorial: 'Editorial Series | Creative KG',
      fashion: 'Fashion & Couture | Creative KG',
      fineart: 'Fine Art Prints | Creative KG',
      gallery: 'Master Archive | Creative KG',
      about: 'About Creative KG | Biography',
      contact: 'Reserve Your Session | Creative KG'
    };

    const title = pageTitles[currentPage] || 'Creative KG | Photography';
    document.title = title;
  }, [currentPage]);

  // Key hooks for escape closing portals & Ctrl+Shift+A key shortcut to launch admin login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowClientPortal(false);
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowLoginModal]);

  return (
    <div id="photography-portfolio-app" className={`min-h-screen bg-neutral-950 text-white selection:bg-amber-500 selection:text-neutral-950 flex flex-col justify-between font-sans ${isTeamMember ? 'pt-12' : ''}`}>
      
      {/* Top Floating Admin Toolbar */}
      <AdminToolbar />

      {/* Floating glass navigation header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        openClientPortal={() => setShowClientPortal(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container Stage */}
      <main className="flex-1 pt-24 pb-16">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {currentPage === 'home' && (
                <Home
                  setCurrentPage={setCurrentPage}
                  openLightbox={openLightbox}
                />
              )}

              {['portrait', 'wedding', 'editorial', 'fashion', 'fineart'].includes(currentPage) && (
                <CategoryPage
                  category={currentPage as 'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart'}
                  setCurrentPage={setCurrentPage}
                  openLightbox={openLightbox}
                />
              )}

              {currentPage === 'gallery' && (
                <Gallery openLightbox={openLightbox} />
              )}

              {currentPage === 'about' && (
                <About />
              )}

              {currentPage === 'contact' && (
                <Contact
                  prefilledCategory={prefilledCategory}
                  prefilledTitle={prefilledTitle}
                  onClearPrefills={clearPrefills}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Full-Theater Lightbox Overlay */}
      {lightboxOpen && (
        <Lightbox
          photos={lightboxPhotos}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(index) => setLightboxIndex(index)}
          onBookInquiry={handleBookInquiry}
        />
      )}

      {/* Private Client Proofing Vault */}
      {showClientPortal && (
        <ClientPortal onClose={() => setShowClientPortal(false)} />
      )}

      {/* Admin Management Modals */}
      <AdminLoginModal onOpenClientVault={() => setShowClientPortal(true)} />
      <SuperAdminSetupModal />
      <AdminClientManagerModal />
      <PhotoEditorModal />
      <BulkUploadModal />
      <BulkManageModal />
      <MenuEditorModal />
      <ReceiptModal />
      <SystemMediaModal />
      <HeroSliderModal />

      {/* Real-time SMS Floating Alert Toast */}
      <SMSNotificationToast />

    </div>
  );
}
