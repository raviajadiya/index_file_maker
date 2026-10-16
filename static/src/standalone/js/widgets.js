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
                    title: 'Lightweight Automation Utility',
                    subtitle: 'Optimize operational workflows with minimal overhead.',
                    badge: 'ODOO 20 CERTIFIED',
                    bgColor: '#ffffff',
                    textColor: '#1e293b',
                    accentColor: '#2563eb'
                }
            },
            {
                type: 'discount_ribbon',
                name: 'Announcement Ribbon',
                desc: 'Top bar notification or discount banner',
                icon: 'fa-bullhorn',
                defaultData: {
                    text: '🎉 NEW: Full Odoo 20 compatibility and performance boost released!',
                    btnText: 'View Details',
                    btnUrl: '#',
                    bgColor: '#f59e0b',
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
                        { title: '100% Automated', desc: 'Zero manual calculation errors with real-time formula triggers.', icon: '<i class="oi" data-icon="task_alt"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Multi-Company Ready', desc: 'Seamless support for multiple companies, currencies, and branches.', icon: '<i class="oi" data-icon="business"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Role-Based Security', desc: 'Dedicated portal for sales reps and granular manager approvals.', icon: '<i class="oi" data-icon="lock"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Plug & Play Setup', desc: 'Configure commission rules and start operating in under 5 minutes.', icon: '<i class="oi" data-icon="schedule"></i>', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                    ]
                }
            },
            {
                type: 'stats_counter',
                name: 'Stats Banner',
                desc: '3 impressive key metric counters',
                icon: 'fa-tachometer',
                defaultData: {
                    title: '',
                    titleColor: '#1e293b',
                    subtitle: '',
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
                        { number: '99.9%', label: 'Calculation Accuracy', icon: '<i class="oi" data-icon="task_alt"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' },
                        { number: '10,000+', label: 'Active Users', icon: '<i class="oi" data-icon="group"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' },
                        { number: '5.0 ★', label: 'Customer Rating', icon: '<i class="oi" data-icon="favorite"></i>', iconUrl: '', numberColor: '#714B67', labelColor: '#64748b' }
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
                    badgeNumber: '03',
                    badgeText: 'Conversation',
                    title: 'Real-Time Direct Conversation',
                    desc: 'Enjoy smooth, real-time messaging with instant message delivery, attachment previews, and one-tap voice/video calling buttons.',
                    layoutPosition: 'image_left',
                    imageCount: '2',
                    image1Url: '',
                    image2Url: '',
                    image1Caption: '',
                    image2Caption: '',
                    points: [
                        'Instant text messaging and message history loading',
                        'Media, image, and document attachment support',
                        'Direct header buttons for audio and video calls'
                    ],
                    bgColor: '#ffffff',
                    accentColor: '#007bff',
                    badgeBgColor: '#007bff',
                    badgeTextColor: '#ffffff',
                    badgeBorderColor: '#007bff',
                    badgePreset: 'blue',
                    titleColor: '#1e293b',
                    descColor: '#64748b',
                    pointBgColor: '#f0f7ff',
                    pointBorderColor: '#d0e4ff',
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
                    badgeNumber: '01',
                    badgeText: 'Dashboard',
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
                    accentColor: '#007bff',
                    badgeBgColor: '#007bff',
                    badgeTextColor: '#ffffff',
                    badgeBorderColor: '#007bff',
                    badgePreset: 'blue',
                    titleColor: '#1e293b',
                    descColor: '#64748b',
                    pointBgColor: '#f0f7ff',
                    pointBorderColor: '#d0e4ff',
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
                    subtitle: 'Quick and hassle-free onboarding for your team',
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
                        { num: '1', title: 'Install & Activate', desc: 'Download from Odoo Apps list and activate in one click.' },
                        { num: '2', title: 'Configure Preferences', desc: 'Set up your company rules and rates with intuitive options.' },
                        { num: '3', title: 'Enjoy Automation', desc: 'Watch your calculations run smoothly with automatic triggers.' }
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
                    bgColor: '#f8fafc',
                    cardBgColor: '#ffffff',
                    cardBorderColor: '#e2e8f0',
                    headerBgColor: '#f8fafc',
                    headerTextColor: '#334155',
                    titleColor: '#1e293b',
                    subtitleColor: '#64748b',
                    accentColor: '#007bff',
                    col1Title: 'Key Capabilities & Features',
                    col2Title: 'Our Module',
                    col2Badge: 'Recommended',
                    col3Title: 'Standard Odoo',
                    rows: [
                        { feature: 'Multi-Level Approval Rules', detail: 'Dynamic tiers by department, manager, and custom amounts', ourApp: true, competitor: false },
                        { feature: 'Automated Real-Time Notifications', detail: 'Instant alerts via WhatsApp, SMS, and formatted email', ourApp: true, competitor: false },
                        { feature: 'Interactive Analytics & KPIs', detail: 'Live graphical drill-down metrics and forecasting cards', ourApp: true, competitor: 'Basic Only' },
                        { feature: 'Bulk Processing Engine', detail: 'Process hundreds of invoices and records in one click', ourApp: true, competitor: false },
                        { feature: 'Custom PDF & Excel Designer', detail: 'Branded export templates with company logos and styles', ourApp: true, competitor: false },
                        { feature: 'Dedicated Free Support & Upgrades', detail: 'Fast direct assistance via email, WhatsApp, and Skype', ourApp: '90 Days Free', competitor: 'Paid / None' }
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
                    subtitle: 'Got questions? We have answers.',
                    bgColor: '#f8fafc',
                    faqs: [
                        {
                            q: 'Is this module compatible with Odoo 20 and previous versions?',
                            a: 'Yes! It is fully certified for Odoo 20, 19, 18, and 17 for both Community and Enterprise editions.'
                        },
                        {
                            q: 'Does this require any external Python libraries?',
                            a: 'No external libraries are required. It installs cleanly using standard Odoo dependencies.'
                        },
                        {
                            q: 'Can we customize the commission logic for our business?',
                            a: 'Yes, the codebase is cleanly documented and structured with extensible methods to plug in custom calculation logic.'
                        },
                        {
                            q: 'Do you offer installation support?',
                            a: 'Yes, we provide 90 days of free technical support and bug fixes for every purchase.'
                        }
                    ]
                }
            },
            {
                type: 'testimonial_card',
                name: 'Customer Testimonial',
                desc: 'Customer quote with 5-star rating',
                icon: 'fa-quote-left',
                defaultData: {
                    quote: 'This module transformed our sales compensation process. What used to take 3 days of spreadsheet reconciliation now happens automatically in seconds!',
                    author: 'David Harrison',
                    role: 'VP of Sales Operations',
                    company: 'Apex Global Logistics',
                    bgColor: '#ffffff'
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
                    title: 'Other Apps',
                    subtitle: 'Explore our other popular and top-rated modules for Odoo',
                    bgColor: '#ffffff',
                    titleColor: '#1e293b',
                    columns: '3',
                    apps: [
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Clipboard History Manager',
                            company: 'Envision Technolabs',
                            price: '$ 23.99',
                            appUrl: 'https://apps.odoo.com/apps/modules/19.0/clipboard_history_manager'
                        },
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Clipboard History Manager',
                            company: 'Envision Technolabs',
                            price: '$ 23.99',
                            appUrl: 'https://apps.odoo.com/apps/modules/19.0/clipboard_history_manager'
                        },
                        {
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/19.0/clipboard_history_manager/banner.png',
                            title: 'Clipboard History Manager',
                            company: 'Envision Technolabs',
                            price: '$ 23.99',
                            appUrl: 'https://apps.odoo.com/apps/modules/19.0/clipboard_history_manager'
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
                desc: 'Dedicated support contacts, WhatsApp, Skype, and warranty badge',
                icon: 'fa-life-ring',
                defaultData: {
                    title: 'Dedicated Support & Tailored Customization',
                    subtitle: 'Have a question or need custom modifications? Our experienced Odoo team is here to assist you.',
                    badge: '90 Days Free Support Included',
                    email: 'support@yourdomain.com',
                    skype: 'live:odoo_support',
                    whatsapp: '+1 (555) 019-2834',
                    docsUrl: '#',
                    bgColor: '#714B67',
                    textColor: '#ffffff'
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
                    tagline: 'Crafted with ❤️ for the Odoo Global Community',
                    bgColor: '#1e293b',
                    textColor: '#94a3b8'
                }
            }
        ]
    }
];
