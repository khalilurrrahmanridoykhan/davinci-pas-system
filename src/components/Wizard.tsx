import { usePasWizardState } from '../hooks/usePasWizardState'
import { useSubmitClaim } from '../hooks/useSubmitClaim'
import { BundleReview } from './BundleReview'
import { PatientCoverageForm } from './PatientCoverageForm'
import { ProviderForm } from './ProviderForm'
import { RequestedItemForm } from './RequestedItemForm'
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

  switch (wizard.step) {
    case 'patient-coverage':
      return (
        <PatientCoverageForm
          patient={wizard.data.patient}
          coverage={wizard.data.coverage}
          updatePatient={wizard.updatePatient}
          updateCoverage={wizard.updateCoverage}
          onNext={wizard.goNext}
        />
      )
    case 'provider':
      return <ProviderForm provider={wizard.data.provider} updateProvider={wizard.updateProvider} onNext={wizard.goNext} onBack={wizard.goBack} />
    case 'requested-item':
      return (
        <RequestedItemForm
          requestedItem={wizard.data.requestedItem}
          updateRequestedItem={wizard.updateRequestedItem}
          onNext={wizard.goNext}
          onBack={wizard.goBack}
        />
      )
    case 'review':
      return <BundleReview data={wizard.data} onBack={wizard.goBack} onSubmit={handleSubmit} submitting={submitting} />
    case 'result':
      return <SubmissionResult result={result} error={error} onStartOver={handleStartOver} />
  }
}
