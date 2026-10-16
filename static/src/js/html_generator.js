/** @odoo-module **/

/**
 * Generates 100% Odoo App Store Compliant HTML
 * Reference: Odoo App Store HTML Guide (https://github.com/apexive/odoo-llm/blob/18.0/ODOO_APP_STORE_HTML_GUIDE.md)
 * 
 * Rules for Odoo App Store:
 * 1. Output starts directly with <section> (no <!DOCTYPE>, <html>, <head>, <body>, <style>)
 * 2. Standard Bootstrap 5 Grid exclusively (container, row, col-md-*, col-sm-*, col-12)
 * 3. NO inline flexbox alignment properties (align-items, justify-content, gap, flex-wrap) - use Bootstrap classes instead
 * 4. Hex colors only (#875A7B, #f5efff, #ffffff, etc.), NO rgba()
 * 5. NO CSS transitions, transforms, or hover animations (use Bootstrap shadow-sm)
 * 6. NO linear-gradient or radial-gradient (solid hex colors only)
 * 7. Font Awesome icons (fa fa-*) with alternative centering (d-inline-flex or text-center + line-height)
 * 8. mailto: links preserved by Odoo sanitizer for support
 * 9. HTML entities (&rarr;, &copy;, etc.) for special characters
 */

export function generateAppStoreHTML(widgetsList, pageSettings = {}) {
    const brandColor = pageSettings.brandColor || '#875A7B';
    const accentColor = pageSettings.accentColor || '#00A09D';

    let sectionsHTML = '';

    widgetsList.forEach((widget, index) => {
        sectionsHTML += `<!-- ========================================== -->\n`;
        sectionsHTML += `<!-- SECTION ${index + 1}: ${widget.type.toUpperCase()} -->\n`;
        sectionsHTML += `<!-- ========================================== -->\n`;
        sectionsHTML += renderWidgetAppStore(widget, brandColor, accentColor);
        sectionsHTML += '\n\n';
    });

    return `<div class="container-fluid p-0" style="color: #1e293b; background-color: #f8f9fa;">
${sectionsHTML}
</div>`;
}

function formatFaIconClass(iconStr, defaultClass = 'fa fa-bolt') {
    if (!iconStr) return defaultClass;
    let s = String(iconStr).trim();
    if (!s) return defaultClass;

    // Normalize modern Font Awesome prefixes (fas, far, fab, etc.) to fa
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
    'favorite', 'schedule', 'progress_activity', 'support_agent', 'contact_support',
    'call', 'groups', 'verified', 'shield', 'send', 'mail', 'link'
]);

const FA_TO_OI_MAP = {
    'fa-envelope': 'email',
    'fa-headphones': 'help',
    'fa-life-ring': 'help',
    'fa-ticket': 'help',
    'fa-book': 'description',
    'fa-comments': 'forum',
    'fa-comment': 'forum',
    'fa-bullhorn': 'campaign',
    'fa-whatsapp': 'forum',
    'fa-skype': 'forum',
    'fa-phone': 'forum',
    'fa-globe': 'business',
    'fa-shield': 'verified',
    'fa-question-circle': 'help',
    'fa-question': 'help',
    'fa-clock-o': 'schedule',
    'fa-star': 'star',
    'fa-desktop': 'desktop_windows',
    'fa-check': 'check_circle'
};

