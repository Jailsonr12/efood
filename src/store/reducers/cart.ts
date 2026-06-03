import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type CartItem = {
  cartId: string
  productId: number
  title: string
  image: string
  price: number
}

type AddCartItemPayload = {
  productId: number
  title: string
  image: string
  price: number
}

type CartState = {
  isOpen: boolean
  items: CartItem[]
}

const initialState: CartState = {
  isOpen: false,
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
    addItem: {
      reducer: (state, action: PayloadAction<CartItem>) => {
        state.items.push(action.payload)
      },
      prepare: (payload: AddCartItemPayload) => ({
        payload: {
          cartId: `${payload.productId}-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,
          ...payload
        }
      })
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.cartId !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    }
  }
})

export const { addItem, clearCart, closeCart, openCart, removeItem } =
  cartSlice.actions

export default cartSlice.reducer
