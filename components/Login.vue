<template>
  <div class="login-container" v-if="!logged">
    <form class="login-form" @submit.prevent="login">
      <h2>Login</h2>
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          v-model="username"
          type="text"
          id="username"
          name="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          name="password"
          required
        />
      </div>
      <div class="row">
        <button type="submit" class="button">Login</button>
        <button
          @click="loginWebAuth"
          v-if="credentialId"
          class="button"
          type="button"
        >
          Log in with biometrics
        </button>
      </div>
    </form>
  </div>
  <div v-else>
    <Account :email="username" @logout="logged = false" />
  </div>
</template>

<script setup lang="ts">
import { client } from "@passwordless-id/webauthn";
const username = ref();
const password = ref();
const logged = ref(false);
const credentialId = useCookie("credential");

const login = () => {
  logged.value = true;
};

const loginWebAuth = async () => {
  const { data: challenge } = await $fetch("/api/challenge");

  let res = await client.authenticate(
    credentialId.value ? [credentialId.value] : [],
    challenge,
    { authType: "auto" }
  );

  const data = await $fetch("/api/login", {
    method: "post",
    body: { ...res, challenge },
  });

  login();
  username.value = data.email;
};
</script>

<style scoped>
.login-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
}

.login-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  background-color: #45a049;
}
.row {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