function renderSafeIcon(iconStr, defaultIcon = '<i class="oi" data-icon="task_alt"></i>') {
    if (!iconStr) iconStr = defaultIcon;
    const str = String(iconStr).trim();
    if (str.startsWith('<svg') || str.startsWith('<img') || str.startsWith('data:image')) {
        return str;
    }
    if (str.startsWith('http://') || str.startsWith('https://') || str.endsWith('.png') || str.endsWith('.svg') || str.endsWith('.jpg') || str.endsWith('.webp')) {
        return `<img src="${str}" alt="icon" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">`;
    }

    // Auto-map legacy Font Awesome icons to Odoo OI icons for 100% AppStore compatibility
    for (const [faKey, oiVal] of Object.entries(FA_TO_OI_MAP)) {
        if (str.includes(faKey)) {
            return `<i class="oi" data-icon="${oiVal}" style="font-size: 26px; vertical-align: middle; color: inherit;"></i>`;
        }
    }
    // If it's already an HTML element e.g. <i class="oi" data-icon="person"></i> or <i class="fa ..."></i>
    if (/^<i\s+[^>]*>/i.test(str)) {
        return str;
    }
    // If it has data-icon attribute in text e.g. data-icon="person"
    const dataIconMatch = str.match(/data-icon=["']([^"']+)["']/i);
    if (dataIconMatch) {
        return `<i class="oi" data-icon="${dataIconMatch[1]}" style="font-size: 26px; vertical-align: middle; color: inherit;"></i>`;
    }
    // If it's prefixed with oi: or oi- e.g. oi:person or oi-person
    const oiPrefixMatch = str.match(/^oi[:\s-]+([\w-]+)/i);
    if (oiPrefixMatch) {
        return `<i class="oi" data-icon="${oiPrefixMatch[1]}" style="font-size: 26px; vertical-align: middle; color: inherit;"></i>`;
    }
    // If it's one of the known OI icons
    const cleanLower = str.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanLower === 'call' || cleanLower === 'phone' || cleanLower === 'skype' || cleanLower === 'whatsapp' || cleanLower === 'chat') {
        return `<i class="oi" data-icon="forum" style="font-size: 26px; vertical-align: middle; color: inherit;"></i>`;
    }
    if (KNOWN_OI_ICONS.has(cleanLower)) {
        return `<i class="oi" data-icon="${cleanLower}" style="font-size: 26px; vertical-align: middle; color: inherit;"></i>`;
    }
    const faClass = formatFaIconClass(str, 'fa fa-bolt');
    return `<i class="${faClass}" style="font-size: 22px; vertical-align: middle; color: inherit;"></i>`;
}

function renderTableCheck(val) {
    if (val === true || String(val).toLowerCase() === 'true' || val === 'yes' || val === '1') {
        return `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background-color: #ecfdf5; color: #10b981; border: 1px solid #a7f3d0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 900; line-height: 1;">&#10003;</span>`;
    } else if (val === false || String(val).toLowerCase() === 'false' || val === 'no' || val === '0' || val === '' || val === null || val === undefined) {
        return `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background-color: #f8fafc; color: #94a3b8; border: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 900; line-height: 1;">&#10005;</span>`;
    } else {
        return `<span style="display: inline-block; padding: 4px 10px; border-radius: 12px; background-color: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700; border: 1px solid #bfdbfe; font-family: inherit;">${escapeHTML(String(val))}</span>`;
    }
}

