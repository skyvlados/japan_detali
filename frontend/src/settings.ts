import { defaultAbout, type About } from './about'
import { isYandexMapsUrl, type Store } from './stores'
import { getContactLinks, getTelegramLink } from './contact-links'

export type SiteSettings = {
  contacts: {
    phones: { label: string; href: string }[]
    phoneLabel: string
    phoneHref: string
    email: string
    emailHref: string
    whatsapp: string
    telegram: string
    messageText?: string
  }
  about: About
  stores: Store[]
  legal?: {
    name?: string
    inn?: string
    ogrn?: string
  }
}

export function parseSettings(value: unknown): SiteSettings {
  if (!value || typeof value !== 'object') throw new Error('Invalid settings')
  const { contacts, stores, legal, about = defaultAbout } = value as SiteSettings
  // Optional public details must not prevent the rest of the site from loading.
  const legalText = (value: unknown) => typeof value === 'string' ? value.trim() || undefined : undefined
  const legalDetails = {
    name: legalText(legal?.name),
    inn: legalText(legal?.inn),
    ogrn: legalText(legal?.ogrn),
  }
  const nonempty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
  if (!about || ![about.eyebrow, about.title, about.experienceValue, about.experienceLabel].every(nonempty) ||
    !Array.isArray(about.paragraphs) || about.paragraphs.length === 0 || !about.paragraphs.every(nonempty) ||
    !Array.isArray(about.highlights) || !about.highlights.every(item => item && nonempty(item.title) && nonempty(item.text))) {
    throw new Error('Invalid about content')
  }
  const fields = ['email', 'emailHref'] as const
  if (!contacts || !fields.every(key => typeof contacts[key] === 'string' && contacts[key].trim())) {
    throw new Error('Invalid contacts')
  }
  const raw = contacts as unknown as {
    phones?: unknown; phoneLabel?: string; whatsappPhone?: unknown; telegramPhone?: unknown
  }
  // Совместимость с ранее опубликованным JSON с одним phoneLabel.
  const numbers = raw.phones ?? (raw.phoneLabel ? [raw.phoneLabel] : undefined)
  if (!Array.isArray(numbers) || numbers.length === 0 || !numbers.every(number => typeof number === 'string' && number.trim())) {
    throw new Error('At least one phone is required')
  }
  const phones = numbers.map((label: string) => ({ label: label.trim(), href: getContactLinks(label).phoneHref }))
  const whatsappPhone = raw.whatsappPhone ?? raw.phoneLabel
  const telegramPhone = raw.telegramPhone ?? raw.phoneLabel
  if (typeof whatsappPhone !== 'string' || typeof telegramPhone !== 'string') {
    throw new Error('WhatsApp phone and Telegram contact are required')
  }
  if (contacts.messageText !== undefined && typeof contacts.messageText !== 'string') {
    throw new Error('Message text must be a string')
  }
  const contactLinks = {
    phones,
    phoneLabel: phones[0].label,
    phoneHref: phones[0].href,
    whatsapp: getContactLinks(whatsappPhone, contacts.messageText).whatsapp,
    telegram: getTelegramLink(telegramPhone, contacts.messageText),
  }
  if (!contacts.emailHref.startsWith('mailto:')) {
    throw new Error('Invalid contact links')
  }
  if (!Array.isArray(stores) || stores.length === 0 || !stores.every(store =>
    store && ['id', 'name', 'address'].every(key => typeof store[key as keyof Store] === 'string' && String(store[key as keyof Store]).trim()) &&
    typeof store.addressConfirmed === 'boolean' &&
    (store.mapUrl === undefined || store.mapUrl === '' || isYandexMapsUrl(store.mapUrl)) &&
    (store.coordinates === undefined || (store.coordinates !== null &&
      Number.isFinite(store.coordinates.latitude) && Math.abs(store.coordinates.latitude) <= 90 &&
      Number.isFinite(store.coordinates.longitude) && Math.abs(store.coordinates.longitude) <= 180)) &&
    (store.workingHours === undefined || typeof store.workingHours === 'string') &&
    (store.section === undefined || typeof store.section === 'string') &&
    (store.directions === undefined || typeof store.directions === 'string')
  ) || new Set(stores.map(store => store.id)).size !== stores.length) {
    throw new Error('Invalid stores')
  }
  return { contacts: { ...contacts, ...contactLinks }, stores,
    legal: Object.values(legalDetails).some(Boolean) ? legalDetails : undefined, about }
}

export async function loadSettings(): Promise<SiteSettings> {
  const response = await fetch(import.meta.env.VITE_SITE_SETTINGS_URL || '/site-settings.json', {
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error('Settings unavailable')
  return parseSettings(await response.json())
}
