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
                    badgeBgColor: '#f5efff',
                    badgeTextColor: '#ffffff',
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
                        { title: '100% Automated', desc: 'Zero manual calculation errors with real-time formula triggers.', icon: 'fa fa-bolt', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Multi-Company Ready', desc: 'Seamless support for multiple companies, currencies, and branches.', icon: 'fa fa-building', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Role-Based Security', desc: 'Dedicated portal for sales reps and granular manager approvals.', icon: 'fa fa-shield', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                        { title: 'Plug & Play Setup', desc: 'Configure commission rules and start operating in under 5 minutes.', icon: 'fa fa-cogs', iconUrl: '', titleColor: '#1e293b', descColor: '#64748b' },
                    ]
                }
            },
            {
                type: 'stats_counter',
                name: 'Stats Banner',
                desc: '3 impressive key metric counters',
                icon: 'fa-tachometer',
                defaultData: {
                    bgColor: '#f8fafc',
                    stats: [
                        { number: '99.9%', label: 'Calculation Accuracy', icon: 'fa-check-circle' },
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
                type: 'feature_split_left',
                name: 'Showcase (Image Left, Text Right)',
                desc: 'Alternating feature row with mockup on the left',
                icon: 'fa-align-left',
                defaultData: {
                    badge: 'REAL-TIME ANALYTICS',
                    title: 'Executive Dashboards & Payout Statements',
                    desc: 'Empower your sales reps with a transparent portal to track earnings in real-time, while giving managers deep analytics into compensation expenditures.',
                    bulletItems: [
                        'Interactive graphs with month-over-month comparisons',
                        'Detailed payout ledger with invoice-level transparency',
                        'Automatic scheduled email reports for management'
                    ],
                    imageUrl: '',
                    imageCaption: 'Dashboard & Reports View',
                    bgColor: '#ffffff',
                    accentColor: '#00A09D',
                }
            },
            {
                type: 'feature_cards_3',
                name: '3-Column Feature Cards',
                desc: '3 modern cards with hover effects and icons',
                icon: 'fa-id-card-o',
                defaultData: {
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
                type: 'workflow_steps',
                name: '3-Step How It Works',
                desc: 'Numbered step-by-step onboarding cards',
                icon: 'fa-list-ol',
                defaultData: {
                    title: 'How It Works in 3 Simple Steps',
                    subtitle: 'Quick and hassle-free onboarding for your team',
                    bgColor: '#f8fafc',
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
        category: 'Media & Screenshots',
        widgets: [
            {
                type: 'screenshot_showcase',
                name: 'Browser Mockup Showcase',
                desc: 'Full-width screenshot container with browser header',
                icon: 'fa-desktop',
                defaultData: {
                    title: 'Clean & Native Odoo 20 Experience',
                    subtitle: 'Designed to blend naturally with the modern Odoo backend interface',
                    browserTitle: 'Odoo 20 - Commission Dashboard',
                    imageUrl: '',
                    calloutText: 'Fully responsive on Desktop, Tablet & Mobile',
                    bgColor: '#f8fafc'
                }
            },
            {
                type: 'screenshot_duo',
                name: '2-Column Screenshot Grid',
                desc: 'Dual screenshot comparison cards',
                icon: 'fa-picture-o',
                defaultData: {
                    title: 'Screenshots & User Experience',
                    bgColor: '#ffffff',
                    col1Title: 'Commission Rules Configuration',
                    col1Desc: 'Easily set up complex equations and tiered margins.',
                    col1Img: '',
                    col2Title: 'Salesman Commission Statement',
                    col2Desc: 'Transparent payout ledger accessible anytime.',
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
