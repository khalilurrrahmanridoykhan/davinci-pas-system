import { usePasWizardState } from '../hooks/usePasWizardState'
import { useSubmitClaim } from '../hooks/useSubmitClaim'
import { BundleReview } from './BundleReview'
import { PatientCoverageForm } from './PatientCoverageForm'
import { ProviderForm } from './ProviderForm'
import { RequestedItemForm } from './RequestedItemForm'
import { StepProgress } from './StepProgress'
import { SubmissionResult } from './SubmissionResult'

export function Wizard() {
  const wizard = usePasWizardState()
  const { submitting, error, result, submit } = useSubmitClaim()

  async function handleSubmit(bundle: Parameters<typeof submit>[0]) {
    await submit(bundle)
    wizard.goNext()
  }

  function handleStartOver() {
    wizard.reset()
  }

  return (
    <>
      <StepProgress current={wizard.step} />
      <div className="card">
        <div className="step-panel" key={wizard.step}>
          {wizard.step === 'patient-coverage' && (
            <PatientCoverageForm
              patient={wizard.data.patient}
              coverage={wizard.data.coverage}
              updatePatient={wizard.updatePatient}
              updateCoverage={wizard.updateCoverage}
              onNext={wizard.goNext}
            />
          )}
          {wizard.step === 'provider' && (
            <ProviderForm provider={wizard.data.provider} updateProvider={wizard.updateProvider} onNext={wizard.goNext} onBack={wizard.goBack} />
          )}
          {wizard.step === 'requested-item' && (
            <RequestedItemForm
              requestedItem={wizard.data.requestedItem}
              updateRequestedItem={wizard.updateRequestedItem}
              onNext={wizard.goNext}
              onBack={wizard.goBack}
            />
          )}
          {wizard.step === 'review' && (
            <BundleReview data={wizard.data} onBack={wizard.goBack} onSubmit={handleSubmit} submitting={submitting} />
          )}
          {wizard.step === 'result' && <SubmissionResult result={result} error={error} onStartOver={handleStartOver} />}
        </div>
      </div>
    </>
  )
}
