import { Provider } from 'react-redux'
import Footer from './components/Footer'
import Header from './components/Header'
import CartSidebar from './components/CartSidebar'
import Rotas from './routes'
import { store } from './store'
import { GlobalCss } from './styles'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalCss />
        <Header />
        <Rotas />
        <CartSidebar />
        <Footer />
      </BrowserRouter>
    </Provider>
  )
}

export default App
