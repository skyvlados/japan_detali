# 02. Исследование VIN-поиска и интеграции ACAT

Дата: 2026-08-15

## 1. Текущая реализация

Страница:

```text
/search_vin/
```

использует внешний сервис ACAT через `iframe`:

```text
https://varvara999.acat.online
```

ACAT — это внешний сервис **AutoCatalog Online**. Он работает отдельно от Bitrix и Japandetali.ru.

Текущая схема:

```text
Пользователь
    ↓
/search_vin/
    ↓
iframe
    ↓
ACAT
    ↓
ACAT backend
```

Локальный Bitrix-компонент для VIN-поиска сейчас не используется.

## 2. GOODVIN

В проекте найден старый компонент:

```text
bitrix/components/znikolaj/searchvinv2/
```

Он использует API:

```text
goodvin.net
api.goodvin.net
```

Компонент работает через GOODVIN API и содержит отдельную AJAX-логику поиска.

Однако вызов `znikolaj:searchvinv2` в:

```text
search_vin/index.php
```

закомментирован.

Следовательно:

```text
GOODVIN = старый отключённый код
GOODVIN ≠ текущий VIN-поиск
```

Возвращать GOODVIN в работу на данном этапе не нужно.

## 3. ACAT

На момент проверки:

```text
varvara999.acat.online
```

доступен по HTTPS и возвращает `HTTP 200`.

В HTML найден frontend:

```text
/build/app.js
```

Размер bundle — около 605 KB.

В нём обнаружены внутренние endpoints:

```text
/ajax
/search
/data/ajax
/selection/search
/dropdown/search
/dropdown/minimumResultsForSearch
```

При этом конкретный endpoint, который выполняет VIN-поиск, пока не найден.

## 4. Что установлено

* `/search_vin/` использует внешний ACAT через iframe;
* ACAT — AutoCatalog Online;
* GOODVIN присутствует только как старый отключённый код;
* текущий VIN-поиск не проходит через GOODVIN;
* ACAT доступен по HTTPS;
* frontend ACAT использует `/build/app.js`;
* в frontend найдены внутренние AJAX/search endpoints;
* точный VIN-запрос пока не определён.

## 5. Что пока неизвестно

Пока не установлено:

* какой endpoint ACAT обрабатывает VIN;
* какие параметры передаются;
* какой response возвращается;
* какой backend и источник данных используются ACAT;
* используется ли GOODVIN внутри ACAT;
* связаны ли данные ACAT с каталогом Japandetali.ru.

## 6. Следующий шаг

Не изменяя production-код, нужно посмотреть реальный запрос при поиске VIN через браузер:

```text
/search_vin/
    ↓
DevTools → Network
    ↓
ввести VIN
    ↓
найти XHR/fetch
```

Зафиксировать:

```text
URL
HTTP method
parameters / request body
status
response
```

После этого можно будет определить фактическую цепочку:

```text
VIN
 ↓
ACAT frontend
 ↓
HTTP endpoint
 ↓
ACAT backend
 ↓
источник данных
```

## 7. Статус

```text
[✓] Найден GOODVIN-компонент
[✓] Подтверждено отключение GOODVIN
[✓] Найден ACAT iframe
[✓] Определён внешний сервис ACAT
[✓] Проверена доступность ACAT
[✓] Найден frontend bundle
[✓] Найдены внутренние endpoints

[ ] Найден реальный VIN endpoint
[ ] Определены параметры VIN-запроса
[ ] Получен response
[ ] Определён источник данных ACAT
[ ] Установлена связь ACAT с GOODVIN
```

## 8. Правило исследования

До получения фактического VIN-запроса:

* production не изменять;
* GOODVIN не включать;
* iframe не менять;
* ACAT endpoint не менять;
* данные в БД не изменять.

Исследование выполнять в read-only режиме.
