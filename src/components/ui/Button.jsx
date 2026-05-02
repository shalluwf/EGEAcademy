export function Button({ as: As = 'button', variant = 'primary', className = '', ...props }) {
  const cls = ['btn', variant ? `btn--${variant}` : '', className].filter(Boolean).join(' ')
  return <As className={cls} {...props} />
}

