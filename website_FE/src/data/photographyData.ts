import { Photo, GearItem, Milestone, Testimonial, ProjectPackage, ProofGallery } from '../types';

export const PHOTOGRAPHER_NAME = "Creative KG";
export const PHOTOGRAPHER_TITLE = "Style Solution | Films | Art";
export const PHOTOGRAPHER_BIO = "Creative KG is a premier multidisciplinary visual arts and cinematic production studio based in New York City, working worldwide. Specializing in high-end style solutions, film productions, and fine art photography, Creative KG has spent over a decade shaping a signature aesthetic characterized by dramatic, natural lighting, deep cinematic tones, and meticulous composition. Our work spans high-fashion editorial projects, custom cinematic films, elegant portraits, and conceptual fine art. Creative KG's collections have been showcased in global galleries and leading publications, offering a modern vision that goes beyond capturing a scene to reveal a powerful narrative and emotional truth.";

export const PHOTOS: Photo[] = [
  // Portrait Category
  {
    id: 'p1',
    title: 'Elowen in Neon',
    description: 'A striking studio portrait utilizing neon pink and deep amber cross-lighting to highlight skin contours and emotional gaze.',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'vibrant',
    tags: ['studio', 'neon', 'cross-lighting', 'female', 'gaze'],
    location: 'Brooklyn Studio, NY',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 85mm f/1.2 GM',
      shutterSpeed: '1/160s',
      aperture: 'f/1.4',
      iso: '100',
      focalLength: '85mm'
    }
  },
  {
    id: 'p2',
    title: 'Warm Golden Hour Gaze',
    description: 'Intimate portrait taken on a wind-swept dune in the late afternoon. The direct golden hour rays bring out warm facial highlights.',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'warm',
    tags: ['golden hour', 'natural light', 'outdoor', 'male', 'sandy'],
    location: 'Amagansett Dunes, NY',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 50mm f/1.2 GM',
      shutterSpeed: '1/800s',
      aperture: 'f/1.8',
      iso: '100',
      focalLength: '50mm'
    }
  },
  {
    id: 'p3',
    title: 'Vulnerability of Youth',
    description: 'An elegant outdoor portrait using extremely shallow depth of field. Natural, diffused light filters through a canopy of green.',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'muted',
    tags: ['diffused light', 'nature', 'bokeh', 'female', 'emotive'],
    location: 'Central Park, NY',
    year: 2026,
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 110mm f/2 R LM WR',
      shutterSpeed: '1/250s',
      aperture: 'f/2.0',
      iso: '200',
      focalLength: '110mm'
    }
  },
  {
    id: 'p4',
    title: 'The Craftsman',
    description: 'A moody, low-key indoor portrait spotlighting an artisan in his natural environment. Warm, yellow lamp glows reflect off dark wooden surfaces.',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200',
    aspectRatio: '1:1',
    orientation: 'square',
    colorPalette: 'warm',
    tags: ['indoor', 'low-key', 'craftsman', 'male', 'cinematic'],
    location: 'SoHo Woodshop, NY',
    year: 2024,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 35mm f/1.4 GM',
      shutterSpeed: '1/80s',
      aperture: 'f/1.4',
      iso: '400',
      focalLength: '35mm'
    }
  },
  {
    id: 'p5',
    title: 'Studio Monolith',
    description: 'High-contrast studio shot focusing purely on elegant posture and deep shadows, exploring the intersection of clothing drapery and bodily form.',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'monochrome',
    tags: ['studio', 'shadows', 'high contrast', 'monochrome', 'female'],
    location: 'Manhattan Studio, NY',
    year: 2025,
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 110mm f/2 R LM WR',
      shutterSpeed: '1/125s',
      aperture: 'f/4.0',
      iso: '100',
      focalLength: '110mm'
    }
  },

  // Wedding Category
  {
    id: 'w1',
    title: 'Laughter Under Twilight',
    description: 'A candid capture of a newlywed couple laughing as the sun dips below the horizon, bathing the coastline in rich magenta and peach tones.',
    category: 'wedding',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'warm',
    tags: ['candid', 'coastal', 'twilight', 'couple', 'sunset'],
    location: 'Newport Cliffs, RI',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 50mm f/1.2 GM',
      shutterSpeed: '1/500s',
      aperture: 'f/1.2',
      iso: '160',
      focalLength: '50mm'
    }
  },
  {
    id: 'w2',
    title: 'Elegance Manifest',
    description: 'A stunning close-up of the bride adjustng her veil. Soft, high-key light coming from a nearby French window illuminates the intricate lace.',
    category: 'wedding',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'cool',
    tags: ['bride', 'veil', 'detail', 'lace', 'window-light'],
    location: 'Biltmore Estate, NC',
    year: 2026,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 85mm f/1.2 GM',
      shutterSpeed: '1/200s',
      aperture: 'f/1.6',
      iso: '200',
      focalLength: '85mm'
    }
  },
  {
    id: 'w3',
    title: 'The Silent Detail',
    description: 'A delicate macro-style shot showing the heirloom diamond rings placed among freshly cut local peonies.',
    category: 'wedding',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200',
    aspectRatio: '1:1',
    orientation: 'square',
    colorPalette: 'muted',
    tags: ['macro', 'rings', 'details', 'florals', 'textures'],
    location: 'Hudson Valley Barn, NY',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 90mm f/2.8 Macro G OSS',
      shutterSpeed: '1/100s',
      aperture: 'f/4.0',
      iso: '250',
      focalLength: '90mm'
    }
  },
  {
    id: 'w4',
    title: 'Sparklers In the Air',
    description: 'A spectacular celebratory departure. Hundreds of glowing sparklers illuminate the happy couple as they exit the heritage villa.',
    category: 'wedding',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'warm',
    tags: ['sparklers', 'night', 'departure', 'celebration', 'candid'],
    location: 'Vanderbilt Mansion, NY',
    year: 2024,
    exif: {
      camera: 'Sony Alpha 7S III',
      lens: 'FE 24mm f/1.4 GM',
      shutterSpeed: '1/125s',
      aperture: 'f/1.4',
      iso: '1600',
      focalLength: '24mm'
    }
  },
  {
    id: 'w5',
    title: 'An Emotional Toast',
    description: 'A warm, black-and-white candid photo showing tears of laughter and joy from guests during the maid of honor speech.',
    category: 'wedding',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'monochrome',
    tags: ['black-and-white', 'candid', 'guests', 'emotional', 'reception'],
    location: 'The Foundry, Brooklyn, NY',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 50mm f/1.2 GM',
      shutterSpeed: '1/160s',
      aperture: 'f/1.2',
      iso: '800',
      focalLength: '50mm'
    }
  },

  // Editorial Category
  {
    id: 'e1',
    title: 'Tokyo Rain Reflection',
    description: 'A highly cinematic street editorial capturing neon signs reflecting in deep rain puddles as a model traverses the empty crossings of Shinjuku.',
    category: 'editorial',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
    aspectRatio: '16:9',
    orientation: 'landscape',
    colorPalette: 'vibrant',
    tags: ['street', 'neon', 'rain', 'tokyo', 'cinematic', 'night'],
    location: 'Shinjuku, Tokyo',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 35mm f/1.4 GM',
      shutterSpeed: '1/100s',
      aperture: 'f/1.4',
      iso: '640',
      focalLength: '35mm'
    }
  },
  {
    id: 'e2',
    title: 'The Brutalist Scale',
    description: 'A dramatic architectural portrait set in a concrete monument. Deep black shadows contrast starkly with illuminated structural curves.',
    category: 'editorial',
    url: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'monochrome',
    tags: ['architecture', 'brutalist', 'monochrome', 'high-contrast', 'shadows'],
    location: 'Barbican Estate, London',
    year: 2024,
    exif: {
      camera: 'Leica M11',
      lens: 'Summilux-M 28mm f/1.4 ASPH',
      shutterSpeed: '1/320s',
      aperture: 'f/5.6',
      iso: '64',
      focalLength: '28mm'
    }
  },
  {
    id: 'e3',
    title: 'Reflections on the Seine',
    description: 'A dreamy, double-exposure-like image showing high-fashion garments blending seamlessly with the flowing currents of Paris river reflections.',
    category: 'editorial',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'muted',
    tags: ['paris', 'double exposure', 'seine', 'reflections', 'dreamy'],
    location: 'River Seine, Paris',
    year: 2026,
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 63mm f/2.8 R WR',
      shutterSpeed: '1/160s',
      aperture: 'f/2.8',
      iso: '100',
      focalLength: '63mm'
    }
  },
  {
    id: 'e4',
    title: 'The Writer in Isolation',
    description: 'A cinematic room shot capturing light filtering through dust motes in a wooden cabin, evoking a sense of deep solitude and intellectual pursuit.',
    category: 'editorial',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'warm',
    tags: ['indoor', 'solitude', 'dust motes', 'cinematic', 'wood Cabin'],
    location: 'Catskills Forest, NY',
    year: 2025,
    exif: {
      camera: 'Leica M11',
      lens: 'Noctilux-M 50mm f/0.95 ASPH',
      shutterSpeed: '1/60s',
      aperture: 'f/0.95',
      iso: '320',
      focalLength: '50mm'
    }
  },
  {
    id: 'e5',
    title: 'Avant-Garde Silhouette',
    description: 'A conceptual story portrait capturing a bold silhouette against an oversized, bright orange canvas. Exploring color blocking and stark negative space.',
    category: 'editorial',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'vibrant',
    tags: ['silhouette', 'color-block', 'avant-garde', 'negative space', 'studio'],
    location: 'SoHo Loft Studio, NY',
    year: 2026,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 24-70mm f/2.8 GM II',
      shutterSpeed: '1/200s',
      aperture: 'f/8.0',
      iso: '100',
      focalLength: '45mm'
    }
  },

  // Fashion Category
  {
    id: 'f1',
    title: 'The Cosmopolitan Shift',
    description: 'Stunning outdoor high fashion shot capturing a dynamic leap across a modern skyscraper plaza, featuring deep shadows and bold color styling.',
    category: 'fashion',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200',
    aspectRatio: '16:9',
    orientation: 'landscape',
    colorPalette: 'vibrant',
    tags: ['outdoor', 'motion', 'vibrant', 'architecture', 'skyscraper'],
    location: 'Financial District, NY',
    year: 2025,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 24-70mm f/2.8 GM II',
      shutterSpeed: '1/2000s',
      aperture: 'f/2.8',
      iso: '200',
      focalLength: '24mm'
    }
  },
  {
    id: 'f2',
    title: 'Stairway to Haute Couture',
    description: 'High-contrast fashion capture on a spiral concrete stairwell. The sweeping dress flows down the geometry of the architecture.',
    category: 'fashion',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'monochrome',
    tags: ['couture', 'staircase', 'architecture', 'monochrome', 'flow'],
    location: 'TWA Hotel, JFK, NY',
    year: 2025,
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 32-64mm f/4 R LM WR',
      shutterSpeed: '1/125s',
      aperture: 'f/4.0',
      iso: '400',
      focalLength: '32mm'
    }
  },
  {
    id: 'f3',
    title: 'Vogue Cover Mock',
    description: 'Elegant portrait showcasing structured trenchcoat styling against an ivory sandstone column. High contrast shadows create a classical vibe.',
    category: 'fashion',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'warm',
    tags: ['classical', 'trenchcoat', 'sculpture', 'high fashion', 'warm'],
    location: 'Metropolitan Museum, NY',
    year: 2026,
    exif: {
      camera: 'Leica M11',
      lens: 'Apo-Summicron-M 90mm f/2 ASPH',
      shutterSpeed: '1/500s',
      aperture: 'f/2.0',
      iso: '64',
      focalLength: '90mm'
    }
  },
  {
    id: 'f4',
    title: 'Vibrant Desert Couture',
    description: 'A striking juxtaposition of flowing chiffon fashion and structural desert rocks. Soft sunset wind rustling the clothing.',
    category: 'fashion',
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'vibrant',
    tags: ['desert', 'sunset', 'flowing', 'juxtaposition', 'couture'],
    location: 'Joshua Tree, CA',
    year: 2024,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 70-200mm f/2.8 GM OSS II',
      shutterSpeed: '1/400s',
      aperture: 'f/2.8',
      iso: '100',
      focalLength: '135mm'
    }
  },

  // Fine Art Category
  {
    id: 'fa1',
    title: 'Cathedral of Light',
    description: 'A mesmerizing abstract capture of dust and sunbeams piercing the massive gothic arches of an abandoned cathedral. Deeply spiritual and architectural.',
    category: 'fineart',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
    aspectRatio: '3:4',
    orientation: 'portrait',
    colorPalette: 'monochrome',
    tags: ['gothic', 'arches', 'sunbeams', 'abstract', 'spiritual'],
    location: 'Abandoned Abbey, Yorkshire',
    year: 2025,
    exif: {
      camera: 'Phase One IQ4 150MP',
      lens: 'Rodenstock HR Digaron-W 40mm f/4',
      shutterSpeed: '2.5s',
      aperture: 'f/11',
      iso: '50',
      focalLength: '40mm'
    }
  },
  {
    id: 'fa2',
    title: 'Whispering Canopy',
    description: 'Conceptual double-exposure forest study, showing branches echoing like organic lungs. Soft green-gray hues promote tranquility.',
    category: 'fineart',
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'muted',
    tags: ['forest', 'double-exposure', 'trees', 'nature', 'abstract'],
    location: 'Redwood State Park, CA',
    year: 2024,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 50mm f/1.2 GM',
      shutterSpeed: '1/30s',
      aperture: 'f/8.0',
      iso: '100',
      focalLength: '50mm'
    }
  },
  {
    id: 'fa3',
    title: 'Ethereal Monolith',
    description: 'A study of geometric forms and smoke. A stark stone cube enveloped in rising incense smoke under a harsh pinhole light source.',
    category: 'fineart',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
    aspectRatio: '1:1',
    orientation: 'square',
    colorPalette: 'monochrome',
    tags: ['smoke', 'geometric', 'minimal', 'incense', 'shadows'],
    location: 'Studio Fine Art Series',
    year: 2026,
    exif: {
      camera: 'Phase One IQ4 150MP',
      lens: 'Schneider Kreuznach 80mm f/2.8 LS',
      shutterSpeed: '1/200s',
      aperture: 'f/8.0',
      iso: '50',
      focalLength: '80mm'
    }
  },
  {
    id: 'fa4',
    title: 'Oceanic Rhythms No. 12',
    description: 'A long-exposure fine art photograph capturing the hypnotic rise and fall of deep sea rollers under an overcast sky.',
    category: 'fineart',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1200',
    aspectRatio: '16:9',
    orientation: 'landscape',
    colorPalette: 'cool',
    tags: ['long-exposure', 'ocean', 'waves', 'moody', 'minimalist'],
    location: 'Outer Hebrides, Scotland',
    year: 2025,
    exif: {
      camera: 'Phase One IQ4 150MP',
      lens: 'Schneider Kreuznach 150mm f/3.5 LS',
      shutterSpeed: '45s',
      aperture: 'f/16',
      iso: '50',
      focalLength: '150mm'
    }
  },
  {
    id: 'fa5',
    title: 'The Silent Dunes',
    description: 'Minimalistic landscape of desert sand curves creating beautiful abstract black & gold lines at twilight.',
    category: 'fineart',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    aspectRatio: '3:2',
    orientation: 'landscape',
    colorPalette: 'warm',
    tags: ['desert', 'dunes', 'abstract', 'lines', 'shadows'],
    location: 'Namib-Naukluft, Namibia',
    year: 2025,
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 100-200mm f/5.6 R LM OIS GF',
      shutterSpeed: '1/15s',
      aperture: 'f/11',
      iso: '100',
      focalLength: '175mm'
    }
  }
];

