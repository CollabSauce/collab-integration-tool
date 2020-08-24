// https://github.com/jxnblk/css-box-shadow

// eslint-disable-next-line
const VALUES_REG = /,(?![^\(]*\))/
const PARTS_REG = /\s(?![^(]*\))/
const LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/


const isColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color === strColor || (typeof strColor === 'string' && strColor.includes('rgb'));
};

const getColor = (parts) => {
  const first = parts.slice(0,1)[0];
  const last = parts.slice(-1)[0];
  if (!isLength(first) && isColor(first)) {
    return first;
  } else if (!isLength(last) && isColor(last)) {
    return last;
  }
};

const parseValue = str => {
  const parts = str.split(PARTS_REG);
  const inset = parts.includes('inset');
  const color = getColor(parts);

  const nums = parts
    .filter(n => n !== 'inset')
    .filter(n => n !== color)
    .filter(n => n !== 'none')
    .map(toNum)
  const [ offsetX, offsetY, blurRadius, spreadRadius ] = nums

  return {
    inset,
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color
  }
}

const stringifyValue = obj => {
  const {
    inset,
    offsetX = 0,
    offsetY = 0,
    blurRadius = 0,
    spreadRadius,
    color
  } = obj || {}

  return [
    (inset ? 'inset' : null),
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color
  ].filter(v => v !== null && v !== undefined)
    .map(toPx)
    .map(s => ('' + s).trim())
    .join(' ')
}

const isLength = v => v === '0' || LENGTH_REG.test(v)
const toNum = v => {
  if (!/px$/.test(v) && v !== '0') return v
  const n = parseFloat(v)
  return !isNaN(n) ? n : v
}
const toPx = n => typeof n === 'number' && n !== 0 ? (n + 'px') : n

export const parseBoxShadow = str => str.split(VALUES_REG).map(s => s.trim()).map(parseValue)
export const stringifyBoxShadow = arr => arr.map(stringifyValue).join(', ')
