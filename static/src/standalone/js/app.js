// Odoo AppStore Index Maker - Core Application Logic

// State variables
        let selectedWidgetId = null;
        let activeLeftTab = 'props';
        let currentViewport = 'desktop';

        let pageSettings = {
            appName: 'Advanced Sales Commission Pro',
            technicalName: 'sale_commission_pro',
            odooVersion: '20.0',
            brandColor: '#714B67',
            accentColor: '#00A09D',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        };

// Active widget list in canvas
        let activeWidgets = [];

        // INITIALIZE APP
        document.addEventListener('DOMContentLoaded', () => {
            renderWidgetCatalog();
            loadTemplate('full');
            renderGlobalSettingsPanel();
        });

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
                        <p style="max-width: 420px; margin-bottom: 24px; font-size: 14px;">Drag widgets from the right library or choose a starter template to begin designing your Odoo App Store description.</p>
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
            if (d.title !== undefined && widget.type !== 'highlights_grid') {
                form.appendChild(createInputField('Title', d.title, (val) => { d.title = val; updateCanvasLive(); }));
            }

            // Subtitle
            if (d.subtitle !== undefined && widget.type !== 'highlights_grid') {
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
            if (d.badge !== undefined) {
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

            // Badge Colors
            if (d.badgeBgColor !== undefined) {
                form.appendChild(createInputField('Badge Background (CSS / RGBA)', d.badgeBgColor, (val) => { d.badgeBgColor = val; updateCanvasLive(); }));
            }
            if (d.badgeTextColor !== undefined) {
                form.appendChild(createColorField('Badge Text Color', d.badgeTextColor, (val) => { d.badgeTextColor = val; updateCanvasLive(); }));
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
            if (d.desc !== undefined) {
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
            if (d.imageUrl !== undefined) {
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

            // Colors (for widgets other than highlights_grid)
            if (widget.type !== 'highlights_grid') {
                if (d.bgColor !== undefined) {
                    form.appendChild(createColorField('Background Color', d.bgColor, (val) => { d.bgColor = val; updateCanvasLive(); }));
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

                const PRESET_ICONS = [
                    { name: 'fa fa-home', label: '🏠 Home' },
                    { name: 'fa fa-bolt', label: '⚡ Bolt' },
                    { name: 'fa fa-building', label: '🏢 Company' },
                    { name: 'fa fa-shield', label: '🛡️ Security' },
                    { name: 'fa fa-cogs', label: '⚙️ Settings' },
                    { name: 'fa fa-star', label: '⭐ Star' },
                    { name: 'fa fa-rocket', label: '🚀 Rocket' },
                    { name: 'fa fa-users', label: '👥 Team' },
                    { name: 'fa fa-lock', label: '🔒 Lock' },
                    { name: 'fa fa-check-circle', label: '✅ Check' },
                    { name: 'fa fa-line-chart', label: '📊 Chart' },
                    { name: 'fa fa-cloud', label: '☁️ Cloud' },
                    { name: 'fa fa-mobile', label: '📱 Mobile' },
                    { name: 'fa fa-heart', label: '💖 Heart' },
                    { name: 'fa fa-clock-o', label: '🕒 Realtime' },
                    { name: 'fa fa-headphones', label: '🎧 Support' },
                    { name: 'fa fa-database', label: '🗄️ Database' }
                ];

                const list = grp.querySelector('#highlights-items-list');
                d.items.forEach((item, idx) => {
                    const itemBox = document.createElement('div');
                    itemBox.className = 'item-card';
                    itemBox.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.03);';
                    
                    const curIcon = (item.icon || 'fa fa-bolt').toLowerCase().trim();
                    const presetBtns = PRESET_ICONS.map(p => {
                        const isSel = curIcon === p.name || curIcon === p.name.replace(/^fa\s+fa-/, '') || curIcon === `fa-${p.name.replace(/^fa\s+fa-/, '')}`;
                        return `
                            <button type="button" class="icon-preset-btn" data-icon="${p.name}" style="font-size: 10px; padding: 4px 6px; border: 1px solid ${isSel ? 'var(--primary)' : '#cbd5e1'}; border-radius: 4px; background: ${isSel ? '#f5eff4' : '#f8fafc'}; color: ${isSel ? 'var(--primary)' : '#475569'}; cursor: pointer; font-weight: ${isSel ? '700' : '500'};">
                                ${p.label}
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

                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; margin-top: 8px;">
                            <label style="font-size: 10px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                <span>Icon Selection</span>
                                <span class="hl-icon-preview-box" style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: ${d.iconBgColor || 'rgba(113,75,103,0.1)'}; color: ${d.accentColor || '#714B67'}; border-radius: 6px;">
                                    ${item.iconUrl ? `<img src="${item.iconUrl}" style="width: 18px; height: 18px; object-fit: contain;">` : renderSafeIcon(item.icon, 'fa fa-bolt')}
                                </span>
                            </label>

                            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Preset Icons:</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                                ${presetBtns}
                            </div>

                            <div style="margin-bottom: 6px;">
                                <label style="font-size: 9px; color: var(--text-muted); display: block; margin-bottom: 2px;">FontAwesome Icon Class (e.g. fa fa-home)</label>
                                <input type="text" class="form-input card-icon-input" value="${escapeHTML(item.icon || 'fa fa-bolt')}" placeholder="e.g. fa fa-home, fa-star, fa fa-check" style="font-size: 11px; padding: 4px 8px;">
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
                                previewBox.innerHTML = `<img src="${item.iconUrl}" style="width: 18px; height: 18px; object-fit: contain;">`;
                            } else {
                                previewBox.innerHTML = renderSafeIcon(item.icon, 'fa fa-bolt');
                            }
                        }
                    }

                    itemBox.querySelectorAll('.icon-preset-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const selectedIcon = btn.getAttribute('data-icon');
                            item.icon = selectedIcon;
                            item.iconUrl = '';
                            iconInput.value = selectedIcon;
                            iconUrlInput.value = '';
                            itemBox.querySelectorAll('.icon-preset-btn').forEach(b => {
                                b.style.borderColor = '#cbd5e1';
                                b.style.background = '#f8fafc';
                                b.style.color = '#475569';
                                b.style.fontWeight = '500';
                            });
                            btn.style.borderColor = 'var(--primary)';
                            btn.style.background = '#f5eff4';
                            btn.style.color = 'var(--primary)';
                            btn.style.fontWeight = '700';
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

            // 2. FAQs
            if (d.faqs !== undefined) {
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

            // 3. Support Contacts
            if (d.email !== undefined) {
                form.appendChild(createInputField('Support Email', d.email, (val) => { d.email = val; updateCanvasLive(); }));
            }
            if (d.skype !== undefined) {
                form.appendChild(createInputField('Skype / Teams', d.skype, (val) => { d.skype = val; updateCanvasLive(); }));
            }
            if (d.whatsapp !== undefined) {
                form.appendChild(createInputField('WhatsApp / Phone', d.whatsapp, (val) => { d.whatsapp = val; updateCanvasLive(); }));
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
            grp.innerHTML = `
                <label class="form-label">${escapeHTML(label)}</label>
                <div class="color-row">
                    <input type="color" class="color-picker-input" value="${value || '#714B67'}">
                    <input type="text" class="form-input" value="${value || '#714B67'}">
                </div>
            `;
            const picker = grp.querySelector('input[type="color"]');
            const text = grp.querySelector('input[type="text"]');
            picker.addEventListener('input', (e) => {
                text.value = e.target.value;
                onInput(e.target.value);
            });
            text.addEventListener('input', (e) => {
                picker.value = e.target.value;
                onInput(e.target.value);
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

            document.getElementById('g-app-name').addEventListener('input', (e) => { pageSettings.appName = e.target.value; });
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
        function loadTemplate(name) {
            closeModal('templates-modal');
            if (name === 'blank') {
                activeWidgets = [];
                selectedWidgetId = null;
            } else if (name === 'utility') {
                activeWidgets = [
                    createWidgetInstance('minimal_header'),
                    createWidgetInstance('feature_cards_3'),
                    createWidgetInstance('screenshot_showcase'),
                    createWidgetInstance('support_banner')
                ];
                selectedWidgetId = activeWidgets[0].id;
            } else {
                // Full pro layout
                activeWidgets = [
                    createWidgetInstance('hero_banner'),
                    createWidgetInstance('highlights_grid'),
                    createWidgetInstance('feature_split_right'),
                    createWidgetInstance('feature_cards_3'),
                    createWidgetInstance('screenshot_showcase'),
                    createWidgetInstance('edition_matrix'),
                    createWidgetInstance('faq_section'),
                    createWidgetInstance('support_banner')
                ];
                selectedWidgetId = activeWidgets[0].id;
            }
            renderCanvas();
            renderPropertyInspector();
            showToast(`Loaded template: ${name}`);
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
