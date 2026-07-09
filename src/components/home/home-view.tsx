'use client'

import { Hero } from './hero'
import { Categories } from './categories'
import { FeaturedProperties } from './featured-properties'
import { PopularCities } from './popular-cities'
import { WhyChooseUs } from './why-choose'
import { StatsBand } from './stats-band'
import { Testimonials } from './testimonials'
import { Partners } from './partners'
import { FaqSection } from './faq-section'

export default function HomeView() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Categories />
      <FeaturedProperties />
      <PopularCities />
      <WhyChooseUs />
      <StatsBand />
      <Testimonials />
      <Partners />
      <FaqSection />
    </div>
  )
}
