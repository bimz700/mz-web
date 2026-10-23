import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Lab from './pages/Lab'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProjectsAdmin from './pages/admin/ProjectsAdmin'
import ProjectEditor from './pages/admin/ProjectEditor'
import ContentAdmin from './pages/admin/ContentAdmin'
import MediaAdmin from './pages/admin/MediaAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="lab" element={<Lab />} />
          <Route path="skills" element={<Skills />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="projects/new" element={<ProjectEditor />} />
          <Route path="projects/:id/edit" element={<ProjectEditor />} />
          <Route path="content" element={<ContentAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="bottom-right" theme="dark" />
    </>
  )
}

export default App
