# Dolce — изображения и изменения, 02.11.2026

Создано встроенным инструментом image_gen. Оригинальные материалы проекта не изменены.

## Направление

Основной источник — фотографии реального Dolce и выбранный владельцем сюжет: столик, десерты крупным планом, интерьер на фоне, без людей. Сохраняются палитра mint/teal/white, Playfair Display, Onest и существующие действия заказа. Широкий кадр на компьютере и отдельная вертикальная композиция на телефоне. Текст защищён локальным затемнением. Внешний поиск Refero был недоступен из-за неактивной подписки; использованы готовые исследования из `_материалы/референсы/сайты-референсы.md` и актуальные решения по дизайну. От Desserto — крупная фотография и спокойная иерархия; от Magnolia — постоянно доступная заявка в шапке. Цвета других сайтов не переносились.

## Файлы

- `public/img/hero-dolce-table.webp` — 1672×941; интерьер interer-024, торт с latte-cake, малиновое пирожное raspberry.
- `public/img/hero-dolce-table-mobile.webp` — 1024×1536; отдельная композиция того же сюжета.
- `public/img/brand/dolce-bianco.webp` — 768×265, прозрачный фон; восстановлено по исходному круглому логотипу 1294 px.
- `public/img/brand/dolce-bianco-round.webp` — 256×256, круглый знак с точечной рамкой и прозрачностью снаружи; расположен в шапке рядом с надписью по дополнительному пожеланию владельца.
- `public/img/dolce-storefront-wide.webp` — 1672×941; обработка и расширение кадра eksterer-015, выравнивание перспективы, удаление людей.
- `public/img/journal/*` — три фотографии из сохранённых постов Telegram 895, 909, 902; даты и ссылки сохранены. Актуальное наличие и цены сезонных позиций не заявляются.

## Меню и оптимизация

В 20 карточках исправлено представление существующих сведений. У 14 позиций ингредиенты перенесены из полного описания в поле состава, чтобы оба блока отображались отдельно. Миндальный торт получил описание вместо строки Ккал; для «Тыквы», трюфеля, шарлотки и вишнёвого пирога использованы полные исходные тексты. У пирога с курицей описание показывается вместе со сроком заказа. Исправлена грамматика описания ромовой бабы. Цены, размеры, КБЖУ и правила отправки не изменялись.

276 JPG в `public/img/menu` и `public/img/dish` заменены WebP (quality 86, ограничение ширины 900/1600 px без увеличения оригинала). Размер: 47 136 165 → 20 684 368 байт, снижение на 56%. Это уменьшение файлов, а не обещание конкретного изменения времени загрузки. Исходные фотографии остаются в `_материалы/фото` и истории Git.

## Промпты

### Главный кадр

```text
Use case: compositing, photorealistic-natural.
Create ONE ultra-realistic wide landscape editorial food photograph for the fullscreen hero of the real Dolce Bianco patisserie in Obninsk, Russia. Target wide 16:9 landscape, high resolution.
Reference roles: 1 interior-024 is the authentic environment reference: preserve recognisable peach painted arches, radial mirror frames, wine-red velvet banquette, warm wooden circular cafe tables, pale upholstered chairs, white globe pendant lights in brass cages and terrazzo floor. Remove every person including reflected people. References 2 latte-cake and 3 raspberry are the actual desserts to faithfully reproduce: layered chocolate cake with white cream and caramel nuts, the sculpted red raspberry mousse pastry with pistachio centre; use their actual dimensions, textures, proportions, no redesigned desserts.
Scene: a naturally photographed inviting cafe tabletop close-up, one white plate with that cake slice and a small white plate with ONE raspberry mousse pastry, an understated white ceramic cup of cappuccino with imperfect latte art slightly behind them. At most 3 plates, only 2 desserts total. Wooden round table near a window in THIS cafe. Desserts occupy the right half and lower-right foreground, hero focus near x=70%, y=66%. Recognisable actual interior gently out of focus in background, realistic modest scale; left 40% is calm softly blurred interior and darkish red banquette with unobtrusive shadow and negative space suitable for white website title. One coherent perspective at seated tabletop level, 50mm photographic lens, f/3.2, subtle film grain, honest gentle daylight from side window, subtle warm pendant lights, soft real shadows, natural food surface imperfections, true colour. Not a luxury fantasy room, not a showroom, no surreal additions.
Avoid people, hands, faces or reflected people, text, captions, watermarks, fake gibberish branding, signs, random flowers, extra crockery, excessive steam, floating objects, implausible cutlery, overglossy CGI food, excessive bokeh, saturated orange colour grading. The cake chocolate label may be plain dark chocolate without writing. Result must look like a professional real-location hospitality photoshoot, appealing but believable. Full bleed photograph only, no website elements.
```

### Вертикальный кадр

```text
Use case: compositing. Create a PORTRAIT 2:3 mobile website hero companion to this exact supplied photograph. Preserve this exact real Dolce cafe atmosphere, objects, dessert shapes and natural photographic quality. Recompose, do not invent a different room. Same walnut round cafe table, same slice of chocolate layered white cream cake with caramel nuts, same ONE red raspberry-shaped mousse dessert with pistachio centre on white plates, same cappuccino in white ribbed cup. Show the food group in the LOWER HALF, centre x55%, y73%, cake and raspberry both fully visible on plates. Upper 45% of image is recognisable softly unfocused cream wall, peach arches, radial mirrors and red velvet banquette from this cafe, calm enough for white text overlay, no dark digitally painted text area. Keep table at natural correct seated perspective, realistic proportions, subtly textured surfaces and soft side daylight. White globe brass cage pendant lamps. People-free including reflections. One coherent authentic hospitality editorial photo, no collage, no text or logo or watermark, no props beyond provided scene, no fake artificial glossy CGI texture, no overcooked saturation. This is a complementary portrait framing of the same photographic session, not a crop of an unrelated image.
```

