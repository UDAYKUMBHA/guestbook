import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://lanpfeteyeffdaljogxc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhbnBmZXRleWVmZmRhbGpvZ3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTM5MzMsImV4cCI6MjA2OTYyOTkzM30.6RZIGqQ8ehcq2v93gwxif2UCmG0lkccvZ0j__W8BkQU'
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('message-form')
const messagesDiv = document.getElementById('messages')
const authBtn = document.getElementById('auth-btn')

// ✅ Load messages for all
async function loadMessages() {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  messagesDiv.innerHTML = ''
  data.forEach(msg => {
    const div = document.createElement('div')
    div.innerHTML = `<strong>${msg.username}</strong>: ${msg.content}<br><small>${new Date(msg.created_at).toLocaleString()}</small><hr>`
    messagesDiv.appendChild(div)
  })
}
loadMessages()

// ✅ Submit only if logged in
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const session = await supabase.auth.getSession()
  const user = session.data.session?.user
  if (!user) return alert("Login first to post")

  const username = user.email
  const content = document.getElementById('content').value

  const { error } = await supabase
    .from('messages')
    .insert([{ username, content }])

  if (error) {
    alert('❌ Error posting message!')
    console.error(error)
  } else {
    form.reset()
    loadMessages()
  }
})

// ✅ Login / Logout button (Updated with redirectTo option)
authBtn.addEventListener('click', async () => {
  const session = await supabase.auth.getSession()
  const user = session.data.session?.user

  if (user) {
    await supabase.auth.signOut()
    location.reload()
  } else {
    const email = prompt("Enter your email to login:")
    if (email) {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          redirectTo: 'https://udaykumbha.github.io/guestbook/' // 👉 यह crucial line है
        }
      })
      if (error) alert("Login error: " + error.message)
      else alert("Check your email for login link!")
    }
  }
})

// ✅ Toggle form visibility based on login
async function updateUI() {
  const session = await supabase.auth.getSession()
  const user = session.data.session?.user

  if (user) {
    form.style.display = 'flex'
    authBtn.textContent = `Logout (${user.email})`
  } else {
    form.style.display = 'none'
    authBtn.textContent = 'Login to Post Message'
  }
}
updateUI()



