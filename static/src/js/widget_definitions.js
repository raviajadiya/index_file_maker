/** @odoo-module **/

export const PALETTES = [
    { id: 'odoo-purple', name: 'Odoo Purple', primary: '#714B67', secondary: '#00A09D', bg: '#f8fafc', text: '#1e293b' },
    { id: 'ocean-blue', name: 'Ocean Blue', primary: '#2563eb', secondary: '#38bdf8', bg: '#f8fafc', text: '#0f172a' },
    { id: 'emerald', name: 'Emerald Green', primary: '#059669', secondary: '#10b981', bg: '#f8fafc', text: '#064e3b' },
    { id: 'sunset', name: 'Sunset Amber', primary: '#d97706', secondary: '#f59e0b', bg: '#fffbeb', text: '#78350f' },
    { id: 'dark-slate', name: 'Modern Dark', primary: '#6366f1', secondary: '#a855f7', bg: '#0f172a', text: '#f8fafc' },
];

export const STARTER_WIDGETS = [
    {
        id: 'widget-hero-1',
        type: 'hero_banner',
        data: {
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
        id: 'widget-highlights-1',
        type: 'highlights_grid',
        data: {
            title: 'Why Choose This Module?',
            subtitle: 'Engineered for high performance, accuracy, and enterprise scalability',
            bgColor: '#ffffff',
            accentColor: '#714B67',
            cardBgColor: '#ffffff',
            items: [
                { title: '100% Automated', desc: 'Zero manual calculation errors with real-time formula triggers.', icon: '<i class="oi" data-icon="task_alt"></i>' },
                { title: 'Multi-Company Ready', desc: 'Seamless support for multiple companies, currencies, and branches.', icon: '<i class="oi" data-icon="business"></i>' },
                { title: 'Role-Based Security', desc: 'Dedicated portal for sales reps and granular manager approvals.', icon: '<i class="oi" data-icon="lock"></i>' },
                { title: 'Plug & Play Setup', desc: 'Configure commission rules and start operating in under 5 minutes.', icon: '<i class="oi" data-icon="schedule"></i>' },
            ]
        }
    },
    {
        id: 'widget-split-1',
        type: 'feature_split_right',
        data: {
            badge: 'SMART RULE ENGINE',
            title: 'Flexible Multi-Tier Commission Structures',
            desc: 'Create highly adaptable commission schemes tailored to your exact business compensation models. Define commission rates based on turnover, gross margins, specific products, or timely invoice payments.',
            bulletItems: [
                'Tiered progressive commission rates based on target achievement',
                'Automatic commission calculations upon invoice validation or payment',
                'Manager approval workflows with audit logs and history',
                'Support for sales teams, individual agents, and external brokers'
            ],
            imageUrl: '',
            imageCaption: 'Intuitive Commission Rule Builder',
            bgColor: '#f8fafc',
            accentColor: '#714B67',
        }
    },
    {
        id: 'widget-cards-1',
        type: 'feature_cards_3',
        data: {
            title: 'Packed with Enterprise Features',
            subtitle: 'Everything your finance and sales teams need in a single unified system',
            bgColor: '#ffffff',
            cards: [
                {
                    title: 'Automated Ledger & Statements',
                    desc: 'Generate real-time payout ledgers with detailed breakdowns per invoice and transaction.',
                    icon: 'fa-book',
                    badge: 'Accounting'
                },
                {
                    title: 'One-Click Vendor Bill / Payroll',
                    desc: 'Directly convert approved commissions into vendor bills or payroll additions seamlessly.',
                    icon: 'fa-credit-card',
                    badge: 'Payouts'
                },
                {
                    title: 'Visual Analytics & KPIs',
                    desc: 'Interactive graph and pivot reports to monitor sales compensation trends effortlessly.',
                    icon: 'fa-line-chart',
                    badge: 'Reporting'
                }
            ]
        }
    },
    {
        id: 'widget-screenshot-1',
        type: 'screenshot_showcase',
        data: {
            title: 'Clean & Native Odoo 20 Experience',
            subtitle: 'Designed to blend naturally with the modern Odoo backend interface',
            browserTitle: 'Odoo 20 - Commission Dashboard',
            imageUrl: '',
            calloutText: 'Fully responsive on Desktop, Tablet & Mobile',
            bgColor: '#f8fafc'
        }
    },
    {
        id: 'widget-matrix-1',
        type: 'edition_matrix',
        data: {
            title: 'Editions & Versions Compatibility',
            subtitle: 'Certified and tested across all supported Odoo environments',
            bgColor: '#ffffff',
            rows: [
                { feature: 'Core Commission Engine', community: true, enterprise: true, odoosh: true },
                { feature: 'Multi-Company & Branch Support', community: true, enterprise: true, odoosh: true },
                { feature: 'Customer Portal Statements', community: true, enterprise: true, odoosh: true },
                { feature: 'Automatic Vendor Bill Creation', community: true, enterprise: true, odoosh: true },
                { feature: 'Payroll Payslip Integration', community: false, enterprise: true, odoosh: true },
            ]
        }
    },
    {
        id: 'widget-faq-1',
        type: 'faq_section',
        data: {
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
        id: 'widget-support-1',
        type: 'support_banner',
        data: {
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
    }
];

export const WIDGET_CATALOG = [
    {
        category: 'Headers & Banners',
        widgets: [
            {
                type: 'hero_banner',
                name: 'Hero Banner Pro',
                desc: 'Header with title, badges, and CTA buttons',
                icon: 'fa-trophy',
                defaultData: {
                    title: 'My Custom Odoo 20 App',
                    subtitle: 'The ultimate all-in-one solution to supercharge your business operations.',
                    iconUrl: '',
                    showBadges: true,
                    badges: ['Community', 'Enterprise', 'Odoo 20', 'Odoo 19'],
                    badgeBgColor: '#ffffff',
                    badgeTextColor: '#714B67',
                    badgeBorderColor: '#e2e8f0',
                    primaryBtnText: 'Get Started',
                    primaryBtnUrl: '#',
                    secondaryBtnText: 'Live Demo',
                    secondaryBtnUrl: '#',
                    bgColor: '#714B67',
                    textColor: '#ffffff',
                    accentColor: '#00A09D',
                }
            },
            {
                type: 'minimal_header',
                name: 'Minimal Header',
                desc: 'Clean, modern header for utility modules',
                icon: 'fa-header',
                defaultData: {
                    title: 'Lightweight Utility Extension',
                    subtitle: 'Enhance your Odoo workflow with zero overhead.',
                    badge: 'VERSION 20.0 READY',
                    bgColor: '#ffffff',
                    accentColor: '#2563eb'
                }
            },
            {
                type: 'discount_ribbon',
                name: 'Special Ribbon',
                desc: 'Eye-catching announcement or discount bar',
                icon: 'fa-bullhorn',
                defaultData: {
                    text: '🎉 NEW RELEASE: Fully compatible with Odoo 20 with 3x faster speed!',
                    btnText: 'Learn More',
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
                desc: '4 metric or highlight cards with gradient accents',
                icon: 'fa-th-large',
                defaultData: {
                    title: 'Core Highlights',
                    subtitle: 'Why thousands of users love this module',
                    bgColor: '#ffffff',
                    accentColor: '#714B67',
                    cardBgColor: '#ffffff',
                    items: [
                        { title: 'Lightning Fast', desc: 'Optimized for high-volume transactions.', icon: '<i class="oi" data-icon="task_alt"></i>' },
                        { title: 'Multi-Company', desc: 'Full support for multiple branches and currencies.', icon: '<i class="oi" data-icon="business"></i>' },
                        { title: 'Enterprise Security', desc: 'Granular access controls and audit trails.', icon: '<i class="oi" data-icon="lock"></i>' },
                        { title: 'Instant Setup', desc: 'No complex configurations needed.', icon: '<i class="oi" data-icon="schedule"></i>' }
                    ]
                }
            },
            {
                type: 'stats_counter',
                name: 'Stats Banner',
                desc: '3 impressive numerical counter metrics',
                icon: 'fa-tachometer',
                defaultData: {
                    bgColor: '#f8fafc',
                    stats: [
                        { number: '99.9%', label: 'Accuracy Rate', icon: 'fa-check-circle' },
                        { number: '10,000+', label: 'Active Users', icon: 'fa-users' },
                        { number: '5.0 ★', label: 'Customer Rating', icon: 'fa-star' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Features & Benefits',
        widgets: [
            {
                type: 'feature_split_right',
                name: 'Showcase (Text Left, Image Right)',
                desc: 'Detailed feature description with checkmarks and mockup',
                icon: 'fa-columns',
                defaultData: {
                    badge: 'ADVANCED CAPABILITY',
                    title: 'Powerful Automated Operations',
                    desc: 'Eliminate tedious manual repetitive tasks and gain complete visibility into every stage of your workflow.',
                    bulletItems: [
                        'Automatic calculation triggers on order confirmation',
                        'Real-time validation against business rules',
                        'Instant error notifications and suggested fixes',
                        'Export summaries to PDF and Excel'
                    ],
                    imageUrl: '',
                    imageCaption: 'Feature Workflow Screenshot',
                    bgColor: '#f8fafc',
                    accentColor: '#714B67'
                }
            },
            {
                type: 'feature_split_left',
                name: 'Showcase (Image Left, Text Right)',
                desc: 'Alternating feature row with mockup on the left',
                icon: 'fa-align-left',
                defaultData: {
                    badge: 'REAL-TIME ANALYTICS',
                    title: 'Dynamic Reporting & Dashboards',
                    desc: 'Track operational metrics, identify bottlenecks, and make data-driven decisions with built-in executive charts.',
                    bulletItems: [
                        'Visual KPI cards with monthly comparison',
                        'Pivot and Graph views with custom group-by filters',
                        'Automated scheduled report distribution via email'
                    ],
                    imageUrl: '',
                    imageCaption: 'Dashboard & Reports View',
                    bgColor: '#ffffff',
                    accentColor: '#00A09D'
                }
            },
            {
                type: 'feature_cards_3',
                name: '3-Column Feature Cards',
                desc: '3 modern cards with hover effect and badges',
                icon: 'fa-id-card-o',
                defaultData: {
                    title: 'Designed for Every Department',
                    subtitle: 'A unified solution that empowers your entire organization',
                    bgColor: '#ffffff',
                    cards: [
                        { title: 'For Administrators', desc: 'Configure system rules with intuitive menus and zero coding.', icon: 'fa-user-secret', badge: 'Admin' },
                        { title: 'For Managers', desc: 'Review, approve, and monitor team activities in real-time.', icon: 'fa-briefcase', badge: 'Management' },
                        { title: 'For End Users', desc: 'Clean, clutter-free screens that boost daily productivity.', icon: 'fa-user', badge: 'User' }
                    ]
                }
            },
            {
                type: 'workflow_steps',
                name: '3-Step How It Works',
                desc: 'Numbered step-by-step implementation guide',
                icon: 'fa-list-ol',
                defaultData: {
                    title: 'How It Works in 3 Simple Steps',
                    subtitle: 'Quick and hassle-free onboarding',
                    bgColor: '#f8fafc',
                    steps: [
                        { num: '1', title: 'Install Module', desc: 'Download and activate the app from your Odoo Apps list in one click.' },
                        { num: '2', title: 'Configure Preferences', desc: 'Set up your company rules and access rights with intuitive options.' },
                        { num: '3', title: 'Enjoy Automation', desc: 'Watch your processes run smoothly with automatic triggers and logs.' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Media & Screenshots',
        widgets: [
            {
                type: 'screenshot_showcase',
                name: 'Browser Mockup Showcase',
                desc: 'Full-width screenshot inside browser frame',
                icon: 'fa-desktop',
                defaultData: {
                    title: 'Intuitive & Modern User Interface',
                    subtitle: 'Crafted to blend seamlessly with the modern Odoo 20 user experience',
                    browserTitle: 'Odoo 20 - Module Workspace',
                    imageUrl: '',
                    calloutText: 'Clean layouts, responsive controls, and high-DPI icons',
                    bgColor: '#ffffff'
                }
            },
            {
                type: 'screenshot_duo',
                name: '2-Column Screenshot Grid',
                desc: 'Dual screenshot comparison cards',
                icon: 'fa-picture-o',
                defaultData: {
                    title: 'Screenshots & Workflows',
                    bgColor: '#f8fafc',
                    col1Title: 'Configuration Settings',
                    col1Desc: 'Easily customize company-wide preferences.',
                    col1Img: '',
                    col2Title: 'Operational Overview',
                    col2Desc: 'Track live transactions and statuses.',
                    col2Img: ''
                }
            }
        ]
    },
    {
        category: 'Comparison & Tables',
        widgets: [
            {
                type: 'edition_matrix',
                name: 'Editions Compatibility Matrix',
                desc: 'Community vs Enterprise comparison table',
                icon: 'fa-table',
                defaultData: {
                    title: 'Edition & Environment Compatibility',
                    subtitle: 'Compatible with both Community and Enterprise versions',
                    bgColor: '#ffffff',
                    rows: [
                        { feature: 'Core Automation Logic', community: true, enterprise: true, odoosh: true },
                        { feature: 'Multi-Company Support', community: true, enterprise: true, odoosh: true },
                        { feature: 'Customizable Settings Menu', community: true, enterprise: true, odoosh: true },
                        { feature: 'Excel & PDF Export Reports', community: true, enterprise: true, odoosh: true },
                        { feature: 'Odoo.sh Cloud Certified', community: true, enterprise: true, odoosh: true }
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
                    subtitle: 'Find quick answers to common questions about this module',
                    bgColor: '#f8fafc',
                    faqs: [
                        { q: 'Is this module compatible with Odoo 20?', a: 'Yes! It is fully certified for Odoo 20, 19, 18, and 17.' },
                        { q: 'Can I install this on Odoo.sh?', a: 'Yes, it works seamlessly on Odoo.sh, On-Premise, and custom Cloud servers.' },
                        { q: 'Do you provide free updates?', a: 'Yes, you receive free bug fixes and minor updates for the purchased version.' }
                    ]
                }
            },
            {
                type: 'testimonial_card',
                name: 'Customer Testimonial',
                desc: 'Customer quote with 5-star rating',
                icon: 'fa-quote-left',
                defaultData: {
                    quote: 'This module saved our team hundreds of hours every month. Clean code, zero bugs, and outstanding support!',
                    author: 'David Harrison',
                    role: 'Chief Technology Officer',
                    company: 'Apex Solutions',
                    bgColor: '#ffffff'
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
                    title: 'Need Help or Custom Features?',
                    subtitle: 'Our dedicated team of certified Odoo developers is ready to help you succeed.',
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
                            bannerUrl: 'https://apps.odoocdn.com/apps/assets/16.0/evo_call_recording_transcript/banner.png',
                            title: 'AI Call Recording & Auto Transcript for CRM',
                            company: 'Evozard',
                            price: '$ 139',
                            appUrl: 'https://apps.odoo.com/apps/modules'
                        },
                        {
                            bannerUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                            title: 'Round Robin Lead Assignment',
                            company: 'Evozard',
                            price: '$ 45',
                            appUrl: 'https://apps.odoo.com/apps/modules'
                        },
                        {
                            bannerUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
                            title: 'Portal User Project Management Access',
                            company: 'Evozard',
                            price: '$ 50',
                            appUrl: 'https://apps.odoo.com/apps/modules'
                        }
                    ]
                }
            }
        ]
    }
];
