import bcrypt from 'bcryptjs';
import Event from '../models/Event.js';
import Competition from '../models/Competition.js';
import Admin from '../models/Admin.js';
import Counter from '../models/Counter.js';

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@IITK2026';

const SEEDED_ADMINS = [
  { username: 'admin', password: DEFAULT_PASSWORD },
  { username: 'ecell@iitk.ac.in', password: DEFAULT_PASSWORD },
  { username: 'mohit@ecell.com', password: DEFAULT_PASSWORD },
  { username: 'rajc25@iitk.ac.in', password: DEFAULT_PASSWORD },
  { username: 'anand@ecelliitk.com', password: DEFAULT_PASSWORD },
  { username: 'hirani@ecelliitk.com', password: DEFAULT_PASSWORD },
];

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;

  try {
    // 1. Seed Event
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.create({
        id: 1,
        name: 'EntreVerse 2026',
        slug: 'entreverse-2026',
        description: "E-Cell IITK's flagship entrepreneurship fest featuring competitions, talks, and workshops.",
        is_active: true,
      });
      await Counter.findByIdAndUpdate('events', { $set: { seq: 1 } }, { upsert: true });
      console.log('Seeded initial EntreVerse 2026 event');
    }

    // 2. Seed / Sync Fixed Competitions
    const ftfHash = await bcrypt.hash('FTF-2026-SECRET', 10);
    const tssHash = await bcrypt.hash('TSS-2026-SECRET', 10);
    const susHash = await bcrypt.hash('SUS-2026-SECRET', 10);

    const defaultComps = [
      {
        id: 1,
        event_id: 1,
        name: 'Venture And Verdict',
        slug: 'venture-and-verdict',
        description: 'Step into early-stage venture capital. Analyze startup balance sheets, bid in live auction rounds, and pitch to senior VC partners.',
        max_team_size: 4,
        min_team_size: 2,
        registration_open: true,
        registration_code: ftfHash,
      },
      {
        id: 2,
        event_id: 1,
        name: 'Startup Builder',
        slug: 'startup-builder',
        description: 'Tackle live business crises. Unravel supply chain and market bottlenecks, then present turnaround roadmaps to corporate leaders.',
        max_team_size: 4,
        min_team_size: 2,
        registration_open: true,
        registration_code: tssHash,
      },
      {
        id: 3,
        event_id: 1,
        name: 'Start-up-Sprint',
        slug: 'start-up-sprint',
        description: '24 hours on the clock. Whiteboard sketch to working MVP before dawn. Demo live to angels for instant SIIC incubation backing.',
        max_team_size: 5,
        min_team_size: 1,
        registration_open: true,
        registration_code: susHash,
      },
    ];

    for (const comp of defaultComps) {
      await Competition.updateOne(
        { id: comp.id },
        {
          $set: {
            event_id: comp.event_id,
            name: comp.name,
            slug: comp.slug,
            description: comp.description,
            max_team_size: comp.max_team_size,
            min_team_size: comp.min_team_size,
            registration_open: comp.registration_open,
          },
          $setOnInsert: {
            id: comp.id,
            registration_code: comp.registration_code,
          },
        },
        { upsert: true }
      );
    }
    await Counter.findByIdAndUpdate('competitions', { $set: { seq: 3 } }, { upsert: true });

    // 3. Seed Admins
    for (const admin of SEEDED_ADMINS) {
      const hash = await bcrypt.hash(admin.password, 10);
      await Admin.updateOne(
        { username: admin.username },
        { $set: { username: admin.username, password_hash: hash } },
        { upsert: true }
      );
    }

    seeded = true;
  } catch (err) {
    console.error('Database seeding error:', err);
  }
}

export { ensureSeeded as seedDatabase };
