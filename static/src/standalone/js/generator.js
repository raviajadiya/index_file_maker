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

function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(113, 75, 103, ${alpha})`;
    let c = hex.replace('#', '').trim();
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    if (c.length !== 6) return `rgba(113, 75, 103, ${alpha})`;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ICON_TO_FA_MAP = {
    // Communication & Support
    'email': 'fa fa-envelope',
    'mail': 'fa fa-envelope',
    'forum': 'fa fa-comments',
    'chat': 'fa fa-comments',
    'campaign': 'fa fa-bullhorn',
    'help': 'fa fa-life-ring',
    'support_agent': 'fa fa-headphones',
    'contact_support': 'fa fa-question-circle',
    'call': 'fa fa-phone',
    'phone': 'fa fa-phone',
    'whatsapp': 'fa fa-whatsapp',
    'skype': 'fa fa-skype',

    // Status, Checks & Actions
    'check_circle': 'fa fa-check-circle',
    'task_alt': 'fa fa-check-circle',
    'check': 'fa fa-check',
    'verified': 'fa fa-check-circle',
    'shield': 'fa fa-shield',
    'cancel': 'fa fa-times-circle',
    'close': 'fa fa-times',
    'delete': 'fa fa-trash',
    'edit': 'fa fa-pencil',
    'add': 'fa fa-plus',
    'refresh': 'fa fa-refresh',
    'download': 'fa fa-download',
    'upload': 'fa fa-upload',

    // UI, Navigation & Dashboards
    'dashboard': 'fa fa-tachometer',
    'desktop_windows': 'fa fa-desktop',
    'desktop': 'fa fa-desktop',
    'laptop': 'fa fa-laptop',
    'mobile': 'fa fa-mobile',
    'devices': 'fa fa-desktop',
    'search': 'fa fa-search',
    'menu': 'fa fa-bars',
    'attach_file': 'fa fa-paperclip',
    'folder': 'fa fa-folder',
    'description': 'fa fa-file-text-o',
    'business': 'fa fa-building',
    'lock': 'fa fa-lock',
    'favorite': 'fa fa-heart',
    'heart': 'fa fa-heart',
    'schedule': 'fa fa-clock-o',
    'clock': 'fa fa-clock-o',
    'calendar_month': 'fa fa-calendar',
    'event': 'fa fa-calendar',
    'person': 'fa fa-user',
    'user': 'fa fa-user',
    'group': 'fa fa-users',
    'groups': 'fa fa-users',
    'notifications': 'fa fa-bell',
    'notifications_active': 'fa fa-bell',
    'link': 'fa fa-link',
    'progress_activity': 'fa fa-spinner',
    'star': 'fa fa-star',
    'cogs': 'fa fa-cogs',
    'cog': 'fa fa-cog',
    'bolt': 'fa fa-bolt',
    'line-chart': 'fa fa-line-chart',
    'bar-chart': 'fa fa-bar-chart',
    'pie-chart': 'fa fa-pie-chart',
    'money': 'fa fa-money',
    'dollar': 'fa fa-usd'
};

function renderSafeIcon(iconStr, defaultFaClass = 'fa fa-check-circle', fontSize = '26px') {
    if (!iconStr) iconStr = defaultFaClass;
    const str = String(iconStr).trim();
    if (str.startsWith('<img') || str.startsWith('data:image')) {
        return str;
    }
    if (str.startsWith('http://') || str.startsWith('https://') || str.endsWith('.png') || str.endsWith('.svg') || str.endsWith('.jpg') || str.endsWith('.webp')) {
        return `<img src="${str}" alt="icon" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">`;
    }

    // 1. Extract icon name from data-icon="..." e.g. <i class="oi" data-icon="email"></i>
    const dataIconMatch = str.match(/data-icon=["']([^"']+)["']/i);
    if (dataIconMatch) {
        const name = dataIconMatch[1].toLowerCase().trim();
        const faClass = ICON_TO_FA_MAP[name] || formatFaIconClass(name, defaultFaClass);
        return `<i class="${faClass}" style="font-size: ${fontSize}; vertical-align: middle; color: inherit;"></i>`;
    }

    // 2. If it's already an HTML element with Font Awesome e.g. <i class="fa fa-envelope"></i>
    const faClassMatch = str.match(/class=["']([^"']*fa\s+fa-[^"']*)["']/i);
    if (faClassMatch) {
        return `<i class="${faClassMatch[1].trim()}" style="font-size: ${fontSize}; vertical-align: middle; color: inherit;"></i>`;
    }

    // 3. If prefixed with oi: or oi- e.g. oi:campaign
    const oiPrefixMatch = str.match(/^oi[:\s-]+([\w-]+)/i);
    if (oiPrefixMatch) {
        const name = oiPrefixMatch[1].toLowerCase().trim();
        const faClass = ICON_TO_FA_MAP[name] || formatFaIconClass(name, defaultFaClass);
        return `<i class="${faClass}" style="font-size: ${fontSize}; vertical-align: middle; color: inherit;"></i>`;
    }

    // 4. If it's in our known mapping (e.g. 'email', 'campaign', 'forum', 'help', 'task_alt', etc.)
    const cleanLower = str.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (ICON_TO_FA_MAP[cleanLower]) {
        return `<i class="${ICON_TO_FA_MAP[cleanLower]}" style="font-size: ${fontSize}; vertical-align: middle; color: inherit;"></i>`;
    }

    // 5. Standard formatFaIconClass fallback
    const faClass = formatFaIconClass(str, defaultFaClass);
    return `<i class="${faClass}" style="font-size: ${fontSize}; vertical-align: middle; color: inherit;"></i>`;
}

function renderTableCheck(val) {
    if (val === true || String(val).toLowerCase() === 'true' || val === 'yes' || val === '1') {
        return `<i class="fa fa-check-circle" style="color: #10b981; font-size: 22px; vertical-align: middle; display: inline-block;"></i>`;
    } else if (val === false || String(val).toLowerCase() === 'false' || val === 'no' || val === '0' || val === '' || val === null || val === undefined) {
        return `<i class="fa fa-times-circle" style="color: #cbd5e1; font-size: 20px; vertical-align: middle; display: inline-block;"></i>`;
    } else {
        const strVal = String(val).trim();
        const lower = strVal.toLowerCase();
        const isNegative = ['error', 'none', 'slow', 'tedious', 'manual', 'missing', 'fail', 'no', 'bug', 'limited', 'without'].some(w => lower.includes(w));
        const isPositive = !isNegative && ['included', 'yes', 'full', 'all', 'free', 'ready', 'active', 'supported', 'available'].some(w => lower.includes(w));

        if (isPositive) {
            return `<span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background-color: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; border: 1px solid #a7f3d0; line-height: 1.4; vertical-align: middle; white-space: nowrap;"><i class="fa fa-check-circle" style="color: #059669; font-size: 11px; margin-right: 4px;"></i>${escapeHTML(strVal)}</span>`;
        } else if (isNegative) {
            return `<span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background-color: #fef2f2; color: #dc2626; font-size: 12px; font-weight: 700; border: 1px solid #fecaca; line-height: 1.4; vertical-align: middle; white-space: nowrap;"><i class="fa fa-times-circle" style="color: #dc2626; font-size: 11px; margin-right: 4px;"></i>${escapeHTML(strVal)}</span>`;
        } else {
            return `<span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background-color: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700; border: 1px solid #bfdbfe; line-height: 1.4; vertical-align: middle; white-space: nowrap;">${escapeHTML(strVal)}</span>`;
        }
    }
}

