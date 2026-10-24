#!/usr/bin/env python3
"""Render Shubhi's Studio from content/*.json into static HTML.

Run:  python3 tools/build.py
"""
import html
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import icons  # noqa: E402

ORDER = ["maths", "physics", "chemistry", "biology", "history-civics",
         "geography", "computer", "sanskrit", "english"]

SITE = "Shubhi's Studio"

# the nav bar is tight, so long subject names get a short label there
NAV_SHORT = {
    "history-civics": "History",
    "computer": "Computers",
    "english": "English",
}
TAGLINE = "Class 7, drawn out so it makes sense."

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
    'family=Mukta:wght@400;600;700;800&family=Shrikhand&display=swap">'
)

# Set the theme before first paint so the page never flashes the wrong one.
THEME_BOOT = (
    '<script>(function(){try{var t=localStorage.getItem("shubhi.theme");'
    'if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>'
)

FAVICON = (
    '<link rel="icon" href="data:image/svg+xml,'
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Ctext y='26' font-size='26'%3E%F0%9F%8E%A8%3C/text%3E%3C/svg%3E\">"
)


def e(text):
    return html.escape(str(text), quote=True)


def load():
    subjects = []
    for sid in ORDER:
        path = ROOT / "content" / f"{sid}.json"
        with path.open(encoding="utf-8") as fh:
            data = json.load(fh)
        if data["id"] != sid:
            raise SystemExit(f"{path}: id {data['id']!r} does not match filename")
        subjects.append(data)
    return subjects


def shell(title, description, body, subject=None, depth=0, nav_current=None, subjects=()):
    up = "../" * depth
    body_attrs = ""
    if subject:
        body_attrs = (f' data-subject="{e(subject["id"])}"'
                      f' style="--subject:{e(subject["color"])};'
                      f'--subject-text:{e(subject["ink"])}"')

    nav = "".join(
        f'<a href="{up}subjects/{e(s["id"])}.html"'
        f'{" aria-current=\"page\"" if s["id"] == nav_current else ""}'
        f' title="{e(s["name"])}">{e(NAV_SHORT.get(s["id"], s["name"]))}</a>'
        for s in subjects
    )

    # On phones the nine-item strip collapses into this panel, which shows them all at once.
    menu = "".join(
        f'<a href="{up}subjects/{e(s["id"])}.html"'
        f' style="--subject:{e(s["color"])}"'
        f'{" aria-current=\"page\"" if s["id"] == nav_current else ""}>'
        f'{icons.ICONS[s["id"]]}<span>{e(NAV_SHORT.get(s["id"], s["name"]))}</span></a>'
        for s in subjects
    )

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(description)}">
<meta name="color-scheme" content="light dark">
{FAVICON}
{THEME_BOOT}
{FONTS}
<link rel="stylesheet" href="{up}assets/css/studio.css">
</head>
<body{body_attrs}>
<a class="skip" href="#main">Skip to the content</a>
<header class="topbar">
  <a class="topbar-mark" href="{up}index.html">{icons.MARK}<span>{e(SITE)}</span></a>
  <nav class="topbar-nav" aria-label="Subjects">{nav}</nav>
  <details class="navmenu" data-navmenu>
    <summary class="navmenu-btn">Subjects {icons.CARET}</summary>
    <nav class="navmenu-panel" aria-label="All subjects">{menu}</nav>
  </details>
  <button class="theme-toggle" type="button" aria-label="Switch between light and dark paper">
    {icons.MOON}{icons.SUN}
  </button>
</header>
<main id="main">
{body}
</main>
<footer class="foot"><div class="wrap foot-grid">
  <p style="margin:0">{e(SITE)} — built for Shubhi, Class 7. Nine subjects, drawn out.</p>
  <p style="margin:0">Open a chapter and it is ticked off. Your progress stays on this device.</p>
