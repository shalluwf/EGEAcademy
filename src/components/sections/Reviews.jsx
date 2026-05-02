import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function wrapOffset(offset, cycle) {
  if (cycle <= 0) return offset
  let x = offset
  while (x <= -cycle) x += cycle
  while (x > 0) x -= cycle
  return x
}

function VkBadge() {
  return (
    <a
      className="reviews__vk"
      href="https://vk.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ВКонтакте"
    >
      <span className="reviews__vkText">vk</span>
    </a>
  )
}

function ReviewSlide({ item }) {
  if (item.placeholder) {
    return (
      <figure
        className="reviews__card reviews__card--placeholder"
        aria-hidden="true"
      />
    )
  }

  return (
    <figure className="reviews__card">
      {item.imageUrl ? (
        <div className="reviews__photoWrap">
          <img
            className="reviews__photo"
            src={item.imageUrl}
            alt=""
            draggable={false}
          />
        </div>
      ) : null}
      <blockquote className="reviews__quote">{item.quote}</blockquote>
      {item.author ? (
        <figcaption className="reviews__caption">{item.author}</figcaption>
      ) : null}
      {item.vk ? (
        <div className="reviews__footer">
          <VkBadge />
        </div>
      ) : null}
    </figure>
  )
}

function ChevronIcon({ dir }) {
  return (
    <svg
      className="reviews__chevron"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {dir === 'left' ? (
        <path
          fill="currentColor"
          d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
        />
      )}
    </svg>
  )
}

export function Reviews({ title, items }) {
  const n = items.length
  const outerRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const cycleWidthRef = useRef(0)
  const speedRef = useRef(0)
  const draggingRef = useRef(false)
  const pendingDragRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const focusWithinRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const loopSlides = useMemo(
    () =>
      [0, 1].flatMap((dup) =>
        items.map((item) => ({ item, key: `${item.id}-marq${dup}` }))
      ),
    [items]
  )

  const applyTransform = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    track.style.transform = `translate3d(${offsetRef.current}px,0,0)`
  }, [])

  const updateMetrics = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const sw = track.scrollWidth
    const half = sw / 2
    cycleWidthRef.current = half
    const narrow = window.matchMedia('(max-width: 47.99rem)').matches
    const durationSec = narrow ? 85 : 110
    speedRef.current = half > 0 ? half / durationSec : 0
    offsetRef.current = wrapOffset(offsetRef.current, half)
    applyTransform()
  }, [applyTransform])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const setRm = () => {
      reducedMotionRef.current = mq.matches
    }
    setRm()
    mq.addEventListener('change', setRm)
    return () => mq.removeEventListener('change', setRm)
  }, [])

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const onIn = () => {
      focusWithinRef.current = true
    }
    const onOut = (e) => {
      const next = e.relatedTarget
      if (next instanceof Node && outer.contains(next)) return
      focusWithinRef.current = false
    }
    outer.addEventListener('focusin', onIn)
    outer.addEventListener('focusout', onOut)
    return () => {
      outer.removeEventListener('focusin', onIn)
      outer.removeEventListener('focusout', onOut)
    }
  }, [n])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ro = new ResizeObserver(() => updateMetrics())
    ro.observe(track)
    updateMetrics()
    return () => ro.disconnect()
  }, [loopSlides, updateMetrics])

  useEffect(() => {
    const onBp = () => updateMetrics()
    const mql = window.matchMedia('(max-width: 47.99rem)')
    mql.addEventListener('change', onBp)
    return () => mql.removeEventListener('change', onBp)
  }, [updateMetrics])

  useEffect(() => {
    let rafId = 0
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.064, (now - last) / 1000)
      last = now
      const cycle = cycleWidthRef.current
      const auto =
        cycle > 0 &&
        !reducedMotionRef.current &&
        !pendingDragRef.current &&
        !draggingRef.current &&
        !focusWithinRef.current
      if (auto) {
        offsetRef.current -= speedRef.current * dt
        offsetRef.current = wrapOffset(offsetRef.current, cycle)
      }
      applyTransform()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [applyTransform])

  const getStepPx = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const slide = track.querySelector('.reviews__slide')
    if (!slide) return 0
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    return slide.getBoundingClientRect().width + gap
  }, [])

  const nudge = useCallback(
    (dir) => {
      const cycle = cycleWidthRef.current
      const step = getStepPx()
      if (cycle <= 0 || step <= 0) return
      offsetRef.current = wrapOffset(offsetRef.current + dir * step, cycle)
      applyTransform()
    },
    [getStepPx, applyTransform]
  )

  const onPointerDownViewport = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.target.closest('a, button')) return
    const vp = viewportRef.current
    if (!vp) return
    pendingDragRef.current = true
    dragStartXRef.current = e.clientX
    dragStartOffsetRef.current = offsetRef.current
    try {
      vp.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }, [])

  const onPointerMoveViewport = useCallback(
    (e) => {
      if (!pendingDragRef.current && !draggingRef.current) return
      const dx = e.clientX - dragStartXRef.current
      if (pendingDragRef.current && Math.abs(dx) > 6) {
        pendingDragRef.current = false
        draggingRef.current = true
        setIsDragging(true)
      }
      if (!draggingRef.current) return
      const cycle = cycleWidthRef.current
      offsetRef.current = wrapOffset(dragStartOffsetRef.current + dx, cycle)
      applyTransform()
    },
    [applyTransform]
  )

  const endDrag = useCallback((e) => {
    pendingDragRef.current = false
    draggingRef.current = false
    setIsDragging(false)
    const vp = viewportRef.current
    if (vp && e?.pointerId != null) {
      try {
        vp.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }
  }, [])

  const onLostPointerCapture = useCallback(() => {
    pendingDragRef.current = false
    draggingRef.current = false
    setIsDragging(false)
  }, [])

  if (n === 0) {
    return (
      <section className="section reviews" id="reviews" aria-label={title}>
        <div className="container reviews__head">
          <h2 className="reviews__title">{title}</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="section reviews" id="reviews" aria-label={title}>
      <div className="container reviews__head">
        <h2 className="reviews__title">{title}</h2>
      </div>

      <div
        ref={outerRef}
        className="reviews__carouselOuter"
        tabIndex={0}
        role="region"
        aria-roledescription="карусель отзывов"
        aria-label="Отзывы автоматически прокручиваются. Можно листать стрелками или перетаскиванием."
      >
        <button
          type="button"
          className="reviews__arrow reviews__arrow--prev"
          aria-label="Предыдущие отзывы"
          onClick={() => nudge(1)}
        >
          <ChevronIcon dir="left" />
        </button>
        <button
          type="button"
          className="reviews__arrow reviews__arrow--next"
          aria-label="Следующие отзывы"
          onClick={() => nudge(-1)}
        >
          <ChevronIcon dir="right" />
        </button>

        <div
          ref={viewportRef}
          className={`reviews__marqueeViewport${isDragging ? ' reviews__marqueeViewport--dragging' : ''}`}
          onPointerDown={onPointerDownViewport}
          onPointerMove={onPointerMoveViewport}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={onLostPointerCapture}
        >
          <div ref={trackRef} className="reviews__marqueeTrack">
            {loopSlides.map(({ item, key }) => (
              <div key={key} className="reviews__slide">
                <ReviewSlide item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
