import Footer from './components/Footer'
import Header from './components/Header'
import Rotas from './routes'
import { GlobalCss } from './styles'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalCss />
        <Header />
        <Rotas />
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