</div></footer>
<script src="{up}assets/js/studio.js" defer></script>
<script src="{up}assets/js/labs.js" defer></script>
</body>
</html>
"""


def chapter_html(ch, index):
    body = "".join(f"<p>{e(p)}</p>" for p in ch["body"])

    draw = ""
    if ch.get("draw"):
        draw = (
            f'<div class="draw-note">{icons.PENCIL}'
            f'<p><b>Draw it</b>{e(ch["draw"])}</p></div>'
        )

    points = "".join(f"<li><span>{e(p)}</span></li>" for p in ch.get("points", []))
    points = f'<ul class="points">{points}</ul>' if points else ""

    worked = ""
    ex = ch.get("example")
    if ex:
        steps = "".join(f"<li>{e(s)}</li>" for s in ex["steps"])
        worked = (
            f'<div class="worked"><h4>{e(ex["title"])}</h4>'
            f"<ol>{steps}</ol>"
            f'<p class="answer">{e(ex["answer"])}</p></div>'
        )

    return f"""<details class="chapter" data-ch="{e(ch['id'])}">
  <summary>
    <span class="ch-num" aria-hidden="true"></span>
    <span class="ch-titles"><h3>{e(ch['title'])}</h3><p>{e(ch['hook'])}</p></span>
    {icons.CHEVRON}
  </summary>
  <div class="ch-body">{body}{draw}{points}{worked}</div>
</details>"""


def quiz_html(questions):
    out = []
    for q in questions:
        opts = "".join(
            f'<li><button class="opt" type="button">'
            f'<span class="key">{chr(65 + i)}</span><span>{e(o)}</span></button></li>'
            for i, o in enumerate(q["options"])
        )
        out.append(
            f'<div class="q" data-a="{q["a"]}">'
            f'<p class="qt">{e(q["q"])}</p><ol>{opts}</ol>'
            f'<p class="why" hidden><b data-verdict></b> {e(q["why"])}</p></div>'
        )
    return f"""<div>
  <div class="quiz" data-quiz>{''.join(out)}</div>
  <div class="quiz-score" data-score hidden style="margin-top:1rem">
    <strong></strong><p></p>
    <button class="btn btn-sm" type="button" data-retry>Start again</button>
  </div>
</div>"""


def subject_page(sub, subjects):
    chapters = "".join(chapter_html(c, i) for i, c in enumerate(sub["chapters"]))
    labs = "".join(f'<div class="lab" data-lab="{e(name)}"></div>' for name in sub.get("labs", []))

    labs_section = ""
    if labs:
        labs_section = f"""<section class="section wrap">
  <div class="section-head">{icons.STAR}<h2>Play with it</h2>
  <span class="count">Change something and watch what happens</span></div>
  {labs}
</section>"""

    body = f"""<div class="subject-hero"><div class="wrap">
  <a class="backlink" href="../index.html">{icons.ARROW_BACK} All subjects</a>
  <div class="subject-hero-grid">
    <div>
      <h1>{e(sub['name'])}</h1>
      <p class="tagline">{e(sub['tagline'])}</p>
      <p class="intro">{e(sub['intro'])}</p>
      <div class="chip-bar" style="max-width:280px;margin-top:1.4rem"><i data-progress-bar></i></div>
      <p class="lab-sub" style="margin:.45rem 0 0" data-progress-label></p>
    </div>
    <div class="subject-hero-ico">{icons.ICONS[sub['id']]}</div>
  </div>
</div></div>

<section class="section wrap">
  <div class="section-head">{icons.STAR}<h2>Chapters</h2>
    <span class="count">{len(sub['chapters'])} of them</span>
    <button class="btn btn-sm" type="button" data-expand style="margin-left:auto">Open all</button>
  </div>
  <div class="chapters">{chapters}</div>
</section>

{labs_section}

<section class="section wrap narrow">
  <div class="section-head">{icons.STAR}<h2>Check yourself</h2>
  <span class="count">{len(sub['quiz'])} questions, answers explained</span></div>
  {quiz_html(sub['quiz'])}