### Надпись логотипа

```text
Use case: background-extraction and logo-brand restoration. Asset: transparent PNG production website logo, straight frontal vector-like crisp edges, wide horizontal composition around 2.9:1.
Input image is the actual original Dolce Bianco logo. Faithfully preserve the exact characteristic letter shapes of DOLCE, diagonal engraved shadow hatch details, and the Bianco cursive, plus the original two small rolling-pin ornaments. Extract ONLY the central three-line wordmark from the provided round badge. REMOVE the entire circular outline, dotted circular border, green outer ring and all white background. Do not redraw it with a substitute font. Preserve hierarchy and proportions from original centre.
Exact text, three centred lines:
КОНДИТЕРСКАЯ
DOLCE
Bianco
The Cyrillic line must be spelled exactly as input. Main DOLCE is uppercase, with original dimensional diagonal hatching. Small Bianco word and ornaments below.
Use dark teal #23635d for the lettering and hatching, #86d3ca for the fine inset accents of DOLCE. Genuine transparent background everywhere outside letter strokes, not a white rectangle or checkerboard. No circle, no mockup, no 3D perspective, no props, no glows, no new slogan, no extra words. Logo fills canvas with only a small safe margin. Output a single clean high resolution transparent brand asset.
```

### Экстерьер

```text
Use case: precise-object-edit / photographic restoration and restrained outpainting. Asset: ONE high quality 16:9 wide photograph of the actual Dolce Bianco patisserie storefront.
Reference 1 is the edit target: keep this exact storefront, facade proportions, actual green window frames and shutters, entrance position, striped small canopy, warm visible cake displays, white globe lamps, hanging plants and original shop signage. Reference 2 is ONLY for the actual logo letterforms, do not insert a giant circular badge into the facade.
Make a cleaner, gently wider, level professional architectural photograph of this same storefront, showing entire sign, entrance doorway down to the pavement, both green shutters and both narrow side menu posters within frame, with a small margin of original stone facade on either side. Correct slight leaning verticals and excessive yellow cast. Natural late afternoon / early evening lighting, warm interior glow, realistic stone/window details, no cinematic overprocessing, no oversharpening or unreal pristine materials. Remove all people and their reflections inside and outside. Keep the same venue, do not redesign or extend it into another shop. Only gently outpaint the immediate missing edges and lower pavement, do not invent a whole building or new entrances.
Restore the existing top sign legibly and faithfully: top Cyrillic 'КОНДИТЕРСКАЯ', large mint uppercase 'DOLCE', below script 'Bianco' flanked by the original rolling pin ornaments. Copy original letterforms, no other invented signage. Side menu posters remain photographic background detail with dessert pictures; do not invent readable promotional copy. No extra signs, no cars or pedestrians, no watermark. Photograph only, no graphic border, no rounded corners.
```

### Круглый знак

```text
Use case: logo-brand restoration / precise-object-edit. Restore the exact original round Dolce Bianco logo in this reference as a crisp clean high-resolution frontal round badge for a website header. Preserve its defining circular composition: white circle, fine dark teal outer outline, a single mint green continuous inner ring, a full inner ring of evenly spaced dark teal dots, and the central three-line logotype. Keep the original letterforms and exact text: Cyrillic 'КОНДИТЕРСКАЯ', uppercase engraved serif 'DOLCE' with its characteristic diagonal hatching and mint inset lines, then the original cursive 'Bianco' with two rolling-pin ornaments. NO new fonts, no new ornaments. Use the existing website brand mint #86d3ca for the ring and insets (replace only neon green), dark teal #23635d for lettering and dots (replace only brown). Keep the circle perfectly circular and flat, no perspective and no mockup. Keep original relative proportions and spacious interior; the lettering is centred exactly as in source. White badge interior is opaque. Everything OUTSIDE the circular outer boundary is truly transparent. Keep outer circle fully inside square canvas with 2% margin. No shadows, no paper texture, no glow, no bevel, no extra text, no watermark. Single square high resolution transparent PNG asset.
```

## Проверки

- TypeScript (`tsc --noEmit --incremental false`), ESLint (`eslint src`), production build (`next build`) — пройдены. Сгенерированы 93 статических страницы.
- Проверены шесть ширин: 360, 390, 430, 768, 1024 и 1440 px. Отдельно проверены режимы обычной и уменьшенной анимации.
- Проверены логотипы, выбор вертикального/горизонтального кадра, блок Telegram, фото входа, описание и состав блюда, добавление в черновик заявки и мобильное меню. Сообщения клиентам не отправлялись.
- Данные меню: 88 записей, 87 видимых позиций, 21 позиция с отдельным составом; все ссылки на локальные фото проверены. Цены и варианты сохранены.
- Обнаруженное в режиме уменьшенной анимации расхождение серверной/клиентской разметки устранено: предпочтение движения применяется в CSS при одинаковом HTML.
- Индексация остаётся закрытой (`noindex, nofollow`); серверная выкладка не выполнялась.

Подробные результаты браузерной проверки и скриншоты сохранены в рабочей папке чата `outputs/dolce-review/`.


