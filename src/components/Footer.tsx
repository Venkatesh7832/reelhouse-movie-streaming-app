import { Link } from 'react-router-dom'
import { Clapperboard, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 px-4 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold"><Clapperboard size={20} className="text-accent" />Reel<span className="text-accent">house</span></Link>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">Discover movies and television. Metadata and images are provided by TMDB. This product is not endorsed or certified by TMDB.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted"><Link className="hover:text-white" to="/movies">Movies</Link><Link className="hover:text-white" to="/tv">TV Shows</Link><Link className="hover:text-white" to="/watchlist">Watchlist</Link><Link className="hover:text-white" to="/history">History</Link></div>
      </div>
      <p className="mx-auto mt-8 flex max-w-7xl items-center gap-1 text-xs text-muted">Made for movie lovers <Heart size={12} className="fill-accent text-accent" /> · Powered by TMDB</p>
    </footer>
  )
}
