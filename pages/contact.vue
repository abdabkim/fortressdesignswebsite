<template>
  <div class="min-h-screen" style="background:#faf9ff;">
    <AppNavbar />

    <!-- Header -->
    <section style="background:linear-gradient(135deg,#6C2BD9 0%,#D946EF 100%);padding:72px 20px;text-align:center;">
      <div style="max-width:600px;margin:0 auto;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:9999px;padding:6px 16px;font-size:0.8rem;color:#fff;font-weight:500;margin-bottom:20px;">
          📬 Get In Touch
        </div>
        <h1 style="font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#fff;margin:0 0 14px;">Contact Us</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:1rem;margin:0;line-height:1.7;">
          Have a question, collab idea, or just want to say hello? We'd love to hear from you.
        </p>
      </div>
    </section>

    <!-- Form + Info -->
    <section style="max-width:1000px;margin:0 auto;padding:60px 20px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;">

        <!-- Contact form -->
        <div style="background:#fff;border:1.5px solid #ede5ff;border-radius:24px;padding:36px;box-shadow:0 4px 24px rgba(108,43,217,0.07);">
          <h2 style="font-size:1.3rem;font-weight:700;color:#111;margin:0 0 24px;">Send a Message</h2>

          <form @submit.prevent="submitForm" style="display:flex;flex-direction:column;gap:18px;">
            <div>
              <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:6px;">Your Name</label>
              <input v-model="form.name" type="text" placeholder="John Doe" required
                style="width:100%;padding:12px 14px;border:1.5px solid #ede5ff;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
                @focus="e => e.target.style.borderColor='#6C2BD9'"
                @blur="e => e.target.style.borderColor='#ede5ff'" />
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:6px;">Email Address</label>
              <input v-model="form.email" type="email" placeholder="john@example.com" required
                style="width:100%;padding:12px 14px;border:1.5px solid #ede5ff;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
                @focus="e => e.target.style.borderColor='#6C2BD9'"
                @blur="e => e.target.style.borderColor='#ede5ff'" />
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:6px;">Subject</label>
              <input v-model="form.subject" type="text" placeholder="What's on your mind?"
                style="width:100%;padding:12px 14px;border:1.5px solid #ede5ff;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s;"
                @focus="e => e.target.style.borderColor='#6C2BD9'"
                @blur="e => e.target.style.borderColor='#ede5ff'" />
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:6px;">Message</label>
              <textarea v-model="form.message" placeholder="Tell us more…" rows="5" required
                style="width:100%;padding:12px 14px;border:1.5px solid #ede5ff;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;resize:vertical;transition:border-color 0.15s;"
                @focus="e => e.target.style.borderColor='#6C2BD9'"
                @blur="e => e.target.style.borderColor='#ede5ff'"></textarea>
            </div>

            <button type="submit"
              style="width:100%;padding:13px;background:#6C2BD9;color:#fff;border:none;border-radius:12px;font-size:0.95rem;font-weight:700;cursor:pointer;transition:background 0.15s;"
              @mouseenter="e => e.target.style.background='#5a23b8'"
              @mouseleave="e => e.target.style.background='#6C2BD9'">
              {{ sent ? '✓ Message Sent!' : 'Send Message' }}
            </button>
          </form>
        </div>

        <!-- Info -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div v-for="item in contactInfo" :key="item.label"
            style="background:#fff;border:1.5px solid #ede5ff;border-radius:20px;padding:24px;display:flex;align-items:flex-start;gap:16px;box-shadow:0 2px 12px rgba(108,43,217,0.05);">
            <div style="width:44px;height:44px;border-radius:12px;background:#f5f0ff;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">{{ item.icon }}</div>
            <div>
              <div style="font-size:0.82rem;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">{{ item.label }}</div>
              <div style="font-size:0.95rem;font-weight:600;color:#111;">{{ item.value }}</div>
            </div>
          </div>

          <!-- Social -->
          <div style="background:linear-gradient(135deg,#6C2BD9,#D946EF);border-radius:20px;padding:28px;text-align:center;">
            <div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:16px;">Follow Fortress Designs</div>
            <div style="display:flex;justify-content:center;gap:14px;">
              <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noopener noreferrer"
                style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1rem;text-decoration:none;transition:background 0.15s;"
                @mouseenter="e => e.currentTarget.style.background='rgba(255,255,255,0.35)'"
                @mouseleave="e => e.currentTarget.style.background='rgba(255,255,255,0.2)'"
                :title="s.label">{{ s.icon }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({ layout: false })

const sent = ref(false)
const form = ref({ name: '', email: '', subject: '', message: '' })

function submitForm() {
  // Placeholder — wire to your backend / email service
  sent.value = true
  setTimeout(() => {
    sent.value = false
    form.value = { name: '', email: '', subject: '', message: '' }
  }, 3000)
}

const contactInfo = [
  { icon: '📧', label: 'Email',    value: 'hello@fortressdesigns.com' },
  { icon: '📍', label: 'Location', value: 'United States'              },
  { icon: '⏰', label: 'Response', value: 'Within 24–48 hours'         },
]

const socials = [
  { icon: '▶', label: 'YouTube',   href: 'https://www.youtube.com/@FortressDesigns' },
  { icon: '📸', label: 'Instagram', href: 'https://instagram.com'                    },
  { icon: '𝕏',  label: 'Twitter',  href: 'https://twitter.com'                      },
]
</script>

<style scoped>
@media (max-width: 640px) {
  section > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}
</style>
