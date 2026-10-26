# -*- coding: utf-8 -*-
from odoo import models, fields, api

class AppstoreIndexTemplate(models.Model):
    _name = 'appstore.index.template'
    _description = 'Odoo AppStore Index Description Template'
    _order = 'write_date desc'

    name = fields.Char(string='App / Template Name', required=True, default='Odoo AppStore Index File Maker')
    technical_name = fields.Char(string='Module Technical Name', default='index_file_maker', help='e.g. index_file_maker')
    odoo_version = fields.Selection([
        ('20.0', 'Odoo 20.0'),
        ('19.0', 'Odoo 19.0'),
        ('18.0', 'Odoo 18.0'),
        ('17.0', 'Odoo 17.0'),
        ('16.0', 'Odoo 16.0'),
        ('all', 'All Odoo Versions'),
    ], string='Target Version', default='20.0')
    schema_json = fields.Text(string='Widget Schema JSON', default='[]')
    html_content = fields.Html(string='Generated AppStore HTML', sanitize=False)
    notes = fields.Text(string='Notes / Changelog')

    ICON_PREVIEW_HEADER = (
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>\n'
        '<style>\n'
        '@import url(\'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\');\n'
        '@import url(\'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200\');\n'
        '.oi, i.oi { display: inline-block; font-family: \'Material Symbols Outlined\' !important; font-style: normal; font-weight: 400 !important; line-height: 1; letter-spacing: normal; text-transform: none; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; vertical-align: middle; }\n'
        '.oi:before, .oi::before, i.oi:before, i.oi::before { display: inline-block; content: attr(data-icon); text-rendering: geometricPrecision; word-break: keep-all; }\n'
        '</style>\n'
    )

    @api.model
    def _inject_preview_styles(self, html):
        if not html or not isinstance(html, str):
            return html
        if 'font-awesome' in html:
            return html
        return self.ICON_PREVIEW_HEADER + html

    def read(self, fields=None, load='_classic_read'):
        records = super().read(fields=fields, load=load)
        if not fields or 'html_content' in fields:
            for rec in records:
                if 'html_content' in rec and rec['html_content']:
                    rec['html_content'] = self._inject_preview_styles(rec['html_content'])
        return records

    def web_read(self, specification):
        records = super().web_read(specification)
        if 'html_content' in specification:
            for rec in records:
                if 'html_content' in rec and rec['html_content']:
                    rec['html_content'] = self._inject_preview_styles(rec['html_content'])
        return records

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('html_content'):
                vals['html_content'] = self._inject_preview_styles(vals['html_content'])
        return super().create(vals_list)

    def write(self, vals):
        if vals.get('html_content'):
            vals['html_content'] = self._inject_preview_styles(vals['html_content'])
        return super().write(vals)

    def action_open_builder(self):
        """Open the interactive drag and drop builder for this template"""
        self.ensure_one()
        return {
            'type': 'ir.actions.client',
            'tag': 'index_file_maker.builder',
            'name': f'Index Builder - {self.name}',
            'target': 'current',
            'params': {
                'template_id': self.id,
                'template_name': self.name,
                'technical_name': self.technical_name or '',
            },
            'context': {
                'active_id': self.id,
                'template_id': self.id,
            }
        }

