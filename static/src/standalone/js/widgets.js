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
                    title: 'Advanced Sales Commission & Incentive Pro',
                    subtitle: 'Automate complex multi-tier sales commissions, bonus tiers, and real-time salesman payouts effortlessly in Odoo.',
                    iconUrl: '',
                    showBadges: true,
                    badges: ['Community', 'Enterprise', 'Odoo 20', 'Odoo 19', 'Odoo 18', 'Odoo 17'],
                    badgeBgColor: '#ffffff',
                    badgeTextColor: '#714B67',
                    badgeBorderColor: '#e2e8f0',
                    primaryBtnText: 'Explore Features',
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
                    title: 'Advanced Sales Commission & Incentive Pro',
                    subtitle: 'Automate complex multi-tier sales commissions, bonus tiers, and real-time salesman payouts.',
                    badge: 'ODOO 20 CERTIFIED',
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
                    text: '🎉 NEW: Full Odoo 20 compatibility and automated multi-currency calculation boost released!',
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
                    title: 'Why Choose This Solution?',
                    titleColor: '#1e293b',
                    subtitle: 'Engineered for high performance, accuracy, and enterprise scalability',
                    subtitleColor: '#64748b',
                    bgColor: '#ffffff',
                    columns: 4,
                    accentColor: '#714B67',
                    iconBgColor: '#f5efff',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    items: [
                        { title: '100% Automated', desc: 'Zero manual calculation errors with real-time formula triggers.', icon: '<i class="fa fa-check-circle"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Multi-Company Ready', desc: 'Seamless support for multiple companies, currencies, and branches.', icon: '<i class="fa fa-building"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Role-Based Security', desc: 'Dedicated portal for sales reps and granular manager approvals.', icon: '<i class="fa fa-lock"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Plug & Play Setup', desc: 'Configure commission rules and start operating in under 5 minutes.', icon: '<i class="fa fa-clock-o"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                    ]
                }
            },
            {
                type: 'stats_counter',
                name: 'Stats Banner',
                desc: '3 impressive key metric counters',
                icon: 'fa-tachometer',
                defaultData: {
                    title: 'Proven Performance & Enterprise Trust',
                    titleColor: '#1e293b',
                    subtitle: 'Trusted by top Odoo partners and fast-growing global sales organizations',
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
                        { number: '99.9%', label: 'Calculation Accuracy', icon: '<i class="fa fa-check-circle"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' },
                        { number: '10,000+', label: 'Active Sales Reps', icon: '<i class="fa fa-users"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' },
                        { number: '5.0 ★', label: 'User Rating (150+ Reviews)', icon: '<i class="fa fa-star"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' }
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
                    badgeText: 'Mobile Portal',
                    title: 'Real-Time Mobile Sales Rep Portal',
                    desc: 'Empower your field sales representatives to check their accrued commission, view target milestones, and request payouts on the go.',
                    layoutPosition: 'image_left',
                    imageCount: '2',
                    image1Url: '',
                    image2Url: '',
                    image1Caption: '',
                    image2Caption: '',
                    points: [
                        'Instant visibility of earned commissions and pending approvals',
                        'Real-time push notifications on target achievements',
                        'Mobile PDF statements export and direct payout requests'
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
                    badgeText: 'Operations Hub',
                    title: 'Interactive Real-Time Operations Hub',
                    desc: 'Centralize and monitor your entire business performance with live KPI metrics, dynamic filtering, and interactive data visualization.',
                    headerAlign: 'center',
                    pointsLayout: 'grid',
                    frameStyle: 'browser',
                    browserUrl: 'https://my-company.odoo.com/web#dashboard',
                    imageUrl: '',
                    imageCaption: '',
                    points: [
                        'Real-time automated transaction and sales tracking',
                        'Multi-currency ledger reconciliation with instant filtering',
                        'One-click export to Excel, PDF, and audit log history'
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
                    title: 'How It Works in 3 Simple Steps',
                    titleColor: '#1e293b',
                    subtitle: 'Streamlined 3-step automation from order validation to payout release',
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
                        { num: '1', title: 'Install & Configure Rules', desc: 'Define multi-level commission percentages by product, sales team, or profit margin.' },
                        { num: '2', title: 'Automatic Calculation', desc: 'System automatically triggers accurate commission lines upon invoice confirmation.' },
                        { num: '3', title: 'Approve & Payout', desc: 'Manager reviews with one-click approval and automated payroll payout release.' }
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
                    title: 'Why Choose Our Solution?',
                    subtitle: 'See how our advanced module delivers superior features and automation compared to standard Odoo',
                    bgColor: '#ffffff',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    headerBgColor: '#f8fafc',
                    headerTextColor: '#334155',
                    titleColor: '#1e293b',
                    subtitleColor: '#64748b',
                    accentColor: '#714B67',
                    col1Title: 'Key Capabilities & Features',
                    col2Title: 'Our Module',
                    col2Badge: 'Recommended',
                    col3Title: 'Standard Odoo',
                    rows: [
                        { feature: 'Multi-Level Approval Rules', detail: 'Dynamic tiers by department, manager, and custom amounts', ourApp: true, competitor: false },
                        { feature: 'Automated Real-Time Triggers', detail: 'Instant calculation on order validation and payment registration', ourApp: true, competitor: false },
                        { feature: 'Interactive Analytics & KPIs', detail: 'Live graphical drill-down metrics and forecasting cards', ourApp: true, competitor: 'Basic Only' },
                        { feature: 'Bulk Commission Processing', detail: 'Process hundreds of invoices and payouts in a single batch', ourApp: true, competitor: false },
                        { feature: 'Custom PDF & Excel Designer', detail: 'Branded export templates with company logos and styles', ourApp: true, competitor: false },
                        { feature: 'Dedicated Free Support & Upgrades', detail: 'Fast direct assistance via email, community forum, and helpdesk portal', ourApp: '90 Days Free', competitor: 'Paid / None' }
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
                    subtitle: 'Everything you need to know about installation, compatibility, and rules',
                    bgColor: '#ffffff',
                    headerBg: '#fdf8fc',
                    questionColor: '#714B67',
                    borderColor: '#e2e8f0',
                    faqs: [
                        {
                            q: 'How does the automated calculation trigger work?',
                            a: 'Commissions are automatically calculated in real-time as soon as a sales order is confirmed or when customer payment is registered, according to your chosen accounting workflow.',
                            isOpen: true
                        },
                        {
                            q: 'Does this module support multi-company and multi-currency?',
                            a: 'Yes, our module fully supports multi-company environments with individual rule separation, as well as automatic currency conversion using live Odoo exchange rates.',
                            isOpen: false
                        },
                        {
                            q: 'Is this module compatible with both Community and Enterprise?',
                            a: 'Yes! It is fully certified and tested on Odoo 20, 19, 18, and 17 for both Community and Enterprise editions with 100% feature parity.',
                            isOpen: false
                        },
                        {
                            q: 'Can we request custom modifications or additional features?',
                            a: 'Yes! Our team of certified Odoo experts provides tailored customization, dedicated integration services, and comprehensive technical support.',
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
                desc: 'Showcase other Odoo modules with banner image, title, author, price & App Store link',
                icon: 'fa-th-large',
                defaultData: {
                    title: 'Other Popular Odoo Modules',
                    subtitle: 'Boost your enterprise productivity with our top-rated Odoo extensions',
                    bgColor: '#ffffff',
                    titleColor: '#1e293b',
                    columns: '3',
                    apps: [
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'All-in-One Sales Commission Pro',
                            company: 'Your Company',
                            price: '$ 49.00',
                            appUrl: 'https://apps.odoo.com/apps/modules/browse?search=sales+commission'
                        },
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Automated WhatsApp & SMS Gateway',
                            company: 'Your Company',
                            price: '$ 39.00',
                            appUrl: 'https://apps.odoo.com/apps/modules/browse?search=whatsapp'
                        },
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Universal Document & PDF Watermark',
                            company: 'Your Company',
                            price: '$ 19.00',
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
                    title: 'Dedicated Support & Tailored Customization',
                    subtitle: 'Have a question or need custom modifications? Our experienced Odoo team is here to assist you.',
                    badge: '90 Days Free Support Included',
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
                desc: 'Simple developer brand signature',
                icon: 'fa-bookmark',
                defaultData: {
                    companyName: 'Your Company Name',
                    year: '2026',
                    tagline: 'Crafted with <i class="fa fa-heart" style="color: #ef4444;"></i> for the Odoo Global Community',
                    bgColor: '#1e293b',
                    textColor: '#94a3b8'
                }
            }
        ]
    }
];
