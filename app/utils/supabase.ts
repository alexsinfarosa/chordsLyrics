import {createClient} from '@supabase/supabase-js'

import type {Database} from 'db_types'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!)
