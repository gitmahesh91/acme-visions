'use client'

import { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import OptimizedImage from '@/components/OptimizedImage'
import type { Photo } from '@/lib/photos'
import { Menu, X, Instagram, Facebook, Eye, ArrowRight } from 'lucide-react'

type PageType = 'home' | 'portfolio' | 'wedding' | 'baby' | 'newborn' | 'about' | 'investment' | 'contact'

interface PhotosContextType {
  weddingPhotos: Photo[]
  babyPhotos: Photo[]
  newbornPhotos: Photo[]
  portfolioItems: Photo[]
  homepagePhotos: {
    heroBackground: Photo | null
    artForHeart: Photo | null
    photoGrid1: Photo | null
    photoGrid2: Photo | null
    photoGrid3: Photo | null
    photoGrid4: Photo | null
    photoGrid5: Photo | null
    photoGrid6: Photo | null
    realLovers1: Photo | null
    realLovers2: Photo | null
    realLovers3: Photo | null
    realLovers4: Photo | null
    footerBackground: Photo | null
  }
}

const PhotosContext = createContext<PhotosContextType>({
  weddingPhotos: [], babyPhotos: [], newbornPhotos: [], portfolioItems: [],
  homepagePhotos: {
    heroBackground: null, artForHeart: null, photoGrid1: null, photoGrid2: null,
    photoGrid3: null, photoGrid4: null, photoGrid5: null, photoGrid6: null,
    realLovers1: null, realLovers2: null, realLovers3: null, realLovers4: null,
    footerBackground: null,
  },
})

function getPhoto(photos: Photo[], index: number): Photo | null {
  if (photos.length === 0) return null
  return photos[index] || photos[0]
}

// ============================================
// SMOOTH SCROLL REVEAL HOOK
// ============================================
function useScrollReveal() {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, revealed }
}