export const GEAR_ITEMS: GearItem[] = [
  {
    id: 'g1',
    name: 'Sony Alpha 7R V',
    type: 'camera',
    specs: '61.0 Megapixels | BSI CMOS Sensor',
    description: 'The backbone of our editorial and film productions. The unmatched resolution allows for stunning, print-ready detail and dynamic range.'
  },
  {
    id: 'g2',
    name: 'Phase One IQ4 150MP',
    type: 'camera',
    specs: '151 Megapixels | Medium Format',
    description: 'Reserved exclusively for high-end conceptual fine art series and large-scale print requests. Captures unrivaled dimensional detail.'
  },
  {
    id: 'g3',
    name: 'FE 85mm f/1.2 GM',
    type: 'lens',
    specs: 'Telephoto Prime | f/1.2 Max Aperture',
    description: 'Our primary lens for editorial portraits. Delivers incredibly sharp details on the focal plane with beautiful, creamy background melt.'
  },
  {
    id: 'g4',
    name: 'FE 50mm f/1.2 GM',
    type: 'lens',
    specs: 'Standard Prime | f/1.2 Max Aperture',
    description: 'The absolute workhorse. It lives on our camera body during high-end film stills and urban fashion campaigns.'
  },
  {
    id: 'g5',
    name: 'Leica M11',
    type: 'camera',
    specs: '60 Megapixels | Rangefinder',
    description: 'Our silent companion for candid street and intimate documentary assignments. Highly compact and deeply physical to operate.'
  },
  {
    id: 'g6',
    name: 'Noctilux-M 50mm f/0.95 ASPH',
    type: 'lens',
    specs: 'Ultra-fast Prime | f/0.95 Aperture',
    description: 'A magical lens that draws light out of complete darkness, creating painterly aberrations and dream-like atmospheres.'
  }
];

