import { useEffect, useId, useMemo, useRef, useState } from 'react'

function PrimaryButton({ children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-4 text-btn font-medium text-text-inverse shadow-soft outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-blue)]/30"
    >
      {children}
    </button>
  )
}

function DarkButton({ children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md bg-text px-6 py-4 text-btn font-medium text-text-inverse shadow-soft outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-blue)]/30"
    >
      {children}
    </button>
  )
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function onPointerDown(e) {
      if (!ref.current) return
      if (ref.current.contains(e.target)) return
      handler(e)
    }
    document.addEventListener('pointerdown', onPointerDown, { capture: true })
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, { capture: true })
    }
  }, [ref, handler])
}

function SubjectPill({ name, layout, active, onSelect }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${layout.left}px`,
        top: `${layout.top}px`,
        width: `${layout.width}px`,
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full outline-none"
        style={{
          height: `${layout.height}px`,
          borderRadius: `${layout.radius}px`,
          background: active ? '#FFFFFF' : '#191919',
          border: 'none',
          padding: 0,
          appearance: 'none',
          WebkitAppearance: 'none',
          boxShadow: active ? '0 0 0 3px rgb(0, 0, 0)' : 'none',
          cursor: 'pointer',
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

function ChoiceMenu() {
  const FIGMA_WIDTH = 2025
  const panelId = useId()
  const wrapRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('ЕГЭ')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [panelPos, setPanelPos] = useState({ left: 8, top: 0, width: 560 })
  const overlayTop = 121

  useOnClickOutside(wrapRef, () => setOpen(false))

  const subjectsByTab = useMemo(() => {
    // По текущим PDF список предметов одинаковый; оставляем структуру под 2 таблицы.
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
      // Match Figma placement: menu panel (Frame 471) at x=1271 on 2025px-wide layout
      const figmaX = 1271
      const panelWidth = Math.min(754, Math.max(320, window.innerWidth - 16))
      const desiredLeft = (figmaX / FIGMA_WIDTH) * window.innerWidth
      const left = Math.min(
        Math.max(8, desiredLeft),
        window.innerWidth - panelWidth - 8
      )
      setPanelPos({ left, top: overlayTop, width: panelWidth })
    }

    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className="inline-flex h-[46.79px] w-[189.11px] items-center justify-between bg-transparent p-0 outline-none ring-0 shadow-none border-0 focus-visible:ring-4 focus-visible:ring-[color:var(--color-blue)]/30"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, var(--font-family)',
            fontWeight: 400,
            fontSize: '31.19px',
            lineHeight: '46.79px',
            letterSpacing: '-0.06em',
            color: 'rgba(0,0,0,0.87)',
          }}
        >
          ЕГЭ/ОГЭ
        </span>
        <span
          aria-hidden="true"
          className={open ? 'rotate-180' : ''}
          style={{ width: '23.39px', height: '14.45px', display: 'grid', placeItems: 'center' }}
        >
          <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.645 0.748047L12 10.393L2.355 0.748047L0 3.103L12 15.103L24 3.103L21.645 0.748047Z" fill="rgba(0,0,0,0.87)"/>
          </svg>
        </span>
      </button>

      {/* Figma overlay under menu (left side darkened) */}
      <div
        hidden={!open}
        className="fixed z-40"
        style={{
          top: `${overlayTop}px`,
          left: 0,
          height: `calc(100vh - ${overlayTop}px)`,
          width: `${panelPos.left}px`,
          background: 'rgba(28,28,28,0.6)',
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* White right panel background */}
      <div
        hidden={!open}
        className="fixed z-40 bg-bg"
        style={{
          top: `${overlayTop}px`,
          left: `${panelPos.left}px`,
          right: 0,
          height: `calc(100vh - ${overlayTop}px)`,
        }}
        aria-hidden="true"
      />

      <div
        id={panelId}
        hidden={!open}
        className="fixed z-50 bg-bg"
        style={{
          left: panelPos.left,
          top: `${overlayTop}px`,
          width: panelPos.width,
          maxWidth: 'calc(100vw - 16px)',
        }}
        role="dialog"
        aria-label="ЕГЭ/ОГЭ"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        {/* Frame 471 replica (key geometry from Figma) */}
        <div className="relative" style={{ height: '1184px', marginLeft: '0px' }}>
          {/* Switch (Group 413) */}
          <div className="absolute left-[70px] top-[206px]">
            <div
              className="relative h-[83px] w-[199px] rounded-[42px] bg-bg"
              style={{
                background: '#FFFFFF',
                boxShadow: '0px 3.3677px 3.3677px rgba(0,0,0,0.25)',
              }}
            >
              <div
                className="absolute top-[9px] h-[66px] w-[89px] rounded-[33px]"
                style={{
                  left: tab === 'ОГЭ' ? '102.5px' : '8.9px',
                  background: 'linear-gradient(180deg, #1841EC 0%, #0E2586 100%)',
                  transition: 'left 200ms ease',
                }}
              />
              <div className="relative z-10 grid h-full grid-cols-2">
                <button
                  type="button"
                  className="outline-none"
                  style={{
                    fontFamily: 'Onest, var(--font-family)',
                    fontWeight: 500,
                    fontSize: '30.97px',
                    lineHeight: '44.91px',
                    letterSpacing: '0.0149em',
                    textTransform: 'uppercase',
                    color: tab === 'ЕГЭ' ? '#F5F5F5' : '#191919',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                  onClick={() => setTab('ЕГЭ')}
                >
                  ЕГЭ
                </button>
                <button
                  type="button"
                  className="outline-none"
                  style={{
                    fontFamily: 'Onest, var(--font-family)',
                    fontWeight: 500,
                    fontSize: '30.97px',
                    lineHeight: '44.91px',
                    letterSpacing: '0.0149em',
                    textTransform: 'uppercase',
                    color: tab === 'ОГЭ' ? '#F5F5F5' : '#191919',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                  onClick={() => setTab('ОГЭ')}
                >
                  ОГЭ
                </button>
              </div>
            </div>
          </div>

          {/* Subject pills – generated from Figma text-box widths/padding */}
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

function FaqItem({ q, a, defaultOpen = false }) {
  const contentId = useId()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg bg-[image:var(--gradient-surface)]/10 shadow-soft">
      <h3 className="m-0">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-sm font-medium outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-blue)]/30"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{q}</span>
          <span
            className={[
              'grid size-10 place-items-center rounded-full bg-blue text-text-inverse transition-transform',
              open ? 'rotate-180' : 'rotate-0',
            ].join(' ')}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        hidden={!open}
        className="px-6 pb-6 text-sm font-light"
      >
        {a}
      </div>
    </div>
  )
}

export default function App() {
  const FIGMA_WIDTH = 2025
  const pctX = (x) => `${(x / FIGMA_WIDTH) * 100}%`
  const FIGMA_HEADER_H = 153.12
  const pctY = (y) => `${(y / FIGMA_HEADER_H) * 100}%`

  // Текст берём из развертки Group 465.pdf. Не добавляем "свой" текст.
  const faq = useMemo(() => {
    const questions = [
      'Как проходят занятия?',
      'Какие есть виды занятий?',
      'Предусмотрены ли домашние задания?',
      'На какой платформе проходит занятие?',
      'ПЕРИОДИЧНОСТЬ ЗАНЯТИЙ',
    ]
    return questions.map((q) => ({ q, a: '' }))
  }, [])

  return (
    <div className="min-h-dvh bg-bg text-text">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg focus:px-4 focus:py-2 focus:shadow-soft"
      >
        Перейти к содержимому
      </a>

      <header
        className="fixed y-[0] z-[40] w-[2560px] bg-[white]"
        style={{ boxShadow: '0px 4.2533px 4.2533px rgba(0,0,0,0.25)', left: pctX(0), top: pctY(0)}}
      >
        {/* Horizontal positions scale by Figma width (2025) */}
        <div className="relative h-[120px] w-full">
          {/* Logo (Frame 382): gradient + "АЕ" */}
          <div
            className="relative top-[25px] grid size-[85px] place-items-center rounded-full"
            style={{
              left: pctX(100), top: pctY(15),
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%), #0904FB',
            }}
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: '"Mplus 1p Bold", "M PLUS 1p", var(--font-family)',
                fontWeight: 700,
                fontSize: '52.16px',
                lineHeight: '68.21px',
                letterSpacing: '-0.05em',
                color: '#FFFFFF',
              }}
            >
              АЕ
            </span>
          </div>

          {/* Text block */}
          <div
            className="relative"
            style={{ left: pctX(200), top: pctY(-110) }}
          >
            <p
              className="m-0"
              style={{
                fontFamily: '"M PLUS 1p", var(--font-family)',
                fontWeight: 500,
                fontSize: '27px',
                lineHeight: '25.31px',
                color: '#2F2F2F',
                height: '25.31px',
                overflow: 'hidden',
              }}
            >
              Академия ЕГЭ:
            </p>
          </div>
          <div
            className="relative"
            style={{ left: pctX(200), top: pctY(-140) }}
          >
            <p
              className="m-0 uppercase"
              style={{
                fontFamily: 'Inter, var(--font-family)',
                fontWeight: 200,
                fontSize: '18px',
                lineHeight: '23px',
                color: 'rgba(0,0,0,0.87)',
                whiteSpace: 'pre-line',
                height: '48px',
                overflow: 'hidden',
              }}
            >
              {'Академия ЕГЭ: БОЛЬШЕ, \n ЧЕМ ПРОСТО ОНЛАЙН-ШКОЛА'}
            </p>
          </div>

          {/* ЕГЭ/ОГЭ menu */}
          <div
            className="absolute top-[30px]"
            style={{ left: pctX(1565), top:pctY(40) }}
          >
            <ChoiceMenu />
          </div>

          {/* Message icon */}
          <button
            type="button"
            className="absolute top-[54px] grid size-[46px] place-items-center bg-transparent p-0 outline-none ring-0 shadow-none border-0 focus-visible:ring-4 focus-visible:ring-[color:var(--color-blue)]/30"
            style={{ left: pctX(1833), top:pctY(40) }}
            aria-label="Сообщения"
          >
            <svg
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M41.4259 32.4194H18.1914C17.8638 32.4194 17.5455 32.5271 17.2847 32.7251L11.244 37.327V33.9153C11.244 33.0888 10.575 32.4194 9.74857 32.4194H4.9286V8.78536H41.4259V32.4194ZM42.9185 5.79297H3.42947C2.60347 5.79297 1.93359 6.46241 1.93359 7.28841V33.9142C1.93359 34.7407 2.60347 35.4101 3.42947 35.4101H8.24944V40.3456C8.24944 40.9143 8.57173 41.4342 9.08155 41.6863C9.29132 41.7905 9.51897 41.8415 9.74532 41.8415C10.0667 41.8415 10.386 41.7382 10.6516 41.5358L18.6923 35.4101H42.9185C43.7441 35.4101 44.4144 34.7407 44.4144 33.9142V7.28841C44.4144 6.46241 43.7441 5.79297 42.9185 5.79297Z"
                fill="#212121"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.3709 18.4703H33.9774C34.803 18.4703 35.4733 17.8008 35.4733 16.9744C35.4733 16.1484 34.803 15.4785 33.9774 15.4785H12.3709C11.5449 15.4785 10.875 16.1484 10.875 16.9744C10.875 17.8008 11.5449 18.4703 12.3709 18.4703Z"
                fill="#212121"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.3709 25.7242H33.9774C34.803 25.7242 35.4733 25.0547 35.4733 24.2283C35.4733 23.4023 34.803 22.7324 33.9774 22.7324H12.3709C11.5449 22.7324 10.875 23.4023 10.875 24.2283C10.875 25.0547 11.5449 25.7242 12.3709 25.7242Z"
                fill="#212121"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Spacer for fixed header (153.12px) */}
      <div aria-hidden="true" style={{ height: '153.12px' }} />

      <main id="content">
        {/* Next block (hero card) – start aligning to Figma Group 465 */}
        <div className="h-[96px]" aria-hidden="true" />
        {/* HERO */}
        <section aria-label="Вступление" className="py-10">
          <div className="container">
            <div className="grid items-center gap-10 rounded-lg bg-[image:var(--gradient-surface)]/10 px-10 py-10 shadow-soft xl:grid-cols-[1fr_420px]">
              <div>
              <p className="m-0 text-sm font-light">Подготовка к ОГЭ/ЕГЭ</p>
              <h1 className="mt-3 text-h1 font-semibold">
                с аспирантами и магистрантами МГУ
              </h1>

              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton>записаться на занятие</PrimaryButton>
              </div>

              <div className="mt-10 grid gap-4 xl:grid-cols-5">
                {[
                  '5,0 наш рейтинг в VK',
                  'с 2023 профессионально готовим к экзаменам',
                  'МГУ у наших репетиторов образование лучших вузов страны',
                  '90% учеников — выпускников - высокобальники',
                  '10к+ по всей стране / 85+ баллов каждый преподаватель сдал свой предмет ЕГЭ',
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-md bg-bg/70 px-5 py-4 text-xs font-light shadow-soft"
                  >
                    {t}
                  </div>
                ))}
              </div>
              </div>

              <div className="grid aspect-[16/9] place-items-center rounded-lg bg-bg/70 shadow-soft">
                {/* Изображение/группа из макета подключим как ассет следующим шагом */}
              </div>
            </div>
          </div>
        </section>

        {/* Free lesson */}
        <section className="py-10">
          <div className="container">
            <article className="rounded-lg bg-primary px-10 py-10 text-text-inverse shadow-soft">
              <div className="grid items-center gap-8 xl:grid-cols-[1fr_auto]">
                <div className="max-w-[70ch]">
                  <h2 className="m-0 text-[clamp(28px,2vw+18px,40px)] font-semibold">
                    пробный урок бесплатно!
                  </h2>
                  <p className="mt-4 text-sm font-light opacity-95">
                    подробно расскажем о формате и структуре занятий
                  </p>
                  <p className="mt-2 text-sm font-light opacity-95">
                    разберём вариант ОГЭ/ЕГЭ
                  </p>
                  <p className="mt-2 text-sm font-light opacity-95">
                    составим индивидуальный план обучения
                  </p>
                </div>
                <div className="shrink-0">
                  <PrimaryButton>записаться на занятие</PrimaryButton>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* TEACHERS */}
        <section id="teachers" className="py-10">
          <div className="container">
            <div className="flex items-end justify-between gap-8">
              <h2 className="m-0 text-[clamp(28px,2vw+18px,40px)] font-semibold">
                Преподаватели, с которыми вы точно сдадите экзамен
              </h2>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                'Математика профиль',
                'Математика база',
                'История',
                'Русский язык',
                'Английский язык',
                'Информатика',
                'Литература',
                'Французский язык',
                'Обществознание',
                'Биология',
                'Химия',
                'География',
                'Физика',
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="rounded-full bg-[image:var(--gradient-surface)]/10 px-5 py-3 text-xs font-medium shadow-soft outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-blue)]/30"
                >
                  {t}
                </button>
              ))}
            </div>

            <article className="mt-8 grid gap-8 rounded-lg bg-[image:var(--gradient-surface)]/10 p-10 shadow-soft xl:grid-cols-[360px_1fr]">
              <div className="grid min-h-[420px] place-items-center rounded-md bg-bg/70 shadow-soft">
              </div>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="m-0 text-xs font-light opacity-80">ЕГЭ</p>
                    <h3 className="mt-2 text-[clamp(26px,1.6vw+16px,36px)] font-semibold">
                      АЛЕКСАНДР
                    </h3>
                    <p className="m-0 mt-2 text-sm font-medium">ОБЩЕСТВОЗНАНИЕ</p>
                    <p className="m-0 mt-4 text-sm font-light">
                      Руководитель Академии ЕГЭ
                    </p>
                    <p className="m-0 mt-2 text-sm font-light">
                      Аспирант юридического факультета МГУ
                    </p>
                    <p className="m-0 mt-2 text-sm font-light">
                      Преподаватель по истории и обществознанию
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-md bg-bg/70 p-5 text-xs font-light shadow-soft">
                    <div>5.000+ учеников</div>
                    <div>с 2017 помогаю готовиться к ОГЭ/ЕГЭ</div>
                    <div>90% высокоболльники</div>
                  </div>
                </div>

                <div className="mt-8">
                  <DarkButton>записаться на занятие</DarkButton>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="py-10">
          <div className="container">
            <h2 className="m-0 text-[clamp(28px,2vw+18px,40px)] font-semibold">
              ОТЗЫВЫ И РЕЗУЛЬТАТЫ
            </h2>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1fr_1fr]">
              <figure className="m-0 rounded-lg bg-[image:var(--gradient-surface)]/10 p-6 shadow-soft">
                <blockquote className="m-0 text-sm font-light">
                  ь со Степаном подготовкой к огэ по физике, плюс за то, что «пинал» в
                  подготовке))
                </blockquote>
              </figure>

              <figure className="m-0 rounded-lg bg-[image:var(--gradient-surface)]/10 p-6 shadow-soft">
                <blockquote className="m-0 text-sm font-light">
                  Александр прекрасный репетитор! Знания заметно улучшились! Такого
                  отличного результата я не ожидала. Всё объяснения доходчивые, каждая
                  тема разбирается досконально. А самое главное - практическое
                  применение теоретических знаний на каждом уроке.
                </blockquote>
                <figcaption className="mt-6 text-xs font-light opacity-80">
                  Татьяна Савенкова
                </figcaption>
              </figure>

              <figure className="m-0 rounded-lg bg-[image:var(--gradient-surface)]/10 p-6 shadow-soft" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* WHY TRUST */}
        <section className="py-10">
          <div className="container">
            <h2 className="m-0 text-[clamp(28px,2vw+18px,40px)] font-semibold">
              Почему стоит доверить подготовку именно нам?
            </h2>
            <div className="mt-8 grid gap-6 xl:grid-cols-4">
              {[
                'Первая в России онлайн-Академия по подготовке к ОГЭ/ЕГЭ',
                'Наши преподаватели – аспиранты и магистранты МГУ и других лучших вузов страны',
                'Возможность выбора формата занятий',
                'Для каждого ученика составляется индивидуальная программа подготовки',
              ].map((t, idx) => (
                <article
                  key={t}
                  className="rounded-lg bg-[image:var(--gradient-surface)]/10 p-7 shadow-soft"
                >
                  <p className="m-0 text-[clamp(44px,3vw+20px,64px)] font-light text-blue/70">
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                  <p className="m-0 mt-4 text-xs font-light">{t}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-12">
          <div className="container">
            <h2 className="m-0 text-[clamp(28px,2vw+18px,40px)] font-semibold">
              Отвечаем на Ваши вопросы
            </h2>
            <div className="mt-8 grid gap-5">
              {faq.map((item, idx) => (
                <FaqItem
                  key={item.q}
                  q={item.q}
                  a={item.a}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA + FORM */}
        <section className="py-10">
          <div className="container">
            <div className="rounded-lg bg-text px-10 py-12 text-text-inverse shadow-soft">
              <h2 className="m-0 text-[clamp(28px,2vw+18px,40px)] font-semibold">
                НАЧНИТЕ ОБУЧЕНИЕ С БЕСПЛАТНОГО ЗАНЯТИЯ!
              </h2>

              <p className="mt-4 max-w-[60ch] text-sm font-light opacity-90">
                Заполните эту форму, и мы напишем Вам и ответим на все вопросы
              </p>

              <form
                className="mt-8 grid gap-4 xl:grid-cols-3"
                action="#"
                method="post"
              >
                <div>
                  <label
                    className="block text-xs font-light opacity-90"
                    htmlFor="name"
                  >
                    имя *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="mt-2 w-full rounded-md bg-bg px-5 py-4 text-sm text-text outline-none focus-visible:ring-4 focus-visible:ring-white/25"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-light opacity-90"
                    htmlFor="email"
                  >
                    почта*
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-md bg-bg px-5 py-4 text-sm text-text outline-none focus-visible:ring-4 focus-visible:ring-white/25"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-light opacity-90"
                    htmlFor="subject"
                  >
                    выбери предмет ОГЭ/ЕГЭ*
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="mt-2 w-full rounded-md bg-bg px-5 py-4 text-sm text-text outline-none focus-visible:ring-4 focus-visible:ring-white/25"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      выбери предмет ОГЭ/ЕГЭ*
                    </option>
                    {[
                      'Математика профиль',
                      'Математика база',
                      'История',
                      'Русский язык',
                      'Английский язык',
                      'Информатика',
                      'Литература',
                      'Французский язык',
                      'Обществознание',
                      'Биология',
                      'Химия',
                      'География',
                      'Физика',
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="xl:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-2">
                  <label className="flex items-start gap-3 text-xs font-light opacity-90">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 size-5 accent-[color:var(--color-blue)]"
                    />
                    <span>
                      Даю своё согласие на обработку указанных мною персональных данных.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="rounded-md bg-primary px-7 py-4 text-btn font-medium text-text-inverse outline-none focus-visible:ring-4 focus-visible:ring-white/25"
                  >
                    Записаться
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-[color:var(--color-shadow)]/30 py-10">
        <div className="container flex items-center justify-between gap-6">
          <div className="grid gap-1 text-xs font-light opacity-80">
            <p className="m-0">Меню</p>
            <p className="m-0">Как проходит обучение</p>
            <p className="m-0">Преподаватели</p>
            <p className="m-0">Отзывы и результаты</p>
          </div>
          <div className="grid gap-1 text-xs font-light opacity-80">
            <p className="m-0">onasenkoa99@mail.ru</p>
            <p className="m-0">+7 988 258 29 96</p>
            <p className="m-0">ВКонтакте</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

