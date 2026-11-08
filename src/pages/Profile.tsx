import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, Clock3, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../store/auth.store'
import { useLibrary } from '../store/library.store'

export default function Profile() {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const watchlistCount = useLibrary((s) => s.watchlist.length)
  const historyCount = useLibrary((s) => s.history.length)
  const navigate = useNavigate()

  if (!user) return null

  return (
    <section className="min-h-screen px-4 pb-20 pt-28 md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-accent">YOUR ACCOUNT</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Profile</h1>
        <div className="glass mt-8 flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-accent text-3xl font-bold">{user.name.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0 flex-1"><h2 className="truncate text-xl font-semibold">{user.name}</h2><p className="truncate text-sm text-muted">{user.email}</p><p className="mt-2 text-xs text-muted">Local demo account · not connected to a secure backend</p></div>
          <button className="btn glass" onClick={() => { logout(); toast.success('Signed out'); navigate('/') }}><LogOut size={16} />Sign out</button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link to="/watchlist" className="glass rounded-2xl p-5 transition hover:border-accent/50"><Bookmark className="mb-3 text-accent" /><p className="text-2xl font-bold">{watchlistCount}</p><p className="text-sm text-muted">Saved titles</p></Link>
          <Link to="/history" className="glass rounded-2xl p-5 transition hover:border-accent/50"><Clock3 className="mb-3 text-accent" /><p className="text-2xl font-bold">{historyCount}</p><p className="text-sm text-muted">Watch history entries</p></Link>
        </div>
      </div>
    </section>
  )
}
