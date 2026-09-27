export type Store = {
  id: string
  name: string
  address: string
  addressConfirmed: boolean
  mapUrl?: string
  coordinates?: { latitude: number; longitude: number }
  workingHours?: string
  directions?: string
  section?: string
}

export function isYandexMapsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ['yandex.ru', 'yandex.com', 'www.yandex.ru', 'www.yandex.com'].includes(url.hostname) &&
      url.pathname.startsWith('/maps/') && !url.username && !url.password && !url.port
  } catch {
    return false
  }
}

export function getStoreMapLinks({ address, coordinates, mapUrl }: Store) {
  const search = new URLSearchParams({ text: address })
  const widget = new URLSearchParams({ mode: 'search', text: address, z: '16' })
  // Mobile Maps needs latitude,longitude to reliably resolve the destination.
  const destination = coordinates ? `${coordinates.latitude},${coordinates.longitude}` : address
  const route = new URLSearchParams({ mode: 'routes', rtext: `~${destination}`, rtt: 'auto' })

  return {
    map: isYandexMapsUrl(mapUrl) ? mapUrl : `https://yandex.ru/maps/?${search}`,
    embed: `https://yandex.ru/map-widget/v1/?${widget}`,
    route: `https://yandex.ru/maps/?${route}`,
  }
}