export const MILESTONES: Milestone[] = [
  {
    year: '2026',
    title: 'Solo Exhibition: Silent Cadence',
    location: 'MoMA PS1, Queens, NY',
    description: 'First solo museum exhibit displaying a collection of large-format fine art landscapes and conceptual silhouettes.'
  },
  {
    year: '2025',
    title: 'International Editorial Studio of the Year',
    location: 'Lucie Awards, New York, NY',
    description: 'Honored with the prestigious Lucie Award for our high-contrast architectural and fashion campaigns in Tokyo and Paris.'
  },
  {
    year: '2024',
    title: 'Cover Story Assignment',
    location: 'Vogue Magazine, Paris Edition',
    description: 'Shot the seasonal autumn cover feature with a focus on dramatic natural lighting and sustainable couture designs.'
  },
  {
    year: '2022',
    title: 'Book Publication: Light & Shadows',
    location: 'Thames & Hudson, London',
    description: 'Monograph documenting ten years of fine art explorations, urban wanderings, and intimate portraitures worldwide.'
  },
  {
    year: '2020',
    title: 'Founding of Creative KG Studio',
    location: 'SoHo, New York, NY',
    description: 'Established a state-of-the-art natural light photography studio and masterclass workshop program.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Alessandra de Luca',
    role: 'Creative Director, Atelier Vogue',
    quote: "Creative KG has an extraordinary ability to sculpt with light and cinema. Their fashion campaigns don't just display garments; they tell rich, cinematic stories that resonate on a deep, artistic level.",
    category: 'Fashion / Editorial',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150'
  },
  {
    id: 't2',
    name: 'Marcus & Eleanor Stirling',
    role: 'Private Art Collectors',
    quote: "Having Creative KG produce our brand campaign and films was the best decision we made. They blended into the background and captured raw, breathtaking, emotional moments we didn't even know happened. Pure artistry.",
    category: 'Wedding',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
  },
  {
    id: 't3',
    name: 'Genevieve Moreau',
    role: 'Gallery Curator, L\'Espace Moderne Paris',
    quote: "Creative KG's fine art prints and films are a masterclass in tone and restraint. Their work commands a quiet, meditative presence in our gallery, with collectors constantly asking for more archival works.",
    category: 'Fine Art',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
  }
];

