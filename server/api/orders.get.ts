import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.printfulToken

  if (!token) {
    throw createError({ statusCode: 500, message: 'Printful token not configured' })
  }

  try {
    const response = await fetch('https://api.printful.com/orders?limit=20', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw createError({ statusCode: response.status, message: `Printful API error: ${response.statusText}` })
    }

    const data = await response.json()
    return data
  } catch (err: any) {
    throw createError({ statusCode: 502, message: err.message || 'Failed to fetch orders from Printful' })
  }
})
