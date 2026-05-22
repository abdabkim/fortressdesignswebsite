import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const token = process.env.PRINTFUL_TOKEN
  if (token) {
    return { 
      status: 'Token loaded successfully', 
      token_present: true,
      token_length: token.length,
      message: 'Token is configured'
    }
  } else {
    return { 
      status: 'Token missing', 
      token_present: false,
      error: 'PRINTFUL_TOKEN not configured' 
    }
  }
})
