// ✅ Import Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// ✅ Supabase credentials
const supabaseUrl = 'https://lanfpeteyeffdamjogxc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhbnBmZXRleWVmZmRhbGpvZ3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTM5MzMsImV4cCI6MjA2OTYyOTkzM30.6RZIGqQ8ehcq2v93gwxif2UCmG0lkccvZ0j__W8BkQU'

// ✅ Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ Get form and message box
const form = document.getElementById('message-form')
const messagesDiv = document.getElementById('messages')

// ✅ Submit form to insert message
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const username = document.getElementById('username').value
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

// ✅ Load and display messages
async function loadMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  messagesDiv.innerHTML = ''
  if (data) {
    data.forEach(msg => {
      const div = document.createElement('div')
      div.innerHTML = `<strong>${msg.username}</strong>: ${msg.content} <br><small>${new Date(msg.created_at).toLocaleString()}</small><hr>`
      messagesDiv.appendChild(div)
    })
  }
}

loadMessages()
