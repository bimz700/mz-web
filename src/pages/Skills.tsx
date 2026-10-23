import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Zap, Cpu, Box, Database, Shield } from 'lucide-react'

const skillsData = [
  {
    category: 'Development',
    icon: Zap,
    skills: [
      { name: 'TypeScript', level: 'Advanced', description: 'Full‑stack development, advanced patterns' },
      { name: 'React', level: 'Advanced', description: 'Hooks, context, state management, performance' },
      { name: 'Kotlin', level: 'Intermediate', description: 'Android development, multiplatform' },
      { name: 'Python', level: 'Intermediate', description: 'Scripting, automation, tools' },
      { name: 'Rust', level: 'Beginner', description: 'Systems programming, safety focus' },
    ],
  },
  {
    category: 'Android',
    icon: Box,
    skills: [
      { name: 'APK Patching', level: 'Advanced', description: 'AXML, bytecode manipulation, signing' },
      { name: 'ADB', level: 'Advanced', description: 'Device communication, debugging, automation' },
      { name: 'Custom ROMs', level: 'Intermediate', description: 'AOSP building, vendor integration' },
      { name: 'Magisk', level: 'Advanced', description: 'Module development, systemless mods' },
      { name: 'Ghidra', level: 'Intermediate', description: 'Reverse engineering, decompilation' },
    ],
  },
  {
    category: 'Tools & DevOps',
    icon: Terminal,
    skills: [
      { name: 'CLI Tools', level: 'Advanced', description: 'Custom tooling, automation scripts' },
      { name: 'Git', level: 'Advanced', description: 'Branching, rebasing, advanced workflows' },
      { name: 'Docker', level: 'Intermediate', description: 'Containerization, orchestration' },
      { name: 'Vercel', level: 'Advanced', description: 'Deployments, edge functions' },
    ],
  },
  {
    category: 'Systems',
    icon: Cpu,
    skills: [
      { name: 'Linux', level: 'Advanced', description: 'CLI, scripting, system internals' },
      { name: 'Reverse Engineering', level: 'Intermediate', description: 'Binary analysis, debugging' },
      { name: 'Security', level: 'Intermediate', description: 'Secure coding, threat modeling' },
      { name: 'Network', level: 'Intermediate', description: 'Protocols, troubleshooting' },
    ],
  },
  {
    category: 'Design',
    icon: Database,
    skills: [
      { name: 'UI/UX', level: 'Intermediate', description: 'Responsive design, accessibility' },
      { name: 'Figma', level: 'Intermediate', description: 'Design systems, prototyping' },
      { name: 'CSS', level: 'Advanced', description: 'Complex layouts, animations, theming' },
    ],
  },
  {
    category: 'Creative',
    icon: Shield,
    skills: [
      { name: 'Generative Art', level: 'Beginner', description: 'Creative coding, algorithms' },
      { name: 'WebGL', level: 'Beginner', description: 'Three.js, shaders, visuals' },
      { name: 'Animation', level: 'Intermediate', description: 'Framer Motion, CSS animations' },
    ],
  },
]

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(skillsData[0].category)

  const currentSkills = skillsData.find((s) => s.category === activeCategory)?.skills || []

  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-text mb-4">Skills & Capabilities</h1>
          <p className="text-xl text-text-dim max-w-2xl">
            A spectrum of technical abilities across development, Android, systems, and creative domains.
            Continuous learning is part of the process.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-2">
            {skillsData.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                  activeCategory === category.category
                    ? 'bg-surface-elevated border-primary text-text'
                    : 'bg-surface border-border text-text-dim hover:border-primary/50'
                }`}
              >
                <category.icon size={20} className={activeCategory === category.category ? 'text-primary' : 'text-text-dimmer'} />
                <span className="font-medium">{category.category}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-mono text-primary">{skill.level}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-text-dim group-hover:text-primary transition-colors">
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
              </div>
              <p className="text-text-dim text-sm">{skill.description}</p>
              
              {/* Interactive skill bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-text-dimmer mb-1">
                  <span>Proficiency</span>
                  <span>{skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '65%' : '40%'}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '65%' : '40%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      skill.level === 'Advanced'
                        ? 'bg-primary'
                        : skill.level === 'Intermediate'
                        ? 'bg-primary/60'
                        : 'bg-primary/30'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-surface-elevated border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-xs font-mono text-text-dim">skills --list</span>
              </div>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="flex">
                <span className="text-primary">$</span>
                <span className="ml-2 text-text">ls -la skills/</span>
              </div>
              {currentSkills.map((skill) => (
                <div key={skill.name} className="text-text-dim">
                  drwxr-xr-x  {skill.level.padEnd(10)} {skill.name}
                </div>
              ))}
              <div className="flex">
                <span className="text-primary">$</span>
                <span className="ml-2 text-text">cat summary.txt</span>
              </div>
              <div className="text-text-dim">
                Total skills: {currentSkills.length} | Expertise: {currentSkills.filter((s) => s.level === 'Advanced').length} advanced
              </div>
              <div className="mt-4 flex">
                <span className="text-primary">$</span>
                <span className="ml-2 text-text">echo "Learning never stops"</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}