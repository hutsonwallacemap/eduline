"""Add NCERT Class 12 Arts textbook chapters (found by ncert_probe12.py) to src/data/library.json.

Run: python -I scripts/library/add_class12_ncert.py <ncert12.json from ncert_probe12.py>
Re-running replaces the Class 12 entries. Chapters that are not in the app's Class 12 chapter list keep a
label of their own (chapter null) so they show under "All chapters".
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / 'src' / 'data' / 'library.json'
probe = {(r['code'], r['chapter']): r for r in json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))}

# (book code, chapter no.) -> (subject, book title, app chapter or None, label)
H, P, G, E, EN = 'History', 'Political Science', 'Geography', 'Economics', 'English'
MAP = {
    ('lehs1', 1): (H, 'Themes in Indian History I', 'Bricks, Beads and Bones', None),
    ('lehs1', 2): (H, 'Themes in Indian History I', 'Kings, Farmers and Towns', None),
    ('lehs1', 3): (H, 'Themes in Indian History I', 'Kinship, Caste and Class', None),
    ('lehs1', 4): (H, 'Themes in Indian History I', 'Thinkers, Beliefs and Buildings', None),
    ('lehs2', 1): (H, 'Themes in Indian History II', 'Through the Eyes of Travellers', None),
    ('lehs2', 2): (H, 'Themes in Indian History II', 'Bhakti–Sufi Traditions', None),
    ('lehs2', 3): (H, 'Themes in Indian History II', 'An Imperial Capital: Vijayanagara', None),
    ('lehs2', 4): (H, 'Themes in Indian History II', 'Peasants, Zamindars and the State', None),
    ('lehs3', 1): (H, 'Themes in Indian History III', 'Colonialism and the Countryside', None),
    ('lehs3', 2): (H, 'Themes in Indian History III', 'Rebels and the Raj', None),
    ('lehs3', 3): (H, 'Themes in Indian History III', 'Mahatma Gandhi and the Nationalist Movement', None),
    ('lehs3', 4): (H, 'Themes in Indian History III', 'Framing the Constitution', None),
    ('leps1', 1): (P, 'Contemporary World Politics', 'The End of Bipolarity', None),
    ('leps1', 2): (P, 'Contemporary World Politics', 'New Centres of Power', None),
    ('leps1', 3): (P, 'Contemporary World Politics', 'Contemporary South Asia', None),
    ('leps1', 4): (P, 'Contemporary World Politics', 'International Organisations', None),
    ('leps1', 5): (P, 'Contemporary World Politics', 'Security in the Contemporary World', None),
    ('leps1', 6): (P, 'Contemporary World Politics', 'Environment and Natural Resources', None),
    ('leps1', 7): (P, 'Contemporary World Politics', 'Globalisation', None),
    ('leps2', 1): (P, 'Politics in India since Independence', 'Challenges of Nation Building', None),
    ('leps2', 2): (P, 'Politics in India since Independence', 'Era of One-Party Dominance', None),
    ('leps2', 3): (P, 'Politics in India since Independence', 'Politics of Planned Development', None),
    ('leps2', 4): (P, 'Politics in India since Independence', "India's External Relations", None),
    ('leps2', 5): (P, 'Politics in India since Independence', None, 'Challenges to and Restoration of the Congress System'),
    ('leps2', 6): (P, 'Politics in India since Independence', 'The Crisis of Democratic Order', None),
    ('leps2', 7): (P, 'Politics in India since Independence', 'Regional Aspirations', None),
    ('leps2', 8): (P, 'Politics in India since Independence', 'Recent Developments in Indian Politics', None),
    ('legy1', 1): (G, 'Fundamentals of Human Geography', 'Human Geography: Nature and Scope', None),
    ('legy1', 2): (G, 'Fundamentals of Human Geography', 'The World Population', None),
    ('legy1', 3): (G, 'Fundamentals of Human Geography', 'Human Development', None),
    ('legy1', 4): (G, 'Fundamentals of Human Geography', 'Primary Activities', None),
    ('legy1', 5): (G, 'Fundamentals of Human Geography', 'Secondary Activities', None),
    ('legy1', 6): (G, 'Fundamentals of Human Geography', 'Tertiary and Quaternary Activities', None),
    ('legy1', 7): (G, 'Fundamentals of Human Geography', 'Transport and Communication', None),
    ('legy1', 8): (G, 'Fundamentals of Human Geography', 'International Trade', None),
    ('legy2', 1): (G, 'India: People and Economy', 'Population: Distribution, Density, Growth and Composition', None),
    ('legy2', 2): (G, 'India: People and Economy', 'Human Settlements', None),
    ('legy2', 3): (G, 'India: People and Economy', 'Land Resources and Agriculture', None),
    ('legy2', 4): (G, 'India: People and Economy', 'Water Resources', None),
    ('legy2', 5): (G, 'India: People and Economy', 'Mineral and Energy Resources', None),
    ('legy2', 6): (G, 'India: People and Economy', 'Planning and Sustainable Development in Indian Context', None),
    ('legy2', 7): (G, 'India: People and Economy', None, 'Transport and Communication (India)'),
    ('legy2', 8): (G, 'India: People and Economy', None, 'International Trade (India)'),
    ('legy2', 9): (G, 'India: People and Economy', None, 'Geographical Perspective on Selected Issues and Problems'),
    ('leec1', 1): (E, 'Introductory Macroeconomics', None, 'Introduction'),
    ('leec1', 2): (E, 'Introductory Macroeconomics', 'Macro: National Income Accounting', None),
    ('leec1', 3): (E, 'Introductory Macroeconomics', 'Macro: Money and Banking', None),
    ('leec1', 4): (E, 'Introductory Macroeconomics', 'Macro: Determination of Income and Employment', None),
    ('leec1', 5): (E, 'Introductory Macroeconomics', 'Macro: Government Budget and the Economy', None),
    ('leec1', 6): (E, 'Introductory Macroeconomics', 'Macro: Open Economy Macroeconomics', None),
    ('keec1', 1): (E, 'Indian Economic Development', 'IED: Indian Economy on the Eve of Independence', None),
    ('keec1', 2): (E, 'Indian Economic Development', 'IED: Indian Economy 1950–1990', None),
    ('keec1', 3): (E, 'Indian Economic Development', 'IED: Liberalisation, Privatisation and Globalisation', None),
    ('keec1', 4): (E, 'Indian Economic Development', 'IED: Human Capital Formation', None),
    ('keec1', 5): (E, 'Indian Economic Development', 'IED: Rural Development', None),
    ('keec1', 6): (E, 'Indian Economic Development', 'IED: Employment', None),
    ('keec1', 7): (E, 'Indian Economic Development', 'IED: Environment and Sustainable Development', None),
    ('keec1', 8): (E, 'Indian Economic Development', 'IED: Comparative Development Experiences of India and its Neighbours', None),
    ('lefl1', 1): (EN, 'Flamingo', 'The Last Lesson', None),
    ('lefl1', 2): (EN, 'Flamingo', 'Lost Spring', None),
    ('lefl1', 3): (EN, 'Flamingo', 'Deep Water', None),
    ('lefl1', 4): (EN, 'Flamingo', 'The Rattrap', None),
    ('lefl1', 5): (EN, 'Flamingo', 'Indigo', None),
    ('lefl1', 6): (EN, 'Flamingo', 'Poets and Pancakes', None),
    ('lefl1', 7): (EN, 'Flamingo', 'The Interview', None),
    ('lefl1', 8): (EN, 'Flamingo', 'Going Places', None),
    ('lefl1', 11): (EN, 'Flamingo', 'Poem: My Mother at Sixty-six', None),
    ('lefl1', 12): (EN, 'Flamingo', 'Poem: Keeping Quiet', None),
    ('lefl1', 13): (EN, 'Flamingo', 'Poem: A Thing of Beauty', None),
    ('lefl1', 14): (EN, 'Flamingo', 'Poem: A Roadside Stand', None),
    ('lefl1', 15): (EN, 'Flamingo', "Poem: Aunt Jennifer's Tigers", None),
    ('levt1', 1): (EN, 'Vistas', 'Vistas: The Third Level', None),
    ('levt1', 2): (EN, 'Vistas', 'Vistas: The Tiger King', None),
    ('levt1', 3): (EN, 'Vistas', 'Vistas: Journey to the End of the Earth', None),
    ('levt1', 4): (EN, 'Vistas', 'Vistas: The Enemy', None),
    ('levt1', 5): (EN, 'Vistas', 'Vistas: On the Face of It', None),
    ('levt1', 6): (EN, 'Vistas', 'Vistas: Memories of Childhood', None),
}


def main():
    lib = [r for r in json.loads(LIB.read_text(encoding='utf-8')) if r['grade'] != 12]
    for r in lib:  # fix a broken separator character in older titles
        r['title'] = r['title'].replace('�', '—')
    added = 0
    for (code, n), (subject, book, chapter, label) in MAP.items():
        p = probe.get((code, n))
        if not p:
            print('missing', code, n)
            continue
        name = (chapter or label).split(': ', 1)[-1] if (chapter or label).startswith(('Poem: ', 'Vistas: ', 'Macro: ', 'IED: ')) else (chapter or label)
        lib.append({
            'kind': 'NCERT Textbook', 'subject': subject, 'chapter': chapter, 'title': f'{book} — {name}',
            'source': 'NCERT', 'official': True, 'url': p['url'], 'format': 'pdf', 'pages': p['pages'], 'year': '2026-27 reprint',
            'description': f'Chapter {n} of the NCERT Class 12 textbook "{book}".', 'grade': 12, 'language': 'English', 'id': f'lib12-{code}-{n}',
        })
        added += 1
    LIB.write_text(json.dumps(lib, ensure_ascii=False, indent=1), encoding='utf-8')
    print(added, 'Class 12 chapters added;', len(lib), 'library entries')


if __name__ == '__main__':
    main()
