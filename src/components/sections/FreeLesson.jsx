import { Button } from '../ui/Button.jsx'
import rowIcon from '../../../res/components/icons_svg/fi_10486492.svg'
import ctaIcon from '../../../res/components/buttons_svg/fi_10486492.svg'

export function FreeLesson({ title, lines, ctaLabel }) {
  return (
    <section className="section free-lesson" id="trial" aria-label="Пробный урок">
      <div className="container">
        <article className="free-lesson__card">
          <div className="free-lesson__grid">
            <div className="free-lesson__left">
              <h2 className="free-lesson__title">{title}</h2>
              <div className="free-lesson__cta">
                <Button variant="primary" type="button" className="free-lesson__ctaBtn">
                  <span className="free-lesson__ctaText">{ctaLabel}</span>
                  <img className="free-lesson__ctaIcon" src={ctaIcon} alt="" aria-hidden="true" draggable={false} />
                </Button>
              </div>
            </div>
            <div className="free-lesson__right" aria-label="Что будет на уроке">
              <div className="free-lesson__table" role="list">
                {lines.map((line) => (
                  <div key={line} className="free-lesson__row" role="listitem">
                    <span className="free-lesson__rowIcon" aria-hidden="true">
                      <img src={rowIcon} alt="" draggable={false} />
                    </span>
                    <span className="free-lesson__rowText">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
