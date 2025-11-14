import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { ShoppingCart, User, Search, LogIn, BadgePercent, Flame, Star } from 'lucide-react'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function Navbar({ onLoginClick, onCartClick }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 backdrop-blur bg-white/60 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-semibold">
          <Flame className="h-6 w-6 text-blue-600" />
          ReUse Market
        </div>
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input placeholder="Search products..." className="w-full pl-9 pr-3 py-2 rounded-full bg-white/80 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLoginClick} className="px-3 py-2 rounded-full bg-white/80 border border-white/40 hover:bg-white transition flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </button>
          <button onClick={onCartClick} className="px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="relative h-[84vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/80 pointer-events-none" />
      <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/90 text-white text-sm shadow">
            <BadgePercent className="h-4 w-4" />
            Flash deals live now
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Buy and sell used goods with style
          </h1>
          <p className="mt-4 text-slate-700 text-lg">
            A vibrant marketplace for pre-loved items. Discover flash sales, manage your cart, and trade safely with verified profiles.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#flash" className="px-5 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition">Explore Flash Sales</a>
            <a href="#browse" className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition">Browse All</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ p, onAdd }) {
  const hasFlash = !!p.flash_sale
  const finalPrice = useMemo(() => {
    if (!hasFlash) return p.price
    const d = p.flash_sale.discount_percent
    return Math.max(0, p.price * (1 - d / 100))
  }, [p])

  return (
    <div className="group rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur p-4 hover:shadow-xl transition relative">
      {hasFlash && (
        <div className="absolute -top-2 -right-2 rounded-full bg-blue-600 text-white text-xs px-2 py-1 flex items-center gap-1 shadow">
          <BadgePercent className="h-3 w-3" /> {p.flash_sale.discount_percent}% off
        </div>
      )}
      <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-3 flex items-center justify-center text-slate-400">
        <Star className="h-10 w-10" />
      </div>
      <div className="font-semibold text-slate-900">{p.title}</div>
      <div className="text-sm text-slate-600 line-clamp-2">{p.description || 'No description'}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-lg font-bold text-slate-900">{formatPrice(finalPrice)}</div>
        {hasFlash && <div className="text-sm text-slate-500 line-through">{formatPrice(p.price)}</div>}
      </div>
      <button onClick={() => onAdd(p)} className="mt-3 w-full px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">Add to cart</button>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <a href="#browse" className="text-sm text-blue-600 hover:underline">See all</a>
      </div>
      {children}
    </section>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [flash, setFlash] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/products`).then(r => r.json()).then(setProducts)
    fetch(`${API_URL}/flash`).then(r => r.json()).then(setFlash)
  }, [])

  function ensureUser() {
    if (user) return user
    // Quick demo login or register with random email
    const email = `guest+${Math.random().toString(36).slice(2,7)}@example.com`
    return fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Guest', email, password: 'guestpass' })})
      .then(r => r.json())
      .then(() => fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'guestpass' })}))
      .then(r => r.json())
      .then((data) => { setUser(data.user); return data.user })
  }

  function addToCart(p) {
    ensureUser().then((u) => {
      fetch(`${API_URL}/cart/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: u.id, product_id: p.id, quantity: 1 })})
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <Navbar onLoginClick={() => {}} onCartClick={() => {}} />
      <Hero />

      <Section id="flash" title="Flash Sales">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flash.length === 0 && <div className="text-slate-600">No flash sales right now. Check back soon!</div>}
          {flash.map(p => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
          ))}
        </div>
      </Section>

      <Section id="browse" title="Browse All">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
          ))}
        </div>
      </Section>

      <footer className="py-12 text-center text-slate-500">© {new Date().getFullYear()} ReUse Market</footer>
    </div>
  )
}

export default App
