import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { TrailerModal } from './components/TrailerModal'
import { useAuth } from './store/auth.store'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Details from './pages/Details'
import Search from './pages/Search'
import Library from './pages/Library'
import Login from './pages/Login'
import Profile from './pages/Profile'
import WatchHistory from './pages/WatchHistory'
import { Footer } from './components/Footer'
const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } })
function Protected({ children }: { children: ReactNode }) { const u = useAuth((s) => s.user); const loc = useLocation(); return u ? <>{children}</> : <Navigate to="/login" state={{ from: loc.pathname }} replace /> }

function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}

const NotFound = () => <div className="grid h-screen place-items-center text-center"><div><h1 className="font-display text-5xl">Page not found</h1><Link to="/" className="mt-4 inline-block text-accent">Back to home</Link></div></div>
export default function App() {
  return <QueryClientProvider client={qc}><MotionConfig reducedMotion="user"><BrowserRouter><ScrollTop /><Navbar /><main>
    <Routes><Route path="/" element={<Home />} /><Route path="/movies" element={<Browse type="movie" />} /><Route path="/tv" element={<Browse type="tv" />} />
      <Route path="/movie/:id" element={<Details type="movie" />} /><Route path="/tv/:id" element={<Details type="tv" />} /><Route path="/search" element={<Search />} />
      <Route path="/watchlist" element={<Protected><Library /></Protected>} /><Route path="/history" element={<Protected><WatchHistory /></Protected>} /><Route path="/profile" element={<Protected><Profile /></Protected>} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Login register />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer />
    <TrailerModal /><Toaster position="bottom-center" toastOptions={{ style: { background: '#191C26', color: '#fff' } }} /></BrowserRouter></MotionConfig></QueryClientProvider>
}