export const PACKAGES: ProjectPackage[] = [
  {
    id: 'pkg1',
    name: 'Fine Art Portraiture',
    description: 'An intimate, cinematic portrait session exploring character and light in a controlled studio or bespoke natural setting.',
    priceRange: '$1,500 - $3,000',
    deliverables: [
      '3-hour custom styled photoshoot',
      'Location styling and moodboard consultation',
      '15 meticulously hand-retouched fine art digital files',
      '2 museum-quality giclée master prints (signed)'
    ],
    duration: 'Half Day',
    idealFor: 'Artists, executives, actors, or individuals seeking a legacy visual record.'
  },
  {
    id: 'pkg2',
    name: 'Editorial Campaign',
    description: 'High-concept fashion or commercial visual storytelling designed for luxury brands, lookbooks, or magazine publications.',
    priceRange: '$5,000 - $12,000+',
    deliverables: [
      'Full production crew assembly (stylist, MUA assistance)',
      'Pre-production concept and location scouting',
      'Full-day shoot (up to 4 unique garment changes / storylines)',
      'All raw catalog for proofing, 40 premium retouched master files',
      'Full commercial publication rights license'
    ],
    duration: '1-2 Days',
    idealFor: 'Fashion labels, designers, editors, and lifestyle luxury brands.'
  },
  {
    id: 'pkg3',
    name: 'Candid Wedding of Distinction',
    description: 'Timeless, documentary-led photographic storytelling of your wedding day, focusing on genuine emotion, light, and architectural grace.',
    priceRange: '$6,500 - $15,000',
    deliverables: [
      'Up to 10 hours of continuous high-resolution coverage by Creative KG crew',
      'Complementary golden hour pre-wedding connection shoot',
      'Digital archive of 450+ fully graded and hand-finished high-res files',
      'Private online gallery with client proofing & family sharing portal',
      'Premium linen-bound, hand-crafted Italian wedding album (80 pages)'
    ],
    duration: 'Full Wedding Day',
    idealFor: 'Couples seeking sophisticated, natural, and timeless artistic memories.'
  }
];

