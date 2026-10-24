"""Hand-drawn style line icons, one per subject. All use currentColor."""

S = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'

ICONS = {
    # drafting compass over a ruled baseline
    "maths": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<path d="M24 7v5"/><circle cx="24" cy="9" r="2.6"/>
<path d="M24 12 11 39"/><path d="M24 12l13 27"/>
<path d="M16.5 28c4.8 3 10.2 3 15 0"/><path d="M8 43h32"/>
<path d="M13 39l-2 4"/><path d="M35 39l2 4"/></g></svg>''',

    # a prism splitting a beam
    "physics": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<path d="M24 10 40 36H8z"/><path d="M4 23h11"/>
<path d="M31 27l13-5"/><path d="M32 31l12-1"/><path d="M32.5 35l11 4"/>
<circle cx="24" cy="26" r="1.6" fill="currentColor"/></g></svg>''',

    # conical flask, bubbling
    "chemistry": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<path d="M19 6h10"/><path d="M21 6v13L10 37a4 4 0 003.5 6h21a4 4 0 003.5-6L27 19V6"/>
<path d="M15.5 29h17"/><circle cx="21" cy="35" r="2"/><circle cx="28" cy="38" r="1.4"/>
<circle cx="25" cy="31.5" r="1.1"/></g></svg>''',

    # leaf with midrib and veins
    "biology": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<path d="M9 41C7 24 17 7 40 7c2 20-9 34-31 34z"/>
<path d="M9 41C16 32 26 21 40 7"/>
<path d="M16 32l-1-8"/><path d="M23 25l-1-8"/><path d="M30 17l-1-7"/>
<path d="M16 32l8 1"/><path d="M23 25l8 1"/></g></svg>''',

    # a cusped arch, the shape you see across Sultanate and Mughal building
    "history-civics": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<path d="M9 42V24a15 15 0 0130 0v18"/>
<path d="M16 42V25a8 8 0 0116 0v17"/>
<path d="M24 9V4"/><path d="M5 42h38"/>
<path d="M24 25v10"/><path d="M19 30h10"/></g></svg>''',

    # globe with meridian and parallels
    "geography": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<circle cx="24" cy="24" r="17"/><path d="M7 24h34"/>
<path d="M24 7c5 5 7.5 11 7.5 17S29 36 24 41c-5-5-7.5-11-7.5-17S19 12 24 7z"/>
<path d="M10.5 14c4 2.6 8.6 4 13.5 4s9.5-1.4 13.5-4"/>
<path d="M10.5 34c4-2.6 8.6-4 13.5-4s9.5 1.4 13.5 4"/></g></svg>''',

    # monitor showing angle brackets
    "computer": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<rect x="5" y="9" width="38" height="26" rx="3"/>
<path d="M18 40h12"/><path d="M24 35v5"/>
<path d="M19 17l-5 5 5 5"/><path d="M29 17l5 5-5 5"/></g></svg>''',

    # palm-leaf manuscript page carrying the letter अ
    "sanskrit": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<rect x="6" y="11" width="36" height="26" rx="3"/>
<path d="M6 16h36"/><circle cx="12" cy="24" r="1.3" fill="currentColor"/>
<circle cx="36" cy="24" r="1.3" fill="currentColor"/></g>
<text x="24" y="33" text-anchor="middle" font-size="16" font-weight="700"
 font-family="Mukta, serif" fill="currentColor">अ</text></svg>''',

    # pen nib
    "english": f'''<svg viewBox="0 0 48 48" aria-hidden="true"><g {S}>
<path d="M24 5l11 13-11 25-11-25z"/><path d="M24 5v38"/>
<path d="M13 18h22"/><circle cx="24" cy="23" r="3"/>
<path d="M8 43c4-3 7-4.5 9-5"/></g></svg>''',
}


def palette(subjects):
    """The hero: a painter's palette whose blobs are the nine subjects."""
    spots = [(78, 96, 28), (136, 62, 25), (200, 58, 27), (264, 62, 26), (318, 96, 28),
             (336, 158, 25), (300, 216, 29), (236, 246, 26), (172, 258, 24)]
    blobs = []
    for i, (sub, (cx, cy, r)) in enumerate(zip(subjects, spots)):
        blobs.append(
            f'<g class="blob" style="animation-delay:{0.3 + i * 0.065:.2f}s">'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{sub["color"]}" fill-opacity=".92"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>'
            f'<title>{sub["name"]}</title></g>'
        )
    return f"""<svg viewBox="0 0 430 320" role="img"
 aria-label="A painter's palette carrying one blob of colour for each of the nine subjects">
<path class="stroke-in"
 d="M206 20C104 20 22 78 20 152c-2 76 76 140 170 144 98 4 192-50 194-136C386 78 306 20 206 20Z"
 fill="var(--paper-2)" stroke="var(--ink)" stroke-width="3.5" stroke-linejoin="round"/>
<circle cx="120" cy="226" r="26" fill="var(--paper)" stroke="var(--ink)" stroke-width="3"/>
{''.join(blobs)}
<g stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
<path d="M352 300l56-56"/>
<path d="M338 314l10-24 14 14z" fill="var(--marigold)"/>
<path d="M404 240l18 18" />
</g>
</svg>"""


MARK = '''<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor"
 stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
<path d="M6 26l3-8 13-13 5 5-13 13z"/><path d="M19 8l5 5"/><path d="M6 26l7-2"/></svg>'''

CHEVRON = '''<svg class="ch-chevron" viewBox="0 0 24 24" aria-hidden="true" fill="none"
 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<path d="M5 9l7 7 7-7"/></svg>'''

PENCIL = '''<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M3 20l2-6 10-10 4 4-10 10z"/><path d="M13 6l4 4"/></svg>'''

STAR = '''<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
 stroke-width="2.4" stroke-linecap="round"><path d="M12 3v18M4 7l16 10M20 7L4 17"/></svg>'''

ARROW_BACK = '''<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
 stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5l-7 7 7 7"/></svg>'''

MOON = '''<svg class="ico-moon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14A8.5 8.5 0 019.5 3.5 8.5 8.5 0 1020 14z"/></svg>'''

SUN = '''<svg class="ico-sun" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
 stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/>
<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>'''
