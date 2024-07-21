const validateText = (text, length) => {
  if (typeof text !== 'string') {
    return null
  }
  if (text.length > 20) {
    const index = text.lastIndexOf(' ', length)
    return `${text.slice(0, index)}...`
  }
  return text
}

export default validateText