</section>"""

    return shell(
        title=f"{sub['name']} — {SITE}",
        description=f"{sub['name']} for Class 7: {sub['blurb']}",
        body=body,
        subject=sub,
        depth=1,
        nav_current=sub["id"],
        subjects=subjects,
    )


def index_page(subjects):
    chips = "".join(
        f'<li class="chip" data-chip="{e(s["id"])}" data-count="{len(s["chapters"])}" '
        f'style="--subject:{e(s["color"])};--subject-text:{e(s["ink"])}">'
        f'<a href="subjects/{e(s["id"])}.html">'
        f'<span class="chip-top"><span class="chip-ico">{icons.ICONS[s["id"]]}</span>'
        f'<span class="chip-n">{len(s["chapters"])} chapters</span></span>'
        f'<h3>{e(s["name"])}</h3><p>{e(s["blurb"])}</p>'
        f'<span class="chip-bar"><i></i></span></a></li>'
        for s in subjects
    )

    total_ch = sum(len(s["chapters"]) for s in subjects)
    total_q = sum(len(s["quiz"]) for s in subjects)
    total_labs = sum(len(s.get("labs", [])) for s in subjects)

    body = f"""<div class="wrap">
  <section class="hero">
    <div>
      <h1>{e(SITE)}</h1>
      <p class="hero-lede">{e(TAGLINE)} Nine subjects, {total_ch} chapters,
      and {total_labs} things you can poke at until they make sense.</p>
      <div class="hero-actions">
        <a class="btn btn-solid" href="#subjects">Pick a subject</a>
        <button class="btn" type="button" data-surprise>Surprise me</button>
      </div>
    </div>
    <div class="hero-art">{icons.palette(subjects)}</div>
  </section>
</div>

<section class="section wrap" id="subjects">
  <div class="section-head">{icons.STAR}<h2>Nine subjects</h2>
  <span class="count">{total_ch} chapters, {total_q} questions</span></div>
  <ul class="chips">{chips}</ul>
</section>

<section class="section wrap">
  <div class="section-head">{icons.STAR}<h2>Where you are</h2>
  <span class="count">Counted on this device only</span></div>
  <div class="tally">
    <div><b data-tally-chapters>0</b><span>chapters opened</span></div>
    <div><b data-tally-subjects>0</b><span>subjects started</span></div>
    <div><b data-tally-pct>0%</b><span>of the whole year</span></div>
  </div>
</section>

<section class="section wrap narrow">
  <div class="section-head">{icons.STAR}<h2>How to use this</h2></div>
  <p>Each subject opens into its chapters. A chapter gives you the idea in a few
  paragraphs, something to draw, the points worth memorising, and one worked example
  done step by step.</p>
  <p>Under the chapters there is usually something to play with: a ray of light you
  can bend, a box of particles you can heat, a timeline you can drag. Those are there
  because some things are much easier to see than to read.</p>
  <p>Then five questions, with the reasoning explained whichever way you answer.</p>
</section>"""

    return shell(
        title=f"{SITE} — Class 7, drawn out",
        description=("A colourful Class 7 study site: maths, science, history, civics, "
                     "geography, computers, Sanskrit and English, with interactive labs."),
        body=body,
        subject=None,
        depth=0,
        nav_current=None,
        subjects=subjects,
    )


def main():
    subjects = load()
    (ROOT / "subjects").mkdir(exist_ok=True)

    (ROOT / "index.html").write_text(index_page(subjects), encoding="utf-8")
    print(f"  index.html")

    for sub in subjects:
        out = ROOT / "subjects" / f"{sub['id']}.html"
        out.write_text(subject_page(sub, subjects), encoding="utf-8")
        print(f"  subjects/{sub['id']}.html  ({len(sub['chapters'])} chapters, "
              f"{len(sub.get('labs', []))} labs, {len(sub['quiz'])} questions)")

    print(f"\nBuilt {len(subjects) + 1} pages, "
          f"{sum(len(s['chapters']) for s in subjects)} chapters total.")


if __name__ == "__main__":
    main()