export const DEFAULT_CLIENTS: import('../types').ClientAccount[] = [
  {
    id: 'client_1',
    name: 'Charlotte & William',
    email: 'charlotte@example.com',
    phone: '+233 24 555 0199',
    passcode: 'client2026',
    shootTitle: 'Summer Nuptials at Newport',
    shootType: 'wedding',
    eventDate: 'June 14, 2026',
    packagePrice: 3500,
    currency: 'GHS',
    isLocked: false,
    paymentStatus: 'paid',
    payments: [
      {
        id: 'pay_1',
        amount: 3500,
        currency: 'GHS',
        method: 'mobile_money',
        networkProvider: 'MTN',
        momoPhoneNumber: '+233 24 555 0199',
        transactionReference: 'PAYSTACK_MOMO_884920194',
        paidAt: '2026-06-15T14:30:00.000Z',
        recordedBy: 'client',
        receiptNumber: 'CKG-INV-2026-001',
        notes: 'Full payment received via MTN MoMo'
      }
    ],
    createdAt: '2026-06-10T10:00:00.000Z'
  },
  {
    id: 'client_2',
    name: 'Kofi & Abena Mensah',
    email: 'kofi.mensah@example.com',
    phone: '+233 50 123 4567',
    passcode: 'mensah2026',
    shootTitle: 'Luxury Traditional & White Wedding',
    shootType: 'wedding',
    eventDate: 'August 22, 2026',
    packagePrice: 4800,
    currency: 'GHS',
    isLocked: true,
    paymentStatus: 'unpaid',
    payments: [],
    createdAt: '2026-08-15T09:30:00.000Z'
  },
  {
    id: 'client_3',
    name: 'Elena Rostova',
    email: 'elena.rostova@voguemag.com',
    phone: '+233 27 789 0123',
    passcode: 'elena2026',
    shootTitle: 'Autumn High-Fashion Editorial',
    shootType: 'fashion',
    eventDate: 'July 05, 2026',
    packagePrice: 2800,
    currency: 'GHS',
    isLocked: true,
    paymentStatus: 'partial',
    payments: [
      {
        id: 'pay_2',
        amount: 1400,
        currency: 'GHS',
        method: 'bank_transfer',
        transactionReference: 'BANK_TRANS_9901823',
        paidAt: '2026-07-06T11:15:00.000Z',
        recordedBy: 'admin',
        receiptNumber: 'CKG-INV-2026-002',
        notes: '50% Initial shoot deposit paid'
      }
    ],
    createdAt: '2026-07-01T12:00:00.000Z'
  }
];

export const DEFAULT_SYSTEM_SETTINGS: import('../types').SystemSettings = {
  // Branding & SEO
  websiteName: 'Creative KG',
  websiteLogo: '',
  websiteFavicon: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=64&auto=format&fit=crop&q=80',
  seoTitle: 'Creative KG | Luxury Editorial, Portrait & Wedding Photography Studio',
  seoDescription: 'Award-winning visual artistry, cinematic wedding documentaries, high-fashion editorials, and timeless portraiture by Creative KG.',
  seoKeywords: 'photography studio, wedding photographer, luxury editorial, fine art portraits, Accra, global',
  ogImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200',
  activeTheme: 'amber',

  // Google Account & Drive Integration
  isGoogleDriveConnected: false,
  googleAccountEmail: '',
  googleAccountName: '',
  googleDriveFolderRoot: 'Creative KG Master Cloud Vault',
  googleDriveFolders: [
    'General Master Archive',
    'Portraits & Headshots',
    'Weddings 2026',
    'Fashion & Runways',
    'Editorial Client Deliveries'
  ],
  autoBackupToDrive: true,

  paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  paystackSecretKey: '',
  paystackCurrency: (import.meta.env.VITE_PAYSTACK_CURRENCY as 'GHS' | 'USD' | 'NGN') || 'GHS',
  paystackMode: 'test',
  arkeselApiKey: import.meta.env.VITE_ARKESEL_API_KEY || 'sample_arkesel_api_key_creativekg',
  arkeselSenderId: import.meta.env.VITE_ARKESEL_SENDER_ID || 'CREATIVE-KG',
  smsTemplates: {
    paymentReceived: 'Dear {clientName}, we have received your payment of {currency} {amount} for {shootTitle}. Invoice: {invoiceNumber}. Thank you for choosing {studioName}!',
    galleryUnlocked: 'Hello {clientName}, your private high-resolution gallery for {shootTitle} has been UNLOCKED! You can now download your master photos using passcode: {passcode}.',
    welcomeClient: 'Welcome {clientName}! Your private proofing vault with {studioName} has been created. Access passcode: {passcode}.'
  },
  studioName: import.meta.env.VITE_STUDIO_NAME || 'Creative KG Studios',
  studioPhone: import.meta.env.VITE_STUDIO_PHONE || '+233 24 555 0199',
  studioEmail: import.meta.env.VITE_STUDIO_EMAIL || 'studio@creativekg.com',
  studioAddress: import.meta.env.VITE_STUDIO_ADDRESS || 'Airport Residential Area, Accra, Ghana',
  invoicePrefix: import.meta.env.VITE_INVOICE_PREFIX || 'CKG-INV-',
  momoMerchantNumber: '+233 24 555 0199 (Creative KG Studios)',
  adminPasscode: import.meta.env.VITE_ADMIN_PASSCODE || 'admin123',
  superAdminPasscode: import.meta.env.VITE_SUPER_ADMIN_PASSCODE || 'Jay1224',
  editorPasscode: import.meta.env.VITE_EDITOR_PASSCODE || 'editor123'
};

