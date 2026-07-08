// HouseHunt - Database seed script
// Run with: bun prisma/seed.ts
import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Seeding HouseHunt database...')

  // Clean existing data
  await db.review.deleteMany()
  await db.property.deleteMany()
  await db.agent.deleteMany()
  await db.contactMessage.deleteMany()
  await db.newsletterSub.deleteMany()

  // ---- Agents ----
  const agents = await Promise.all([
    db.agent.create({
      data: {
        name: 'Sophia Bennett',
        email: 'sophia@househunt.com',
        phone: '+1 (305) 555-0142',
        avatar: '/agents/agent1.png',
        title: 'Senior Real Estate Agent',
        company: 'HouseHunt Premier',
        rating: 4.9,
        totalSales: 187,
        verified: true,
      },
    }),
    db.agent.create({
      data: {
        name: 'James Carter',
        email: 'james@househunt.com',
        phone: '+1 (212) 555-0198',
        avatar: '/agents/agent2.png',
        title: 'Luxury Property Specialist',
        company: 'HouseHunt Premier',
        rating: 4.8,
        totalSales: 142,
        verified: true,
      },
    }),
    db.agent.create({
      data: {
        name: 'Mia Rodriguez',
        email: 'mia@househunt.com',
        phone: '+1 (619) 555-0173',
        avatar: '/agents/agent3.png',
        title: 'Coastal Homes Expert',
        company: 'HouseHunt Premier',
        rating: 4.9,
        totalSales: 96,
        verified: true,
      },
    }),
    db.agent.create({
      data: {
        name: 'David Nguyen',
        email: 'david@househunt.com',
        phone: '+1 (720) 555-0125',
        avatar: '/agents/agent4.png',
        title: 'Residential Advisor',
        company: 'HouseHunt Premier',
        rating: 4.7,
        totalSales: 73,
        verified: true,
      },
    }),
  ])

  const [sophia, james, mia, david] = agents

  // ---- Properties ----
  const propertyData = [
    {
      title: 'Modern Infinity Villa',
      description:
        'A breathtaking contemporary villa featuring an infinity pool, floor-to-ceiling glass walls, and seamless indoor-outdoor living. Set on a private landscaped lot with smart-home automation throughout.',
      price: 1250000,
      type: 'Villa',
      status: 'buy',
      bedrooms: 5,
      bathrooms: 4,
      area: 4200,
      parking: 3,
      furnished: true,
      floor: 2,
      balcony: true,
      yearBuilt: 2022,
      facing: 'South',
      amenities: 'Pool,Gym,Smart Home,Solar Panels,Garden,Security',
      images: '/properties/prop1.png,/properties/prop10.png,/properties/prop2.png',
      address: '1280 Sunset Bluff Dr',
      city: 'Miami',
      state: 'Florida',
      country: 'USA',
      zipCode: '33139',
      lat: 25.7907,
      lng: -80.13,
      featured: true,
      premium: true,
      rating: 4.9,
      views: 2840,
      agentId: sophia.id,
    },
    {
      title: 'Cozy Downtown Apartment',
      description:
        'Bright and airy Scandinavian-style apartment in the heart of downtown. Walking distance to cafes, galleries, and public transit. Features hardwood floors and a private balcony.',
      price: 2400,
      type: 'Apartment',
      status: 'rent',
      bedrooms: 2,
      bathrooms: 1,
      area: 980,
      parking: 1,
      furnished: true,
      floor: 6,
      balcony: true,
      yearBuilt: 2019,
      facing: 'East',
      amenities: 'Gym,Concierge,Pet Friendly,AC,Elevator',
      images: '/properties/prop2.png,/properties/prop6.png,/properties/prop10.png',
      address: '412 Lamar St, Apt 6B',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      zipCode: '78701',
      lat: 30.2672,
      lng: -97.7431,
      featured: true,
      premium: false,
      rating: 4.6,
      views: 1520,
      agentId: david.id,
    },
    {
      title: 'Suburban Family Home',
      description:
        'Spacious two-story family home on a quiet tree-lined street. Large backyard perfect for kids, updated kitchen, and a cozy fireplace. Top-rated school district nearby.',
      price: 680000,
      type: 'House',
      status: 'buy',
      bedrooms: 4,
      bathrooms: 3,
      area: 2600,
      parking: 2,
      furnished: false,
      floor: 2,
      balcony: false,
      yearBuilt: 2015,
      facing: 'North',
      amenities: 'Garden,Fireplace,Garage,Pet Friendly,Solar Panels',
      images: '/properties/prop3.png,/properties/prop10.png',
      address: '78 Maple Ridge Ln',
      city: 'Denver',
      state: 'Colorado',
      country: 'USA',
      zipCode: '80205',
      lat: 39.7392,
      lng: -104.9903,
      featured: true,
      premium: false,
      rating: 4.7,
      views: 1980,
      agentId: david.id,
    },
    {
      title: 'Luxury Skyline Penthouse',
      description:
        'An iconic penthouse with panoramic city skyline views, private rooftop terrace, and designer interiors. Building amenities include a spa, rooftop pool, and 24/7 concierge.',
      price: 3500000,
      type: 'Penthouse',
      status: 'buy',
      bedrooms: 4,
      bathrooms: 5,
      area: 3800,
      parking: 3,
      furnished: true,
      floor: 42,
      balcony: true,
      yearBuilt: 2021,
      facing: 'South',
      amenities: 'Pool,Gym,Spa,Concierge,Smart Home,Security,Elevator',
      images: '/properties/prop4.png,/properties/prop10.png,/properties/prop2.png',
      address: '1 Billionaire\'s Row, PH 42',
      city: 'New York',
      state: 'New York',
      country: 'USA',
      zipCode: '10019',
      lat: 40.7614,
      lng: -73.9776,
      featured: true,
      premium: true,
      rating: 5.0,
      views: 4120,
      agentId: james.id,
    },
    {
      title: 'Beachfront Ocean Retreat',
      description:
        'Wake up to the sound of waves in this stunning beachfront home. Wraparound deck, direct beach access, and panoramic ocean views from every room.',
      price: 5200,
      type: 'House',
      status: 'rent',
      bedrooms: 3,
      bathrooms: 2,
      area: 2100,
      parking: 2,
      furnished: true,
      floor: 1,
      balcony: true,
      yearBuilt: 2018,
      facing: 'West',
      amenities: 'Beach Access,Pet Friendly,AC,Smart Home,Garden',
      images: '/properties/prop5.png,/properties/prop1.png',
      address: '220 Coastal Hwy',
      city: 'San Diego',
      state: 'California',
      country: 'USA',
      zipCode: '92101',
      lat: 32.7157,
      lng: -117.1611,
      featured: false,
      premium: true,
      rating: 4.8,
      views: 2360,
      agentId: mia.id,
    },
    {
      title: 'Minimalist City Studio',
      description:
        'A perfectly designed studio for the modern urbanite. Smart layout maximizes space with built-in storage and a sleek kitchenette. Steps from tech hubs and nightlife.',
      price: 1800,
      type: 'Studio',
      status: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      area: 520,
      parking: 0,
      furnished: true,
      floor: 9,
      balcony: false,
      yearBuilt: 2020,
      facing: 'East',
      amenities: 'Gym,AC,Elevator,Smart Home',
      images: '/properties/prop6.png,/properties/prop2.png',
      address: '905 Pine St, Studio 9C',
      city: 'Seattle',
      state: 'Washington',
      country: 'USA',
      zipCode: '98101',
      lat: 47.6101,
      lng: -122.3344,
      featured: false,
      premium: false,
      rating: 4.4,
      views: 940,
      agentId: david.id,
    },
    {
      title: 'Heritage Brick Townhouse',
      description:
        'Elegantly restored three-story townhouse blending historic charm with modern luxury. Exposed brick, chef\'s kitchen, and a private rooftop with skyline glimpses.',
      price: 890000,
      type: 'Townhouse',
      status: 'buy',
      bedrooms: 3,
      bathrooms: 3,
      area: 2400,
      parking: 1,
      furnished: false,
      floor: 3,
      balcony: true,
      yearBuilt: 1895,
      facing: 'South',
      amenities: 'Fireplace,Smart Home,Security,Roof Deck',
      images: '/properties/prop7.png,/properties/prop10.png',
      address: '54 Beacon Hill Pl',
      city: 'Boston',
      state: 'Massachusetts',
      country: 'USA',
      zipCode: '02108',
      lat: 42.3601,
      lng: -71.0589,
      featured: false,
      premium: false,
      rating: 4.6,
      views: 1340,
      agentId: james.id,
    },
    {
      title: 'Rustic Mountain Cottage',
      description:
        'A storybook stone cottage nestled in the Blue Ridge Mountains. Cozy interiors, a wood-burning stove, and acres of natural beauty. The perfect weekend escape or full-time retreat.',
      price: 420000,
      type: 'Cottage',
      status: 'buy',
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      parking: 2,
      furnished: true,
      floor: 1,
      balcony: true,
      yearBuilt: 2008,
      facing: 'East',
      amenities: 'Fireplace,Garden,Pet Friendly,Solar Panels',
      images: '/properties/prop8.png,/properties/prop3.png',
      address: '17 Laurel Cove Rd',
      city: 'Asheville',
      state: 'North Carolina',
      country: 'USA',
      zipCode: '28801',
      lat: 35.5951,
      lng: -82.5515,
      featured: false,
      premium: false,
      rating: 4.8,
      views: 760,
      agentId: mia.id,
    },
    {
      title: 'Contemporary River Condo',
      description:
        'Sleek corner-unit condo with sweeping river and skyline views. Resort-style building amenities, in-unit laundry, and a reserved parking spot. Ideal for professionals.',
      price: 3100,
      type: 'Condo',
      status: 'rent',
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      parking: 1,
      furnished: true,
      floor: 18,
      balcony: true,
      yearBuilt: 2021,
      facing: 'West',
      amenities: 'Pool,Gym,Concierge,AC,Elevator,Security',
      images: '/properties/prop9.png,/properties/prop4.png',
      address: '300 River North Blvd, 18A',
      city: 'Chicago',
      state: 'Illinois',
      country: 'USA',
      zipCode: '60654',
      lat: 41.8781,
      lng: -87.6298,
      featured: true,
      premium: false,
      rating: 4.5,
      views: 1620,
      agentId: sophia.id,
    },
    {
      title: 'Architect\'s Modern Estate',
      description:
        'A statement property designed by an award-winning architect. Open-concept living, chef\'s kitchen with marble island, home theater, and a resort-style backyard with pool and spa.',
      price: 1750000,
      type: 'Villa',
      status: 'buy',
      bedrooms: 5,
      bathrooms: 4,
      area: 5200,
      parking: 4,
      furnished: true,
      floor: 2,
      balcony: true,
      yearBuilt: 2023,
      facing: 'South',
      amenities: 'Pool,Spa,Gym,Smart Home,Home Theater,Solar Panels,Security',
      images: '/properties/prop10.png,/properties/prop1.png,/properties/prop2.png',
      address: '881 Bel Air Rd',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      zipCode: '90077',
      lat: 34.0901,
      lng: -118.4065,
      featured: true,
      premium: true,
      rating: 4.9,
      views: 3210,
      agentId: sophia.id,
    },
  ]

  const createdProperties = []
  for (const p of propertyData) {
    createdProperties.push(await db.property.create({ data: p }))
  }

  // ---- Reviews ----
  const reviewTemplates = [
    { author: 'Emily Watson', avatar: '/agents/agent3.png', rating: 5, comment: 'Absolutely stunning property and a seamless experience from start to finish. Highly recommend!' },
    { author: 'Michael Lee', avatar: '/agents/agent4.png', rating: 4, comment: 'Beautiful home with great natural light. The neighborhood is quiet and friendly.' },
    { author: 'Olivia Brown', avatar: '/agents/agent1.png', rating: 5, comment: 'The agent was incredibly helpful and responsive. The property exceeded our expectations.' },
    { author: 'Daniel Garcia', avatar: '/agents/agent2.png', rating: 4, comment: 'Great value for the location. Modern finishes and a fantastic view.' },
    { author: 'Sarah Johnson', avatar: '/agents/agent3.png', rating: 5, comment: 'Best decision we ever made. The home is perfect for our growing family.' },
    { author: 'Robert Chen', avatar: '/agents/agent4.png', rating: 5, comment: 'Professional service and a gorgeous property. Would work with this agent again.' },
  ]

  // Distribute reviews across properties
  for (let i = 0; i < createdProperties.length; i++) {
    const prop = createdProperties[i]
    const numReviews = 2 + (i % 2) // 2-3 reviews each
    for (let r = 0; r < numReviews; r++) {
      const tmpl = reviewTemplates[(i + r) % reviewTemplates.length]
      await db.review.create({
        data: {
          propertyId: prop.id,
          author: tmpl.author,
          avatar: tmpl.avatar,
          rating: tmpl.rating,
          comment: tmpl.comment,
          agentId: agents[(i + r) % agents.length].id,
        },
      })
    }
  }

  console.log('✅ Seed complete!')
  console.log(`   - ${agents.length} agents`)
  console.log(`   - ${createdProperties.length} properties`)
  const reviewCount = await db.review.count()
  console.log(`   - ${reviewCount} reviews`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
