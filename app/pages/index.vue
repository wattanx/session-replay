<script setup lang="ts">
import { record } from "rrweb";
import type { eventWithTime } from "@rrweb/types";
import { ref, reactive } from "vue";

const events = ref<eventWithTime[]>([]);
let stopFn: (() => void) | null | undefined = null;

const handleRecord = () => {
  if (stopFn) {
    stopFn();
    stopFn = null;
  } else {
    stopFn = record({
      emit: (event) => {
        events.value.push(event);
      },
      sampling: {
        mousemove: 100,
        mouseInteraction: false,
        scroll: 150,
        media: 800,
        input: "last",
      },
    });
  }
};

const handleStop = async () => {
  if (stopFn) {
    stopFn();
    stopFn = null;

    const eventSaveResult = await $fetch("/api/replay", {
      method: "POST",
      body: {
        eventId: crypto.randomUUID(),
        events: events.value,
      },
    });

    if (!eventSaveResult.success) {
      throw new Error("Failed to save events");
    }
  }
};

// Form state
const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});

const isSubmitting = ref(false);
const successMessage = ref("");

// Form submission
const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // Simulate API call

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset form after successful submission
    Object.keys(form).forEach((key) => {
      if (key === "terms") {
        form[key] = false;
      } else {
        // @ts-expect-error
        form[key] = "";
      }
    });

    successMessage.value = "Account created successfully! You can now sign in.";

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  } catch (error) {
    console.error("Signup error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex justify-center gap-4 py-8">
      <button
        @click="handleRecord"
        class="bg-neutral-800 px-4 py-1 rounded-lg text-white active:scale-95 active:transition-transform active:duration-100"
      >
        Record
      </button>
      <button
        @click="handleStop"
        class="px-4 py-1 rounded-lg bg-red-500 text-white active:scale-95 active:transition-transform active:duration-100"
      >
        Stop
      </button>
    </div>
    <div class="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Join us today and get started
          </p>
        </div>

        <div
          v-if="successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Full Name</label
              >
              <input
                id="name"
                name="name"
                type="text"
                v-model="form.name"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email address</label
              >
              <input
                id="email"
                name="email"
                type="email"
                v-model="form.email"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <input
                id="password"
                name="password"
                type="password"
                v-model="form.password"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700"
                >Confirm Password</label
              >
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                v-model="form.confirmPassword"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              v-model="form.terms"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the
              <a
                href="#"
                class="font-medium text-emerald-600 hover:text-emerald-500"
                >Terms and Conditions</a
              >
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <span
                v-if="isSubmitting"
                class="absolute left-0 inset-y-0 flex items-center pl-3"
              >
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ isSubmitting ? "Signing up..." : "Sign up" }}
            </button>
          </div>
        </form>

        <div class="text-sm text-center">
          <p class="text-gray-600">
            Already have an account?
            <a
              href="#"
              class="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
