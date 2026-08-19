import type { WizardStep } from '../hooks/usePasWizardState'
import { IconCheckCircle, IconClipboard, IconFlag, IconPackage, IconPatient, IconProvider } from './icons'

const STEPS: { step: WizardStep; label: string; Icon: typeof IconPatient }[] = [
  { step: 'patient-coverage', label: 'Patient', Icon: IconPatient },
  { step: 'provider', label: 'Provider', Icon: IconProvider },
  { step: 'requested-item', label: 'Item', Icon: IconPackage },
  { step: 'review', label: 'Review', Icon: IconClipboard },
  { step: 'result', label: 'Result', Icon: IconFlag },
]

export function StepProgress({ current }: { current: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.step === current)

  return (
    <div className="step-progress">
      {STEPS.map((s, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : ''
        return (
          <div key={s.step} className={`step-progress-item ${state}`}>
            <div className="step-progress-bar" />
            <div className="step-progress-dot">{state === 'done' ? <IconCheckCircle /> : <s.Icon />}</div>
            <span className="step-progress-label">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
