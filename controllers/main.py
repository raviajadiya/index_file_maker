# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class IndexFileMakerController(http.Controller):

    @http.route('/index_file_maker/editor', type='http', auth='user', website=False)
    def index_editor(self, **kwargs):
        """Direct access to the Index Maker editor in backend"""
        return request.redirect('/web#action=index_file_maker.action_index_builder')

    @http.route('/index_file_maker/get_template', type='jsonrpc', auth='public')
    def get_template(self, template_id):
        record = request.env['appstore.index.template'].sudo().browse(int(template_id))
        if record.exists():
            return {
                'id': record.id,
                'name': record.name,
                'technical_name': record.technical_name or '',
                'odoo_version': record.odoo_version or '20.0',
                'schema_json': record.schema_json or '[]',
                'html_content': record.html_content or '',
            }
        return {'error': 'Template not found'}

    @http.route('/index_file_maker/save_template', type='jsonrpc', auth='public')
    def save_template(self, template_id=None, name='Untitled', technical_name='', odoo_version='20.0', schema_json='[]', html_content=''):
        Template = request.env['appstore.index.template'].sudo()
        if template_id:
            record = Template.browse(int(template_id))
            if record.exists():
                record.write({
                    'name': name,
                    'technical_name': technical_name,
                    'odoo_version': odoo_version or '20.0',
                    'schema_json': schema_json,
                    'html_content': html_content,
                })
                return {'status': 'success', 'id': record.id, 'name': record.name, 'is_new': False}
        
        record = Template.create({
            'name': name,
            'technical_name': technical_name,
            'odoo_version': odoo_version or '20.0',
            'schema_json': schema_json,
            'html_content': html_content,
        })
        return {'status': 'success', 'id': record.id, 'name': record.name, 'is_new': True}

    @http.route('/index_file_maker/list_templates', type='jsonrpc', auth='public')
    def list_templates(self):
        records = request.env['appstore.index.template'].sudo().search_read(
            [], ['id', 'name', 'technical_name', 'odoo_version', 'write_date'], order='write_date desc'
        )
        return {'status': 'success', 'templates': records}

    @http.route('/index_file_maker/delete_template', type='jsonrpc', auth='public')
    def delete_template(self, template_id):
        record = request.env['appstore.index.template'].sudo().browse(int(template_id))
        if record.exists():
            record.unlink()
            return {'status': 'success'}
        return {'error': 'Template not found'}

    @http.route('/index_file_maker/download_file', type='http', auth='user', methods=['POST'], csrf=False)
    def download_file(self, html_content=None, filename="index.html", **kwargs):
        if not html_content:
            html_content = "<!-- Empty Odoo AppStore Description -->"
        
        headers = [
            ('Content-Type', 'text/html; charset=utf-8'),
            ('Content-Disposition', f'attachment; filename="{filename}"'),
        ]
        return request.make_response(html_content, headers=headers)
