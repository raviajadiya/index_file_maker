/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class IndexMakerAction extends Component {
    static template = "index_file_maker.IndexMakerAction";
}

registry.category("actions").add("index_file_maker.builder", IndexMakerAction);
