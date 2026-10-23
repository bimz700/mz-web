import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Github, Twitter, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_formData: ContactForm) => {
    setStatus('submitting')
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setStatus('success')
    form.reset()
    
    // Reset after 5 seconds
    setTimeout(() => setStatus('idle'), 5000)
  }

  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-text mb-4">Get in Touch</h1>
          <p className="text-xl text-text-dim max-w-2xl">
            Have a project in mind, want to discuss technology, or just want to say hello? 
            Let's connect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-text mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Email</p>
                    <a href="mailto:hello@bimz.dev" className="text-text hover:text-primary transition-colors">
                      hello@bimz.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Location</p>
                    <p className="text-text">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-text mb-4">Social</h3>
                <div className="flex space-x-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-text-dim hover:text-primary transition-colors">
                    <Github size={20} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-text-dim hover:text-primary transition-colors">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-text mb-4">Response Time</h2>
              <p className="text-text-dim text-sm">
                I aim to respond to all messages within 24-48 hours during weekdays. 
                For urgent inquiries, please indicate "URGENT" in the subject.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-text mb-6">Send a Message</h2>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                    Name
                  </label>
                  <input
                    {...form.register('name')}
                    id="name"
                    type="text"
                    className={`w-full px-4 py-3 bg-surface-elevated border rounded-lg text-text focus:outline-none focus:ring-2 transition-colors ${
                      form.formState.errors.name 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-border focus:border-primary focus:ring-primary/50'
                    }`}
                  />
                  {form.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Email
                  </label>
                  <input
                    {...form.register('email')}
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 bg-surface-elevated border rounded-lg text-text focus:outline-none focus:ring-2 transition-colors ${
                      form.formState.errors.email 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-border focus:border-primary focus:ring-primary/50'
                    }`}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                    Message
                  </label>
                  <textarea
                    {...form.register('message')}
                    id="message"
                    rows={5}
                    className={`w-full px-4 py-3 bg-surface-elevated border rounded-lg text-text focus:outline-none focus:ring-2 transition-colors resize-none ${
                      form.formState.errors.message 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-border focus:border-primary focus:ring-primary/50'
                    }`}
                  />
                  {form.formState.errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'submitting' || status === 'success'}
                  className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center transition-all ${
                    status === 'success'
                      ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                      : 'bg-primary text-background hover:bg-primary-dim hover:scale-[1.02] active:scale-[0.98]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status === 'submitting' ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle2 size={20} className="mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}