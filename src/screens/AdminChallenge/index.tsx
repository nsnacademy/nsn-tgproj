type Props = {
  challengeId: string;
  onBack: () => void;
};

export default function AdminChallenge({ challengeId, onBack }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        padding: 24,
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: 16,
          background: 'none',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 12px',
          borderRadius: 8,
        }}
      >
        ← Назад
      </button>

      <h1 style={{ fontSize: 20, marginBottom: 12 }}>
        Администрирование вызова
      </h1>

      <p style={{ opacity: 0.7 }}>
        challengeId: {challengeId}
      </p>
    </div>
  );
}
