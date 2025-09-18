import React, { useEffect, useMemo, useRef } from 'react'
import QRCode from 'qrcode'
import PropTypes from 'prop-types'

/**
 * Renderiza uno o varios códigos QR usando la librería `qrcode`.
 *
 * Características:
 * - Acepta un valor único (string) o una lista de entradas.
 * - Permite superponer un logo centrado con padding y fondo opcional.
 * - API simple y escalable para personalizaciones comunes.
 *
 * Ejemplos de uso:
 *
 * 1) Un solo QR
 *   <MoleculesQRCode value="https://mi-url.com" logoSrc="/logo.png" />
 *
 * 2) Múltiples QRs (array de strings)
 *   <MoleculesQRCode value={["A","B","C"]} size={200} gap={16} />
 *
 * 3) Múltiples QRs (array de objetos con configuración por item)
 *   <MoleculesQRCode
 *     value={[
 *       { value: 'https://a.com', label: 'A', logoSrc: '/logoA.png' },
 *       { value: 'https://b.com', label: 'B' },
 *     ]}
 *     size={220}
 *     showLabel
 *   />
 */
export default function MoleculesQRCode(props) {
  const {
    /** String o array de strings/objetos. Si es array, se renderiza un QR por elemento. */
    value,
    /** Tamaño del QR en px (ancho y alto). */
    size = 256,
    /** Nivel de corrección de error: 'L' | 'M' | 'Q' | 'H'. */
    ecLevel = 'M',
    /** Color de fondo (claro). */
    bgColor = '#FFFFFF',
    /** Color de los módulos (oscuro). */
    fgColor = '#000000',
    /** Degradado para los módulos: { from: string, to: string, direction?: 'vertical'|'horizontal' } */
    fgGradient,
    /** Margen en módulos alrededor del QR. */
    margin = 4,
  /** Forma de los módulos: 'square' | 'circle'. */
  dotShape = 'square',
  /** Escala del radio del punto (0..1) cuando dotShape==='circle'. */
  dotScale = 0.9,
  /** Estilo de los detectores (los 3 "ojos"): 'square' | 'rounded' | 'circle'. */
  finderStyle = 'circle',
  /** Colores personalizados para los detectores (outer/inner/dot). */
  finderColors,
  /** Renderer: 'canvas' | 'svg'. */
  renderer = 'canvas',
  /** Factor de pixel para alta resolución en canvas. */
  pixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1,
    /** URL del logo centrado (aplica a todos salvo que el item lo sobrescriba). */
    logoSrc,
    /** Proporción del logo respecto al tamaño total del QR (0..1). */
    logoRatio = 0.2,
    /** Padding alrededor del logo en px (fondo blanco/`logoBgColor`). */
    logoPadding = 6,
    /** Fondo del recuadro del logo (ej. '#fff' o 'transparent'). */
    logoBgColor = '#FFFFFF',
    /** Bordes redondeados del recuadro del logo en px. */
    logoBorderRadius = 8,
    /** Forma del recuadro del logo: 'rounded' | 'circle' | 'square'. */
    logoShape = 'rounded',
    /** Borde del recuadro del logo (color). */
    logoBorderColor = 'transparent',
    /** Borde del recuadro del logo (grosor px). */
    logoBorderWidth = 0,
    /** Estilo del contenedor general cuando es listado. */
    containerStyle,
    /** Clase para el contenedor general (útil en grids). */
    className,
    /** Espacio entre ítems cuando se renderiza una lista. */
    gap = 12,
    /** Mostrar una etiqueta bajo cada QR si el item trae `label`. */
    showLabel = false,
    /** Callback (dataURL) cuando el QR queda generado; para múltiples se llama por item. */
    onGenerated,
    /** Render prop opcional para personalizar cada ítem. */
    renderItem,
  } = props

  const items = useMemo(() => normalizeToItems(value, { logoSrc }), [value, logoSrc])
  // Memoizar props del QR para no crear un objeto nuevo en cada render y evitar re-renders innecesarios
  const sharedQrProps = useMemo(() => ({
    size,
    ecLevel,
    bgColor,
    fgColor,
    fgGradient,
    margin,
    dotShape,
    dotScale,
    finderStyle,
    finderColors,
    renderer,
    pixelRatio,
    logoRatio,
    logoPadding,
    logoBgColor,
    logoBorderRadius,
    logoShape,
    logoBorderColor,
    logoBorderWidth,
    onGenerated,
  }), [
    size,
    ecLevel,
    bgColor,
    fgColor,
    fgGradient,
    margin,
    dotShape,
    dotScale,
    finderStyle,
    finderColors,
    renderer,
    pixelRatio,
    logoRatio,
    logoPadding,
    logoBgColor,
    logoBorderRadius,
    logoShape,
    logoBorderColor,
    logoBorderWidth,
    onGenerated,
  ])

  if (!Array.isArray(items)) {
    return (
      <QRCodeItem
        item={items}
        size={size}
        ecLevel={ecLevel}
        bgColor={bgColor}
        fgColor={fgColor}
  fgGradient={fgGradient}
        margin={margin}
  dotShape={dotShape}
  dotScale={dotScale}
  finderStyle={finderStyle}
  finderColors={finderColors}
  renderer={renderer}
  pixelRatio={pixelRatio}
        logoRatio={logoRatio}
        logoPadding={logoPadding}
        logoBgColor={logoBgColor}
        logoBorderRadius={logoBorderRadius}
  logoShape={logoShape}
  logoBorderColor={logoBorderColor}
  logoBorderWidth={logoBorderWidth}
        onGenerated={onGenerated}
      />
    )
  }

  return (
    <div
      className={className}
      style={{ display: 'grid', gap, ...containerStyle }}
    >
      {items.map((item, idx) => (
        renderItem ? (
          renderItem({
            index: idx,
            item,
            Component: QRCodeItem,
            qrProps: sharedQrProps,
          })
        ) : (
          <div key={item.key ?? idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCodeItem
              item={item}
              size={size}
              ecLevel={ecLevel}
              bgColor={bgColor}
              fgColor={fgColor}
              fgGradient={fgGradient}
              margin={margin}
              dotShape={dotShape}
              dotScale={dotScale}
              finderStyle={finderStyle}
              finderColors={finderColors}
              renderer={renderer}
              pixelRatio={pixelRatio}
              logoRatio={logoRatio}
              logoPadding={logoPadding}
              logoBgColor={logoBgColor}
              logoBorderRadius={logoBorderRadius}
              logoShape={logoShape}
              logoBorderColor={logoBorderColor}
              logoBorderWidth={logoBorderWidth}
              onGenerated={onGenerated}
            />
            {showLabel && item.label ? (
              <span style={{ marginTop: 8 }}>{item.label}</span>
            ) : null}
          </div>
        )
      ))}
    </div>
  )
}

/**
 * Convierte la prop `value` en un formato interno estandarizado.
 * @param {string | Array<string | {value:string,label?:string,logoSrc?:string,key?:string|number}>} value
 * @param {{logoSrc?: string}} defaults
 * @returns {{value:string,label?:string,logoSrc?:string,key?:string|number}|Array<{value:string,label?:string,logoSrc?:string,key?:string|number}>}
 */
function normalizeToItems(value, defaults) {
  if (Array.isArray(value)) {
    return value.map((v, i) => {
      if (typeof v === 'string') return { value: v, logoSrc: defaults.logoSrc, key: i }
      if (v && typeof v === 'object' && typeof v.value === 'string') return { logoSrc: defaults.logoSrc, ...v, key: v.key ?? i }
      return { value: String(v), logoSrc: defaults.logoSrc, key: i }
    })
  }
  if (typeof value === 'object' && value && typeof value.value === 'string') return value
  return { value: String(value), logoSrc: defaults.logoSrc }
}

/**
 * Renderiza un solo QR en un canvas y superpone un logo en el centro si se indica.
 *
 * @param {{
 *   item: { value: string, label?: string, logoSrc?: string },
 *   size?: number,
 *   ecLevel?: 'L'|'M'|'Q'|'H',
 *   bgColor?: string,
 *   fgColor?: string,
 *   margin?: number,
 *   dotShape?: 'square'|'circle',
 *   dotScale?: number,
 *   logoRatio?: number,
 *   logoPadding?: number,
 *   logoBgColor?: string,
 *   logoBorderRadius?: number,
 *   onGenerated?: (dataUrl: string, item: {value:string,label?:string}) => void,
 * }} props
 */
export const QRCodeItem = React.memo(function QRCodeItem(props) {
  const {
    item,
    size = 256,
    ecLevel = 'M',
    bgColor = '#FFFFFF',
    fgColor = '#007385',
    fgGradient,
    margin = 4,
  dotShape = 'square',
  dotScale = 0.9,
  finderStyle = 'circle',
  finderColors,
  renderer = 'canvas',
  pixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1,
    logoRatio = 0.2,
    logoPadding = 6,
    logoBgColor = '#FFFFFF',
    logoBorderRadius = 8,
    logoShape = 'rounded',
    logoBorderColor = 'transparent',
    logoBorderWidth = 0,
    onGenerated,
  } = props

  const canvasRef = useRef(null)
  const svgRef = useRef(null)
  // Desestructurar para estabilizar dependencias del effect
  const itemValue = item?.value
  const itemLogoSrc = item?.logoSrc
  const itemLabel = item?.label
  const itemInfo = useMemo(() => ({ value: itemValue, label: itemLabel, logoSrc: itemLogoSrc }), [itemValue, itemLabel, itemLogoSrc])

  useEffect(() => {
    if (renderer === 'svg') {
      const container = svgRef.current
      if (!container) return
      const svgMarkup = buildSvgQRCode({
        text: itemValue,
        size,
        ecLevel,
        marginModules: margin,
        bgColor,
        fgColor,
        fgGradient,
        dotShape,
        dotScale,
        finderStyle,
        finderColors,
      })
      container.innerHTML = svgMarkup
  onGenerated?.('', itemInfo)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return

    // Auto-tune cuando hay logo: subir corrección, margen y limitar tamaño del logo
    const hasLogo = Boolean(itemLogoSrc)
    const effectiveEcLevel = hasLogo ? 'H' : ecLevel
    const effectiveMargin = hasLogo ? Math.max(margin, 8) : margin
    const effectiveLogoRatio = hasLogo ? clamp(logoRatio, 0, 0.18) : logoRatio

  const drawThenOverlay = async () => {
      try {
  if (dotShape === 'circle' || finderStyle !== 'square' || finderColors || fgGradient || pixelRatio !== 1) {
          await drawCustomQRCode({
            canvas,
            text: itemValue,
            size,
            ecLevel: effectiveEcLevel,
            marginModules: effectiveMargin,
            bgColor,
            fgColor,
  fgGradient,
    pixelRatio,
    skipResize: true,
            dotShape,
            dotScale,
  finderStyle,
  finderColors,
          })
        } else {
          await QRCode.toCanvas(canvas, itemValue, {
            errorCorrectionLevel: effectiveEcLevel,
    width: Math.round(size * pixelRatio),
            margin: effectiveMargin,
            color: { dark: fgColor, light: bgColor },
          })
        }
      } catch {
        // Fallback al renderer por defecto
        await QRCode.toCanvas(canvas, itemValue, {
          errorCorrectionLevel: effectiveEcLevel,
      width: Math.round(size * pixelRatio),
          margin: effectiveMargin,
          color: { dark: fgColor, light: bgColor },
        })
      }

      // Generado: aplicar overlay si corresponde
      // Si hay logo, superponerlo; si no, emitir dataURL
    if (hasLogo) {
        overlayLogo({
          canvas,
          size,
          logoSrc: itemLogoSrc,
          ratio: effectiveLogoRatio,
          padding: Math.max(0, logoPadding),
      bgColor: logoBgColor,
      borderRadius: Math.max(0, logoBorderRadius),
      shape: logoShape,
      borderColor: logoBorderColor,
      borderWidth: logoBorderWidth,
          onDone: () => {
            onGenerated?.(safeToDataURL(canvas), itemInfo)
          },
        })
      } else {
        onGenerated?.(safeToDataURL(canvas), itemInfo)
      }
    }

    // Configurar canvas para alta resolución
    canvas.width = Math.round(size * pixelRatio)
    canvas.height = Math.round(size * pixelRatio)
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    drawThenOverlay().catch(() => { /* silencioso */ })
  }, [
    renderer,
    itemValue,
    itemLogoSrc,
    size,
    ecLevel,
    bgColor,
    fgColor,
    fgGradient,
    margin,
    logoRatio,
    logoPadding,
    logoBgColor,
    logoBorderRadius,
    onGenerated,
    dotShape,
    dotScale,
    finderStyle,
    finderColors,
    logoShape,
    logoBorderColor,
    logoBorderWidth,
    pixelRatio,
    itemInfo,
  ])

  if (renderer === 'svg') {
    return (
      <div ref={svgRef} style={{ width: size, height: size }} aria-label={itemLabel || itemValue} role="img" />
    )
  }
  return (
    <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} aria-label={itemLabel || itemValue} />
  )
})

/**
 * Dibuja un logo centrado sobre un canvas.
 * @param {{
 *  canvas: HTMLCanvasElement,
 *  size: number,
 *  logoSrc: string,
 *  ratio: number,
 *  padding: number,
 *  bgColor: string,
 *  borderRadius: number,
 *  onDone?: () => void,
 * }} cfg
 */
function overlayLogo(cfg) {
  const { canvas, size, logoSrc, ratio, padding, bgColor, borderRadius, onDone, shape = 'rounded', borderColor = 'transparent', borderWidth = 0 } = cfg
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const logoSize = Math.floor(size * ratio)
    const box = {
      w: logoSize + padding * 2,
      h: logoSize + padding * 2,
      x: Math.round((size - (logoSize + padding * 2)) / 2),
      y: Math.round((size - (logoSize + padding * 2)) / 2),
    }

    // Fondo del logo para mejorar contraste y lectura del QR
    if (bgColor && bgColor !== 'transparent') {
      if (shape === 'circle') {
        const radius = Math.min(box.w, box.h) / 2
        ctx.save()
        ctx.beginPath()
        ctx.arc(box.x + box.w / 2, box.y + box.h / 2, radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = bgColor
        ctx.fill()
        if (borderWidth > 0 && borderColor && borderColor !== 'transparent') {
          ctx.lineWidth = borderWidth
          ctx.strokeStyle = borderColor
          ctx.stroke()
        }
        ctx.restore()
      } else {
        drawRoundedRect(ctx, box.x, box.y, box.w, box.h, shape === 'rounded' ? borderRadius : 0, bgColor)
        if (borderWidth > 0 && borderColor && borderColor !== 'transparent') {
          ctx.save()
          ctx.lineWidth = borderWidth
          ctx.strokeStyle = borderColor
          const r = shape === 'rounded' ? borderRadius : 0
          ctx.beginPath()
          // ruta de borde
          ctx.moveTo(box.x + r, box.y)
          ctx.lineTo(box.x + box.w - r, box.y)
          ctx.quadraticCurveTo(box.x + box.w, box.y, box.x + box.w, box.y + r)
          ctx.lineTo(box.x + box.w, box.y + box.h - r)
          ctx.quadraticCurveTo(box.x + box.w, box.y + box.h, box.x + box.w - r, box.y + box.h)
          ctx.lineTo(box.x + r, box.y + box.h)
          ctx.quadraticCurveTo(box.x, box.y + box.h, box.x, box.y + box.h - r)
          ctx.lineTo(box.x, box.y + r)
          ctx.quadraticCurveTo(box.x, box.y, box.x + r, box.y)
          ctx.closePath()
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    const x = box.x + padding
    const y = box.y + padding
    ctx.drawImage(img, x, y, logoSize, logoSize)
    onDone?.()
  }
  img.onerror = () => onDone?.()
  img.src = logoSrc
}

function drawRoundedRect(ctx, x, y, w, h, r, fill) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.restore()
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function safeToDataURL(canvas) {
  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}

/**
 * Dibuja un QR con módulos circulares en un canvas.
 * Usa QRCode.create para obtener la matriz y pinta círculos por cada módulo oscuro.
 *
 * @param {{
 *  canvas: HTMLCanvasElement,
 *  text: string,
 *  size: number,
 *  ecLevel: 'L'|'M'|'Q'|'H',
 *  marginModules: number,
 *  bgColor: string,
 *  fgColor: string,
 *  dotScale: number,
 * }} opts
 * @returns {Promise<void>}
 */
function drawCustomQRCode(opts) {
  const { canvas, text, size, ecLevel, marginModules, bgColor, fgColor, fgGradient, dotShape, dotScale, finderStyle, finderColors, pixelRatio = 1, skipResize } = opts
  const ctx = canvas.getContext('2d')
  if (!skipResize) {
    canvas.width = Math.round(size * pixelRatio)
    canvas.height = Math.round(size * pixelRatio)
    const ctx2 = canvas.getContext('2d')
    if (ctx2 && pixelRatio !== 1) ctx2.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  // Fondo
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  // Crear matriz del QR
  let qr, modules
  try {
    qr = QRCode.create(text, { errorCorrectionLevel: ecLevel })
    modules = qr.modules
  } catch (e) {
    return Promise.reject(e)
  }
  let n = modules?.size
  if (!n) {
    const data = modules?.data
    if (data && typeof data.length === 'number' && data.length > 0) {
      const root = Math.sqrt(data.length)
      if (Number.isInteger(root)) n = root
    }
  }
  if (!n || n <= 0) return Promise.reject(new Error('Invalid QR matrix'))

  const m = Math.max(0, marginModules | 0)
  const cell = size / (n + 2 * m)
  const radius = (cell / 2) * clamp(dotScale ?? 0.9, 0.1, 1)

  // Determinar zonas de detectores (7x7) en tres esquinas
  const isInFinder = (r, c) => (
    (r < 7 && c < 7) ||
    (r < 7 && c >= n - 7) ||
    (r >= n - 7 && c < 7)
  )

  // Preparar color de módulos (degradado u homogéneo)
  if (fgGradient && fgGradient.from && fgGradient.to) {
    const dir = fgGradient.direction === 'horizontal' ? 'horizontal' : 'vertical'
    const grad = dir === 'horizontal'
      ? ctx.createLinearGradient(0, 0, size, 0)
      : ctx.createLinearGradient(0, 0, 0, size)
    grad.addColorStop(0, fgGradient.from)
    grad.addColorStop(1, fgGradient.to)
    ctx.fillStyle = grad
  } else {
    ctx.fillStyle = fgColor
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const idx = r * n + c
      let isDark
      if (typeof modules.get === 'function') {
        isDark = Boolean(modules.get(r, c))
      } else if (modules.data) {
        const d = modules.data
        if (Array.isArray(d[0])) {
          // 2D array
          isDark = Boolean(d[r][c])
        } else if (typeof d.length === 'number') {
          isDark = Boolean(d[idx])
        } else {
          isDark = false
        }
      } else {
        isDark = false
      }
      if (!isDark) continue

      const x = (m + c) * cell
      const y = (m + r) * cell
      const cx = x + cell / 2
      const cy = y + cell / 2

      if (isInFinder(r, c)) {
        // Saltar módulos de finder; se dibujarán de forma compuesta al final
        continue
      } else {
        // Módulos normales
        if (dotShape === 'circle') {
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.fillRect(x, y, cell, cell)
        }
      }
    }
  }

  // Dibujar detectores compuestos (7x7 -> 5x5 -> 3x3) con colores/estilo
  const drawFinder = (top, left) => {
    const size7 = cell * 7
    const size5 = cell * 5
    const size3 = cell * 3
    const x7 = (m + left) * cell
    const y7 = (m + top) * cell
    const x5 = x7 + cell
    const y5 = y7 + cell
    const x3 = x7 + 2 * cell
    const y3 = y7 + 2 * cell

    const outerColor = finderColors?.outer || fgColor
    const innerColor = finderColors?.inner || bgColor
    const dotColor = finderColors?.dot || fgColor

    if (finderStyle === 'circle') {
      // Círculos concéntricos
      const cx = x7 + size7 / 2
      const cy = y7 + size7 / 2
      ctx.save()
      ctx.fillStyle = outerColor
      ctx.beginPath(); ctx.arc(cx, cy, size7 / 2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = innerColor
      ctx.beginPath(); ctx.arc(cx, cy, size5 / 2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = dotColor
      ctx.beginPath(); ctx.arc(cx, cy, size3 / 2, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    } else if (finderStyle === 'rounded') {
      drawRoundedRect(ctx, x7, y7, size7, size7, cell * 1.2, outerColor)
      drawRoundedRect(ctx, x5, y5, size5, size5, cell * 1.0, innerColor)
      drawRoundedRect(ctx, x3, y3, size3, size3, cell * 0.8, dotColor)
    } else {
      // square
      ctx.fillStyle = outerColor; ctx.fillRect(x7, y7, size7, size7)
      ctx.fillStyle = innerColor; ctx.fillRect(x5, y5, size5, size5)
      ctx.fillStyle = dotColor; ctx.fillRect(x3, y3, size3, size3)
    }
  }

  // top-left, top-right, bottom-left
  drawFinder(0, 0)
  drawFinder(0, n - 7)
  drawFinder(n - 7, 0)
  return Promise.resolve()
}

// Construye un SVG string con el mismo estilo que el renderer canvas
function buildSvgQRCode(opts) {
  const { text, size, ecLevel, marginModules, bgColor, fgColor, fgGradient, dotShape, dotScale, finderStyle, finderColors } = opts
  let qr
  try { qr = QRCode.create(text, { errorCorrectionLevel: ecLevel }) } catch { return '' }
  const modules = qr.modules
  let n = modules?.size
  if (!n) {
    const data = modules?.data
    if (data && typeof data.length === 'number' && data.length > 0) {
      const root = Math.sqrt(data.length)
      if (Number.isInteger(root)) n = root
    }
  }
  if (!n || n <= 0) return ''
  const m = Math.max(0, marginModules | 0)
  const cell = size / (n + 2 * m)
  const radius = (cell / 2) * clamp(dotScale ?? 0.9, 0.1, 1)
  const isInFinder = (r, c) => ((r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7))
  const outerColor = finderColors?.outer || fgColor
  const innerColor = finderColors?.inner || bgColor
  const dotColor = finderColors?.dot || fgColor
  const defs = []
  let fillRef = fgColor
  if (fgGradient && fgGradient.from && fgGradient.to) {
    const id = `grad-${Math.random().toString(36).slice(2)}`
    const isH = fgGradient.direction === 'horizontal'
    defs.push(`<linearGradient id="${id}" x1="0%" y1="0%" x2="${isH ? '100%' : '0%'}" y2="${isH ? '0%' : '100%'}"><stop offset="0%" stop-color="${fgGradient.from}"/><stop offset="100%" stop-color="${fgGradient.to}"/></linearGradient>`)
    fillRef = `url(#${id})`
  }
  const parts = []
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`)
  if (defs.length) parts.push(`<defs>${defs.join('')}</defs>`)
  parts.push(`<rect width="${size}" height="${size}" fill="${bgColor}"/>`)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const idx = r * n + c
      let isDark
      if (typeof modules.get === 'function') isDark = Boolean(modules.get(r, c))
      else if (modules.data) {
        const d = modules.data
        if (Array.isArray(d[0])) isDark = Boolean(d[r][c])
        else if (typeof d.length === 'number') isDark = Boolean(d[idx])
        else isDark = false
      } else isDark = false
      if (!isDark || isInFinder(r, c)) continue
      const x = (m + c) * cell
      const y = (m + r) * cell
      if (dotShape === 'circle') {
        const cx = x + cell / 2
        const cy = y + cell / 2
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fillRef}"/>`)
      } else {
        parts.push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fillRef}"/>`)
      }
    }
  }
  const drawFinder = (top, left) => {
    const size7 = cell * 7, size5 = cell * 5, size3 = cell * 3
    const x7 = (m + left) * cell, y7 = (m + top) * cell
    const x5 = x7 + cell, y5 = y7 + cell
    const x3 = x7 + 2 * cell, y3 = y7 + 2 * cell
    if (finderStyle === 'circle') {
      const cx = x7 + size7 / 2, cy = y7 + size7 / 2
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${size7 / 2}" fill="${outerColor}"/>`)
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${size5 / 2}" fill="${innerColor}"/>`)
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${size3 / 2}" fill="${dotColor}"/>`)
    } else if (finderStyle === 'rounded') {
      parts.push(`<rect x="${x7}" y="${y7}" width="${size7}" height="${size7}" rx="${cell * 1.2}" fill="${outerColor}"/>`)
      parts.push(`<rect x="${x5}" y="${y5}" width="${size5}" height="${size5}" rx="${cell}" fill="${innerColor}"/>`)
      parts.push(`<rect x="${x3}" y="${y3}" width="${size3}" height="${size3}" rx="${cell * 0.8}" fill="${dotColor}"/>`)
    } else {
      parts.push(`<rect x="${x7}" y="${y7}" width="${size7}" height="${size7}" fill="${outerColor}"/>`)
      parts.push(`<rect x="${x5}" y="${y5}" width="${size5}" height="${size5}" fill="${innerColor}"/>`)
      parts.push(`<rect x="${x3}" y="${y3}" width="${size3}" height="${size3}" fill="${dotColor}"/>`)
    }
  }
  drawFinder(0, 0); drawFinder(0, n - 7); drawFinder(n - 7, 0)
  parts.push('</svg>')
  return parts.join('')
}

// PropTypes
MoleculesQRCode.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string, logoSrc: PropTypes.string, key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string, logoSrc: PropTypes.string, key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
      ])
    ),
  ]).isRequired,
  size: PropTypes.number,
  ecLevel: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  fgGradient: PropTypes.shape({ from: PropTypes.string.isRequired, to: PropTypes.string.isRequired, direction: PropTypes.oneOf(['vertical', 'horizontal']) }),
  margin: PropTypes.number,
  dotShape: PropTypes.oneOf(['square', 'circle']),
  dotScale: PropTypes.number,
  finderStyle: PropTypes.oneOf(['square', 'rounded', 'circle']),
  finderColors: PropTypes.shape({ outer: PropTypes.string, inner: PropTypes.string, dot: PropTypes.string }),
  renderer: PropTypes.oneOf(['canvas', 'svg']),
  pixelRatio: PropTypes.number,
  logoSrc: PropTypes.string,
  logoRatio: PropTypes.number,
  logoPadding: PropTypes.number,
  logoBgColor: PropTypes.string,
  logoBorderRadius: PropTypes.number,
  logoShape: PropTypes.oneOf(['rounded', 'circle', 'square']),
  logoBorderColor: PropTypes.string,
  logoBorderWidth: PropTypes.number,
  containerStyle: PropTypes.object,
  className: PropTypes.string,
  gap: PropTypes.number,
  showLabel: PropTypes.bool,
  onGenerated: PropTypes.func,
  renderItem: PropTypes.func,
}

QRCodeItem.propTypes = {
  item: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    logoSrc: PropTypes.string,
  }).isRequired,
  size: PropTypes.number,
  ecLevel: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  fgGradient: PropTypes.shape({ from: PropTypes.string.isRequired, to: PropTypes.string.isRequired, direction: PropTypes.oneOf(['vertical', 'horizontal']) }),
  margin: PropTypes.number,
  dotShape: PropTypes.oneOf(['square', 'circle']),
  dotScale: PropTypes.number,
  finderStyle: PropTypes.oneOf(['square', 'rounded', 'circle']),
  finderColors: PropTypes.shape({ outer: PropTypes.string, inner: PropTypes.string, dot: PropTypes.string }),
  renderer: PropTypes.oneOf(['canvas', 'svg']),
  pixelRatio: PropTypes.number,
  logoRatio: PropTypes.number,
  logoPadding: PropTypes.number,
  logoBgColor: PropTypes.string,
  logoBorderRadius: PropTypes.number,
  logoShape: PropTypes.oneOf(['rounded', 'circle', 'square']),
  logoBorderColor: PropTypes.string,
  logoBorderWidth: PropTypes.number,
  onGenerated: PropTypes.func,
}
