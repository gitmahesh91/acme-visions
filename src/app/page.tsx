import fs from 'fs'
import path from 'path'
import PortfolioClient from './PortfolioClient'
import type { Photo } from '@/lib/photos'

function getPhotosFromFolder(folder: string, category?: string): Photo[] {
  const dir = path.join(process.cwd(), 'public', 'images', folder)
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()
  return files.map((file, index) => ({
    src: `/images/${folder}/${file}`,
    alt: file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/^\d+\s*/, '').trim() || `${folder} photo ${index + 1}`,
    featured: index === 0,
    category,
  }))
}

function getNamedPhoto(filename: string, fallbackFolder?: string, fallbackIndex?: number): Photo | null {
  const homepageDir = path.join(process.cwd(), 'public', 'images', 'homepage')
  const filePath = path.join(homepageDir, filename)
  if (fs.existsSync(filePath)) {
    return {
      src: `/images/homepage/${filename}`,
      alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/^\d+\s*/, '').trim(),
    }
  }
  if (fallbackFolder && fallbackIndex !== undefined) {
    const fallback = getPhotosFromFolder(fallbackFolder)
    if (fallback.length > 0) return fallback[Math.min(fallbackIndex, fallback.length - 1)]
  }
  return null
}

export default async function Page() {
  const weddingPhotos = getPhotosFromFolder('wedding', 'Wedding')
  const babyPhotos = getPhotosFromFolder('baby', 'Baby')
  const newbornPhotos = getPhotosFromFolder('newborn', 'Newborn')
  const portfolioFiles = getPhotosFromFolder('portfolio')
  const portfolioCategories = ['Portrait', 'Event', 'Wedding', 'Newborn', 'Baby']
  const portfolioItems: Photo[] = portfolioFiles.map((photo, index) => ({
    ...photo,
    featured: false,
    category: portfolioCategories[index % portfolioCategories.length],
  }))

  const homepagePhotos = {
    heroBackground: getNamedPhoto('01-hero-background.JPG', 'wedding', 0),
    artForHeart: getNamedPhoto('02-art-for-heart.JPG', 'newborn', 0),
    photoGrid1: getNamedPhoto('03-photo-grid-1.JPG', 'wedding', 1),
    photoGrid2: getNamedPhoto('04-photo-grid-2.JPG', 'portfolio', 0),
    photoGrid3: getNamedPhoto('05-photo-grid-3.JPG', 'newborn', 1),
    photoGrid4: getNamedPhoto('06-photo-grid-4.JPG', 'baby', 0),
    photoGrid5: getNamedPhoto('07-photo-grid-5.JPG', 'wedding', 4),
    photoGrid6: getNamedPhoto('08-photo-grid-6.JPG', 'portfolio', 2),
    realLovers1: getNamedPhoto('09-real-lovers-1.JPG', 'wedding', 2),
    realLovers2: getNamedPhoto('10-real-lovers-2.JPG', 'newborn', 3),
    realLovers3: getNamedPhoto('11-real-lovers-3.JPG', 'baby', 2),
    realLovers4: getNamedPhoto('12-real-lovers-4.JPG', 'portfolio', 3),
    footerBackground: getNamedPhoto('13-footer-background.JPG', 'wedding', 5),
  }

  return (
    <PortfolioClient
      weddingPhotos={weddingPhotos}
      babyPhotos={babyPhotos}
      newbornPhotos={newbornPhotos}
      portfolioItems={portfolioItems}
      homepagePhotos={homepagePhotos}
    />
  )
}
