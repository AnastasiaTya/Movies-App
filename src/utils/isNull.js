const isNull = (str) => {
  const pattern = /null$/
  if (pattern.test(str)) return true
  return false
}

export default isNull
