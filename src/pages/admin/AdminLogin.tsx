import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, ArrowLeft } from 'lucide-react'
import { signIn } from '@/lib/auth'
import Seo from '@/components/common/Seo'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type FormData = z.infer<typeof schema>

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('Login berhasil')
      navigate('/admin')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Seo title="Admin Login" noindex />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface border border-border mb-4">
            <Lock className="text-primary" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-text">Admin Login</h1>
          <p className="text-text-dim mt-2">Masuk ke dashboard admin BIMZ</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <input
              {...form.register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full px-4 py-3 bg-surface border rounded-lg text-text focus:outline-none focus:ring-2 transition-colors ${
                form.formState.errors.email
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-border focus:border-primary focus:ring-primary/50'
              }`}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
              Password
            </label>
            <input
              {...form.register('password')}
              id="password"
              type="password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 bg-surface border rounded-lg text-text focus:outline-none focus:ring-2 transition-colors ${
                form.formState.errors.password
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-border focus:border-primary focus:ring-primary/50'
              }`}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Memproses…' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-text-dim hover:text-primary transition-colors inline-flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Kembali ke website
          </Link>
        </div>
      </div>
    </div>
  )
}
