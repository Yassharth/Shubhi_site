# Shubhi's Studio

A Class 7 (ICSE) study site built for one student who likes to draw. Nine subjects,
59 chapters, 13 interactive labs and 45 questions, all as static files — no build
step needed to view it, no framework, no dependencies.

Live site: enable GitHub Pages on the `main` branch (see below).

## What's in it

| Subject | Chapters | Labs |
|---|---|---|
| Maths | 7 | Venn set builder, mean/median/mode grapher |
| Physics | 7 | Reflection bench (plane, concave, convex) |
| Chemistry | 7 | Particle box, separation-method drill |
| Biology | 5 | Photosynthesis limiting-factor machine |
| History & Civics | 8 | Sultanate-to-Mughal timeline |
| Geography | 6 | Atmosphere layer explorer |
| Computer Applications | 6 | Binary/octal/hex bit flipper, live HTML playground |
| Sanskrit | 5 | Shabd roop and dhatu roop tables with a drill |
| English Language | 8 | Twelve-tense grid, active-to-passive walkthrough |

Each chapter gives the idea in a couple of paragraphs, something to draw, the points
worth memorising, and one worked example. Progress is stored in `localStorage`, so it
stays on the device and nothing is sent anywhere.

## Layout

```
index.html              generated — the subject grid
subjects/*.html         generated — one page per subject
content/*.json          the actual writing; edit these
tools/build.py          renders the HTML from content/
tools/icons.py          inline SVG icons and the hero palette
assets/css/studio.css   the whole design system
assets/js/studio.js     theme, progress, quiz engine
assets/js/labs.js       the interactive labs
```

## Editing

The HTML is generated. Change `content/*.json`, then rebuild:

```sh
python3 tools/build.py
```

No packages to install — standard library only.

A subject file looks like this:

```jsonc
{
  "id": "maths",
  "color": "#DD4715",   // vivid fill: chips, icons, shadows
  "ink":   "#C53E11",   // darkened for text, clears WCAG AA on the pale background
  "labs": ["venn", "stats"],
  "chapters": [{
    "id": "number-system",
    "title": "Number System",
    "hook": "one line shown on the closed chapter",
    "body": ["paragraph", "paragraph"],
    "draw": "something to sketch",
    "points": ["key point", "key point"],
    "example": { "title": "...", "steps": ["..."], "answer": "..." }
  }],
  "quiz": [{ "q": "...", "options": ["a","b","c","d"], "a": 1, "why": "..." }]
}
```

`"a"` is the zero-based index of the correct option.

To add a lab, write a builder in `assets/js/labs.js` under `LABS.yourname`, then list
`"yourname"` in that subject's `labs` array. The builder receives an empty `<div>` and
fills it in.

## Design notes

Cut-paper collage with ink line-work on top. Chalky lilac paper `#F3F1FB`, indigo ink
`#241B4A`, and one hue per subject — that hue is the only strong colour on its page.
Type is Shrikhand for display and Mukta for everything else; Mukta covers Devanagari,
so the Sanskrit pages don't look like a different site.

One thing to know if you touch the CSS: custom properties that reference `--subject`
(`--wash`, `--shadow-cut`, `--subject-ink`) must be declared on the *same* element that
sets `--subject`, not on `:root`. A `:root` declaration freezes them to the fallback
hue and every page comes out pink.

Dark mode follows the system setting and can be toggled in the top bar. Reduced motion,
keyboard focus and print styles are all handled.

## Deploying

Settings → Pages → Source: *Deploy from a branch* → `main` / `root`.

`.nojekyll` is committed so Pages serves the files as they are.

## Running locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk mostly works,
but browsers block `localStorage` on `file://`, so progress won't save.
