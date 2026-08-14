/**
 * Security utilities: Rate Limiting, Input Sanitization, and Validation
 */

// In-memory sliding window rate limiter
const rateLimitMap = new Map();

// Cleanup expired buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a client IP has exceeded the allowed request limit
 * @param {string} ip - Client IP
 * @param {string} prefix - Action prefix (e.g. 'login', 'register')
 * @param {number} maxRequests - Max allowed requests in window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function checkRateLimit(ip, prefix = 'general', maxRequests = 20, windowMs = 60 * 1000) {
  const now = Date.now();
  const key = `${prefix}:${ip}`;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(key, newRecord);
    return { allowed: true, remaining: maxRequests - 1, resetTime: newRecord.resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Extract client IP from Next.js request headers
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Sanitize text against XSS, control characters, and injection
 * @param {string} input
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeText(input, maxLength = 255) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip angle brackets to block basic HTML injection
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove dangerous ASCII control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate email format with strict RFC 5322 standard regex
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 120;
}

/**
 * Validate phone number format
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Escape regular expression special characters to prevent ReDoS / NoSQL injection
 * @param {string} string
 * @returns {string}
 */
export function escapeRegex(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
