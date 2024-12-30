import { Zap, Sparkles, HelpCircle, Tv, Briefcase } from 'lucide-react'

type SectionHeadingProps = {
  title: string
  subtitle: string
  icon: 'top' | 'new' | 'ask' | 'show' | 'jobs'
}

export default function SectionHeading({ title, subtitle, icon }: SectionHeadingProps) {
  const iconMap = {
    top: Zap,
    new: Sparkles,
    ask: HelpCircle,
    show: Tv,
    jobs: Briefcase
  }

  const Icon = iconMap[icon]

  return (
    <div className="mb-6 flex items-center font-mono">
      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full mr-4">
        <Icon className="w-5 h-5 text-orange-500" />
      </div>
      <div>
        <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">{title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  )
}

