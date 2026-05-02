export function WhyTrust({ title, points }) {
  return (
    <section className="section why-trust" id="why-trust" aria-label={title}>
      <div className="container">
        <h2 className="why-trust__title">{title}</h2>
        <div className="why-trust__grid">
          {points.map((text, idx) => (
            <article key={text} className="why-trust__card">
              <p className="why-trust__text">{text}</p>
              <p className="why-trust__num">{String(idx + 1).padStart(2, '0')}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
