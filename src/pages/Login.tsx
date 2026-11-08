import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../store/auth.store'
export default function Login({ register = false }: { register?: boolean }) {
  const { login, register: reg } = useAuth(); const nav = useNavigate(); const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); try { register ? reg(name, email, pw) : login(email, pw); toast.success(register ? 'Account created' : 'Signed in'); nav(from, { replace: true }) } catch (x) { setErr(x instanceof Error ? x.message : 'Something went wrong.') } }
  const f = 'glass w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent'
  return <div className="grid min-h-screen place-items-center px-4"><form onSubmit={submit} className="glass w-full max-w-sm space-y-4 rounded-2xl p-8"><h1 className="font-display text-3xl">{register ? 'Create your account' : 'Sign in'}</h1>
    {register && <input className={f} placeholder="Name" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />}
    <input className={f} type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className={f} type="password" placeholder="Password" aria-label="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
    {err && <p role="alert" className="text-sm text-red-400">{err}</p>}<button className="btn w-full justify-center bg-accent">{register ? 'Create account' : 'Sign in'}</button>
    <p className="text-xs text-muted">Demo mode: this sign-in is a local mock and does not provide real security.</p>
    <p className="text-sm text-muted">{register ? 'Have an account?' : 'New here?'} <Link className="text-accent" to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p></form></div>
}
