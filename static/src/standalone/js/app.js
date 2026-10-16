// Odoo AppStore Index Maker - Core Application Logic

// State variables
let currentTemplateId = null;
let currentTemplateName = 'My Custom Odoo App';
let selectedWidgetId = null;
let activeLeftTab = 'props';
let currentViewport = 'desktop';

let pageSettings = {
    appName: 'My Custom Odoo App',
    technicalName: 'my_custom_app',
    odooVersion: '20.0',
    brandColor: '#714B67',
    accentColor: '#00A09D',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
};

// Active widget list in canvas
let activeWidgets = [];

// INITIALIZE APP
function initApp() {
    let tId = null;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        tId = urlParams.get('template_id');

        if (!tId && window.top && window.top !== window) {
            const topHash = window.top.location.hash || '';
            const topSearch = window.top.location.search || '';
            const m = (topSearch + '&' + topHash).match(/(?:template_id|active_id)=(\d+)/);
            if (m) {
                tId = m[1];
            }
        }
    } catch (e) {
        console.warn('Could not read template_id from URL:', e);
    }

    if (tId) {
        loadTemplateFromBackend(tId);
    } else {
        renderWidgetCatalog();
        loadTemplate('blank', true);
        renderGlobalSettingsPanel();
        updateTemplateHeaderDisplay();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

        // RENDER RIGHT WIDGET CATALOG
        function renderWidgetCatalog(filter = '') {
            const container = document.getElementById('widgets-catalog-container');
            container.innerHTML = '';

            const term = filter.toLowerCase().trim();

            WIDGET_CATALOG.forEach(cat => {
                const filteredWidgets = cat.widgets.filter(w => 
                    w.name.toLowerCase().includes(term) || 
                    w.desc.toLowerCase().includes(term)
                );

                if (filteredWidgets.length === 0) return;

                const group = document.createElement('div');
                group.className = 'category-group';
                group.innerHTML = `<div class="category-title">${cat.category}</div>`;

                filteredWidgets.forEach(w => {
                    const card = document.createElement('div');
                    card.className = 'widget-card';
                    card.setAttribute('draggable', 'true');
                    card.innerHTML = `
                        <div class="widget-card-info">
                            <div class="widget-card-icon"><i class="fa ${w.icon}"></i></div>
                            <div>
                                <div class="widget-card-title">${w.name}</div>
                                <div class="widget-card-desc">${w.desc}</div>
                            </div>
                        </div>
                        <button class="widget-add-btn" title="Add to Canvas"><i class="fa fa-plus"></i></button>
                    `;

                    // Drag handlers
                    card.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', w.type);
                    });

                    // Click to add
                    card.querySelector('.widget-add-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        addWidgetToCanvas(w.type);
                    });
                    card.addEventListener('click', () => {
                        addWidgetToCanvas(w.type);
                    });

                    group.appendChild(card);
                });

                container.appendChild(group);
            });
        }

        function filterWidgets(val) {
            renderWidgetCatalog(val);
        }

        // CANVAS DRAG & DROP HANDLING & AUTO-SCROLL
        const canvasArea = document.getElementById('canvas-area');
        let dragAutoScrollTimer = null;

        function handleCanvasDragScroll(clientY) {
            const ca = document.getElementById('canvas-area');
            if (!ca) return;
            const rect = ca.getBoundingClientRect();
            const threshold = 100;

            clearInterval(dragAutoScrollTimer);
            dragAutoScrollTimer = null;

            if (clientY > rect.bottom - threshold) {
                dragAutoScrollTimer = setInterval(() => {
                    ca.scrollTop += 24;
                }, 16);
            } else if (clientY < rect.top + threshold) {
                dragAutoScrollTimer = setInterval(() => {
                    ca.scrollTop -= 24;
                }, 16);
            }
        }

        function stopCanvasDragScroll() {
            if (dragAutoScrollTimer) {
                clearInterval(dragAutoScrollTimer);
                dragAutoScrollTimer = null;
            }
        }

        canvasArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            handleCanvasDragScroll(e.clientY);
        });

        canvasArea.addEventListener('dragleave', () => {
            stopCanvasDragScroll();
        });

        canvasArea.addEventListener('drop', (e) => {
            e.preventDefault();
            stopCanvasDragScroll();
            const widgetType = e.dataTransfer.getData('text/plain');
            if (widgetType) {
                addWidgetToCanvas(widgetType);
            }
        });

        document.addEventListener('dragend', () => {
            stopCanvasDragScroll();
        });

        // Dedicated wheel listener on center canvas to prevent outer Odoo page scroll and drive inner canvas scroll
        canvasArea.addEventListener('wheel', (e) => {
            if (document.querySelector('.modal-overlay.active')) return;
            e.preventDefault();
            e.stopPropagation();
            canvasArea.scrollTop += e.deltaY;
        }, { passive: false });

        // Scroll helper functions
        function scrollCanvasTo(direction) {
            const ca = document.getElementById('canvas-area');
            if (!ca) return;
            if (direction === 'top') {
                ca.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                ca.scrollTo({ top: ca.scrollHeight, behavior: 'smooth' });
            }
        }

        function updateWidgetCountBadge() {
            const badge = document.getElementById('scroll-widget-count');
            if (badge) {
                const count = activeWidgets.length;
                badge.textContent = `${count} ${count === 1 ? 'section' : 'sections'}`;
            }
        }

        function scrollToWidget(id) {
            setTimeout(() => {
                const ca = document.getElementById('canvas-area');
                const el = document.querySelector(`.widget-block[data-id="${id}"]`);
                if (ca && el) {
                    const caRect = ca.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();
                    const targetTop = elRect.top - caRect.top + ca.scrollTop;
                    ca.scrollTo({
                        top: Math.max(0, targetTop - 25),
                        behavior: 'smooth'
                    });
                    el.style.transition = 'box-shadow 0.3s ease';
                    el.style.boxShadow = '0 0 0 5px rgba(0, 160, 157, 0.55)';
                    setTimeout(() => { el.style.boxShadow = ''; }, 1400);
                }
            }, 80);
        }

        function addWidgetToCanvas(type, insertIndex = null) {
            let widgetDef = null;
            for (const cat of WIDGET_CATALOG) {
                const found = cat.widgets.find(w => w.type === type);
                if (found) {
                    widgetDef = found;
                    break;
                }
            }
            if (!widgetDef) return;

            const newWidget = {
                id: 'w_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                type: widgetDef.type,
                name: widgetDef.name,
                data: JSON.parse(JSON.stringify(widgetDef.defaultData))
            };

            if (insertIndex !== null) {
                activeWidgets.splice(insertIndex, 0, newWidget);
            } else {
                // Always append new widget at the end of canvas so all widgets appear in order
                activeWidgets.push(newWidget);
            }

            selectedWidgetId = newWidget.id;
            renderCanvas();
            renderPropertyInspector();
            updateWidgetCountBadge();
            showToast(`Added ${widgetDef.name}`);
            scrollToWidget(newWidget.id);
        }

        // RENDER CANVAS
        function renderCanvas() {
            updateWidgetCountBadge();
            const root = document.getElementById('canvas-root');
            root.innerHTML = '';

            if (activeWidgets.length === 0) {
                root.innerHTML = `
                    <div class="canvas-empty">
                        <div class="canvas-empty-icon"><i class="fa fa-mouse-pointer"></i></div>
                        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Your Canvas is Empty</h3>
                        <p style="max-width: 420px; margin-bottom: 24px; font-size: 14px;">Drag widgets from the left library or choose a starter template to begin designing your Odoo App Store description.</p>
                        <button class="btn btn-primary" onclick="openTemplatesModal()">
                            <i class="fa fa-folder-open-o"></i> Browse Starter Templates
                        </button>
                    </div>
                `;
                return;
            }

            activeWidgets.forEach((widget, index) => {
                const block = document.createElement('div');
                block.className = 'widget-block' + (widget.id === selectedWidgetId ? ' selected' : '');
                block.dataset.id = widget.id;
                block.dataset.index = index;

                // Toolbar
                const toolbar = document.createElement('div');
                toolbar.className = 'widget-toolbar';
                toolbar.innerHTML = `
                    <span class="widget-type-badge">${widget.type.replace('_', ' ')}</span>
                    <button class="toolbar-btn" title="Move Up" onclick="moveWidget(${index}, -1, event)"><i class="fa fa-arrow-up"></i></button>
                    <button class="toolbar-btn" title="Move Down" onclick="moveWidget(${index}, 1, event)"><i class="fa fa-arrow-down"></i></button>
                    <button class="toolbar-btn" title="Duplicate" onclick="duplicateWidget('${widget.id}', event)"><i class="fa fa-clone"></i></button>
                    <button class="toolbar-btn btn-del" title="Delete" onclick="deleteWidget('${widget.id}', event)"><i class="fa fa-trash"></i></button>
                `;
                block.appendChild(toolbar);

                // Content
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = renderWidgetHtml(widget);
                block.appendChild(contentDiv);

                // Drag over individual block to drop before or after
                block.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = block.getBoundingClientRect();
                    const isTop = (e.clientY - rect.top) < (rect.height / 2);
                    block.style.borderTop = isTop ? '4px solid var(--accent)' : 'none';
                    block.style.borderBottom = !isTop ? '4px solid var(--accent)' : 'none';
                });

                block.addEventListener('dragleave', (e) => {
                    block.style.borderTop = 'none';
                    block.style.borderBottom = 'none';
                });

                block.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    block.style.borderTop = 'none';
                    block.style.borderBottom = 'none';
                    const widgetType = e.dataTransfer.getData('text/plain');
                    if (widgetType) {
                        const rect = block.getBoundingClientRect();
                        const isTop = (e.clientY - rect.top) < (rect.height / 2);
                        const targetIndex = isTop ? index : index + 1;
                        addWidgetToCanvas(widgetType, targetIndex);
                    }
                });

                // Click to select
                block.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectWidget(widget.id);
                });

                root.appendChild(block);
            });

            // Bottom Drop Zone
            const bottomZone = document.createElement('div');
            bottomZone.className = 'canvas-bottom-drop-zone';
            bottomZone.innerHTML = '<i class="fa fa-plus-circle" style="margin-right: 8px; font-size: 16px;"></i> Drop any widget here to add to bottom';
            bottomZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                bottomZone.classList.add('dragover');
            });
            bottomZone.addEventListener('dragleave', () => {
                bottomZone.classList.remove('dragover');
            });
            bottomZone.addEventListener('drop', (e) => {
                e.preventDefault();
                bottomZone.classList.remove('dragover');
                const widgetType = e.dataTransfer.getData('text/plain');
                if (widgetType) {
                    addWidgetToCanvas(widgetType, activeWidgets.length);
                }
            });
            root.appendChild(bottomZone);
        }

        function selectWidget(id) {
            selectedWidgetId = id;
            document.querySelectorAll('.widget-block').forEach(b => {
                b.classList.toggle('selected', b.dataset.id === id);
            });
            switchLeftTab('props');
            renderPropertyInspector();
        }

        function moveWidget(index, direction, e) {
            if (e) e.stopPropagation();
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= activeWidgets.length) return;
            const item = activeWidgets.splice(index, 1)[0];
            activeWidgets.splice(newIndex, 0, item);
            selectedWidgetId = item.id;
            renderCanvas();
            renderPropertyInspector();
            scrollToWidget(item.id);
        }

        function duplicateWidget(id, e) {
            if (e) e.stopPropagation();
            const idx = activeWidgets.findIndex(w => w.id === id);
            if (idx === -1) return;
            const original = activeWidgets[idx];
            const copy = {
                id: 'w_' + Date.now(),
                type: original.type,
                name: original.name,
                data: JSON.parse(JSON.stringify(original.data))
            };
            activeWidgets.splice(idx + 1, 0, copy);
            selectedWidgetId = copy.id;
            renderCanvas();
            renderPropertyInspector();
            updateWidgetCountBadge();
            scrollToWidget(copy.id);
            showToast('Widget duplicated');
        }

        function deleteWidget(id, e) {
            if (e) e.stopPropagation();
            activeWidgets = activeWidgets.filter(w => w.id !== id);
            if (selectedWidgetId === id) {
                selectedWidgetId = activeWidgets.length > 0 ? activeWidgets[0].id : null;
            }
            renderCanvas();
            renderPropertyInspector();
            updateWidgetCountBadge();
            showToast('Widget deleted');
        }

        // LEFT PANEL: PROPERTY INSPECTOR
        function switchLeftTab(tab) {
            activeLeftTab = tab;
            document.getElementById('tab-props').classList.toggle('active', tab === 'props');
            document.getElementById('tab-global').classList.toggle('active', tab === 'global');
            if (tab === 'props') {
                renderPropertyInspector();
            } else {
                renderGlobalSettingsPanel();
            }
        }

        function renderPropertyInspector() {
            const container = document.getElementById('props-container');
            container.innerHTML = '';

            const widget = activeWidgets.find(w => w.id === selectedWidgetId);
            if (!widget) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
                        <i class="fa fa-hand-pointer-o" style="font-size: 36px; margin-bottom: 12px; display: block; color: #cbd5e1;"></i>
                        <p style="font-size: 13px;">Click on any section in the center canvas to edit its properties, or add new widgets from the right library.</p>
                    </div>
                `;
                return;
            }

            const d = widget.data;

            // Auto-heal legacy white-on-white badge colors
            if (d.badges !== undefined) {
                if (!d.badgeBgColor || (d.badgeBgColor === '#f5efff' && d.badgeTextColor === '#ffffff')) {
                    d.badgeBgColor = '#ffffff';
                    d.badgeTextColor = '#714B67';
                    d.badgeBorderColor = '#e2e8f0';
                }
                if (d.badgeBorderColor === undefined) {
                    d.badgeBorderColor = '#e2e8f0';
                }
            }

            // Widget Header Banner
            const head = document.createElement('div');
            head.style.marginBottom = '20px';
            head.style.paddingBottom = '14px';
            head.style.borderBottom = '1px solid #e2e8f0';
            head.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <strong style="font-size: 14px; color: var(--text-main);">${widget.type.replace('_', ' ').toUpperCase()}</strong>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn btn-outline" style="padding: 4px 8px; color: #ef4444; border-color: #fca5a5;" onclick="deleteWidget('${widget.id}')" title="Delete"><i class="fa fa-trash"></i></button>
                    </div>
                </div>
            `;
            container.appendChild(head);

            // Dynamic fields based on widget schema
            const form = document.createElement('div');

            // Title
            if (d.title !== undefined && widget.type !== 'highlights_grid' && widget.type !== 'stats_counter' && widget.type !== 'mobile_showcase' && widget.type !== 'desktop_showcase' && widget.type !== 'workflow_steps' && widget.type !== 'vs_table' && widget.type !== 'faq_section' && widget.type !== 'support_banner') {
                form.appendChild(createInputField('Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
            }

            // Subtitle
            if (d.subtitle !== undefined && widget.type !== 'highlights_grid' && widget.type !== 'stats_counter' && widget.type !== 'mobile_showcase' && widget.type !== 'desktop_showcase' && widget.type !== 'workflow_steps' && widget.type !== 'vs_table' && widget.type !== 'faq_section' && widget.type !== 'support_banner') {
                form.appendChild(createTextareaField('Subtitle / Tagline', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
            }

            // App / Module Icon (for hero_banner)
            if (d.iconUrl !== undefined) {
                const iconGroup = document.createElement('div');
                iconGroup.className = 'form-group';
                iconGroup.innerHTML = `
                    <label class="form-label">App / Module Icon</label>
                    <input type="text" class="form-input mb-1" placeholder="Icon URL (e.g. icon.png)" value="${escapeHTML(d.iconUrl)}">
                    <div style="display: flex; gap: 8px; margin-top: 6px;">
                        <label class="btn btn-outline" style="font-size: 11px; padding: 5px 10px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                            <i class="fa fa-upload"></i> Upload Icon
                            <input type="file" accept="image/*" style="display: none;" id="icon-file-uploader">
                        </label>
                        ${d.iconUrl ? `<button class="btn btn-outline" style="font-size: 11px; padding: 5px 10px; color: #ef4444;" id="btn-clear-icon">Remove</button>` : ''}
                    </div>
                `;
                const textInput = iconGroup.querySelector('input[type="text"]');
                textInput.addEventListener('input', (e) => {
                    d.iconUrl = e.target.value;
                    updateCanvasLive();
                });
                const fileInput = iconGroup.querySelector('#icon-file-uploader');
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            d.iconUrl = evt.target.result;
                            textInput.value = '(Embedded Icon Image)';
                            updateCanvasLive();
                            renderPropertyInspector();
                            showToast('Icon uploaded & embedded');
                        };
                        reader.readAsDataURL(file);
                    }
                });
                const clearBtn = iconGroup.querySelector('#btn-clear-icon');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        d.iconUrl = '';
                        updateCanvasLive();
                        renderPropertyInspector();
                    });
                }
                form.appendChild(iconGroup);
            }

            // Single Badge Text (for minimal_header)
            if (d.badge !== undefined && widget.type !== 'mobile_showcase' && widget.type !== 'desktop_showcase') {
                form.appendChild(createInputField('Badge Text', d.badge, (val) => { d.badge = val; updateCanvasLive(); }));
            }

            // Badges Manager (Hero Banner Pro & multi-badge widgets)
            if (d.badges !== undefined) {
                const badgeGroup = document.createElement('div');
                badgeGroup.className = 'form-group';
                
                const showBadgesToggle = d.showBadges !== undefined ? `
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--text-main);">Show Badges in Header</span>
                        <input type="checkbox" id="chk-show-badges" ${d.showBadges ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--primary);">
                    </div>
                ` : '';

                badgeGroup.innerHTML = `
                    ${showBadgesToggle}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label class="form-label" style="margin: 0;">Badges (${d.badges.length})</label>
                        <span style="font-size: 11px; color: var(--text-muted);">Custom tags</span>
                    </div>
                    <div id="badges-list-items" style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px;"></div>
                    <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                        <input type="text" class="form-input" id="new-badge-text" placeholder="Type new badge..." style="flex: 1; font-size: 12px; padding: 6px 10px;">
                        <button type="button" class="btn btn-outline" id="btn-add-new-badge" style="font-size: 11px; padding: 6px 12px; color: var(--primary); border-color: var(--primary); white-space: nowrap;">
                            <i class="fa fa-plus"></i> Add
                        </button>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Quick Suggestions:</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;" id="badge-suggestions-box">
                            <button type="button" class="badge-pill-btn" data-badge="Odoo 20">+ Odoo 20</button>
                            <button type="button" class="badge-pill-btn" data-badge="Odoo 19">+ Odoo 19</button>
                            <button type="button" class="badge-pill-btn" data-badge="Odoo 18">+ Odoo 18</button>
                            <button type="button" class="badge-pill-btn" data-badge="Community">+ Community</button>
                            <button type="button" class="badge-pill-btn" data-badge="Enterprise">+ Enterprise</button>
                            <button type="button" class="badge-pill-btn" data-badge="Free Support">+ Free Support</button>
                            <button type="button" class="badge-pill-btn" data-badge="100% Tested">+ 100% Tested</button>
                        </div>
                    </div>
                `;

                if (d.showBadges !== undefined) {
                    const chk = badgeGroup.querySelector('#chk-show-badges');
                    chk.addEventListener('change', (e) => {
                        d.showBadges = e.target.checked;
                        updateCanvasLive();
                    });
                }

                const listContainer = badgeGroup.querySelector('#badges-list-items');
                d.badges.forEach((bText, idx) => {
                    const row = document.createElement('div');
                    row.style.cssText = 'display: flex; gap: 6px; align-items: center; background: #ffffff; padding: 3px 6px; border: 1px solid #e2e8f0; border-radius: 6px;';
                    row.innerHTML = `
                        <i class="fa fa-tag" style="color: #94a3b8; font-size: 11px;"></i>
                        <input type="text" class="form-input" value="${escapeHTML(bText)}" style="flex: 1; font-size: 12px; padding: 4px 6px; border: none; background: transparent;">
                        <button type="button" style="border: none; background: transparent; color: #ef4444; padding: 4px; cursor: pointer; font-size: 12px;" title="Remove"><i class="fa fa-times"></i></button>
                    `;
                    const input = row.querySelector('input');
                    input.addEventListener('input', (e) => {
                        d.badges[idx] = e.target.value;
                        updateCanvasLive();
                    });
                    const del = row.querySelector('button');
                    del.addEventListener('click', () => {
                        d.badges.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });
                    listContainer.appendChild(row);
                });

                const addInput = badgeGroup.querySelector('#new-badge-text');
                const addBtn = badgeGroup.querySelector('#btn-add-new-badge');
                const addBadgeAction = () => {
                    const val = (addInput.value || '').trim();
                    if (val) {
                        d.badges.push(val);
                        renderPropertyInspector();
                        updateCanvasLive();
                    }
                };
                addBtn.addEventListener('click', addBadgeAction);
                addInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addBadgeAction();
                    }
                });

                badgeGroup.querySelectorAll('.badge-pill-btn').forEach(btn => {
                    btn.style.cssText = 'font-size: 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 2px 8px; cursor: pointer; color: #475569;';
                    btn.addEventListener('click', () => {
                        const sug = btn.getAttribute('data-badge');
                        if (!d.badges.includes(sug)) {
                            d.badges.push(sug);
                            renderPropertyInspector();
                            updateCanvasLive();
                        }
                    });
                });

                form.appendChild(badgeGroup);
            }

            // Badge / Chip Colors & Appearance (Dynamic Color Controls & Presets)
            if ((d.badges !== undefined || d.badgeBgColor !== undefined) && widget.type !== 'vs_table') {
                const isShowcase = (widget.type === 'mobile_showcase' || widget.type === 'desktop_showcase');
                if (d.badgeBgColor === undefined) d.badgeBgColor = (isShowcase ? '#007bff' : '#ffffff');
                if (d.badgeTextColor === undefined) d.badgeTextColor = (isShowcase ? '#ffffff' : '#714B67');
                if (d.badgeBorderColor === undefined) d.badgeBorderColor = (isShowcase ? '#007bff' : '#e2e8f0');

                // Determine active preset
                let activePreset = d.badgePreset || '';
                const mobilePresets = [
                    { id: 'blue', label: '🔵 Vibrant Blue', bg: '#007bff', text: '#ffffff', border: '#007bff', accent: '#007bff', ptBg: '#f0f7ff', ptBorder: '#d0e4ff' },
                    { id: 'purple', label: '🟣 Brand Purple', bg: '#714B67', text: '#ffffff', border: '#714B67', accent: '#714B67', ptBg: '#faf5ff', ptBorder: '#e9d5ff' },
                    { id: 'teal', label: '🟢 Teal Accent', bg: '#00A09D', text: '#ffffff', border: '#00A09D', accent: '#00A09D', ptBg: '#f0fdfa', ptBorder: '#ccfbf1' },
                    { id: 'dark', label: '⬛ Sleek Dark', bg: '#1e293b', text: '#ffffff', border: '#1e293b', accent: '#1e293b', ptBg: '#f8fafc', ptBorder: '#cbd5e1' },
                    { id: 'amber', label: '🟠 Amber Gold', bg: '#f59e0b', text: '#ffffff', border: '#d97706', accent: '#d97706', ptBg: '#fffbeb', ptBorder: '#fde68a' },
                    { id: 'white', label: '⚪ Clean White', bg: '#ffffff', text: '#007bff', border: '#007bff', accent: '#007bff', ptBg: '#f8fafc', ptBorder: '#e2e8f0' }
                ];
                const standardPresets = [
                    { id: 'white', label: '⚪ Clean White', bg: '#ffffff', text: d.bgColor || '#714B67', border: '#cbd5e1' },
                    { id: 'purple', label: '🟣 Soft Purple', bg: '#f5efff', text: '#714B67', border: '#d8b4fe' },
                    { id: 'mint', label: '🟢 Teal Accent', bg: '#e6f6f6', text: '#008480', border: '#99f6e4' },
                    { id: 'glass', label: '💎 Glass Frost', bg: 'rgba(255, 255, 255, 0.20)', text: '#ffffff', border: 'rgba(255, 255, 255, 0.40)' },
                    { id: 'dark', label: '⬛ Dark Pill', bg: '#1e1b4b', text: '#ffffff', border: '#4338ca' }
                ];

                const currentPresets = isShowcase ? mobilePresets : standardPresets;

                if (!activePreset) {
                    const match = currentPresets.find(p => p.bg.toLowerCase() === (d.badgeBgColor || '').toLowerCase());
                    if (match) activePreset = match.id;
                }

                const presetsHTML = currentPresets.map(p => {
                    const isSel = (activePreset === p.id);
                    const selStyles = isSel 
                        ? 'border: 2px solid var(--primary, #007bff) !important; background: #eff6ff !important; box-shadow: 0 0 0 2px rgba(0,123,255,0.25) !important; font-weight: 700 !important; color: #1d4ed8 !important;' 
                        : 'border: 1px solid #cbd5e1; background: #ffffff; color: var(--text-main); font-weight: 500;';
                    return `<button type="button" class="btn btn-outline" data-preset="${p.id}" style="font-size: 10px; padding: 4px 8px; cursor: pointer; transition: all 0.15s ease; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; ${selStyles}">
                        ${isSel ? '<i class="fa fa-check" style="color: #007bff; font-weight: bold;"></i>' : ''}${p.label}
                    </button>`;
                }).join('');

                const badgeColorCard = document.createElement('div');
                badgeColorCard.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                badgeColorCard.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="display: flex; align-items: center; gap: 6px;">
                            <i class="fa fa-paint-brush" style="color: var(--primary);"></i> Badge / Chip Colors
                        </span>
                        <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">Live Preview</span>
                    </div>

                    ${isShowcase ? `
                    <div style="text-align: center; margin-bottom: 12px; padding: 12px 10px; background: ${d.bgColor || '#ffffff'}; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; gap: 12px;">
                            <span id="badge-chip-live-preview" style="background-color: ${d.badgeBgColor}; color: ${d.badgeTextColor} !important; border: 1px solid ${d.badgeBorderColor || d.badgeBgColor}; padding: 4px 14px; border-radius: 10px; font-size: 18px; font-weight: 700; min-width: 44px; height: 38px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; flex-shrink: 0;">
                                ${escapeHTML(d.badgeNumber || (widget.type === 'desktop_showcase' ? '01' : '03'))}
                            </span>
                            <span id="badge-chip-category-preview" style="font-size: 22px; font-weight: 700; color: #1e293b !important; line-height: 1.2;">
                                ${escapeHTML(d.badgeText || (widget.type === 'desktop_showcase' ? 'Dashboard' : 'Conversation'))}
                            </span>
                        </div>
                    </div>` : `
                    <div style="text-align: center; margin-bottom: 12px; padding: 10px; background: ${d.bgColor || '#714B67'}; border-radius: 6px;">
                        <span id="badge-chip-live-preview" style="background-color: ${d.badgeBgColor}; color: ${d.badgeTextColor}; border: 1px solid ${d.badgeBorderColor}; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block;">
                            Odoo 20 &bull; Enterprise
                        </span>
                    </div>`}

                    <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Quick Presets:</span>
                        ${activePreset && activePreset !== 'custom' ? `<span style="font-size: 10px; color: var(--primary); font-weight: 700;"><i class="fa fa-check-circle"></i> Active Preset</span>` : ''}
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px;" id="badge-presets-container">
                        ${presetsHTML}
                    </div>
                    <div id="badge-color-fields-wrapper"></div>
                `;

                const previewSpan = badgeColorCard.querySelector('#badge-chip-live-preview');
                const updateBadgePreview = () => {
                    if (previewSpan) {
                        previewSpan.style.backgroundColor = d.badgeBgColor;
                        previewSpan.style.color = d.badgeTextColor;
                        previewSpan.style.borderColor = d.badgeBorderColor || d.badgeBgColor;
                        if (isShowcase) {
                            previewSpan.innerText = d.badgeNumber || (widget.type === 'desktop_showcase' ? '01' : '03');
                            const catSpan = badgeColorCard.querySelector('#badge-chip-category-preview');
                            if (catSpan) catSpan.innerText = d.badgeText || (widget.type === 'desktop_showcase' ? 'Dashboard' : 'Conversation');
                        }
                    }
                };

                const fieldsWrapper = badgeColorCard.querySelector('#badge-color-fields-wrapper');
                fieldsWrapper.appendChild(createColorField(isShowcase ? 'Badge Number Background' : 'Badge Background Color', d.badgeBgColor, (val) => {
                    d.badgeBgColor = val;
                    const match = currentPresets.find(p => p.bg.toLowerCase() === val.toLowerCase());
                    d.badgePreset = match ? match.id : 'custom';
                    updateBadgePreview();
                    updateCanvasLive();
                }));
                fieldsWrapper.appendChild(createColorField(isShowcase ? 'Badge Number Text Color' : 'Badge Text Color', d.badgeTextColor, (val) => {
                    d.badgeTextColor = val;
                    d.badgePreset = 'custom';
                    updateBadgePreview();
                    updateCanvasLive();
                }));
                fieldsWrapper.appendChild(createColorField(isShowcase ? 'Badge Border Color' : 'Badge Border Color', d.badgeBorderColor, (val) => {
                    d.badgeBorderColor = val;
                    d.badgePreset = 'custom';
                    updateBadgePreview();
                    updateCanvasLive();
                }));

                badgeColorCard.querySelectorAll('#badge-presets-container button').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const prId = btn.getAttribute('data-preset');
                        d.badgePreset = prId;
                        const found = currentPresets.find(p => p.id === prId);
                        if (found) {
                            d.badgeBgColor = found.bg;
                            d.badgeTextColor = found.text;
                            d.badgeBorderColor = found.border;
                            if (isShowcase) {
                                if (found.accent) d.accentColor = found.accent;
                                if (found.ptBg) d.pointBgColor = found.ptBg;
                                if (found.ptBorder) d.pointBorderColor = found.ptBorder;
                            }
                        }
                        renderPropertyInspector();
                        updateCanvasLive();
                    });
                });

                form.appendChild(badgeColorCard);
            }

            // Announcement Ribbon / Banner text & buttons
            if (d.text !== undefined) {
                form.appendChild(createTextareaField('Announcement / Banner Text', d.text, (val) => { d.text = val; updateCanvasLive(); }));
            }
            if (d.btnText !== undefined) {
                form.appendChild(createInputField('Ribbon Button Label', d.btnText, (val) => { d.btnText = val; updateCanvasLive(); }));
            }
            if (d.btnUrl !== undefined) {
                form.appendChild(createInputField('Ribbon Button URL', d.btnUrl, (val) => { d.btnUrl = val; updateCanvasLive(); }));
            }

            // Description
            if (d.desc !== undefined && widget.type !== 'mobile_showcase' && widget.type !== 'desktop_showcase') {
                form.appendChild(createTextareaField('Description', d.desc, (val) => { d.desc = val; updateCanvasLive(); }));
            }

            // Primary Button
            if (d.primaryBtnText !== undefined) {
                form.appendChild(createInputField('Primary Button Label', d.primaryBtnText, (val) => { d.primaryBtnText = val; updateCanvasLive(); }));
                form.appendChild(createInputField('Primary Button Link', d.primaryBtnUrl, (val) => { d.primaryBtnUrl = val; updateCanvasLive(); }));
            }

            // Secondary Button
            if (d.secondaryBtnText !== undefined) {
                form.appendChild(createInputField('Secondary Button Label', d.secondaryBtnText, (val) => { d.secondaryBtnText = val; updateCanvasLive(); }));
                form.appendChild(createInputField('Secondary Button Link', d.secondaryBtnUrl, (val) => { d.secondaryBtnUrl = val; updateCanvasLive(); }));
            }

            // Image URL / Upload
            if (d.imageUrl !== undefined && widget.type !== 'desktop_showcase') {
                const imgGroup = document.createElement('div');
                imgGroup.className = 'form-group';
                imgGroup.innerHTML = `
                    <label class="form-label">Screenshot / Image</label>
                    <input type="text" class="form-input mb-1" placeholder="Image URL (e.g. screenshot.png)" value="${escapeHTML(d.imageUrl)}">
                    <div style="display: flex; gap: 8px; margin-top: 6px;">
                        <label class="btn btn-outline" style="font-size: 11px; padding: 5px 10px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                            <i class="fa fa-upload"></i> Upload Image
                            <input type="file" accept="image/*" style="display: none;" id="file-uploader">
                        </label>
                        ${d.imageUrl ? `<button class="btn btn-outline" style="font-size: 11px; padding: 5px 10px; color: #ef4444;" id="btn-clear-img">Remove</button>` : ''}
                    </div>
                `;
                const textInput = imgGroup.querySelector('input[type="text"]');
                textInput.addEventListener('input', (e) => {
                    d.imageUrl = e.target.value;
                    updateCanvasLive();
                });
                const fileInput = imgGroup.querySelector('#file-uploader');
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            d.imageUrl = evt.target.result;
                            textInput.value = '(Embedded Base64 Image)';
                            updateCanvasLive();
                            renderPropertyInspector();
                            showToast('Image uploaded & embedded');
                        };
                        reader.readAsDataURL(file);
                    }
                });
                const clearBtn = imgGroup.querySelector('#btn-clear-img');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        d.imageUrl = '';
                        updateCanvasLive();
                        renderPropertyInspector();
                    });
                }
                form.appendChild(imgGroup);
            }

            // Colors (for widgets other than highlights_grid, stats_counter, mobile_showcase, desktop_showcase, workflow_steps, vs_table, faq_section, and support_banner)
            if (widget.type !== 'highlights_grid' && widget.type !== 'stats_counter' && widget.type !== 'mobile_showcase' && widget.type !== 'desktop_showcase' && widget.type !== 'workflow_steps' && widget.type !== 'vs_table' && widget.type !== 'faq_section' && widget.type !== 'support_banner') {
                if (d.bgColor !== undefined) {
                    form.appendChild(createColorField('Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                }
                if (d.titleColor !== undefined) {
                    form.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                }
                if (d.textColor !== undefined) {
                    form.appendChild(createColorField('Text Color', d.textColor, (val) => { d.textColor = val; updateCanvasLive(); }));
                }
                if (d.accentColor !== undefined) {
                    form.appendChild(createColorField('Accent / Icon Color', d.accentColor, (val) => { d.accentColor = val; updateCanvasLive(); }));
                }
                if (d.cardBgColor !== undefined) {
                    form.appendChild(createColorField('Card Background Color', d.cardBgColor, (val) => { d.cardBgColor = val; updateCanvasLive(); }));
                }
            }

            // Columns selector for other_apps
            if (widget.type === 'other_apps' && d.columns !== undefined) {
                const colGroup = document.createElement('div');
                colGroup.className = 'form-group';
                colGroup.innerHTML = `
                    <label class="form-label">Grid Columns</label>
                    <select class="form-input" style="font-size: 12px; padding: 6px 10px;">
                        <option value="2" ${String(d.columns) === '2' ? 'selected' : ''}>2 Columns (Wide)</option>
                        <option value="3" ${String(d.columns) === '3' ? 'selected' : ''}>3 Columns (Standard - Like App Store)</option>
                        <option value="4" ${String(d.columns) === '4' ? 'selected' : ''}>4 Columns (Compact)</option>
                    </select>
                `;
                colGroup.querySelector('select').addEventListener('change', (e) => {
                    d.columns = e.target.value;
                    updateCanvasLive();
                });
                form.appendChild(colGroup);
            }

            const PRESET_ICONS = [
                { name: 'person', label: '👤 User', html: '<i class="oi" data-icon="person"></i>' },
                { name: 'group', label: '👥 Users / Team', html: '<i class="oi" data-icon="group"></i>' },
                { name: 'search', label: '🔍 Search', html: '<i class="oi" data-icon="search"></i>' },
                { name: 'menu', label: '☰ Menu', html: '<i class="oi" data-icon="menu"></i>' },
                { name: 'dashboard', label: '📊 Dashboard', html: '<i class="oi" data-icon="dashboard"></i>' },
                { name: 'notifications', label: '🔔 Notifications', html: '<i class="oi" data-icon="notifications"></i>' },
                { name: 'notifications_active', label: '🔔 Active Alerts', html: '<i class="oi" data-icon="notifications_active"></i>' },
                { name: 'campaign', label: '📢 Announcement', html: '<i class="oi" data-icon="campaign"></i>' },
                { name: 'chat', label: '💬 Chat', html: '<i class="oi" data-icon="chat"></i>' },
                { name: 'forum', label: '🗨️ Discussion', html: '<i class="oi" data-icon="forum"></i>' },
                { name: 'email', label: '✉️ Email', html: '<i class="oi" data-icon="email"></i>' },
                { name: 'event', label: '📅 Event', html: '<i class="oi" data-icon="event"></i>' },
                { name: 'calendar_month', label: '🗓️ Calendar', html: '<i class="oi" data-icon="calendar_month"></i>' },
                { name: 'task_alt', label: '✅ Completed Task', html: '<i class="oi" data-icon="task_alt"></i>' },
                { name: 'check_circle', label: '✅ Success', html: '<i class="oi" data-icon="check_circle"></i>' },
                { name: 'cancel', label: '❌ Cancel', html: '<i class="oi" data-icon="cancel"></i>' },
                { name: 'delete', label: '🗑️ Delete', html: '<i class="oi" data-icon="delete"></i>' },
                { name: 'edit', label: '✏️ Edit', html: '<i class="oi" data-icon="edit"></i>' },
                { name: 'add', label: '➕ Add', html: '<i class="oi" data-icon="add"></i>' },
                { name: 'close', label: '✖️ Close', html: '<i class="oi" data-icon="close"></i>' },
                { name: 'refresh', label: '🔄 Refresh', html: '<i class="oi" data-icon="refresh"></i>' },
                { name: 'download', label: '⬇️ Download', html: '<i class="oi" data-icon="download"></i>' },
                { name: 'upload', label: '⬆️ Upload', html: '<i class="oi" data-icon="upload"></i>' },
                { name: 'attach_file', label: '📎 Attachment', html: '<i class="oi" data-icon="attach_file"></i>' },
                { name: 'folder', label: '📁 Folder', html: '<i class="oi" data-icon="folder"></i>' },
                { name: 'description', label: '📄 Document', html: '<i class="oi" data-icon="description"></i>' },
                { name: 'business', label: '🏢 Business', html: '<i class="oi" data-icon="business"></i>' },
                { name: 'lock', label: '🔒 Lock', html: '<i class="oi" data-icon="lock"></i>' },
                { name: 'help', label: '❓ Help', html: '<i class="oi" data-icon="help"></i>' },
                { name: 'favorite', label: '❤️ Favorite', html: '<i class="oi" data-icon="favorite"></i>' },
                { name: 'schedule', label: '🕒 Schedule', html: '<i class="oi" data-icon="schedule"></i>' },
                { name: 'progress_activity', label: '⏳ Loading', html: '<i class="oi" data-icon="progress_activity"></i>' }
            ];

            // Dedicated Highlights Grid ("Why Choose This Solution?") Full Custom Inspector
            if (widget.type === 'highlights_grid' && Array.isArray(d.items)) {
                if (d.titleColor === undefined) d.titleColor = '#1e293b';
                if (d.subtitleColor === undefined) d.subtitleColor = '#64748b';
                if (d.columns === undefined) d.columns = 4;
                if (d.accentColor === undefined) d.accentColor = '#714B67';
                if (d.iconBgColor === undefined) d.iconBgColor = 'rgba(113, 75, 103, 0.1)';
                if (d.cardBgColor === undefined) d.cardBgColor = '#ffffff';
                if (d.cardBorderColor === undefined) d.cardBorderColor = '#e2e8f0';

                // Section Title & Subtitle Group
                const secGroup = document.createElement('div');
                secGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                secGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Heading &amp; Colors
                    </div>
                `;
                secGroup.appendChild(createInputField('Section Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                secGroup.appendChild(createTextareaField('Section Subtitle', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Subtitle Color', d.subtitleColor, (val) => { d.subtitleColor = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Section Background Color', d.bgColor || '#ffffff', (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(secGroup);

                // Grid & Card Styling Group
                const styleGroup = document.createElement('div');
                styleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                styleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-th" style="color: var(--primary);"></i> Layout &amp; Card Styling
                    </div>
                    <div class="form-group">
                        <label class="form-label">Grid Columns</label>
                        <select class="form-input" id="hl-columns-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="4" ${parseInt(d.columns) === 4 ? 'selected' : ''}>4 Columns (Default)</option>
                            <option value="3" ${parseInt(d.columns) === 3 ? 'selected' : ''}>3 Columns (Medium)</option>
                            <option value="2" ${parseInt(d.columns) === 2 ? 'selected' : ''}>2 Columns (Wide)</option>
                        </select>
                    </div>
                `;
                const colSel = styleGroup.querySelector('#hl-columns-select');
                colSel.addEventListener('change', (e) => {
                    d.columns = parseInt(e.target.value) || 4;
                    updateCanvasLive();
                });

                styleGroup.appendChild(createColorField('Card Background Color', d.cardBgColor, (val) => { d.cardBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Border Color', d.cardBorderColor, (val) => { d.cardBorderColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Icon / Accent Color', d.accentColor, (val) => { d.accentColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createInputField('Icon Box Background (RGBA / Hex)', d.iconBgColor, (val) => { d.iconBgColor = val; updateCanvasLive(); }));
                form.appendChild(styleGroup);

                // Highlight Cards Manager
                const grp = document.createElement('div');
                grp.className = 'form-group';
                grp.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-list-ul" style="color: var(--primary); margin-right: 4px;"></i> Highlight Cards (${d.items.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-highlight-card" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Card
                        </button>
                    </div>
                    <div class="items-list" id="highlights-items-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-highlight-card-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 7px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Card
                    </button>
                `;

                const list = grp.querySelector('#highlights-items-list');
                d.items.forEach((item, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.03);';
                    
                    const curIcon = (item.icon || '').toLowerCase().trim();
                    const presetBtns = PRESET_ICONS.map(p => {
                        const isSel = curIcon === p.html.toLowerCase() ||
                                      curIcon === p.name ||
                                      curIcon.includes(`data-icon="${p.name}"`) ||
                                      curIcon.includes(`data-icon='${p.name}'`);
                        return `
                            <button type="button" class="icon-preset-btn" data-icon='${escapeHTML(p.html)}' data-name="${p.name}" data-search="${p.name} ${p.label.toLowerCase()}" title="${p.label}" style="font-size: 11px; padding: 6px 8px; border: 1px solid ${isSel ? 'var(--primary)' : '#e2e8f0'}; border-radius: 6px; background: ${isSel ? '#f5eff4' : '#ffffff'}; color: ${isSel ? 'var(--primary)' : '#334155'}; cursor: pointer; font-weight: ${isSel ? '700' : '500'}; display: flex; align-items: center; gap: 6px; text-align: left; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02); transition: all 0.15s ease;">
                                <span style="font-size: 16px; display: inline-flex; align-items: center; justify-content: center; width: 20px; color: ${isSel ? 'var(--primary)' : '#00A09D'}; flex-shrink: 0;">
                                    ${p.html}
                                </span>
                                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px;">${p.label}</span>
                            </button>
                        `;
                    }).join('');

                    itemBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 11px; font-weight: 800; color: var(--primary);">Card #${idx + 1}</span>
                            <div style="display: flex; gap: 4px; align-items: center;">
                                <button type="button" class="toolbar-btn btn-hl-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-hl-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.items.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-hl-del" title="Delete Card" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>

                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Card Title</label>
                            <input type="text" class="form-input card-title-input" value="${escapeHTML(item.title || '')}" placeholder="Highlight Title" style="font-size: 12px; padding: 5px 8px;">
                        </div>

                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Card Description</label>
                            <textarea class="form-textarea card-desc-input" placeholder="Highlight Description" style="font-size: 12px; padding: 5px 8px; min-height: 48px;">${escapeHTML(item.desc || '')}</textarea>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-top: 8px;">
                            <label style="font-size: 11px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="display: flex; align-items: center; gap: 5px;">
                                    <i class="oi" data-icon="star" style="color: var(--primary); font-size: 14px;"></i> Icon Selection
                                </span>
                                <span class="hl-icon-preview-box" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: ${d.iconBgColor || 'rgba(113,75,103,0.1)'}; color: ${d.accentColor || '#714B67'}; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-size: 20px;">
                                    ${item.iconUrl ? `<img src="${item.iconUrl}" style="width: 20px; height: 20px; object-fit: contain;">` : renderSafeIcon(item.icon, '<i class="oi" data-icon="task_alt"></i>')}
                                </span>
                            </label>

                            <div style="margin-bottom: 6px;">
                                <input type="text" class="form-input icon-search-input" placeholder="🔍 Search icons (e.g. user, task, mail, date)..." style="font-size: 11px; padding: 5px 8px; width: 100%; border-radius: 6px;">
                            </div>

                            <div class="preset-icons-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; max-height: 190px; overflow-y: auto; padding: 4px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px;">
                                ${presetBtns}
                            </div>

                            <div style="margin-bottom: 6px;">
                                <label style="font-size: 9px; color: var(--text-muted); display: block; margin-bottom: 2px;">Odoo Icon Tag / Class</label>
                                <input type="text" class="form-input card-icon-input" value="${escapeHTML(item.icon || '<i class=\"oi\" data-icon=\"task_alt\"></i>')}" placeholder='<i class="oi" data-icon="person"></i>' style="font-size: 11px; padding: 4px 8px; font-family: monospace;">
                            </div>

                            <div>
                                <label style="font-size: 9px; color: var(--text-muted); display: block; margin-bottom: 2px;">Custom Image (URL or Upload)</label>
                                <input type="text" class="form-input card-icon-url-input" value="${escapeHTML(item.iconUrl || '')}" placeholder="Image URL (e.g. /my_icon.png)" style="font-size: 11px; padding: 4px 8px; margin-bottom: 4px;">
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <label class="btn btn-outline" style="font-size: 10px; padding: 3px 8px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                                        <i class="fa fa-upload"></i> Upload Image
                                        <input type="file" accept="image/*" class="card-file-uploader" style="display: none;">
                                    </label>
                                    ${item.iconUrl ? `<button type="button" class="btn btn-outline btn-clear-card-img" style="font-size: 10px; padding: 3px 8px; color: #ef4444; border-color: #fca5a5;">Remove Image</button>` : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    // Listeners for item
                    const titleInput = itemBox.querySelector('.card-title-input');
                    titleInput.addEventListener('input', (e) => {
                        item.title = e.target.value;
                        updateCanvasLive();
                    });

                    const descInput = itemBox.querySelector('.card-desc-input');
                    descInput.addEventListener('input', (e) => {
                        item.desc = e.target.value;
                        updateCanvasLive();
                    });

                    const iconInput = itemBox.querySelector('.card-icon-input');
                    iconInput.addEventListener('input', (e) => {
                        item.icon = e.target.value;
                        updateCanvasLive();
                        updateCardIconPreview();
                    });

                    const iconUrlInput = itemBox.querySelector('.card-icon-url-input');
                    iconUrlInput.addEventListener('input', (e) => {
                        item.iconUrl = e.target.value;
                        updateCanvasLive();
                        updateCardIconPreview();
                    });

                    const fileUploader = itemBox.querySelector('.card-file-uploader');
                    if (fileUploader) {
                        fileUploader.addEventListener('change', (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                    item.iconUrl = evt.target.result;
                                    iconUrlInput.value = '(Embedded Icon Image)';
                                    updateCanvasLive();
                                    renderPropertyInspector();
                                    showToast('Icon uploaded successfully!');
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    }

                    const clearImgBtn = itemBox.querySelector('.btn-clear-card-img');
                    if (clearImgBtn) {
                        clearImgBtn.addEventListener('click', () => {
                            item.iconUrl = '';
                            updateCanvasLive();
                            renderPropertyInspector();
                        });
                    }

                    function updateCardIconPreview() {
                        const previewBox = itemBox.querySelector('.hl-icon-preview-box');
                        if (previewBox) {
                            if (item.iconUrl) {
                                previewBox.innerHTML = `<img src="${item.iconUrl}" style="width: 20px; height: 20px; object-fit: contain;">`;
                            } else {
                                previewBox.innerHTML = renderSafeIcon(item.icon, '<i class="oi" data-icon="task_alt"></i>');
                            }
                        }
                    }

                    const searchInput = itemBox.querySelector('.icon-search-input');
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            const query = e.target.value.toLowerCase().trim();
                            itemBox.querySelectorAll('.icon-preset-btn').forEach(btn => {
                                const searchData = (btn.getAttribute('data-search') || '').toLowerCase();
                                if (!query || searchData.includes(query)) {
                                    btn.style.display = 'flex';
                                } else {
                                    btn.style.display = 'none';
                                }
                            });
                        });
                    }

                    itemBox.querySelectorAll('.icon-preset-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const selectedIcon = btn.getAttribute('data-icon');
                            item.icon = selectedIcon;
                            item.iconUrl = '';
                            iconInput.value = selectedIcon;
                            iconUrlInput.value = '';
                            itemBox.querySelectorAll('.icon-preset-btn').forEach(b => {
                                b.style.borderColor = '#e2e8f0';
                                b.style.background = '#ffffff';
                                b.style.color = '#334155';
                                b.style.fontWeight = '500';
                                const s = b.querySelector('span:first-child');
                                if (s) s.style.color = '#00A09D';
                            });
                            btn.style.borderColor = 'var(--primary)';
                            btn.style.background = '#f5eff4';
                            btn.style.color = 'var(--primary)';
                            btn.style.fontWeight = '700';
                            const selSpan = btn.querySelector('span:first-child');
                            if (selSpan) selSpan.style.color = 'var(--primary)';
                            updateCanvasLive();
                            updateCardIconPreview();
                        });
                    });

                    const upBtn = itemBox.querySelector('.btn-hl-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const temp = d.items[idx];
                            d.items[idx] = d.items[idx - 1];
                            d.items[idx - 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const downBtn = itemBox.querySelector('.btn-hl-down');
                    if (downBtn && idx < d.items.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const temp = d.items[idx];
                            d.items[idx] = d.items[idx + 1];
                            d.items[idx + 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const delBtn = itemBox.querySelector('.btn-hl-del');
                    delBtn.addEventListener('click', () => {
                        d.items.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    list.appendChild(itemBox);
                });

                const addCardFn = () => {
                    d.items.push({
                        title: 'New Benefit',
                        desc: 'Describe why this feature provides great business value to the client.',
                        icon: 'fa fa-star',
                        iconUrl: '',
                        titleColor: '#1e293b',
                        descColor: '#64748b'
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                };

                grp.querySelector('#btn-add-highlight-card').addEventListener('click', addCardFn);
                grp.querySelector('#btn-add-highlight-card-bottom').addEventListener('click', addCardFn);

                form.appendChild(grp);
            }

            // Dedicated Stats Banner ("Stats Banner") Full Custom Inspector
            if (widget.type === 'stats_counter' && Array.isArray(d.stats)) {
                if (d.title === undefined) d.title = '';
                if (d.titleColor === undefined) d.titleColor = '#1e293b';
                if (d.subtitle === undefined) d.subtitle = '';
                if (d.subtitleColor === undefined) d.subtitleColor = '#64748b';
                if (d.columns === undefined) d.columns = 3;
                if (d.bgColor === undefined) d.bgColor = '#f8fafc';
                if (d.cardBgColor === undefined) d.cardBgColor = '#ffffff';
                if (d.cardBorderColor === undefined) d.cardBorderColor = '#e2e8f0';
                if (d.accentColor === undefined) d.accentColor = '#714B67';
                if (d.iconBgColor === undefined) d.iconBgColor = '#f5efff';
                if (d.numberColor === undefined) d.numberColor = '#714B67';
                if (d.labelColor === undefined) d.labelColor = '#64748b';

                // Section Title & Subtitle Group
                const secGroup = document.createElement('div');
                secGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                secGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Heading &amp; Background
                    </div>
                `;
                secGroup.appendChild(createInputField('Section Title (Optional)', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                secGroup.appendChild(createTextareaField('Section Subtitle (Optional)', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Subtitle Color', d.subtitleColor, (val) => { d.subtitleColor = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Section Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(secGroup);

                // Grid & Card Styling Group
                const styleGroup = document.createElement('div');
                styleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                styleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-sliders" style="color: var(--primary);"></i> Layout &amp; Card Styling
                    </div>
                    <div class="form-group">
                        <label class="form-label">Grid Columns</label>
                        <select class="form-input" id="stats-columns-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="3" ${parseInt(d.columns) === 3 ? 'selected' : ''}>3 Columns (Standard)</option>
                            <option value="4" ${parseInt(d.columns) === 4 ? 'selected' : ''}>4 Columns (Compact)</option>
                            <option value="2" ${parseInt(d.columns) === 2 ? 'selected' : ''}>2 Columns (Wide)</option>
                        </select>
                    </div>
                `;
                const colSel = styleGroup.querySelector('#stats-columns-select');
                colSel.addEventListener('change', (e) => {
                    d.columns = parseInt(e.target.value) || 3;
                    updateCanvasLive();
                });

                styleGroup.appendChild(createColorField('Card Background Color', d.cardBgColor, (val) => { d.cardBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Border Color', d.cardBorderColor, (val) => { d.cardBorderColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Icon Color', d.accentColor, (val) => { d.accentColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createInputField('Icon Box Background (Hex / RGBA)', d.iconBgColor, (val) => { d.iconBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Default Number Color', d.numberColor, (val) => { d.numberColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Default Label Color', d.labelColor, (val) => { d.labelColor = val; updateCanvasLive(); }));
                form.appendChild(styleGroup);

                // Stats Counters Manager
                const grp = document.createElement('div');
                grp.className = 'form-group';
                grp.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-tachometer" style="color: var(--primary); margin-right: 4px;"></i> Stat Counters (${d.stats.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-stat-card" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Counter
                        </button>
                    </div>
                    <div class="items-list" id="stats-items-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-stat-card-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 7px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Counter
                    </button>
                `;

                const list = grp.querySelector('#stats-items-list');
                d.stats.forEach((item, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.03);';

                    const curIcon = (item.icon || '').toLowerCase().trim();
                    const presetBtns = PRESET_ICONS.map(p => {
                        const isSel = curIcon === p.html.toLowerCase() ||
                                      curIcon === p.name ||
                                      curIcon.includes(`data-icon="${p.name}"`) ||
                                      curIcon.includes(`data-icon='${p.name}'`);
                        return `
                            <button type="button" class="icon-preset-btn" data-icon='${escapeHTML(p.html)}' data-name="${p.name}" data-search="${p.name} ${p.label.toLowerCase()}" title="${p.label}" style="font-size: 11px; padding: 6px 8px; border: 1px solid ${isSel ? 'var(--primary)' : '#e2e8f0'}; border-radius: 6px; background: ${isSel ? '#f5eff4' : '#ffffff'}; color: ${isSel ? 'var(--primary)' : '#334155'}; cursor: pointer; font-weight: ${isSel ? '700' : '500'}; display: flex; align-items: center; gap: 6px; text-align: left; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02); transition: all 0.15s ease;">
                                <span style="font-size: 16px; display: inline-flex; align-items: center; justify-content: center; width: 20px; color: ${isSel ? 'var(--primary)' : '#00A09D'}; flex-shrink: 0;">
                                    ${p.html}
                                </span>
                                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px;">${p.label}</span>
                            </button>
                        `;
                    }).join('');

                    itemBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 11px; font-weight: 800; color: var(--primary);">Counter #${idx + 1}</span>
                            <div style="display: flex; gap: 4px; align-items: center;">
                                <button type="button" class="toolbar-btn btn-st-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-st-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.stats.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-st-del" title="Delete Counter" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>

                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Value / Metric (e.g. 99.9%, 10,000+, 24/7)</label>
                            <input type="text" class="form-input stat-number-input" value="${escapeHTML(item.number || '')}" placeholder="99.9%" style="font-size: 13px; font-weight: 700; padding: 6px 8px;">
                        </div>

                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Label / Description (e.g. Active Users, Uptime)</label>
                            <input type="text" class="form-input stat-label-input" value="${escapeHTML(item.label || '')}" placeholder="Active Users" style="font-size: 12px; padding: 5px 8px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Number Color</label>
                                <input type="color" class="stat-num-color-input" value="${item.numberColor || d.numberColor || '#714B67'}" style="width: 100%; height: 32px; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer; padding: 2px;">
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Label Color</label>
                                <input type="color" class="stat-lbl-color-input" value="${item.labelColor || d.labelColor || '#64748b'}" style="width: 100%; height: 32px; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer; padding: 2px;">
                            </div>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-top: 8px;">
                            <label style="font-size: 11px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="display: flex; align-items: center; gap: 5px;">
                                    <i class="oi" data-icon="star" style="color: var(--primary); font-size: 14px;"></i> Icon Selection
                                </span>
                                <span class="st-icon-preview-box" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: ${d.iconBgColor || '#f5efff'}; color: ${d.accentColor || '#714B67'}; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-size: 20px;">
                                    ${item.iconUrl ? `<img src="${item.iconUrl}" style="width: 20px; height: 20px; object-fit: contain;">` : renderSafeIcon(item.icon, '<i class="oi" data-icon="task_alt"></i>')}
                                </span>
                            </label>

                            <div style="margin-bottom: 6px;">
                                <input type="text" class="form-input icon-search-input" placeholder="🔍 Search icons (e.g. user, task, mail, date)..." style="font-size: 11px; padding: 5px 8px; width: 100%; border-radius: 6px;">
                            </div>

                            <div class="preset-icons-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; max-height: 190px; overflow-y: auto; padding: 4px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px;">
                                ${presetBtns}
                            </div>

                            <div style="margin-bottom: 6px;">
                                <label style="font-size: 9px; color: var(--text-muted); display: block; margin-bottom: 2px;">Odoo Icon Tag / Class</label>
                                <input type="text" class="form-input card-icon-input" value="${escapeHTML(item.icon || '<i class=\"oi\" data-icon=\"task_alt\"></i>')}" placeholder='<i class="oi" data-icon="task_alt"></i>' style="font-size: 11px; padding: 4px 8px; font-family: monospace;">
                            </div>

                            <div>
                                <label style="font-size: 9px; color: var(--text-muted); display: block; margin-bottom: 2px;">Custom Image (URL or Upload)</label>
                                <input type="text" class="form-input card-icon-url-input" value="${escapeHTML(item.iconUrl || '')}" placeholder="Image URL (e.g. /my_icon.png)" style="font-size: 11px; padding: 4px 8px; margin-bottom: 4px;">
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <label class="btn btn-outline" style="font-size: 10px; padding: 3px 8px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                                        <i class="fa fa-upload"></i> Upload Image
                                        <input type="file" accept="image/*" class="card-file-uploader" style="display: none;">
                                    </label>
                                    ${item.iconUrl ? `<button type="button" class="btn btn-outline btn-clear-card-img" style="font-size: 10px; padding: 3px 8px; color: #ef4444; border-color: #fca5a5;">Remove Image</button>` : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    // Listeners for stat card
                    const numInput = itemBox.querySelector('.stat-number-input');
                    numInput.addEventListener('input', (e) => {
                        item.number = e.target.value;
                        updateCanvasLive();
                    });

                    const lblInput = itemBox.querySelector('.stat-label-input');
                    lblInput.addEventListener('input', (e) => {
                        item.label = e.target.value;
                        updateCanvasLive();
                    });

                    const numColInput = itemBox.querySelector('.stat-num-color-input');
                    numColInput.addEventListener('input', (e) => {
                        item.numberColor = e.target.value;
                        updateCanvasLive();
                    });

                    const lblColInput = itemBox.querySelector('.stat-lbl-color-input');
                    lblColInput.addEventListener('input', (e) => {
                        item.labelColor = e.target.value;
                        updateCanvasLive();
                    });

                    const iconInput = itemBox.querySelector('.card-icon-input');
                    iconInput.addEventListener('input', (e) => {
                        item.icon = e.target.value;
                        updateCanvasLive();
                        updateCardIconPreview();
                    });

                    const iconUrlInput = itemBox.querySelector('.card-icon-url-input');
                    iconUrlInput.addEventListener('input', (e) => {
                        item.iconUrl = e.target.value;
                        updateCanvasLive();
                        updateCardIconPreview();
                    });

                    const fileUploader = itemBox.querySelector('.card-file-uploader');
                    if (fileUploader) {
                        fileUploader.addEventListener('change', (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                    item.iconUrl = evt.target.result;
                                    iconUrlInput.value = '(Embedded Icon Image)';
                                    updateCanvasLive();
                                    renderPropertyInspector();
                                    showToast('Icon uploaded successfully!');
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    }

                    const clearImgBtn = itemBox.querySelector('.btn-clear-card-img');
                    if (clearImgBtn) {
                        clearImgBtn.addEventListener('click', () => {
                            item.iconUrl = '';
                            updateCanvasLive();
                            renderPropertyInspector();
                        });
                    }

                    function updateCardIconPreview() {
                        const previewBox = itemBox.querySelector('.st-icon-preview-box');
                        if (previewBox) {
                            if (item.iconUrl) {
                                previewBox.innerHTML = `<img src="${item.iconUrl}" style="width: 20px; height: 20px; object-fit: contain;">`;
                            } else {
                                previewBox.innerHTML = renderSafeIcon(item.icon, '<i class="oi" data-icon="task_alt"></i>');
                            }
                        }
                    }

                    const searchInput = itemBox.querySelector('.icon-search-input');
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            const query = e.target.value.toLowerCase().trim();
                            itemBox.querySelectorAll('.icon-preset-btn').forEach(btn => {
                                const searchData = (btn.getAttribute('data-search') || '').toLowerCase();
                                if (!query || searchData.includes(query)) {
                                    btn.style.display = 'flex';
                                } else {
                                    btn.style.display = 'none';
                                }
                            });
                        });
                    }

                    itemBox.querySelectorAll('.icon-preset-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const selectedIcon = btn.getAttribute('data-icon');
                            item.icon = selectedIcon;
                            item.iconUrl = '';
                            iconInput.value = selectedIcon;
                            iconUrlInput.value = '';
                            itemBox.querySelectorAll('.icon-preset-btn').forEach(b => {
                                b.style.borderColor = '#e2e8f0';
                                b.style.background = '#ffffff';
                                b.style.color = '#334155';
                                b.style.fontWeight = '500';
                                const s = b.querySelector('span:first-child');
                                if (s) s.style.color = '#00A09D';
                            });
                            btn.style.borderColor = 'var(--primary)';
                            btn.style.background = '#f5eff4';
                            btn.style.color = 'var(--primary)';
                            btn.style.fontWeight = '700';
                            const selSpan = btn.querySelector('span:first-child');
                            if (selSpan) selSpan.style.color = 'var(--primary)';
                            updateCanvasLive();
                            updateCardIconPreview();
                        });
                    });

                    const upBtn = itemBox.querySelector('.btn-st-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const temp = d.stats[idx];
                            d.stats[idx] = d.stats[idx - 1];
                            d.stats[idx - 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const downBtn = itemBox.querySelector('.btn-st-down');
                    if (downBtn && idx < d.stats.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const temp = d.stats[idx];
                            d.stats[idx] = d.stats[idx + 1];
                            d.stats[idx + 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const delBtn = itemBox.querySelector('.btn-st-del');
                    delBtn.addEventListener('click', () => {
                        d.stats.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    list.appendChild(itemBox);
                });

                const addStatFn = () => {
                    d.stats.push({
                        number: '100%',
                        label: 'Customer Satisfaction',
                        icon: '<i class="oi" data-icon="task_alt"></i>',
                        iconUrl: '',
                        numberColor: d.numberColor || '#714B67',
                        labelColor: d.labelColor || '#64748b'
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                };

                grp.querySelector('#btn-add-stat-card').addEventListener('click', addStatFn);
                grp.querySelector('#btn-add-stat-card-bottom').addEventListener('click', addStatFn);

                form.appendChild(grp);
            }

            // Dedicated Workflow Steps ("3-Step How It Works") Full Custom Inspector
            if (widget.type === 'workflow_steps' && Array.isArray(d.steps)) {
                if (d.title === undefined) d.title = 'How It Works in 3 Simple Steps';
                if (d.titleColor === undefined) d.titleColor = '#1e293b';
                if (d.subtitle === undefined) d.subtitle = 'Quick and hassle-free onboarding for your team';
                if (d.subtitleColor === undefined) d.subtitleColor = '#64748b';
                if (d.bgColor === undefined) d.bgColor = '#f8fafc';
                if (d.cardBgColor === undefined) d.cardBgColor = '#ffffff';
                if (d.cardBorderColor === undefined) d.cardBorderColor = '#e2e8f0';
                if (d.cardTitleColor === undefined) d.cardTitleColor = '#1e293b';
                if (d.cardDescColor === undefined) d.cardDescColor = '#64748b';
                if (d.badgeBgColor === undefined) d.badgeBgColor = '#714B67';
                if (d.badgeTextColor === undefined) d.badgeTextColor = '#ffffff';
                if (d.accentColor === undefined) d.accentColor = '#00A09D';
                if (d.iconBgColor === undefined) d.iconBgColor = '#e6f6f6';
                if (d.columns === undefined) d.columns = 3;
                if (d.align === undefined) d.align = 'center';

                // Section Title & Subtitle Group
                const secGroup = document.createElement('div');
                secGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                secGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Heading &amp; Background
                    </div>
                `;
                secGroup.appendChild(createInputField('Section Title (Optional)', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                secGroup.appendChild(createTextareaField('Section Subtitle (Optional)', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Subtitle Color', d.subtitleColor, (val) => { d.subtitleColor = val; updateCanvasLive(); }));
                secGroup.appendChild(createColorField('Section Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(secGroup);

                // Grid & Card Styling Group
                const styleGroup = document.createElement('div');
                styleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                styleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-sliders" style="color: var(--primary);"></i> Layout &amp; Card Styling
                    </div>
                    <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                        <div>
                            <label class="form-label" style="font-size: 11px; margin-bottom: 4px;">Grid Columns</label>
                            <select class="form-input" id="wf-columns-select" style="font-size: 12px; padding: 6px 10px;">
                                <option value="3" ${parseInt(d.columns) === 3 ? 'selected' : ''}>3 Columns (Standard)</option>
                                <option value="4" ${parseInt(d.columns) === 4 ? 'selected' : ''}>4 Columns (Compact)</option>
                                <option value="2" ${parseInt(d.columns) === 2 ? 'selected' : ''}>2 Columns (Wide)</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label" style="font-size: 11px; margin-bottom: 4px;">Card Alignment</label>
                            <select class="form-input" id="wf-align-select" style="font-size: 12px; padding: 6px 10px;">
                                <option value="center" ${d.align === 'center' ? 'selected' : ''}>Centered (Default)</option>
                                <option value="left" ${d.align === 'left' ? 'selected' : ''}>Left-Aligned</option>
                            </select>
                        </div>
                    </div>
                `;
                const colSel = styleGroup.querySelector('#wf-columns-select');
                colSel.addEventListener('change', (e) => {
                    d.columns = parseInt(e.target.value) || 3;
                    updateCanvasLive();
                });
                const alignSel = styleGroup.querySelector('#wf-align-select');
                alignSel.addEventListener('change', (e) => {
                    d.align = e.target.value;
                    updateCanvasLive();
                });

                styleGroup.appendChild(createColorField('Step Number Badge Color', d.badgeBgColor, (val) => { d.badgeBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Step Number Text Color', d.badgeTextColor, (val) => { d.badgeTextColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Background Color', d.cardBgColor, (val) => { d.cardBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Border Color', d.cardBorderColor, (val) => { d.cardBorderColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Title Color', d.cardTitleColor, (val) => { d.cardTitleColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Description Color', d.cardDescColor, (val) => { d.cardDescColor = val; updateCanvasLive(); }));
                form.appendChild(styleGroup);

                // Steps Manager
                const grp = document.createElement('div');
                grp.className = 'form-group';
                grp.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-list-ol" style="color: var(--primary); margin-right: 4px;"></i> Step Cards (${d.steps.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-step-card" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Step
                        </button>
                    </div>
                    <div class="items-list" id="workflow-steps-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-step-card-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 7px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Step
                    </button>
                `;

                const list = grp.querySelector('#workflow-steps-list');
                d.steps.forEach((step, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.03);';

                    itemBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 11px; font-weight: 800; color: var(--primary);">Step #${idx + 1}</span>
                            <div style="display: flex; gap: 4px; align-items: center;">
                                <button type="button" class="toolbar-btn btn-wf-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-wf-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.steps.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-wf-del" title="Delete Step" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 90px 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Step # / Tag</label>
                                <input type="text" class="form-input wf-num-input" value="${escapeHTML(step.num !== undefined ? step.num : String(idx + 1))}" placeholder="1" style="font-size: 12px; font-weight: 700; padding: 6px 8px; text-align: center;">
                            </div>
                            <div>
                                <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Step Title</label>
                                <input type="text" class="form-input wf-title-input" value="${escapeHTML(step.title || '')}" placeholder="Step Title" style="font-size: 12px; font-weight: 600; padding: 6px 8px;">
                            </div>
                        </div>

                        <div>
                            <label style="font-size: 10px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Step Description</label>
                            <textarea class="form-input wf-desc-input" rows="2" placeholder="Brief description of this step..." style="font-size: 12px; padding: 6px 8px; width: 100%; resize: vertical;">${escapeHTML(step.desc || '')}</textarea>
                        </div>
                    `;

                    // Listeners for step card
                    const numInput = itemBox.querySelector('.wf-num-input');
                    numInput.addEventListener('input', (e) => {
                        step.num = e.target.value;
                        updateCanvasLive();
                    });

                    const titleInput = itemBox.querySelector('.wf-title-input');
                    titleInput.addEventListener('input', (e) => {
                        step.title = e.target.value;
                        updateCanvasLive();
                    });

                    const descInput = itemBox.querySelector('.wf-desc-input');
                    descInput.addEventListener('input', (e) => {
                        step.desc = e.target.value;
                        updateCanvasLive();
                    });

                    const upBtn = itemBox.querySelector('.btn-wf-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const temp = d.steps[idx];
                            d.steps[idx] = d.steps[idx - 1];
                            d.steps[idx - 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const downBtn = itemBox.querySelector('.btn-wf-down');
                    if (downBtn && idx < d.steps.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const temp = d.steps[idx];
                            d.steps[idx] = d.steps[idx + 1];
                            d.steps[idx + 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const delBtn = itemBox.querySelector('.btn-wf-del');
                    delBtn.addEventListener('click', () => {
                        d.steps.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    list.appendChild(itemBox);
                });

                const addStepFn = () => {
                    const nextNum = String(d.steps.length + 1);
                    d.steps.push({
                        num: nextNum,
                        title: `Step ${nextNum} Title`,
                        desc: 'Add clear instructions or summary for this onboarding step.'
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                };

                grp.querySelector('#btn-add-step-card').addEventListener('click', addStepFn);
                grp.querySelector('#btn-add-step-card-bottom').addEventListener('click', addStepFn);

                form.appendChild(grp);
            }

            // Dedicated Mobile Showcase Full Custom Inspector
            if (widget.type === 'mobile_showcase') {
                if (d.badgeNumber === undefined) d.badgeNumber = '03';
                if (d.badgeText === undefined) d.badgeText = 'Conversation';
                if (d.title === undefined) d.title = 'Real-Time Direct Conversation';
                if (d.desc === undefined) d.desc = 'Enjoy smooth, real-time messaging with instant message delivery, attachment previews, and one-tap voice/video calling buttons.';
                if (d.layoutPosition === undefined) d.layoutPosition = 'image_left';
                if (d.imageCount === undefined) d.imageCount = '2';
                if (d.image1Url === undefined) d.image1Url = '';
                if (d.image2Url === undefined) d.image2Url = '';
                if (d.image1Caption === undefined) d.image1Caption = '';
                if (d.image2Caption === undefined) d.image2Caption = '';
                if (!Array.isArray(d.points)) d.points = [
                    'Instant text messaging and message history loading',
                    'Media, image, and document attachment support',
                    'Direct header buttons for audio and video calls'
                ];
                if (d.bgColor === undefined) d.bgColor = '#ffffff';
                if (d.accentColor === undefined) d.accentColor = '#007bff';
                if (d.badgeBgColor === undefined) d.badgeBgColor = '#007bff';
                if (d.badgeTextColor === undefined) d.badgeTextColor = '#ffffff';
                if (d.titleColor === undefined) d.titleColor = '#1e293b';
                if (d.descColor === undefined) d.descColor = '#64748b';
                if (d.pointBgColor === undefined) d.pointBgColor = '#f0f7ff';
                if (d.pointBorderColor === undefined) d.pointBorderColor = '#d0e4ff';
                if (d.pointTextColor === undefined) d.pointTextColor = '#1e293b';
                if (d.frameColor === undefined) d.frameColor = '#1e293b';

                // 1. Header & Step Count Group
                const badgeGroup = document.createElement('div');
                badgeGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                badgeGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-tag" style="color: var(--primary);"></i> Count Badge &amp; Category Tag Text
                    </div>
                `;
                badgeGroup.appendChild(createInputField('Count Number (e.g. 01, 02, 03)', d.badgeNumber, (val) => { 
                    d.badgeNumber = val; 
                    const prev = document.getElementById('badge-chip-live-preview');
                    if (prev) prev.innerText = val || '01';
                    updateCanvasLive(); 
                }));
                badgeGroup.appendChild(createInputField('Category / Tag Text (e.g. Conversation)', d.badgeText, (val) => { 
                    d.badgeText = val; 
                    const catPrev = document.getElementById('badge-chip-category-preview');
                    if (catPrev) catPrev.innerText = val || '';
                    updateCanvasLive(); 
                }));
                form.appendChild(badgeGroup);

                // 2. Title & Short Description Group
                const titleGroup = document.createElement('div');
                titleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                titleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Title &amp; Description
                    </div>
                `;
                titleGroup.appendChild(createInputField('Heading Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                titleGroup.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                titleGroup.appendChild(createTextareaField('Short Description (Max 2 lines)', d.desc, (val) => { d.desc = val; updateCanvasLive(); }));
                titleGroup.appendChild(createColorField('Description Color', d.descColor, (val) => { d.descColor = val; updateCanvasLive(); }));
                titleGroup.appendChild(createColorField('Section Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(titleGroup);

                // 3. Layout & Mobile Frame Position Group
                const layoutGroup = document.createElement('div');
                layoutGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                layoutGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-columns" style="color: var(--primary);"></i> Layout &amp; Phone Display
                    </div>
                    <div class="form-group">
                        <label class="form-label">Position / Alignment</label>
                        <select class="form-input" id="ms-layout-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="image_left" ${d.layoutPosition === 'image_left' ? 'selected' : ''}>Mobile Left, Points Right (Default)</option>
                            <option value="image_right" ${d.layoutPosition === 'image_right' ? 'selected' : ''}>Points Left, Mobile Right</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Number of Mobile Screens</label>
                        <select class="form-input" id="ms-count-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="2" ${String(d.imageCount) === '2' ? 'selected' : ''}>Dual Phones (2 Screenshots Side-by-Side)</option>
                            <option value="1" ${String(d.imageCount) === '1' ? 'selected' : ''}>Single Phone (1 Centered Screenshot)</option>
                        </select>
                    </div>
                `;
                layoutGroup.querySelector('#ms-layout-select').addEventListener('change', (e) => {
                    d.layoutPosition = e.target.value;
                    updateCanvasLive();
                });
                layoutGroup.querySelector('#ms-count-select').addEventListener('change', (e) => {
                    d.imageCount = e.target.value;
                    updateCanvasLive();
                    renderPropertyInspector();
                });
                layoutGroup.appendChild(createColorField('Phone Frame Bezel Color', d.frameColor, (val) => { d.frameColor = val; updateCanvasLive(); }));
                form.appendChild(layoutGroup);

                // 4. Mobile Images Manager
                const imagesGroup = document.createElement('div');
                imagesGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                imagesGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-mobile" style="color: var(--primary); font-size: 16px;"></i> Mobile Screenshots (${String(d.imageCount) === '2' ? '2 Phones' : '1 Phone'})
                    </div>
                    
                    <!-- Phone 1 -->
                    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; margin-bottom: 10px;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Phone 1 Screenshot ${String(d.imageCount) === '2' ? '(Left Phone)' : ''}</label>
                        <input type="text" class="form-input mb-1" id="ms-img1-input" placeholder="Image URL / Path..." value="${escapeHTML(d.image1Url)}" style="font-size: 12px; padding: 5px 8px;">
                        <div style="display: flex; gap: 6px; margin-top: 6px; margin-bottom: 6px;">
                            <label class="btn btn-outline" style="font-size: 10px; padding: 4px 8px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                                <i class="fa fa-upload"></i> Upload Image
                                <input type="file" accept="image/*" id="ms-file1-uploader" style="display: none;">
                            </label>
                            ${d.image1Url ? `<button type="button" class="btn btn-outline" id="btn-clear-ms-img1" style="font-size: 10px; padding: 4px 8px; color: #ef4444; border-color: #fca5a5;">Remove</button>` : ''}
                        </div>
                        <input type="text" class="form-input" id="ms-cap1-input" placeholder="Optional caption (e.g. Light Theme)" value="${escapeHTML(d.image1Caption)}" style="font-size: 11px; padding: 4px 8px;">
                    </div>

                    <!-- Phone 2 (if dual) -->
                    ${String(d.imageCount) === '2' ? `
                    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Phone 2 Screenshot (Right Phone)</label>
                        <input type="text" class="form-input mb-1" id="ms-img2-input" placeholder="Image URL / Path..." value="${escapeHTML(d.image2Url)}" style="font-size: 12px; padding: 5px 8px;">
                        <div style="display: flex; gap: 6px; margin-top: 6px; margin-bottom: 6px;">
                            <label class="btn btn-outline" style="font-size: 10px; padding: 4px 8px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                                <i class="fa fa-upload"></i> Upload Image
                                <input type="file" accept="image/*" id="ms-file2-uploader" style="display: none;">
                            </label>
                            ${d.image2Url ? `<button type="button" class="btn btn-outline" id="btn-clear-ms-img2" style="font-size: 10px; padding: 4px 8px; color: #ef4444; border-color: #fca5a5;">Remove</button>` : ''}
                        </div>
                        <input type="text" class="form-input" id="ms-cap2-input" placeholder="Optional caption (e.g. Dark Theme)" value="${escapeHTML(d.image2Caption)}" style="font-size: 11px; padding: 4px 8px;">
                    </div>` : ''}
                `;

                const img1Inp = imagesGroup.querySelector('#ms-img1-input');
                img1Inp.addEventListener('input', (e) => { d.image1Url = e.target.value; updateCanvasLive(); });
                const cap1Inp = imagesGroup.querySelector('#ms-cap1-input');
                cap1Inp.addEventListener('input', (e) => { d.image1Caption = e.target.value; updateCanvasLive(); });

                const file1 = imagesGroup.querySelector('#ms-file1-uploader');
                if (file1) {
                    file1.addEventListener('change', (e) => {
                        const f = e.target.files[0];
                        if (f) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                                d.image1Url = evt.target.result;
                                img1Inp.value = '(Embedded Image)';
                                updateCanvasLive();
                                renderPropertyInspector();
                                showToast('Phone 1 Image uploaded!');
                            };
                            reader.readAsDataURL(f);
                        }
                    });
                }
                const clear1 = imagesGroup.querySelector('#btn-clear-ms-img1');
                if (clear1) {
                    clear1.addEventListener('click', () => {
                        d.image1Url = '';
                        updateCanvasLive();
                        renderPropertyInspector();
                    });
                }

                if (String(d.imageCount) === '2') {
                    const img2Inp = imagesGroup.querySelector('#ms-img2-input');
                    img2Inp.addEventListener('input', (e) => { d.image2Url = e.target.value; updateCanvasLive(); });
                    const cap2Inp = imagesGroup.querySelector('#ms-cap2-input');
                    cap2Inp.addEventListener('input', (e) => { d.image2Caption = e.target.value; updateCanvasLive(); });

                    const file2 = imagesGroup.querySelector('#ms-file2-uploader');
                    if (file2) {
                        file2.addEventListener('change', (e) => {
                            const f = e.target.files[0];
                            if (f) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                    d.image2Url = evt.target.result;
                                    img2Inp.value = '(Embedded Image)';
                                    updateCanvasLive();
                                    renderPropertyInspector();
                                    showToast('Phone 2 Image uploaded!');
                                };
                                reader.readAsDataURL(f);
                            }
                        });
                    }
                    const clear2 = imagesGroup.querySelector('#btn-clear-ms-img2');
                    if (clear2) {
                        clear2.addEventListener('click', () => {
                            d.image2Url = '';
                            updateCanvasLive();
                            renderPropertyInspector();
                        });
                    }
                }
                form.appendChild(imagesGroup);

                // 5. Feature Points Manager
                const ptsGroup = document.createElement('div');
                ptsGroup.className = 'form-group';
                ptsGroup.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-check-circle" style="color: var(--primary); margin-right: 4px;"></i> Feature Points (${d.points.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-ms-point" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Point
                        </button>
                    </div>
                    <div class="items-list" id="ms-points-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-ms-point-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 7px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Point
                    </button>
                `;

                const ptsList = ptsGroup.querySelector('#ms-points-list');
                d.points.forEach((pt, idx) => {
                    const ptBox = document.createElement('div');
                    ptBox.className = 'item-card';
                    ptBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; position: relative;';
                    ptBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 10.5px; font-weight: 700; color: var(--primary);">Point #${idx + 1}</span>
                            <div style="display: flex; gap: 4px;">
                                <button type="button" class="toolbar-btn btn-pt-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-pt-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.points.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-pt-del" title="Delete Point" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                        <input type="text" class="form-input pt-text-input" value="${escapeHTML(pt)}" placeholder="Feature Point description..." style="font-size: 12px; padding: 6px 8px;">
                    `;

                    ptBox.querySelector('.pt-text-input').addEventListener('input', (e) => {
                        d.points[idx] = e.target.value;
                        updateCanvasLive();
                    });

                    const upBtn = ptBox.querySelector('.btn-pt-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const temp = d.points[idx];
                            d.points[idx] = d.points[idx - 1];
                            d.points[idx - 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const downBtn = ptBox.querySelector('.btn-pt-down');
                    if (downBtn && idx < d.points.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const temp = d.points[idx];
                            d.points[idx] = d.points[idx + 1];
                            d.points[idx + 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    ptBox.querySelector('.btn-pt-del').addEventListener('click', () => {
                        d.points.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    ptsList.appendChild(ptBox);
                });

                const addPtFn = () => {
                    d.points.push('New interactive mobile feature capability');
                    renderPropertyInspector();
                    updateCanvasLive();
                };
                ptsGroup.querySelector('#btn-add-ms-point').addEventListener('click', addPtFn);
                ptsGroup.querySelector('#btn-add-ms-point-bottom').addEventListener('click', addPtFn);
                form.appendChild(ptsGroup);

                // 6. Point Card & Checkmark Styling
                const ptStyleGroup = document.createElement('div');
                ptStyleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                ptStyleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-paint-brush" style="color: var(--primary);"></i> Point Card Styling
                    </div>
                `;
                ptStyleGroup.appendChild(createColorField('Checkmark Icon Color', d.accentColor, (val) => { d.accentColor = val; updateCanvasLive(); }));
                ptStyleGroup.appendChild(createColorField('Point Card Background', d.pointBgColor, (val) => { d.pointBgColor = val; updateCanvasLive(); }));
                ptStyleGroup.appendChild(createColorField('Point Card Border Color', d.pointBorderColor, (val) => { d.pointBorderColor = val; updateCanvasLive(); }));
                ptStyleGroup.appendChild(createColorField('Point Text Color', d.pointTextColor, (val) => { d.pointTextColor = val; updateCanvasLive(); }));
                form.appendChild(ptStyleGroup);
            }

            // Dedicated Desktop Showcase Full Custom Inspector
            if (widget.type === 'desktop_showcase') {
                if (d.badgeNumber === undefined) d.badgeNumber = '01';
                if (d.badgeText === undefined) d.badgeText = 'Dashboard';
                if (d.title === undefined) d.title = 'Interactive Real-Time Operations Hub';
                if (d.desc === undefined) d.desc = 'Centralize and monitor your entire business performance with live KPI metrics, dynamic filtering, and interactive data visualization.';
                if (d.headerAlign === undefined) d.headerAlign = 'center';
                if (d.pointsLayout === undefined) d.pointsLayout = 'grid';
                if (d.frameStyle === undefined) d.frameStyle = 'browser';
                if (d.browserUrl === undefined) d.browserUrl = 'https://my-company.odoo.com/web#dashboard';
                if (d.imageUrl === undefined) d.imageUrl = '';
                if (d.imageCaption === undefined) d.imageCaption = '';
                if (!Array.isArray(d.points)) d.points = [
                    'Real-time automated transaction and sales tracking',
                    'Multi-currency ledger reconciliation with instant filtering',
                    'One-click export to Excel, PDF, and audit log history'
                ];
                if (d.bgColor === undefined) d.bgColor = '#ffffff';
                if (d.accentColor === undefined) d.accentColor = '#007bff';
                if (d.badgeBgColor === undefined) d.badgeBgColor = '#007bff';
                if (d.badgeTextColor === undefined) d.badgeTextColor = '#ffffff';
                if (d.badgeBorderColor === undefined) d.badgeBorderColor = '#007bff';
                if (d.titleColor === undefined) d.titleColor = '#1e293b';
                if (d.descColor === undefined) d.descColor = '#64748b';
                if (d.pointBgColor === undefined) d.pointBgColor = '#f0f7ff';
                if (d.pointBorderColor === undefined) d.pointBorderColor = '#d0e4ff';
                if (d.pointTextColor === undefined) d.pointTextColor = '#1e293b';
                if (d.frameColor === undefined) d.frameColor = '#1e293b';

                // 1. Header & Step Count Group
                const badgeGroup = document.createElement('div');
                badgeGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                badgeGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-tag" style="color: var(--primary);"></i> Count Badge &amp; Category Tag Text
                    </div>
                `;
                badgeGroup.appendChild(createInputField('Count Number (e.g. 01, 02, 03)', d.badgeNumber, (val) => { 
                    d.badgeNumber = val; 
                    const prev = document.getElementById('badge-chip-live-preview');
                    if (prev) prev.innerText = val || '01';
                    updateCanvasLive(); 
                }));
                badgeGroup.appendChild(createInputField('Category / Tag Text (e.g. Dashboard)', d.badgeText, (val) => { 
                    d.badgeText = val; 
                    const catPrev = document.getElementById('badge-chip-category-preview');
                    if (catPrev) catPrev.innerText = val || '';
                    updateCanvasLive(); 
                }));
                form.appendChild(badgeGroup);

                // 2. Title & Short Description Group
                const titleGroup = document.createElement('div');
                titleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                titleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Title &amp; Description
                    </div>
                `;
                titleGroup.appendChild(createInputField('Heading Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                titleGroup.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                titleGroup.appendChild(createTextareaField('Short Description / Subtitle', d.desc, (val) => { d.desc = val; updateCanvasLive(); }));
                titleGroup.appendChild(createColorField('Description Color', d.descColor, (val) => { d.descColor = val; updateCanvasLive(); }));
                titleGroup.appendChild(createColorField('Section Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(titleGroup);

                // 3. Layout & Desktop Frame Display Group
                const layoutGroup = document.createElement('div');
                layoutGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                layoutGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-desktop" style="color: var(--primary);"></i> Full-Width Mockup &amp; Layout
                    </div>
                    <div class="form-group">
                        <label class="form-label">Header Alignment</label>
                        <select class="form-input" id="ds-align-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="center" ${d.headerAlign === 'center' ? 'selected' : ''}>Centered (Default)</option>
                            <option value="left" ${d.headerAlign === 'left' ? 'selected' : ''}>Left-Aligned</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Desktop Frame Style</label>
                        <select class="form-input" id="ds-frame-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="browser" ${d.frameStyle === 'browser' ? 'selected' : ''}>Modern Browser Window (macOS style)</option>
                            <option value="laptop" ${d.frameStyle === 'laptop' ? 'selected' : ''}>Sleek Laptop Mockup</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bottom Feature Points Layout</label>
                        <select class="form-input" id="ds-pts-layout-select" style="font-size: 12px; padding: 6px 10px;">
                            <option value="grid" ${d.pointsLayout === 'grid' ? 'selected' : ''}>Columns Grid (Side-by-Side)</option>
                            <option value="list" ${d.pointsLayout === 'list' ? 'selected' : ''}>Stacked Full-Width Cards</option>
                        </select>
                    </div>
                `;
                layoutGroup.querySelector('#ds-align-select').addEventListener('change', (e) => {
                    d.headerAlign = e.target.value;
                    updateCanvasLive();
                });
                layoutGroup.querySelector('#ds-frame-select').addEventListener('change', (e) => {
                    d.frameStyle = e.target.value;
                    updateCanvasLive();
                    renderPropertyInspector();
                });
                layoutGroup.querySelector('#ds-pts-layout-select').addEventListener('change', (e) => {
                    d.pointsLayout = e.target.value;
                    updateCanvasLive();
                });

                if (d.frameStyle === 'browser') {
                    layoutGroup.appendChild(createInputField('Browser URL Bar Text', d.browserUrl, (val) => { d.browserUrl = val; updateCanvasLive(); }));
                } else {
                    layoutGroup.appendChild(createColorField('Laptop Bezel Color', d.frameColor, (val) => { d.frameColor = val; updateCanvasLive(); }));
                }
                form.appendChild(layoutGroup);

                // 4. Desktop Screenshot Manager
                const imagesGroup = document.createElement('div');
                imagesGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                imagesGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-image" style="color: var(--primary); font-size: 14px;"></i> Desktop Screenshot
                    </div>
                    
                    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">
                        <input type="text" class="form-input mb-1" id="ds-img-input" placeholder="Image URL / Path..." value="${escapeHTML(d.imageUrl)}" style="font-size: 12px; padding: 5px 8px;">
                        <div style="display: flex; gap: 6px; margin-top: 6px; margin-bottom: 6px;">
                            <label class="btn btn-outline" style="font-size: 10px; padding: 4px 8px; cursor: pointer; color: var(--primary); border-color: var(--primary);">
                                <i class="fa fa-upload"></i> Upload Image
                                <input type="file" accept="image/*" id="ds-file-uploader" style="display: none;">
                            </label>
                            ${d.imageUrl ? `<button type="button" class="btn btn-outline" id="btn-clear-ds-img" style="font-size: 10px; padding: 4px 8px; color: #ef4444; border-color: #fca5a5;">Remove</button>` : ''}
                        </div>
                        <input type="text" class="form-input" id="ds-cap-input" placeholder="Optional caption (e.g. Operations Dashboard)" value="${escapeHTML(d.imageCaption)}" style="font-size: 11px; padding: 4px 8px;">
                    </div>
                `;

                const imgInp = imagesGroup.querySelector('#ds-img-input');
                imgInp.addEventListener('input', (e) => { d.imageUrl = e.target.value; updateCanvasLive(); });
                const capInp = imagesGroup.querySelector('#ds-cap-input');
                capInp.addEventListener('input', (e) => { d.imageCaption = e.target.value; updateCanvasLive(); });

                const fileInp = imagesGroup.querySelector('#ds-file-uploader');
                if (fileInp) {
                    fileInp.addEventListener('change', (e) => {
                        const f = e.target.files[0];
                        if (f) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                                d.imageUrl = evt.target.result;
                                imgInp.value = '(Embedded Image)';
                                updateCanvasLive();
                                renderPropertyInspector();
                                showToast('Desktop screenshot uploaded!');
                            };
                            reader.readAsDataURL(f);
                        }
                    });
                }
                const clearBtn = imagesGroup.querySelector('#btn-clear-ds-img');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        d.imageUrl = '';
                        updateCanvasLive();
                        renderPropertyInspector();
                    });
                }
                form.appendChild(imagesGroup);

                // 5. Feature Points Manager
                const ptsGroup = document.createElement('div');
                ptsGroup.className = 'form-group';
                ptsGroup.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-check-circle" style="color: var(--primary); margin-right: 4px;"></i> Feature Points (${d.points.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-ds-point" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Point
                        </button>
                    </div>
                    <div class="items-list" id="ds-points-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-ds-point-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 7px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Point
                    </button>
                `;

                const ptsList = ptsGroup.querySelector('#ds-points-list');
                d.points.forEach((pt, idx) => {
                    const ptBox = document.createElement('div');
                    ptBox.className = 'item-card';
                    ptBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; position: relative;';
                    ptBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 10.5px; font-weight: 700; color: var(--primary);">Point #${idx + 1}</span>
                            <div style="display: flex; gap: 4px;">
                                <button type="button" class="toolbar-btn btn-pt-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-pt-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.points.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-pt-del" title="Delete Point" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                        <input type="text" class="form-input pt-text-input" value="${escapeHTML(pt)}" placeholder="Feature Point description..." style="font-size: 12px; padding: 6px 8px;">
                    `;

                    ptBox.querySelector('.pt-text-input').addEventListener('input', (e) => {
                        d.points[idx] = e.target.value;
                        updateCanvasLive();
                    });

                    const upBtn = ptBox.querySelector('.btn-pt-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const temp = d.points[idx];
                            d.points[idx] = d.points[idx - 1];
                            d.points[idx - 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const downBtn = ptBox.querySelector('.btn-pt-down');
                    if (downBtn && idx < d.points.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const temp = d.points[idx];
                            d.points[idx] = d.points[idx + 1];
                            d.points[idx + 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    ptBox.querySelector('.btn-pt-del').addEventListener('click', () => {
                        d.points.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    ptsList.appendChild(ptBox);
                });

                const addPtFn = () => {
                    d.points.push('New interactive desktop workspace capability');
                    renderPropertyInspector();
                    updateCanvasLive();
                };
                ptsGroup.querySelector('#btn-add-ds-point').addEventListener('click', addPtFn);
                ptsGroup.querySelector('#btn-add-ds-point-bottom').addEventListener('click', addPtFn);
                form.appendChild(ptsGroup);

                // 6. Point Card & Checkmark Styling
                const ptStyleGroup = document.createElement('div');
                ptStyleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                ptStyleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-paint-brush" style="color: var(--primary);"></i> Point Card Styling
                    </div>
                `;
                ptStyleGroup.appendChild(createColorField('Checkmark Icon Color', d.accentColor, (val) => { d.accentColor = val; updateCanvasLive(); }));
                ptStyleGroup.appendChild(createColorField('Point Card Background', d.pointBgColor, (val) => { d.pointBgColor = val; updateCanvasLive(); }));
                ptStyleGroup.appendChild(createColorField('Point Card Border Color', d.pointBorderColor, (val) => { d.pointBorderColor = val; updateCanvasLive(); }));
                ptStyleGroup.appendChild(createColorField('Point Text Color', d.pointTextColor, (val) => { d.pointTextColor = val; updateCanvasLive(); }));
                form.appendChild(ptStyleGroup);
            }

            // Dedicated VS Table Full Custom Inspector
            if (widget.type === 'vs_table') {
                delete d.badgeNumber;
                delete d.badgeText;
                delete d.badgeBgColor;
                delete d.badgeTextColor;
                delete d.badgeBorderColor;
                delete d.badgePreset;
                if (d.title === undefined) d.title = 'Why Choose Our Solution?';
                if (d.subtitle === undefined) d.subtitle = 'See how our advanced module delivers superior features and automation compared to standard Odoo';
                if (d.bgColor === undefined) d.bgColor = '#f8fafc';
                if (d.cardBgColor === undefined) d.cardBgColor = '#ffffff';
                if (d.cardBorderColor === undefined) d.cardBorderColor = '#e2e8f0';
                if (d.headerBgColor === undefined) d.headerBgColor = '#f8fafc';
                if (d.headerTextColor === undefined) d.headerTextColor = '#334155';
                if (d.titleColor === undefined) d.titleColor = '#1e293b';
                if (d.subtitleColor === undefined) d.subtitleColor = '#64748b';
                if (d.accentColor === undefined) d.accentColor = '#007bff';
                if (d.col1Title === undefined) d.col1Title = 'Key Capabilities & Features';
                if (d.col2Title === undefined) d.col2Title = 'Our Module';
                if (d.col2Badge === undefined) d.col2Badge = 'Recommended';
                if (d.col3Title === undefined) d.col3Title = 'Standard Odoo';
                if (!Array.isArray(d.rows)) d.rows = [];

                // 1. Header Group
                const hdrGroup = document.createElement('div');
                hdrGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                hdrGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Header
                    </div>
                `;
                hdrGroup.appendChild(createInputField('Heading Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createColorField('Title Color', d.titleColor, (val) => { d.titleColor = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createTextareaField('Subtitle / Tagline', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createColorField('Subtitle Color', d.subtitleColor, (val) => { d.subtitleColor = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createColorField('Section Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(hdrGroup);

                // 2. Column Titles & Highlight Settings
                const colsGroup = document.createElement('div');
                colsGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                colsGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-columns" style="color: var(--primary);"></i> Column Headers &amp; Highlights
                    </div>
                `;
                colsGroup.appendChild(createInputField('Column 1 Header (Features)', d.col1Title, (val) => { d.col1Title = val; updateCanvasLive(); }));
                colsGroup.appendChild(createInputField('Column 2 Header (Our App / Module)', d.col2Title, (val) => { d.col2Title = val; updateCanvasLive(); }));
                colsGroup.appendChild(createInputField('Our App Top Badge Label', d.col2Badge, (val) => { d.col2Badge = val; updateCanvasLive(); }));
                colsGroup.appendChild(createInputField('Column 3 Header (Competitor / Standard)', d.col3Title, (val) => { d.col3Title = val; updateCanvasLive(); }));
                colsGroup.appendChild(createColorField('Our App Accent / Highlight Color', d.accentColor, (val) => { d.accentColor = val; updateCanvasLive(); }));
                form.appendChild(colsGroup);

                // 3. Table Styling Colors
                const styleGroup = document.createElement('div');
                styleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                styleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-paint-brush" style="color: var(--primary);"></i> Table Card Styling
                    </div>
                `;
                styleGroup.appendChild(createColorField('Card Background Color', d.cardBgColor, (val) => { d.cardBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Border Color', d.cardBorderColor, (val) => { d.cardBorderColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Header Row Background', d.headerBgColor, (val) => { d.headerBgColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Header Row Text Color', d.headerTextColor, (val) => { d.headerTextColor = val; updateCanvasLive(); }));
                form.appendChild(styleGroup);

                // 4. Feature Rows Manager
                const rowsGroup = document.createElement('div');
                rowsGroup.className = 'form-group';
                rowsGroup.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-list" style="color: var(--primary); margin-right: 4px;"></i> Comparison Rows (${d.rows.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-vs-row" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Row
                        </button>
                    </div>
                    <div id="vs-rows-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-vs-row-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 7px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Comparison Row
                    </button>
                `;

                const rowsList = rowsGroup.querySelector('#vs-rows-list');
                d.rows.forEach((r, idx) => {
                    const rowBox = document.createElement('div');
                    rowBox.style.cssText = 'background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);';
                    rowBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 11px; font-weight: 700; color: var(--primary);">Row #${idx + 1}</span>
                            <div style="display: flex; gap: 4px;">
                                <button type="button" class="toolbar-btn btn-vs-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-vs-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.rows.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-vs-del" title="Delete Row" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                        <input type="text" class="form-input vs-feature-name mb-1" value="${escapeHTML(r.feature || '')}" placeholder="Feature Title..." style="font-size: 12px; padding: 6px 8px; font-weight: 600;">
                        <input type="text" class="form-input vs-feature-detail mb-2" value="${escapeHTML(r.detail || '')}" placeholder="Short detail / description note (optional)..." style="font-size: 11px; padding: 4px 8px; color: #64748b;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                            <div>
                                <label style="font-size: 10.5px; font-weight: 700; color: #0284c7; display: block; margin-bottom: 3px;">Our App</label>
                                <input type="text" class="form-input vs-our-val" value="${r.ourApp === true ? 'Yes' : (r.ourApp === false ? 'No' : escapeHTML(String(r.ourApp || 'Yes')))}" placeholder="Yes, No, or Custom note..." style="font-size: 11px; padding: 4px 6px;">
                            </div>
                            <div>
                                <label style="font-size: 10.5px; font-weight: 700; color: #64748b; display: block; margin-bottom: 3px;">Standard / Competitor</label>
                                <input type="text" class="form-input vs-comp-val" value="${r.competitor === true ? 'Yes' : (r.competitor === false ? 'No' : escapeHTML(String(r.competitor || 'No')))}" placeholder="Yes, No, or Custom note..." style="font-size: 11px; padding: 4px 6px;">
                            </div>
                        </div>
                    `;

                    rowBox.querySelector('.vs-feature-name').addEventListener('input', (e) => {
                        r.feature = e.target.value;
                        updateCanvasLive();
                    });
                    rowBox.querySelector('.vs-feature-detail').addEventListener('input', (e) => {
                        r.detail = e.target.value;
                        updateCanvasLive();
                    });
                    rowBox.querySelector('.vs-our-val').addEventListener('input', (e) => {
                        const v = e.target.value.trim();
                        if (v.toLowerCase() === 'yes' || v.toLowerCase() === 'true') r.ourApp = true;
                        else if (v.toLowerCase() === 'no' || v.toLowerCase() === 'false') r.ourApp = false;
                        else r.ourApp = v;
                        updateCanvasLive();
                    });
                    rowBox.querySelector('.vs-comp-val').addEventListener('input', (e) => {
                        const v = e.target.value.trim();
                        if (v.toLowerCase() === 'yes' || v.toLowerCase() === 'true') r.competitor = true;
                        else if (v.toLowerCase() === 'no' || v.toLowerCase() === 'false') r.competitor = false;
                        else r.competitor = v;
                        updateCanvasLive();
                    });

                    const upBtn = rowBox.querySelector('.btn-vs-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const tmp = d.rows[idx];
                            d.rows[idx] = d.rows[idx - 1];
                            d.rows[idx - 1] = tmp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }
                    const downBtn = rowBox.querySelector('.btn-vs-down');
                    if (downBtn && idx < d.rows.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const tmp = d.rows[idx];
                            d.rows[idx] = d.rows[idx + 1];
                            d.rows[idx + 1] = tmp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }
                    const delBtn = rowBox.querySelector('.btn-vs-del');
                    delBtn.addEventListener('click', () => {
                        d.rows.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    rowsList.appendChild(rowBox);
                });

                const addVsRowFn = () => {
                    d.rows.push({
                        feature: 'New Advanced Capability',
                        detail: 'Custom automated rule or workflow',
                        ourApp: true,
                        competitor: false
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                };
                rowsGroup.querySelector('#btn-add-vs-row').addEventListener('click', addVsRowFn);
                rowsGroup.querySelector('#btn-add-vs-row-bottom').addEventListener('click', addVsRowFn);
                form.appendChild(rowsGroup);
            }

            // ==========================================
            // FAQ ACCORDION CARDS INSPECTOR
            // ==========================================
            if (widget.type === 'faq_section') {
                if (d.bgColor === undefined) d.bgColor = '#ffffff';
                if (d.headerBg === undefined) d.headerBg = '#eff6ff';
                if (d.questionColor === undefined) d.questionColor = '#2563eb';
                if (d.borderColor === undefined) d.borderColor = '#dbeafe';
                if (!Array.isArray(d.faqs)) d.faqs = [];

                // 1. Header & Section Background
                const hdrGroup = document.createElement('div');
                hdrGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                hdrGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Section Header
                    </div>
                `;
                hdrGroup.appendChild(createInputField('Heading Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createTextareaField('Subtitle / Tagline', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createColorField('Section Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                form.appendChild(hdrGroup);

                // 2. Accordion Colors (Matching Evo CRM Preset)
                const styleGroup = document.createElement('div');
                styleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                styleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-paint-brush" style="color: var(--primary);"></i> Accordion Styling &amp; Colors
                    </div>
                `;
                styleGroup.appendChild(createColorField('Question Bar Background', d.headerBg, (val) => { d.headerBg = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Question Text & Chevron Color', d.questionColor, (val) => { d.questionColor = val; updateCanvasLive(); }));
                styleGroup.appendChild(createColorField('Card Border Color', d.borderColor, (val) => { d.borderColor = val; updateCanvasLive(); }));
                form.appendChild(styleGroup);

                // 3. FAQ Questions Manager
                const faqGroup = document.createElement('div');
                faqGroup.className = 'form-group';
                faqGroup.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-question-circle" style="color: var(--primary); margin-right: 4px;"></i> FAQ Questions (${d.faqs.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-faq-top" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Question
                        </button>
                    </div>
                    <div class="items-list" id="faq-cards-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-faq-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 8px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Question
                    </button>
                `;

                const list = faqGroup.querySelector('#faq-cards-list');
                d.faqs.forEach((item, idx) => {
                    const isItemOpen = item.isOpen === true || (item.isOpen === undefined && idx === 0);
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; position: relative;';
                    itemBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 11px; font-weight: 700; color: var(--primary);">FAQ #${idx + 1}</span>
                            <div style="display: flex; gap: 4px;">
                                <button type="button" class="toolbar-btn btn-faq-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-faq-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.faqs.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-faq-del" title="Delete Question" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                        <div style="margin-bottom: 6px;">
                            <label style="font-size: 10.5px; font-weight: 600; color: #64748b; margin-bottom: 2px; display: block;">Question</label>
                            <input type="text" class="form-input faq-q-input" value="${escapeHTML(item.q || '')}" placeholder="e.g. Can users manage opportunities from the mobile app?">
                        </div>
                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 10.5px; font-weight: 600; color: #64748b; margin-bottom: 2px; display: block;">Answer</label>
                            <textarea class="form-textarea faq-a-input" rows="2" placeholder="e.g. Yes, users can create, update, and track...">${escapeHTML(item.a || '')}</textarea>
                        </div>
                        <label style="font-size: 11px; color: #475569; display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;">
                            <input type="checkbox" class="faq-open-checkbox" ${isItemOpen ? 'checked' : ''}>
                            <span>Open by default (expanded)</span>
                        </label>
                    `;

                    itemBox.querySelector('.faq-q-input').addEventListener('input', (e) => {
                        item.q = e.target.value;
                        updateCanvasLive();
                    });
                    itemBox.querySelector('.faq-a-input').addEventListener('input', (e) => {
                        item.a = e.target.value;
                        updateCanvasLive();
                    });
                    itemBox.querySelector('.faq-open-checkbox').addEventListener('change', (e) => {
                        item.isOpen = e.target.checked;
                        updateCanvasLive();
                    });

                    const upBtn = itemBox.querySelector('.btn-faq-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const tmp = d.faqs[idx];
                            d.faqs[idx] = d.faqs[idx - 1];
                            d.faqs[idx - 1] = tmp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }
                    const downBtn = itemBox.querySelector('.btn-faq-down');
                    if (downBtn && idx < d.faqs.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const tmp = d.faqs[idx];
                            d.faqs[idx] = d.faqs[idx + 1];
                            d.faqs[idx + 1] = tmp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }
                    const delBtn = itemBox.querySelector('.btn-faq-del');
                    delBtn.addEventListener('click', () => {
                        d.faqs.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    list.appendChild(itemBox);
                });

                const addFaqFn = () => {
                    d.faqs.push({
                        q: 'New question?',
                        a: 'Detailed answer response with clear explanation.',
                        isOpen: false
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                };
                faqGroup.querySelector('#btn-add-faq-top').addEventListener('click', addFaqFn);
                faqGroup.querySelector('#btn-add-faq-bottom').addEventListener('click', addFaqFn);
                form.appendChild(faqGroup);
            }

            // Multi-item editors
            // 1. Bullets (feature split)
            if (d.bulletItems !== undefined) {
                const grp = document.createElement('div');
                grp.className = 'form-group';
                grp.innerHTML = `
                    <label class="form-label" style="display: flex; justify-content: space-between;">
                        <span>Feature Checklist</span>
                        <a href="javascript:void(0)" style="color: var(--primary); font-size: 11px;" id="add-bullet">+ Add Item</a>
                    </label>
                    <div class="items-list" id="bullet-items-list"></div>
                `;
                const list = grp.querySelector('#bullet-items-list');
                d.bulletItems.forEach((item, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.innerHTML = `
                        <button class="item-delete-btn" title="Delete"><i class="fa fa-times"></i></button>
                        <input type="text" class="form-input" value="${escapeHTML(item)}" style="padding-right: 28px;">
                    `;
                    itemBox.querySelector('input').addEventListener('input', (e) => {
                        d.bulletItems[idx] = e.target.value;
                        updateCanvasLive();
                    });
                    itemBox.querySelector('.item-delete-btn').addEventListener('click', () => {
                        d.bulletItems.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });
                    list.appendChild(itemBox);
                });
                grp.querySelector('#add-bullet').addEventListener('click', () => {
                    d.bulletItems.push('New automated benefit item');
                    renderPropertyInspector();
                    updateCanvasLive();
                });
                form.appendChild(grp);
            }

            // 2. FAQs (legacy fallback for any other widget)
            if (d.faqs !== undefined && widget.type !== 'faq_section') {
                const grp = document.createElement('div');
                grp.className = 'form-group';
                grp.innerHTML = `
                    <label class="form-label" style="display: flex; justify-content: space-between;">
                        <span>FAQ Questions</span>
                        <a href="javascript:void(0)" style="color: var(--primary); font-size: 11px;" id="add-faq">+ Add FAQ</a>
                    </label>
                    <div class="items-list" id="faq-items-list"></div>
                `;
                const list = grp.querySelector('#faq-items-list');
                d.faqs.forEach((item, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.innerHTML = `
                        <button class="item-delete-btn" title="Delete"><i class="fa fa-times"></i></button>
                        <input type="text" class="form-input mb-1" placeholder="Question" value="${escapeHTML(item.q)}">
                        <textarea class="form-textarea" placeholder="Answer">${escapeHTML(item.a)}</textarea>
                    `;
                    itemBox.querySelector('input').addEventListener('input', (e) => {
                        d.faqs[idx].q = e.target.value;
                        updateCanvasLive();
                    });
                    itemBox.querySelector('textarea').addEventListener('input', (e) => {
                        d.faqs[idx].a = e.target.value;
                        updateCanvasLive();
                    });
                    itemBox.querySelector('.item-delete-btn').addEventListener('click', () => {
                        d.faqs.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });
                    list.appendChild(itemBox);
                });
                grp.querySelector('#add-faq').addEventListener('click', () => {
                    d.faqs.push({ q: 'New question?', a: 'Detailed answer response.' });
                    renderPropertyInspector();
                    updateCanvasLive();
                });
                form.appendChild(grp);
            }

            // ==========================================
            // SUPPORT & CONTACT BANNER INSPECTOR
            // ==========================================
            if (widget.type === 'support_banner') {
                if (d.bgColor === undefined) d.bgColor = '#714B67';
                if (d.textColor === undefined) d.textColor = '#ffffff';
                if (d.cardBgColor === undefined) d.cardBgColor = '#ffffff';
                if (d.cardBorderColor === undefined) d.cardBorderColor = '#e2e8f0';
                if (d.iconColor === undefined) d.iconColor = d.bgColor;

                // Normalize channels with standard 4 native Odoo .oi channels
                if (!Array.isArray(d.channels) || d.channels.length === 0) {
                    d.channels = [
                        { icon: '<i class="oi" data-icon="email"></i>', label: 'Email Support', value: d.email || 'support@yourdomain.com', url: `mailto:${d.email || 'support@yourdomain.com'}` },
                        { icon: '<i class="oi" data-icon="forum"></i>', label: 'Community Forum', value: 'Join Discussions', url: 'https://yourdomain.com/forum' },
                        { icon: '<i class="oi" data-icon="campaign"></i>', label: 'Latest Updates', value: 'News & Releases', url: 'https://yourdomain.com/updates' },
                        { icon: '<i class="oi" data-icon="help"></i>', label: 'Helpdesk Portal', value: 'Submit a Ticket', url: 'https://yourdomain.com/helpdesk' }
                    ];
                }

                // 1. Header & Text Styling
                const hdrGroup = document.createElement('div');
                hdrGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                hdrGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-header" style="color: var(--primary);"></i> Banner Header &amp; Badge
                    </div>
                `;
                hdrGroup.appendChild(createInputField('Heading Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createTextareaField('Subtitle / Description', d.subtitle, (val) => { d.subtitle = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createInputField('Warranty / Top Badge', d.badge || '', (val) => { d.badge = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createColorField('Banner Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
                hdrGroup.appendChild(createColorField('Banner Text Color', d.textColor, (val) => { d.textColor = val; updateCanvasLive(); }));
                form.appendChild(hdrGroup);

                // 2. Card Styling
                const cardStyleGroup = document.createElement('div');
                cardStyleGroup.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
                cardStyleGroup.innerHTML = `
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa fa-paint-brush" style="color: var(--primary);"></i> Channel Cards Styling
                    </div>
                `;
                cardStyleGroup.appendChild(createColorField('Card Background Color', d.cardBgColor, (val) => { d.cardBgColor = val; updateCanvasLive(); }));
                cardStyleGroup.appendChild(createColorField('Card Border Color', d.cardBorderColor, (val) => { d.cardBorderColor = val; updateCanvasLive(); }));
                cardStyleGroup.appendChild(createColorField('Channel Icon Color', d.iconColor, (val) => { d.iconColor = val; updateCanvasLive(); }));
                form.appendChild(cardStyleGroup);

                // 3. Support Channels Manager (Curated Native Odoo .oi Icons for App Store)
                const SUPPORT_OI_PRESETS = [
                    { name: 'campaign', label: '📢 Announcements & Releases', html: '<i class="oi" data-icon="campaign"></i>' },
                    { name: 'forum', label: '🗨️ Discussion Forum', html: '<i class="oi" data-icon="forum"></i>' },
                    { name: 'email', label: '✉️ Email Support', html: '<i class="oi" data-icon="email"></i>' },
                    { name: 'help', label: '❓ FAQ & Helpdesk', html: '<i class="oi" data-icon="help"></i>' }
                ];

                const channelsGroup = document.createElement('div');
                channelsGroup.className = 'form-group';
                channelsGroup.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="oi" data-icon="forum" style="color: var(--primary); margin-right: 4px; vertical-align: middle;"></i> Support Channels (${d.channels.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-channel-top" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add Channel
                        </button>
                    </div>
                    <div class="items-list" id="channels-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-channel-bottom" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 8px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another Channel
                    </button>
                `;

                const chList = channelsGroup.querySelector('#channels-list');
                d.channels.forEach((ch, idx) => {
                    const chBox = document.createElement('div');
                    chBox.className = 'item-card';
                    chBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.03);';

                    const curIcon = (ch.icon || '').toLowerCase().trim();
                    const presetBtns = SUPPORT_OI_PRESETS.map(p => {
                        const isSel = curIcon === p.html.toLowerCase() ||
                                      curIcon === p.name ||
                                      curIcon.includes(`data-icon="${p.name}"`) ||
                                      curIcon.includes(`data-icon='${p.name}'`) ||
                                      (curIcon.includes(p.name) && !curIcon.includes('fa-'));
                        return `
                            <button type="button" class="ch-preset-btn" data-icon='${escapeHTML(p.html)}' data-name="${p.name}" data-search="${p.name} ${p.label.toLowerCase()}" title="${p.label}" style="font-size: 11px; padding: 7px 10px; border: 1px solid ${isSel ? 'var(--primary)' : '#e2e8f0'}; border-radius: 6px; background: ${isSel ? '#f5eff4' : '#ffffff'}; color: ${isSel ? 'var(--primary)' : '#334155'}; cursor: pointer; font-weight: ${isSel ? '700' : '500'}; display: flex; align-items: center; gap: 8px; text-align: left; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02); transition: all 0.15s ease;">
                                <span style="font-size: 18px; display: inline-flex; align-items: center; justify-content: center; width: 22px; color: ${isSel ? 'var(--primary)' : '#714B67'}; flex-shrink: 0;">
                                    ${p.html}
                                </span>
                                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px;">${p.label}</span>
                            </button>
                        `;
                    }).join('');

                    chBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 11px; font-weight: 700; color: var(--primary);">Channel #${idx + 1}</span>
                            <div style="display: flex; gap: 4px;">
                                <button type="button" class="toolbar-btn btn-ch-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-ch-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.channels.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-ch-del" title="Delete Channel" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                            <label style="font-size: 11px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="display: flex; align-items: center; gap: 5px;">
                                    <i class="oi" data-icon="forum" style="color: var(--primary); font-size: 14px;"></i> Odoo Support Icon (App Store Compatible)
                                </span>
                                <span class="ch-icon-preview-box" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: #ffffff; color: ${d.iconColor || '#714B67'}; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-size: 20px;">
                                    ${renderSafeIcon(ch.icon, '<i class="oi" data-icon="email"></i>')}
                                </span>
                            </label>

                            <div style="margin-bottom: 6px;">
                                <input type="text" class="form-input ch-icon-search-input" placeholder="🔍 Search support icons (campaign, forum, email, help)..." style="font-size: 11px; padding: 5px 8px; width: 100%; border-radius: 6px;">
                            </div>

                            <div class="preset-icons-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; padding: 6px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px;">
                                ${presetBtns}
                            </div>

                            <div>
                                <label style="font-size: 9px; color: var(--text-muted); display: block; margin-bottom: 2px;">Odoo Icon Tag / Class</label>
                                <input type="text" class="form-input ch-icon-input" value="${escapeHTML(ch.icon || '<i class=\"oi\" data-icon=\"email\"></i>')}" placeholder='<i class="oi" data-icon="email"></i>' style="font-size: 11px; padding: 4px 8px; font-family: monospace;">
                            </div>
                        </div>

                        <div style="margin-bottom: 6px;">
                            <label style="font-size: 10.5px; font-weight: 600; color: #64748b; margin-bottom: 2px; display: block;">Channel Label</label>
                            <input type="text" class="form-input ch-label-input" value="${escapeHTML(ch.label || '')}" placeholder="e.g. Email Support, Community Forum, Helpdesk">
                        </div>
                        <div style="margin-bottom: 6px;">
                            <label style="font-size: 10.5px; font-weight: 600; color: #64748b; margin-bottom: 2px; display: block;">Display Value / Contact Info</label>
                            <input type="text" class="form-input ch-value-input" value="${escapeHTML(ch.value || '')}" placeholder="e.g. support@yourdomain.com or Join Discussions">
                        </div>
                        <div>
                            <label style="font-size: 10.5px; font-weight: 600; color: #64748b; margin-bottom: 2px; display: block;">Action Link URL (Optional)</label>
                            <input type="text" class="form-input ch-url-input" value="${escapeHTML(ch.url || '')}" placeholder="e.g. mailto:..., https://...">
                        </div>
                    `;

                    const chIconInput = chBox.querySelector('.ch-icon-input');
                    const chPreviewBox = chBox.querySelector('.ch-icon-preview-box');

                    function updateChPreview() {
                        if (chPreviewBox) {
                            chPreviewBox.innerHTML = renderSafeIcon(ch.icon, '<i class="oi" data-icon="email"></i>');
                        }
                    }

                    chIconInput.addEventListener('input', (e) => {
                        ch.icon = e.target.value;
                        updateCanvasLive();
                        updateChPreview();
                    });

                    const chSearchInput = chBox.querySelector('.ch-icon-search-input');
                    if (chSearchInput) {
                        chSearchInput.addEventListener('input', (e) => {
                            const query = e.target.value.toLowerCase().trim();
                            chBox.querySelectorAll('.ch-preset-btn').forEach(btn => {
                                const searchData = (btn.getAttribute('data-search') || '').toLowerCase();
                                if (!query || searchData.includes(query)) {
                                    btn.style.display = 'flex';
                                } else {
                                    btn.style.display = 'none';
                                }
                            });
                        });
                    }

                    chBox.querySelectorAll('.ch-preset-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const selectedIcon = btn.getAttribute('data-icon');
                            ch.icon = selectedIcon;
                            chIconInput.value = selectedIcon;
                            chBox.querySelectorAll('.ch-preset-btn').forEach(b => {
                                b.style.borderColor = '#e2e8f0';
                                b.style.background = '#ffffff';
                                b.style.color = '#334155';
                                b.style.fontWeight = '500';
                            });
                            btn.style.borderColor = 'var(--primary)';
                            btn.style.background = '#f5eff4';
                            btn.style.color = 'var(--primary)';
                            btn.style.fontWeight = '700';
                            updateChPreview();
                            updateCanvasLive();
                        });
                    });

                    chBox.querySelector('.ch-label-input').addEventListener('input', (e) => {
                        ch.label = e.target.value;
                        updateCanvasLive();
                    });
                    chBox.querySelector('.ch-value-input').addEventListener('input', (e) => {
                        ch.value = e.target.value;
                        updateCanvasLive();
                    });
                    chBox.querySelector('.ch-url-input').addEventListener('input', (e) => {
                        ch.url = e.target.value;
                        updateCanvasLive();
                    });

                    const upBtn = chBox.querySelector('.btn-ch-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const tmp = d.channels[idx];
                            d.channels[idx] = d.channels[idx - 1];
                            d.channels[idx - 1] = tmp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }
                    const downBtn = chBox.querySelector('.btn-ch-down');
                    if (downBtn && idx < d.channels.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const tmp = d.channels[idx];
                            d.channels[idx] = d.channels[idx + 1];
                            d.channels[idx + 1] = tmp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }
                    const delBtn = chBox.querySelector('.btn-ch-del');
                    delBtn.addEventListener('click', () => {
                        d.channels.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    chList.appendChild(chBox);
                });

                const addChannelFn = () => {
                    d.channels.push({
                        icon: '<i class="oi" data-icon="email"></i>',
                        label: 'Email Support',
                        value: 'support@yourdomain.com',
                        url: 'mailto:support@yourdomain.com'
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                };
                channelsGroup.querySelector('#btn-add-channel-top').addEventListener('click', addChannelFn);
                channelsGroup.querySelector('#btn-add-channel-bottom').addEventListener('click', addChannelFn);
                form.appendChild(channelsGroup);
            }
            // 4. Other Apps List Manager (for other_apps)
            if (Array.isArray(d.apps)) {
                const grp = document.createElement('div');
                grp.className = 'form-group';
                grp.style.marginTop = '16px';
                grp.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label class="form-label" style="margin: 0; font-weight: 700; font-size: 13px; color: var(--text-main);">
                            <i class="fa fa-cubes" style="color: var(--primary); margin-right: 4px;"></i> Apps Showcase (${d.apps.length})
                        </label>
                        <button type="button" class="btn btn-outline" id="btn-add-app-card" style="font-size: 11px; padding: 4px 10px; color: var(--primary); border-color: var(--primary); cursor: pointer; font-weight: 600;">
                            <i class="fa fa-plus"></i> Add App
                        </button>
                    </div>
                    <div class="items-list" id="apps-items-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
                    <button type="button" class="btn btn-outline" id="btn-add-app-card-bottom" style="width: 100%; margin-top: 12px; font-size: 12px; padding: 8px; color: var(--primary); border-color: var(--primary); border-style: dashed; font-weight: 600; cursor: pointer;">
                        <i class="fa fa-plus-circle"></i> + Add Another App
                    </button>
                `;

                const list = grp.querySelector('#apps-items-list');
                d.apps.forEach((app, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.03);';

                    const hasBanner = !!app.bannerUrl;
                    const isBase64 = app.bannerUrl && app.bannerUrl.startsWith('data:');
                    const isNetwork = app.bannerUrl && (app.bannerUrl.startsWith('http://') || app.bannerUrl.startsWith('https://'));
                    const isLocal = app.bannerUrl && !isBase64 && !isNetwork;

                    let badgeHtml = '<span style="font-size: 10px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">Placeholder</span>';
                    if (isNetwork) {
                        badgeHtml = '<span style="font-size: 10px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;"><i class="fa fa-globe"></i> Network Image</span>';
                    } else if (isBase64) {
                        badgeHtml = '<span style="font-size: 10px; font-weight: 700; color: #7c3aed; background: #ede9fe; padding: 2px 6px; border-radius: 4px;"><i class="fa fa-file-image-o"></i> Uploaded</span>';
                    } else if (isLocal) {
                        badgeHtml = '<span style="font-size: 10px; font-weight: 700; color: #d97706; background: #fef3c7; padding: 2px 6px; border-radius: 4px;"><i class="fa fa-folder-open"></i> Local Path</span>';
                    }

                    itemBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 12px; font-weight: 800; color: var(--primary);">App #${idx + 1}</span>
                            <div style="display: flex; gap: 4px; align-items: center;">
                                <button type="button" class="toolbar-btn btn-app-up" title="Move Up" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-up"></i></button>
                                <button type="button" class="toolbar-btn btn-app-down" title="Move Down" style="padding: 2px 6px; font-size: 10px; cursor: pointer;" ${idx === d.apps.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}><i class="fa fa-arrow-down"></i></button>
                                <button type="button" class="toolbar-btn btn-app-del" title="Delete App" style="padding: 2px 6px; font-size: 10px; color: #ef4444; cursor: pointer;"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>

                        <!-- Banner Image Container -->
                        <div style="margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <label style="font-size: 11px; font-weight: 700; color: var(--text-main); margin: 0;">
                                    <i class="fa fa-picture-o" style="color: var(--primary);"></i> Banner Image
                                </label>
                                <span class="banner-type-indicator">${badgeHtml}</span>
                            </div>
                            
                            <!-- URL Input (supports Network URLs or paths) -->
                            <div style="margin-bottom: 8px;">
                                <input type="text" class="form-input app-banner-input" value="${escapeHTML(isBase64 ? '(Embedded Base64 Image)' : (app.bannerUrl || ''))}" placeholder="Paste Network URL (https://...) or image path" style="font-size: 11px; padding: 6px 8px;">
                            </div>
                            
                            <!-- Action Buttons & Live Thumbnail -->
                            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                                <button type="button" class="btn btn-outline btn-toggle-presets" style="font-size: 11px; padding: 4px 8px; color: #0284c7; border-color: #bae6fd; background: #f0f9ff;" title="Pick sample network banner">
                                    <i class="fa fa-globe"></i> Web Presets
                                </button>
                                <label class="btn btn-outline" style="font-size: 11px; padding: 4px 8px; cursor: pointer; color: var(--primary); border-color: var(--primary); margin: 0;">
                                    <i class="fa fa-upload"></i> Upload
                                    <input type="file" accept="image/*" class="app-banner-uploader" style="display: none;">
                                </label>
                                <button type="button" class="btn btn-outline btn-clear-app-banner" style="font-size: 11px; padding: 4px 8px; color: #ef4444; border-color: #fca5a5; display: ${hasBanner ? 'inline-block' : 'none'};">
                                    <i class="fa fa-trash"></i> Remove
                                </button>
                                <div class="banner-preview-box" style="margin-left: auto; width: 56px; height: 32px; border-radius: 4px; overflow: hidden; border: 1px solid #cbd5e1; background: #e2e8f0; display: flex; align-items: center; justify-content: center;">
                                    ${hasBanner ? `<img src="${escapeHTML(app.bannerUrl)}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class="fa fa-picture-o" style="color: #94a3b8; font-size: 13px;"></i>`}
                                </div>
                            </div>

                            <!-- Collapsible Network Presets Panel -->
                            <div class="network-presets-panel" style="display: none; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1;">
                                <div style="font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 6px;">Choose a Network Banner:</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://apps.odoocdn.com/apps/assets/16.0/evo_call_recording_transcript/banner.png" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; grid-column: span 2; background: #eef2ff; color: #4338ca; font-weight: 700;">⭐ Odoo CDN (Evo Call Recording)</button>
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📊 CRM &amp; AI</button>
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📈 Lead Growth</button>
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📋 Project Portal</button>
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">💬 Live Chat</button>
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📦 Inventory</button>
                                    <button type="button" class="btn btn-outline preset-url-btn" data-url="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80" style="font-size: 10px; padding: 4px 6px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">💳 Accounting</button>
                                </div>
                            </div>
                        </div>

                        <!-- App Title -->
                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">App Title</label>
                            <input type="text" class="form-input app-title-input" value="${escapeHTML(app.title || '')}" placeholder="e.g. AI Call Recording for CRM" style="font-size: 12px; padding: 5px 8px;">
                        </div>

                        <!-- Company & Price in 2 columns -->
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <div style="flex: 1;">
                                <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Company / Author</label>
                                <input type="text" class="form-input app-company-input" value="${escapeHTML(app.company || '')}" placeholder="e.g. Evozard" style="font-size: 12px; padding: 5px 8px;">
                            </div>
                            <div style="width: 100px;">
                                <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">Price</label>
                                <input type="text" class="form-input app-price-input" value="${escapeHTML(app.price || '')}" placeholder="e.g. $ 139 / Free" style="font-size: 12px; padding: 5px 8px;">
                            </div>
                        </div>

                        <!-- Odoo App Store URL -->
                        <div style="margin-bottom: 4px;">
                            <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px;">
                                <i class="fa fa-external-link"></i> Odoo App Store Link
                            </label>
                            <input type="text" class="form-input app-url-input" value="${escapeHTML(app.appUrl || '')}" placeholder="https://apps.odoo.com/apps/modules/..." style="font-size: 12px; padding: 5px 8px;">
                        </div>
                    `;

                    // Helper to update banner and live preview
                    const bannerInput = itemBox.querySelector('.app-banner-input');
                    const previewBox = itemBox.querySelector('.banner-preview-box');
                    const clearBannerBtn = itemBox.querySelector('.btn-clear-app-banner');
                    const badgeSpan = itemBox.querySelector('.banner-type-indicator');

                    function updateBannerUI(newUrl) {
                        if (newUrl && typeof newUrl === 'string') {
                            newUrl = newUrl.trim();
                            const srcMatch = newUrl.match(/src=["'](.*?)["']/i);
                            if (srcMatch) {
                                newUrl = srcMatch[1];
                                if (bannerInput && bannerInput.value !== newUrl && !newUrl.startsWith('data:')) {
                                    bannerInput.value = newUrl;
                                }
                            }
                        }
                        app.bannerUrl = newUrl;
                        updateCanvasLive();

                        if (newUrl) {
                            previewBox.innerHTML = `<img src="${newUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
                            if (clearBannerBtn) clearBannerBtn.style.display = 'inline-block';
                        } else {
                            previewBox.innerHTML = `<i class="fa fa-picture-o" style="color: #94a3b8; font-size: 13px;"></i>`;
                            if (clearBannerBtn) clearBannerBtn.style.display = 'none';
                        }

                        const isNet = newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'));
                        const isB64 = newUrl && newUrl.startsWith('data:');
                        const isLoc = newUrl && !isNet && !isB64;

                        if (badgeSpan) {
                            if (isNet) {
                                badgeSpan.innerHTML = `<span style="font-size: 10px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;"><i class="fa fa-globe"></i> Network Image</span>`;
                            } else if (isB64) {
                                badgeSpan.innerHTML = `<span style="font-size: 10px; font-weight: 700; color: #7c3aed; background: #ede9fe; padding: 2px 6px; border-radius: 4px;"><i class="fa fa-file-image-o"></i> Uploaded</span>`;
                            } else if (isLoc) {
                                badgeSpan.innerHTML = `<span style="font-size: 10px; font-weight: 700; color: #d97706; background: #fef3c7; padding: 2px 6px; border-radius: 4px;"><i class="fa fa-folder-open"></i> Local Path</span>`;
                            } else {
                                badgeSpan.innerHTML = `<span style="font-size: 10px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">Placeholder</span>`;
                            }
                        }
                    }

                    bannerInput.addEventListener('input', (e) => {
                        updateBannerUI(e.target.value);
                    });
                    bannerInput.addEventListener('paste', () => {
                        setTimeout(() => updateBannerUI(bannerInput.value), 0);
                    });

                    // Toggle Web Presets Panel
                    const togglePresetsBtn = itemBox.querySelector('.btn-toggle-presets');
                    const presetsPanel = itemBox.querySelector('.network-presets-panel');
                    if (togglePresetsBtn && presetsPanel) {
                        togglePresetsBtn.addEventListener('click', () => {
                            presetsPanel.style.display = presetsPanel.style.display === 'none' ? 'block' : 'none';
                        });
                    }

                    itemBox.querySelectorAll('.preset-url-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const url = btn.getAttribute('data-url');
                            bannerInput.value = url;
                            updateBannerUI(url);
                            presetsPanel.style.display = 'none';
                            showToast('Applied network banner image');
                        });
                    });

                    const fileUploader = itemBox.querySelector('.app-banner-uploader');
                    if (fileUploader) {
                        fileUploader.addEventListener('change', (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                    bannerInput.value = '(Embedded Base64 Image)';
                                    updateBannerUI(evt.target.result);
                                    showToast('Banner uploaded & embedded');
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    }

                    if (clearBannerBtn) {
                        clearBannerBtn.addEventListener('click', () => {
                            bannerInput.value = '';
                            updateBannerUI('');
                        });
                    }

                    const titleInput = itemBox.querySelector('.app-title-input');
                    titleInput.addEventListener('input', (e) => {
                        app.title = e.target.value;
                        updateCanvasLive();
                    });

                    const companyInput = itemBox.querySelector('.app-company-input');
                    companyInput.addEventListener('input', (e) => {
                        app.company = e.target.value;
                        updateCanvasLive();
                    });

                    const priceInput = itemBox.querySelector('.app-price-input');
                    priceInput.addEventListener('input', (e) => {
                        app.price = e.target.value;
                        updateCanvasLive();
                    });

                    const urlInput = itemBox.querySelector('.app-url-input');
                    urlInput.addEventListener('input', (e) => {
                        app.appUrl = e.target.value;
                        updateCanvasLive();
                    });

                    // Up / Down / Delete listeners
                    const upBtn = itemBox.querySelector('.btn-app-up');
                    if (upBtn && idx > 0) {
                        upBtn.addEventListener('click', () => {
                            const temp = d.apps[idx];
                            d.apps[idx] = d.apps[idx - 1];
                            d.apps[idx - 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const downBtn = itemBox.querySelector('.btn-app-down');
                    if (downBtn && idx < d.apps.length - 1) {
                        downBtn.addEventListener('click', () => {
                            const temp = d.apps[idx];
                            d.apps[idx] = d.apps[idx + 1];
                            d.apps[idx + 1] = temp;
                            renderPropertyInspector();
                            updateCanvasLive();
                        });
                    }

                    const delBtn = itemBox.querySelector('.btn-app-del');
                    delBtn.addEventListener('click', () => {
                        d.apps.splice(idx, 1);
                        renderPropertyInspector();
                        updateCanvasLive();
                    });

                    list.appendChild(itemBox);
                });

                const sampleBanners = [
                    'https://apps.odoocdn.com/apps/assets/16.0/evo_call_recording_transcript/banner.png',
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
                ];

                const addAppFn = () => {
                    const defaultBanner = sampleBanners[d.apps.length % sampleBanners.length];
                    d.apps.push({
                        bannerUrl: defaultBanner,
                        title: 'New Odoo Module',
                        company: (d.apps.length > 0 && d.apps[0].company) ? d.apps[0].company : 'My Company',
                        price: '$ 49',
                        appUrl: 'https://apps.odoo.com/apps/modules'
                    });
                    renderPropertyInspector();
                    updateCanvasLive();
                    showToast('Added new app with network banner');
                };

                grp.querySelector('#btn-add-app-card').addEventListener('click', addAppFn);
                grp.querySelector('#btn-add-app-card-bottom').addEventListener('click', addAppFn);

                form.appendChild(grp);
            }

            container.appendChild(form);
        }

        function createInputField(label, value, onInput) {
            const grp = document.createElement('div');
            grp.className = 'form-group';
            grp.innerHTML = `
                <label class="form-label">${escapeHTML(label)}</label>
                <input type="text" class="form-input" value="${escapeHTML(value || '')}">
            `;
            grp.querySelector('input').addEventListener('input', (e) => onInput(e.target.value));
            return grp;
        }

        function createTextareaField(label, value, onInput) {
            const grp = document.createElement('div');
            grp.className = 'form-group';
            grp.innerHTML = `
                <label class="form-label">${escapeHTML(label)}</label>
                <textarea class="form-textarea">${escapeHTML(value || '')}</textarea>
            `;
            grp.querySelector('textarea').addEventListener('input', (e) => onInput(e.target.value));
            return grp;
        }

        function createColorField(label, value, onInput) {
            const grp = document.createElement('div');
            grp.className = 'form-group';
            
            // Convert to valid 7-character hex for native input[type="color"]
            let safeHex = '#714B67';
            if (typeof value === 'string') {
                const hexMatch = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
                if (hexMatch) {
                    const h = hexMatch[1];
                    safeHex = h.length === 3 ? '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : '#' + h;
                }
            }

            grp.innerHTML = `
                <label class="form-label">${escapeHTML(label)}</label>
                <div class="color-row">
                    <input type="color" class="color-picker-input" value="${safeHex}">
                    <input type="text" class="form-input" value="${escapeHTML(value || '')}">
                </div>
            `;
            const picker = grp.querySelector('input[type="color"]');
            const text = grp.querySelector('input[type="text"]');
            picker.addEventListener('input', (e) => {
                text.value = e.target.value;
                onInput(e.target.value);
            });
            text.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                const hexMatch = val.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
                if (hexMatch) {
                    const h = hexMatch[1];
                    picker.value = h.length === 3 ? '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : '#' + h;
                }
                onInput(val);
            });
            return grp;
        }

        function renderGlobalSettingsPanel() {
            const container = document.getElementById('props-container');
            container.innerHTML = `
                <div class="form-group">
                    <label class="form-label">Module App Name</label>
                    <input type="text" class="form-input" id="g-app-name" value="${escapeHTML(pageSettings.appName)}">
                </div>
                <div class="form-group">
                    <label class="form-label">Technical Module Name</label>
                    <input type="text" class="form-input" id="g-tech-name" value="${escapeHTML(pageSettings.technicalName)}">
                </div>
                <div class="form-group">
                    <label class="form-label">Primary Brand Color</label>
                    <div class="color-row">
                        <input type="color" class="color-picker-input" id="g-brand-picker" value="${pageSettings.brandColor}">
                        <input type="text" class="form-input" id="g-brand-text" value="${pageSettings.brandColor}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Secondary / Accent Color</label>
                    <div class="color-row">
                        <input type="color" class="color-picker-input" id="g-accent-picker" value="${pageSettings.accentColor}">
                        <input type="text" class="form-input" id="g-accent-text" value="${pageSettings.accentColor}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Preset Color Palettes</label>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="applyPalette('#714B67', '#00A09D')">Odoo Classic</button>
                        <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="applyPalette('#2563eb', '#38bdf8')">Ocean Blue</button>
                        <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="applyPalette('#059669', '#10b981')">Emerald</button>
                        <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="applyPalette('#d97706', '#f59e0b')">Amber</button>
                    </div>
                </div>
            `;

            document.getElementById('g-app-name').addEventListener('input', (e) => { pageSettings.appName = e.target.value; updateTemplateHeaderDisplay(); });
            document.getElementById('g-tech-name').addEventListener('input', (e) => { pageSettings.technicalName = e.target.value; });
            
            const bp = document.getElementById('g-brand-picker');
            const bt = document.getElementById('g-brand-text');
            bp.addEventListener('input', (e) => { bt.value = e.target.value; pageSettings.brandColor = e.target.value; updateCanvasLive(); });
            bt.addEventListener('input', (e) => { bp.value = e.target.value; pageSettings.brandColor = e.target.value; updateCanvasLive(); });

            const ap = document.getElementById('g-accent-picker');
            const at = document.getElementById('g-accent-text');
            ap.addEventListener('input', (e) => { at.value = e.target.value; pageSettings.accentColor = e.target.value; updateCanvasLive(); });
            at.addEventListener('input', (e) => { ap.value = e.target.value; pageSettings.accentColor = e.target.value; updateCanvasLive(); });
        }

        function applyPalette(brand, accent) {
            pageSettings.brandColor = brand;
            pageSettings.accentColor = accent;
            renderGlobalSettingsPanel();
            updateCanvasLive();
            showToast('Applied color palette');
        }

        function updateCanvasLive() {
            renderCanvas();
        }

        function setViewport(vp) {
            currentViewport = vp;
            document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('view-' + vp).classList.add('active');

            const wrapper = document.getElementById('canvas-root');
            wrapper.classList.remove('tablet', 'mobile');
            if (vp === 'tablet') wrapper.classList.add('tablet');
            if (vp === 'mobile') wrapper.classList.add('mobile');
        }

        // LOAD STARTER TEMPLATES
        function loadTemplate(name, silent = false) {
            closeModal('templates-modal');
            if (name === 'blank') {
                activeWidgets = [];
                selectedWidgetId = null;
            } else if (name === 'utility') {
                activeWidgets = [
                    createWidgetInstance('minimal_header'),
                    createWidgetInstance('desktop_showcase'),
                    createWidgetInstance('support_banner')
                ];
                selectedWidgetId = activeWidgets[0].id;
            } else {
                // Full pro layout
                activeWidgets = [
                    createWidgetInstance('hero_banner'),
                    createWidgetInstance('highlights_grid'),
                    createWidgetInstance('mobile_showcase'),
                    createWidgetInstance('desktop_showcase'),
                    createWidgetInstance('vs_table'),
                    createWidgetInstance('faq_section'),
                    createWidgetInstance('other_apps'),
                    createWidgetInstance('support_banner')
                ];
                selectedWidgetId = activeWidgets[0].id;
            }
            renderCanvas();
            renderPropertyInspector();
            if (!silent) {
                showToast(`Loaded template: ${name}`);
            }
        }

        function createWidgetInstance(type) {
            let found = null;
            for (const cat of WIDGET_CATALOG) {
                const w = cat.widgets.find(x => x.type === type);
                if (w) { found = w; break; }
            }
            if (!found) return null;
            return {
                id: 'w_' + Math.floor(Math.random() * 1000000),
                type: found.type,
                name: found.name,
                data: JSON.parse(JSON.stringify(found.defaultData))
            };
        }

        // ==========================================
        // TEMPLATE PERSISTENCE & BACKEND INTEGRATION
        // ==========================================

        function updateTemplateHeaderDisplay() {
            const statusTag = document.getElementById('template-status-tag');
            const nameDisplay = document.getElementById('template-name-display');
            if (statusTag) {
                if (currentTemplateId) {
                    statusTag.textContent = `#${currentTemplateId} SAVED`;
                    statusTag.style.background = '#dcfce7';
                    statusTag.style.color = '#15803d';
                } else {
                    statusTag.textContent = 'NEW';
                    statusTag.style.background = '#e0f2fe';
                    statusTag.style.color = '#0369a1';
                }
            }
            if (nameDisplay) {
                nameDisplay.textContent = (pageSettings.appName || 'My Custom App').trim();
            }
        }

        async function saveCurrentTemplate() {
            const saveBtn = document.getElementById('btn-save-template');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
            }

            try {
                const payload = {
                    jsonrpc: "2.0",
                    method: "call",
                    params: {
                        template_id: currentTemplateId ? parseInt(currentTemplateId) : null,
                        name: (pageSettings.appName || 'My Awesome App').trim(),
                        technical_name: (pageSettings.technicalName || '').trim(),
                        odoo_version: pageSettings.odooVersion || '20.0',
                        schema_json: JSON.stringify(activeWidgets),
                        html_content: compileFinalAppStoreHTML(false)
                    }
                };

                const response = await fetch('/index_file_maker/save_template', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const resData = await response.json();
                const result = resData.result;

                if (result && result.status === 'success') {
                    currentTemplateId = result.id;
                    currentTemplateName = result.name;
                    updateTemplateHeaderDisplay();
                    if (result.is_new) {
                        showToast(`Saved as new template: "${result.name}" (ID: #${result.id})`);
                    } else {
                        showToast(`Template "${result.name}" updated successfully!`);
                    }
                } else {
                    const errMsg = (resData.error && resData.error.message) || 'Could not save template';
                    showToast('Save error: ' + errMsg);
                }
            } catch (err) {
                console.error('Save failed:', err);
                showToast('Error saving template: ' + err.message);
            } finally {
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fa fa-floppy-o"></i> Save';
                }
            }
        }

        async function loadTemplateFromBackend(id) {
            try {
                showToast(`Loading template #${id}...`);
                const payload = {
                    jsonrpc: "2.0",
                    method: "call",
                    params: { template_id: parseInt(id) }
                };

                const response = await fetch('/index_file_maker/get_template', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const resData = await response.json();
                const t = resData.result;

                if (t && !t.error) {
                    currentTemplateId = t.id;
                    currentTemplateName = t.name;
                    pageSettings.appName = t.name || 'Untitled App';
                    pageSettings.technicalName = t.technical_name || '';
                    pageSettings.odooVersion = t.odoo_version || '20.0';

                    if (t.schema_json && t.schema_json.trim() !== '[]') {
                        try {
                            activeWidgets = JSON.parse(t.schema_json);
                            selectedWidgetId = (activeWidgets && activeWidgets.length > 0) ? activeWidgets[0].id : null;
                        } catch (e) {
                            console.warn('Could not parse schema JSON, loading full starter', e);
                            loadTemplate('full');
                        }
                    } else {
                        loadTemplate('full');
                    }

                    renderWidgetCatalog();
                    renderCanvas();
                    renderPropertyInspector();
                    renderGlobalSettingsPanel();
                    updateTemplateHeaderDisplay();
                    showToast(`Loaded template: "${t.name}"`);
                } else {
                    showToast('Template not found or error loading.');
                    renderWidgetCatalog();
                    loadTemplate('full');
                    renderGlobalSettingsPanel();
                    updateTemplateHeaderDisplay();
                }
            } catch (err) {
                console.error('Error fetching template:', err);
                showToast('Failed to load template from Odoo.');
                renderWidgetCatalog();
                loadTemplate('full');
                renderGlobalSettingsPanel();
                updateTemplateHeaderDisplay();
            }
        }

        function startNewTemplate() {
            currentTemplateId = null;
            currentTemplateName = 'My Custom Odoo 20 App';
            pageSettings.appName = 'My Custom Odoo 20 App';
            pageSettings.technicalName = 'my_custom_app';
            loadTemplate('blank');
            updateTemplateHeaderDisplay();
            renderGlobalSettingsPanel();
            showToast('New blank template created. Start dragging widgets from the library!');
        }

        async function openSavedTemplatesModal() {
            openModal('saved-templates-modal');
            const container = document.getElementById('saved-templates-list-container');
            if (!container) return;
            container.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #94a3b8;">
                    <i class="fa fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 8px; display: block; color: var(--primary);"></i>
                    Loading saved templates from Odoo...
                </div>
            `;

            try {
                const payload = {
                    jsonrpc: "2.0",
                    method: "call",
                    params: {}
                };
                const response = await fetch('/index_file_maker/list_templates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const resData = await response.json();
                const templates = (resData.result && resData.result.templates) || [];

                if (templates.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 30px; color: #64748b; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
                            <i class="fa fa-folder-open-o" style="font-size: 32px; color: #94a3b8; margin-bottom: 8px; display: block;"></i>
                            <p style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">No saved templates yet</p>
                            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Click "Save" on the top bar to save your current design into Odoo!</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = '';
                templates.forEach(t => {
                    const isCurrent = currentTemplateId && parseInt(currentTemplateId) === parseInt(t.id);
                    const card = document.createElement('div');
                    card.className = 'item-card';
                    card.style.cssText = `display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: ${isCurrent ? '#f0fdf4' : '#ffffff'}; border: 1px solid ${isCurrent ? '#86efac' : '#e2e8f0'}; border-radius: 8px;`;
                    card.innerHTML = `
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <span style="font-size: 11px; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">#${t.id}</span>
                                <strong style="font-size: 14px; color: var(--text-main); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeHTML(t.name)}</strong>
                                ${isCurrent ? `<span style="font-size: 10px; font-weight: 700; background: #22c55e; color: #ffffff; padding: 2px 6px; border-radius: 10px;">ACTIVE</span>` : ''}
                            </div>
                            <div style="display: flex; gap: 12px; font-size: 11px; color: #64748b;">
                                <span><i class="fa fa-cube" style="color: #94a3b8;"></i> ${escapeHTML(t.technical_name || 'custom_module')}</span>
                                <span><i class="fa fa-calendar" style="color: #94a3b8;"></i> ${escapeHTML((t.write_date || '').slice(0, 16))}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px; margin-left: 12px;">
                            <button class="btn btn-primary" style="font-size: 12px; padding: 5px 12px; white-space: nowrap;" onclick="loadTemplateFromBackend(${t.id}); closeModal('saved-templates-modal');">
                                <i class="fa fa-pencil"></i> Open in Builder
                            </button>
                            <button class="btn btn-outline" style="font-size: 12px; padding: 5px 8px; color: #ef4444; border-color: #fca5a5;" title="Delete Template" onclick="deleteTemplateFromBackend(${t.id}, '${escapeHTML(t.name)}')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            } catch (err) {
                console.error('Failed to list templates:', err);
                container.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #ef4444;">
                        <i class="fa fa-exclamation-triangle"></i> Failed to load templates from Odoo.
                    </div>
                `;
            }
        }

        async function deleteTemplateFromBackend(id, name) {
            if (!confirm(`Are you sure you want to delete template "${name}" (ID #${id})?`)) {
                return;
            }
            try {
                const payload = {
                    jsonrpc: "2.0",
                    method: "call",
                    params: { template_id: parseInt(id) }
                };
                await fetch('/index_file_maker/delete_template', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                showToast(`Template #${id} deleted.`);
                if (currentTemplateId && parseInt(currentTemplateId) === parseInt(id)) {
                    currentTemplateId = null;
                    updateTemplateHeaderDisplay();
                }
                openSavedTemplatesModal();
            } catch (e) {
                showToast('Error deleting template.');
            }
        }
