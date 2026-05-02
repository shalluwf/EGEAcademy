import { ChoiceMenu } from './ChoiceMenu.jsx'
import { MessageButton } from './MessageButton.jsx'

export function Header({ brandTitle, brandSubtitle }) {
  return (
    <>
      <header className="header">
        <div className="header__inner">
          <div className="header__left">
            <div className="header__logo" aria-hidden="true">
              <span className="header__logoText">АЕ</span>
            </div>

            <div className="header__brand">
              <p className="header__title">{brandTitle}</p>
              <p className="header__subtitle">{brandSubtitle}</p>
            </div>
          </div>

          <div aria-hidden="true" />

          <div className="header__right">
            <ChoiceMenu />
            <MessageButton />
          </div>
        </div>
      </header>
      <div className="header__spacer" aria-hidden="true" />
    </>
  )
}

