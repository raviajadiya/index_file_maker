/** @odoo-module **/

import { Component, useProps } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { standardActionServiceProps } from "@web/webclient/actions/action_plugin";

export class IndexMakerAction extends Component {
    static template = "index_file_maker.IndexMakerAction";
    props = useProps(standardActionServiceProps);

    setup() {
        try {
            const params = (this.props && this.props.action && this.props.action.params) || {};
            const context = (this.props && this.props.action && this.props.action.context) || {};
            const tId = params.template_id || context.active_id || '';
            this.iframeUrl = `/index_file_maker/static/src/standalone/index.html?v=20.0.47${tId ? `&template_id=${encodeURIComponent(tId)}` : ''}`;
        } catch (e) {
            this.iframeUrl = "/index_file_maker/static/src/standalone/index.html?v=20.0.47";
        }
    }

    get url() {
        return this.iframeUrl;
    }
}

registry.category("actions").add("index_file_maker.builder", IndexMakerAction);
