import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Box, Cpu, Sparkles, RotateCcw, ChevronRight } from 'lucide-react'

// Experiment 1: Mini Terminal
function MiniTerminal() {
  const [history, setHistory] = useState<string[]>(['$ welcome to bimz lab', '$ type "help" for commands'])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Record<string, () => string> = {
    help: () => 'Available: help, whoami, skills, projects, contact, clear, date, echo [msg]',
    whoami: () => 'bimz — developer, modder, experimenter',
    skills: () => 'Android • TypeScript • Rust • React • Reverse Engineering',
    projects: () => 'Check /projects for my work',
    contact: () => 'Email: hello@bimz.dev • or use /contact page',
    date: () => new Date().toLocaleString(),
    clear: () => {
      setHistory([])
      return ''
    },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim().toLowerCase()
    
    if (cmd.startsWith('echo ')) {
      setHistory([...history, `$ ${input}`, cmd.slice(5)])
    } else if (commands[cmd]) {
      const result = commands[cmd]()
      if (result) {
        setHistory([...history, `$ ${input}`, result])
      }
    } else if (cmd) {
      setHistory([...history, `$ ${input}`, `command not found: ${cmd}`])
    }
    
    setInput('')
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-surface-elevated border-b border-border flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-4 text-xs font-mono text-text-dim">terminal ~/lab</span>
      </div>
      <div className="p-4 h-48 overflow-y-auto font-mono text-sm">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-text' : 'text-text-dim'}>
            {line}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-primary mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-text outline-none"
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}

// Experiment 2: Interactive Grid
function InteractiveGrid() {
  const [activeCell, setActiveCell] = useState<{x: number; y: number} | null>(null)
  const [grid, setGrid] = useState<number[][]>(() => 
    Array(8).fill(null).map(() => Array(8).fill(0))
  )

  const handleHover = (x: number, y: number) => {
    setActiveCell({ x, y })
    const newGrid = grid.map((row, ry) =>
      row.map((_val, rx) => {
        const dist = Math.sqrt((rx - x) ** 2 + (ry - y) ** 2)
        return dist <= 2 ? Math.max(0, 1 - dist * 0.4) : 0
      })
    )
    setGrid(newGrid)
  }

  const reset = () => {
    setGrid(Array(8).fill(null).map(() => Array(8).fill(0)))
    setActiveCell(null)
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-mono text-text-dim">Interactive Grid</h3>
        <button
          onClick={reset}
          className="p-2 text-text-dim hover:text-primary transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div 
        className="grid grid-cols-8 gap-1 aspect-square"
        onMouseLeave={() => setActiveCell(null)}
      >
        {grid.map((row, y) =>
          row.map((value, x) => (
            <div
              key={`${x}-${y}`}
              onMouseEnter={() => handleHover(x, y)}
              className="rounded-sm transition-all duration-200"
              style={{
                backgroundColor: `rgba(0, 255, 159, ${value})`,
                border: activeCell?.x === x && activeCell?.y === y ? '1px solid #00ff9f' : 'none',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Experiment 3: Parameter Playground
function ParameterPlayground() {
  const [params, setParams] = useState({ speed: 50, density: 30, complexity: 70 })
  
  const barCount = Math.floor(params.density / 10)
  const animationDuration = 2 - (params.speed / 100)

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm font-mono text-text-dim mb-4">Visual Playground</h3>
      
      <div className="space-y-4 mb-6">
        {Object.entries(params).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-text-dim mb-1 capitalize">
              <span>{key}</span>
              <span>{value}</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={value}
              onChange={(e) => setParams({ ...params, [key]: parseInt(e.target.value) })}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        ))}
      </div>

      <div className="flex items-end justify-center h-24 gap-1">
        {Array(barCount).fill(null).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-primary rounded-t"
            animate={{
              height: [20, 80, 20],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const experiments = [
  {
    id: 'terminal',
    title: 'Mini Terminal',
    description: 'Restricted command environment. Try "help", "whoami", or "skills".',
    icon: Terminal,
    component: MiniTerminal,
  },
  {
    id: 'grid',
    title: 'Interactive Grid',
    description: 'Hover over cells to see distance-based visual effects.',
    icon: Box,
    component: InteractiveGrid,
  },
  {
    id: 'playground',
    title: 'Visual Playground',
    description: 'Adjust parameters to modify the animation.',
    icon: Sparkles,
    component: ParameterPlayground,
  },
]

export default function Lab() {
  const [activeExp, setActiveExp] = useState(0)

  const ActiveComponent = experiments[activeExp].component

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
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-primary" size={32} />
            <h1 className="text-5xl font-bold text-text">Lab</h1>
          </div>
          <p className="text-xl text-text-dim max-w-2xl">
            Experimental playground. Interactive experiences, small experiments, and prototypes.
            Some mobile-unfriendly — visit on desktop for best experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Experiment List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            {experiments.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => setActiveExp(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeExp === index
                    ? 'bg-surface-elevated border-primary'
                    : 'bg-surface border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <exp.icon
                      size={20}
                      className={activeExp === index ? 'text-primary' : 'text-text-dim'}
                    />
                    <div>
                      <h3 className="font-semibold text-text">{exp.title}</h3>
                      <p className="text-sm text-text-dim">{exp.description}</p>
                    </div>
                  </div>
                  {activeExp === index && (
                    <ChevronRight size={20} className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </motion.div>

          {/* Active Experiment */}
          <motion.div
            key={activeExp}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <ActiveComponent />
          </motion.div>
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center text-text-dim text-sm"
        >
          More experiments coming soon. Follow along on GitHub.
        </motion.p>
      </div>
    </div>
  )
}