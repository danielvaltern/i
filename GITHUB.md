# Как выложить VALTERN на GitHub Pages

## Важно

Файлы сайта должны лежать **в корне репозитория**, не внутри папки `DanielValtern_site`.

Правильно:
```
repo/
  index.html
  about.html
  styles.css
  site.js
  ...
```

Неправильно:
```
repo/
  DanielValtern_site/
    index.html
    css/...
```

или
```
repo/
  DanielValtern_site.zip
```

## Шаги

1. Создай новый **public** репозиторий, например `valtern` или `site`.
2. Распакуй zip на компьютере.
3. Загрузи **содержимое** папки (все html, css, js) в **корень** репозитория.
4. В репозитории: **Settings → Pages**.
5. Source: **Deploy from a branch**.
6. Branch: `main` (или `master`), folder: **/ (root)**.
7. Save.
8. Через 1–2 минуты открой:
   `https://ТВОЙ_НИК.github.io/ИМЯ_РЕПО/`

## Если CSS всё ещё не грузится

1. Открой сайт, нажми F12 → вкладка Network.
2. Найди `styles.css`. Если 404 — файлы лежат не в том месте.
3. Проверь, что в репозитории есть путь `styles.css` рядом с `index.html`.
4. Не открывай HTML через `github.com/.../blob/...` — это не сайт, а просмотр кода.
5. Дождись зелёного статуса Pages (Settings → Pages).

## Свой домен (позже)

Settings → Pages → Custom domain → укажи домен и настрой DNS у регистратора.
