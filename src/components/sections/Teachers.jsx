import { useMemo, useRef } from 'react'
import { Button } from '../ui/Button.jsx'
import fireIcon from '../../../res/components/buttons_svg/Vector.png'
import ctaIcon from '../../../res/components/buttons_svg/fi_10486492.svg'
import { useSubjectSelection } from '../../state/subjectSelection.jsx'
import { usePillSwitchDrag } from '../../hooks/usePillSwitchDrag.js'

function splitStat(s) {
  const [headRaw, ...rest] = String(s ?? '').split('\n')
  return { head: headRaw.trim(), body: rest.join('\n').trim() }
}

function ExamSwitch({ value, onChange }) {
  const rootRef = useRef(null)
  const valueKey = value === 'ОГЭ' ? 'right' : 'left'

  const { dragT, isDragging, indicatorStyle, handleStyle, handleProps } = usePillSwitchDrag({
    valueKey,
    onChangeKey: (k) => onChange(k === 'right' ? 'ОГЭ' : 'ЕГЭ'),
    snapThreshold: 0.35,
    getTravelPx: () => {
      const el = rootRef.current
      if (!el) return 1
      const cs = window.getComputedStyle(el)
      const pad = parseFloat(cs.getPropertyValue('--teachers-switch-pad')) || 0
      const w = el.clientWidth
      return (w - pad * 2) / 2
    },
  })

  const activeKey = dragT == null ? (valueKey === 'right' ? 'oge' : 'ege') : dragT >= 0.35 ? 'oge' : 'ege'

  return (
    <div
      ref={rootRef}
      className={[
        'teachers__switch',
        `teachers__switch--${activeKey}`,
        isDragging ? 'teachers__switch--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label="Тип экзамена"
    >
      <span
        className="teachers__switchIndicator"
        aria-hidden="true"
        style={indicatorStyle}
      />
      <span
        className="teachers__switchHandle"
        aria-hidden="true"
        style={handleStyle}
        {...handleProps}
      />
      {['ЕГЭ', 'ОГЭ'].map((t) => {
        const key = t === 'ОГЭ' ? 'oge' : 'ege'
        return (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={value === t}
          className={[
            'teachers__switchBtn',
            `teachers__switchBtn--${key}`,
            value === t ? 'teachers__switchBtn--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
        )
      })}
    </div>
  )
}

export function Teachers({ title, subjects, featured }) {
  const { exam, setExam, subject: selectedSubject, setSubject: setSelectedSubject } = useSubjectSelection()

  const subjectList = useMemo(() => subjects ?? [], [subjects])
  const current = featured

  return (
    <section className="section teachers" id="teachers" aria-label="Преподаватели">
      <div className="container">
        <h2 className="teachers__title">{title}</h2>

        <article className="teachers__card" color="transparent">
          <div
            className="teachers__photo"
            aria-label="Фото преподавателя"
            style={
              current?.photoUrl
                ? {
                    backgroundImage: `url("${current.photoUrl}")`,
                  }
                : undefined
            }
          >
            <div className="teachers__photoTop">
              <ExamSwitch value={exam} onChange={setExam} />
              <div aria-hidden="true" />
            </div>

            <div className="teachers__photoBottom">
              <Button variant="primary" type="button" className="teachers__ctaBtn">
                <span className="teachers__ctaText">{current?.ctaLabel}</span>
                <img className="teachers__ctaIcon" src={ctaIcon} alt="" aria-hidden="true" draggable={false} />
              </Button>
            </div>
          </div>

          <div className="teachers__body">
            <div className="teachers__namePill teachers__namePill--standalone" aria-label="Преподаватель и предмет">
              <span className="teachers__namePillLeft">{current?.name}</span>
              <span className="teachers__namePillRight">
                <span key={selectedSubject} className="teachers__namePillRightText">
                  {selectedSubject}
                </span>
              </span>
            </div>

            <div className="teachers__infoPanel" aria-label="Описание и характеристики">
              <div className="teachers__bioList" aria-label="Описание преподавателя">
                {(current?.bio ?? []).map((line) => (
                  <div key={line} className="teachers__bioRow">
                    <img className="teachers__bioIcon" src={fireIcon} alt="" aria-hidden="true" draggable={false} />
                    <span className="teachers__bioText">{line}</span>
                  </div>
                ))}
              </div>

              <div className="teachers__stats" aria-label="Характеристики">
                {(current?.stats ?? []).map((line) => {
                  const { head, body } = splitStat(line)
                  return (
                    <div key={line} className="teachers__stat">
                      <div className="teachers__statHead">{head}</div>
                      {body ? <div className="teachers__statBody">{body}</div> : null}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="teachers__subjectsPanel" aria-label="Выбор предмета">
              <div className="teachers__subjects">
                {subjectList.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={['teachers__subject', selectedSubject === name ? 'teachers__subject--active' : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedSubject(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
