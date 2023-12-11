import crypto from 'node:crypto';

export default defineEventHandler(() => {
  // A time token, e.g. JWT, should be generated in production
  return { data: crypto.randomUUID() };
});
