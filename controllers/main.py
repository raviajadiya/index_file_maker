# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class IndexFileMakerController(http.Controller):

    @http.route('/index_file_maker/editor', type='http', auth='user', website=False)
    def index_editor(self, **kwargs):
        """Direct access to the Index Maker editor in backend"""
        return request.redirect('/web#action=index_file_maker.action_index_builder')

    @http.route('/index_file_maker/get_template', type='jsonrpc', auth='user')
    def get_template(self, template_id):
        record = request.env['appstore.index.template'].browse(int(template_id))
        if record.exists():
            return {
                'id': record.id,
                'name': record.name,
                'technical_name': record.technical_name,
                'odoo_version': record.odoo_version,
                'schema_json': record.schema_json,
                'html_content': record.html_content,
            }
        return {'error': 'Template not found'}

    @http.route('/index_file_maker/save_template', type='jsonrpc', auth='user')
    def save_template(self, template_id=None, name='Untitled', technical_name='', schema_json='[]', html_content=''):
        Template = request.env['appstore.index.template']
        if template_id:
            record = Template.browse(int(template_id))
            if record.exists():
                record.write({
                    'name': name,
                    'technical_name': technical_name,
                    'schema_json': schema_json,
                    'html_content': html_content,
                })
                return {'status': 'success', 'id': record.id, 'name': record.name}
        
        record = Template.create({
            'name': name,
            'technical_name': technical_name,
            'schema_json': schema_json,
            'html_content': html_content,
        })
        return {'status': 'success', 'id': record.id, 'name': record.name}

    @http.route('/index_file_maker/download_file', type='http', auth='user', methods=['POST'], csrf=False)
    def download_file(self, html_content=None, filename="index.html", **kwargs):
        if not html_content:
            html_content = "<!-- Empty Odoo AppStore Description -->"
        
        headers = [
            ('Content-Type', 'text/html; charset=utf-8'),
            ('Content-Disposition', f'attachment; filename="{filename}"'),
        ]
        return request.make_response(html_content, headers=headers)
