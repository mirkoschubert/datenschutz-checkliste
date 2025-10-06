// Data structure for GDPR compliance checklist
// Based on the original German checklist but structured for interactive use

const gdprData = {
    en: {
        title: "GDPR Compliance Assessment",
        subtitle: "Interactive checklist to evaluate your website's GDPR compliance",
        categories: [
            {
                id: "security",
                title: "Security",
                icon: "fas fa-shield-alt",
                description: "Technical and organizational measures to protect personal data",
                items: [
                    {
                        id: "ssl-website",
                        title: "SSL/TLS Transport Encryption for Website",
                        description: "Transport encryption should always be used when personal data is transmitted, especially for all form data.",
                        required: true,
                        weight: 10,
                        legalBasis: ["Art. 32 para. 1 lit. a GDPR", "§64 para. 2, para. 3 no. 8 BDSG"],
                        implementation: [
                            "Use 'Let's Encrypt' certificates (free) if web host allows with automatic renewal",
                            "For large companies with many subdomains: Use paid wildcard domain certificates",
                            "Check entire website for internal HTTP links to avoid 'mixed content' warnings",
                            "Set up 301 redirect from HTTP to HTTPS",
                            "Consider implementing HSTS (HTTP Strict Transport Security)"
                        ]
                    },
                    {
                        id: "ssl-email",
                        title: "SSL/TLS Transport Encryption for Email",
                        description: "Transport encryption should be used for email sending (including contact forms). Avoid business email via private third-party accounts.",
                        required: true,
                        weight: 8,
                        legalBasis: ["Art. 32 para. 1 lit. a GDPR", "Art. 6 para. 1 lit. b & f GDPR"],
                        implementation: [
                            "Don't use PHP mail() function for form sending",
                            "Ensure plugins provide SMTP encryption",
                            "Use honeypot method for SPAM protection (reCaptcha not GDPR compliant)",
                            "Consider hosting email accounts on own server"
                        ]
                    },
                    {
                        id: "cms-security",
                        title: "CMS Security Concept",
                        description: "Protection against brute-force attacks, comment spam, and security vulnerabilities in CMS, plugins, and themes.",
                        required: true,
                        weight: 7,
                        legalBasis: ["Art. 32 GDPR"],
                        implementation: [
                            "Use simple brute-force protection limiting incorrect login attempts",
                            "Use honeypot method for comment SPAM protection",
                            "Avoid all-in-one security plugins (security vulnerabilities)",
                            "Keep CMS, plugins, modules, and themes always updated",
                            "Install as few plugins/themes as possible"
                        ]
                    },
                    {
                        id: "server-security",
                        title: "Server Security Concept",
                        description: "Server security responsibilities vary by hosting type (shared, VPS, dedicated).",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 28 para. 3 lit. c GDPR", "Art. 29 GDPR", "Art. 32 GDPR"],
                        implementation: [
                            "For shared hosting: Responsibility lies with web host (request information/read DPA)",
                            "For VPS/dedicated servers: Shared responsibility with host (request information)"
                        ]
                    },
                    {
                        id: "email-encryption",
                        title: "Email Signature and Content Encryption (Optional)",
                        description: "Electronic signatures and content encryption enhance email security and legal compliance.",
                        required: false,
                        weight: 3,
                        legalBasis: ["Art. 32 GDPR", "eIDAS/EU 910/2014"],
                        implementation: [
                            "Choose between S/MIME (email certificate) or PGP/GPG (key pair)",
                            "Prefer PGP/GPG over S/MIME",
                            "Free S/MIME certificates available from Comodo (1 year)",
                            "Free GPG available at gnupg.org",
                            "Signature needs sender setup only, encryption needs both sender and recipient"
                        ]
                    }
                ]
            },
            {
                id: "hosting",
                title: "Web Hosting",
                icon: "fas fa-server",
                description: "Data processing agreements and log management with web hosting providers",
                items: [
                    {
                        id: "access-logs",
                        title: "Access Logs Management",
                        description: "Personal data in server access logs (especially IP addresses) should be pseudonymized and storage duration limited.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 28 GDPR", "Art. 29 GDPR", "Art. 32 para. 1 lit. a GDPR"],
                        implementation: [
                            "Enable IP address pseudonymization (shorten last byte, e.g., 192.168.10.X)",
                            "Reduce storage duration to 7-14 days if possible",
                            "Consider completely disabling IP storage if host allows"
                        ]
                    },
                    {
                        id: "server-logs",
                        title: "Other Server Logs",
                        description: "Web hosts are required to maintain additional server logs for security monitoring, which also store IP addresses.",
                        required: true,
                        weight: 4,
                        legalBasis: ["Art. 28 GDPR", "Art. 29 GDPR", "Art. 6 para. 1 lit. c GDPR"],
                        implementation: [
                            "Request information about storage and retention periods from host",
                            "Check Data Processing Agreement (DPA) for log handling details"
                        ]
                    },
                    {
                        id: "dpa-hosting",
                        title: "Data Processing Agreement with Web Host",
                        description: "All personal data stored on servers constitutes 'processing' and requires a DPA with the web host.",
                        required: true,
                        weight: 9,
                        legalBasis: ["Art. 28 GDPR"],
                        implementation: [
                            "Conclude Data Processing Agreement (DPA) with web host",
                            "Ensure DPA covers all data processing activities",
                            "Review DPA terms regularly for compliance updates"
                        ]
                    }
                ]
            },
            {
                id: "external-services",
                title: "External Services",
                icon: "fas fa-plug",
                description: "Third-party services and tools that may process personal data",
                items: [
                    {
                        id: "analytics-tools",
                        title: "Analytics Tools (Google Analytics, Matomo, etc.)",
                        description: "Analytics tools storing personal data in the USA are not GDPR compliant since the Schrems II ruling (2020).",
                        required: true,
                        weight: 8,
                        legalBasis: ["Art. 7 GDPR", "Art. 28 GDPR", "Art. 44 ff. GDPR"],
                        implementation: [
                            "Avoid Google Analytics and Jetpack (US data storage)",
                            "Use GDPR-compliant alternatives like Fathom or Plausible",
                            "If using analytics, implement cookie banner with opt-out",
                            "For Google Analytics: Complete DPA, set minimum retention (14 months), disable targeting, pseudonymize IPs",
                            "Delete legacy data exceeding maximum processing time"
                        ]
                    },
                    {
                        id: "social-plugins",
                        title: "Social Media Plugins",
                        description: "Social plugins from Facebook, Instagram, Twitter load personal data on page visit and are not GDPR compliant since 2020.",
                        required: true,
                        weight: 7,
                        legalBasis: ["Art. 7 GDPR", "Art. 22 GDPR", "Art. 44 ff. GDPR"],
                        implementation: [
                            "Disable Facebook, Instagram, Twitter plugins (US data storage)",
                            "Implement 2-click solution before loading social plugins",
                            "Disable Facebook Connect and Jetpack comment functions",
                            "Use text/graphic links instead of embedded widgets",
                            "Remove tracking pixels/beacons"
                        ]
                    },
                    {
                        id: "web-fonts",
                        title: "Web Fonts (Google Fonts, Adobe Typekit, etc.)",
                        description: "Web fonts require consent and should be localized to avoid data transfer to third parties.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 44 ff. GDPR", "Art. 6 para. 1 lit. a GDPR"],
                        implementation: [
                            "Consent required for all web font usage",
                            "Localize Google Fonts using Google Webfonts Helper",
                            "Consider CSS Font Stack alternatives",
                            "Host font files locally in (child) theme",
                            "Disable external font loading in optimization plugins"
                        ]
                    },
                    {
                        id: "cdn-services",
                        title: "Content Delivery Networks (CDN)",
                        description: "CDNs distribute content globally and may store IP addresses, potentially violating GDPR since 2020.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 44 ff. GDPR", "Art. 6 para. 1 lit. a & f GDPR"],
                        implementation: [
                            "Evaluate necessity of CDNs (consider D-A-CH only audience)",
                            "Localize CDN content (fonts, CSS, JS files)",
                            "Check for WordPress-native alternatives (e.g., jQuery)",
                            "Review third-party plugins for CDN usage",
                            "Balance necessity vs. risk for special cases"
                        ]
                    },
                    {
                        id: "video-music-services",
                        title: "Video and Music Services",
                        description: "Embedded videos and music from YouTube, Vimeo, Spotify, SoundCloud transfer personal data and require 2-click solutions.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 22 GDPR", "Art. 44 ff. GDPR"],
                        implementation: [
                            "Avoid direct embedding of YouTube, Vimeo, Spotify, SoundCloud",
                            "Use YouTube's Enhanced Privacy Mode (still requires 2-click solution)",
                            "Implement 2-click solution for all video/music services",
                            "Alternative: Embed video previews as images with links to platforms"
                        ]
                    },
                    {
                        id: "map-services",
                        title: "Map Services",
                        description: "Map services like Google Maps collect personal data on page load and mostly store data in the USA.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 44 ff. GDPR", "Art. 6 para. 1 lit. f GDPR"],
                        implementation: [
                            "Implement 2-click solution for all map services",
                            "Alternative: Embed map screenshots as images with links",
                            "Include copyright attribution for map images",
                            "Avoid Google Maps screenshots for copyright reasons"
                        ]
                    }
                ]
            },
            {
                id: "content-features",
                title: "Content & Features",
                icon: "fas fa-edit",
                description: "Website features that may collect or process personal data",
                items: [
                    {
                        id: "comments",
                        title: "Comment Functionality",
                        description: "Comment systems should limit IP address storage and inform users about data collection.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 32 para. 1 lit. a GDPR", "Art. 6 para. 1 lit. b or f GDPR"],
                        implementation: [
                            "Limit IP address storage to minimum time (until approval)",
                            "Inform users before comment submission about data storage",
                            "Disable cookie saving for name/email (WordPress: Settings > Discussion)",
                            "Use honeypot method for comment SPAM protection"
                        ]
                    },
                    {
                        id: "contact-forms",
                        title: "Contact Forms",
                        description: "Contact forms must use secure transmission and inform users about data processing.",
                        required: true,
                        weight: 7,
                        legalBasis: ["Art. 32 GDPR", "Art. 13 GDPR"],
                        implementation: [
                            "Use HTTPS for all form submissions",
                            "Include privacy notice before form submission",
                            "Use SMTP with SSL/TLS encryption",
                            "Avoid PHP mail() function",
                            "Implement proper form validation and SPAM protection"
                        ]
                    },
                    {
                        id: "cookies-tracking",
                        title: "Cookies & Tracking",
                        description: "All non-essential cookies require user consent. Cookie banners must provide equal accept/decline options.",
                        required: true,
                        weight: 9,
                        legalBasis: ["§20, 25, 26 TTDSG", "Art. 7 GDPR"],
                        implementation: [
                            "Obtain consent for all non-essential cookies",
                            "Provide equal 'Accept' and 'Decline' buttons",
                            "Don't store cookies before consent (except technically necessary)",
                            "Inform users about cookie purposes, providers, and data transfer",
                            "Implement proper cookie management system"
                        ]
                    },
                    {
                        id: "external-links",
                        title: "External Links",
                        description: "External links should be marked with appropriate attributes and mentioned in privacy policy.",
                        required: false,
                        weight: 2,
                        legalBasis: ["Art. 13 GDPR"],
                        implementation: [
                            "Add rel='noreferrer noopener' to external links",
                            "Mention in privacy policy that external sites may collect data",
                            "Consider link disclosure for affiliate/sponsored links"
                        ]
                    }
                ]
            },
            {
                id: "legal-documents",
                title: "Legal Documents",
                icon: "fas fa-file-contract",
                description: "Required legal pages and compliance documentation",
                items: [
                    {
                        id: "privacy-policy",
                        title: "Privacy Policy",
                        description: "Comprehensive privacy policy accessible from every page, detailing all data processing activities.",
                        required: true,
                        weight: 10,
                        legalBasis: ["Art. 12 GDPR", "Art. 13 GDPR", "Art. 14 GDPR"],
                        implementation: [
                            "Make accessible from every page in max 1-2 clicks",
                            "Include detailed but understandable information",
                            "Support with GDPR and BDSG legal basis",
                            "Include scope of validity and update date",
                            "Consider dual privacy policies (short & detailed)",
                            "Use legal generator or consult lawyer"
                        ]
                    },
                    {
                        id: "imprint",
                        title: "Imprint (Legal Notice)",
                        description: "Required legal information including contact details and business information (German/EU law).",
                        required: true,
                        weight: 8,
                        legalBasis: ["§5 TMG", "§18 para. 2 MStV"],
                        implementation: [
                            "Accessible from every page via max 2 clicks",
                            "Include all mandatory information per §5 TMG",
                            "Add responsible person for editorial content if applicable",
                            "Include VAT ID or business ID (not tax number)",
                            "Make information accessible (not as image or coded)",
                            "Include dispute resolution link for online merchants"
                        ]
                    },
                    {
                        id: "social-media-compliance",
                        title: "Social Media Legal Compliance",
                        description: "Imprint and privacy policy must also be provided on social media profiles.",
                        required: true,
                        weight: 6,
                        legalBasis: ["§5 TMG", "Art. 13 GDPR"],
                        implementation: [
                            "Add imprint and privacy policy links to social media profiles",
                            "Mention third-party provider's privacy policy",
                            "Use short URLs (without tracking) if direct linking not possible",
                            "Mark automated content as such (§18 para. 3 MStV)"
                        ]
                    },
                    {
                        id: "copyright-credits",
                        title: "Copyright and Image Credits",
                        description: "Proper attribution for all external works (images, graphics, music, videos, texts, software).",
                        required: true,
                        weight: 7,
                        legalBasis: ["§§ 12, 13, 19a, 23, 31, 32, 39, 51, 57 UrhG"],
                        implementation: [
                            "Always read and follow license terms for external works",
                            "Place image credits directly under images",
                            "Use only properly licensed works for decorative purposes",
                            "Always attribute author name for safety",
                            "Don't remove metadata (EXIF, IPTC, watermarks) from foreign images",
                            "Check client-provided materials for copyright compliance"
                        ]
                    }
                ]
            }
        ]
    },
    de: {
        title: "DSGVO Compliance Bewertung",
        subtitle: "Interaktive Checkliste zur Bewertung der DSGVO-Konformität Ihrer Website",
        categories: [
            {
                id: "security",
                title: "Sicherheit",
                icon: "fas fa-shield-alt",
                description: "Technische und organisatorische Maßnahmen zum Schutz personenbezogener Daten",
                items: [
                    {
                        id: "ssl-website",
                        title: "SSL/TLS-Transportverschlüsselung Webseite",
                        description: "Transportverschlüsselung sollte immer dann verwendet werden, wenn personenbezogene Daten übertragen werden, insbesondere bei sämtlichen Formulardaten.",
                        required: true,
                        weight: 10,
                        legalBasis: ["Art. 32 Abs. 1 Lit. a DSGVO", "§64 Abs. 2, Abs. 3 Nr. 8 BDSG"],
                        implementation: [
                            "Sofern es der Webhoster (mit automatischer Verlängerung) zulässt, auf 'Let's Encrypt'-Zertifikate setzen (kostenlos)",
                            "Für große Firmen mit vielen Subdomains: Lieber kostenpflichtig auf Zertifikate für Wildcard-Domains setzen",
                            "Es sollte die gesamte Webseite auf interne HTTP-Links überprüft werden, damit nicht vor 'Mixed Content' gewarnt wird",
                            "301-Weiterleitung von HTTP auf HTTPS einrichten",
                            "Optional: HSTS (HTTP Strict Transport Security) einsetzen"
                        ]
                    },
                    {
                        id: "ssl-email",
                        title: "SSL/TLS-Transportverschlüsselung E-Mail",
                        description: "Auch beim Versand von E-Mails (auch über ein Kontaktformular) sollte Transportverschlüsselung eingesetzt werden. Geschäftlichen E-Mail-Verkehr über private Drittanbieter-Konten vermeiden.",
                        required: true,
                        weight: 8,
                        legalBasis: ["Art. 32 Abs. 1 Lit. a DSGVO", "Art. 6 Abs. 1 Lit. b & f DSGVO"],
                        implementation: [
                            "Darauf achten, dass E-Mails beim Formular-Versand nicht mit der mail()-Funktion von PHP versendet werden",
                            "Darauf achten, dass ein Plugin die SMTP-Verschlüsselung überhaupt vorsieht",
                            "Für einen geeigneten SPAM-Schutz sorgen (vorzugsweise Honeypot-Methode, reCaptchas sind nicht DSGVO-konform)",
                            "Ggf. E-Mail-Konto auf eigenen Hoster legen"
                        ]
                    },
                    {
                        id: "cms-security",
                        title: "Sicherheitskonzept des CMS (z.B. WordPress)",
                        description: "Schutz vor Brute-Force-Attacken, Kommentar-SPAM und Sicherheitslücken in CMS, Plugins und Themes.",
                        required: true,
                        weight: 7,
                        legalBasis: ["Art. 32 DSGVO"],
                        implementation: [
                            "Einfacher Schutz, der die Anzahl der falschen Eingaben begrenzt (Brute-Force-Schutz)",
                            "Einfacher Schutz vor Kommentar-SPAM, vorzugsweise per Honeypot-Methode",
                            "Auf All-In-One Sicherheits-Plugins verzichten (Sicherheitslücken)",
                            "CMS-Installation, Plugins, Module und Themes (auch nicht aktivierte) immer aktuell halten",
                            "So wenig Plugins/Themes wie nur möglich installieren"
                        ]
                    },
                    {
                        id: "server-security",
                        title: "Sicherheitskonzept des Servers",
                        description: "Serververantwortung variiert je nach Hosting-Typ (Shared, VPS, Dedicated Server).",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 28 Abs. 3 Lit. c DSGVO", "Art. 29 DSGVO", "Art. 32 DSGVO"],
                        implementation: [
                            "Bei Shared Hosting oder Managed Servern: Verantwortung liegt beim Webhoster (Auskunft anfordern/AVV lesen)",
                            "Bei VPS und dedizierten Servern: Verantwortung liegt teilweise auch beim Inhaber (Auskunft anfordern)"
                        ]
                    },
                    {
                        id: "email-encryption",
                        title: "Signatur und/oder Inhaltsverschlüsselung bei E-Mails (Optional)",
                        description: "Elektronische Signaturen und Inhaltsverschlüsselung fördern die E-Mail-Sicherheit und rechtliche Nachweisbarkeit.",
                        required: false,
                        weight: 3,
                        legalBasis: ["Art. 32 DSGVO", "eIDAS/EU 910/2014", "§2 Nr. 2 SigG"],
                        implementation: [
                            "Wahl zwischen S/MIME (E-Mail-Zertifikat) oder PGP/GPG (Schlüsselpaar)",
                            "PGP/GPG ist immer den Vorzug zu geben",
                            "Kostenlose S/MIME-Zertifikate bei Comodo (1 Jahr)",
                            "Kostenloses GPG auf gnupg.org verfügbar",
                            "Signatur braucht nur Absender-Einrichtung, Verschlüsselung sowohl Absender als auch Empfänger"
                        ]
                    }
                ]
            },
            {
                id: "hosting",
                title: "Webhoster",
                icon: "fas fa-server",
                description: "Auftragsverarbeitungsverträge und Log-Management mit Webhostern",
                items: [
                    {
                        id: "access-logs",
                        title: "Access Logs",
                        description: "Personenbezogene Daten in Server Access Logs (insbes. IP-Adressen) sollten pseudonymisiert und Speicherdauer begrenzt werden.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 28 DSGVO", "Art. 29 DSGVO", "Art. 32 Abs. 1 Lit. a DSGVO"],
                        implementation: [
                            "IP-Adress-Pseudonymisierung aktivieren (Kürzung des letzten Bytes, z.B. 192.168.10.X)",
                            "Speicherdauer wenn möglich auf 7-14 Tage verkürzen",
                            "Alternativ komplett auf IP-Speicherung verzichten, sofern Webhoster zulässt"
                        ]
                    },
                    {
                        id: "server-logs",
                        title: "Weitere Server Logs",
                        description: "Webhoster sind verpflichtet, weitere Server Logs zur Sicherheitsüberwachung zu führen, die ebenfalls IP-Adressen speichern.",
                        required: true,
                        weight: 4,
                        legalBasis: ["Art. 28 DSGVO", "Art. 29 DSGVO", "Art. 6 Abs. 1 Lit. c DSGVO"],
                        implementation: [
                            "Auskunft über Speicherung und Aufbewahrungszeiten beim Hoster anfordern",
                            "Auftragsverarbeitungsvertrag (AVV) auf Log-Behandlung prüfen"
                        ]
                    },
                    {
                        id: "dpa-hosting",
                        title: "Auftragsverarbeitungsvertrag mit Webhoster",
                        description: "Alle auf Servern gespeicherten personenbezogenen Daten stellen 'Verarbeitung' dar und erfordern AVV mit dem Webhoster.",
                        required: true,
                        weight: 9,
                        legalBasis: ["Art. 28 DSGVO"],
                        implementation: [
                            "Auftragsverarbeitungsvertrag (AVV) mit Webhoster abschließen",
                            "Sicherstellen, dass AVV alle Datenverarbeitungsaktivitäten abdeckt",
                            "AVV-Bedingungen regelmäßig auf Compliance-Updates prüfen"
                        ]
                    }
                ]
            },
            {
                id: "external-services",
                title: "Externe Dienste",
                icon: "fas fa-plug",
                description: "Drittanbieter-Services und Tools, die personenbezogene Daten verarbeiten können",
                items: [
                    {
                        id: "analytics-tools",
                        title: "Analyse-Tools (Google Analytics, Matomo, etc.)",
                        description: "Analyse-Tools mit Datenspeicherung in den USA sind seit dem Schrems II-Urteil (2020) nicht DSGVO-konform.",
                        required: true,
                        weight: 8,
                        legalBasis: ["Art. 7 DSGVO", "Art. 28 DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "Google Analytics und Jetpack vermeiden (US-Datenspeicherung)",
                            "DSGVO-konforme Alternativen wie Fathom oder Plausible nutzen",
                            "Bei Analytics-Nutzung: Cookie-Banner mit Opt-out implementieren",
                            "Für Google Analytics: AVV abschließen, minimale Aufbewahrung (14 Monate), Targeting deaktivieren, IPs pseudonymisieren"
                        ]
                    },
                    {
                        id: "marketing-tools",
                        title: "Marketing-Tools (Google Ads, Affiliate-Netzwerke)",
                        description: "Marketing- und Werbe-Tools übertragen meist personenbezogene Daten in die USA und sind seit 2020 problematisch.",
                        required: true,
                        weight: 7,
                        legalBasis: ["Art. 7 DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "Google Ads Conversion-Tracking vermeiden oder 2-Klick-Lösung implementieren",
                            "Affiliate-Tracking-Pixel nur mit Einwilligung laden",
                            "Alternative europäische Marketing-Tools bevorzugen",
                            "Tracking-Codes in Cookie-Management-System einbinden"
                        ]
                    },
                    {
                        id: "newsletter-tools",
                        title: "Newsletter-Tools (Mailchimp, Sendinblue, etc.)",
                        description: "Newsletter-Dienste mit Datenspeicherung außerhalb der EU erfordern besondere Aufmerksamkeit seit Schrems II.",
                        required: true,
                        weight: 8,
                        legalBasis: ["Art. 7 DSGVO", "Art. 28 DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "Mailchimp und ähnliche US-Services vermeiden",
                            "Europäische Newsletter-Anbieter bevorzugen (z.B. Newsletter2Go, CleverReach)",
                            "Double-Opt-In für alle Newsletter-Anmeldungen",
                            "AVV mit Newsletter-Anbieter abschließen"
                        ]
                    },
                    {
                        id: "social-plugins",
                        title: "Social Plugins (Facebook, Instagram, Twitter)",
                        description: "Social Plugins laden personenbezogene Daten beim Seitenbesuch und sind seit 2020 nicht DSGVO-konform.",
                        required: true,
                        weight: 7,
                        legalBasis: ["Art. 7 DSGVO", "Art. 22 DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "Facebook-, Instagram-, Twitter-Plugins deaktivieren (US-Datenspeicherung)",
                            "2-Klick-Lösung vor dem Laden von Social Plugins implementieren",
                            "Facebook Connect und Jetpack-Kommentarfunktionen deaktivieren",
                            "Text-/Grafik-Links statt eingebetteter Widgets verwenden"
                        ]
                    },
                    {
                        id: "royalty-collecting-societies",
                        title: "Verwertungsgesellschaften (VG-Wort)",
                        description: "Zählpixel von Verwertungsgesellschaften übertragen IP-Adressen und erfordern Einwilligung.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 6 Abs. 1 Lit. a DSGVO", "Art. 7 DSGVO"],
                        implementation: [
                            "VG-Wort-Zählpixel nur mit Einwilligung laden",
                            "Alternative: Eigene Zugriffszählung ohne externe Pixel",
                            "In Datenschutzerklärung über VG-Wort-Nutzung informieren"
                        ]
                    },
                    {
                        id: "web-fonts",
                        title: "Webfonts (Google Fonts, Adobe Typekit, etc.)",
                        description: "Web-Schriften erfordern Einwilligung und sollten lokalisiert werden, um Datenübertragung an Dritte zu vermeiden.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 44 ff. DSGVO", "Art. 6 Abs. 1 Lit. a DSGVO"],
                        implementation: [
                            "Einwilligung für alle Web-Font-Nutzungen erforderlich",
                            "Google Fonts mit Google Webfonts Helper lokalisieren",
                            "CSS Font Stack Alternativen berücksichtigen",
                            "Font-Dateien lokal im (Child-)Theme hosten"
                        ]
                    },
                    {
                        id: "profile-pictures",
                        title: "Profile bzw. Profilbilder (Gravatar, About.me)",
                        description: "Externe Profilbild-Services übertragen E-Mail-Hashes und IP-Adressen an Drittanbieter.",
                        required: true,
                        weight: 4,
                        legalBasis: ["Art. 6 Abs. 1 Lit. a DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "Gravatar deaktivieren (WordPress: Einstellungen > Diskussion)",
                            "Lokale Avatar-Lösung implementieren",
                            "About.me-Widgets vermeiden oder 2-Klick-Lösung nutzen"
                        ]
                    },
                    {
                        id: "emojis",
                        title: "Emojis/Emoticons (WP-Emojis)",
                        description: "Externe Emoji-Services können IP-Adressen übertragen und sollten lokalisiert werden.",
                        required: true,
                        weight: 3,
                        legalBasis: ["Art. 6 Abs. 1 Lit. f DSGVO"],
                        implementation: [
                            "WordPress-Emojis deaktivieren (functions.php)",
                            "Lokale Emoji-Lösung oder CSS-Alternativen nutzen",
                            "Emoji-CDN-Aufrufe vermeiden"
                        ]
                    },
                    {
                        id: "dns-prefetching",
                        title: "DNS-Prefetching",
                        description: "DNS-Prefetching kann ungewollt Verbindungen zu externen Servern herstellen.",
                        required: true,
                        weight: 2,
                        legalBasis: ["Art. 6 Abs. 1 Lit. f DSGVO"],
                        implementation: [
                            "DNS-Prefetching für externe Domains deaktivieren",
                            "Meta-Tag rel='dns-prefetch' nur für notwendige Domains nutzen",
                            "Browser-Prefetching-Einstellungen prüfen"
                        ]
                    },
                    {
                        id: "wp-embeds",
                        title: "WP-Embeds/oEmbeds",
                        description: "WordPress-Embeds laden automatisch Inhalte von externen Plattformen und übertragen dabei Daten.",
                        required: true,
                        weight: 4,
                        legalBasis: ["Art. 6 Abs. 1 Lit. a DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "oEmbed-Feature in WordPress deaktivieren",
                            "Manuelle Einbettung mit 2-Klick-Lösung bevorzugen",
                            "Embed-Plugins mit Datenschutz-Features nutzen"
                        ]
                    },
                    {
                        id: "cdn-services",
                        title: "Content Delivery Networks (CDN)",
                        description: "CDNs verteilen Inhalte global und können IP-Adressen speichern, was seit 2020 DSGVO-problematisch sein kann.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 44 ff. DSGVO", "Art. 6 Abs. 1 Lit. a & f DSGVO"],
                        implementation: [
                            "Notwendigkeit von CDNs bewerten (D-A-CH-Zielgruppe berücksichtigen)",
                            "CDN-Inhalte lokalisieren (Fonts, CSS, JS-Dateien)",
                            "WordPress-native Alternativen prüfen (z.B. jQuery)",
                            "Drittanbieter-Plugins auf CDN-Nutzung überprüfen"
                        ]
                    },
                    {
                        id: "video-music-services",
                        title: "Video- und Musikdienste (YouTube, Vimeo, Spotify, SoundCloud)",
                        description: "Eingebettete Videos und Musik von YouTube, Vimeo, Spotify, SoundCloud übertragen personenbezogene Daten und erfordern 2-Klick-Lösungen.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 22 DSGVO", "Art. 44 ff. DSGVO"],
                        implementation: [
                            "Direkte Einbettung von YouTube, Vimeo, Spotify, SoundCloud vermeiden",
                            "YouTubes Enhanced Privacy Mode verwenden (benötigt trotzdem 2-Klick-Lösung)",
                            "2-Klick-Lösung für alle Video-/Musikdienste implementieren",
                            "Alternative: Video-Vorschaubilder mit Links zu Plattformen einbetten"
                        ]
                    },
                    {
                        id: "map-services",
                        title: "Kartendienste (Google Maps, Open Street Maps, etc.)",
                        description: "Kartendienste wie Google Maps sammeln personenbezogene Daten beim Seitenladen und speichern meist Daten in den USA.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 44 ff. DSGVO", "Art. 6 Abs. 1 Lit. f DSGVO"],
                        implementation: [
                            "2-Klick-Lösung für alle Kartendienste implementieren",
                            "Alternative: Karten-Screenshots als Bilder mit Links einbetten",
                            "Urheberrechtshinweise für Karten-Bilder beachten",
                            "Google Maps-Screenshots aus Urheberrechtsgründen vermeiden"
                        ]
                    }
                ]
            },
            {
                id: "content-features",
                title: "Weitere Aspekte",
                icon: "fas fa-cogs",
                description: "Website-Features, die personenbezogene Daten sammeln oder verarbeiten können",
                items: [
                    {
                        id: "comments",
                        title: "Kommentarfunktion",
                        description: "Kommentarsysteme sollten IP-Adress-Speicherung begrenzen und Nutzer über Datensammlung informieren.",
                        required: true,
                        weight: 5,
                        legalBasis: ["Art. 32 Abs. 1 Lit. a DSGVO", "Art. 6 Abs. 1 Lit. b oder f DSGVO"],
                        implementation: [
                            "IP-Adress-Speicherung auf Mindestzeit begrenzen (bis zur Freischaltung)",
                            "Nutzer vor Kommentar-Übermittlung über Datenspeicherung informieren",
                            "Cookie-Speicherung für Name/E-Mail deaktivieren (WordPress: Einstellungen > Diskussion)",
                            "Honeypot-Methode für Kommentar-SPAM-Schutz verwenden"
                        ]
                    },
                    {
                        id: "external-links",
                        title: "Weblinks",
                        description: "Externe Links sollten mit geeigneten Attributen versehen und in der Datenschutzerklärung erwähnt werden.",
                        required: false,
                        weight: 2,
                        legalBasis: ["Art. 13 DSGVO"],
                        implementation: [
                            "rel='noreferrer noopener' zu externen Links hinzufügen",
                            "In Datenschutzerklärung erwähnen, dass externe Seiten Daten sammeln können",
                            "Link-Kennzeichnung für Affiliate-/Sponsored-Links berücksichtigen"
                        ]
                    },
                    {
                        id: "plugins-extensions",
                        title: "Plugins/Erweiterungen/Module",
                        description: "Alle Plugins und Erweiterungen auf Datenschutz-Konformität prüfen und regelmäßig aktualisieren.",
                        required: true,
                        weight: 6,
                        legalBasis: ["Art. 32 DSGVO", "Art. 28 DSGVO"],
                        implementation: [
                            "Alle installierten Plugins auf Datenverarbeitung prüfen",
                            "Plugins regelmäßig aktualisieren",
                            "Ungenutzte Plugins deinstallieren",
                            "Plugin-Datenschutzerklärungen lesen und berücksichtigen"
                        ]
                    },
                    {
                        id: "webshop",
                        title: "Webshop",
                        description: "Online-Shops verarbeiten besonders viele personenbezogene Daten und erfordern umfassende DSGVO-Maßnahmen.",
                        required: true,
                        weight: 9,
                        legalBasis: ["Art. 6 Abs. 1 Lit. b DSGVO", "Art. 9 DSGVO", "Art. 13 DSGVO"],
                        implementation: [
                            "Umfassende Datenschutzerklärung für alle Shop-Prozesse",
                            "SSL-Verschlüsselung für alle Zahlungsprozesse",
                            "AVV mit allen Payment-Providern abschließen",
                            "Kunden-Daten-Löschkonzept implementieren",
                            "Cookie-Banner für Shop-Analytics und Marketing"
                        ]
                    }
                ]
            },
            {
                id: "legal-documents",
                title: "Rechtsdokumente",
                icon: "fas fa-file-contract",
                description: "Erforderliche rechtliche Seiten und Compliance-Dokumentation",
                items: [
                    {
                        id: "general-compliance",
                        title: "Allgemeine Rechtskonformität",
                        description: "Grundlegende rechtliche Anforderungen für alle Websites in Deutschland.",
                        required: true,
                        weight: 8,
                        legalBasis: ["TMG", "DSGVO", "MStV"],
                        implementation: [
                            "Alle rechtlich erforderlichen Seiten erstellen",
                            "Rechtsdokumente von jeder Seite aus erreichbar machen",
                            "Regelmäßige Aktualisierung bei Gesetzesänderungen",
                            "Rechtssichere Generatoren nutzen oder Anwalt konsultieren"
                        ]
                    },
                    {
                        id: "cookies-tracking",
                        title: "Cookies & Tracking-Dienste",
                        description: "Alle nicht-essentiellen Cookies erfordern Nutzereinwilligung. Cookie-Banner müssen gleichwertige Akzeptieren/Ablehnen-Optionen bieten.",
                        required: true,
                        weight: 9,
                        legalBasis: ["§20, 25, 26 TTDSG", "Art. 7 DSGVO"],
                        implementation: [
                            "Einwilligung für alle nicht-essentiellen Cookies einholen",
                            "Gleichwertige 'Akzeptieren' und 'Ablehnen'-Buttons bereitstellen",
                            "Keine Cookies vor Einwilligung speichern (außer technisch notwendige)",
                            "Nutzer über Cookie-Zwecke, Anbieter und Datenübertragung informieren",
                            "Ordnungsgemäßes Cookie-Management-System implementieren"
                        ]
                    },
                    {
                        id: "privacy-policy",
                        title: "Datenschutzerklärung",
                        description: "Umfassende Datenschutzerklärung von jeder Seite aus zugänglich, die alle Datenverarbeitungsaktivitäten detailliert.",
                        required: true,
                        weight: 10,
                        legalBasis: ["Art. 12 DSGVO", "Art. 13 DSGVO", "Art. 14 DSGVO"],
                        implementation: [
                            "Von jeder Seite aus in max. 1-2 Klicks erreichbar machen",
                            "Detaillierte aber verständliche Informationen aufnehmen",
                            "Mit DSGVO- und BDSG-Rechtsgrundlagen unterstützen",
                            "Geltungsbereich und Aktualisierungsdatum aufnehmen",
                            "Doppelte Datenschutzerklärungen berücksichtigen (kurz & detailliert)"
                        ]
                    },
                    {
                        id: "imprint",
                        title: "Impressum",
                        description: "Erforderliche rechtliche Angaben einschließlich Kontaktdaten und Geschäftsinformationen (deutsches/EU-Recht).",
                        required: true,
                        weight: 8,
                        legalBasis: ["§5 TMG", "§18 Abs. 2 MStV"],
                        implementation: [
                            "Von jeder Seite aus über max. 2 Klicks zugänglich",
                            "Alle Pflichtangaben nach §5 TMG aufnehmen",
                            "Verantwortliche Person für redaktionelle Inhalte hinzufügen, falls zutreffend",
                            "USt-IdNr. oder Handelsregister-Nr. aufnehmen (nicht Steuernummer)",
                            "Informationen zugänglich machen (nicht als Bild oder codiert)"
                        ]
                    },
                    {
                        id: "social-media-compliance",
                        title: "Impressum & Datenschutzerklärung bei sozialen Medien",
                        description: "Impressum und Datenschutzerklärung müssen auch bei Social Media-Profilen bereitgestellt werden.",
                        required: true,
                        weight: 6,
                        legalBasis: ["§5 TMG", "Art. 13 DSGVO"],
                        implementation: [
                            "Impressum- und Datenschutzerklärungslinks zu Social Media-Profilen hinzufügen",
                            "Datenschutzerklärung des Drittanbieters erwähnen",
                            "Kurz-URLs (ohne Tracking) nutzen, falls direkter Link nicht möglich",
                            "Automatisierte Inhalte als solche kennzeichnen (§18 Abs. 3 MStV)"
                        ]
                    },
                    {
                        id: "copyright-credits",
                        title: "Urheberrecht/Bildnachweise",
                        description: "Ordnungsgemäße Quellenangaben für alle externen Werke (Bilder, Grafiken, Musik, Videos, Texte, Software).",
                        required: true,
                        weight: 7,
                        legalBasis: ["§§ 12, 13, 19a, 23, 31, 32, 39, 51, 57 UrhG"],
                        implementation: [
                            "Lizenzbedingungen für externe Werke immer lesen und befolgen",
                            "Bildnachweise direkt unter Bildern platzieren",
                            "Nur ordnungsgemäß lizenzierte Werke für Dekorationszwecke verwenden",
                            "Zur Sicherheit immer Autorennamen nennen",
                            "Metadaten (EXIF, IPTC, Wasserzeichen) von fremden Bildern nicht entfernen"
                        ]
                    }
                ]
            }
        ]
    }
};

