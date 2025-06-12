// components/StepIndicator.tsx
export default function StepIndicator({ currentStep }: { currentStep: string }) {
  const steps = ['credentials', 'phone_verify'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem' }}>
      {steps.map((step, index) => {
        const isActive = currentStep === step;
        const isCompleted = currentIndex > index;

        return (
          <div
            key={step}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '600',
              backgroundColor: isActive ? '#102948' : isCompleted ? '#cb8548' : '#e5e7eb',
              color: isActive || isCompleted ? '#fdf1d8' : '#6b7280'
            }}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}