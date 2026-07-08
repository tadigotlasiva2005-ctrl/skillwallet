# HouseHunt Project Worklog

Project: HouseHunt - Smart House Rental & Real Estate Platform
Stack: Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + Prisma (SQLite)

---
Task ID: 1
Agent: main
Task: Set up Prisma schema (Property, Agent, Review, ContactMessage, NewsletterSub) + push to DB

Work Log:
- Replaced prisma/schema.prisma with HouseHunt models: Agent, Property, Review, ContactMessage, NewsletterSub
- Property includes: title, price, type, status (rent/buy), bedrooms, bathrooms, area, parking, furnished, floor, balcony, yearBuilt, facing, amenities (CSV), images (CSV), address, city, state, country, zipCode, lat, lng, featured, premium, verified, availability, rating, views, agentId
- Review linked to Property + optional Agent, includes author, avatar, rating, comment, date
- Added indexes on city, status, type, featured for fast filtering
- Ran `bun run db:push` -> database in sync, Prisma Client generated

Stage Summary:
- Database schema ready. SQLite at db/custom.db.
- Next: seed realistic data (10-12 properties across cities, 4 agents, reviews) + build API routes + frontend.

---
Task ID: 2
Agent: image-gen
Task: Generate curated set of 15 high-quality property & agent images via z-ai CLI

Work Log:
- Created directories: /home/z/my-project/public/properties/ and /home/z/my-project/public/agents/
- Built a retry wrapper (/tmp/gen.sh) that retries each generation up to 3 attempts with 5s backoff, and verifies the output file is non-empty
- Executed generations in staggered pairs (8s offset) to avoid API 429 rate-limit errors encountered on initial 3-concurrent batch
- DISCOVERY: z-ai image API rejects size 1440x720 (and 720x1440) with code 1214 - dimensions must be multiples of 32, but 720 is not (720/32 = 22.5). All other listed sizes (1024x1024, 768x1344, 864x1152, 1344x768, 1152x864) are valid. Substituted hero.png size with 1344x768 (closest landscape ratio) so the hero image could still be generated; the aspect ratio is 1.75:1 instead of 2:1. Frontend may want to use object-cover to handle the slightly taller hero.
- All 15 images generated successfully on first retry attempt after fixing rate-limit and size issues

Results:
- /home/z/my-project/public/properties/hero.png   (1344x768, 134,647 bytes) - NOTE: substituted size, see above
- /home/z/my-project/public/properties/prop1.png  (1344x768, 148,959 bytes)
- /home/z/my-project/public/properties/prop2.png  (1344x768, 132,545 bytes)
- /home/z/my-project/public/properties/prop3.png  (1344x768, 201,122 bytes)
- /home/z/my-project/public/properties/prop4.png  (1344x768, 145,569 bytes)
- /home/z/my-project/public/properties/prop5.png  (1344x768, 173,985 bytes)
- /home/z/my-project/public/properties/prop6.png  (1344x768, 104,820 bytes)
- /home/z/my-project/public/properties/prop7.png  (1344x768, 144,742 bytes)
- /home/z/my-project/public/properties/prop8.png  (1344x768, 245,013 bytes)
- /home/z/my-project/public/properties/prop9.png  (1344x768, 192,750 bytes)
- /home/z/my-project/public/properties/prop10.png (1344x768, 104,378 bytes)
- /home/z/my-project/public/agents/agent1.png     (1024x1024, 78,106 bytes)
- /home/z/my-project/public/agents/agent2.png     (1024x1024, 82,768 bytes)
- /home/z/my-project/public/agents/agent3.png     (1024x1024, 81,799 bytes)
- /home/z/my-project/public/agents/agent4.png     (1024x1024, 93,087 bytes)

Stage Summary:
- 15/15 images successfully generated and saved at the specified paths; all files are non-empty PNGs.
- Only deviation from spec: hero.png was generated at 1344x768 instead of 1440x720 because the z-ai API rejects sizes whose dimensions are not multiples of 32 (720 is not). This is the only feasible landscape option from the supported size list; frontend hero banner should use object-cover / responsive sizing.
- Image assets are ready for the listings UI (Task ID 3+): 1 hero + 10 property thumbnails + 4 agent headshots.
- Recommended next: build seed script referencing these image paths, then build property listing cards, hero section, and agent profile components.