function renderWidgetAppStore(widget, globalBrand, globalAccent) {
    const d = widget.data || {};
    const type = widget.type;

    switch (type) {
        case 'hero_banner': {
            const bg = d.bgColor || globalBrand || '#875A7B';
            const textCol = d.textColor || '#ffffff';
            const accent = d.accentColor || globalAccent || '#00A09D';
            const badgeBg = d.badgeBgColor || '#ffffff';
            let badgeColor = d.badgeTextColor || '#875A7B';
            // Auto-heal white on white legacy issue
            if ((badgeBg.toLowerCase() === '#ffffff' || badgeBg.toLowerCase() === '#f5efff') && (!d.badgeTextColor || d.badgeTextColor.toLowerCase() === '#ffffff')) {
                badgeColor = d.bgColor || globalBrand || '#875A7B';
            }
            const badgeBorder = d.badgeBorderColor || (badgeBg.toLowerCase() === '#ffffff' ? '#e2e8f0' : 'transparent');
            const badgesHTML = (d.badges || []).map(b => 
                `<span class="mx-1 my-1" style="background-color: ${badgeBg}; color: ${badgeColor}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; border: 1px solid ${badgeBorder};">${escapeHTML(b)}</span>`
            ).join(' ');

            return `<section class="py-4 text-center" style="background-color: ${bg}; color: ${textCol};">
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
            const accent = d.accentColor || globalBrand || '#875A7B';
            return `<section class="py-4 text-center" style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">
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
            const iconColor = d.accentColor || globalBrand || '#875A7B';
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
                        <div class="mb-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px; border-radius: 12px; background-color: ${iconBg}; color: ${iconColor} !important; font-size: 22px;">
                            ${iconHtml}
                        </div>
                        <h4 style="font-size: 18px; font-weight: 700; color: ${it.titleColor || '#1e293b'} !important; margin: 0 0 8px 0; line-height: 1.35;">${escapeHTML(it.title || '')}</h4>
                        <p style="font-size: 14px; color: ${it.descColor || '#64748b'} !important; margin: 0; line-height: 1.5; flex: 1;">${escapeHTML(it.desc || '')}</p>
                    </div>
                </div>
            </div>`;
            }).join('');

            return `<section class="py-4" style="background-color: ${bg};">
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
            const globalIconCol = d.accentColor || globalBrand || '#875A7B';
            const iconBg = d.iconBgColor && !d.iconBgColor.includes('rgba') ? d.iconBgColor : (d.iconBgColor || '#f5efff');
            const defaultNumCol = d.numberColor || d.accentColor || globalBrand || '#875A7B';
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
                    <div class="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                        ${iconHtml ? `
                        <div class="mb-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px; border-radius: 12px; background-color: ${iconBg}; color: ${itemIconCol} !important; font-size: 22px;">
                            ${iconHtml}
                        </div>` : ''}
                        <div style="font-size: 32px; font-weight: 700; color: ${numCol} !important; margin-bottom: 4px; line-height: 1.2;">${escapeHTML(st.number || '')}</div>
                        <div style="font-size: 15px; font-weight: 600; color: ${labelCol} !important; line-height: 1.4;">${escapeHTML(st.label || '')}</div>
                    </div>
                </div>
            </div>`;
            }).join('');

            return `<section class="py-4" style="background-color: ${bg};">
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
            const accent = d.accentColor || globalAccent || '#007bff';
            const badgeBg = d.badgeBgColor || accent || '#007bff';
            const badgeText = d.badgeTextColor || '#ffffff';
            const badgeBorder = d.badgeBorderColor || badgeBg;
            const titleCol = d.titleColor || '#1e293b';
            const descCol = d.descColor || '#64748b';
            const pointBg = d.pointBgColor || '#f0f7ff';
            const pointBorder = d.pointBorderColor || '#d0e4ff';
            const pointText = d.pointTextColor || '#1e293b';
            const frameCol = d.frameColor || '#1e293b';
            const isImageLeft = d.layoutPosition !== 'image_right';
            const isDualImage = String(d.imageCount) === '2';

            const points = d.points || d.bulletItems || [];
            const pointsHTML = points.map(pt => `
                <div class="d-flex align-items-center p-3 mb-2" style="background-color: ${pointBg}; border: 1px solid ${pointBorder}; border-radius: 10px;">
                    <span class="me-3" style="color: ${accent} !important; font-size: 20px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="oi" data-icon="check_circle"></i>
                    </span>
                    <span style="font-size: 15px; font-weight: 500; color: ${pointText} !important; line-height: 1.4;">${escapeHTML(pt)}</span>
                </div>
            `).join('');

            const renderPhoneScreen = (imgUrl) => {
                if (imgUrl) {
                    return `<img src="${imgUrl}" alt="Mobile Screen" style="width: 100%; height: auto; display: block; border-radius: 24px;">`;
                }
                return `
                <div style="width: 100%; min-height: 380px; background-color: #0f172a; border-radius: 24px; padding: 20px 14px; color: #94a3b8; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                    <div class="d-flex justify-content-between" style="font-size: 11px; color: #94a3b8;">
                        <span>9:41</span>
                        <span><i class="fa fa-wifi me-1"></i><i class="fa fa-battery-full"></i></span>
                    </div>
                    <div class="text-center py-4">
                        <i class="fa fa-mobile" style="font-size: 44px; color: ${accent}; margin-bottom: 10px; display: block;"></i>
                        <span style="font-size: 13px; font-weight: 600; color: #ffffff; display: block; margin-bottom: 4px;">App Screen Preview</span>
                        <span style="font-size: 11px; color: #64748b; display: block;">Upload mobile screenshot</span>
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
                <div class="d-flex align-items-center mb-3">
                    ${d.badgeNumber ? `<span style="background-color: ${badgeBg}; color: ${badgeText} !important; border: 1px solid ${badgeBorder}; padding: 4px 14px; border-radius: 10px; font-weight: 700; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 38px; margin-right: 12px; line-height: 1; flex-shrink: 0;">${escapeHTML(d.badgeNumber)}</span>` : ''}
                    ${d.badgeText ? `<span style="font-size: 22px; font-weight: 700; color: #1e293b !important; line-height: 1.2;">${escapeHTML(d.badgeText)}</span>` : ''}
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

            return `<section class="py-4" style="background-color: ${bg};">
    <div class="container py-1">
        <div class="row align-items-center">
            ${isImageLeft ? `${imageColHTML}\n            ${contentColHTML}` : `${contentColHTML}\n            ${imageColHTML}`}
        </div>
    </div>
</section>`;
        }

        case 'desktop_showcase': {
            const bg = d.bgColor || '#ffffff';
            const accent = d.accentColor || globalAccent || '#007bff';
            const badgeBg = d.badgeBgColor || accent || '#007bff';
            const badgeText = d.badgeTextColor || '#ffffff';
            const badgeBorder = d.badgeBorderColor || badgeBg;
            const titleCol = d.titleColor || '#1e293b';
            const descCol = d.descColor || '#64748b';
            const pointBg = d.pointBgColor || '#f0f7ff';
            const pointBorder = d.pointBorderColor || '#d0e4ff';
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
                            <span class="me-3" style="color: ${accent} !important; font-size: 20px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="oi" data-icon="check_circle"></i>
                            </span>
                            <span style="font-size: 15px; font-weight: 500; color: ${pointText} !important; line-height: 1.4;">${escapeHTML(pt)}</span>
                        </div>
                    </div>`;
                }
                return `
                <div class="${colClass} mb-3">
                    <div class="h-100 d-flex align-items-center p-3" style="background-color: ${pointBg}; border: 1px solid ${pointBorder}; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                        <span class="me-3" style="color: ${accent} !important; font-size: 22px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="oi" data-icon="check_circle"></i>
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
                <div style="width: 100%; min-height: 380px; background-color: #0f172a; padding: 40px 20px; color: #94a3b8; display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box;">
                    <i class="fa fa-desktop" style="font-size: 54px; color: ${accent}; margin-bottom: 14px; display: block;"></i>
                    <span style="font-size: 16px; font-weight: 600; color: #ffffff; display: block; margin-bottom: 6px;">Desktop Interface Full View</span>
                    <span style="font-size: 13px; color: #64748b; display: block;">Upload full-width web screenshot or backend dashboard</span>
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

            return `<section class="py-4" style="background-color: ${bg};">
    <div class="container py-1">
        <!-- TOP: Count, Category, Title, Subtitle -->
        <div class="row ${isCenter ? 'justify-content-center text-center' : ''} mb-3">
            <div class="col-12 col-lg-10">
                ${(d.badgeNumber || d.badgeText) ? `
                <div class="d-flex align-items-center ${isCenter ? 'justify-content-center' : ''} mb-3">
                    ${d.badgeNumber ? `<span style="background-color: ${badgeBg}; color: ${badgeText} !important; border: 1px solid ${badgeBorder}; padding: 4px 14px; border-radius: 10px; font-weight: 700; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 38px; margin-right: 12px; line-height: 1; flex-shrink: 0;">${escapeHTML(d.badgeNumber)}</span>` : ''}
                    ${d.badgeText ? `<span style="font-size: 22px; font-weight: 700; color: #1e293b !important; line-height: 1.2;">${escapeHTML(d.badgeText)}</span>` : ''}
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
            const accent = d.accentColor || globalBrand || '#875A7B';
            const bullets = (d.bulletItems || []).map(b => `
                <li class="d-flex align-items-start mb-3" style="font-size: 15px; color: #334155;">
                    <span class="me-3 mt-1" style="color: #10b981; font-size: 16px;"><i class="fa fa-check-circle"></i></span>
                    <span>${escapeHTML(b)}</span>
                </li>`).join('');

            return `<section class="py-4" style="background-color: ${bg};">
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

            return `<section class="py-4" style="background-color: ${bg};">
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
            const globalBrand = (typeof pageSettings !== 'undefined' && pageSettings.brandColor) || '#714B67';

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
                <div class="card h-100 shadow-sm" style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
                    <div class="card-body p-4 d-flex flex-column ${isCenter ? 'text-center align-items-center' : 'text-start'}">
                        <div class="d-flex align-items-center ${isCenter ? 'justify-content-center' : 'justify-content-start'} w-100 mb-3">
                            <span style="display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 44px; padding: 0 12px; border-radius: 50px; background-color: ${badgeBg}; color: ${badgeText} !important; font-size: 17px; font-weight: 800; line-height: 1; box-shadow: 0 4px 10px rgba(0,0,0,0.12); flex-shrink: 0;">
                                ${escapeHTML(numVal)}
                            </span>
                        </div>
                        <h4 style="font-size: 18px; font-weight: 700; color: ${cardTitleCol} !important; margin: 0 0 10px 0; line-height: 1.35; width: 100%;">${escapeHTML(s.title || '')}</h4>
                        <p style="font-size: 14px; color: ${cardDescCol} !important; line-height: 1.6; margin: 0; flex: 1; width: 100%;">${escapeHTML(s.desc || '')}</p>
                    </div>
                </div>
            </div>`;
            }).join('');

            return `<section class="py-4" style="background-color: ${bg};">
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
            const bg = d.bgColor || '#f8fafc';
            const cardBg = d.cardBgColor || '#ffffff';
            const cardBorder = d.cardBorderColor || '#e2e8f0';
            const headerBg = d.headerBgColor || '#f8fafc';
            const headerTextColor = d.headerTextColor || '#334155';
            const titleColor = d.titleColor || '#1e293b';
            const subtitleColor = d.subtitleColor || '#64748b';
            const accent = d.accentColor || globalAccent || '#007bff';
            const rows = d.rows || [];

            const rowsHTML = rows.map((r, i) => `
            <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${i % 2 === 0 ? '#ffffff' : '#fafafa'};">
                <td style="padding: 14px 22px;">
                    <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">${escapeHTML(r.feature || '')}</div>
                    ${r.detail ? `<div style="font-size: 12px; color: #64748b; line-height: 1.4;">${escapeHTML(r.detail)}</div>` : ''}
                </td>
                <td style="padding: 14px 16px; text-align: center; background-color: #f8fbff; border-left: 2px solid #e0f0fe; border-right: 2px solid #e0f0fe;">
                    ${renderTableCheck(r.ourApp !== undefined ? r.ourApp : true)}
                </td>
                <td style="padding: 14px 16px; text-align: center;">
                    ${renderTableCheck(r.competitor !== undefined ? r.competitor : false)}
                </td>
            </tr>`).join('');

            return `<section class="py-4" style="background-color: ${bg};">
    <div class="container py-1" style="max-width: 980px;">
        <div class="row justify-content-center text-center mb-3">
            <div class="col-12 col-lg-10">
                ${d.title ? `<h2 style="font-size: 30px; font-weight: 700; color: ${titleColor} !important; margin: 0 0 8px 0; line-height: 1.3;">${escapeHTML(d.title)}</h2>` : ''}
                ${d.subtitle ? `<p style="font-size: 15px; color: ${subtitleColor} !important; margin: 0 auto; line-height: 1.6; max-width: 720px;">${escapeHTML(d.subtitle)}</p>` : ''}
            </div>
        </div>
        <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden;">
            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; margin: 0; background-color: ${cardBg};">
                    <thead>
                        <tr style="background-color: ${headerBg}; border-bottom: 2px solid ${cardBorder};">
                            <th style="padding: 18px 22px; font-size: 13px; font-weight: 700; color: ${headerTextColor}; text-transform: uppercase; letter-spacing: 0.5px; width: 48%;">${escapeHTML(d.col1Title || 'Key Capabilities & Features')}</th>
                            <th style="padding: 16px 16px; text-align: center; background-color: #f0f7ff; border-left: 2px solid #bfdbfe; border-right: 2px solid #bfdbfe; border-top: 3px solid ${accent}; width: 26%;">
                                ${d.col2Badge ? `<span style="display: inline-block; background-color: ${accent}; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">${escapeHTML(d.col2Badge)}</span><br>` : ''}
                                <span style="font-size: 14px; font-weight: 800; color: ${accent};">${escapeHTML(d.col2Title || 'Our Module')}</span>
                            </th>
                            <th style="padding: 18px 16px; font-size: 13px; font-weight: 700; color: ${headerTextColor}; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; width: 26%;">${escapeHTML(d.col3Title || 'Standard Odoo')}</th>
                        </tr>
                    </thead>
                    <tbody>${rowsHTML}</tbody>
                </table>
            </div>
        </div>
    </div>
</section>`;
        }

        case 'faq_section': {
            const bg = d.bgColor || '#ffffff';
            const headerBg = d.headerBg || '#eff6ff';
            const questionColor = d.questionColor || '#2563eb';
            const borderColor = d.borderColor || '#dbeafe';
            const faqs = d.faqs || [];
            const faqsHTML = faqs.map((f, idx) => {
                const isOpen = f.isOpen === true || (f.isOpen === undefined && idx === 0);
                const openAttr = isOpen ? ' open' : '';
                return `
        <details class="faq-accordion-item"${openAttr} style="background-color: #ffffff; border: 1px solid ${borderColor}; border-radius: 10px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <summary style="background-color: ${headerBg}; color: ${questionColor}; padding: 14px 20px; font-weight: 600; font-size: 15px; cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; user-select: none; outline: none; transition: background-color 0.2s;">
                <span style="display: inline-block; padding-right: 12px; color: ${questionColor}; font-weight: 600; font-size: 15px; line-height: 1.4;">${escapeHTML(f.q)}</span>
                <svg class="faq-chevron" style="width: 18px; height: 18px; min-width: 18px; stroke: ${questionColor}; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.2s ease;" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </summary>
            <div style="padding: 16px 20px; background-color: #ffffff; color: #334155; font-size: 14.5px; line-height: 1.65; border-top: 1px solid ${borderColor};">
                ${escapeHTML(f.a)}
            </div>
        </details>`;
            }).join('');

            return `<section class="py-4" style="background-color: ${bg};">
    <style>
        details.faq-accordion-item summary::-webkit-details-marker,
        details.faq-accordion-item summary::marker {
            display: none !important;
        }
        details.faq-accordion-item[open] .faq-chevron {
            transform: rotate(180deg);
        }
        details.faq-accordion-item summary:hover {
            filter: brightness(0.97);
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
                if (d.email) channels.push({ icon: '<i class="oi" data-icon="email"></i>', label: 'Email Support', value: d.email, url: `mailto:${d.email}` });
                channels.push({ icon: '<i class="oi" data-icon="forum"></i>', label: 'Community Forum', value: 'Join Discussions', url: 'https://yourdomain.com/forum' });
                channels.push({ icon: '<i class="oi" data-icon="campaign"></i>', label: 'Latest Updates', value: 'News & Releases', url: 'https://yourdomain.com/updates' });
                channels.push({ icon: '<i class="oi" data-icon="help"></i>', label: 'Helpdesk Portal', value: 'Submit a Ticket', url: 'https://yourdomain.com/helpdesk' });
            }

            const colClass = channels.length <= 2 ? 'col-12 col-sm-6 mb-3' : (channels.length === 3 ? 'col-12 col-sm-6 col-md-4 mb-3' : (channels.length === 4 ? 'col-12 col-sm-6 col-md-3 mb-3' : 'col-12 col-sm-6 col-md-4 mb-3'));

            const channelsHTML = channels.map((c) => {
                const iconHtml = renderSafeIcon(c.icon, '<i class="oi" data-icon="help"></i>');
                let linkUrl = (c.url || '').trim();
                if (!linkUrl && c.value) {
                    if (c.value.includes('@')) linkUrl = `mailto:${c.value.trim()}`;
                    else if (/^(\+|00)[0-9\s-]+$/.test(c.value.trim())) linkUrl = `tel:${c.value.trim().replace(/\s+/g, '')}`;
                }

                const cardInner = `
                    <div class="card h-100 shadow-sm p-3 text-center" style="background-color: ${cardBg}; color: #1e293b; border: 1px solid ${cardBorder}; border-radius: 12px; transition: transform 0.2s, box-shadow 0.2s;">
                        <div class="mb-2" style="font-size: 28px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; height: 36px; color: ${iconCol} !important;">
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

            return `<section class="py-4 my-2" style="background-color: ${bg}; color: ${textCol}; border-radius: 16px;">
    <style>
        .oi, i.oi { display: inline-block; font-family: 'Material Symbols Outlined' !important; font-style: normal; font-weight: 400 !important; line-height: 1; letter-spacing: normal; text-transform: none; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; vertical-align: middle; }
        .oi:before, .oi::before, i.oi:before, i.oi::before { display: inline-block; content: attr(data-icon); text-rendering: geometricPrecision; word-break: keep-all; }
    </style>
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
            const colClass = d.columns === '2' ? 'col-12 col-md-6 mb-3' : (d.columns === '4' ? 'col-12 col-sm-6 col-lg-3 mb-3' : 'col-12 col-md-6 col-lg-4 mb-3');

            const appsList = Array.isArray(d.apps) ? d.apps : [];
            const appsHTML = appsList.map((app) => {
                let bannerSrc = (app.bannerUrl || '').trim();
                const srcMatch = bannerSrc.match(/src=["'](.*?)["']/i);
                if (srcMatch) bannerSrc = srcMatch[1];

                const bannerHTML = bannerSrc
                    ? `<img src="${escapeHTML(bannerSrc)}" style="width:100%; height:auto; border-bottom:1px solid #e2e8f0; display:block" alt="${escapeHTML(app.title || '')}">`
                    : `<div style="width: 100%; height: 180px; background: linear-gradient(135deg, ${brandColor || '#875A7B'} 0%, #1e293b 100%); display: flex; align-items: center; justify-content: center; color: #ffffff; padding: 16px; text-align: center; border-bottom: 1px solid #e2e8f0;">
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

            return `<section class="py-4" style="background-color: ${bg};">
    <div class="container py-1" style="max-width: 1140px;">
        ${d.title ? `<div class="row justify-content-center text-center mb-3">
            <div class="col-12 col-lg-9">
                <h2 style="font-size: 32px; font-weight: 700; color: ${titleCol}; margin-bottom: 8px;">${escapeHTML(d.title)}</h2>
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

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
