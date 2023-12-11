import { server } from '@passwordless-id/webauthn';
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 1. Valid time for challenge token

  const expected = {
    challenge: body.challenge,
    origin:
      process.env.CREDENTIAL_URL ?? ''
  };

  // 2. verify

  const registrationParsed = await server.verifyRegistration(body, expected);

  // *** 3. Save credential for db ***

   const supabase = createClient(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_ANON_KEY ?? ''
  )

  await supabase
    .from('users')
    .insert({ credential_id: body.credential.id, credential:  JSON.stringify({...registrationParsed.credential, email: body.email})})

  // ***

  return registrationParsed;
});
