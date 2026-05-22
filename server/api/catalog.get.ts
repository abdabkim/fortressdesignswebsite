import { defineEventHandler, createError } from 'h3'

const PRINTFUL_API_BASE = 'https://api.printful.com'

export default defineEventHandler(async (event) => {
  try {
    const token = process.env.PRINTFUL_TOKEN
    
    if (!token) {
      throw createError({
        statusCode: 500,
        statusMessage: 'PRINTFUL_TOKEN not configured'
      })
    }

    const response = await fetch(`${PRINTFUL_API_BASE}/sync/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw createError({
        statusCode: response.status,
        statusMessage: 'Printful API error',
        data: { details: errorData }
      })
    }

    const data = await response.json()
    return data

  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: { message: error.message || 'Unknown error' }
    })
  }
})
