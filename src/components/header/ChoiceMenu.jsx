import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useSubjectSelection } from '../../state/subjectSelection.jsx'
import { usePillSwitchDrag } from '../../hooks/usePillSwitchDrag.js'

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function onPointerDown(e) {
      if (!ref.current) return
      if (ref.current.contains(e.target)) return
      handler(e)
    }
    document.addEventListener('pointerdown', onPointerDown, { capture: true })
    return () => document.removeEventListener('pointerdown', onPointerDown, { capture: true })
  }, [ref, handler])
}

function SubjectPill({ name, layout, active, onSelect }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${layout.left}px`,
        top: `${layout.top}px`,
        width: `${layout.width}px`,
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="btn"
        style={{
          width: '100%',
          height: `${layout.height}px`,
          borderRadius: `${layout.radius}px`,
          background: active ? '#FFFFFF' : '#191919',
          boxShadow: active ? '0 0 0 3px rgb(0, 0, 0)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            display: 'block',
            width: `${layout.textWidth}px`,
            fontFamily: 'Inter, var(--font-family)',
            fontWeight: 400,
            fontSize: '23px',
            lineHeight: '37px',
            letterSpacing: '-0.0251em',
            color: active ? '#191919' : '#F5F5F5',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '37px',
          }}
        >
          {name}
        </span>
      </button>
    </div>
  )
}

export function ChoiceMenu() {
  const FIGMA_WIDTH = 2025
  const panelId = useId()
  const wrapRef = useRef(null)
  const [open, setOpen] = useState(false)
  const { exam: tab, setExam: setTab, subject: selectedSubject, setSubject: setSelectedSubject } = useSubjectSelection()
  const [panelPos, setPanelPos] = useState({ left: 8, top: 0, width: 560 })
  const overlayTop = 153.12

  useOnClickOutside(wrapRef, () => setOpen(false))

  const subjectsByTab = useMemo(() => {
    const list = [
      'Биология',
      'Математика профиль',
      'Химия',
      'Математика база',
      'География',
      'Информатика',
      'Физика',
      'Обществознание',
      'Русский язык',
      'История',
      'Английский язык',
      'Литература',
      'Французский язык',
    ]
    return { ЕГЭ: list, ОГЭ: list }
  }, [])

  const subjectLayout = useMemo(
    () => ({
      'Математика профиль': { left: 68, top: 325, width: 321, height: 78, radius: 39, padX: 34, textWidth: 253 },
      'Математика база': { left: 68, top: 438, width: 280, height: 79, radius: 39.5, padX: 36, textWidth: 207 },
      Биология: { left: 416, top: 212, width: 198, height: 78, radius: 39, padX: 42, textWidth: 113 },
      Химия: { left: 416, top: 325.484, width: 160, height: 78.4843, radius: 39.2422, padX: 41, textWidth: 78 },
      Физика: { left: 416, top: 552, width: 179, height: 79, radius: 39.5, padX: 46, textWidth: 88 },
      Обществознание: { left: 68, top: 665, width: 280, height: 79, radius: 39.5, padX: 38, textWidth: 204 },
      История: { left: 70, top: 779, width: 181, height: 78, radius: 39, padX: 39, textWidth: 103 },
      География: { left: 416, top: 439, width: 187, height: 78, radius: 39, padX: 30, textWidth: 127 },
      Информатика: { left: 65, top: 552, width: 248, height: 78, radius: 39, padX: 43, textWidth: 162 },
      Литература: { left: 68, top: 892, width: 217, height: 79, radius: 39.5, padX: 39, textWidth: 139 },
      'Русский язык': { left: 416, top: 666, width: 232, height: 78, radius: 39, padX: 33, textWidth: 165 },
      'Английский язык': { left: 416, top: 779, width: 274, height: 79, radius: 39.5, padX: 35, textWidth: 204 },
      'Французский язык': { left: 416, top: 893, width: 266, height: 78, radius: 39, padX: 35, textWidth: 204 },
    }),
    []
  )

  useEffect(() => {
    if (!open) return

    function recompute() {
      const headerPad = Math.min(0, Math.max(16, (window.innerWidth * 150) / FIGMA_WIDTH))
      const maxAvail = Math.max(320, window.innerWidth - headerPad - 8)
      const panelWidth = Math.min(754, maxAvail)
      const left = Math.max(8, window.innerWidth - headerPad - panelWidth)
      setPanelPos({ left, top: overlayTop, width: panelWidth })
    }

    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [open])

  return (
    <div ref={wrapRef}>
      <button
        type="button"
        className="btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
        style={{
          display: 'inline-flex',
          height: '46.79px',
          width: '160.11px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, var(--font-family)',
            fontWeight: 400,
            fontSize: 'clamp(20px, 1.35vw, 31.19px)',
            lineHeight: 'clamp(32px, 2.05vw, 46.79px)',
            letterSpacing: '-0.02em',
            color: 'rgba(0,0,0,0.87)',
          }}
        >
          ЕГЭ/ОГЭ
        </span>
        <span
          aria-hidden="true"
          style={{
            width: '23.39px',
            height: '14.45px',
            display: 'grid',
            placeItems: 'center',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 120ms ease',
          }}
        >
          <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.645 0.748047L12 10.393L2.355 0.748047L0 3.103L12 15.103L24 3.103L21.645 0.748047Z"
              fill="rgba(0,0,0,0.87)"
            />
          </svg>
        </span>
      </button>

      <div
        className="choiceMenu__shade"
        data-open={open ? 'true' : 'false'}
        style={{
          position: 'fixed',
          zIndex: 40,
          top: `${overlayTop}px`,
          left: 0,
          height: `calc(100vh - ${overlayTop}px)`,
          width: `${panelPos.left}px`,
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className="choiceMenu__backdrop"
        data-open={open ? 'true' : 'false'}
        style={{
          position: 'fixed',
          zIndex: 40,
          top: `${overlayTop}px`,
          left: `${panelPos.left}px`,
          right: 0,
          height: `calc(100vh - ${overlayTop}px)`,
        }}
        aria-hidden="true"
      />

      <div
        id={panelId}
        className="choiceMenu__panel"
        data-open={open ? 'true' : 'false'}
        style={{
          position: 'fixed',
          zIndex: 50,
          left: panelPos.left,
          top: `${overlayTop}px`,
          width: panelPos.width,
          maxWidth: 'calc(100vw - 16px)',
        }}
        role="dialog"
        aria-label="ЕГЭ/ОГЭ"
        aria-hidden={open ? 'false' : 'true'}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        <div style={{ position: 'relative', height: '1184px' }}>
          <div style={{ position: 'absolute', left: '70px', top: '206px' }}>
            <ChoiceMenuExamSwitch value={tab} onChange={setTab} />
          </div>

          {subjectsByTab[tab].map((name) => {
            const layout = subjectLayout[name]
            if (!layout) return null
            return (
              <SubjectPill
                key={name}
                name={name}
                layout={layout}
                active={selectedSubject === name}
                onSelect={() => setSelectedSubject(name)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ChoiceMenuExamSwitch({ value, onChange }) {
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
      const pad = parseFloat(cs.getPropertyValue('--choiceMenu-switch-pad')) || 0
      const w = el.clientWidth
      return (w - pad * 2) / 2
    },
  })

  const activeKey = dragT == null ? (valueKey === 'right' ? 'oge' : 'ege') : dragT >= 0.35 ? 'oge' : 'ege'

  return (
    <div
      ref={rootRef}
      className={[
        'choiceMenu__switch',
        `choiceMenu__switch--${activeKey}`,
        isDragging ? 'choiceMenu__switch--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="ЕГЭ/ОГЭ"
      role="tablist"
    >
      <span className="choiceMenu__switchIndicator" aria-hidden="true" style={indicatorStyle} />
      <span className="choiceMenu__switchHandle" aria-hidden="true" style={handleStyle} {...handleProps} />

      {['ЕГЭ', 'ОГЭ'].map((t) => {
        const key = t === 'ОГЭ' ? 'oge' : 'ege'
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={value === t}
            className={[
              'choiceMenu__switchBtn',
              `choiceMenu__switchBtn--${key}`,
              value === t ? 'choiceMenu__switchBtn--active' : '',
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

