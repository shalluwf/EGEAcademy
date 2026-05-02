import { useId, useState } from 'react'

function FaqChevron({ open }) {
  return (
    <span
      className={['faq-item__chevron', open ? 'faq-item__chevron--open' : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <svg width="84" height="71" viewBox="0 0 84 71" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M55.6559 29.5273L41.742 41.338L27.8281 29.5273"
          stroke="currentColor"
          strokeWidth="7.11874"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function FaqItem({ item, open, onToggle }) {
  const contentId = useId()

  return (
    <div className={['faq-item', open ? 'faq-item--open' : ''].filter(Boolean).join(' ')}>
      <h3 className="faq-item__heading">
        <button
          type="button"
          className="faq-item__trigger"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={onToggle}
        >
          <span>{item.q}</span>
          <FaqChevron open={open} />
        </button>
      </h3>
      <div id={contentId} hidden={!open} className="faq-item__panel">
        {item.a}
      </div>
    </div>
  )
}

export function Faq({ title, items }) {
  const [openId, setOpenId] = useState(null)

  return (
    <section className="section section--faq faq" id="faq" aria-label={title}>
      <div className="container">
        <h2 className="faq__title">{title}</h2>
        <div className="faq__list">
          {items.map((item) => (
            <FaqItem
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
