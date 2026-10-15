// Odoo AppStore Index Maker - HTML Generator & Exporter
// Strictly compliant with Odoo App Store Sanitizer Rules
// Reference: https://github.com/apexive/odoo-llm/blob/18.0/ODOO_APP_STORE_HTML_GUIDE.md

// Local Odoo FontAwesome + any FA stylesheet already loaded in parent page.
// Used ONLY for the Live Simulator (preview iframe). Download output stays clean.
function getFontAwesomeLinks() {
    const links = [];
    try {
        links.push(new URL('/web/static/lib/fontawesome/css/font-awesome.css', window.location.origin).href);
    } catch (e) { /* ignore */ }
    document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
        if (/awesome/i.test(l.href) && !links.includes(l.href)) links.push(l.href);
    });
    return links;
}

function formatFaIconClass(iconStr, defaultClass = 'fa fa-bolt') {
    if (!iconStr) return defaultClass;
    let s = String(iconStr).trim();
    if (!s) return defaultClass;

    // Normalize modern Font Awesome prefixes (fas, far, fal, fad, fab) to fa
    s = s.replace(/^(fas|far|fal|fad|fab)\s+/i, 'fa ');

    // If already full class string e.g. 'fa fa-home' or 'fa fa-home fa-2x'
    if (/^fa\s+fa-[\w-]+/i.test(s)) {
        return s;
    }
    // If 'fa-home' -> 'fa fa-home'
    if (/^fa-[\w-]+/i.test(s)) {
        return `fa ${s}`;
    }
    // If 'fa home' -> 'fa fa-home'
    if (/^fa\s+[\w-]+/i.test(s)) {
        const name = s.replace(/^fa\s+/i, '').trim();
        return `fa fa-${name}`;
    }
    // If just icon name 'home', 'bolt', 'cogs'
    const clean = s.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    return clean ? `fa fa-${clean}` : defaultClass;
}

const KNOWN_OI_ICONS = new Set([
    'person', 'group', 'search', 'menu', 'dashboard', 'notifications', 'notifications_active',
    'campaign', 'chat', 'forum', 'email', 'event', 'calendar_month', 'task_alt',
    'check_circle', 'cancel', 'delete', 'edit', 'add', 'close', 'refresh', 'download',
    'upload', 'attach_file', 'folder', 'description', 'business', 'lock', 'help',
    'favorite', 'schedule', 'progress_activity'
]);

function renderSafeIcon(iconStr, defaultIcon = '<i class="oi" data-icon="task_alt"></i>') {
    if (!iconStr) iconStr = defaultIcon;
    const str = String(iconStr).trim();
    if (str.startsWith('<svg') || str.startsWith('<img') || str.startsWith('data:image')) {
        return str;
    }
    if (str.startsWith('http://') || str.startsWith('https://') || str.endsWith('.png') || str.endsWith('.svg') || str.endsWith('.jpg') || str.endsWith('.webp')) {
        return `<img src="${str}" alt="icon" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">`;
    }
    // If it's already an HTML element e.g. <i class="oi" data-icon="person"></i> or <i class="fa ..."></i>
    if (/^<i\s+[^>]*>/i.test(str)) {
        return str;
    }
    // If it has data-icon attribute in text e.g. data-icon="person"
    const dataIconMatch = str.match(/data-icon=["']([^"']+)["']/i);
    if (dataIconMatch) {
        return `<i class="oi" data-icon="${dataIconMatch[1]}" style="font-size: 24px; vertical-align: middle; color: inherit;"></i>`;
    }
    // If it's prefixed with oi: or oi- e.g. oi:person or oi-person
    const oiPrefixMatch = str.match(/^oi[:\s-]+([\w-]+)/i);
    if (oiPrefixMatch) {
        return `<i class="oi" data-icon="${oiPrefixMatch[1]}" style="font-size: 24px; vertical-align: middle; color: inherit;"></i>`;
    }
    // If it's one of the known OI icons
    const cleanLower = str.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (KNOWN_OI_ICONS.has(cleanLower)) {
        return `<i class="oi" data-icon="${cleanLower}" style="font-size: 24px; vertical-align: middle; color: inherit;"></i>`;
    }
    const faClass = formatFaIconClass(str, 'fa fa-bolt');
    return `<i class="${faClass}" style="font-size: 22px; vertical-align: middle; color: inherit;"></i>`;
}

