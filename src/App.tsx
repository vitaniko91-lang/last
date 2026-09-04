import { BrowserRouter, Routes, Route } from 'react-router'
import { CartProvider } from './state/cart'
import { Layout } from './layout/Layout'
import { Home } from './pages/Home'
import { Catalogue } from './pages/Catalogue'
import { Product } from './pages/Product'
import { Configurator } from './pages/Configurator'
import { Cart } from './pages/Cart'
import { CaseStudy } from './pages/CaseStudy'

export function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogue" element={<Catalogue />} />
            <Route path="product/:sku" element={<Product />} />
            <Route path="configurator" element={<Configurator />} />
            <Route path="cart" element={<Cart />} />
            <Route path="case" element={<CaseStudy />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
