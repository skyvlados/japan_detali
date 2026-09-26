export type Store = {
  id: string
  name: string
  address: string
  addressConfirmed: boolean
  workingHours?: string
  directions?: string
  pavilion?: string
}

export function getStoreMapLinks({ address }: Store) {
  const search = new URLSearchParams({ text: address })
  const widget = new URLSearchParams({ mode: 'search', text: address, z: '16' })
  const route = new URLSearchParams({ rtext: `~${address}` })

  return {
    map: `https://yandex.ru/maps/?${search}`,
    embed: `https://yandex.ru/map-widget/v1/?${widget}`,
    route: `https://yandex.ru/maps/?${route}`,
  }
}