// Scoring system configuration
const scoringConfig = {
    weights: {
        required: 1.0,
        optional: 0.5
    },
    thresholds: {
        excellent: 90,
        good: 75,
        moderate: 60,
        poor: 40
    },
    labels: {
        en: {
            excellent: "Excellent Compliance",
            good: "Good Compliance", 
            moderate: "Moderate Compliance",
            poor: "Poor Compliance",
            critical: "Critical Issues"
        },
        de: {
            excellent: "Ausgezeichnete Konformität",
            good: "Gute Konformität",
            moderate: "Moderate Konformität", 
            poor: "Schlechte Konformität",
            critical: "Kritische Probleme"
        }
    },
    descriptions: {
        en: {
            excellent: "Your website demonstrates excellent GDPR compliance across all categories.",
            good: "Your website shows good GDPR compliance with minor areas for improvement.",
            moderate: "Your website has moderate compliance but requires attention in several areas.",
            poor: "Your website has significant compliance gaps that need immediate attention.",
            critical: "Your website has critical compliance issues requiring urgent action."
        },
        de: {
            excellent: "Ihre Website zeigt ausgezeichnete DSGVO-Konformität in allen Bereichen.",
            good: "Ihre Website zeigt gute DSGVO-Konformität mit geringfügigen Verbesserungsmöglichkeiten.",
            moderate: "Ihre Website hat moderate Konformität, benötigt aber Aufmerksamkeit in mehreren Bereichen.",
            poor: "Ihre Website hat erhebliche Konformitätslücken, die sofortige Aufmerksamkeit erfordern.",
            critical: "Ihre Website hat kritische Konformitätsprobleme, die dringendes Handeln erfordern."
        }
    }
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gdprData, scoringConfig };
} else if (typeof window !== 'undefined') {
    // Make data available globally in browser
    window.gdprData = gdprData;
    window.scoringConfig = scoringConfig;
}