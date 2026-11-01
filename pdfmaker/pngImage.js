// Reads a PNG file into an image a PDF can show, by hand, without libraries.
// A PDF can't show PNG files as they are, so the pixels are unpacked and packed again as plain RGB.
// Uses the compression built into browsers and Node (DecompressionStream / CompressionStream).
// Supports the usual PNGs: 8 bits per colour, RGB or RGBA, not interlaced. See the PNG spec: https://www.w3.org/TR/png/

const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]
const RGB = 2
const RGBA = 6

// Returns { width, height, data }: data is the RGB pixels, deflate-compressed (a PDF FlateDecode image).
// Transparent pixels are mixed with white, the colour of the page.
export async function readPng(file) {
  const bytes = file instanceof Uint8Array ? file : new Uint8Array(file)
  if (!SIGNATURE.every((byte, i) => bytes[i] === byte)) {
    throw new Error('The certificate background is not a PNG file')
  }

  const { header, compressed } = readChunks(bytes)
  const { width, height, bitDepth, colorType, interlace } = header
  if (bitDepth !== 8 || (colorType !== RGB && colorType !== RGBA) || interlace !== 0) {
    throw new Error('The certificate background must be an 8-bit RGB or RGBA PNG that is not interlaced')
  }

  const channels = colorType === RGBA ? 4 : 3
  const filtered = await runThrough(compressed, new DecompressionStream('deflate'))
  const rgb = toRgb(unfilter(filtered, width, height, channels), channels)
  return { width, height, data: await runThrough(rgb, new CompressionStream('deflate')) }
}

// A PNG is a list of chunks: [length][type][data][checksum]. IHDR has the size and kind, IDAT the pixels.
function readChunks(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const pixelParts = []
  let header = null
  let pos = SIGNATURE.length
  while (pos + 8 <= bytes.length) {
    const length = view.getUint32(pos)
    const type = String.fromCharCode(...bytes.subarray(pos + 4, pos + 8))
    const data = bytes.subarray(pos + 8, pos + 8 + length)
    if (type === 'IHDR') {
      header = {
        width: view.getUint32(pos + 8),
        height: view.getUint32(pos + 12),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      }
    } else if (type === 'IDAT') {
      pixelParts.push(data)
    } else if (type === 'IEND') {
      break
    }
    pos += 12 + length
  }
  if (!header || pixelParts.length === 0) throw new Error('The certificate background PNG is damaged')
  return { header, compressed: concat(pixelParts) }
}

// Each row of pixels starts with a filter byte that says how it was stored (relative to the pixel on its left,
// the one above, ...). This turns every row back into the real pixel values.
function unfilter(filtered, width, height, channels) {
  const stride = width * channels
  const pixels = new Uint8Array(stride * height)
  for (let y = 0; y < height; y++) {
    const filter = filtered[y * (stride + 1)]
    const row = filtered.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    const out = y * stride
    const up = out - stride
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[out + x - channels] : 0
      const above = y > 0 ? pixels[up + x] : 0
      const aboveLeft = y > 0 && x >= channels ? pixels[up + x - channels] : 0
      let predicted = 0
      if (filter === 1) predicted = left
      else if (filter === 2) predicted = above
      else if (filter === 3) predicted = (left + above) >> 1
      else if (filter === 4) predicted = paeth(left, above, aboveLeft)
      pixels[out + x] = (row[x] + predicted) & 0xff
    }
  }
  return pixels
}

// The neighbour (left, above or above-left) closest to left + above - aboveLeft
function paeth(left, above, aboveLeft) {
  const estimate = left + above - aboveLeft
  const toLeft = Math.abs(estimate - left)
  const toAbove = Math.abs(estimate - above)
  const toAboveLeft = Math.abs(estimate - aboveLeft)
  if (toLeft <= toAbove && toLeft <= toAboveLeft) return left
  return toAbove <= toAboveLeft ? above : aboveLeft
}

// RGBA to RGB: each colour is mixed with white as much as the pixel is transparent
function toRgb(pixels, channels) {
  if (channels === 3) return pixels
  const rgb = new Uint8Array((pixels.length / 4) * 3)
  for (let i = 0, o = 0; i < pixels.length; i += 4, o += 3) {
    const alpha = pixels[i + 3]
    for (let c = 0; c < 3; c++) rgb[o + c] = Math.round((pixels[i + c] * alpha + 255 * (255 - alpha)) / 255)
  }
  return rgb
}

async function runThrough(bytes, stream) {
  const result = new Response(new Blob([bytes]).stream().pipeThrough(stream))
  return new Uint8Array(await result.arrayBuffer())
}

function concat(parts) {
  const all = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0))
  let pos = 0
  for (const part of parts) {
    all.set(part, pos)
    pos += part.length
  }
  return all
}
