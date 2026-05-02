import { useRef, useState } from 'react'

/**
 * Drag logic for a 2-option "pill indicator" switch.
 * - Drag starts only when pointer is down on the active handle (you place it over active pill).
 * - During drag, indicator follows pointer (0..1). On release, it snaps with a threshold.
 */
export function usePillSwitchDrag({
  valueKey,
  onChangeKey,
  snapThreshold = 0.35,
  getTravelPx,
}) {
  const pointerIdRef = useRef(null)
  const dragStartXRef = useRef(0)
  const dragStartTRef = useRef(0)
  const [dragT, setDragT] = useState(null) // null => not dragging

  const activeKey = dragT == null ? valueKey : dragT >= snapThreshold ? 'right' : 'left'

  function startDrag(e) {
    if (e.button != null && e.button !== 0) return
    if (!getTravelPx) return

    // drag should not trigger a click on underlying buttons
    e.preventDefault()
    e.stopPropagation()

    pointerIdRef.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)

    dragStartXRef.current = e.clientX
    dragStartTRef.current = valueKey === 'right' ? 1 : 0
    setDragT(dragStartTRef.current)
  }

  function moveDrag(e) {
    if (pointerIdRef.current == null) return
    if (e.pointerId !== pointerIdRef.current) return

    const travel = Math.max(1, getTravelPx())
    const dx = e.clientX - dragStartXRef.current
    const t = Math.min(1, Math.max(0, dragStartTRef.current + dx / travel))
    setDragT(t)
  }

  function endDrag(e) {
    if (pointerIdRef.current == null) return
    if (e.pointerId !== pointerIdRef.current) return

    pointerIdRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    const t = dragT == null ? (valueKey === 'right' ? 1 : 0) : dragT
    setDragT(null)
    onChangeKey(t >= snapThreshold ? 'right' : 'left')
  }

  function cancelDrag() {
    pointerIdRef.current = null
    setDragT(null)
  }

  return {
    dragT,
    isDragging: dragT != null,
    activeKey,
    indicatorStyle: dragT == null ? undefined : { transform: `translateX(${dragT * 100}%)` },
    handleStyle: dragT == null ? undefined : { transform: `translateX(${dragT * 100}%)` },
    handleProps: {
      onPointerDown: startDrag,
      onPointerMove: moveDrag,
      onPointerUp: endDrag,
      onPointerCancel: cancelDrag,
      onLostPointerCapture: cancelDrag,
    },
  }
}

