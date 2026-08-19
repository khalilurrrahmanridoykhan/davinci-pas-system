import type { WizardStep } from '../hooks/usePasWizardState'

const STEPS: { step: WizardStep; label: string }[] = [
  { step: 'patient-coverage', label: 'Patient' },
  { step: 'provider', label: 'Provider' },
  { step: 'requested-item', label: 'Item' },
  { step: 'review', label: 'Review' },
  { step: 'result', label: 'Result' },
]

export function StepProgress({ current }: { current: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.step === current)

  return (
    <div className="step-progress">
      {STEPS.map((s, i) => (
        <div key={s.step} className={`step-progress-item ${i < currentIndex ? 'done' : i === currentIndex ? 'current' : ''}`}>
          <div className="step-progress-bar" />
          <span className="step-progress-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
