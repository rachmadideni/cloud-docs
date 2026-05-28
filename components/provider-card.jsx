import Link from 'next/link'

const statusStyle = {
  Active: { bg: '#dcfce7', fg: '#166534', dark: { bg: '#14532d', fg: '#bbf7d0' } },
  Beta: { bg: '#fef3c7', fg: '#92400e', dark: { bg: '#78350f', fg: '#fde68a' } },
  Soon: { bg: '#e0e7ff', fg: '#3730a3', dark: { bg: '#312e81', fg: '#c7d2fe' } }
}

export function ProviderCard({ href, title, description, status = 'Active', meta }) {
  const s = statusStyle[status] || statusStyle.Active
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.5rem',
        border: '1px solid var(--x-color-border-default, #e5e7eb)',
        borderRadius: '0.75rem',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.15s, transform 0.15s',
        background: 'var(--x-color-bg-default, transparent)'
      }}
      className="provider-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.25rem 0.625rem',
            borderRadius: '999px',
            background: s.bg,
            color: s.fg
          }}
        >
          {status}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--x-color-text-muted, #6b7280)', lineHeight: 1.5 }}>
        {description}
      </p>
      {meta && (
        <div style={{ fontSize: '0.825rem', color: 'var(--x-color-text-muted, #9ca3af)', marginTop: '0.25rem' }}>
          {meta}
        </div>
      )}
    </Link>
  )
}

export function ProviderGrid({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {children}
    </div>
  )
}
