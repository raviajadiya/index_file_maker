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
        id: 'widget-vstable-1',
        type: 'vs_table',
        data: {
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
    },
    {
        id: 'widget-faq-1',
        type: 'faq_section',
        data: {
            title: 'Frequent Questions',
            subtitle: 'Got questions? We have answers.',
            bgColor: '#ffffff',
            headerBg: '#eff6ff',
            questionColor: '#2563eb',
            borderColor: '#dbeafe',
            faqs: [
                {
                    q: 'Can users manage opportunities from the mobile app?',
                    a: 'Yes, users can create, update, and track opportunities directly from the mobile application with real-time status updates.',
                    isOpen: true
                },
                {
                    q: 'Need customization? Who to contact?',
                    a: 'You can contact our dedicated technical support team directly via email or Skype. We provide custom development and modification services tailored to your specific workflow.',
                    isOpen: false
                },
                {
                    q: 'Can users view invoices and customer information from the mobile app?',
                    a: 'Yes, all invoices, payment records, and customer details are accessible securely from the mobile interface with role-based permissions.',
                    isOpen: false
                },
                {
                    q: 'Is this module compatible with Odoo Community and Enterprise?',
                    a: 'Yes! It is fully certified and tested on Odoo 20, 19, 18, and 17 for both Community and Enterprise editions with 100% feature parity.',
                    isOpen: false
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
                    title: 'Frequent Questions',
                    subtitle: 'Got questions? We have answers.',
                    bgColor: '#ffffff',
                    headerBg: '#eff6ff',
                    questionColor: '#2563eb',
                    borderColor: '#dbeafe',
                    faqs: [
                        {
                            q: 'Can users manage opportunities from the mobile app?',
                            a: 'Yes, users can create, update, and track opportunities directly from the mobile application with real-time status updates.',
                            isOpen: true
                        },
                        {
                            q: 'Need customization? Who to contact?',
                            a: 'You can contact our dedicated technical support team directly via email or Skype. We provide custom development and modification services tailored to your specific workflow.',
                            isOpen: false
                        },
                        {
                            q: 'Can users view invoices and customer information from the mobile app?',
                            a: 'Yes, all invoices, payment records, and customer details are accessible securely from the mobile interface with role-based permissions.',
                            isOpen: false
                        },
                        {
                            q: 'Is this module compatible with Odoo Community and Enterprise?',
                            a: 'Yes! It is fully certified and tested on Odoo 20, 19, 18, and 17 for both Community and Enterprise editions with 100% feature parity.',
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
    }
];