// HTML GENERATOR FOR LIVE & DOWNLOAD
function renderWidgetHtml(widget) {
    const d = widget.data || {};
    const type = widget.type;
    const globalBrand = (window.pageSettings && window.pageSettings.brandColor) || '#714B67';
    const globalAccent = (window.pageSettings && window.pageSettings.accentColor) || '#00A09D';

    switch (type) {
        case 'hero_banner': {
            const bg = d.bgColor || globalBrand || '#714B67';
            const textCol = d.textColor || '#ffffff';
            const accent = d.accentColor || globalAccent || '#00A09D';
            const badgeBg = d.badgeBgColor || '#ffffff';
            let badgeColor = d.badgeTextColor || '#714B67';
            // Auto-heal white on white legacy issue
            if ((badgeBg.toLowerCase() === '#ffffff' || badgeBg.toLowerCase() === '#f5efff') && (!d.badgeTextColor || d.badgeTextColor.toLowerCase() === '#ffffff')) {
                badgeColor = d.bgColor || globalBrand || '#714B67';
            }
            const badgeBorder = d.badgeBorderColor || (badgeBg.toLowerCase() === '#ffffff' ? '#e2e8f0' : 'transparent');
            const badgesHTML = (d.badges || []).map(b =>
                `<span class="mx-1 my-1" style="background-color: ${badgeBg}; color: ${badgeColor}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; border: 1px solid ${badgeBorder};">${escapeHTML(b)}</span>`
            ).join(' ');

            return `<section class="py-5 text-center" style="background-color: ${bg}; color: ${textCol};">
    <div class="container py-3">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-10">
                ${d.iconUrl ? `<div class="mb-3"><img src="${d.iconUrl}" alt="App Icon" style="width: 80px; height: 80px; border-radius: 18px; object-fit: contain; background-color: #ffffff; padding: 8px; border: 1px solid #e2e8f0;"/></div>` : ''}
                <h1 style="font-size: 40px; font-weight: 700; line-height: 1.25; margin-bottom: 16px; color: ${textCol} !important;">
                    ${escapeHTML(d.title || 'App Title')}
                </h1>
                <p style="font-size: 18px; max-width: 780px; margin: 0 auto 28px auto; opacity: 0.95; line-height: 1.6; color: ${textCol} !important;">
                    ${escapeHTML(d.subtitle || '')}
                </p>
                ${d.showBadges && badgesHTML ? `<div class="mb-4 d-flex flex-wrap justify-content-center">${badgesHTML}</div>` : ''}
                <div class="d-flex flex-wrap justify-content-center mt-3">
                    ${d.primaryBtnText ? `<span class="mx-2 mb-2" style="background-color: ${accent}; color: #ffffff; padding: 12px 30px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block;">${escapeHTML(d.primaryBtnText)}</span>` : ''}
                    ${d.secondaryBtnText ? `<span class="mx-2 mb-2" style="background-color: #ffffff; color: ${bg}; border: 1px solid #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">${escapeHTML(d.secondaryBtnText)}</span>` : ''}
                </div>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'minimal_header': {
            const bg = d.bgColor || '#ffffff';
            const accent = d.accentColor || globalBrand || '#714B67';
            return `<section class="py-5 text-center" style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">
    <div class="container py-2">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8">
                ${d.badge ? `<span style="background-color: #f5efff; color: ${accent}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${escapeHTML(d.badge)}</span>` : ''}
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-top: 14px; margin-bottom: 12px;">${escapeHTML(d.title || '')}</h2>
                <p style="font-size: 16px; color: #64748b; margin: 0 auto; max-width: 680px; line-height: 1.6;">${escapeHTML(d.subtitle || '')}</p>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'discount_ribbon': {
            const bg = d.bgColor || '#f59e0b';
            const textCol = d.textColor || '#ffffff';
            return `<section class="py-2 text-center" style="background-color: ${bg}; color: ${textCol}; font-weight: 600; font-size: 15px;">
    <div class="container d-flex flex-wrap align-items-center justify-content-center">
        <span class="mx-2 my-1">${escapeHTML(d.text || '')}</span>
        ${d.btnText ? `<span class="mx-2 my-1" style="background-color: #ffffff; color: ${bg}; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">${escapeHTML(d.btnText)}</span>` : ''}
    </div>
</section>`;
        }

        case 'highlights_grid': {
            const bg = d.bgColor || '#ffffff';
            const iconColor = d.accentColor || globalBrand || '#714B67';
            const iconBg = d.iconBgColor && !d.iconBgColor.includes('rgba') ? d.iconBgColor : '#f5efff';
            const cardBg = d.cardBgColor || '#ffffff';
            const cardBorder = d.cardBorderColor || '#e2e8f0';
            const titleCol = d.titleColor || '#1e293b';
            const subtitleCol = d.subtitleColor || '#64748b';
            const cols = parseInt(d.columns) || 4;
            const colClass = cols === 2 ? 'col-12 col-md-6 mb-4' : (cols === 3 ? 'col-12 col-md-4 mb-4' : 'col-12 col-sm-6 col-md-3 mb-4');
            const items = d.items || [];

            const cardsHTML = items.map(it => {
                let iconHtml = '';
                if (it.iconUrl) {
                    iconHtml = `<img src="${it.iconUrl}" alt="icon" style="width: 26px; height: 26px; object-fit: contain; vertical-align: middle;">`;
                } else {
                    iconHtml = renderSafeIcon(it.icon, 'fa fa-bolt');
                }

                return `
            <div class="${colClass}">
                <div class="card h-100 shadow-sm" style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px;">
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="mb-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px; border-radius: 12px; background-color: ${iconBg}; color: ${iconColor} !important; font-size: 22px;">
                            ${iconHtml}
                        </div>
                        <h4 style="font-size: 18px; font-weight: 700; color: ${it.titleColor || '#1e293b'} !important; margin: 0 0 8px 0; line-height: 1.35;">${escapeHTML(it.title || '')}</h4>
                        <p style="font-size: 14px; color: ${it.descColor || '#64748b'} !important; margin: 0; line-height: 1.5; flex: 1;">${escapeHTML(it.desc || '')}</p>
                    </div>
                </div>
            </div>`;
            }).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        ${d.title ? `<div class="row justify-content-center text-center mb-5">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: ${titleCol} !important; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: ${subtitleCol} !important; margin: 0 auto; line-height: 1.6;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row">${cardsHTML}</div>
    </div>
</section>`;
        }

        case 'stats_counter': {
            const bg = d.bgColor || '#f8f9fa';
            const stats = d.stats || [];
            const colsHTML = stats.map(st => `
            <div class="col-12 col-md-4 mb-3 text-center">
                <div class="card h-100 shadow-sm" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <div class="card-body p-4">
                        ${st.icon ? `<div class="mb-2" style="font-size: 24px; color: ${globalBrand} !important;">${renderSafeIcon(st.icon, 'fa fa-star')}</div>` : ''}
                        <div style="font-size: 32px; font-weight: 700; color: ${globalBrand} !important; margin-bottom: 4px;">${escapeHTML(st.number)}</div>
                        <div style="font-size: 15px; font-weight: 600; color: #64748b !important;">${escapeHTML(st.label)}</div>
                    </div>
                </div>
            </div>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-2">
        <div class="row justify-content-center">${colsHTML}</div>
    </div>
</section>`;
        }

        case 'feature_split_right': {
            const bg = d.bgColor || '#f8f9fa';
            const accent = d.accentColor || globalBrand || '#714B67';
            const bullets = (d.bulletItems || []).map(b => `
                <li class="d-flex align-items-start mb-3" style="font-size: 15px; color: #334155;">
                    <span class="me-3 mt-1" style="color: #10b981; font-size: 16px;"><i class="fa fa-check-circle"></i></span>
                    <span>${escapeHTML(b)}</span>
                </li>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        <div class="row align-items-center">
            <div class="col-12 col-lg-6 mb-4 mb-lg-0">
                ${d.badge ? `<span style="background-color: #f5efff; color: ${accent}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${escapeHTML(d.badge)}</span>` : ''}
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-top: 14px; margin-bottom: 16px; line-height: 1.3;">${escapeHTML(d.title || '')}</h2>
                <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 24px;">${escapeHTML(d.desc || '')}</p>
                <ul class="list-unstyled p-0 m-0">${bullets}</ul>
            </div>
            <div class="col-12 col-lg-6">
                <div class="card shadow-sm p-2 text-center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    ${d.imageUrl ? `<img src="${d.imageUrl}" alt="${escapeHTML(d.imageCaption || 'Screenshot')}" class="img-fluid" style="border-radius: 8px; display: block;"/>` : `
                    <div class="py-5 px-3" style="background-color: #f1f5f9; border-radius: 8px; color: #94a3b8;">
                        <i class="fa fa-picture-o" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                        <span style="font-size: 15px; font-weight: 600;">Feature Screenshot / Mockup</span>
                    </div>`}
                    ${d.imageCaption ? `<div class="mt-2" style="font-size: 13px; color: #94a3b8; font-weight: 500;">${escapeHTML(d.imageCaption)}</div>` : ''}
                </div>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'feature_split_left': {
            const bg = d.bgColor || '#ffffff';
            const accent = d.accentColor || globalAccent || '#00A09D';
            const bullets = (d.bulletItems || []).map(b => `
                <li class="d-flex align-items-start mb-3" style="font-size: 15px; color: #334155;">
                    <span class="me-3 mt-1" style="color: #10b981; font-size: 16px;"><i class="fa fa-check-circle"></i></span>
                    <span>${escapeHTML(b)}</span>
                </li>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        <div class="row align-items-center">
            <div class="col-12 col-lg-6 mb-4 mb-lg-0 order-2 order-lg-1">
                <div class="card shadow-sm p-2 text-center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    ${d.imageUrl ? `<img src="${d.imageUrl}" alt="${escapeHTML(d.imageCaption || 'Screenshot')}" class="img-fluid" style="border-radius: 8px; display: block;"/>` : `
                    <div class="py-5 px-3" style="background-color: #f1f5f9; border-radius: 8px; color: #94a3b8;">
                        <i class="fa fa-line-chart" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                        <span style="font-size: 15px; font-weight: 600;">Analytics / Dashboard Screenshot</span>
                    </div>`}
                    ${d.imageCaption ? `<div class="mt-2" style="font-size: 13px; color: #94a3b8; font-weight: 500;">${escapeHTML(d.imageCaption)}</div>` : ''}
                </div>
            </div>
            <div class="col-12 col-lg-6 order-1 order-lg-2">
                ${d.badge ? `<span style="background-color: #e6f6f6; color: ${accent}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${escapeHTML(d.badge)}</span>` : ''}
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-top: 14px; margin-bottom: 16px; line-height: 1.3;">${escapeHTML(d.title || '')}</h2>
                <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 24px;">${escapeHTML(d.desc || '')}</p>
                <ul class="list-unstyled p-0 m-0">${bullets}</ul>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'feature_cards_3': {
            const bg = d.bgColor || '#ffffff';
            const cards = d.cards || [];
            const cardsHTML = cards.map(c => `
            <div class="col-12 col-md-4 mb-4">
                <div class="card h-100 shadow-sm" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <div class="card-body p-4 d-flex flex-column">
                        ${c.badge ? `<div class="mb-3"><span style="background-color: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase;">${escapeHTML(c.badge)}</span></div>` : ''}
                        <div class="mb-3 d-inline-flex align-items-center justify-content-center" style="width: 48px; height: 48px; border-radius: 10px; background-color: #f5efff; color: ${globalBrand}; font-size: 20px;">
                            ${renderSafeIcon(c.icon, 'fa fa-check')}
                        </div>
                        <h4 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${escapeHTML(c.title)}</h4>
                        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; flex: 1;">${escapeHTML(c.desc)}</p>
                    </div>
                </div>
            </div>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        ${d.title ? `<div class="row justify-content-center text-center mb-5">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row">${cardsHTML}</div>
    </div>
</section>`;
        }

        case 'workflow_steps': {
            const bg = d.bgColor || '#f8f9fa';
            const steps = d.steps || [];
            const stepsHTML = steps.map(s => `
            <div class="col-12 col-md-4 mb-4">
                <div class="card h-100 shadow-sm text-center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <div class="card-body p-4">
                        <div class="mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; border-radius: 50%; background-color: ${globalBrand}; color: #ffffff; font-size: 18px; font-weight: 700;">
                            ${escapeHTML(s.num)}
                        </div>
                        <h4 style="font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">${escapeHTML(s.title)}</h4>
                        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0;">${escapeHTML(s.desc)}</p>
                    </div>
                </div>
            </div>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        ${d.title ? `<div class="row justify-content-center text-center mb-5">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row">${stepsHTML}</div>
    </div>
</section>`;
        }

        case 'screenshot_showcase': {
            const bg = d.bgColor || '#ffffff';
            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        ${d.title ? `<div class="row justify-content-center text-center mb-4">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="card shadow-sm overflow-hidden mt-4" style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px;">
            <div class="d-flex align-items-center justify-content-between px-3 py-2" style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                <div class="d-flex">
                    <span class="me-2" style="width: 12px; height: 12px; border-radius: 50%; background-color: #ef4444; display: inline-block;"></span>
                    <span class="me-2" style="width: 12px; height: 12px; border-radius: 50%; background-color: #f59e0b; display: inline-block;"></span>
                    <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #10b981; display: inline-block;"></span>
                </div>
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3px 20px; font-size: 12px; color: #64748b; font-weight: 500;">
                    ${escapeHTML(d.browserTitle || 'Odoo 20')}
                </div>
                <div style="width: 44px;"></div>
            </div>
            <div class="p-3 text-center" style="background-color: #fafafa;">
                ${d.imageUrl ? `<img src="${d.imageUrl}" alt="Full UI Screenshot" class="img-fluid" style="border-radius: 6px; display: block; border: 1px solid #e2e8f0;"/>` : `
                <div class="py-5 px-3" style="background-color: #f1f5f9; border-radius: 6px; color: #94a3b8;">
                    <i class="fa fa-desktop" style="font-size: 56px; margin-bottom: 14px; display: block;"></i>
                    <span style="font-size: 16px; font-weight: 600;">Main Screen Demonstration / High-Res Screenshot</span>
                </div>`}
            </div>
        </div>
        ${d.calloutText ? `<div class="text-center mt-3"><span style="font-size: 13px; color: #64748b; font-weight: 500;"><i class="fa fa-check text-success me-1"></i> ${escapeHTML(d.calloutText)}</span></div>` : ''}
    </div>
</section>`;
        }

        case 'screenshot_duo': {
            const bg = d.bgColor || '#f8f9fa';
            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3">
        ${d.title ? `<div class="row justify-content-center text-center mb-5"><div class="col-12"><h2 style="font-size: 32px; font-weight: 700; color: #1e293b;">${escapeHTML(d.title)}</h2></div></div>` : ''}
        <div class="row">
            <div class="col-12 col-md-6 mb-4">
                <div class="card h-100 shadow-sm p-3" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    ${d.col1Img ? `<img src="${d.col1Img}" alt="${escapeHTML(d.col1Title)}" class="img-fluid" style="border-radius: 6px; display: block;"/>` : `
                    <div class="py-5 px-3 text-center" style="background-color: #f1f5f9; border-radius: 6px; color: #94a3b8;"><i class="fa fa-image" style="font-size: 40px; display: block; margin-bottom: 10px;"></i><span>Screenshot 1</span></div>`}
                    <h4 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 14px; margin-bottom: 6px;">${escapeHTML(d.col1Title || '')}</h4>
                    <p style="font-size: 13px; color: #64748b; margin: 0;">${escapeHTML(d.col1Desc || '')}</p>
                </div>
            </div>
            <div class="col-12 col-md-6 mb-4">
                <div class="card h-100 shadow-sm p-3" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    ${d.col2Img ? `<img src="${d.col2Img}" alt="${escapeHTML(d.col2Title)}" class="img-fluid" style="border-radius: 6px; display: block;"/>` : `
                    <div class="py-5 px-3 text-center" style="background-color: #f1f5f9; border-radius: 6px; color: #94a3b8;"><i class="fa fa-image" style="font-size: 40px; display: block; margin-bottom: 10px;"></i><span>Screenshot 2</span></div>`}
                    <h4 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 14px; margin-bottom: 6px;">${escapeHTML(d.col2Title || '')}</h4>
                    <p style="font-size: 13px; color: #64748b; margin: 0;">${escapeHTML(d.col2Desc || '')}</p>
                </div>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'edition_matrix': {
            const bg = d.bgColor || '#ffffff';
            const rows = d.rows || [];
            const rowsHTML = rows.map(r => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 14px 18px; font-weight: 600; color: #1e293b;">${escapeHTML(r.feature)}</td>
                <td style="padding: 14px 18px; text-align: center;">${r.community ? '<i class="fa fa-check-circle" style="color: #10b981; font-size: 18px;"></i>' : '<i class="fa fa-times-circle" style="color: #cbd5e1; font-size: 18px;"></i>'}</td>
                <td style="padding: 14px 18px; text-align: center;">${r.enterprise ? '<i class="fa fa-check-circle" style="color: #10b981; font-size: 18px;"></i>' : '<i class="fa fa-times-circle" style="color: #cbd5e1; font-size: 18px;"></i>'}</td>
                <td style="padding: 14px 18px; text-align: center;">${r.odoosh ? '<i class="fa fa-check-circle" style="color: #10b981; font-size: 18px;"></i>' : '<i class="fa fa-times-circle" style="color: #cbd5e1; font-size: 18px;"></i>'}</td>
            </tr>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3" style="max-width: 960px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-5">
            <div class="col-12">
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="card shadow-sm overflow-hidden" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
            <table class="table table-borderless m-0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                        <th style="padding: 16px 18px; font-size: 14px; font-weight: 700; color: #475569;">Features &amp; Scope</th>
                        <th style="padding: 16px 18px; text-align: center; font-size: 14px; font-weight: 700; color: #475569;">Community</th>
                        <th style="padding: 16px 18px; text-align: center; font-size: 14px; font-weight: 700; color: #475569;">Enterprise</th>
                        <th style="padding: 16px 18px; text-align: center; font-size: 14px; font-weight: 700; color: #475569;">Odoo.sh</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
        </div>
    </div>
</section>`;
        }

        case 'faq_section': {
            const bg = d.bgColor || '#f8f9fa';
            const faqs = d.faqs || [];
            const faqsHTML = faqs.map(f => `
            <div class="card shadow-sm mb-3" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div class="card-body p-4">
                    <h4 class="d-flex align-items-center mb-2" style="font-size: 16px; font-weight: 700; color: #1e293b;">
                        <i class="fa fa-question-circle me-2" style="color: ${globalBrand}; font-size: 18px;"></i>
                        <span>${escapeHTML(f.q)}</span>
                    </h4>
                    <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; padding-left: 26px;">
                        ${escapeHTML(f.a)}
                    </p>
                </div>
            </div>`).join('');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-3" style="max-width: 900px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-5">
            <div class="col-12">
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div>${faqsHTML}</div>
    </div>
</section>`;
        }

        case 'testimonial_card': {
            const bg = d.bgColor || '#ffffff';
            return `<section class="py-5 text-center" style="background-color: ${bg};">
    <div class="container py-3" style="max-width: 820px;">
        <div class="card shadow-sm p-4 text-center" style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 16px;">
            <div class="mb-3" style="color: #facc15; font-size: 20px;">
                <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
            </div>
            <p style="font-size: 18px; font-weight: 500; font-style: italic; color: #1e293b; line-height: 1.6; margin-bottom: 20px;">
                &ldquo;${escapeHTML(d.quote || '')}&rdquo;
            </p>
            <div>
                <strong style="font-size: 16px; color: #1e293b; display: block;">${escapeHTML(d.author || '')}</strong>
                <span style="font-size: 14px; color: #64748b;">${escapeHTML(d.role || '')}${d.company ? ` &bull; ${escapeHTML(d.company)}` : ''}</span>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'support_banner': {
            const bg = d.bgColor || globalBrand || '#714B67';
            const textCol = d.textColor || '#ffffff';
            return `<section class="py-5 my-4" style="background-color: ${bg}; color: ${textCol}; border-radius: 16px;">
    <div class="container text-center py-3" style="max-width: 960px;">
        ${d.badge ? `<span style="background-color: #ffffff; color: ${bg}; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; display: inline-block; margin-bottom: 16px;">${escapeHTML(d.badge)}</span>` : ''}
        <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 14px; color: ${textCol} !important;">${escapeHTML(d.title || '')}</h2>
        <p style="font-size: 16px; opacity: 0.95; max-width: 680px; margin: 0 auto 36px auto; line-height: 1.6; color: ${textCol} !important;">${escapeHTML(d.subtitle || '')}</p>
        <div class="row justify-content-center">
            ${d.email ? `<div class="col-12 col-sm-6 col-md-4 mb-3">
                <a href="mailto:${escapeHTML(d.email)}" style="text-decoration: none; color: inherit; display: block;">
                    <div class="card h-100 shadow-sm p-3 text-center" style="background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <i class="fa fa-envelope mb-2" style="font-size: 24px; color: ${bg};"></i>
                        <span style="font-size: 12px; color: #64748b; display: block;">Email Support</span>
                        <strong style="font-size: 13px; word-break: break-all;">${escapeHTML(d.email)}</strong>
                    </div>
                </a>
            </div>` : ''}
            ${d.skype ? `<div class="col-12 col-sm-6 col-md-4 mb-3">
                <div class="card h-100 shadow-sm p-3 text-center" style="background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <i class="fa fa-skype mb-2" style="font-size: 24px; color: ${bg};"></i>
                    <span style="font-size: 12px; color: #64748b; display: block;">Skype / Teams</span>
                    <strong style="font-size: 13px;">${escapeHTML(d.skype)}</strong>
                </div>
            </div>` : ''}
            ${d.whatsapp ? `<div class="col-12 col-sm-6 col-md-4 mb-3">
                <div class="card h-100 shadow-sm p-3 text-center" style="background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <i class="fa fa-whatsapp mb-2" style="font-size: 24px; color: ${bg};"></i>
                    <span style="font-size: 12px; color: #64748b; display: block;">WhatsApp</span>
                    <strong style="font-size: 13px;">${escapeHTML(d.whatsapp)}</strong>
                </div>
            </div>` : ''}
        </div>
    </div>
</section>`;
        }

        case 'other_apps': {
            const bg = d.bgColor || '#ffffff';
            const titleCol = d.titleColor || '#1e293b';
            const colClass = d.columns === '2' ? 'col-12 col-md-6 mb-4' : (d.columns === '4' ? 'col-12 col-sm-6 col-lg-3 mb-4' : 'col-12 col-md-6 col-lg-4 mb-4');

            const appsList = Array.isArray(d.apps) ? d.apps : [];
            const appsHTML = appsList.map((app) => {
                let bannerSrc = (app.bannerUrl || '').trim();
                const srcMatch = bannerSrc.match(/src=["'](.*?)["']/i);
                if (srcMatch) bannerSrc = srcMatch[1];

                const bannerHTML = bannerSrc
                    ? `<img src="${escapeHTML(bannerSrc)}" style="width:100%; height:auto; border-bottom:1px solid #e2e8f0; display:block" alt="${escapeHTML(app.title || '')}">`
                    : `<div style="width: 100%; height: 180px; background: linear-gradient(135deg, ${globalBrand || '#714B67'} 0%, #1e293b 100%); display: flex; align-items: center; justify-content: center; color: #ffffff; padding: 16px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                        <div>
                            <i class="fa fa-cubes" style="font-size: 38px; margin-bottom: 8px; opacity: 0.85; display: block;"></i>
                            <div style="font-size: 13px; font-weight: 600; opacity: 0.95; line-height: 1.3;">${escapeHTML(app.title || 'App Banner')}</div>
                        </div>
                    </div>`;

                return `
                <div class="${colClass}">
                    <a href="${escapeHTML(app.appUrl || '#')}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                        <div class="card h-100 shadow-sm" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;">
                            ${bannerHTML}
                            <div class="card-body p-3 d-flex flex-column justify-content-between" style="min-height: 105px;">
                                <h5 style="font-size: 15px; font-weight: 700; color: #1e293b; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${escapeHTML(app.title || 'App Title')}
                                </h5>
                                <div class="d-flex align-items-center justify-content-between pt-2" style="border-top: 1px solid #f1f5f9;">
                                    <span style="font-size: 13px; color: #64748b; font-weight: 500;">
                                        ${escapeHTML(app.company || '')}
                                    </span>
                                    <span style="font-size: 15px; font-weight: 700; color: #0f172a;">
                                        ${escapeHTML(app.price || 'Free')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
            }).join('\n');

            return `<section class="py-5" style="background-color: ${bg};">
    <div class="container py-2" style="max-width: 1140px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-4">
            <div class="col-12 col-lg-9">
                <h2 style="font-size: 32px; font-weight: 700; color: ${titleCol}; margin-bottom: 10px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0 auto; max-width: 680px; line-height: 1.6;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row justify-content-center">
            ${appsHTML}
        </div>
    </div>
</section>`;
        }

        case 'footer_brand': {
            const bg = d.bgColor || '#1e293b';
            const textCol = d.textColor || '#94a3b8';
            return `<footer class="py-4 text-center" style="background-color: ${bg}; color: ${textCol}; font-size: 14px;">
    <div class="container" style="max-width: 900px;">
        <p style="margin-bottom: 6px; font-weight: 600;">${escapeHTML(d.companyName || 'Company Name')} &copy; ${escapeHTML(d.year || '2026')}</p>
        <p style="margin: 0; font-size: 13px; opacity: 0.8;">${escapeHTML(d.tagline || '')}</p>
    </div>
</footer>`;
        }

        default:
            return `<!-- Unknown widget type: ${escapeHTML(type)} -->`;
    }
}

// COMPILE FINAL CODE
// forPreview = true  -> full HTML document with Bootstrap 5 + FontAwesome for local iframe simulation
// forPreview = false -> 100% clean sanitized fragment for Odoo App Store download/copy
function compileFinalAppStoreHTML(forPreview = false) {
    let sections = '';
    activeWidgets.forEach((w, i) => {
        sections += `<!-- ========================================== -->\n`;
        sections += `<!-- SECTION ${i + 1}: ${w.type.toUpperCase()} -->\n`;
        sections += `<!-- ========================================== -->\n`;
        sections += renderWidgetHtml(w);
        sections += '\n\n';
    });

    const fragmentHTML = `<div class="container-fluid p-0" style="color: #1e293b; background-color: #f8f9fa;">
<style>
.oi, i.oi { display: inline-block; font-family: 'Material Symbols Outlined' !important; font-style: normal; font-weight: 400 !important; line-height: 1; letter-spacing: normal; text-transform: none; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; vertical-align: middle; }
.oi:before, .oi::before, i.oi:before, i.oi::before { display: inline-block; content: attr(data-icon); text-rendering: geometricPrecision; word-break: keep-all; }
</style>
${sections}
</div>`;

    if (!forPreview) {
        return fragmentHTML;
    }

    const previewFaLinks = getFontAwesomeLinks().map(h => `<link rel="stylesheet" href="${h}"/>`).join('\n    ');
    const fontFamily = (window.pageSettings && window.pageSettings.fontFamily) || 'Inter, -apple-system, sans-serif';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${escapeHTML((window.pageSettings && window.pageSettings.appName) || 'Odoo Module Description')}</title>
    <!-- Bootstrap 5 CSS (Used by Odoo 16/17/18/19/20 App Store) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
    <!-- Font Awesome for App Store Compatibility -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <!-- Material Symbols for Odoo Icons (.oi) -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
    ${previewFaLinks}
    <style>
        .oi, i.oi {
            display: inline-block;
            font-family: 'Material Symbols Outlined' !important;
            font-style: normal;
            font-weight: 400 !important;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            vertical-align: middle;
        }
        .oi:before, .oi::before, i.oi:before, i.oi::before {
            display: inline-block;
            content: attr(data-icon);
            text-rendering: geometricPrecision;
            word-break: keep-all;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: ${fontFamily};
            background-color: #f8f9fa;
            -webkit-font-smoothing: antialiased;
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
${fragmentHTML}
</body>
</html>`;
}

// DOWNLOAD HANDLER
function downloadIndexFile() {
    const html = compileFinalAppStoreHTML(false);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded index.html successfully!');
}

// MODAL CONTROLS
function openPreviewModal() {
    const iframe = document.getElementById('preview-iframe');
    iframe.srcdoc = compileFinalAppStoreHTML(true);
    openModal('preview-modal');
}

function openCodeModal() {
    const display = document.getElementById('code-display');
    display.textContent = compileFinalAppStoreHTML(false);
    openModal('code-modal');
}

function copyHTMLCode() {
    const html = compileFinalAppStoreHTML(false);
    navigator.clipboard.writeText(html).then(() => {
        showToast('HTML code copied to clipboard!');
    });
}

function openTemplatesModal() {
    openModal('templates-modal');
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// TOAST HELPER
function showToast(msg) {
    const toast = document.getElementById('toast-notify');
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
