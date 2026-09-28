import { useEffect, useRef, useState } from 'react'
import { getStoreMapLinks } from './stores'
import type { SiteSettings } from './settings'


const categories = [
  ['Двигатель', 'Детали двигателя, системы охлаждения и навесное оборудование.'],
  ['Подвеска и рулевое', 'Амортизаторы, рычаги, ступицы и рулевые компоненты.'],
  ['Тормозная система', 'Колодки, диски, суппорты и комплектующие.'],
  ['Электрика', 'Стартеры, генераторы, датчики и элементы зажигания.'],
  ['Расходные материалы', 'Фильтры, ремни, ролики, жидкости и комплекты ТО.'],
  ['Редкие детали', 'Поиск деталей для редких моделей, рынков и комплектаций.'],
]

const brands = ['Toyota', 'Lexus', 'Nissan', 'Infiniti', 'Honda', 'Acura', 'Mazda', 'Mitsubishi', 'Subaru', 'Suzuki', 'Isuzu', 'Daihatsu', 'Hyundai', 'Kia', 'SsangYong / KGM', 'Daewoo']

function Icon({ name }: { name: 'arrow' | 'check' | 'search' | 'message' | 'phone' | 'mail' | 'menu' | 'close' | 'whatsapp' | 'telegram' }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .4 2 .6 2.9.7a2 2 0 0 1 1.6 1.9Z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    whatsapp: <><path d="M21.25 11.25A9.25 9.25 0 0 1 7.52 19.4L2.5 21l1.68-4.82A9.25 9.25 0 1 1 21.25 11.25Z"/><path transform="translate(-1.4)" fill="currentColor" stroke="none" d="M9.25 7.85c.18-.42.37-.44.64-.44h.42c.14 0 .34.05.44.3l.67 1.6c.09.21.05.36-.04.5l-.31.42c-.1.12-.22.26-.08.48.14.24.62 1.02 1.35 1.66.92.82 1.7 1.07 1.94 1.2.24.12.38.1.52-.07l.67-.78c.17-.21.35-.17.58-.08l1.52.72c.23.11.39.17.45.28.06.1.06.6-.14 1.2-.19.58-1.1 1.11-1.52 1.17-.39.06-.9.08-1.45-.09-.34-.1-.77-.26-1.33-.5-2.34-1.01-3.86-3.38-3.98-3.54-.12-.16-.96-1.28-.96-2.43 0-1.16.61-1.71.82-1.98Z"/></>,
    telegram: <path d="M21.1 3.4c-.3-.25-.72-.3-1.08-.14L3.2 10.4c-.48.2-.46.88.04 1.04l4.76 1.55 1.7 5.12c.15.46.74.56 1.04.18l2.67-3.42 4.65 3.43c.44.33 1.08.08 1.16-.45l2.2-13.23c.06-.37-.08-.83-.32-1.22Zm-11.4 9.1 7.66-4.82c.28-.18.57.14.33.36l-6.32 5.7-.25 2.45-1.42-3.73Z"/>,
  }
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function App({ settings }: { settings: SiteSettings }) {
  const { contacts: CONTACTS, stores, about } = settings
  const [menuOpen, setMenuOpen] = useState(false)
  const messengerDialog = useRef<HTMLDialogElement>(null)
  const openMessengers = () => messengerDialog.current?.showModal()

  const messengerLinks = <>
    <a className="messenger" href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer"><span className="messenger__logo"><Icon name="whatsapp" /></span><div><small>Написать в</small><strong>WhatsApp</strong></div><Icon name="arrow" /></a>
    <a className="messenger" href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer"><span className="messenger__logo messenger__logo--telegram"><Icon name="telegram" /></span><div><small>Написать в</small><strong>Telegram</strong></div><Icon name="arrow" /></a>
  </>

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a href="#top" className="logo" aria-label="Японец — на главную">
            <img src="/logo.png" alt="Японец — японские и корейские автозапчасти" />
            <span className="logo__copy">
              <strong>Японец</strong>
              <small>Японские и корейские автозапчасти</small>
            </span>
          </a>
          <nav className="nav" aria-label="Основная навигация">
            <a href="#parts">Запчасти</a>
            <a href="#process">Как работаем</a>
            <a href="#about">О компании</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <div className="header__actions">
            <div className="header__phones">{CONTACTS.phones.map((phone, index) => <a className="phone-link" key={index} href={phone.href}>{phone.label}</a>)}</div>
            <button className="button button--small" type="button" onClick={openMessengers} aria-haspopup="dialog">Написать менеджеру</button>
          </div>
          <button className="menu-button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            <a onClick={closeMenu} href="#parts">Запчасти</a>
            <a onClick={closeMenu} href="#process">Как работаем</a>
            <a onClick={closeMenu} href="#about">О компании</a>
            <a onClick={closeMenu} href="#contacts">Контакты</a>
            {CONTACTS.phones.map((phone, index) => <a key={index} onClick={closeMenu} href={phone.href}>{phone.label}</a>)}
            <a onClick={closeMenu} href={CONTACTS.emailHref}>{CONTACTS.email}</a>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="eyebrow"><span /> Японские и корейские автозапчасти · Санкт-Петербург</p>
              <h1>Найдём деталь.<br/><em>Даже редкую.</em></h1>
              <p className="hero__lead">Подбираем запчасти по VIN, номеру кузова или артикулу. Проверяем совместимость, наличие, цену и срок перед подтверждением.</p>
              <div className="hero__actions">
                <a className="button" href="#contacts">Отправить запрос <Icon name="arrow" /></a>
                <a className="button button--ghost" href={CONTACTS.phoneHref}><Icon name="phone" /> Позвонить</a>
              </div>
              <div className="hero__trust" aria-label="Преимущества">
                <div><strong>20+ лет</strong><span>опыта в подборе</span></div>
                <div><strong>1 000+</strong><span>положительных отзывов</span></div>
                <div><strong>VIN</strong><span>проверка применяемости</span></div>
              </div>
            </div>

            <div className="hero__visual">
              <img
                className="hero__image"
                src="/land-cruiser-sunrise.jpg"
                alt="Белый Toyota Land Cruiser 300 поднимается по каменистому склону на восходе солнца"
                width="1254"
                height="1254"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Принципы работы">
          <div className="container trust-strip__inner">
            <span>Японские и корейские автомобили</span><i/>
            <span>Оригинальные запчасти<br/>и проверенные аналоги</span><i/>
            <span>Сложные случаи</span><i/>
            <span>Честные сроки</span>
          </div>
        </section>

        <section className="section process" id="process">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow"><span /> Как это работает</p><h2>От запроса до<br/>подходящей детали</h2></div>
              <p>Вам не нужно разбираться в каталогах. Пришлите данные автомобиля — остальное проверит менеджер.</p>
            </div>
            <div className="steps">
              {[
                ['01', 'Отправьте данные', 'VIN, номер кузова, артикул или фотографию детали.'],
                ['02', 'Мы всё проверим', 'Сопоставим применяемость и найдём доступные варианты.'],
                ['03', 'Получите предложение', 'Сообщим подтверждённые цену, наличие и срок.'],
                ['04', 'Заберите удобным способом', 'Согласуем оплату, доставку или самовывоз.'],
              ].map(([num, title, text]) => <article className="step" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section parts" id="parts">
          <div className="container">
            <div className="section-heading section-heading--light">
              <div><p className="eyebrow"><span /> Что подбираем</p><h2>Для планового ремонта<br/>и сложного поиска</h2></div>
              <a className="text-link" href="#contacts">Запросить подбор <Icon name="arrow" /></a>
            </div>
            <div className="category-grid">
              {categories.map(([title, text], index) => (
                <a href="#contacts" className="category" key={title}>
                  <span className="category__number">0{index + 1}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                  <span className="category__arrow"><Icon name="arrow" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container about__grid">
            <div className="about__art" aria-hidden="true">
              <span className="about__circle" />
              <span className="about__line about__line--one" />
              <span className="about__line about__line--two" />
              <div className="about__stamp"><strong>{about.experienceValue}</strong><span>{about.experienceLabel}</span></div>
            </div>
            <div className="about__copy">
              <p className="eyebrow"><span /> {about.eyebrow}</p>
              <h2>{about.title}</h2>
              <div className="about__lead">{about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              {about.highlights.length > 0 && <ul className="check-list">
                {about.highlights.map((item, index) => <li key={index}><Icon name="check" /><span><strong>{item.title}</strong>{item.text}</span></li>)}
              </ul>}

            </div>
          </div>
        </section>

        <section className="brands" aria-label="Марки автомобилей">
          <div className="container">
            <p>Работаем с популярными и редкими японскими и корейскими моделями</p>
            <div className="brand-list">{brands.map(brand => (
              <span className="brand-list__item" key={brand} title={brand}>
                <img
                  src={`/brands/${brand === 'SsangYong / KGM' ? 'ssangyong' : brand.toLowerCase()}.png`}
                  alt={brand}
                  width="112"
                  height="72"
                  loading="lazy"
                />
              </span>
            ))}</div>
          </div>
        </section>

        <section className="section contact" id="contacts">
          <div className="container contact__card">
            <div>
              <p className="eyebrow eyebrow--light"><span /> Начнём с вашего запроса</p>
              <h2>Не уверены, какая<br/>деталь подойдёт?</h2>
              <p>Пришлите VIN, номер кузова, артикул или фотографию. Менеджер проверит данные и предложит варианты.</p>
            </div>
            <div className="contact__actions">
              {messengerLinks}
              {CONTACTS.phones.map((phone, index) => <a className="contact-phone" key={index} href={phone.href}><Icon name="phone" /><span><small>Позвонить менеджеру</small><strong>{phone.label}</strong></span></a>)}
              <a className="contact-phone" href={CONTACTS.emailHref}><Icon name="mail" /><span><small>Написать на email</small><strong>{CONTACTS.email}</strong></span></a>
            </div>
          </div>
          <div className="container stores" aria-labelledby="stores-heading">
            <div className="stores__heading">
              <p className="eyebrow"><span /> Ждём вас в магазине</p>
              <h2 id="stores-heading">Где нас найти</h2>
              <p>Санкт-Петербург · запчасти для японских и корейских автомобилей</p>
            </div>
            <div className="stores__list">
              {stores.map(store => {
                const links = getStoreMapLinks(store)
                return (
                  <article className="store" key={store.id} aria-labelledby={`store-${store.id}`}>
                    <div className="store__info">
                      <span className="store__label">Магазин «Японец»</span>
                      <h3 id={`store-${store.id}`}>{store.name}</h3>
                      <address>{store.address}</address>
                      {store.section?.trim() && <p className="store__section">Секция {store.section.trim()}</p>}
                      <div className="store__hours">
                        <h4>График работы</h4>
                        <p>{store.workingHours?.trim() || 'График уточняется — свяжитесь с менеджером перед поездкой.'}</p>
                      </div>
                      {store.directions && <p className="store__directions">{store.directions}</p>}
                      {!store.addressConfirmed && <p className="store__notice">На карте показан ориентировочный район. Точный адрес магазина уточняется — перед поездкой свяжитесь с менеджером.</p>}
                      <div className="store__actions">
                        {store.addressConfirmed && <a className="button" href={links.route} target="_blank" rel="noopener noreferrer">Построить маршрут <Icon name="arrow" /></a>}
                        <a className="button button--ghost" href={links.map} target="_blank" rel="noopener noreferrer">Открыть Яндекс Карты <Icon name="arrow" /></a>
                      </div>
                    </div>
                    <div className="store__map">
                      <iframe key={links.embed} src={links.embed} title={`Карта: ${store.address}`} loading="lazy" allowFullScreen />
                      <a className="store__map-link" href={links.map} target="_blank" rel="noopener noreferrer">Посмотреть на Яндекс Картах <Icon name="arrow" /></a>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <img src="/logo.png" alt="Японец" />
          <p>Запчасти для японских и корейских автомобилей<br/>в Санкт-Петербурге<br/><a className="footer__email" href={CONTACTS.emailHref}>{CONTACTS.email}</a></p>
          <nav><a href="#parts">Запчасти</a><a href="#about">О компании</a><a href="#contacts">Контакты</a></nav>
          <small>© {new Date().getFullYear()} «Японец»</small>
        </div>
        {(settings.legal?.name?.trim() || settings.legal?.inn?.trim() || settings.legal?.ogrn?.trim()) && (
          <div className="container footer__legal" aria-label="Реквизиты продавца">
            {settings.legal.name?.trim() && <p>{settings.legal.name}</p>}
            {settings.legal.inn?.trim() && <p>ИНН {settings.legal.inn}</p>}
            {settings.legal.ogrn?.trim() && <p>ОГРН {settings.legal.ogrn}</p>}
          </div>
        )}
      </footer>

      <div className="mobile-bar">
        <a href={CONTACTS.phoneHref}><Icon name="phone" />Позвонить</a>
        <button type="button" onClick={openMessengers} aria-haspopup="dialog"><Icon name="message" />Написать</button>
      </div>
      <dialog className="messenger-dialog" ref={messengerDialog} aria-labelledby="messenger-title" onClick={event => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect()
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close()
        }
      }}>
        <button type="button" className="messenger-dialog__close" aria-label="Закрыть" onClick={() => messengerDialog.current?.close()}><Icon name="close" /></button>
        <h2 id="messenger-title">Написать менеджеру</h2>
        <p>Выберите удобный мессенджер</p>
        <div className="contact__actions">{messengerLinks}</div>
      </dialog>
    </>
  )
}

export default App
