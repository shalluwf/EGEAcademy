import { Button } from '../ui/Button.jsx'
import heroBg from '../../../res/pc/teachers_photo/Group 452.png'
import vkIcon from '../../../res/components/icons_svg/social icons.png'
import starIcon from '../../../res/components/icons_svg/Star 2.svg'

export function Hero({ kicker, title, primaryCta, stats }) {
  return (
    <section className="hero" aria-label="Вступление">
      <div className="hero__inner">
        <div className="hero__card" style={{ '--hero-card-media': `url(${heroBg})` }}>
          <div className="hero__grid">
            <div>
              <p className="hero__kicker">{kicker}</p>
              <h1 className="hero__title">{title}</h1>

              <div className="hero__actions">
                <Button variant="primary" type="button" className="hero__ctaBtn">
                  {primaryCta}
                </Button>
              </div>

              <div className="hero__rating" aria-label="Рейтинг">
                <span className="hero__vkIcon" aria-hidden="true">
                  <img src={vkIcon} alt="" draggable={false} />
                </span>
                <span className="hero__ratingText">
                  <span className="hero__star" aria-hidden="true">
                    <img src={starIcon} alt="" draggable={false} />
                  </span>
                  5,0 наш рейтинг в VK
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__stats" aria-label="Преимущества">
          {stats.map((t) => {
            const [headRaw, ...rest] = String(t).split('\n')
            const head = headRaw?.trim() ?? ''
            const body = rest.join('\n').trim()
            return (
              <div key={t} className="hero__statCard">
                <div className="hero__statTitle">{head}</div>
                {body ? <div className="hero__statText">{body}</div> : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
