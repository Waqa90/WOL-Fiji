import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

// ONE-TIME seed route — DELETE after use
// Protected by a secret token to prevent abuse
const SEED_SECRET = 'wol-fiji-seed-2026'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: string[] = []

  try {
    // Get branches
    const branches = await sql`SELECT id, name FROM branches ORDER BY name`
    if (branches.length === 0) return NextResponse.json({ error: 'No branches found — run migration first' }, { status: 400 })
    const bm: Record<string, string> = {}
    for (const b of branches) bm[b.name] = b.id
    results.push(`Branches: ${Object.keys(bm).join(', ')}`)

    // Get admin user
    const [admin] = await sql`SELECT id FROM users LIMIT 1`
    if (!admin) return NextResponse.json({ error: 'No users found' }, { status: 400 })
    const adminId = admin.id
    results.push(`Admin ID: ${adminId}`)

    // ── MEMBERS ──────────────────────────────────────────────────────────────
    const members = [
      { first: 'Josaia', last: 'Tauvoli', phone: '9201234', branch: 'Sabeto', gender: 'Male', isNew: false, status: 'active', months: 18 },
      { first: 'Mere', last: 'Cakau', email: 'mere.c@email.com', branch: 'Sabeto', gender: 'Female', isNew: false, status: 'active', months: 24 },
      { first: 'Timoci', last: 'Bainivalu', phone: '9211111', branch: 'Sabeto', gender: 'Male', isNew: true, status: 'not_contacted', months: 0 },
      { first: 'Ana', last: 'Naisilisili', branch: 'Sabeto', gender: 'Female', isNew: false, status: 'active', months: 12 },
      { first: 'Pita', last: 'Bolanavoka', phone: '9219988', branch: 'Sabeto', gender: 'Male', isNew: true, status: 'contacted', months: 1 },
      { first: 'Emele', last: 'Tora', phone: '9302222', branch: 'Dreketi', gender: 'Female', isNew: false, status: 'active', months: 36 },
      { first: 'Sefanaia', last: 'Naiveli', branch: 'Dreketi', gender: 'Male', isNew: false, status: 'active', months: 30 },
      { first: 'Litia', last: 'Rokotuivuna', email: 'litia.r@email.com', branch: 'Dreketi', gender: 'Female', isNew: true, status: 'not_contacted', months: 0 },
      { first: 'Waisale', last: 'Drodrolagi', phone: '9313344', branch: 'Dreketi', gender: 'Male', isNew: false, status: 'active', months: 20 },
      { first: 'Kolinio', last: 'Serevi', branch: 'Lau', gender: 'Male', isNew: false, status: 'active', months: 15 },
      { first: 'Vasiti', last: 'Waqavou', phone: '9405566', branch: 'Lau', gender: 'Female', isNew: true, status: 'contacted', months: 1 },
      { first: 'Apenisa', last: 'Mataika', branch: 'Lau', gender: 'Male', isNew: false, status: 'active', months: 10 },
      { first: 'Sainimili', last: 'Kubu', phone: '9512345', branch: 'Suva', gender: 'Female', isNew: false, status: 'active', months: 22 },
      { first: 'Rusiate', last: 'Vunibobo', email: 'rusi.v@email.com', branch: 'Suva', gender: 'Male', isNew: false, status: 'active', months: 28 },
      { first: 'Makereta', last: 'Nainima', branch: 'Suva', gender: 'Female', isNew: true, status: 'not_contacted', months: 0 },
      { first: 'Ilaisa', last: 'Caginitoba', phone: '9534455', branch: 'Suva', gender: 'Male', isNew: false, status: 'active', months: 14 },
      { first: 'Laisa', last: 'Takiveikata', email: 'laisa.t@email.com', branch: 'Suva', gender: 'Female', isNew: true, status: 'contacted', months: 2 },
      { first: 'Epeli', last: 'Gonedua', phone: '9608877', branch: 'Taveuni', gender: 'Male', isNew: false, status: 'active', months: 16 },
      { first: 'Melaia', last: 'Cagilaba', branch: 'Taveuni', gender: 'Female', isNew: false, status: 'active', months: 19 },
      { first: 'Aporosa', last: 'Rasiga', phone: '9621122', branch: 'Taveuni', gender: 'Male', isNew: true, status: 'not_contacted', months: 0 },
      { first: 'Suliana', last: 'Dravou', email: 'suliana.d@email.com', branch: 'Taveuni', gender: 'Female', isNew: false, status: 'active', months: 11 },
    ]
    for (const m of members) {
      await sql`
        INSERT INTO members (first_name, last_name, email, phone, branch_id, gender, is_new_member, follow_up_status, created_by, join_date)
        VALUES (${m.first}, ${m.last}, ${m.email ?? null}, ${m.phone ?? null}, ${bm[m.branch]},
          ${m.gender}, ${m.isNew}, ${m.status}, ${adminId},
          (NOW() - (${m.months} * INTERVAL '1 month'))::date)
        ON CONFLICT DO NOTHING
      `
    }
    results.push(`Members: ${members.length} seeded`)

    // ── FINANCE ENTRIES ───────────────────────────────────────────────────────
    const finance = [
      { type: 'income', cat: 'Tithe', amt: 850, desc: 'Sunday tithe collection', branch: 'Sabeto', days: 7 },
      { type: 'income', cat: 'Offering', amt: 420, desc: 'Sunday morning offering', branch: 'Sabeto', days: 7 },
      { type: 'income', cat: 'Tithe', amt: 920, desc: 'Sunday tithe collection', branch: 'Sabeto', days: 14 },
      { type: 'income', cat: 'Donation', amt: 500, desc: 'Anonymous donation', branch: 'Sabeto', days: 20 },
      { type: 'expense', cat: 'Utilities', amt: 180, desc: 'Electricity bill March', branch: 'Sabeto', days: 5 },
      { type: 'expense', cat: 'Supplies', amt: 95, desc: 'Stationery and printing', branch: 'Sabeto', days: 12 },
      { type: 'income', cat: 'Tithe', amt: 630, desc: 'Sunday tithe collection', branch: 'Dreketi', days: 7 },
      { type: 'income', cat: 'Offering', amt: 310, desc: 'Sunday offering', branch: 'Dreketi', days: 7 },
      { type: 'income', cat: 'Fundraiser', amt: 1200, desc: 'Church fundraiser dinner', branch: 'Dreketi', days: 15 },
      { type: 'expense', cat: 'Transport', amt: 220, desc: 'Pastor transport allowance', branch: 'Dreketi', days: 3 },
      { type: 'expense', cat: 'Maintenance', amt: 350, desc: 'Roof repair', branch: 'Dreketi', days: 25 },
      { type: 'income', cat: 'Tithe', amt: 510, desc: 'Sunday tithe collection', branch: 'Lau', days: 7 },
      { type: 'income', cat: 'Offering', amt: 280, desc: 'Sunday offering', branch: 'Lau', days: 7 },
      { type: 'expense', cat: 'Supplies', amt: 75, desc: 'Communion supplies', branch: 'Lau', days: 10 },
      { type: 'income', cat: 'Tithe', amt: 1850, desc: 'Sunday tithe collection', branch: 'Suva', days: 7 },
      { type: 'income', cat: 'Offering', amt: 760, desc: 'Sunday morning offering', branch: 'Suva', days: 7 },
      { type: 'income', cat: 'Tithe', amt: 2100, desc: 'Sunday tithe collection', branch: 'Suva', days: 14 },
      { type: 'income', cat: 'Donation', amt: 1500, desc: 'Donor gift — Building Fund', branch: 'Suva', days: 20 },
      { type: 'income', cat: 'Fundraiser', amt: 3200, desc: 'Annual gala fundraiser', branch: 'Suva', days: 30 },
      { type: 'expense', cat: 'Salary', amt: 1800, desc: 'Pastor salary — March', branch: 'Suva', days: 1 },
      { type: 'expense', cat: 'Rent', amt: 2500, desc: 'Church hall rent — March', branch: 'Suva', days: 1 },
      { type: 'expense', cat: 'Utilities', amt: 380, desc: 'Electricity and water', branch: 'Suva', days: 8 },
      { type: 'expense', cat: 'Events', amt: 450, desc: 'Youth conference materials', branch: 'Suva', days: 18 },
      { type: 'income', cat: 'Tithe', amt: 720, desc: 'Sunday tithe collection', branch: 'Taveuni', days: 7 },
      { type: 'income', cat: 'Offering', amt: 360, desc: 'Sunday offering', branch: 'Taveuni', days: 7 },
      { type: 'expense', cat: 'Transport', amt: 180, desc: 'Inter-island travel', branch: 'Taveuni', days: 5 },
      { type: 'expense', cat: 'Maintenance', amt: 290, desc: 'Sound system repair', branch: 'Taveuni', days: 22 },
    ]
    for (const f of finance) {
      await sql`
        INSERT INTO finance_entries (entry_type, category, amount, description, branch_id, entry_date, created_by)
        VALUES (${f.type}, ${f.cat}, ${f.amt}, ${f.desc}, ${bm[f.branch]},
          (NOW() - (${f.days} * INTERVAL '1 day'))::date, ${adminId})
      `
    }
    results.push(`Finance: ${finance.length} entries seeded`)

    // ── EVENTS ────────────────────────────────────────────────────────────────
    const events = [
      { title: 'Easter Sunday Service', desc: 'Celebrate the resurrection of Jesus Christ with us. All welcome!', branch: 'Suva', days: -20, loc: 'Suva Main Hall', pub: true },
      { title: 'Youth Conference 2026', desc: 'Annual youth gathering across all WOL Fiji branches. Theme: Unshakeable Faith.', branch: 'Suva', days: -45, loc: 'WOL Suva', pub: true },
      { title: 'Sabeto Branch Anniversary', desc: 'Celebrating 5 years of WOL Sabeto with praise, worship and community.', branch: 'Sabeto', days: 5, loc: 'Sabeto Church Hall', pub: true },
      { title: 'Community Outreach Day', desc: 'Serving the Dreketi community with food, prayer and fellowship.', branch: 'Dreketi', days: 10, loc: 'Dreketi Town Centre', pub: true },
      { title: 'Worship Night', desc: 'An evening of worship and prayer. Open to all branches.', branch: 'Suva', days: 15, loc: 'WOL Suva Main Hall', pub: true },
      { title: 'Lau Branch Dedication', desc: 'Dedication service for new meeting space in Lau.', branch: 'Lau', days: 22, loc: 'Lau Group, Fiji', pub: true },
      { title: 'Pastors Monthly Meeting', desc: 'Monthly pastors and leaders meeting.', branch: 'Suva', days: 7, loc: 'WOL Suva Office', pub: false },
      { title: 'Taveuni Baptism Service', desc: 'Water baptism service for new believers in Taveuni.', branch: 'Taveuni', days: 28, loc: 'Taveuni Beach', pub: true },
      { title: 'Bible Study Marathon', desc: 'All-day Bible study — book of Romans. Bring your lunch!', branch: 'Sabeto', days: 35, loc: 'Sabeto Hall', pub: true },
      { title: 'Finance Team Review', desc: 'Quarterly finance review across all branches.', branch: 'Suva', days: 14, loc: 'Suva Office', pub: false },
    ]
    for (const e of events) {
      await sql`
        INSERT INTO events (title, description, event_date, start_time, end_time, branch_id, location, is_public, created_by)
        VALUES (${e.title}, ${e.desc},
          (NOW() + (${e.days} * INTERVAL '1 day'))::date,
          '10:00', '13:00', ${bm[e.branch]}, ${e.loc}, ${e.pub}, ${adminId})
      `
    }
    results.push(`Events: ${events.length} seeded`)

    // ── PRAYER REQUESTS ───────────────────────────────────────────────────────
    const prayers = [
      { name: 'Mere T.', req: "Please pray for my mother's recovery from surgery.", branch: 'Sabeto', anon: false, status: 'new' },
      { name: 'Anonymous', req: 'Prayer for financial breakthrough for my family.', branch: 'Suva', anon: true, status: 'new' },
      { name: 'Josaia V.', req: 'Guidance for my career decision — moving to Australia.', branch: 'Suva', anon: false, status: 'prayed' },
      { name: 'Litia K.', req: 'Marriage restoration. Please pray for my husband and I.', branch: 'Dreketi', anon: false, status: 'new' },
      { name: 'Epeli R.', req: 'Healing for my son who has been ill for 3 weeks.', branch: 'Taveuni', anon: false, status: 'prayed' },
      { name: 'Anonymous', req: 'Safety for my sister travelling overseas.', branch: 'Lau', anon: true, status: 'new' },
      { name: 'Sela M.', req: 'Wisdom for our church leadership team.', branch: 'Sabeto', anon: false, status: 'prayed' },
      { name: 'Waisale N.', req: 'Prayer for my business to prosper so I can give more to the church.', branch: 'Suva', anon: false, status: 'new' },
    ]
    for (const p of prayers) {
      await sql`
        INSERT INTO prayer_requests (name, request, is_anonymous, status, branch_id)
        VALUES (${p.name}, ${p.req}, ${p.anon}, ${p.status}, ${bm[p.branch]})
      `
    }
    results.push(`Prayer requests: ${prayers.length} seeded`)

    // ── CONTACT MESSAGES ──────────────────────────────────────────────────────
    const contacts = [
      { name: 'David Sharma', email: 'david.s@email.com', subj: 'Visiting from New Zealand', msg: 'Hi, I will be in Fiji next month and would love to attend a service. Which branch is closest to Nadi town?', branch: 'Sabeto', read: false },
      { name: 'Jennifer Lee', email: 'jlee@email.com', subj: 'Online donation query', msg: 'Hello, I would like to donate to support the church but I am overseas. How can I give online?', branch: 'Suva', read: true },
      { name: 'Tomasi Vuniwawa', email: 'tomasi.v@email.com', phone: '9701234', subj: 'Joining the music team', msg: 'I play keyboard and would love to join the worship team. Who can I speak to?', branch: 'Suva', read: false },
      { name: 'Grace Patel', email: 'grace.p@gmail.com', subj: 'Marriage counselling', msg: 'We are a young couple looking for pre-marriage counselling. Does your church offer this?', branch: 'Suva', read: false },
      { name: 'Isireli Cama', email: 'isi.cama@email.com', phone: '9712233', subj: 'Events calendar', msg: 'Is there a way to get notified of upcoming events? We would love to bring our youth group.', branch: 'Dreketi', read: true },
    ]
    for (const c of contacts) {
      await sql`
        INSERT INTO contact_messages (name, email, phone, subject, message, branch_id, is_read)
        VALUES (${c.name}, ${c.email}, ${c.phone ?? null}, ${c.subj}, ${c.msg}, ${bm[c.branch]}, ${c.read})
      `
    }
    results.push(`Contact messages: ${contacts.length} seeded`)

    // ── MUSICIANS ─────────────────────────────────────────────────────────────
    const musicians = [
      { name: 'Atunaisa Waqa', instruments: ['Guitar'], specialty: 'Guitar', bio: 'Lead guitarist and music director with over 10 years of worship experience across WOL Fiji.', branch: 'Sabeto' },
      { name: 'Josaia Tuilagi', instruments: ['Bass'], specialty: 'Bass', bio: 'Bass guitarist serving at WOL Sabeto. Passionate about creating the foundation for worship.', branch: 'Sabeto' },
      { name: 'Epeli Naisara', instruments: ['Drums'], specialty: 'Drums', bio: 'Drummer with 7 years experience in gospel and contemporary worship.', branch: 'Sabeto' },
      { name: 'Mere Vunibobo', instruments: ['Keyboard'], specialty: 'Keyboard', bio: 'Keyboard player and arranger, trained in both classical and contemporary worship styles.', branch: 'Sabeto' },
      { name: 'Timoci Cakau', instruments: ['Trumpet'], specialty: 'Trumpet/Flute', bio: 'Trumpet player bringing a powerful brass dimension to WOL worship.', branch: 'Sabeto' },
      { name: 'Ana Seru', instruments: ['Vocals'], specialty: 'Singers', bio: 'Lead vocalist with a powerful soprano voice that lifts every service.', branch: 'Sabeto' },
      { name: 'Litia Bainivalu', instruments: ['Vocals'], specialty: 'Singers', bio: 'Backing vocalist and choir section leader with a heart for worship.', branch: 'Sabeto' },
      { name: 'Laisa Tora', instruments: ['Vocals'], specialty: 'Singers', bio: 'Alto vocalist, passionate about harmony and creating depth in worship.', branch: 'Sabeto' },
      { name: 'Suliana Naisilisili', instruments: ['Vocals'], specialty: 'Singers', bio: 'Soprano vocalist and youth worship leader.', branch: 'Sabeto' },
      { name: 'Vasiti Rokotuivuna', instruments: ['Vocals'], specialty: 'Singers', bio: 'Backing vocalist with a gift for harmonizing and congregational song leading.', branch: 'Sabeto' },
      { name: 'Makereta Drodrolagi', instruments: ['Vocals'], specialty: 'Singers', bio: 'Alto and occasional lead vocalist, faithful member of the WOL worship team.', branch: 'Sabeto' },
      { name: 'Rusiate Gonedua', instruments: ['Sound'], specialty: 'Sound Engineer', bio: 'Sound engineer and audio technician ensuring every service sounds its best.', branch: 'Sabeto' },
    ]
    for (const m of musicians) {
      await sql`
        INSERT INTO musicians (name, instruments, instrument_specialty, bio, branch_id, is_active)
        VALUES (${m.name}, ${m.instruments}, ${m.specialty}, ${m.bio}, ${bm[m.branch]}, true)
        ON CONFLICT DO NOTHING
      `
    }
    results.push(`Musicians: ${musicians.length} seeded`)

    return NextResponse.json({ success: true, results })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message, results }, { status: 500 })
  }
}