// ============================================
// DRAWER NAV
// ============================================
function DrawerNav({ open, onClose, navigateTo, currentPage }: {
  open: boolean; onClose: () => void; navigateTo: (p: PageType) => void; currentPage: PageType
}) {
  const menuItems: { id: PageType; label: string }[] = [
    { id: 'home', label: 'HOME' }, { id: 'wedding', label: 'WEDDINGS' },
    { id: 'baby', label: 'BABY' }, { id: 'newborn', label: 'NEWBORN' },
    { id: 'portfolio', label: 'PORTFOLIO' }, { id: 'about', label: 'ABOUT ME' },
    { id: 'investment', label: 'INVESTMENT' }, { id: 'contact', label: 'CONTACT' },
  ]

  return (
    <>
      <div className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside className={`fixed top-0 right-0 z-[101] h-full w-[471px] max-w-full bg-[#090C10] transition-transform duration-500 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={onClose} className="absolute top-8 right-8 text-[#F6EFE5] hover:text-[#776848] transition-colors smooth-hover" aria-label="Close">
          <X size={32} />
        </button>
        <nav className="h-full flex flex-col justify-center pl-16 pr-12">
          <ul className="space-y-5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => { navigateTo(item.id); onClose() }}
                  className={`drawer-item font-display text-2xl tracking-wide text-left ${currentPage === item.id ? 'text-[#776848]' : 'text-[#F6EFE5]'}`}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-12 left-16 right-12">
            <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-2">Acme Visions</p>
            <p className="font-body text-xs text-[#F6EFE5]/60 leading-relaxed">By Ananth Vara Prasad<br />India · Capturing Weddings Worldwide</p>
          </div>
        </nav>
      </aside>
    </>
  )
}

// ============================================
// HEADER
// ============================================
function Header({ onMenuClick, navigateTo }: { onMenuClick: () => void; navigateTo: (p: PageType) => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#090C10]/90 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 flex items-center justify-between">
        <button onClick={() => navigateTo('home')} className="group smooth-hover">
          <div className="text-center">
            <h1 className="font-display text-3xl lg:text-4xl font-normal leading-none text-[#F6EFE5]">Acme Visions</h1>
            <p className="font-body text-[10px] tracking-luxe uppercase text-[#776848] mt-1">by Ananth Vara Prasad</p>
          </div>
        </button>
        <button onClick={onMenuClick} className="text-[#F6EFE5] hover:text-[#776848] transition-colors smooth-hover" aria-label="Open menu">
          <Menu size={32} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}

// ============================================
// HERO
// ============================================
function Hero({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { homepagePhotos } = useContext(PhotosContext)
  const heroPhoto = homepagePhotos.heroBackground

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#090C10]">
      <div className="absolute inset-0">
        {heroPhoto && (
          <img src={heroPhoto.src} alt={heroPhoto.alt} className="w-full h-full object-cover animate-slow-zoom-in" style={{ objectPosition: '48% 10%' }} />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="absolute top-32 right-8 lg:right-16 max-w-2xl text-right animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-normal text-white leading-[1.1]">Wedding &amp; Portrait<br />Photographer India</h1>
      </div>
      <div className="absolute bottom-32 left-8 lg:left-16 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.1] mb-6">YOUR DEEPEST,<br />MOST EUPHORIC<br />MOMENTS</h2>
        <h3 className="font-body text-xs sm:text-sm font-light tracking-luxe uppercase text-white mb-4">Artfully Captured — For This Life and the Next</h3>
        <p className="font-body text-sm font-light text-white/80 leading-relaxed mb-3 tracking-wide-premium max-w-md">Your wedding day is more than just saying the words…</p>
        <p className="font-body text-sm font-light text-white/80 leading-relaxed tracking-wide-premium">Moments lived; memories held.</p>
        <button onClick={() => navigateTo('portfolio')} className="mt-8 inline-block font-display text-2xl text-white link-underline smooth-hover">VIEW PORTFOLIO</button>
      </div>
    </section>
  )
}

// ============================================
// SECTION WRAPPER (with scroll reveal)
// ============================================
function Section({ children, className = '', bg = '' }: { children: React.ReactNode; className?: string; bg?: string }) {
  const { ref, revealed } = useScrollReveal()
  return (
    <section ref={ref as any} className={`section-reveal ${revealed ? 'revealed' : ''} ${bg} ${className}`}>
      {children}
    </section>
  )
}

// ============================================
// ART FOR THE HEART
// ============================================
function ArtForHeart({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { homepagePhotos } = useContext(PhotosContext)
  const photo = homepagePhotos.artForHeart

  return (
    <Section bg="bg-[#BFB9B0] py-32 lg:py-40 px-8 lg:px-16 smoke-overlay">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6">
            {photo && (
              <div className="photo-card aspect-[4/5] overflow-hidden">
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                <div className="photo-overlay">
                  <div className="hover-icon"><Eye className="text-white" size={24} /></div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-6 lg:pl-8">
            <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">Acme Visions</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#373737] leading-[1.1] mb-8">ART FOR<br />THE HEART</h2>
            <p className="font-body text-sm font-light text-black/80 leading-relaxed mb-6 tracking-wide-premium">I&apos;m Ananth Vara Prasad, the artist behind Acme Visions. With over three years of devoted practice, I craft visual stories that transcend ordinary photography — capturing the soul of your most precious moments.</p>
            <p className="font-body text-sm font-light text-black/70 leading-relaxed mb-8 tracking-wide-premium">From the sacred rituals of weddings to the tender first breaths of newborns, every frame is composed with intention, artistry, and reverence for the story unfolding before the lens.</p>
            <button onClick={() => navigateTo('about')} className="font-display text-2xl text-[#373737] link-underline smooth-hover">MEET ME</button>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ============================================
// PHOTO GRID
// ============================================
function PhotoGrid() {
  const { homepagePhotos } = useContext(PhotosContext)
  const photos = [homepagePhotos.photoGrid1, homepagePhotos.photoGrid2, homepagePhotos.photoGrid3, homepagePhotos.photoGrid4, homepagePhotos.photoGrid5, homepagePhotos.photoGrid6].filter(Boolean) as Photo[]

  return (
    <Section bg="bg-[#090C10] smoke-overlay py-32 px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-4">Wedding &amp; Portrait Photographer India</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white">SELECTED WORKS</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {photos.map((photo, index) => (
            <div key={index} className={`photo-card overflow-hidden ${index % 2 === 0 ? 'mt-0' : 'mt-12 lg:mt-20'}`}>
              <OptimizedImage src={photo.src} alt={photo.alt} className="aspect-[3/4]" />
              <div className="photo-overlay">
                <div className="hover-icon"><Eye className="text-white" size={24} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ============================================
// COFFEE BRIBES
// ============================================
function CoffeeBribes({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  return (
    <Section bg="relative bg-[#090C10] py-32 lg:py-40 px-8 lg:px-16 smoke-overlay">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.1] mb-8">ACCEPTING<br />COFFEE BRIBES</h2>
        <p className="font-body text-sm font-light text-white/80 leading-relaxed mb-3 tracking-wide-premium">Hey, I&apos;m Ananth.</p>
        <p className="font-body text-sm font-light text-white/70 leading-relaxed mb-10 tracking-wide-premium max-w-xl mx-auto">A photographer, romantic, and storyteller devoted to capturing the unscripted, the tender, and the timeless. Bring me your story — and maybe a good coffee — and let&apos;s create art that lives forever.</p>
        <button onClick={() => navigateTo('about')} className="font-display text-2xl text-white link-underline smooth-hover">MEET ME</button>
      </div>
    </Section>
  )
}

// ============================================
// LOVE LETTERS
// ============================================
function LoveLetters() {
  const testimonials = [
    { text: 'Absolutely stunning wedding photos. Ananth captured every emotion perfectly. The attention to detail and artistic vision exceeded all our expectations.', name: 'Priya & Rahul', role: 'Wedding Couple' },
    { text: 'The baby photos are adorable. So patient and creative with our little one! Truly a talented photographer who knows how to capture innocence.', name: 'Sneha Family', role: 'Baby Photography' },
    { text: 'Professional, punctual, and incredibly talented. The newborn photos of our daughter are absolutely magical. Highly recommend Acme Visions!', name: 'Karthik & Divya', role: 'Newborn Session' },
  ]

  return (
    <Section bg="relative bg-[#BFB9B0] py-32 lg:py-40 px-8 lg:px-16 smoke-overlay">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-[#373737] leading-none">LOVE</h2>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-[#373737] leading-none mt-2">LETTERS</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t, index) => (
            <div key={index} className="text-center smooth-hover" style={{ animationDelay: `${index * 0.1}s` }}>
              <p className="font-body text-sm font-normal text-black leading-relaxed mb-8 tracking-luxe italic">&ldquo;{t.text}&rdquo;</p>
              <p className="font-display text-2xl text-[#373737] mb-1">{t.name}</p>
              <p className="font-body text-xs tracking-luxe uppercase text-[#776848]">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ============================================
// LET'S TALK
// ============================================
function LetsTalk({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  return (
    <Section bg="bg-[#BFB9B0] py-32 lg:py-40 px-8 lg:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-body text-sm tracking-luxe uppercase text-[#776848] mb-6">LET&apos;S TALK</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#373737] leading-[1.1] mb-10 uppercase">BECAUSE YOUR WEDDING<br />IS MORE THAN JUST ONE DAY</h2>
        <button onClick={() => navigateTo('contact')} className="font-display text-2xl text-[#776848] link-underline smooth-hover">RSVP</button>
      </div>
    </Section>
  )
}

// ============================================
// REAL LOVERS
// ============================================
function RealLovers({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { homepagePhotos } = useContext(PhotosContext)
  const items = [
    { photo: homepagePhotos.realLovers1, title: 'WEDDING CEREMONY', cat: 'Wedding' },
    { photo: homepagePhotos.realLovers2, title: 'NEWBORN MIRACLES', cat: 'Newborn' },
    { photo: homepagePhotos.realLovers3, title: 'BABY MILESTONES', cat: 'Baby' },
    { photo: homepagePhotos.realLovers4, title: 'EDITORIAL PORTRAITS', cat: 'Portrait' },
  ].filter(item => item.photo) as { photo: Photo; title: string; cat: string }[]

  return (
    <Section bg="bg-[#EFECE5] py-32 lg:py-40 px-8 lg:px-16 smoke-overlay">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#373737] leading-[1.1]">REAL LOVERS</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {items.map((item, index) => (
            <div key={index} className={`photo-card cursor-pointer ${index % 2 === 0 ? 'mt-0' : 'mt-16 lg:mt-24'}`} onClick={() => navigateTo('portfolio')}>
              <div className="aspect-[4/5] overflow-hidden mb-4">
                <OptimizedImage src={item.photo.src} alt={item.photo.alt} className="w-full h-full" />
                <div className="photo-overlay">
                  <div className="hover-icon"><Eye className="text-white" size={24} /></div>
                </div>
              </div>
              <p className="font-body text-xs font-bold tracking-luxe uppercase text-black">{item.title}</p>
              <p className="font-body text-xs tracking-wide-premium text-[#776848] mt-1">{item.cat}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-20">
          <button onClick={() => navigateTo('portfolio')} className="font-display text-2xl text-[#373737] link-underline smooth-hover">ALL STORIES</button>
        </div>
      </div>
    </Section>
  )
}

// ============================================
// SOCIAL BUTTERFLY
// ============================================
function SocialButterfly() {
  return (
    <Section bg="bg-[#BFB9B0] py-32 lg:py-40 px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#373737] leading-[1.1]">SOCIAL BUTTERFLY</h2>
        </div>
        <div className="flex justify-between items-center">
          <a href="https://instagram.com/acmevisions" target="_blank" rel="noopener noreferrer" className="font-display text-3xl lg:text-4xl text-[#776848] link-underline flex items-center gap-3 smooth-hover">
            <Instagram size={28} strokeWidth={1.5} /> INSTAGRAM
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="font-display text-3xl lg:text-4xl text-[#776848] link-underline flex items-center gap-3 smooth-hover">
            FACEBOOK <Facebook size={28} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </Section>
  )
}

// ============================================
// FOOTER
// ============================================
function Footer({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { homepagePhotos } = useContext(PhotosContext)
  const bgPhoto = homepagePhotos.footerBackground

  return (
    <footer className="relative bg-[#090C10] overflow-hidden">
      <div className="absolute inset-0">
        {bgPhoto && <img src={bgPhoto.src} alt="" className="w-full h-full object-cover opacity-30" />}
        <div className="absolute inset-0 bg-[#090C10]/80" />
      </div>
      <div className="relative py-32 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl font-normal text-white mb-8">MENU</h2>
              <ul className="space-y-3">
                {[
                  { id: 'home' as PageType, label: 'HOME' }, { id: 'wedding' as PageType, label: 'WEDDINGS' },
                  { id: 'baby' as PageType, label: 'BABY' }, { id: 'newborn' as PageType, label: 'NEWBORN' },
                  { id: 'portfolio' as PageType, label: 'PORTFOLIO' }, { id: 'about' as PageType, label: 'ABOUT ME' },
                  { id: 'contact' as PageType, label: 'CONTACT' },
                ].map((item) => (
                  <li key={item.id}>
                    <button onClick={() => navigateTo(item.id)} className="font-display text-lg text-white hover:text-[#776848] transition-colors smooth-hover">{item.label}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:text-right">
              <p className="font-display text-xl lg:text-2xl text-white leading-relaxed mb-6">Acme Visions. Luxury Editorial Wedding Photographer, Based in India, Capturing Weddings Worldwide.</p>
              <div className="space-y-2 lg:text-right">
                <p className="font-body text-xs tracking-wide-premium text-white/70">+91 9542009741</p>
                <p className="font-body text-xs tracking-wide-premium text-white/70">cananthca581@gmail.com</p>
                <a href="https://instagram.com/acmevisions" target="_blank" rel="noopener noreferrer" className="font-body text-xs tracking-wide-premium text-[#776848] hover:text-white transition-colors block">@acmevisions</a>
              </div>
            </div>
          </div>
          <div className="mt-32 pt-8 border-t border-white/10 text-center">
            <p className="font-display text-sm text-white/60">SITE CREDITS: <span className="text-[#776848]">ACME VISIONS STUDIO</span></p>
            <p className="font-body text-xs tracking-wide-premium text-white/40 mt-2">© 2026 Acme Visions by Ananth Vara Prasad. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// GALLERY PAGE
// ============================================
function GalleryPage({ title, subtitle, photos, navigateTo, backTo }: {
  title: string; subtitle: string; photos: Photo[]; navigateTo: (p: PageType) => void; backTo: PageType
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <div className="bg-[#BFB9B0] min-h-screen page-transition pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <button onClick={() => navigateTo(backTo)} className="font-body text-xs tracking-luxe uppercase text-[#776848] hover:text-black transition-colors mb-16 flex items-center gap-2 smooth-hover">← BACK TO HOME</button>
        <div className="mb-24">
          <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">{photos.length} Photographs</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-normal text-[#373737] leading-[0.95] mb-8">{title}</h1>
          <p className="font-body text-sm font-light text-black/70 leading-relaxed max-w-2xl tracking-wide-premium">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-1">
        {photos.map((photo, index) => (
          <div key={index} className="photo-card overflow-hidden" onClick={() => setLightboxIndex(index)}>
            <div className={`relative w-full overflow-hidden ${photo.featured ? 'h-[85vh]' : 'h-[70vh]'}`}>
              <OptimizedImage src={photo.src} alt={photo.alt} className="w-full h-full" priority={index < 2} />
              <div className="photo-overlay">
                <div className="hover-icon"><Eye className="text-white" size={24} /></div>
              </div>
              <div className="absolute top-6 left-6"><span className="font-body text-xs tracking-luxe uppercase text-white">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span></div>
              {photo.featured && <div className="absolute top-6 right-6"><span className="font-body text-xs tracking-luxe uppercase text-[#776848]">★ FEATURED</span></div>}
            </div>
          </div>
        ))}
      </div>
      {lightboxIndex !== null && <Lightbox photos={photos} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </div>
  )
}

// ============================================
// PORTFOLIO PAGE
// ============================================
function PortfolioPage({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { weddingPhotos, babyPhotos, newbornPhotos, portfolioItems } = useContext(PhotosContext)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const categories = ['All', 'Wedding', 'Portrait', 'Event', 'Newborn', 'Baby']

  const allPhotos = useMemo(() => [
    ...portfolioItems,
    ...weddingPhotos.slice(0, 6).map(p => ({ ...p, category: 'Wedding' })),
    ...newbornPhotos.slice(0, 4).map(p => ({ ...p, category: 'Newborn' })),
    ...babyPhotos.slice(0, 4).map(p => ({ ...p, category: 'Baby' })),
  ], [portfolioItems, weddingPhotos, newbornPhotos, babyPhotos])

  const filteredItems = selectedCategory === 'All' ? allPhotos : allPhotos.filter(item => item.category === selectedCategory)

  return (
    <div className="bg-[#EFECE5] min-h-screen pt-32 pb-20 page-transition smoke-overlay">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <button onClick={() => navigateTo('home')} className="font-body text-xs tracking-luxe uppercase text-[#776848] hover:text-black transition-colors mb-16 flex items-center gap-2 smooth-hover">← BACK TO HOME</button>
        <div className="mb-20">
          <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">{filteredItems.length} Photographs</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-normal text-[#373737] leading-[0.95]">PORTFOLIO</h1>
        </div>
        <div className="flex flex-wrap gap-3 mb-16">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`font-body text-xs tracking-luxe uppercase px-5 py-2 transition-colors smooth-hover ${selectedCategory === cat ? 'bg-[#090C10] text-white' : 'text-[#373737] hover:text-[#776848]'}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {filteredItems.map((photo, index) => (
            <div key={index} className={`photo-card cursor-pointer ${index % 2 === 0 ? 'mt-0' : 'mt-12 lg:mt-20'}`} onClick={() => setLightboxIndex(index)}>
              <div className="aspect-[3/4] overflow-hidden mb-3">
                <OptimizedImage src={photo.src} alt={photo.alt} className="w-full h-full" />
                <div className="photo-overlay">
                  <div className="hover-icon"><Eye className="text-white" size={24} /></div>
                </div>
              </div>
              {photo.category && <p className="font-body text-xs font-bold tracking-luxe uppercase text-black">{photo.category}</p>}
            </div>
          ))}
        </div>
      </div>
      {lightboxIndex !== null && <Lightbox photos={filteredItems} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </div>
  )
}

// ============================================
// ABOUT PAGE
// ============================================
function AboutPage({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { portfolioItems } = useContext(PhotosContext)
  const portrait = getPhoto(portfolioItems, 2)

  return (
    <div className="bg-[#BFB9B0] min-h-screen pt-32 pb-20 page-transition">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <button onClick={() => navigateTo('home')} className="font-body text-xs tracking-luxe uppercase text-[#776848] hover:text-black transition-colors mb-16 flex items-center gap-2 smooth-hover">← BACK TO HOME</button>
        <div className="mb-20">
          <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">THE ARTIST</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-normal text-[#373737] leading-[0.95]">HEY, I&apos;M<br />ANANTH</h1>
        </div>
        <div className="grid lg:grid-cols-12 gap-12 mb-32">
          <div className="lg:col-span-5">
            {portrait && (
              <div className="photo-card aspect-[3/4] overflow-hidden">
                <img src={portrait.src} alt={portrait.alt} className="w-full h-full object-cover" />
                <div className="photo-overlay">
                  <div className="hover-icon"><Eye className="text-white" size={24} /></div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-7 lg:pt-12">
            <p className="font-display text-2xl lg:text-3xl font-normal text-[#373737] italic leading-relaxed mb-8">&ldquo;I don&apos;t just take photographs — I preserve emotions, freeze time, and craft art that speaks to the heart for generations.&rdquo;</p>
            <div className="space-y-6 font-body text-sm font-light text-black/80 leading-relaxed tracking-wide-premium">
              <p>I&apos;m <span className="text-[#776848]">Ananth Vara Prasad</span>, the artist and founder of <span className="text-[#776848]">Acme Visions</span>. My journey in visual storytelling began with a deep fascination for capturing emotions and transforming ordinary moments into extraordinary memories.</p>
              <p>Specializing in wedding cinematography, newborn photography, and editorial portraits, I bring a unique blend of technical expertise and artistic vision to every project. My approach is intimate, unobtrusive, and deeply personal.</p>
              <p>Trained at <span className="text-[#776848]">Photriya Academy</span> (29th Batch, 2018-2020) and certified by the Industrial Training Institute (AP), I&apos;ve spent over three years perfecting my craft.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-black/10">
              <div><p className="font-display text-3xl text-[#776848] mb-1">3+</p><p className="font-body text-xs tracking-luxe uppercase text-black/60">Years</p></div>
              <div><p className="font-display text-3xl text-[#776848] mb-1">50+</p><p className="font-body text-xs tracking-luxe uppercase text-black/60">Projects</p></div>
              <div><p className="font-display text-3xl text-[#776848] mb-1">40+</p><p className="font-body text-xs tracking-luxe uppercase text-black/60">Clients</p></div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">Education &amp; Training</h3>
            <div className="border-l border-[#776848]/30 pl-6">
              <p className="font-display text-2xl text-[#373737] mb-1">Photriya Academy</p>
              <p className="text-[#776848] mb-1 font-body text-sm">29th Batch · 2018 - 2020</p>
              <p className="text-black/60 text-sm font-body">Industrial Training Institute (AP)</p>
            </div>
          </div>
          <div>
            <h3 className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">Expertise</h3>
            <ul className="space-y-3 font-body text-sm text-black/80">
              {['Classic Photography', 'Macro & Micro Photography', 'Lighting Techniques', 'Composition & Visual Storytelling', 'Adobe Photoshop & Lightroom', 'Studio & Natural Lighting'].map((skill) => (
                <li key={skill} className="flex items-center gap-3"><span className="w-1 h-1 bg-[#776848]"></span>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center pt-12 border-t border-black/10">
          <h3 className="font-display text-3xl text-[#373737] mb-6">Let&apos;s create something beautiful</h3>
          <button onClick={() => navigateTo('contact')} className="font-display text-2xl text-[#776848] link-underline smooth-hover">GET IN TOUCH</button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// INVESTMENT PAGE
// ============================================
function InvestmentPage({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const { weddingPhotos, babyPhotos, portfolioItems } = useContext(PhotosContext)
  const packages = [
    { name: 'WEDDING', price: '₹XX,XXX', desc: 'Capturing your special day with artistic vision and emotional storytelling.', features: ['Pre-Wedding Shoots', 'Wedding Day Coverage', 'Candid Moments', 'Traditional Shots', 'Album Design'], image: getPhoto(weddingPhotos, 2)?.src },
    { name: 'BABY PHOTOGRAPHY', price: '₹XX,XXX', desc: 'Adorable and precious moments of your little ones captured with care.', features: ['Newborn Sessions', 'Baby Milestones', 'Cake Smash', 'Family Portraits', 'Theme Shoots'], image: getPhoto(babyPhotos, 6)?.src },
    { name: 'PORTRAIT', price: '₹XX,XXX', desc: 'Professional portrait sessions that bring out your unique personality.', features: ['Individual Portraits', 'Family Portraits', 'Corporate Headshots', 'Model Portfolios', 'Outdoor Sessions'], image: getPhoto(portfolioItems, 3)?.src },
    { name: 'EVENT COVERAGE', price: '₹XX,XXX', desc: 'Complete event documentation with photography and cinematography.', features: ['Corporate Events', 'Birthday Parties', 'Anniversaries', 'Religious Ceremonies', 'Private Functions'], image: getPhoto(portfolioItems, 6)?.src },
  ]

  return (
    <div className="bg-[#BFB9B0] min-h-screen pt-32 pb-20 page-transition">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <button onClick={() => navigateTo('home')} className="font-body text-xs tracking-luxe uppercase text-[#776848] hover:text-black transition-colors mb-16 flex items-center gap-2 smooth-hover">← BACK TO HOME</button>
        <div className="mb-24 text-center">
          <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">INVESTMENT</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-normal text-[#373737] leading-[0.95] mb-8">THE INVESTMENT</h1>
          <p className="font-body text-sm font-light text-black/70 max-w-2xl mx-auto leading-relaxed tracking-wide-premium">Because your story is more than just one day — it&apos;s a lifetime of moments worth preserving in their truest, most beautiful form.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {packages.map((pkg, index) => (
            <div key={index} className="group cursor-pointer smooth-hover" onClick={() => navigateTo('contact')}>
              {pkg.image && (
                <div className="photo-card aspect-[16/10] overflow-hidden mb-6">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="photo-overlay">
                    <div className="hover-icon"><Eye className="text-white" size={24} /></div>
                  </div>
                </div>
              )}
              <div className="flex items-end justify-between mb-3">
                <h3 className="font-display text-3xl text-[#373737]">{pkg.name}</h3>
                <p className="font-body text-xs tracking-luxe uppercase text-[#776848]">{pkg.price}</p>
              </div>
              <p className="font-body text-sm font-light text-black/70 mb-6 leading-relaxed tracking-wide-premium">{pkg.desc}</p>
              <ul className="grid grid-cols-2 gap-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="font-body text-xs text-black/60 flex items-center gap-2"><span className="w-1 h-1 bg-[#776848]"></span>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center pt-12 border-t border-black/10">
          <h3 className="font-display text-3xl text-[#373737] mb-6">Ready to begin?</h3>
          <button onClick={() => navigateTo('contact')} className="font-display text-2xl text-[#776848] link-underline smooth-hover">ENQUIRE NOW</button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CONTACT PAGE
// ============================================
function ContactPage({ navigateTo }: { navigateTo: (p: PageType) => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Message sent', description: "Thank you for reaching out. I'll respond within 24 hours." })
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="bg-[#BFB9B0] min-h-screen pt-32 pb-20 page-transition">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <button onClick={() => navigateTo('home')} className="font-body text-xs tracking-luxe uppercase text-[#776848] hover:text-black transition-colors mb-16 flex items-center gap-2 smooth-hover">← BACK TO HOME</button>
        <div className="mb-20">
          <p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-6">LET&apos;S CONNECT</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-normal text-[#373737] leading-[0.95]">BEGIN THE<br />CONVERSATION</h1>
        </div>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-body text-sm font-light text-black/80 leading-relaxed mb-12 tracking-wide-premium">I&apos;d love to hear your story. Whether you&apos;re planning a wedding, welcoming a new life, or simply want to capture a moment in time — let&apos;s create something beautiful together.</p>
            <div className="space-y-8">
              <div><p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-2">Phone</p><a href="tel:+919542009741" className="font-display text-2xl text-[#373737] link-underline smooth-hover">+91 9542009741</a></div>
              <div><p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-2">Email</p><a href="mailto:cananthca581@gmail.com" className="font-display text-2xl text-[#373737] link-underline break-all smooth-hover">cananthca581@gmail.com</a></div>
              <div><p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-2">Location</p><p className="font-display text-2xl text-[#373737]">India · Available Worldwide</p></div>
              <div><p className="font-body text-xs tracking-luxe uppercase text-[#776848] mb-2">Instagram</p><a href="https://instagram.com/acmevisions" target="_blank" rel="noopener noreferrer" className="font-display text-2xl text-[#373737] link-underline smooth-hover">@acmevisions</a></div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-body text-xs tracking-luxe uppercase text-[#776848] mb-3">Your Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" required className="w-full bg-transparent border-0 border-b border-black/20 text-black placeholder:text-black/40 focus:border-[#776848] focus-visible:ring-0 rounded-none h-14 text-lg font-body" />
              </div>
              <div>
                <label className="block font-body text-xs tracking-luxe uppercase text-[#776848] mb-3">Email Address</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" required className="w-full bg-transparent border-0 border-b border-black/20 text-black placeholder:text-black/40 focus:border-[#776848] focus-visible:ring-0 rounded-none h-14 text-lg font-body" />
              </div>
              <div>
                <label className="block font-body text-xs tracking-luxe uppercase text-[#776848] mb-3">Your Message</label>
                <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell me about your story..." required rows={5} className="w-full bg-transparent border-0 border-b border-black/20 text-black placeholder:text-black/40 focus:border-[#776848] focus-visible:ring-0 rounded-none text-lg font-body resize-none" />
              </div>
              <button type="submit" className="font-display text-2xl text-[#776848] link-underline smooth-hover">SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// LIGHTBOX
// ============================================
function Lightbox({ photos, initialIndex, onClose }: { photos: Photo[]; initialIndex: number; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrentIndex((p) => (p + 1) % photos.length)
      if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p - 1 + photos.length) % photos.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey) }
  }, [onClose, photos.length])

  const photo = photos[currentIndex]
  if (!photo) return null

  return (
    <div className="fixed inset-0 z-[200] bg-[#090C10]/98 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 z-50 text-[#F6EFE5] hover:text-[#776848] transition-colors smooth-hover" aria-label="Close"><X size={32} /></button>
      <div className="absolute top-6 left-6 z-50"><span className="font-body text-xs tracking-luxe uppercase text-[#776848]">{String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span></div>
      {photos.length > 1 && (
        <>
          <button onClick={() => setCurrentIndex((p) => (p - 1 + photos.length) % photos.length)} className="absolute left-6 z-40 text-[#F6EFE5] hover:text-[#776848] transition-colors text-3xl smooth-hover" aria-label="Previous">←</button>
          <button onClick={() => setCurrentIndex((p) => (p + 1) % photos.length)} className="absolute right-6 z-40 text-[#F6EFE5] hover:text-[#776848] transition-colors text-3xl smooth-hover" aria-label="Next">→</button>
        </>
      )}
      <img src={photo.src} alt={photo.alt} className="max-w-full max-h-[85vh] object-contain animate-scale-in" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"><p className="font-display text-lg text-[#F6EFE5] italic">{photo.alt}</p></div>
    </div>
  )
}

// ============================================
// MAIN CLIENT COMPONENT
// ============================================
interface PortfolioClientProps {
  weddingPhotos: Photo[]
  babyPhotos: Photo[]
  newbornPhotos: Photo[]
  portfolioItems: Photo[]
  homepagePhotos: {
    heroBackground: Photo | null; artForHeart: Photo | null; photoGrid1: Photo | null; photoGrid2: Photo | null; photoGrid3: Photo | null; photoGrid4: Photo | null; photoGrid5: Photo | null; photoGrid6: Photo | null; realLovers1: Photo | null; realLovers2: Photo | null; realLovers3: Photo | null; realLovers4: Photo | null; footerBackground: Photo | null
  }
}

export default function PortfolioClient({ weddingPhotos, babyPhotos, newbornPhotos, portfolioItems, homepagePhotos }: PortfolioClientProps) {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const navigateTo = (page: PageType) => {
    setCurrentPage(page)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <PhotosContext.Provider value={{ weddingPhotos, babyPhotos, newbornPhotos, portfolioItems, homepagePhotos }}>
      <div className="min-h-screen bg-[#BFB9B0]">
        <Header onMenuClick={() => setMenuOpen(true)} navigateTo={navigateTo} />
        <DrawerNav open={menuOpen} onClose={() => setMenuOpen(false)} navigateTo={navigateTo} currentPage={currentPage} />
        <main key={currentPage} className="page-transition">
          {currentPage === 'home' && (
            <>
              <Hero navigateTo={navigateTo} />
              <ArtForHeart navigateTo={navigateTo} />
              <PhotoGrid />
              <CoffeeBribes navigateTo={navigateTo} />
              <LoveLetters />
              <LetsTalk navigateTo={navigateTo} />
              <RealLovers navigateTo={navigateTo} />
              <SocialButterfly />
            </>
          )}
          {currentPage === 'portfolio' && <PortfolioPage navigateTo={navigateTo} />}
          {currentPage === 'wedding' && <GalleryPage title="WEDDING" subtitle="Eternal love stories, artfully captured. Each frame preserves the emotions, rituals, and intimate moments of your most sacred day." photos={weddingPhotos} navigateTo={navigateTo} backTo="home" />}
          {currentPage === 'baby' && <GalleryPage title="BABY" subtitle="Innocent joy, captured forever. From first smiles to curious eyes, these are the moments that melt hearts." photos={babyPhotos} navigateTo={navigateTo} backTo="home" />}
          {currentPage === 'newborn' && <GalleryPage title="NEWBORN" subtitle="First breath, first moments. Tender, timeless art that celebrates the miracle of new life." photos={newbornPhotos} navigateTo={navigateTo} backTo="home" />}
          {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
          {currentPage === 'investment' && <InvestmentPage navigateTo={navigateTo} />}
          {currentPage === 'contact' && <ContactPage navigateTo={navigateTo} />}
        </main>
        <Footer navigateTo={navigateTo} />
        <Toaster />
      </div>
    </PhotosContext.Provider>
  )
}
