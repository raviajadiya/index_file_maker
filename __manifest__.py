# -*- coding: utf-8 -*-
{
    'name': 'Odoo AppStore Index File Maker',
    'version': '20.0.1.0.42',
    'category': 'Extra Tools',
    'summary': 'Visual Drag & Drop Builder to Create Odoo App Store Compatible index.html',
    'sequence': 10,
    'author': 'Ravi / Odoo Developer',
    'website': 'https://www.odoo.com',
    'support': 'supportnuvexaonline@gmail.com',
    'license': 'LGPL-3',
    'description': """
Odoo AppStore Index File Maker (Odoo 20)
========================================
Visual Drag & Drop Builder to create professional, high-converting index.html
descriptions for Odoo App Store modules.

Layout & Features:
------------------
* Center: Drag & Drop live Canvas with reorder handles & hover actions
* Right Side: Categorized Widgets Library (Hero Banners, Highlights, Features, Screenshots, FAQ, Support)
* Left Side: Real-time Property Inspector for selected widgets & global page settings
* Top Bar: Live Preview Modal & 1-Click Download of index.html
* 100% compliant with Odoo App Store HTML/CSS guidelines (pure Bootstrap/inline styles, zero blocked scripts)
* Responsive design (Desktop, Tablet, Mobile preview toggle)
* Standalone and Backend OWL Client Action ready
""",
    'depends': ['base', 'web'],
    'data': [
        'security/ir.access.csv',
        'views/index_template_views.xml',
        'views/menus.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'index_file_maker/static/src/scss/index_maker.scss',
            'index_file_maker/static/src/js/widget_definitions.js',
            'index_file_maker/static/src/js/html_generator.js',
            'index_file_maker/static/src/js/index_maker_action.js',
            'index_file_maker/static/src/xml/index_maker_template.xml',
        ],
    },
    'images': ['static/description/banner.png'],
    'installable': True,
    'application': True,
    'auto_install': False,
}