export const MOCK_PROOF_GALLERY: ProofGallery = {
  id: 'proof-1',
  passcode: 'client2026',
  clientName: 'Charlotte & William',
  eventDate: 'June 14, 2026',
  title: 'Charlotte & William - Summer Nuptials at Newport',
  description: 'Welcome to your private online proofing gallery. Please view your curated wedding collection, click the heart icon on your absolute favorites to compile your heirloom album list, and write notes or feedback on specific images.',
  photos: [
    {
      id: 'proof-p1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
      title: 'Ocean cliffs walk at twilight',
      isFavorite: true,
      notes: 'Love the wind in my dress here! Absolute cover choice.'
    },
    {
      id: 'proof-p2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
      title: 'Veil adjustment candid',
      isFavorite: false
    },
    {
      id: 'proof-p3',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200',
      title: 'Wedding bands in floral detail',
      isFavorite: false
    },
    {
      id: 'proof-p4',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200',
      title: 'Sparklers entrance departure',
      isFavorite: true,
      notes: 'Can we check if the light on William\'s face is sharp?'
    }
  ]
};

export const DEFAULT_SITE_CONTENT: import('../types').SiteContent = {
  heroBadge: "Creative KG",
  heroTitle: "Archival Medium Format Photography",
  heroSubtitle: "Style Solution | Films | Art",
  heroDescription: "Capturing fleeting human emotion through high-fashion editorial, intimate portraits, and timeless medium format prints.",
  showcaseHeading: "Featured Medium Formats",
  showcaseSubheading: "Archival Masterworks",
  aboutStudioBadge: "The Studio",
  aboutStudioTitle: "Creative KG",
  aboutPhotographerTitle: "Style Solution | Films | Art",
  aboutBio: PHOTOGRAPHER_BIO,
  aboutMainBase: "New York City, NY",
  aboutRepresentation: "L'Espace Agency, Paris",
  aboutCoreLenses: "50mm f/1.2 & 85mm f/1.2 Prime",
  aboutMediumFormat: "Phase One IQ4 150MP",
  gearBagHeading: "Interactive Gear Bag Explorer",
  gearBagDescription: "Every photograph is bounded by the optical tool that resolves it. Select an item below to see detailed tech specifications and creative rationale.",
  footerTagline: "Archival Masterworks & Fine Art Visuals",
  footerAddress: "Airport Residential Area, Accra, Ghana • New York City, NY",
  categoryTitles: {
    portrait: "The Human Element & Striking Character",
    wedding: "Heirloom Memories & Nuptial Romance",
    editorial: "Cinematic Chronicles & Narrative Scenes",
    fashion: "Haute Couture, Form & Dynamic Light",
    fineart: "Poetic Solitude, Textures & Abstract Silence"
  },
  categoryIntros: {
    portrait: "Fine art character studies capturing the raw essence, delicate vulnerability, and timeless poise of the human spirit in controlled and ambient lighting.",
    wedding: "Documenting real connections and heirloom celebrations of love. These are timeless records capturing fleeting emotional expressions, delicate couture laces, and the grand atmospheric details of historic wedding locations.",
    editorial: "Visual storytelling tailored for global publications, record covers, and cultural narratives. Rich in cinematic mood, nuanced details, and deep environmental framing.",
    fashion: "High-impact visual statements celebrating modern apparel design, innovative movement, and cutting-edge lighting techniques for luxury brands and runway houses.",
    fineart: "Introspective visual explorations focusing on pure aesthetics, organic architectural textures, monochrome minimalism, and museum-grade gallery editions."
  }
};

