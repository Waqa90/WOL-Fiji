import { neon, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const DATABASE_URL = 'postgresql://neondb_owner:npg_CITL9yB2AUwe@ep-summer-brook-a73o4qoo.ap-southeast-2.aws.neon.tech/neondb?sslmode=require'
const sql = neon(DATABASE_URL)

async function seed() {
  console.log('Seeding WOL Fiji demo data...\n')

  // Get branches
  const branches = await sql`SELECT id, name FROM branches ORDER BY name`
  if (branches.length === 0) {
    console.error('No branches found — run migrate.mjs first')
    process.exit(1)
  }
  const branchMap = {}
  for (const b of branches) branchMap[b.name] = b.id
  console.log('Branches found:', Object.keys(branchMap).join(', '))

  // Get super admin user
  const [admin] = await sql`SELECT id FROM users WHERE email = 'waqa26@wol.fj' LIMIT 1`
  if (!admin) {
    console.error('Admin user not found — check email or run migrate first')
    process.exit(1)
  }
  const adminId = admin.id
  console.log('Admin user found:', adminId)

  // ── MEMBERS ─────────────────────────────────────────────────────────────────
  console.log('\nSeeding members...')
  const members = [
    // Sabeto
    { first: 'Josaia', last: 'Tauvoli', phone: '9201234', branch: 'Sabeto', gender: 'Male', new: false, status: 'active' },
    { first: 'Mere', last: 'Cakau', email: 'mere.c@email.com', branch: 'Sabeto', gender: 'Female', new: false, status: 'active' },
    { first: 'Timoci', last: 'Bainivalu', phone: '9211111', branch: 'Sabeto', gender: 'Male', new: true, status: 'not_contacted' },
    { first: 'Ana', last: 'Naisilisili', branch: 'Sabeto', gender: 'Female', new: false, status: 'active' },
    { first: 'Pita', last: 'Bolanavoka', phone: '9219988', branch: 'Sabeto', gender: 'Male', new: true, status: 'contacted' },
    // Dreketi
    { first: 'Emele', last: 'Tora', phone: '9302222', branch: 'Dreketi', gender: 'Female', new: false, status: 'active' },
    { first: 'Sefanaia', last: 'Naiveli', branch: 'Dreketi', gender: 'Male', new: false, status: 'active' },
    { first: 'Litia', last: 'Rokotuivuna', email: 'litia.r@email.com', branch: 'Dreketi', gender: 'Female', new: true, status: 'not_contacted' },
    { first: 'Waisale', last: 'Drodrolagi', phone: '9313344', branch: 'Dreketi', gender: 'Male', new: false, status: 'active' },
    // Lau
    { first: 'Kolinio', last: 'Serevi', branch: 'Lau', gender: 'Male', new: false, status: 'active' },
    { first: 'Vasiti', last: 'Waqavou', phone: '9405566', branch: 'Lau', gender: 'Female', new: true, status: 'contacted' },
    { first: 'Apenisa', last: 'Mataika', branch: 'Lau', gender: 'Male', new: false, status: 'active' },
    // Suva
    { first: 'Atunaisa', last: 'Waqa', email: 'waqa@wol.fj', phone: '9501234', branch: 'Suva', gender: 'Male', new: false, status: 'active' },
    { first: 'Sainimili', last: 'Kubu', phone: '9512345', branch: 'Suva', gender: 'Female', new: false, status: 'active' },
    { first: 'Rusiate', last: 'Vunibobo', email: 'rusi.v@email.com', branch: 'Suva', gender: 'Male', new: false, status: 'active' },
    { first: 'Makereta', last: 'Nainima', branch: 'Suva', gender: 'Female', new: true, status: 'not_contacted' },
    { first: 'Ilaisa', last: 'Caginitoba', phone: '9534455', branch: 'Suva', gender: 'Male', new: false, status: 'active' },
    { first: 'Laisa', last: 'Takiveikata', email: 'laisa.t@email.com', branch: 'Suva', gender: 'Female', new: true, status: 'contacted' },
    // Taveuni
    { first: 'Epeli', last: 'Gonedua', phone: '9608877', branch: 'Taveuni', gender: 'Male', new: false, status: 'active' },
    { first: 'Melaia', last: 'Cagilaba', branch: 'Taveuni', gender: 'Female', new: false, status: 'active' },
    { first: 'Aporosa', last: 'Rasiga', phone: '9621122', branch: 'Taveuni', gender: 'Male', new: true, status: 'not_contacted' },
    { first: 'Suliana', last: 'Dravou', email: 'suliana.d@email.com', branch: 'Taveuni', gender: 'Female', new: false, status: 'active' },
  ]

  for (const m of members) {
    const branchId = branchMap[m.branch]
    await sql`
      INSERT INTO members (first_name, last_name, email, phone, branch_id, gender, is_new_member, follow_up_status, created_by, join_date)
      VALUES (
        ${m.first}, ${m.last}, ${m.email ?? null}, ${m.phone ?? null},
        ${branchId}, ${m.gender}, ${m.new}, ${m.status}, ${adminId},
        ${m.new ? 'NOW()' : `NOW() - INTERVAL '${Math.floor(Math.random() * 24) + 1} months'`}
      )
      ON CONFLICT DO NOTHING
    `
  }
  console.log(`OK — ${members.length} members seeded`)

  // ── FINANCE ENTRIES ──────────────────────────────────────────────────────────
  console.log('\nSeeding finance entries...')
  const financeEntries = [
    // Sabeto income
    { type: 'income', cat: 'Tithe', amt: 850, desc: 'Sunday tithe collection', branch: 'Sabeto', days: 7 },
    { type: 'income', cat: 'Offering', amt: 420, desc: 'Sunday morning offering', branch: 'Sabeto', days: 7 },
    { type: 'income', cat: 'Tithe', amt: 920, desc: 'Sunday tithe collection', branch: 'Sabeto', days: 14 },
    { type: 'income', cat: 'Donation', amt: 500, desc: 'Anonymous donation', branch: 'Sabeto', days: 20 },
    { type: 'expense', cat: 'Utilities', amt: 180, desc: 'Electricity bill March', branch: 'Sabeto', days: 5 },
    { type: 'expense', cat: 'Supplies', amt: 95, desc: 'Stationery and printing', branch: 'Sabeto', days: 12 },
    // Dreketi
    { type: 'income', cat: 'Tithe', amt: 630, desc: 'Sunday tithe collection', branch: 'Dreketi', days: 7 },
    { type: 'income', cat: 'Offering', amt: 310, desc: 'Sunday offering', branch: 'Dreketi', days: 7 },
    { type: 'income', cat: 'Fundraiser', amt: 1200, desc: 'Church fundraiser dinner', branch: 'Dreketi', days: 15 },
    { type: 'expense', cat: 'Transport', amt: 220, desc: 'Pastor transport allowance', branch: 'Dreketi', days: 3 },
    { type: 'expense', cat: 'Maintenance', amt: 350, desc: 'Roof repair', branch: 'Dreketi', days: 25 },
    // Lau
    { type: 'income', cat: 'Tithe', amt: 510, desc: 'Sunday tithe collection', branch: 'Lau', days: 7 },
    { type: 'income', cat: 'Offering', amt: 280, desc: 'Sunday offering', branch: 'Lau', days: 7 },
    { type: 'expense', cat: 'Supplies', amt: 75, desc: 'Communion supplies', branch: 'Lau', days: 10 },
    // Suva
    { type: 'income', cat: 'Tithe', amt: 1850, desc: 'Sunday tithe collection', branch: 'Suva', days: 7 },
    { type: 'income', cat: 'Offering', amt: 760, desc: 'Sunday morning offering', branch: 'Suva', days: 7 },
    { type: 'income', cat: 'Tithe', amt: 2100, desc: 'Sunday tithe collection', branch: 'Suva', days: 14 },
    { type: 'income', cat: 'Donation', amt: 1500, desc: 'Donor gift — Building Fund', branch: 'Suva', days: 20 },
    { type: 'income', cat: 'Fundraiser', amt: 3200, desc: 'Annual gala fundraiser', branch: 'Suva', days: 30 },
    { type: 'expense', cat: 'Salary', amt: 1800, desc: 'Pastor salary — March', branch: 'Suva', days: 1 },
    { type: 'expense', cat: 'Rent', amt: 2500, desc: 'Church hall rent — March', branch: 'Suva', days: 1 },
    { type: 'expense', cat: 'Utilities', amt: 380, desc: 'Electricity and water', branch: 'Suva', days: 8 },
    { type: 'expense', cat: 'Events', amt: 450, desc: 'Youth conference materials', branch: 'Suva', days: 18 },
    // Taveuni
    { type: 'income', cat: 'Tithe', amt: 720, desc: 'Sunday tithe collection', branch: 'Taveuni', days: 7 },
    { type: 'income', cat: 'Offering', amt: 360, desc: 'Sunday offering', branch: 'Taveuni', days: 7 },
    { type: 'expense', cat: 'Transport', amt: 180, desc: 'Inter-island travel', branch: 'Taveuni', days: 5 },
    { type: 'expense', cat: 'Maintenance', amt: 290, desc: 'Sound system repair', branch: 'Taveuni', days: 22 },
  ]

  for (const f of financeEntries) {
    const branchId = branchMap[f.branch]
    await sql`
      INSERT INTO finance_entries (entry_type, category, amount, description, branch_id, entry_date, created_by)
      VALUES (
        ${f.type}, ${f.cat}, ${f.amt}, ${f.desc},
        ${branchId},
        (NOW() - INTERVAL '${f.days} days')::date,
        ${adminId}
      )
    `
  }
  console.log(`OK — ${financeEntries.length} finance entries seeded`)

  // ── EVENTS ───────────────────────────────────────────────────────────────────
  console.log('\nSeeding events...')
  const events = [
    { title: 'Easter Sunday Service', desc: 'Celebrate the resurrection of Jesus Christ with us. All welcome!', branch: 'Suva', days: -20, loc: 'Suva Main Hall', pub: true },
    { title: 'Youth Conference 2026', desc: 'Annual youth gathering across all WOL Fiji branches. Theme: Unshakeable Faith.', branch: 'Suva', days: -45, loc: 'WOL Suva', pub: true },
    { title: 'Sabeto Branch Anniversary', desc: 'Celebrating 5 years of WOL Sabeto with praise, worship and community.', branch: 'Sabeto', days: -10, loc: 'Sabeto Church Hall', pub: true },
    { title: 'Community Outreach Day', desc: 'Serving the Dreketi community with food, prayer and fellowship.', branch: 'Dreketi', days: 5, loc: 'Dreketi Town Centre', pub: true },
    { title: 'Worship Night', desc: 'An evening of worship and prayer. Open to all branches.', branch: 'Suva', days: 12, loc: 'WOL Suva Main Hall', pub: true },
    { title: 'Lau Branch Dedication', desc: 'Dedication service for new meeting space in Lau.', branch: 'Lau', days: 20, loc: 'Lau Group, Fiji', pub: true },
    { title: 'Pastors Meeting', desc: 'Monthly pastors and leaders meeting.', branch: 'Suva', days: 3, loc: 'WOL Suva Office', pub: false },
    { title: 'Finance Team Review', desc: 'Quarterly finance review across all branches.', branch: 'Suva', days: 7, loc: 'Suva Office', pub: false },
    { title: 'Taveuni Baptism Service', desc: 'Water baptism service for new believers in Taveuni.', branch: 'Taveuni', days: 25, loc: 'Taveuni Beach', pub: true },
    { title: 'Bible Study Marathon', desc: 'All-day Bible study — book of Romans. Bring your lunch!', branch: 'Sabeto', days: 30, loc: 'Sabeto Hall', pub: true },
  ]

  for (const e of events) {
    const branchId = branchMap[e.branch]
    await sql`
      INSERT INTO events (title, description, event_date, start_time, end_time, branch_id, location, is_public, created_by)
      VALUES (
        ${e.title}, ${e.desc},
        (NOW() + INTERVAL '${e.days} days')::date,
        '10:00', '13:00',
        ${branchId}, ${e.loc}, ${e.pub}, ${adminId}
      )
    `
  }
  console.log(`OK — ${events.length} events seeded`)

  // ── PRAYER REQUESTS ──────────────────────────────────────────────────────────
  console.log('\nSeeding prayer requests...')
  const prayers = [
    { name: 'Mere T.', req: 'Please pray for my mothers recovery from surgery.', branch: 'Sabeto', status: 'new' },
    { name: 'Anonymous', req: 'Prayer for financial breakthrough for my family.', branch: 'Suva', anon: true, status: 'new' },
    { name: 'Josaia V.', req: 'Guidance for my career decision — moving to Australia.', branch: 'Suva', status: 'prayed' },
    { name: 'Litia K.', req: 'Marriage restoration. Please pray for my husband and I.', branch: 'Dreketi', status: 'new' },
    { name: 'Epeli R.', req: 'Healing for my son who has been ill for 3 weeks.', branch: 'Taveuni', status: 'prayed' },
    { name: 'Anonymous', req: 'Safety for my sister travelling overseas.', branch: 'Lau', anon: true, status: 'new' },
    { name: 'Sela M.', req: 'Wisdom for our church leadership team.', branch: 'Sabeto', status: 'prayed' },
    { name: 'Waisale N.', req: 'Prayer for my business to prosper so I can give more to the church.', branch: 'Suva', status: 'new' },
  ]

  for (const p of prayers) {
    const branchId = branchMap[p.branch]
    await sql`
      INSERT INTO prayer_requests (name, request, is_anonymous, status, branch_id)
      VALUES (${p.name}, ${p.req}, ${p.anon ?? false}, ${p.status}, ${branchId})
    `
  }
  console.log(`OK — ${prayers.length} prayer requests seeded`)

  // ── CONTACT MESSAGES ─────────────────────────────────────────────────────────
  console.log('\nSeeding contact messages...')
  const contacts = [
    { name: 'David Sharma', email: 'david.s@email.com', subj: 'Visiting from New Zealand', msg: 'Hi, I will be in Fiji next month and would love to attend a service. Which branch is closest to Nadi town?', branch: 'Sabeto', read: false },
    { name: 'Jennifer Lee', email: 'jlee@email.com', subj: 'Online donation query', msg: 'Hello, I would like to donate to support the church but I am overseas. How can I give online?', branch: 'Suva', read: true },
    { name: 'Tomasi Vuniwawa', email: 'tomasi.v@email.com', phone: '9701234', subj: 'Joining the music team', msg: 'I play keyboard and would love to join the worship team. Who can I speak to?', branch: 'Suva', read: false },
    { name: 'Grace Patel', email: 'grace.p@gmail.com', subj: 'Marriage counselling', msg: 'We are a young couple looking for pre-marriage counselling. Does your church offer this?', branch: 'Suva', read: false },
    { name: 'Isireli Cama', email: 'isi.cama@email.com', phone: '9712233', subj: 'Events calendar', msg: 'Is there a way to get notified of upcoming events? We would love to bring our youth group.', branch: 'Dreketi', read: true },
  ]

  for (const c of contacts) {
    const branchId = branchMap[c.branch]
    await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message, branch_id, is_read)
      VALUES (${c.name}, ${c.email}, ${c.phone ?? null}, ${c.subj}, ${c.msg}, ${branchId}, ${c.read})
    `
  }
  console.log(`OK — ${contacts.length} contact messages seeded`)

  // ── MUSICIANS ────────────────────────────────────────────────────────────────
  console.log('\nSeeding musicians...')
  const musicians = [
    { name: 'Atunaisa Waqa', instruments: ['Guitar'], specialty: 'Guitar', bio: 'Lead guitarist and music director with over 10 years of worship experience across WOL Fiji.', branch: 'Sabeto' },
    { name: 'Josaia Tuilagi', instruments: ['Bass'], specialty: 'Bass', bio: 'Bass guitarist serving at WOL Sabeto. Passionate about creating the foundation for worship.', branch: 'Sabeto' },
    { name: 'Epeli Naisara', instruments: ['Drums'], specialty: 'Drums', bio: 'Drummer with 7 years experience in gospel and contemporary worship.', branch: 'Sabeto' },
    { name: 'Mere Vunibobo', instruments: ['Keyboard'], specialty: 'Keyboard', bio: 'Keyboard player and arranger, trained in both classical and contemporary worship styles.', branch: 'Sabeto' },
    { name: 'Timoci Cakau', instruments: ['Trumpet'], specialty: 'Trumpet/Flute', bio: 'Trumpet player bringing a powerful brass dimension to WOL worship.', branch: 'Sabeto' },
    // Singers
    { name: 'Ana Seru', instruments: ['Vocals'], specialty: 'Singers', bio: 'Lead vocalist with a powerful soprano voice that lifts every service.', branch: 'Sabeto' },
    { name: 'Litia Bainivalu', instruments: ['Vocals'], specialty: 'Singers', bio: 'Backing vocalist and choir section leader with a heart for worship.', branch: 'Sabeto' },
    { name: 'Laisa Tora', instruments: ['Vocals'], specialty: 'Singers', bio: 'Alto vocalist, passionate about harmony and creating depth in worship.', branch: 'Sabeto' },
    { name: 'Suliana Naisilisili', instruments: ['Vocals'], specialty: 'Singers', bio: 'Soprano vocalist and youth worship leader.', branch: 'Sabeto' },
    { name: 'Vasiti Rokotuivuna', instruments: ['Vocals'], specialty: 'Singers', bio: 'Backing vocalist with a gift for harmonizing and congregational song leading.', branch: 'Sabeto' },
    { name: 'Makereta Drodrolagi', instruments: ['Vocals'], specialty: 'Singers', bio: 'Alto and occasional lead vocalist, faithful member of the WOL worship team.', branch: 'Sabeto' },
    // Sound Engineer
    { name: 'Rusiate Gonedua', instruments: ['Sound'], specialty: 'Sound Engineer', bio: 'Sound engineer and audio technician ensuring every service sounds its best.', branch: 'Sabeto' },
  ]

  for (const m of musicians) {
    const branchId = branchMap[m.branch]
    await sql`
      INSERT INTO musicians (name, instruments, instrument_specialty, bio, branch_id, is_active)
      VALUES (${m.name}, ${m.instruments}, ${m.specialty}, ${m.bio}, ${branchId}, true)
      ON CONFLICT DO NOTHING
    `
  }
  console.log(`OK — ${musicians.length} musicians seeded`)

  console.log('\n✅ Seed complete! Dashboard should now show live figures.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
