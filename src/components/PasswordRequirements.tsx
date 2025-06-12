// components/PasswordRequirements.tsx
interface Requirement {
  key: string;
  text: string;
  met: boolean;
}

export default function PasswordRequirements({ requirements }: { requirements: Requirement[] }) {
  return (
    <div className="password-requirements">
      <div className="pass-req-heading">Password Requirements:</div>
      {requirements.map((req, index) => (
        <div
          key={req.key}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: index === requirements.length - 1 ? '0' : '0.25rem',
            color: req.met ? '#059669' : '#dc2626'
          }}
        >
          <span style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}>
            {req.met ? '✓' : '✗'}
          </span>
          {req.text}
        </div>
      ))}
    </div>
  );
}
