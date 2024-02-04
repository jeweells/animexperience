import InfoIcon from '@mui/icons-material/Info'
import BugReportIcon from '@mui/icons-material/BugReport'
import ReportIcon from '@mui/icons-material/Report'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { DevMessage } from '~/src/dev/types'

export const MessageIcon = ({ icon }: { icon: DevMessage['type'] }) => {
  if (icon === 'info') return <InfoIcon />
  if (icon === 'debug') return <BugReportIcon />
  if (icon === 'error') return <ReportIcon />
  if (icon === 'warn') return <ReportProblemIcon />

  return null
}
