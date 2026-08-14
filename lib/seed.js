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

    // 2. Seed Competitions
    const compCount = await Competition.countDocuments();
    if (compCount === 0) {
      const ftfHash = await bcrypt.hash('FTF-2026-SECRET', 10);
      const tssHash = await bcrypt.hash('TSS-2026-SECRET', 10);
      const susHash = await bcrypt.hash('SUS-2026-SECRET', 10);

      await Competition.create([
        {
          id: 1,
          event_id: 1,
          name: 'Flip the Future',
          slug: 'flip-the-future',
          description: 'Strategic decision-making and smart investments are the keys to this challenge. Teams (preferably Y25s) will bid for the most promising opportunities from a set of firms, using provided summaries to evaluate options and outsmart competitors. Shortlisted teams will advance to the finale to present their portfolios and compete for exciting prizes.',
          max_team_size: 4,
          min_team_size: 2,
          registration_open: true,
          registration_code: ftfHash,
        },
        {
          id: 2,
          event_id: 1,
          name: 'The Strategy Showdown',
          slug: 'strategy-showdown',
          description: 'An opportunity to dive into the world of entrepreneurship, this challenge invites participants (preferably PGs) to step into the shoes of business innovators. Teams will explore real-world problems in different domains of business, unleash their creativity, and craft impactful solutions to transform problems into opportunities.',
          max_team_size: 4,
          min_team_size: 2,
          registration_open: true,
          registration_code: tssHash,
        },
        {
          id: 3,
          event_id: 1,
          name: 'Start-up Sprint',
          slug: 'startup-sprint',
          description: '"One Day One Idea Infinite Potential" — An intense full day challenge where teams transform ideas into MVPs and prototypes before sunrise. From brainstorming to building, every hour tests creativity, speed, and strategy. The most promising solutions will pitch at dawn for a chance to win big.',
          max_team_size: 5,
          min_team_size: 1,
          registration_open: true,
          registration_code: susHash,
        },
      ]);
      await Counter.findByIdAndUpdate('competitions', { $set: { seq: 3 } }, { upsert: true });
      console.log('Seeded 3 default competitions');
    }

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
