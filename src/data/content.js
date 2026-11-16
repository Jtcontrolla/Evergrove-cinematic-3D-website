import { media } from './media'

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'Our World', href: '#world' },
  { label: 'Greenery', href: '#greenery' },
  { label: 'Landscaping', href: '#landscaping' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const contact = {
  phone: '+00 (000) 000 0000',
  email: 'hello@evergrove.example',
  studio: 'Studio address — to be confirmed',
  hours: 'Mon – Sat · 8:00 – 18:00',
}

/** The four business divisions. Order tells the story: supply → install → care → advise. */
export const divisions = [
  {
    id: 'supply',
    index: '01',
    title: 'Greenery & Turf Supply',
    short: 'We grow and source it.',
    body: 'Premium natural grass varieties, artificial turf, exotic plants, ornamental trees, palms and botanical collections — selected for health, form and the climate they’re going into.',
    cta: { label: 'Explore Grass & Turf', href: '#greenery' },
  },
  {
    id: 'install',
    index: '02',
    title: 'Landscaping & Installation',
    short: 'We build it.',
    body: 'Residential and commercial landscaping, lawn installation, garden design, green walls, rooftop gardens and complete outdoor transformations, delivered by our own crews.',
    cta: { label: 'Book a Landscaping Consultation', enquiry: 'landscaping' },
  },
  {
    id: 'care',
    index: '03',
    title: 'Lawn & Garden Care',
    short: 'We keep it extraordinary.',
    body: 'Mowing, trimming, fertilisation, weed control, irrigation management, lawn restoration, grass replacement and ongoing garden maintenance on a schedule built around your space.',
    cta: { label: 'Schedule Lawn Maintenance', enquiry: 'maintenance' },
  },
  {
    id: 'advise',
    index: '04',
    title: 'Consultation & Advisory',
    short: 'We help you choose well.',
    body: 'Site assessments, grass and plant selection, installation planning and maintenance strategies for homes, apartments, estates and commercial properties.',
    cta: { label: 'Talk to an Expert', enquiry: 'expert' },
  },
]

export const collections = [
  {
    id: 'bermuda',
    group: 'Natural grass',
    name: 'Bermuda',
    latin: 'Cynodon dactylon',
    body: 'Fine-bladed and fast to recover. Thrives in full sun and heavy use — the choice for sports lawns and open family gardens.',
    traits: ['Full sun', 'High traffic', 'Drought tolerant'],
    media: media.bermuda,
  },
  {
    id: 'zoysia',
    group: 'Natural grass',
    name: 'Zoysia',
    latin: 'Zoysia japonica',
    body: 'A dense, carpet-soft lawn that crowds out weeds and holds its colour. Elegant, slow-growing and low on mowing.',
    traits: ['Sun to part shade', 'Soft underfoot', 'Low mowing'],
    media: media.zoysia,
  },
  {
    id: 'kikuyu',
    group: 'Natural grass',
    name: 'Kikuyu',
    latin: 'Cenchrus clandestinus',
    body: 'Vigorous and self-repairing. A lush, hard-wearing lawn for large gardens, pets and active households.',
    traits: ['Full sun', 'Self-repairing', 'Fast establishment'],
    media: media.kikuyu,
  },
  {
    id: 'fescue',
    group: 'Natural grass',
    name: 'Fescue',
    latin: 'Festuca arundinacea',
    body: 'A cool-season grass with soft blue-green tones. Tolerates shade beautifully — ideal under trees and in temperate climates.',
    traits: ['Shade tolerant', 'Cool season', 'Fine texture'],
    media: media.fescue,
  },
  {
    id: 'staugustine',
    group: 'Natural grass',
    name: 'St. Augustine',
    latin: 'Stenotaphrum secundatum',
    body: 'Broad, rich-green blades for coastal and tropical gardens. Salt tolerant and comfortable in partial shade.',
    traits: ['Coastal', 'Part shade', 'Broad blade'],
    media: media.staugustine,
  },
  {
    id: 'artificial',
    group: 'Engineered turf',
    name: 'Artificial Turf',
    latin: 'Premium synthetic',
    body: 'Natural-looking multi-tone blades for rooftops, terraces and spaces where living grass can’t thrive. No water, always green.',
    traits: ['Zero watering', 'Rooftops & terraces', 'Pet friendly'],
    media: media.artificial,
  },
  {
    id: 'exotic',
    group: 'Botanicals',
    name: 'Exotic Plants',
    latin: 'Rare foliage collection',
    body: 'Statement tropical and rare foliage — alocasia, monstera, strelitzia and more — curated for interiors, atriums and sheltered gardens.',
    traits: ['Interiors & atriums', 'Statement foliage', 'Curated'],
    media: media.exotic,
  },
  {
    id: 'ornamental',
    group: 'Botanicals',
    name: 'Ornamental Trees',
    latin: 'Specimen trees',
    body: 'Sculptural olives, maples, magnolias and multi-stem specimens, selected tree by tree and craned into place.',
    traits: ['Mature specimens', 'Courtyards', 'Avenue planting'],
    media: media.ornamental,
  },
  {
    id: 'palms',
    group: 'Botanicals',
    name: 'Premium Palms',
    latin: 'Arecaceae',
    body: 'Date, fan and royal palms for arrivals, poolsides and resort-style gardens, delivered and established by our team.',
    traits: ['Poolside', 'Arrival avenues', 'Resort style'],
    media: media.palms,
  },
]

export const landscapes = [
  { title: 'Estates & Mansions', caption: 'Grounds composed around the architecture they frame.', media: media.landMansion },
  { title: 'Modern Architectural Gardens', caption: 'Geometry, restraint and planting that ages beautifully.', media: media.landModern },
  { title: 'Pools & Water Gardens', caption: 'Where the edge of the water dissolves into green.', media: media.landPool },
  { title: 'Rooftop Gardens', caption: 'Lawns and canopies, forty floors up.', media: media.landRooftop },
  { title: 'Living Green Walls', caption: 'Vertical gardens engineered for light, water and longevity.', media: media.landGreenWall },
  { title: 'Outdoor Living', caption: 'Rooms without ceilings — for long evenings outside.', media: media.landOutdoor },
]

export const services = [
  {
    n: '01',
    title: 'Luxury Landscaping',
    body: 'Complete design-and-build landscapes for private residences and commercial properties.',
    media: media.svcLandscaping,
    cta: { label: 'Transform Your Garden', enquiry: 'landscaping' },
  },
  {
    n: '02',
    title: 'Grass & Turf Installation',
    body: 'Natural lawns and premium artificial turf, laid on properly engineered ground.',
    media: media.svcTurf,
    cta: { label: 'Find Your Perfect Grass', href: '#grass-finder' },
  },
  {
    n: '03',
    title: 'Garden Design',
    body: 'Concept, planting plans and detailing from our in-house garden designers.',
    media: media.svcDesign,
    cta: { label: 'Book a Landscaping Consultation', enquiry: 'landscaping' },
  },
  {
    n: '04',
    title: 'Plant & Tree Supply',
    body: 'Specimen trees, palms and exotic plants — sourced, delivered and established.',
    media: media.svcSupply,
    cta: { label: 'Explore Grass & Turf', href: '#greenery' },
  },
  {
    n: '05',
    title: 'Green Wall Installation',
    body: 'Living walls for interiors and façades, with irrigation and lighting built in.',
    media: media.svcGreenWall,
    cta: { label: 'Talk to an Expert', enquiry: 'expert' },
  },
  {
    n: '06',
    title: 'Garden Maintenance',
    body: 'Mowing, feeding, irrigation and seasonal care that keeps every space at its best.',
    media: media.svcMaintenance,
    cta: { label: 'Schedule Lawn Maintenance', enquiry: 'maintenance' },
  },
]

/** Demonstration projects only — not real clients. */
export const projects = [
  {
    id: 'villa',
    title: 'The Terraced Villa',
    type: 'Private residence · Hillside',
    scope: ['Garden design', 'Olive & lavender planting', 'Zoysia lawn'],
    body: 'A concept for a hillside home: stepped lawns, silver-leaved planting and long views held by a frame of olives.',
    media: media.projVilla,
  },
  {
    id: 'courtyard',
    title: 'Courtyard in Green',
    type: 'Urban townhouse · Courtyard',
    scope: ['Living green wall', 'Fescue lawn', 'Lighting'],
    body: 'A small, shaded courtyard reimagined as a vertical garden room, with a shade-tolerant fescue floor.',
    media: media.projCourtyard,
  },
  {
    id: 'estate',
    title: 'Meadow House Estate',
    type: 'Country estate · Grounds',
    scope: ['Specimen trees', 'Kikuyu lawns', 'Ongoing care'],
    body: 'Broad lawns, an avenue of mature trees and a year-round maintenance plan to keep the grounds immaculate.',
    media: media.projEstate,
  },
  {
    id: 'rooftop',
    title: 'Sky Lawn Penthouse',
    type: 'Penthouse · Rooftop',
    scope: ['Artificial turf', 'Planters & palms', 'Irrigation'],
    body: 'A rooftop terrace with an always-green lawn, wind-hardy planting and an automated irrigation system.',
    media: media.projRooftop,
  },
]

/** Enquiry types used by every CTA + the contact forms. */
export const enquiryTypes = {
  grass: { label: 'Grass Consultation', title: 'Request a Grass Consultation', intro: 'Tell us about your space and we’ll recommend the right grass or turf — and how to install it.' },
  landscaping: { label: 'Landscaping Consultation', title: 'Book a Landscaping Consultation', intro: 'Share your vision and site details. A landscape designer will arrange an initial consultation.' },
  maintenance: { label: 'Lawn & Garden Care', title: 'Schedule Lawn Maintenance', intro: 'Tell us what needs caring for and how often. We’ll propose a maintenance plan.' },
  supply: { label: 'Greenery & Turf Supply', title: 'Enquire About Greenery & Turf', intro: 'Looking for specific grass, turf, trees, palms or exotic plants? Tell us what you need.' },
  expert: { label: 'Talk to an Expert', title: 'Talk to an Expert', intro: 'Not sure where to start? Ask us anything — our advisors will get back to you.' },
}

export const propertyTypes = ['Private home', 'Apartment / terrace', 'Estate', 'Commercial property', 'Development project']
