import { Button } from '../ui/Button.jsx'
import heroBg from '../../../res/pc/teachers_photo/Group 452.png'

function toPlaceholder(label) {
  return String(label ?? '')
    .replaceAll('*', '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function LeadForm({
  title,
  description,
  fields,
  subjectOptions,
  consent,
  submitLabel,
}) {
  return (
    <section className="section section--lead lead-form" aria-label={title}>
      <div className="container">
        <div className="lead-form__shell">
          <div className="lead-form__wrap" style={{ '--lead-form-media': `url(${heroBg})` }}>
            <h2 className="lead-form__title">{title}</h2>
            <p className="lead-form__intro">{description}</p>

            <form className="lead-form__form" action="#" method="post">
              <div className="lead-form__field">
                <label className="lead-form__label" htmlFor={fields.name.id}>
                  {fields.name.label}
                </label>
                <input
                  className="lead-form__input"
                  id={fields.name.id}
                  name={fields.name.name}
                  placeholder={toPlaceholder(fields.name.label)}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="lead-form__field">
                <label className="lead-form__label" htmlFor={fields.email.id}>
                  {fields.email.label}
                </label>
                <input
                  className="lead-form__input"
                  id={fields.email.id}
                  name={fields.email.name}
                  type="email"
                  placeholder={toPlaceholder(fields.email.label)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="lead-form__field">
                <label className="lead-form__label" htmlFor={fields.subject.id}>
                  {fields.subject.label}
                </label>
                <select
                  className="lead-form__select"
                  id={fields.subject.id}
                  name={fields.subject.name}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    {fields.subject.placeholder}
                  </option>
                  {subjectOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lead-form__actions">
                <Button variant="primary" type="submit" className="lead-form__submitBtn">
                  {submitLabel}
                </Button>
              </div>

              <label className="lead-form__consent">
                <input className="lead-form__checkbox" type="checkbox" required />
                <span>{consent}</span>
              </label>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
