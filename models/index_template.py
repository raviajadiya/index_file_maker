# -*- coding: utf-8 -*-
from odoo import models, fields, api

class AppstoreIndexTemplate(models.Model):
    _name = 'appstore.index.template'
    _description = 'Odoo AppStore Index Description Template'
    _order = 'write_date desc'

    name = fields.Char(string='App / Template Name', required=True, default='My Awesome App')
    technical_name = fields.Char(string='Module Technical Name', default='my_awesome_app', help='e.g. sale_order_custom')
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
            }
        }
