<template>
  <div class="account-welcome">
    <h2>Welcome, {{ email }}!</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Id vitae totam
      aspernatur aut modi, est eum quae molestias nostrum enim, aliquam minus,
      ut quasi necessitatibus et. Sit libero quos fugit?
    </p>
    <div class="row">
      <button class="button" @click="registerWebAuth" v-if="!credentialId">
        Allow biometric login
      </button>
      <button class="button" @click="emit('logout')">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { client } from "@passwordless-id/webauthn";
interface Props {
  email: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{ logout: [] }>();
const credentialId = useCookie("credential");

const registerWebAuth = async () => {
  const { data: challenge } = await $fetch("/api/challenge");

  const registration = await client.register(props.email, challenge, {
    authenticatorType: "auto",
    userVerification: "required",
    timeout: 60000,
    attestation: false,
    userHandle: window.crypto.randomUUID(),
    debug: false,
  });

  credentialId.value = registration.credential.id;

  await $fetch("/api/register", {
    method: "post",
    body: { ...registration, challenge, email: props.email },
  });

  alert("Ready, you can log in using biometrics");
};
</script>

<style scoped>
.account-welcome {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
  margin: auto;
  margin-top: 20px;
}

.account-welcome h2 {
  margin-bottom: 20px;
  color: #333;
}

.user-info {
  margin-top: 15px;
}

.user-info p {
  margin-bottom: 10px;
  color: #555;
}

.button {
  background-color: #3490dc;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.row {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
