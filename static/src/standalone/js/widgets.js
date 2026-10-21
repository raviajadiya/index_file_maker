// Odoo AppStore Index Maker - Widget Catalog & Presets

const WIDGET_CATALOG = [
    {
        category: 'Headers & Banners',
        widgets: [
            {
                type: 'hero_banner',
                name: 'Hero Banner Pro',
                desc: 'Top header with title, slogan, custom badges & CTA buttons',
                icon: 'fa-trophy',
                defaultData: {
                    title: 'Odoo AppStore Index File Maker Pro',
                    subtitle: 'Visually design, customize, and export high-converting, 100% compliant Odoo App Store description pages with drag-and-drop ease.',
                    iconUrl: '',
                    showBadges: true,
                    badges: ['Community', 'Enterprise', 'Odoo 20', 'Odoo 19', 'Odoo 18', 'Odoo 17'],
                    badgeBgColor: '#ffffff',
                    badgeTextColor: '#714B67',
                    badgeBorderColor: '#e2e8f0',
                    primaryBtnText: 'Start Building',
                    primaryBtnUrl: '#features',
                    secondaryBtnText: 'Live Demo',
                    secondaryBtnUrl: '#demo',
                    bgColor: '#714B67',
                    textColor: '#ffffff',
                    accentColor: '#00A09D',
                }
            },
            {
                type: 'minimal_header',
                name: 'Minimal Header',
                desc: 'Clean, elegant header for utility extensions',
                icon: 'fa-header',
                defaultData: {
                    title: 'Odoo AppStore Index File Maker',
                    subtitle: 'Build responsive, store-compliant module description pages in minutes without writing raw HTML.',
                    badge: 'ODOO 20 READY',
                    bgColor: '#ffffff',
                    textColor: '#1e293b',
                    accentColor: '#714B67'
                }
            },
            {
                type: 'discount_ribbon',
                name: 'Announcement Ribbon',
                desc: 'Top bar notification or discount banner',
                icon: 'fa-bullhorn',
                defaultData: {
                    text: '🎉 NEW: Visual drag-and-drop builder with instant multi-device preview & 1-click clean HTML export!',
                    btnText: 'Explore Features',
                    btnUrl: '#features',
                    bgColor: '#714B67',
                    textColor: '#ffffff'
                }
            }
        ]
    },
    {
        category: 'Highlights & Metrics',
        widgets: [
            {
                type: 'highlights_grid',
                name: 'Key Highlights 4-Grid',
                desc: '4 metric or highlight cards with gradient icons',
                icon: 'fa-th-large',
                defaultData: {
                    title: 'Why Choose Index File Maker?',
                    titleColor: '#1e293b',
                    subtitle: 'Engineered specifically for Odoo developers and partners to create high-converting App Store descriptions',
                    subtitleColor: '#64748b',
                    bgColor: '#ffffff',
                    columns: 4,
                    accentColor: '#714B67',
                    iconBgColor: '#f5efff',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    items: [
                        { title: '100% Store Compliant', desc: 'Outputs clean Bootstrap 5 and inline styles strictly compliant with Odoo sanitization guidelines.', icon: '<i class="fa fa-check-circle"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Drag & Drop Canvas', desc: 'Easily assemble heroes, feature showcases, VS comparison tables, FAQs, and footers.', icon: '<i class="fa fa-th-large"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Real-Time Device Preview', desc: 'Instantly toggle between Desktop, Tablet, and Mobile views to ensure pixel-perfect rendering.', icon: '<i class="fa fa-desktop"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: '1-Click HTML Export', desc: 'Export production-ready index.html in one click and place it straight into static/description.', icon: '<i class="fa fa-download"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                    ]
                }
            },
            {
                type: 'stats_counter',
                name: 'Stats Banner',
                desc: '3 impressive key metric counters',
                icon: 'fa-tachometer',
                defaultData: {
                    title: 'Proven Performance for Odoo Publishers',
                    titleColor: '#1e293b',
                    subtitle: 'Trusted by top Odoo partners, publishers, and developers worldwide to boost module conversions',
                    subtitleColor: '#64748b',
                    bgColor: '#f8fafc',
                    columns: 3,
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    accentColor: '#714B67',
                    iconBgColor: '#f5efff',
                    numberColor: '#714B67',
                    labelColor: '#64748b',
                    stats: [
                        { number: '10x Faster', label: 'Index Page Creation Speed', icon: '<i class="fa fa-bolt"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' },
                        { number: '100%', label: 'Odoo App Store Compliant', icon: '<i class="fa fa-shield"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' },
                        { number: '5.0 ★', label: 'Developer Rating (200+ Reviews)', icon: '<i class="fa fa-star"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Features & Benefits',
        widgets: [
            {
                type: 'mobile_showcase',
                name: 'Mobile Showcase',
                desc: 'Mobile mockup frame with step count badge, 1 or 2 phones, and feature point cards',
                icon: 'fa-mobile',
                defaultData: {
                    badgeNumber: '01',
                    badgeText: 'Responsive Design',
                    title: 'Pixel-Perfect Mobile & Tablet Preview',
                    desc: 'Ensure your Odoo app description displays flawlessly on any screen size. Test and preview mobile responsiveness in real time.',
                    layoutPosition: 'image_left',
                    imageCount: '2',
                    image1Url: '',
                    image2Url: '',
                    image1Caption: '',
                    image2Caption: '',
                    points: [
                        'Live viewport switching between Desktop, Tablet, and Mobile mode',
                        'Auto-collapsing columns and touch-optimized responsive layouts',
                        'Zero broken elements or overflowing content on smaller displays'
                    ],
                    bgColor: '#ffffff',
                    accentColor: '#714B67',
                    badgeBgColor: '#714B67',
                    badgeTextColor: '#ffffff',
                    badgeBorderColor: '#714B67',
                    badgePreset: 'purple',
                    titleColor: '#1e293b',
                    descColor: '#64748b',
                    pointBgColor: '#fdf8fc',
                    pointBorderColor: '#f0e6ed',
                    pointTextColor: '#1e293b',
                    frameColor: '#1e293b'
                }
            },
            {
                type: 'desktop_showcase',
                name: 'Desktop Showcase',
                desc: 'Full-width desktop mockup with top count badge, title, and bottom feature point cards',
                icon: 'fa-desktop',
                defaultData: {
                    badgeNumber: '02',
                    badgeText: 'Visual Builder Studio',
                    title: 'Interactive Drag & Drop Studio Canvas',
                    desc: 'Drag widgets onto the canvas, reorder sections with smooth drag handles, customize typography, and inspect properties in real time.',
                    headerAlign: 'center',
                    pointsLayout: 'grid',
                    frameStyle: 'browser',
                    browserUrl: 'https://apps.odoo.com/apps/modules/browse?search=index_file_maker',
                    imageUrl: '',
                    imageCaption: '',
                    points: [
                        'Rich widget catalog: Heroes, Highlights, Comparison Tables, FAQs & Support',
                        'Dynamic brand color palette switcher & live hexadecimal color inspector',
                        'Instant source code inspector and 1-click clean index.html download'
                    ],
                    bgColor: '#ffffff',
                    accentColor: '#714B67',
                    badgeBgColor: '#714B67',
                    badgeTextColor: '#ffffff',
                    badgeBorderColor: '#714B67',
                    badgePreset: 'purple',
                    titleColor: '#1e293b',
                    descColor: '#64748b',
                    pointBgColor: '#fdf8fc',
                    pointBorderColor: '#f0e6ed',
                    pointTextColor: '#1e293b',
                    frameColor: '#1e293b'
                }
            },
            {
                type: 'workflow_steps',
                name: '3-Step How It Works',
                desc: 'Numbered step-by-step onboarding cards with custom colors',
                icon: 'fa-list-ol',
                defaultData: {
                    title: 'Create Your Index in 3 Simple Steps',
                    titleColor: '#1e293b',
                    subtitle: 'Streamlined visual workflow from blank canvas to published Odoo App Store listing',
                    subtitleColor: '#64748b',
                    bgColor: '#f8fafc',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    cardTitleColor: '#1e293b',
                    cardDescColor: '#64748b',
                    badgeBgColor: '#714B67',
                    badgeTextColor: '#ffffff',
                    columns: 3,
                    align: 'center',
                    steps: [
                        { num: '1', title: 'Drag & Drop Widgets', desc: 'Select pre-styled hero banners, feature grids, screenshots, and comparison tables from the catalog.' },
                        { num: '2', title: 'Customize Content & Theme', desc: 'Insert your module features, screenshots, FAQs, and customize colors to match your brand identity.' },
                        { num: '3', title: 'Export index.html', desc: 'Download clean, sanitized HTML and drop it directly into your module’s static/description folder.' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Comparison & Tables',
        widgets: [
            {
                type: 'vs_table',
                name: 'Feature Comparison (VS Table)',
                desc: 'Side-by-side comparison table highlighting your app vs standard Odoo / competitors',
                icon: 'fa-columns',
                defaultData: {
                    title: 'Why Choose Index File Maker?',
                    subtitle: 'See how our visual drag-and-drop builder saves development hours compared to manual HTML coding',
                    bgColor: '#ffffff',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    headerBgColor: '#f8fafc',
                    headerTextColor: '#334155',
                    titleColor: '#1e293b',
                    subtitleColor: '#64748b',
                    accentColor: '#714B67',
                    col1Title: 'Key Capabilities & Features',
                    col2Title: 'Index File Maker',
                    col2Badge: 'Recommended',
                    col3Title: 'Manual HTML Coding',
                    rows: [
                        { feature: 'Visual Drag & Drop Canvas', detail: 'Build sections interactively with live visual feedback', ourApp: true, competitor: false },
                        { feature: 'Odoo App Store Guideline Compliance', detail: 'Strict adherence to Bootstrap 5, sanitization rules, and hex colors', ourApp: true, competitor: 'Error-Prone' },
                        { feature: 'Pre-Designed Widget Catalog', detail: 'Ready-to-use banners, grids, mockups, comparison tables & FAQs', ourApp: true, competitor: false },
                        { feature: 'Multi-Device Responsive Preview', detail: 'Instant toggle between Desktop, Tablet, and Mobile viewports', ourApp: true, competitor: 'Manual Testing' },
                        { feature: '1-Click Clean Code Export', detail: 'Download production-ready index.html with zero disallowed scripts', ourApp: true, competitor: 'Slow & Tedious' },
                        { feature: 'Dedicated Support & Updates', detail: 'Regular updates for upcoming Odoo versions with free assistance', ourApp: 'Included', competitor: 'None' }
                    ]
                }
            }
        ]
    },
    {
        category: 'FAQs & Reviews',
        widgets: [
            {
                type: 'faq_section',
                name: 'FAQ Accordion Cards',
                desc: 'Frequently asked questions with answers',
                icon: 'fa-question-circle',
                defaultData: {
                    title: 'Frequently Asked Questions',
                    subtitle: 'Everything you need to know about Odoo App Store index generation and compatibility',
                    bgColor: '#ffffff',
                    headerBg: '#fdf8fc',
                    questionColor: '#714B67',
                    borderColor: '#e2e8f0',
                    faqs: [
                        {
                            q: 'Is the generated HTML 100% compliant with Odoo App Store rules?',
                            a: 'Yes! All exported code uses standard Bootstrap grid classes and inline styles with zero external scripts or forbidden tags, ensuring 100% compliance with Odoo App Store sanitization guidelines.',
                            isOpen: true
                        },
                        {
                            q: 'Where should I place the generated index.html in my module?',
                            a: 'Save the downloaded file as index.html inside your Odoo module under the static/description/ folder (e.g. your_module/static/description/index.html).',
                            isOpen: false
                        },
                        {
                            q: 'Can I customize the color palette and typography?',
                            a: 'Yes! You can choose from pre-set curated palettes (Odoo Purple, Ocean Blue, Emerald, etc.) or set custom primary and accent hex colors for each individual widget.',
                            isOpen: false
                        },
                        {
                            q: 'Does this module work on both Community and Enterprise?',
                            a: 'Yes, Index File Maker runs smoothly on both Odoo Community and Enterprise editions across Odoo 17, 18, 19, and 20.',
                            isOpen: false
                        }
                    ]
                }
            }
        ]
    },
    {
        category: 'Related Apps & Cross-Sell',
        widgets: [
            {
                type: 'other_apps',
                name: 'Other Apps Showcase',
                desc: 'Showcase other Odoo modules with vibrant cards, author, price, badge & CTA button',
                icon: 'fa-th-large',
                defaultData: {
                    title: 'Other Recommended Odoo Developer Tools',
                    subtitle: 'Supercharge your Odoo development and business workflow with our premium extensions',
                    bgColor: '#ffffff',
                    titleColor: '#1e293b',
                    columns: '3',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    priceColor: '#059669',
                    btnBgColor: '#714B67',
                    btnTextColor: '#ffffff',
                    apps: [
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Odoo Code Snippets & Builder Pro',
                            company: 'Your Company',
                            price: '$ 29.00',
                            badge: 'Bestseller',
                            version: 'Odoo 20',
                            btnText: 'Get App',
                            appUrl: 'https://apps.odoo.com/apps/modules/browse?search=developer+tools'
                        },
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Automated WhatsApp & SMS Gateway',
                            company: 'Your Company',
                            price: '$ 39.00',
                            badge: 'Featured',
                            version: 'Odoo 20',
                            btnText: 'Get App',
                            appUrl: 'https://apps.odoo.com/apps/modules/browse?search=whatsapp'
                        },
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Universal Document & PDF Watermark',
                            company: 'Your Company',
                            price: '$ 19.00',
                            badge: 'Popular',
                            version: 'Odoo 20',
                            btnText: 'Get App',
                            appUrl: 'https://apps.odoo.com/apps/modules/browse?search=pdf+watermark'
                        }
                    ]
                }
            }
        ]
    },
    {
        category: 'Support & Footer',
        widgets: [
            {
                type: 'support_banner',
                name: 'Support & Contact Card',
                desc: 'Dedicated support contacts, email, forum, updates, and warranty badge',
                icon: 'fa-life-ring',
                defaultData: {
                    title: 'Dedicated Support & Custom Widget Development',
                    subtitle: 'Have a question or need custom widgets for your Odoo module descriptions? Our team is here to help.',
                    badge: 'Dedicated Support Included',
                    bgColor: '#714B67',
                    textColor: '#ffffff',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    iconColor: '#714B67',
                    channels: [
                        {
                            icon: '<i class="fa fa-envelope"></i>',
                            label: 'Email Support',
                            value: 'support@yourdomain.com',
                            url: 'mailto:support@yourdomain.com'
                        },
                        {
                            icon: '<i class="fa fa-comments"></i>',
                            label: 'Community Forum',
                            value: 'Join Discussions',
                            url: 'https://yourdomain.com/forum'
                        },
                        {
                            icon: '<i class="fa fa-bullhorn"></i>',
                            label: 'Latest Updates',
                            value: 'News & Releases',
                            url: 'https://yourdomain.com/updates'
                        },
                        {
                            icon: '<i class="fa fa-life-ring"></i>',
                            label: 'Helpdesk Portal',
                            value: 'Submit a Ticket',
                            url: 'https://yourdomain.com/helpdesk'
                        }
                    ]
                }
            },
            {
                type: 'footer_brand',
                name: 'Brand & Copyright Footer',
                desc: 'Fully customizable brand, copyright, quick links & developer signature',
                icon: 'fa-bookmark',
                defaultData: {
                    companyName: 'Your Company Name',
                    companyUrl: 'https://yourdomain.com',
                    year: '2026',
                    copyrightNotice: 'All Rights Reserved',
                    tagline: 'Crafted with <i class="fa fa-heart" style="color: #ef4444;"></i> for the Odoo Global Community',
                    logoUrl: '',
                    contactInfo: 'support@yourdomain.com',
                    layout: 'split',
                    showLinks: true,
                    links: [
                        { label: 'Documentation', url: 'https://yourdomain.com/docs', icon: 'fa-book' },
                        { label: 'Helpdesk Portal', url: 'https://yourdomain.com/helpdesk', icon: 'fa-life-ring' },
                        { label: 'More Odoo Apps', url: 'https://apps.odoo.com', icon: 'fa-th-large' },
                        { label: 'Official Website', url: 'https://yourdomain.com', icon: 'fa-globe' }
                    ],
                    bgColor: '#1e293b',
                    textColor: '#94a3b8',
                    companyColor: '#ffffff',
                    linkColor: '#38bdf8',
                    accentColor: '#ef4444'
                }
            }
        ]
    }
];