export const DEFAULT_BOOKING_TYPES: import('../types').BookingType[] = [
  {
    id: 'weddings',
    name: 'Weddings of Distinction',
    slug: 'weddings',
    startingPrice: 4500,
    currency: 'USD',
    badge: 'Signature Experience',
    description: 'Cinematic, timeless celebration of love and legacy. Multi-camera coverage, aerial cinema, and museum-grade master albums.',
    active: true,
    packages: [
      {
        id: 'w-pkg-silver',
        name: 'Silver Heritage',
        price: 3500,
        duration: '6 Hours Live Coverage',
        deliverables: [
          '350+ Hand-Retouched High-Res Photos',
          'Private Online Client Vault (1 Year)',
          '1 Lead Master Photographer',
          'High-Resolution Print Release',
          'Digital Sneak Peek within 48 Hours'
        ],
        description: 'Ideal for intimate ceremonies, registry weddings, and boutique gatherings.',
        isPopular: false
      },
      {
        id: 'w-pkg-gold',
        name: 'Gold Legacy',
        price: 5500,
        duration: '10 Hours Full-Day Coverage',
        deliverables: [
          '650+ Master Retouched Photos',
          '2 Photographers (Lead + Associate)',
          'Licensed 4K Aerial Drone Coverage',
          '12x12 Handcrafted Italian Leather Album',
          'Online VIP Client Vault + USB Archive Box',
          'Rush 24-Hour Editorial Sneak Peek'
        ],
        description: 'Our most sought-after full-day wedding experience preserving every emotional detail.',
        isPopular: true
      },
      {
        id: 'w-pkg-royal',
        name: 'Royal Bespoke',
        price: 8500,
        duration: 'Multi-Day / Weekend Nuptials',
        deliverables: [
          'Rehearsal Dinner + Full Day + Morning Brunch',
          '3 Master Photographers + Cinema Director',
          'Full 4K Cinematic Highlight Reel',
          'Two 12x12 Heirloom Parent Albums + 1 Master Album',
          'Unlimited Fine Art Archival Retouching',
          'Private Gallery with Unlimited Lifetime Hosting'
        ],
        description: 'Bespoke multi-day celebration coverage for luxury destinations and large estates.',
        isPopular: false
      }
    ]
  },
  {
    id: 'birthdays',
    name: 'Birthday Celebrations & Milestones',
    slug: 'birthdays',
    startingPrice: 1200,
    currency: 'USD',
    badge: 'High Demand',
    description: 'Unforgettable milestone portraits and high-energy celebration coverage for birthdays, sweet 16s, 30th/50th jubilees, and anniversaries.',
    active: true,
    packages: [
      {
        id: 'b-pkg-studio',
        name: 'Studio Birthday Editorial',
        price: 950,
        duration: '2 Hours In-Studio',
        deliverables: [
          '20 Master Editorial Retouches',
          '3 Wardrobe / Look Changes',
          'Curated Studio Lighting & Backdrops',
          'Private Online Selection Vault',
          '1x 16x20 Archival Fine Art Print'
        ],
        description: 'Chic, high-fashion portrait session to celebrate your personal milestone in style.',
        isPopular: false
      },
      {
        id: 'b-pkg-party',
        name: 'Celebration Soirée',
        price: 1600,
        duration: '4 Hours Event Coverage',
        deliverables: [
          '175+ Curated Retouched Images',
          'Red Carpet / Step & Repeat Arrivals',
          'Candid Party Action & Toast Highlights',
          'Online Client Vault for Guest Downloads',
          'Next-Day Social Media Highlight Reel'
        ],
        description: 'Complete party documentation capturing the laughter, atmosphere, and energy of your guests.',
        isPopular: true
      },
      {
        id: 'b-pkg-jubilee',
        name: 'VIP Jubilee Gala',
        price: 2800,
        duration: '6 Hours Full Gala Coverage',
        deliverables: [
          '350+ Master Color-Graded Photos',
          '2 Photographers (Candid + Step & Repeat)',
          'Instant Same-Night Sneak Peek (20 Photos)',
          'Custom 10x10 Hardcover Commemorative Book',
          'Private VIP Vault with Client Passcode'
        ],
        description: 'Comprehensive luxury coverage for grand milestone galas and luxury birthday celebrations.',
        isPopular: false
      }
    ]
  },
  {
    id: 'parties',
    name: 'Parties, Galas & VIP Events',
    slug: 'parties',
    startingPrice: 1800,
    currency: 'USD',
    badge: 'Exclusive',
    description: 'Atmospheric, editorial documentation for private luxury dinners, corporate anniversaries, charity galas, and rooftop soirées.',
    active: true,
    packages: [
      {
        id: 'p-pkg-dinner',
        name: 'Cocktail & Intimate Dinner',
        price: 1400,
        duration: '3 Hours Coverage',
        deliverables: [
          '120+ High-Resolution Master Photos',
          'Atmospheric Ambience & Gourmet Details',
          'Private Client Vault with Direct Downloads',
          '48-Hour Delivery Turnaround'
        ],
        description: 'Designed for private estate dinners, cocktail launches, and boutique gatherings.',
        isPopular: false
      },
      {
        id: 'p-pkg-gala',
        name: 'Grand Gala & Premiere',
        price: 2500,
        duration: '6 Hours Coverage',
        deliverables: [
          '300+ Editorial Master Photos',
          'Step & Repeat Media Wall Coverage',
          'Stage Speeches, Awards & Candid Moments',
          'Same-Night Press/PR Export (10 Photos)',
          'Private Online Archive'
        ],
        description: 'Elite visual coverage for luxury charity balls, fashion galas, and corporate celebrations.',
        isPopular: true
      },
      {
        id: 'p-pkg-weekend',
        name: 'Multi-Day VIP Retreat',
        price: 4800,
        duration: 'Full Weekend (Up to 14 Hours)',
        deliverables: [
          '600+ Archival Photos Across All Events',
          '2 Dedicated Photographers',
          'Aerial Drone Overviews',
          '4K Social Media Highlight Reel',
          'Luxe Custom Hardcover Photo Album'
        ],
        description: 'All-inclusive documentation for destination weekend parties and executive summits.',
        isPopular: false
      }
    ]
  },
  {
    id: 'portraits',
    name: 'Fine Art & Studio Portraits',
    slug: 'portraits',
    startingPrice: 850,
    currency: 'USD',
    badge: 'Archival Medium Format',
    description: 'Intimate, museum-grade fine art portraiture in studio or on location with curated lighting and creative direction.',
    active: true,
    packages: [
      {
        id: 'port-pkg-signature',
        name: 'Creative Signature',
        price: 850,
        duration: '90 Minutes In Studio',
        deliverables: [
          '15 Master Hand-Finished Retouches',
          '2 Outfit Variations',
          'Creative Moodboard & Posing Direction',
          'High-Res Commercial & Personal Print License'
        ],
        description: 'Perfect for artists, executives, models, and personal creative portraits.',
        isPopular: false
      },
      {
        id: 'port-pkg-editorial',
        name: 'Editorial Portfolio',
        price: 1400,
        duration: '3 Hours Studio & Location',
        deliverables: [
          '35 Master High-Resolution Retouches',
          '4 Distinct Wardrobe & Styling Concepts',
          '1x 16x24 Giclée Cotton Archival Print',
          'Private Online Client Vault with Full High-Res'
        ],
        description: 'A comprehensive visual portfolio session for creators, actors, and fashion portfolios.',
        isPopular: true
      },
      {
        id: 'port-pkg-couture',
        name: 'Couture Fine Art Masterpiece',
        price: 2200,
        duration: 'Full-Day Studio Session',
        deliverables: [
          '60 Medium-Format Master Retouches',
          'Custom Set Styling & Lighting Concept',
          'Hair & Makeup Artist Included',
          '24x36 Museum Framed Canvas Masterprint',
          'Lifetime Archival Cloud Vault'
        ],
        description: 'The ultimate bespoke portrait experience with Phase One medium format resolution.',
        isPopular: false
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial & Fashion Campaigns',
    slug: 'commercial',
    startingPrice: 3200,
    currency: 'USD',
    badge: 'Lookbooks & Ads',
    description: 'High-impact visual campaigns for luxury fashion labels, jewelry houses, architectural developments, and editorial brands.',
    active: true,
    packages: [
      {
        id: 'c-pkg-lookbook',
        name: 'Brand Lookbook',
        price: 3200,
        duration: 'Half Day (4-5 Hours)',
        deliverables: [
          '40 Fully Graded High-Res Campaign Frames',
          'Model Casting & Location Guidance',
          'Commercial Usage & Print Rights (1 Year)',
          'E-Commerce Crop Ready Exports'
        ],
        description: 'Streamlined editorial lookbook production for seasonal collections and designers.',
        isPopular: false
      },
      {
        id: 'c-pkg-campaign',
        name: 'Global Hero Campaign',
        price: 6500,
        duration: 'Full Day (8-10 Hours)',
        deliverables: [
          '80+ Master Retouched Campaign Visuals',
          'Full Lighting Crew & Technical Assistant',
          'Worldwide Digital & Print Advertising Rights',
          'Billboard-Resolution Medium Format Files',
          '48-Hour Rush Deliverables'
        ],
        description: 'High-production value campaign visuals for national and global brand rollouts.',
        isPopular: true
      }
    ]
  }
];

export const DEFAULT_HERO_SLIDES: import('../types').HeroSlide[] = [
  {
    id: 'slide-1',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1920',
    badge: 'Archival Medium Format Photography',
    title: 'Light, Emotion & Timeless Form',
    subtitle: 'Preserving human intimacy and modern couture through Phase One medium format resolution and museum-grade masterprints.',
    primaryCtaText: 'Reserve Your Session',
    primaryCtaAction: 'contact',
    secondaryCtaText: 'Explore Master Galleries',
    secondaryCtaAction: 'gallery',
    alignment: 'center',
    overlayOpacity: 0.45
  },
  {
    id: 'slide-2',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920',
    badge: 'Weddings & Celebrations of Distinction',
    title: 'Heirloom Nuptials & Sacred Memories',
    subtitle: 'Capturing fleeting glances, couture gowns, and timeless celebrations with poetic sensitivity and cinematic poise.',
    primaryCtaText: 'Reserve Your Wedding Date',
    primaryCtaAction: 'contact',
    secondaryCtaText: 'View Wedding Folio',
    secondaryCtaAction: 'wedding',
    alignment: 'center',
    overlayOpacity: 0.4
  },
  {
    id: 'slide-3',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920',
    badge: 'Haute Couture & Fine Art Editorial',
    title: 'The Poetry of Modern Fashion',
    subtitle: 'High-contrast silhouettes, sculptural lighting, and bold visual storytelling crafted for discerning global publications.',
    primaryCtaText: 'Book Editorial Shoot',
    primaryCtaAction: 'contact',
    secondaryCtaText: 'Fashion Archive',
    secondaryCtaAction: 'fashion',
    alignment: 'center',
    overlayOpacity: 0.4
  }
];


