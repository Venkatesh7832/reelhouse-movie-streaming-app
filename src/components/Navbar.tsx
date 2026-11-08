import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { useAuth } from '../store/auth.store'
const links = [['/', 'Home'], ['/movies', 'Movies'], ['/tv', 'TV Shows'], ['/watchlist', 'My Watchlist'], ['/history', 'History']]
export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth(); const nav = useNavigate()
  const cls = ({ isActive }: { isActive: boolean }) => `text-sm transition ${isActive ? 'text-white' : 'text-muted hover:text-white'}`
  return (
    <header className="glass fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex h-16 items-center gap-6 px-4 md:px-10" aria-label="Main">
        <Link to="/" className="font-display text-2xl font-extrabold">Reel<span className="text-accent">house</span></Link>
        <div className="hidden gap-6 md:flex">{links.map(([to, l]) => <NavLink key={to} to={to} end className={cls}>{l}</NavLink>)}</div>
        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Search" onClick={() => nav('/search')} className="rounded-full p-2 hover:bg-white/10"><Search size={20} /></button>
          {user ? <div className="group relative"><button onClick={() => nav("/profile")} className="grid h-9 w-9 place-items-center rounded-full bg-accent font-semibold" aria-label="Open profile">{user.name[0]?.toUpperCase()}</button>
            <div className="glass invisible absolute right-0 mt-2 w-44 rounded-xl p-2 text-sm group-focus-within:visible group-hover:visible"><p className="truncate px-2 py-1 text-muted">{user.email}</p><button className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-white/10" onClick={() => { logout(); nav('/') }}>Sign out</button></div></div>
            : <Link to="/login" className="btn bg-accent">Sign in</Link>}
          <button className="md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {open && <div className="flex flex-col gap-3 px-4 pb-4 md:hidden">{links.map(([to, l]) => <NavLink key={to} to={to} end className={cls} onClick={() => setOpen(false)}>{l}</NavLink>)}</div>}
    </header>)
}
