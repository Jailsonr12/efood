type CheckoutPayload = {
  products: Array<{
    id: number
    price: number
  }>
  delivery: {
    receiver: string
    address: {
      description: string
      city: string
      zipCode: string
      number: number
      complement: string
    }
  }
  payment: {
    card: {
      name: string
      number: string
      code: number
      expires: {
        month: number
        year: number
      }
    }
  }
}

type CheckoutResponse = {
  orderId: string
}

const API_URL = 'https://api-ebac.vercel.app/api/efood'

export const checkout = async (
  payload: CheckoutPayload
): Promise<CheckoutResponse> => {
  const response = await fetch(`${API_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Checkout request failed')
  }

  return response.json()
}
