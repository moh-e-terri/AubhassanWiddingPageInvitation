# Assets Guide — أين تضع كل مورد

## `public/assets/images/`

| المجلد | ماذا تضع | اسم مقترح |
|--------|----------|-----------|
| `hero/` | كرت الزفاف (خلفية الـ Hero) | `wedding-card.jpg` |
| `couple/` | صور العريس والعروس (اختياري) | `groom.jpg`, `bride.jpg` |
| `gallery/` | صور ثابتة قبل ربط Supabase (اختياري) | أي اسم |
| `video/` | Poster/thumbnail لفيديو الخطوبة | `engagement-poster.jpg` |
| `decor/` | زخارف، patterns، أيقونات | حسب الحاجة |

## `public/assets/videos/`

| الملف | الوصف |
|-------|--------|
| `engagement-video.mp4` | فيديو الخطوبة (3:40) — محمد أبو حسان |

> **نصيحة:** للفيديو على الجوال، استخدم MP4 (H.264) + حجم معقول (&lt; 50MB إن أمكن).

## `public/assets/fonts/` (إن رغبت بخطوط محلية)

- `Amiri/` — للعناوين الفخمة
- `Tajawal/` — للنصوص

> أو نستخدم Google Fonts في CSS (الأسهل).

## Supabase Storage (ديناميكي — من لوحة العريس)

- bucket: `gallery`
- الصور المرفوعة من `/admin` تُخزَّن هنا وتظهر في معرض الصفحة

## ملف الإعدادات

عدّل `src/config/wedding.config.ts` للأسماء، التاريخ، المكان، ومسارات الملفات.
