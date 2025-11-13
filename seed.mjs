import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'

dotenv.config({ path: '.env.local' })

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing required environment variables:')
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseServiceRole) console.error('- SUPABASE_SERVICE_ROLE')
  console.error('\nPlease add these to your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRole)

const categories = [
  'Housing', 'Transport', 'Health', 'Food', 'Education', 'Other'
]

async function seedUsers() {
  console.log('🌱 Seeding users...')
  
  for (let i = 0; i < 5; i++) {
    try {
      const email = faker.internet.email()
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: 'password123!',
        email_confirm: true
      })
      
      if (error) {
        if (error.message.includes('already been registered')) {
          console.log(`⚠️  User with email ${email} already exists, skipping...`)
          continue
        }
        throw error
      }

      console.log(`✅ User ${i + 1}/5 added: ${email}`)
    } catch (e) {
      console.error(`❌ Error adding user ${i + 1}:`, e.message)
    }
  }
  
  console.log('👥 User seeding completed\n')
}

async function seed() {
  console.log('🚀 Starting database seeding...\n')
  
  await seedUsers()
  
  console.log('💰 Generating transactions...')
  let transactions = []
  const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers()

  if (listUsersError) {
    console.error('❌ Cannot list users, aborting:', listUsersError.message)
    return
  }

  if (!users || users.length === 0) {
    console.error('❌ No users found, cannot create transactions')
    return
  }

  const userIds = users.map(user => user.id)
  console.log(`📊 Found ${userIds.length} users, generating 100 transactions...`)

  for (let i = 0; i < 100; i++) {
    const created_at = faker.date.past({ years: 1 })
    let type, category = null
    const user_id = faker.helpers.arrayElement(userIds)
    const typeBias = Math.random()

    if (typeBias < 0.80) {
      type = 'Expense'
      category = faker.helpers.arrayElement(categories)
    } else if (typeBias < 0.90) {
      type = 'Income'
    } else {
      type = faker.helpers.arrayElement(['Saving', 'Investment'])
    }

    let amount
    switch (type) {
      case 'Income':
        amount = faker.number.int({ min: 2000, max: 9000 })
        break
      case 'Expense':
        amount = faker.number.int({ min: 10, max: 1000 })
        break
      case 'Investment':
      case 'Saving':
        amount = faker.number.int({ min: 300, max: 5000 })
        break
    }

    transactions.push({
      created_at: created_at.toISOString(),
      amount,
      type,
      description: faker.lorem.sentence(),
      category,
      user_id
    })
  }

  console.log('💾 Inserting transactions into database...')
  const { error } = await supabase.from('transactions').insert(transactions)

  if (error) {
    console.error('❌ Error inserting transactions:', error.message)
  } else {
    console.log(`✅ Successfully stored ${transactions.length} transactions`)
  }
  
  console.log('\n🎉 Database seeding completed!')
}

seed().catch(console.error)