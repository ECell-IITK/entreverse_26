import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { connectDB } from './db.js';
import { ensureSeeded } from './seed.js';

const JWT_SECRET = process.env.JWT_SECRET || 'entreverse-super-secret-jwt-key-2026';
const JWT_TTL_HOURS = parseInt(process.env.JWT_TTL_HOURS || '8', 10);
const DUMMY_HASH = '$2a$10$dummydummydummydummydummydummydummydummydummydummyd';

export async function validateAdmin(username, password) {
  await connectDB();
  await ensureSeeded();

  const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
  if (!admin) {
    // Run bcrypt compare against dummy hash to prevent timing attacks
    await bcrypt.compare(password, DUMMY_HASH).catch(() => {});
    return false;
  }

  const matches = await bcrypt.compare(password, admin.password_hash);
  return matches;
}

export function issueToken(username) {
  return jwt.sign(
    { username, iss: 'entreverse-api' },
    JWT_SECRET,
    { expiresIn: `${JWT_TTL_HOURS}h` }
  );
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export function requireAdminAuth(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or malformed Authorization header', status: 401 };
  }

  const token = authHeader.replace(/^Bearer\s+/, '');
  const decoded = verifyToken(token);
  if (!decoded || !decoded.username) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  return { username: decoded.username };
}

export {
  validateAdmin as verifyAdminCredentials,
  issueToken as generateAdminToken,
  verifyToken as verifyAdminToken,
};
