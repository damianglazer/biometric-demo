import fs from 'node:fs';
import { createResolver } from '@nuxt/kit';
import { server } from '@passwordless-id/webauthn';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {

  const resolver = createResolver(import.meta.url);
  const body = await readBody(event);

  const expected = {
    challenge: body.challenge,
    origin:
      'http://localhost:3000',
    userVerified: true,
  };

  const db = JSON.parse(
    fs.readFileSync(resolver.resolve('../../db/static.json'), 'utf8')
  );

  const data = db[body.credentialId];

  const authenticationParsed = await server.verifyAuthentication(
    body,
    data.credential,
    expected
  );

  return {...authenticationParsed, email: data.email};
});
