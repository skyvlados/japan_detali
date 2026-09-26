// Номер в международном формате; пробелы, скобки и дефисы допустимы.
export function getContactLinks(phone: string, message = '') {
  const number = phone.replace(/[\s()+-]/g, '')
  if (!/^[1-9]\d{6,14}$/.test(number)) {
    throw new Error('Phone must include a country code and 7–15 digits')
  }
  return {
    phoneHref: `tel:+${number}`,
    whatsapp: withMessage(`https://wa.me/${number}`, message),
    telegram: withMessage(`https://t.me/+${number}`, message),
  }
}

function withMessage(url: string, message: string) {
  return message.trim() ? `${url}?text=${encodeURIComponent(message)}` : url
}

export function getTelegramLink(contact: string, message = '') {
  const value = contact.trim()
  if (/^[+\d(]/.test(value)) return getContactLinks(value, message).telegram

  const username = value.replace(/^@/, '')
  if (!/^[a-zA-Z][a-zA-Z0-9_]{0,31}$/.test(username)) {
    throw new Error('Telegram contact must be an international phone number or username')
  }
  return withMessage(`https://t.me/${username}`, message)
}