// SECTION BORDER GENERATOR (Standard Odoo-Safe CSS)
function getSectionBorderStyle(d, defaultType = 'bottom', defaultColor = '#e2e8f0') {
    const borderType = d.sectionBorder !== undefined ? d.sectionBorder : defaultType;
    if (borderType === 'none' || borderType === false) return '';
    const color = d.sectionBorderColor || defaultColor;
    const width = d.sectionBorderWidth ? (String(d.sectionBorderWidth).includes('px') ? d.sectionBorderWidth : d.sectionBorderWidth + 'px') : '1px';
    const style = d.sectionBorderStyle || 'solid';
    const borderVal = `${width} ${style} ${color}`;

    if (borderType === 'bottom') {
        return `border-bottom: ${borderVal};`;
    } else if (borderType === 'top') {
        return `border-top: ${borderVal};`;
    } else if (borderType === 'top_bottom') {
        return `border-top: ${borderVal}; border-bottom: ${borderVal};`;
    } else if (borderType === 'all') {
        const radius = d.sectionBorderRadius ? ` border-radius: ${String(d.sectionBorderRadius).includes('px') ? d.sectionBorderRadius : d.sectionBorderRadius + 'px'};` : '';
        return `border: ${borderVal};${radius}`;
    }
    return `border-bottom: ${borderVal};`;
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

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4 text-center" style="background-color: ${bg}; color: ${textCol}; ${borderCss}">
    <div class="container py-2">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-10">
                ${d.iconUrl ? `<div class="mb-3"><img src="${d.iconUrl}" alt="App Icon" style="width: 80px; height: 80px; border-radius: 18px; object-fit: contain; background-color: #ffffff; padding: 8px; border: 1px solid #e2e8f0;"/></div>` : ''}
                <h1 style="font-size: 40px; font-weight: 700; line-height: 1.25; margin-bottom: 14px; color: ${textCol} !important;">
                    ${escapeHTML(d.title || 'App Title')}
                </h1>
                <p style="font-size: 18px; max-width: 780px; margin: 0 auto 20px auto; opacity: 0.95; line-height: 1.6; color: ${textCol} !important;">
                    ${escapeHTML(d.subtitle || '')}
                </p>
                ${d.showBadges && badgesHTML ? `<div class="mb-3 d-flex flex-wrap justify-content-center">${badgesHTML}</div>` : ''}
                <div class="d-flex flex-wrap justify-content-center mt-2">
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
            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4 text-center" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8">
                ${d.badge ? `<span style="background-color: #f5efff; color: ${accent}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${escapeHTML(d.badge)}</span>` : ''}
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-top: 12px; margin-bottom: 10px;">${escapeHTML(d.title || '')}</h2>
                <p style="font-size: 16px; color: #64748b; margin: 0 auto; max-width: 680px; line-height: 1.6;">${escapeHTML(d.subtitle || '')}</p>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'discount_ribbon': {
            const bg = d.bgColor || globalBrand || '#714B67';
            const textCol = d.textColor || '#ffffff';
            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-2 text-center" style="background-color: ${bg}; color: ${textCol}; font-weight: 600; font-size: 15px; ${borderCss}">
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
            const colClass = cols === 2 ? 'col-12 col-md-6 mb-3' : (cols === 3 ? 'col-12 col-md-4 mb-3' : 'col-12 col-sm-6 col-md-3 mb-3');
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
                        <div class="mb-3 text-center" style="width: 52px; height: 52px; line-height: 52px; text-align: center; border-radius: 12px; background-color: ${iconBg}; color: ${iconColor} !important; font-size: 22px; display: inline-block; vertical-align: middle;">
                            ${iconHtml}
                        </div>
                        <h4 style="font-size: 18px; font-weight: 700; color: ${it.titleColor || '#1e293b'} !important; margin: 0 0 8px 0; line-height: 1.35;">${escapeHTML(it.title || '')}</h4>
                        <p style="font-size: 14px; color: ${it.descColor || '#64748b'} !important; margin: 0; line-height: 1.5; flex: 1;">${escapeHTML(it.desc || '')}</p>
                    </div>
                </div>
            </div>`;
            }).join('');

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        ${d.title ? `<div class="row justify-content-center text-center mb-3">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: ${titleCol} !important; margin-bottom: 8px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: ${subtitleCol} !important; margin: 0 auto; line-height: 1.6;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row">${cardsHTML}</div>
    </div>
</section>`;
        }

        case 'stats_counter': {
            const bg = d.bgColor || '#f8f9fa';
            const cardBg = d.cardBgColor || '#ffffff';
            const cardBorder = d.cardBorderColor || '#e2e8f0';
            const globalIconCol = d.accentColor || globalBrand || '#714B67';
            const iconBg = d.iconBgColor && !d.iconBgColor.includes('rgba') ? d.iconBgColor : (d.iconBgColor || '#f5efff');
            const defaultNumCol = d.numberColor || d.accentColor || globalBrand || '#714B67';
            const defaultLabelCol = d.labelColor || '#64748b';
            const titleCol = d.titleColor || '#1e293b';
            const subtitleCol = d.subtitleColor || '#64748b';
            const stats = d.stats || [];

            const cols = parseInt(d.columns) || (stats.length === 4 ? 4 : (stats.length === 2 ? 2 : 3));
            const colClass = cols === 2 ? 'col-12 col-sm-6 col-md-6 mb-3 text-center' : (cols === 4 ? 'col-12 col-sm-6 col-md-3 mb-3 text-center' : 'col-12 col-sm-6 col-md-4 mb-3 text-center');

            const colsHTML = stats.map(st => {
                let iconHtml = '';
                if (st.iconUrl) {
                    iconHtml = `<img src="${st.iconUrl}" alt="icon" style="width: 26px; height: 26px; object-fit: contain; vertical-align: middle;">`;
                } else if (st.icon) {
                    iconHtml = renderSafeIcon(st.icon, '<i class="oi" data-icon="task_alt"></i>');
                }

                const numCol = st.numberColor || defaultNumCol;
                const labelCol = st.labelColor || defaultLabelCol;
                const itemIconCol = st.iconColor || globalIconCol;

                return `
            <div class="${colClass}">
                <div class="card h-100 shadow-sm" style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px;">
                    <div class="card-body p-4 text-center" style="text-align: center;">
                        ${iconHtml ? `
                        <div class="mb-3 text-center" style="width: 52px; height: 52px; line-height: 52px; text-align: center; border-radius: 12px; background-color: ${iconBg}; color: ${itemIconCol} !important; font-size: 22px; display: inline-block; vertical-align: middle;">
                            ${iconHtml}
                        </div>` : ''}
                        <div style="font-size: 32px; font-weight: 700; color: ${numCol} !important; margin-bottom: 4px; line-height: 1.2; text-align: center;">${escapeHTML(st.number || '')}</div>
                        <div style="font-size: 15px; font-weight: 600; color: ${labelCol} !important; line-height: 1.4; text-align: center;">${escapeHTML(st.label || '')}</div>
                    </div>
                </div>
            </div>`;
            }).join('');

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        ${d.title ? `<div class="row justify-content-center text-center mb-3">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: ${titleCol} !important; margin-bottom: 8px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: ${subtitleCol} !important; margin: 0 auto; line-height: 1.6;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row justify-content-center">${colsHTML}</div>
    </div>
</section>`;
        }

        case 'mobile_showcase': {
            const bg = d.bgColor || '#ffffff';
            const globalBrand = (window.pageSettings && window.pageSettings.brandColor) || '#714B67';
            const globalAccent = (window.pageSettings && window.pageSettings.accentColor) || '#00A09D';

            const accent = d.accentColor || globalBrand || '#714B67';
            const badgeBg = d.badgeBgColor || accent || '#714B67';
            const badgeText = d.badgeTextColor || '#ffffff';
            const badgeBorder = d.badgeBorderColor || badgeBg;
            const titleCol = d.titleColor || '#1e293b';
            const descCol = d.descColor || '#64748b';
            const pointBg = d.pointBgColor || '#fdf8fc';
            const pointBorder = d.pointBorderColor || '#f0e6ed';
            const pointText = d.pointTextColor || '#1e293b';
            const frameCol = d.frameColor || '#1e293b';
            const isImageLeft = d.layoutPosition !== 'image_right';
            const isDualImage = String(d.imageCount) === '2';

            const points = d.points || d.bulletItems || [];
            const pointsHTML = points.map(pt => `
                <div class="d-flex align-items-center p-3 mb-2" style="background-color: ${pointBg}; border: 1px solid ${pointBorder}; border-radius: 10px;">
                    <span class="me-3 d-inline-flex align-items-center justify-content-center" style="color: ${accent} !important; font-size: 20px; flex-shrink: 0;">
                        <i class="fa fa-check-circle" style="color: ${accent}; font-size: 20px; vertical-align: middle;"></i>
                    </span>
                    <span style="font-size: 15px; font-weight: 500; color: ${pointText} !important; line-height: 1.4;">${escapeHTML(pt)}</span>
                </div>
            `).join('');

            const renderPhoneScreen = (imgUrl) => {
                if (imgUrl) {
                    return `<img src="${imgUrl}" alt="Mobile Screen" style="width: 100%; height: auto; display: block; border-radius: 24px;">`;
                }
                return `
                <div class="d-flex flex-column justify-content-between p-3 text-center" style="width: 100%; min-height: 380px; background-color: #0f172a; border-radius: 24px; color: #94a3b8; box-sizing: border-box;">
                    <div class="d-flex justify-content-between px-2" style="font-size: 11px; color: #94a3b8;">
                        <span>9:41</span>
                        <span><i class="fa fa-wifi me-1"></i><i class="fa fa-battery-full"></i></span>
                    </div>
                    <div class="text-center py-4">
                        <div class="mb-2"><i class="fa fa-mobile" style="font-size: 44px; color: ${accent};"></i></div>
                        <div style="font-size: 13px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">App Screen Preview</div>
                        <div style="font-size: 11px; color: #64748b;">Upload mobile screenshot</div>
                    </div>
                    <div style="height: 12px;"></div>
                </div>`;
            };

            const renderPhoneFrame = (imgUrl, maxW = '230px') => `
                <div style="background-color: ${frameCol}; border-radius: 34px; padding: 8px; box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.25); max-width: ${maxW}; width: 100%; margin: 0 auto; box-sizing: border-box;">
                    <div style="width: 44px; height: 5px; background-color: #334155; border-radius: 3px; margin: 3px auto 7px auto;"></div>
                    <div style="background-color: #0f172a; border-radius: 24px; overflow: hidden;">
                        ${renderPhoneScreen(imgUrl)}
                    </div>
                    <div style="width: 60px; height: 4px; background-color: #475569; border-radius: 2px; margin: 8px auto 3px auto;"></div>
                </div>
            `;

            let phonesHTML = '';
            if (isDualImage) {
                phonesHTML = `
                <div class="row justify-content-center g-3 align-items-center">
                    <div class="col-6 text-center">
                        ${renderPhoneFrame(d.image1Url, '230px')}
                        ${d.image1Caption ? `<div style="font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500;">${escapeHTML(d.image1Caption)}</div>` : ''}
                    </div>
                    <div class="col-6 text-center">
                        ${renderPhoneFrame(d.image2Url, '230px')}
                        ${d.image2Caption ? `<div style="font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500;">${escapeHTML(d.image2Caption)}</div>` : ''}
                    </div>
                </div>`;
            } else {
                phonesHTML = `
                <div class="text-center">
                    ${renderPhoneFrame(d.image1Url, '270px')}
                    ${d.image1Caption ? `<div style="font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500;">${escapeHTML(d.image1Caption)}</div>` : ''}
                </div>`;
            }

            const contentColHTML = `
            <div class="col-12 col-lg-6 d-flex flex-column justify-content-center">
                ${(d.badgeNumber || d.badgeText) ? `
                <div class="mb-3" style="line-height: 1.2;">
                    ${d.badgeNumber ? `<span style="background-color: ${badgeBg}; color: ${badgeText} !important; border: 1px solid ${badgeBorder}; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; min-width: 42px; height: 36px; line-height: 34px; text-align: center; vertical-align: middle; margin-right: 12px; padding: 0 10px; box-sizing: border-box;">${escapeHTML(d.badgeNumber)}</span>` : ''}
                    ${d.badgeText ? `<span style="font-size: 22px; font-weight: 700; color: #1e293b !important; line-height: 36px; vertical-align: middle; display: inline-block;">${escapeHTML(d.badgeText)}</span>` : ''}
                </div>` : ''}
                <h2 style="font-size: 26px; font-weight: 600; color: ${titleCol} !important; margin: 0 0 10px 0; line-height: 1.3;">${escapeHTML(d.title || '')}</h2>
                ${d.desc ? `<p style="font-size: 15px; font-weight: 400; color: ${descCol} !important; line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHTML(d.desc)}</p>` : ''}
                <div>${pointsHTML}</div>
            </div>`;

            const imageColHTML = `
            <div class="col-12 col-lg-6 mb-3 mb-lg-0 d-flex align-items-center justify-content-center">
                <div style="width: 100%;">
                    ${phonesHTML}
                </div>
            </div>`;

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        <div class="row align-items-center">
            ${isImageLeft ? `${imageColHTML}\n            ${contentColHTML}` : `${contentColHTML}\n            ${imageColHTML}`}
        </div>
    </div>
</section>`;
        }

        case 'desktop_showcase': {
            const bg = d.bgColor || '#ffffff';
            const globalBrand = (window.pageSettings && window.pageSettings.brandColor) || '#714B67';
            const globalAccent = (window.pageSettings && window.pageSettings.accentColor) || '#00A09D';

            const accent = d.accentColor || globalBrand || '#714B67';
            const badgeBg = d.badgeBgColor || accent || '#714B67';
            const badgeText = d.badgeTextColor || '#ffffff';
            const badgeBorder = d.badgeBorderColor || badgeBg;
            const titleCol = d.titleColor || '#1e293b';
            const descCol = d.descColor || '#64748b';
            const pointBg = d.pointBgColor || '#fdf8fc';
            const pointBorder = d.pointBorderColor || '#f0e6ed';
            const pointText = d.pointTextColor || '#1e293b';
            const frameCol = d.frameColor || '#1e293b';
            const frameStyle = d.frameStyle || 'browser';
            const headerAlign = d.headerAlign || 'center';
            const isCenter = headerAlign === 'center';
            const pointsLayout = d.pointsLayout || 'grid';

            const points = d.points || d.bulletItems || [];
            const colClass = points.length === 2 ? 'col-12 col-md-6' : (points.length === 4 ? 'col-12 col-md-6 col-lg-3' : 'col-12 col-md-4');

            const pointsHTML = points.map(pt => {
                if (pointsLayout === 'list') {
                    return `
                    <div class="col-12 mb-2">
                        <div class="d-flex align-items-center p-3" style="background-color: ${pointBg}; border: 1px solid ${pointBorder}; border-radius: 10px;">
                            <span class="me-3 d-inline-flex align-items-center justify-content-center" style="color: ${accent} !important; font-size: 20px; flex-shrink: 0;">
                                <i class="fa fa-check-circle" style="color: ${accent}; font-size: 20px; vertical-align: middle;"></i>
                            </span>
                            <span style="font-size: 15px; font-weight: 500; color: ${pointText} !important; line-height: 1.4;">${escapeHTML(pt)}</span>
                        </div>
                    </div>`;
                }
                return `
                <div class="${colClass} mb-3">
                    <div class="h-100 d-flex align-items-center p-3" style="background-color: ${pointBg}; border: 1px solid ${pointBorder}; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                        <span class="me-3 d-inline-flex align-items-center justify-content-center" style="color: ${accent} !important; font-size: 20px; flex-shrink: 0;">
                            <i class="fa fa-check-circle" style="color: ${accent}; font-size: 20px; vertical-align: middle;"></i>
                        </span>
                        <span style="font-size: 15px; font-weight: 500; color: ${pointText} !important; line-height: 1.45;">${escapeHTML(pt)}</span>
                    </div>
                </div>`;
            }).join('');

            const renderDesktopScreen = (imgUrl) => {
                if (imgUrl) {
                    return `<img src="${imgUrl}" alt="Desktop View" style="width: 100%; height: auto; display: block;">`;
                }
                return `
                <div class="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3" style="width: 100%; min-height: 380px; background-color: #0f172a; color: #94a3b8; box-sizing: border-box;">
                    <div class="mb-3 text-center">
                        <i class="fa fa-desktop" style="font-size: 54px; color: ${accent};"></i>
                    </div>
                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">
                        Desktop Interface Full View
                    </div>
                    <div style="font-size: 13px; color: #64748b;">
                        Upload full-width web screenshot or backend dashboard
                    </div>
                </div>`;
            };

            let desktopMockupHTML = '';
            if (frameStyle === 'laptop') {
                desktopMockupHTML = `
                <div style="max-width: 980px; margin: 0 auto; width: 100%;">
                    <div style="background-color: ${frameCol}; border-radius: 16px 16px 0 0; padding: 14px 14px 0 14px; box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.3);">
                        <div style="width: 8px; height: 8px; background-color: #475569; border-radius: 50%; margin: 0 auto 10px auto;"></div>
                        <div style="background-color: #ffffff; border-radius: 6px 6px 0 0; overflow: hidden; border: 1px solid #334155;">
                            ${renderDesktopScreen(d.imageUrl)}
                        </div>
                    </div>
                    <div style="position: relative; background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%); height: 18px; border-radius: 0 0 18px 18px; box-shadow: 0 12px 30px rgba(0,0,0,0.22);">
                        <div style="width: 90px; height: 6px; background-color: #cbd5e1; border-radius: 0 0 6px 6px; margin: 0 auto;"></div>
                    </div>
                    <div style="background: rgba(0,0,0,0.15); height: 8px; width: 85%; margin: 0 auto; border-radius: 50%; filter: blur(4px);"></div>
                    ${d.imageCaption ? `<div style="font-size: 12px; color: #64748b; margin-top: 12px; font-weight: 500; text-align: center;">${escapeHTML(d.imageCaption)}</div>` : ''}
                </div>`;
            } else {
                desktopMockupHTML = `
                <div style="max-width: 1060px; margin: 0 auto; width: 100%; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 50px -10px rgba(15, 23, 42, 0.22); border: 1px solid #cbd5e1; background-color: #ffffff;">
                    <div class="d-flex align-items-center justify-content-between px-3 py-2" style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                        <div class="d-flex align-items-center">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #ef4444; display: inline-block; margin-right: 7px;"></span>
                            <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #f59e0b; display: inline-block; margin-right: 7px;"></span>
                            <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #10b981; display: inline-block;"></span>
                        </div>
                        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 24px; font-size: 12px; color: #64748b; font-weight: 500; max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            <i class="fa fa-lock me-1" style="font-size: 11px; color: #10b981;"></i>${escapeHTML(d.browserUrl || 'https://my-company.odoo.com/web#dashboard')}
                        </div>
                        <div style="width: 44px;"></div>
                    </div>
                    <div style="background-color: #fafafa; overflow: hidden;">
                        ${renderDesktopScreen(d.imageUrl)}
                    </div>
                    ${d.imageCaption ? `<div style="font-size: 12px; color: #64748b; padding: 10px 14px; font-weight: 500; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">${escapeHTML(d.imageCaption)}</div>` : ''}
                </div>`;
            }

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        <!-- TOP: Count, Category, Title, Subtitle -->
        <div class="row ${isCenter ? 'justify-content-center text-center' : ''} mb-3">
            <div class="col-12 col-lg-10">
                ${(d.badgeNumber || d.badgeText) ? `
                <div class="mb-3 ${isCenter ? 'text-center' : ''}" style="text-align: ${isCenter ? 'center' : 'left'}; line-height: 1.2;">
                    ${d.badgeNumber ? `<span style="background-color: ${badgeBg}; color: ${badgeText} !important; border: 1px solid ${badgeBorder}; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; min-width: 42px; height: 36px; line-height: 34px; text-align: center; vertical-align: middle; margin-right: 12px; padding: 0 10px; box-sizing: border-box;">${escapeHTML(d.badgeNumber)}</span>` : ''}
                    ${d.badgeText ? `<span style="font-size: 22px; font-weight: 700; color: #1e293b !important; line-height: 36px; vertical-align: middle; display: inline-block;">${escapeHTML(d.badgeText)}</span>` : ''}
                </div>` : ''}
                <h2 style="font-size: 30px; font-weight: 700; color: ${titleCol} !important; margin: 0 0 10px 0; line-height: 1.3;">${escapeHTML(d.title || '')}</h2>
                ${d.desc ? `<p style="font-size: 16px; font-weight: 400; color: ${descCol} !important; line-height: 1.6; margin: 0 ${isCenter ? 'auto' : ''}; max-width: 800px;">${escapeHTML(d.desc)}</p>` : ''}
            </div>
        </div>

        <!-- MIDDLE: Full-Width Desktop Mockup Frame -->
        <div class="row justify-content-center mb-3">
            <div class="col-12">
                ${desktopMockupHTML}
            </div>
        </div>

        <!-- BOTTOM: Feature Points Cards -->
        ${points.length ? `
        <div class="row justify-content-center">
            ${pointsHTML}
        </div>` : ''}
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

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        <div class="row align-items-center">
            <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                ${d.badge ? `<span style="background-color: #f5efff; color: ${accent}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${escapeHTML(d.badge)}</span>` : ''}
                <h2 style="font-size: 32px; font-weight: 700; color: #1e293b; margin-top: 12px; margin-bottom: 12px; line-height: 1.3;">${escapeHTML(d.title || '')}</h2>
                <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 18px;">${escapeHTML(d.desc || '')}</p>
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

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
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

        case 'workflow_steps': {
            const bg = d.bgColor || '#f8f9fa';
            const globalBrand = (window.pageSettings && window.pageSettings.brandColor) || '#714B67';

            const titleCol = d.titleColor || '#1e293b';
            const subtitleCol = d.subtitleColor || '#64748b';
            const cardBg = d.cardBgColor || '#ffffff';
            const cardBorder = d.cardBorderColor || '#e2e8f0';
            const cardTitleCol = d.cardTitleColor || '#1e293b';
            const cardDescCol = d.cardDescColor || '#64748b';
            const badgeBg = d.badgeBgColor || globalBrand || '#714B67';
            const badgeText = d.badgeTextColor || '#ffffff';
            const align = d.align || 'center';
            const isCenter = align === 'center';

            const steps = d.steps || [];
            const cols = parseInt(d.columns) || (steps.length === 4 ? 4 : (steps.length === 2 ? 2 : 3));
            const colClass = cols === 2 ? 'col-12 col-md-6 mb-4' : (cols === 4 ? 'col-12 col-sm-6 col-md-3 mb-4' : 'col-12 col-md-4 mb-4');

            const stepsHTML = steps.map((s, idx) => {
                const numVal = s.num !== undefined && s.num !== null && s.num !== '' ? s.num : String(idx + 1);

                return `
            <div class="${colClass}">
                <div class="card h-100 shadow-sm" style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); transition: transform 0.2s, box-shadow 0.2s;">
                    <div class="card-body p-4 d-flex flex-column ${isCenter ? 'text-center align-items-center' : 'text-start'}">
                        <div class="w-100 mb-3" style="text-align: ${isCenter ? 'center' : 'left'};">
                            <span style="display: inline-block; min-width: 44px; height: 44px; line-height: 44px; text-align: center; vertical-align: middle; padding: 0 8px; border-radius: 50px; background-color: ${badgeBg}; color: ${badgeText} !important; font-size: 18px; font-weight: 800; box-shadow: 0 4px 10px rgba(0,0,0,0.12); box-sizing: border-box;">
                                ${escapeHTML(numVal)}
                            </span>
                        </div>
                        <h4 style="font-size: 18px; font-weight: 700; color: ${cardTitleCol} !important; margin: 0 0 10px 0; line-height: 1.35; width: 100%; text-align: ${isCenter ? 'center' : 'left'};">${escapeHTML(s.title || '')}</h4>
                        <p style="font-size: 14px; color: ${cardDescCol} !important; line-height: 1.6; margin: 0; flex: 1; width: 100%; text-align: ${isCenter ? 'center' : 'left'};">${escapeHTML(s.desc || '')}</p>
                    </div>
                </div>
            </div>`;
            }).join('');

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1">
        ${d.title ? `<div class="row justify-content-center text-center mb-3">
            <div class="col-12 col-lg-8">
                <h2 style="font-size: 32px; font-weight: 700; color: ${titleCol} !important; margin-bottom: 8px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 16px; color: ${subtitleCol} !important; margin: 0 auto; line-height: 1.6;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="row justify-content-center">${stepsHTML}</div>
    </div>
</section>`;
        }

        case 'vs_table': {
            const bg = d.bgColor || '#ffffff';
            const cardBg = d.cardBgColor || '#ffffff';
            const tableBorder = d.tableBorderColor || d.cardBorderColor || d.dividerColor || '#cbd5e1';
            const headerBg = d.headerBgColor || '#f1f5f9';
            const headerTextColor = d.headerTextColor || '#1e293b';
            const titleColor = d.titleColor || '#1e293b';
            const subtitleColor = d.subtitleColor || '#64748b';
            const accent = d.accentColor || globalBrand || '#714B67';
            const rows = d.rows || [];

            // Highlighted styling for Column 2 (Our App - Hero Column)
            const col2HdrBg = d.col2HeaderBg || accent;
            const col2HdrTextCol = d.col2HeaderTextColor || '#ffffff';
            const col2Bg = d.col2HighlightBg || '#faf5ff';

            const rowsCount = rows.length;
            const rowsHTML = rows.map((r, i) => {
                const isLast = (i === rowsCount - 1);
                const rowBaseBg = (i % 2 === 0) ? '#ffffff' : '#f8fafc';
                const bottomBorder = isLast ? 'none' : `1px solid ${tableBorder}`;

                return `
            <tr style="background-color: ${rowBaseBg}; border-bottom: ${bottomBorder};">
                <td style="width: 50%; padding: 14px 20px; border-right: 1px solid ${tableBorder}; text-align: left; vertical-align: middle;">
                    <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 3px; line-height: 1.4;">${escapeHTML(r.feature || '')}</div>
                    ${r.detail ? `<div style="font-size: 12px; color: #64748b; line-height: 1.45;">${escapeHTML(r.detail)}</div>` : ''}
                </td>
                <td style="width: 25%; padding: 14px 10px; background-color: ${col2Bg}; border-right: 1px solid ${tableBorder}; text-align: center; vertical-align: middle;">
                    <div style="text-align: center; margin: 0 auto; line-height: 1.2;">
                        ${renderTableCheck(r.ourApp !== undefined ? r.ourApp : true)}
                    </div>
                </td>
                <td style="width: 25%; padding: 14px 10px; background-color: ${rowBaseBg}; text-align: center; vertical-align: middle;">
                    <div style="text-align: center; margin: 0 auto; line-height: 1.2;">
                        ${renderTableCheck(r.competitor !== undefined ? r.competitor : false)}
                    </div>
                </td>
            </tr>`;
            }).join('');

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1" style="max-width: 980px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-4">
            <div class="col-12 col-lg-10">
                <span style="display: inline-block; background-color: #f5efff; color: ${accent}; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">Feature Comparison</span>
                <h2 style="font-size: 30px; font-weight: 700; color: ${titleColor} !important; margin: 0 0 8px 0; line-height: 1.3;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 15px; color: ${subtitleColor} !important; margin: 0 auto; line-height: 1.6; max-width: 720px;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div style="background-color: ${cardBg}; border: 1px solid ${tableBorder}; border-radius: 14px; overflow: hidden; box-shadow: none;">
            <table style="width: 100%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;">
                <thead>
                    <tr style="background-color: ${headerBg}; border-bottom: 1px solid ${tableBorder};">
                        <th style="width: 50%; padding: 16px 20px; background-color: ${headerBg}; border-right: 1px solid ${tableBorder}; text-align: left; vertical-align: middle; font-weight: 700;">
                            <i class="fa fa-th-list" style="color: ${accent}; font-size: 14px; margin-right: 8px; vertical-align: middle;"></i>
                            <span style="font-size: 13px; font-weight: 700; color: ${headerTextColor}; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                                ${escapeHTML(d.col1Title || 'Key Capabilities & Features')}
                            </span>
                        </th>
                        <th style="width: 25%; padding: 14px 10px; background-color: ${col2HdrBg}; border-top: 4px solid #00A09D; border-right: 1px solid ${tableBorder}; text-align: center; vertical-align: middle;">
                            ${d.col2Badge ? `
                            <div style="margin-bottom: 6px; text-align: center;">
                                <span style="display: inline-block; background-color: #ffffff; color: ${col2HdrBg}; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><i class="fa fa-star" style="color: #f59e0b; margin-right: 3px;"></i>${escapeHTML(d.col2Badge)}</span>
                            </div>` : ''}
                            <div style="font-size: 15px; font-weight: 800; color: ${col2HdrTextCol}; line-height: 1.2; text-align: center;">
                                ${escapeHTML(d.col2Title || 'Our Module')}
                            </div>
                        </th>
                        <th style="width: 25%; padding: 16px 10px; background-color: ${headerBg}; text-align: center; vertical-align: middle; font-weight: 700;">
                            <span style="font-size: 13px; font-weight: 700; color: ${headerTextColor}; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                                ${escapeHTML(d.col3Title || 'Standard Odoo')}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>
        </div>
    </div>
</section>`;
        }

        case 'faq_section': {
            const bg = d.bgColor || '#ffffff';
            const headerBg = d.headerBg || '#fdf8fc';
            const questionColor = d.questionColor || globalBrand || '#714B67';
            const borderColor = d.borderColor || '#e2e8f0';
            const faqs = d.faqs || [];
            const faqsHTML = faqs.map((f, idx) => {
                const isOpen = f.isOpen === true || (f.isOpen === undefined && idx === 0);
                const openAttr = isOpen ? ' open' : '';
                return `
        <details class="faq-accordion-item"${openAttr} style="background-color: #ffffff; border: 1px solid ${borderColor}; border-radius: 10px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <summary class="d-flex align-items-center justify-content-between p-3" style="background-color: ${headerBg}; color: ${questionColor}; cursor: pointer; user-select: none; outline: none; list-style: none;">
                <span style="display: inline-block; padding-right: 12px; color: ${questionColor}; font-weight: 700; font-size: 15px; line-height: 1.4;">${escapeHTML(f.q)}</span>
                <span class="faq-accordion-arrow" style="display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background-color: rgba(0,0,0,0.05); color: ${questionColor}; font-size: 13px; margin-left: auto; flex-shrink: 0; transition: background-color 0.2s ease;">
                    <i class="fa fa-chevron-down faq-arrow-down" style="display: ${isOpen ? 'none' : 'inline-block'}; line-height: 1;"></i>
                    <i class="fa fa-chevron-up faq-arrow-up" style="display: ${isOpen ? 'inline-block' : 'none'}; line-height: 1;"></i>
                </span>
            </summary>
            <div style="padding: 16px 20px; background-color: #ffffff; color: #334155; font-size: 14.5px; line-height: 1.65; border-top: 1px solid ${borderColor};">
                ${escapeHTML(f.a)}
            </div>
        </details>`;
            }).join('');

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <style>
        details.faq-accordion-item summary {
            cursor: pointer;
            list-style: none !important;
            outline: none !important;
        }
        details.faq-accordion-item summary::-webkit-details-marker,
        details.faq-accordion-item summary::marker {
            display: none !important;
        }
        details.faq-accordion-item .faq-arrow-up {
            display: none !important;
        }
        details.faq-accordion-item .faq-arrow-down {
            display: inline-block !important;
        }
        details.faq-accordion-item[open] .faq-arrow-down {
            display: none !important;
        }
        details.faq-accordion-item[open] .faq-arrow-up {
            display: inline-block !important;
        }
        details.faq-accordion-item:not([open]) .faq-arrow-down {
            display: inline-block !important;
        }
        details.faq-accordion-item:not([open]) .faq-arrow-up {
            display: none !important;
        }
        details.faq-accordion-item[open] .faq-accordion-arrow {
            background-color: rgba(0, 0, 0, 0.1) !important;
        }
        details.faq-accordion-item summary:hover {
            filter: brightness(0.98);
        }
        details.faq-accordion-item summary:hover .faq-accordion-arrow {
            background-color: rgba(0, 0, 0, 0.09) !important;
        }
    </style>
    <div class="container py-1" style="max-width: 920px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-3">
            <div class="col-12">
                <h2 style="font-size: 30px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 15px; color: #64748b; margin: 0;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>` : ''}
        <div class="faq-accordion-list">
            ${faqsHTML}
        </div>
    </div>
</section>`;
        }

        case 'support_banner': {
            const bg = d.bgColor || globalBrand || '#714B67';
            const textCol = d.textColor || '#ffffff';
            const cardBg = d.cardBgColor || '#ffffff';
            const cardBorder = d.cardBorderColor || '#e2e8f0';
            const iconCol = d.iconColor || bg;

            // Normalize channels with backward compatibility fallback
            let channels = Array.isArray(d.channels) ? d.channels : [];
            if (channels.length === 0) {
                if (d.email) channels.push({ icon: 'fa fa-envelope', label: 'Email Support', value: d.email, url: `mailto:${d.email}` });
                channels.push({ icon: 'fa fa-comments', label: 'Community Forum', value: 'Join Discussions', url: 'https://yourdomain.com/forum' });
                channels.push({ icon: 'fa fa-bullhorn', label: 'Latest Updates', value: 'News & Releases', url: 'https://yourdomain.com/updates' });
                channels.push({ icon: 'fa fa-life-ring', label: 'Helpdesk Portal', value: 'Submit a Ticket', url: 'https://yourdomain.com/helpdesk' });
            }

            const colClass = channels.length <= 2 ? 'col-12 col-sm-6 mb-3' : (channels.length === 3 ? 'col-12 col-sm-6 col-md-4 mb-3' : (channels.length === 4 ? 'col-12 col-sm-6 col-md-3 mb-3' : 'col-12 col-sm-6 col-md-4 mb-3'));

            const channelsHTML = channels.map((c) => {
                const iconHtml = renderSafeIcon(c.icon, 'fa fa-life-ring', '28px');
                let linkUrl = (c.url || '').trim();
                if (!linkUrl && c.value) {
                    if (c.value.includes('@')) linkUrl = `mailto:${c.value.trim()}`;
                    else if (/^(\+|00)[0-9\s-]+$/.test(c.value.trim())) linkUrl = `tel:${c.value.trim().replace(/\s+/g, '')}`;
                }

                const cardInner = `
                    <div class="card h-100 shadow-sm p-3 text-center" style="background-color: ${cardBg}; color: #1e293b; border: 1px solid ${cardBorder}; border-radius: 12px; transition: transform 0.2s, box-shadow 0.2s;">
                        <div class="mb-2 text-center" style="font-size: 28px; line-height: 38px; height: 38px; text-align: center; color: ${iconCol} !important;">
                            ${iconHtml}
                        </div>
                        <span style="font-size: 12px; color: #64748b; display: block; font-weight: 500; margin-bottom: 2px;">${escapeHTML(c.label || 'Support Channel')}</span>
                        <strong style="font-size: 13.5px; word-break: break-all; color: #0f172a;">${escapeHTML(c.value || '')}</strong>
                    </div>`;

                return `
            <div class="${colClass}">
                ${linkUrl ? `<a href="${escapeHTML(linkUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block; height: 100%;">${cardInner}</a>` : cardInner}
            </div>`;
            }).join('');

            const borderCss = getSectionBorderStyle(d, 'none', '#e2e8f0');
            return `<section class="py-4 my-2" style="background-color: ${bg}; color: ${textCol}; border-radius: 16px; ${borderCss}">
    <div class="container text-center py-2" style="max-width: 960px;">
        ${d.badge ? `<span style="background-color: #ffffff; color: ${bg}; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; display: inline-block; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">${escapeHTML(d.badge)}</span>` : ''}
        <h2 style="font-size: 30px; font-weight: 700; margin-bottom: 10px; color: ${textCol} !important;">${escapeHTML(d.title || '')}</h2>
        <p style="font-size: 15px; opacity: 0.95; max-width: 680px; margin: 0 auto 20px auto; line-height: 1.6; color: ${textCol} !important;">${escapeHTML(d.subtitle || '')}</p>
        <div class="row justify-content-center">
            ${channelsHTML}
        </div>
    </div>
</section>`;
        }

        case 'other_apps': {
            const bg = d.bgColor || '#ffffff';
            const titleCol = d.titleColor || '#1e293b';
            const colClass = d.columns === '2' ? 'col-12 col-md-6 mb-4' : (d.columns === '4' ? 'col-12 col-sm-6 col-lg-3 mb-4' : 'col-12 col-md-6 col-lg-4 mb-4');
            const cardBg = d.cardBgColor || '#ffffff';
            const cardBorder = d.cardBorderColor || '#e2e8f0';
            const brandCol = globalBrand || '#714B67';
            const btnBg = d.btnBgColor || brandCol;
            const btnText = d.btnTextColor || '#ffffff';
            const priceCol = d.priceColor || '#059669';

            const appsList = Array.isArray(d.apps) ? d.apps : [];
            const appsHTML = appsList.map((app) => {
                let bannerSrc = (app.bannerUrl || '').trim();
                const srcMatch = bannerSrc.match(/src=["'](.*?)["']/i);
                if (srcMatch) bannerSrc = srcMatch[1];

                const badgeText = app.badge || 'Popular';
                const versionText = app.version || 'Odoo 20';
                const btnLabel = app.btnText || 'Get App';

                const bannerHTML = bannerSrc
                    ? `<img src="${escapeHTML(bannerSrc)}" style="width: 100%; height: 180px; object-fit: cover; border-bottom: 1px solid #e2e8f0; display: block;" alt="${escapeHTML(app.title || '')}">`
                    : `<div style="width: 100%; height: 160px; background-color: ${brandCol}; text-align: center; padding: 24px 16px; border-bottom: 1px solid #e2e8f0;">
                        <div style="width: 52px; height: 52px; line-height: 52px; margin: 0 auto 10px auto; border-radius: 50%; background-color: #ffffff; text-align: center;">
                            <i class="fa fa-cubes" style="font-size: 24px; color: ${brandCol}; line-height: 52px;"></i>
                        </div>
                        <div style="font-size: 14px; font-weight: 700; color: #ffffff; line-height: 1.3;">${escapeHTML(app.title || 'Odoo App')}</div>
                    </div>`;

                return `
                <div class="${colClass}">
                    <a href="${escapeHTML(app.appUrl || '#')}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                        <div class="card h-100 shadow-sm" style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; overflow: hidden;">
                            ${bannerHTML}
                            <div class="card-body p-3 d-flex flex-column justify-content-between" style="min-height: 140px;">
                                <div>
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <span style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background-color: #f5efff; color: ${brandCol}; border: 1px solid #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">
                                            ${escapeHTML(badgeText)}
                                        </span>
                                        <span style="font-size: 11px; color: #059669; font-weight: 700;">
                                            <i class="fa fa-check-circle" style="color: #10b981; margin-right: 3px;"></i>${escapeHTML(versionText)}
                                        </span>
                                    </div>
                                    <h5 style="font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.4; margin-bottom: 6px; min-height: 42px;">
                                        ${escapeHTML(app.title || 'App Title')}
                                    </h5>
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 12px; font-weight: 500;">
                                        <i class="fa fa-building-o" style="color: #94a3b8; margin-right: 5px;"></i>${escapeHTML(app.company || 'Your Company')}
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between pt-2" style="border-top: 1px solid #f1f5f9;">
                                    <span style="font-size: 15px; font-weight: 800; color: ${priceCol}; background-color: #ecfdf5; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0;">
                                        ${escapeHTML(app.price || 'Free')}
                                    </span>
                                    <span style="font-size: 12px; font-weight: 700; color: ${btnText}; background-color: ${btnBg}; padding: 6px 14px; border-radius: 6px; display: inline-block;">
                                        ${escapeHTML(btnLabel)} &rarr;
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
            }).join('\n');

            const borderCss = getSectionBorderStyle(d, 'bottom', '#e2e8f0');
            return `<section class="py-4" style="background-color: ${bg}; ${borderCss}">
    <div class="container py-1" style="max-width: 1140px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-4">
            <div class="col-12 col-lg-9">
                <h2 style="font-size: 30px; font-weight: 800; color: ${titleCol}; margin-bottom: 8px;">${escapeHTML(d.title)}</h2>
                ${d.subtitle ? `<p style="font-size: 15px; color: #64748b; margin: 0 auto; max-width: 680px; line-height: 1.6;">${escapeHTML(d.subtitle)}</p>` : ''}
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
            const compCol = d.companyColor || '#ffffff';
            const linkCol = d.linkColor || '#38bdf8';
            const accentCol = d.accentColor || '#ef4444';
            const layout = d.layout || 'split';

            let tagline = d.tagline || 'Crafted with ❤️ for the Odoo Global Community';
            tagline = tagline.replace(/❤️|â\s*¤ï¸|&hearts;|&#10084;&#65039;?/g, `<i class="fa fa-heart" style="color: ${accentCol}; margin: 0 3px;"></i>`);
            const safeTagline = tagline.includes('<i class="fa') ? tagline : escapeHTML(tagline);

            // Links HTML
            const showLinks = d.showLinks !== false;
            const linksList = Array.isArray(d.links) ? d.links : [];
            let linksHTML = '';
            if (showLinks && linksList.length > 0) {
                linksHTML = linksList.map(l => {
                    const iconHtml = l.icon ? `<i class="fa ${l.icon}" style="margin-right: 5px; color: ${linkCol};"></i>` : '';
                    return `<a href="${escapeHTML(l.url || '#')}" target="_blank" rel="noopener noreferrer" style="color: ${textCol}; text-decoration: none; font-size: 13px; font-weight: 500; margin: 4px 10px; display: inline-block;">
                        ${iconHtml}<span style="color: ${linkCol};">${escapeHTML(l.label || 'Link')}</span>
                    </a>`;
                }).join('');
            }

            // Company Logo HTML
            let logoHTML = '';
            if (d.logoUrl) {
                logoHTML = `<img src="${escapeHTML(d.logoUrl)}" alt="${escapeHTML(d.companyName || 'Logo')}" style="max-height: 38px; width: auto; margin-bottom: 8px; display: inline-block;">`;
            }

            const companyLink = d.companyUrl 
                ? `<a href="${escapeHTML(d.companyUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${compCol}; text-decoration: none; font-weight: 700;">${escapeHTML(d.companyName || 'Company Name')}</a>`
                : `<strong style="color: ${compCol};">${escapeHTML(d.companyName || 'Company Name')}</strong>`;

            const copyrightText = d.copyrightNotice 
                ? `<span style="font-size: 12px; opacity: 0.8; margin-left: 4px;">• ${escapeHTML(d.copyrightNotice)}</span>` 
                : '';

            const borderCss = getSectionBorderStyle(d, 'top', '#334155');

            if (layout === 'split') {
                return `<footer class="py-4" style="background-color: ${bg}; color: ${textCol}; font-size: 13px; ${borderCss}">
    <div class="container" style="max-width: 1140px;">
        <div class="row align-items-center">
            <div class="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
                ${logoHTML ? `<div class="mb-2">${logoHTML}</div>` : ''}
                <div style="font-size: 14px; margin-bottom: 4px;">
                    ${companyLink} &copy; ${escapeHTML(d.year || '2026')}${copyrightText}
                </div>
                <div style="font-size: 12px; opacity: 0.85;">
                    ${safeTagline}
                </div>
            </div>
            <div class="col-12 col-md-6 text-center text-md-end">
                ${linksHTML ? `<div style="margin-bottom: 6px;">${linksHTML}</div>` : ''}
                ${d.contactInfo ? `<div style="font-size: 12px; color: ${textCol}; opacity: 0.85;"><i class="fa fa-envelope-o" style="color: ${linkCol}; margin-right: 4px;"></i>${escapeHTML(d.contactInfo)}</div>` : ''}
            </div>
        </div>
    </div>
</footer>`;
            } else {
                return `<footer class="py-4 text-center" style="background-color: ${bg}; color: ${textCol}; font-size: 13px; ${borderCss}">
    <div class="container" style="max-width: 900px;">
        ${logoHTML ? `<div class="mb-2">${logoHTML}</div>` : ''}
        <div style="font-size: 15px; margin-bottom: 6px;">
            ${companyLink} &copy; ${escapeHTML(d.year || '2026')}${copyrightText}
        </div>
        ${linksHTML ? `<div style="margin-bottom: 10px;">${linksHTML}</div>` : ''}
        <p style="margin: 0; font-size: 13px; opacity: 0.85;">${safeTagline}</p>
        ${d.contactInfo ? `<div style="font-size: 12px; color: ${textCol}; opacity: 0.85; margin-top: 6px;"><i class="fa fa-envelope-o" style="color: ${linkCol}; margin-right: 4px;"></i>${escapeHTML(d.contactInfo)}</div>` : ''}
    </div>
</footer>`;
            }
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
