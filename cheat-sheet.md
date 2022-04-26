# Data Protection Cheat Sheet (GDPR) <!-- omit in toc -->

*Open source cheat sheet for web designers and developers to implement privacy-related tasks according to currently applicable law.*

This **Data Protection Cheat Sheet** cannot address individual cases and does **not constitute legal advice**, but is merely a collection of knowledge compiled from extensive research, own experience and "best practices" of various developers and is constantly being further developed. We assume **no liability** and recommend to consult a lawyer for legal questions in any case.

**Please note that some of the laws mentioned apply only in Germany. However, the GDPR applies not only within the EU, but also in third countries that conduct their business within the EU.**

## Inhaltsverzeichnis <!-- omit in toc -->

* [Security](#security)
  * [SSL/TLS Transport Encryption for Websites](#ssltls-transport-encryption-for-websites)
  * [SSL/TLS Transport Encryption for Emails](#ssltls-transport-encryption-for-emails)
  * [Security Concept of the CMS (e.g. WordPress)](#security-concept-of-the-cms-eg-wordpress)
  * [Security Concept of the Server](#security-concept-of-the-server)
  * [OPTIONAL: Signature and/or Content Encryption for Emails](#optional-signature-andor-content-encryption-for-emails)
* [Web Hosts](#web-hosts)
  * [Access Logs](#access-logs)
  * [Other Server Logs](#other-server-logs)
  * [Website Installation](#website-installation)
* [External Services](#external-services)
  * [Analytics Tools (e.g. Google Analytics, Matomo/ Piwik, WordPress Stats/ Jetpack)](#analytics-tools-eg-google-analytics-matomo-piwik-wordpress-stats-jetpack)
  * [Marketing Tools (e.g. Google Ads, Affiliate Networks)](#marketing-tools-eg-google-ads-affiliate-networks)
  * [Newsletter Tools (z.B. Mailchimp, Clicktipp, Newsletter2Go/ Sendinblue, Jetpack Subscription)](#newsletter-tools-zb-mailchimp-clicktipp-newsletter2go-sendinblue-jetpack-subscription)
  * [Social Plugins (z.B. Facebook, Instagram, Twitter)](#social-plugins-zb-facebook-instagram-twitter)
  * [Collecting Societies (z.B. VG-Wort)](#collecting-societies-zb-vg-wort)
  * [Content Delivery Networks (CDN)](#content-delivery-networks-cdn)
  * [Web Fonts (z.B. Google Fonts, Adobe Typekit, Fontawesome)](#web-fonts-zb-google-fonts-adobe-typekit-fontawesome)
  * [Profiles & Profile Pictures (z.B. Gravatar, About.me)](#profiles--profile-pictures-zb-gravatar-aboutme)
  * [Emojis/ Emoticons (z.B. WP Emojis)](#emojis-emoticons-zb-wp-emojis)
  * [DNS Prefetching](#dns-prefetching)
  * [WP Embeds/ oEmbeds](#wp-embeds-oembeds)
  * [Video and Music Services (z.B. YouTube, Vimeo, Spotify, Soundcloud)](#video-and-music-services-zb-youtube-vimeo-spotify-soundcloud)
  * [Map Services (z.B. Google Maps, Open Street Maps, Mapbox, Leaflet)](#map-services-zb-google-maps-open-street-maps-mapbox-leaflet)
* [Other Aspects](#other-aspects)
  * [Comments](#comments)
  * [Web Links](#web-links)
  * [Plugins/ Extensions / Modules](#plugins-extensions--modules)
  * [Web Shop](#web-shop)
* [Legal Documents/ Mandatory Information](#legal-documents-mandatory-information)
  * [General](#general)
  * [Cookies & Tracking Services](#cookies--tracking-services)
  * [Imprint](#imprint)
  * [Privacy Policy](#privacy-policy)
  * [Imprint & Privacy Policy on Social Media](#imprint--privacy-policy-on-social-media)
  * [Copyright / Image Credits](#copyright--image-credits)

## Security

### SSL/TLS Transport Encryption for Websites

*Legal basis*: [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [§64 para. 2, para. 3 no. 8 BDSG](https://GDPR-gesetz.de/bdsg/64-bdsg/)

* [ ] Transport encryption should always be used when personal data is transmitted, especially for all form data.
* [ ] Many browsers warn about unencrypted connections - so it would be better to use transport encryption all the way, regardless of whether forms are used or not.
* [ ] The entire website should be checked for internal HTTP links, so that there are no warnings about "mixed content".
* [ ] External links should also be checked for accessibility (Broken Link Checker), as many are currently switching to HTTPS.
* [ ] A 301 redirect should be set up so that the website is not accessible via an encrypted **and** unencrypted connection.
* [ ] **OPTIONAL**: HSTS ("HTTP Strict Transport Security") can be used to prevent attackers from "HTTP downgrading". However, it should be noted that this is a **permanent** setting and turning it off will result in massive accessibility limitations.

#### Implementation Advice <!-- omit in toc -->

* If the web hoster allows it (with automatic renewal), use "Let's Encrypt" certificates (free of charge).
* For large companies with many subdomains: It is better to use certificates for wildcard domains for a fee.
* **WP Plugin**: For checking and changing internal links use [Better Search Replace](https://wordpress.org/plugins/better-search-replace/).
* For (regular) checking of external links (Broken Link Checker) **don't** use WP plugin, because it heavily burdens performance.
* Configure redirects from HTTP to HTTPS either via "Force SSL" function of the hoster (if offered) or via `.htaccess`.

### SSL/TLS Transport Encryption for Emails

*Legal basis*: [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [§64 para. 2, para. 3 no. 8 BDSG](https://GDPR-gesetz.de/bdsg/64-bdsg/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. b & f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* [ ] Transport encryption should also be used when sending emails (even via a contact form). It is divided into three parts:
  * SSL/TLS encryption of the website (see above).
  * SSL/TLS encryption of the outgoing email (SMTP) from the sender (in the case of a form, the sender is also the recipient)
  * SSL/TLS encryption of the e-mail inbox (POP3/ IMAP4) from the recipient
* [ ] Avoid business e-mail traffic via private third-party accounts (e.g. Gmail, GMX, Web.de, etc.) (as AVV is usually not possible)!

#### Implementation Advice <!-- omit in toc -->

* Make sure that emails are **not** sent with the `mail()` function of PHP when sending forms!
* Make sure that a possible plugin provides SMTP encryption at all.
* **OPTIONAL**: Also provide for a suitable SPAM protection (preferably honeypot method, reCaptchas are **not** GDPR compliant!).
* **WP Plugin**: If it's just about a single contact form, **not** use big form builders like CF7 (performance). Here I recommend my own: [Minimal Contact Form](https://wordpress.org/plugins/minimal-contact-form/) (SSL encryption still in the works).
* If necessary, put email account on own host.

### Security Concept of the CMS (e.g. WordPress)

*Legal basis*: [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/)

* [ ] For protection against brute force and dictionary attacks, a simple protection that limits the number of incorrect entries is sufficient.
* [ ] For protection against comment SPAM a simple protection is enough, preferably via honeypot method (reCaptcha is not GDPR compliant!).
* [ ] Do not use all-in-one security plugins like *iThemes Security* or *WordFence* (security holes!).
* [ ] For protection against security vulnerabilities CMS installation, plugins, modules and themes (even not activated) **always** keep up to date!
* [ ] For protection against security gaps **install as few** plugins/ themes as possible!

#### Implementation Advice <!-- omit in toc -->

* **WP Plugin**: Brute Force Attacks - [Limit Login Attempts Reloaded](https://wordpress.org/plugins/limit-login-attempts-reloaded/)
* **WP Plugin**: Comment SPAM - [Antispam Bee](https://wordpress.org/plugins/antispam-bee/)
* **WP specific**: Info on security vulnerabilities in WordPress core, plugins and themes can be found [here](https://www.wpvulndb.com)

### Security Concept of the Server

*Legal basis*: [Art. 28 para. 3 lit. c GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 29 GDPR](https://GDPR-gesetz.de/art-29-GDPR/), [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/)

* [ ] For shared web hosts or managed servers, the responsibility lies fully with the web host (request information/read DPA).
* [ ] For VPS and dedicated servers, the responsibility lies partly with the owner (request information).

### OPTIONAL: Signature and/or Content Encryption for Emails

*Legal basis*: [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [eIDAS/ EU 910/2014](https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32014R0910), [§2 no. 2 SigG](https://dejure.org/gesetze/SigG/2.html)

* [ ] An electronic signature promotes the verifiability of the sender.
* [ ] Content encryption prevents the contents of the e-mail from being read in the event of a MitM attack ("Man in the Middle").
* [ ] **Advice**: The common signatures S/MIME and PGP are considered "advanced electronic signatures" and can therefore also be used for legal transactions (see [Bundesnotarkammer](https://zertifizierungsstelle.bnotk.de/elektronische-signatur/)).

#### Implementation Advice <!-- omit in toc -->

* There are essentially two popular signature and encryption methods:
  * S/MIME - via an email certificate.
  * PGP (paid) or GnuPGP (Open Source) - via a key pair
* PGP/ GPG should always be given preference!
* Free S/MIME email certificates are available from [Comodo](https://www.comodo.com/home/email-security/free-email-certificate.php) for one year each.
* For the free GPG there are several solutions available on the official [website](https://gnupg.org).
* For the signature only the sender needs the setup, for the encryption both sender and recipient.

## Web Hosts

### Access Logs

*Legal basis*: [Art. 28 GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 29 GDPR](https://GDPR-gesetz.de/art-29-GDPR/), [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* [ ] Personal data stored in the server's access logs (especially the IP address) should be pseudonymized if possible.
* [ ] Alternatively, of course, in the course of data economy, the storage of the IP address (if permitted by the web host) can be dispensed with completely.
* [ ] The storage period should also be reduced to 7 - 14 days if possible.

#### Implementation Advice <!-- omit in toc -->

* Almost every hoster now offers pseudonymization of IP addresses (shortening of the last byte, e.g. 192.168.10.X).
* With many hosters, the storage period can also be limited - or it was automatically shortened for the GDPR conversion (if in doubt, ask the web hoster).

### Other Server Logs

*Legal basis*: [Art. 28 GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 29 GDPR](https://GDPR-gesetz.de/art-29-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. c GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* [ ] The web host is also always obliged to keep additional server logs (especially for early detection of unauthorized access, malicious code and general error messages), which also store IP addresses. Here a shortening is not provided.

#### Implementation Advice <!-- omit in toc -->

* Obtain information about storage and storage duration from the hoster (or look it up in the DPA).

### Website Installation

* [ ] All personal data stored on the server is also considered "processing" - please conclude a data processing agreement (DPA) with your web host!

## External Services

### Analytics Tools (e.g. Google Analytics, Matomo/ Piwik, WordPress Stats/ Jetpack)

*Legal basis*: [Art. 7 GDPR](https://GDPR-gesetz.de/art-7-GDPR/), [Art. 28 GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. a or f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [LG Dresden, Az. 1 a O 1582/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20Dresden&Datum=11.01.2019&Aktenzeichen=1a%20O%201582%2F18), [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] **Important**: Analytics tools that store personal data in the USA are not GDPR compliant since 2020 after the Schrems II ruling! This includes, among others, **Google Analytics** and **Jetpack**.
* [ ] Weigh up which analytics tool appears suitable in consideration of the data economy principle.
* [ ] Weigh up whether there is a processing reason according to Art. 6 para. 1 lit. b - f GDPR or whether prior consent should be obtained according to Art. 6 para. 1 lit. a.
* [ ] If cookies are stored, inform about it via a cookie banner and provide opt-out function.
* [ ] Legacy data that exceeds the maximum processing time must be deleted manually.
* [ ] **Google Analytics**: Complete DPA, set minimum processing time (14 months), turn off targeting features, pseudonymize IP addresses.
* [ ] **Matomo/ Piwik**: Conclude DPA with web hoster, pseudonymize IP addresses, set retention period.
* [ ] **Webalizer**: Complete DPA with web hoster, pseudonymize IP addresses in server logs.
* [ ] **WP Stats/ Jetpack**: Since there is currently no DPA for Jetpack, disable the plugin completely!

#### Implementation Advice <!-- omit in toc -->

* Privacy-compliant alternatives include [Fathom](https://usefathom.com/) and [Plausible](https://plausible.io/) (both paid, free for self-hosting). Both do not store any personal data and do not set any cookies. Plausible also offers a [WordPress plugin](https://github.com/plausible/wordpress) for integration.
* DPA with Google Analytics does **no longer** need to be in writing - can be concluded with a few clicks.
* Integration of GA or Matomo if possible by plugin, to avoid errors.
* For the cookie banner, the opt-out method is currently sufficient, as the GDPR does not explicitly regulate cookies. The opt-in is generally viewed quite critically at the moment.
* **WP Plugin**: [Borlabs Cookie](https://de.borlpara.io/borlabs-cookie/) (cookie banner & 2-click solutions, paid).

### Marketing Tools (e.g. Google Ads, Affiliate Networks)

*Legal basis*: [Art. 7 GDPR](https://GDPR-gesetz.de/art-7-GDPR/), [Art. 28 GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/), [§6 TMG](https://dejure.org/gesetze/TMG/6.html), [§ 58 RStV](http://www.gesetze-bayern.de/Content/Document/RFunkStVertr-58)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. a or f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] **Important**: Marketing tools that store personal data in the USA are not GDPR-compliant since 2020 after the Schrems II ruling! This includes **Google Ads** (esp. the remarketing function) and various affiliate networks.
* [ ] Google Ads currently requires prior consent (opt-in) according to [program guidelines](https://support.google.com/adsense/answer/48182?hl=de), not only for cookies and beacons (tracking pixels), but also for the transmission of any personal data.
* [ ] Functions such as remarketing or the delivery of personal advertising are currently questionable and should - at least temporarily - be disabled.
* [ ] Observe the guidelines and terms and conditions of all affiliate networks!
* [ ] Mention widgets, graphical embeddings or JavaScript embeddings of advertising media of affiliate networks at least in the privacy policy (safer: 2-click solution).
* [ ] Advertising media in any form should be marked as "advertising" or "advertisement"!

#### Implementation Advice <!-- omit in toc -->

* **WP Plugin**: Use for Google Ads [Advanced Ads](https://wordpress.org/plugins/advanced-ads/) with GDPR function (2-click solution).
* For affiliate networks temporarily set only to text links (not relevant for GDPR). Links best provided with `rel="noreferrer noopener"`.

### Newsletter Tools (z.B. Mailchimp, Clicktipp, Newsletter2Go/ Sendinblue, Jetpack Subscription)

*Legal basis*: [Art. 7 GDPR](https://GDPR-gesetz.de/art-7-GDPR/), [Art. 28 GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] **Important**: Newsletter tools that store personal data in the USA are not GDPR-compliant since 2020 after the Schrems II ruling! This includes **Mailchimp** and **Jetpack**, among others.
* [ ] Newsletter forms should be provided with an adequate notice text and repeated in the email during the double opt-in process.
* [ ] A newsletter entry should not be linked to a (free or paid) service ("tie-in ban").
* [ ] The consent for newsletter entries must be documented (notice text, time) and an opt-out must be provided.

#### Implementation Advice <!-- omit in toc -->

* **Tie-in ban**: An offered freebie may **not** be made dependent on consent to the collection of personal data. However, "As a thank you, you will receive [...]" would be feasible.
* Enter into DPA with the third party provider.
* **Safest method**: Do without third-party providers and rely on stationary solutions like the **WP plugin** [Newsletter](https://wordpress.org/plugins/newsletter/).

### Social Plugins (z.B. Facebook, Instagram, Twitter)

*Legal basis*: [Art. 7 GDPR](https://GDPR-gesetz.de/art-7-GDPR/), [Art. 22 GDPR](https://GDPR-gesetz.de/art-22-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. a or f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [LG Düsseldorf, Az. 12 O 151/15](https://dejure.org/dienste/vernetzung/rechtsprechung?Text=12%20O%20151/15), [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] **Important**: Social plugins that store personal data in the USA are not GDPR-compliant since 2020 after the Schrems II ruling! This affects, among others, **Facebook**, **Instagram** and **Twitter**.
* [ ] All integrated social plugins already load personal data when visiting the website. Provided that the user is logged into the social network, an exact allocation as well as a kind of "movement profile" takes place via all websites provided with social plugins.
* [ ] Login procedures (e.g. Facebook Connect) and comment functions with links to social networks are handled in the same way.
* [ ] Sharing buttons that display the number of shares have the same problem.
* [ ] Only pure links (text or graphic) are GDPR compliant.
* [ ] Beacons (tracking pixels) for statistical purposes are also very critical.

#### Implementation Advice <!-- omit in toc -->

* Inform about data processing before loading the social plugin (2-click solution) or disable social plugins completely.
* Turn off Facebook Connect, Jetpack comment function (and similar) completely.
* Show sharing buttons either without metrics or use the **WP plugin** [Shariff](https://wordpress.org/plugins/shariff/).
* Remove beacons (tracking pixels) completely.

### Collecting Societies (z.B. VG-Wort)

*Legal basis*: [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. b GDPR](https://GDPR-gesetz.de/art-6-GDPR/), [Art. 6 para. 1 lit. c GDPR](https://GDPR-gesetz.de/art-6-GDPR/) in accordance with [§32 UrgH](https://dejure.org/gesetze/UrhG/32.html)

* [ ] The tracking pixel of VG-Wort should be switched to HTTPS to avoid "mixed content".
* [ ] The tracking pixel of VG-Wort should be mentioned in the privacy policy.

### Content Delivery Networks (CDN)

*Legal basis*: [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. a & f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] CDNs (e.g. Google Fonts, Adobe Typekit, Bootstrap/ Fontawesome, CDNJS/ Cloudflare, Jetpack, etc.) may well be considered critical, as the content is distributed to servers all over the world and potentially at least the IP address is stored upon retrieval.
* [ ] Since CDNs also store data in the USA, the storage of personal data (e.g. IP & images) could possibly also no longer be GDPR compliant since 2020.
* [ ] In the case of CDNs, it should be weighed up whether they are necessary at all (e.g. target group exclusively D-A-CH).
* [ ] Contents of CDNs (e.g. images, fonts, CSS or JS files) should be localized if possible.

#### Implementation Advice <!-- omit in toc -->

* **Always** Localize files (fonts, CSS, JS, etc.) loaded from CDNs, especially for purely German-language sites. These can be stored directly in the (child) theme.
* Also check if there are alternatives inside WordPress (e.g. jQuery).
* Also check third-party plugins on CDNs.
* Weighing between necessity and risk in special cases (e.g. Instagram widget for photographers).

### Web Fonts (z.B. Google Fonts, Adobe Typekit, Fontawesome)

*Legal basis*: [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [LG München, Az. 3 O 17493/20](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20M%C3%BCnchen%20I&Datum=20.01.2022&Aktenzeichen=3%20O%2017493%2F20)

* [ ] Consent is **always** required for the use of web fonts!
* [ ] Alternatively Google Fonts, Adobe Typekit and Fontaweome Fonts (BootstrapCDN) can be localized (see CDNs)!
* [ ] Fonts could possibly also be replaced against other local open source fonts or even the CSS Font Stack.

#### Implementation Advice <!-- omit in toc -->

* Localize Google Fonts via [Google Webfonts Helper](https://google-webfonts-helper.herokuapp.com/fonts) in the (child) theme.
* If necessary, use the [CSS Font Stack](https://www.cssfontstack.com).
* If you use the **WP-Plugin** [Autoptimize](https://wordpress.org/plugins/autoptimize/), you can also disable Google Fonts there (but it does not always work).

### Profiles & Profile Pictures (z.B. Gravatar, About.me)

*Legal basis*: [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/), [§22 KunstUrhG](https://dejure.org/gesetze/KunstUrhG/22.html)<br>
*Legitimation reason*: poss. [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] **Important**: Profiles that store personal data (e.g. images) in the USA are not GDPR-compliant since 2020 after the Schrems II ruling! This concerns **Gravatar** and **About.me**, among others.
* [ ] Profiles and/ or avatar images should be localized or disabled if possible, as they certainly contain personal data.
* [ ] The Gravatar functionality is permanently integrated in WordPress and should be completely disabled not only because of the images but also in the email addresses stored as hash in the image link.

#### Implementation Advice <!-- omit in toc -->

* The Gravatar functionality can be disabled directly in WordPress under "Settings > Discussion > Show Avatars".

### Emojis/ Emoticons (z.B. WP Emojis)

*Legal basis*: [Art. 22 GDPR](https://GDPR-gesetz.de/art-22-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: poss. [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [EuGH, Az. C-311/18](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.07.2020&Aktenzeichen=C-311/18)

* [ ] If emojis are loaded externally from a CDN, IP addresses are usually saved on retrieval.
* [ ] Especially for **WP emojis**, additional [Canvas Fingerprinting](https://de.wikipedia.org/wiki/Canvas_Fingerprinting) is used, which allows an assignment of the computer without storing cookies (even if no emojis are displayed). Since this data is stored in the USA, such emojis are basically not GDPR compliant since 2020.
* [ ] **WP Emojis** should therefore always be turned off! Any modern browser will nevertheless continue to display emojis and emoticons.

#### Implementation Advice <!-- omit in toc -->

* If the website owner has already installed WordPress **before** version 4.4, there is the possibility to disable the WP emojis directly under `settings > discussion`.
* Newer websites do not have this function - here the emojis (plus DNS prefetching) should be turned off via the `functions.php` of the (child) theme.
* If you use the **WP-Plugin** [Autoptimize](https://wordpress.org/plugins/autoptimize/), you can also disable the emojis there (but it does not always work).

### DNS Prefetching

*Legal basis*: [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: poss. [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* With DNS prefetching, the browser is instructed to resolve additional domains at the name server when the web page is loaded. Of course, this also results in the storage of the IP address at the name server. Since these requests are often not mandatory, **there could** also be a violation of the GDPR here.
* [ ] With WordPress, most prefetching tags are already removed with the removal of the corresponding function (e.g. Google Fonts, WP-Emojis, Jetpack).
* [ ] However, at least one entry (from WordPress itself) remains and must be removed manually.

#### Implementation Advice <!-- omit in toc -->

* Make sure that when removing WP emojis, prefetching is also removed.
* Remove the WordPress own entry by inserting `add_filter( 'emoji_svg_url', '__return_false' );` into the `functions.php` of the (child-)theme.

### WP Embeds/ oEmbeds

*Legal basis*: [Art. 22 GDPR](https://GDPR-gesetz.de/art-22-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: poss. [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [LG München, Az. 3 O 17493/20](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20M%C3%BCnchen%20I&Datum=20.01.2022&Aktenzeichen=3%20O%2017493%2F20)

* [ ] **Important**: Most oEmbeds store personal data in the USA and are not GDPR compliant since 2020 after the Schrems II ruling!
* [ ] If you paste certain links from currently 34 sources (e.g. WordPress blogs, YouTube videos, etc.) into the visual editor in WordPress, they are automatically converted into so-called oEmbeds. In doing so, parts of the target website are loaded into the website graphically via `iframe`. When loading the website, all contents of the iFrame are automatically loaded (e.g. analytics tools, tracking pixels).
* [ ] If such oEmbeds appear in posts, pages or comments, the function should be completely disabled.
* [ ] Old entries will be **not** completely removed and must be deleted manually.

#### Implementation Advice <!-- omit in toc -->

* More information about WP-Embeds can be found [here](https://codex.wordpress.org/Embeds).
* oEmbeds can be avoided by entering links in the WordPress text editor or using your own shortcodes.
* The entire website (each subpage) should be tested for iFrames.
* If the results are positive, the oEmbed function should be removed completely via the `functions.php` of the child theme.
* Old entries still have to be deleted manually afterwards or converted back to normal links.

### Video and Music Services (z.B. YouTube, Vimeo, Spotify, Soundcloud)

*Legal basis*: [Art. 22 GDPR](https://GDPR-gesetz.de/art-22-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: poss. [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [LG München, Az. 3 O 17493/20](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20M%C3%BCnchen%20I&Datum=20.01.2022&Aktenzeichen=3%20O%2017493%2F20)

* [ ] **Important**: Video and music services that store personal data in the USA are not GDPR compliant since 2020 after the Schrems II ruling! This affects **YouTube**, **Vimeo**, **Spotify** and **Soundcloud**, among others.
* [ ] Embeddings of all video and music services already transfer personal data when loading the website and must therefore have a 2-click solution. In addition, cookies are also often stored.
* [ ] YouTube videos can be switched to an "Enhanced Privacy Mode", but this only prevents cookies from being stored.
* [ ] SoundCloud has improved their privacy settings, but still requires a 2-click solution.

#### Implementation Advice <!-- omit in toc -->

* YouTube videos should only be in "Enhanced Privacy Mode".
* **Easiest solution**: Manually embed video previews as an image and link to the respective platforms.
* 2-click solution for **all** services with [Borlabs Cookie](https://de.borlpara.io/borlabs-cookie/) (paid).

### Map Services (z.B. Google Maps, Open Street Maps, Mapbox, Leaflet)

*Legal basis*: [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: poss. [Art. 6 para. 1 lit. f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)<br>
*Verdicts*: [LG München, Az. 3 O 17493/20](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20M%C3%BCnchen%20I&Datum=20.01.2022&Aktenzeichen=3%20O%2017493%2F20)

* [ ] Like video and music services, map services also collect personal data when the website is loaded and mostly store this data in the USA. Currently, only a 2-click solution remains here as well.

#### Implementation Advice <!-- omit in toc -->

* **Simplest solution**: Manually embed map section as an image and link to the respective platform.
* When embedding as an image, copyright information should be placed directly below the image. Screenshots from Google Mags can **not** be used for copyright reasons!
* 2-click solution for **all** services with [Borlabs Cookie](https://de.borlpara.io/borlabs-cookie/) (paid)

## Other Aspects

### Comments

*Legal basis*: [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. b or f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* [ ] The storage of IP addresses in the comment function should be limited to a minimum period of time (e.g. until activation for legal protection) or alternatively deactivated.
* [ ] Before submitting a comment (or any other form), the storage of personal data should be pointed out (opt-in critical!).
* [ ] The option to save a cookie for remembering name and email address should be disabled at "Settings > Discussion > Other comment settings > The opt-in checkbox...".

#### Implementation Advice <!-- omit in toc -->

* Delete IP addresses manually before activation or exclude storage in the (child) theme via `functions.php`.
* Insert notice text - best in the (child) theme in `comments.php` or as an option.

### Web Links

* [ ] Web links to external websites are not critical for the time being. Nevertheless, it should be pointed out in the privacy policy that further personal data may be collected when leaving the website via a link on the target website.
* [ ] It is best to mark all web links with `rel="noreferrer noopener"` if possible. WordPress does this automatically for the most part, however this should be checked with third party builders.

### Plugins/ Extensions / Modules

* [ ] Plugins should be carefully checked whether and how personal data is collected (for WordPress see also [Blogmojo](https://www.blogmojo.de/wordpress-plugins-GDPR/)).

### Web Shop

*Legal basis*: [Art. 7 GDPR](https://GDPR-gesetz.de/art-7-GDPR/), [Art. 22 GDPR](https://GDPR-gesetz.de/art-22-GDPR/), [Art. 28 GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [Art. 44 ff. GDPR](https://GDPR-gesetz.de/art-44-GDPR/)<br>
*Legitimation reason*: [Art. 6 para. a GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* [ ] For web shops, it makes sense to obtain consent for data collection or processing. However, it should be sufficient to set up a common checkmark for "I have read the General Terms and Conditions, the Cancellation Policy and the Privacy Policy" incl. the corresponding link before the "Order with payment" button, as has been done so far.
* [ ] In the case of external store solutions and/ or external payment providers, an data processing agreement (DPA) should **always** be concluded.
* [ ] The statistical collection of purchasing behavior should also be contractually regulated (cf. analytics & marketing tools).

## Legal Documents/ Mandatory Information

### General

* [ ] Imprint and privacy policy should be easily accessible from every subpage of the website (common practice: in the footer menu)!
* [ ] Imprint and privacy policy should be accessible separately on two subpages.
* [ ] As soon as mandatory information is covered (e.g. by a cookie banner), it is treated as "non-existent", unless both links are made accessible in the cookie banner.
* [ ] Even a "white page" or construction site page usually requires this mandatory information!
* [ ] Even **freely accessible** login and registration pages must contain this mandatory information.

### Cookies & Tracking Services

**Partially valid only under German law!**
*Legal basis*: [§20, 25, 26 TTDSG](https://GDPR-gesetz.de/ttdsg/)<br>
*Verdicts*: [BGH, I ZR 7/16](https://juris.bundesgerichtshof.de/cgi-bin/rechtsprechung/document.py?Gericht=bgh&Art=en&Datum=Aktuell&nr=107623&pos=6&anz=672)<br>
*More Information*: [Guidance of the DSK](https://www.datenschutzkonferenz-online.de/media/oh/20211220_oh_telemedien.pdf)

* [ ] Each cookie that is stored on a device (e.g. the computer) of the user requires the consent of the user!
* [ ] **Exception**: Only technically necessary cookies do not require any consent.
* [ ] This also applies to related technologies such as fingerprinting (and possibly local or session storage as well), regardless of whether this information contains personal data or not.
* [ ] Data collected from minors must not be used for commercial purposes!
* [ ] Cookies may not be stored prior to consent (except technically necessary).
* [ ] The user must set the consent **active**, checkboxes must not be preselected.
* [ ] There must be an "Agree" and "Decline" button, which must be presented equally. The "Agree" button must not be graphically highlighted!
* [ ] The user must be informed extensively about the following points before consenting:
  * Purposes of the individual cookies
  * Number of providers and cookies
  * Headquarters of the provider, if it is outside the EU
* [ ] Cookie banners may also be designed in multiple layers including the information requirements.
* [ ] In the future, cross-website single sign-on solutions are to be certified.

#### Notes <!-- omit in toc -->

* With the implementation of the Telecommunications Telemedia Data Protection Act (TTDSG) in December 2021, the regulation of cookies and other tracking mechanisms, among other things, has once again been tightened. In the event of violations, additional fines (in addition to the GDPR fines) of up to 300,000 euros can be imposed.

#### Implementation Advice <!-- omit in toc -->

* The best way to implement cookie banners in WordPress, set 2-click solutions and block scripts before consent is [Borlabs Cookie](https://de.borlpara.io/borlabs-cookie/) (paid).

### Imprint

**Valid only under German law!**
*Legal basis*: [§5 TMG](https://dejure.org/gesetze/TMG/5.html), [EU-VO no. 524/2013](https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2013:165:FULL:DE:PDF), [§2 DL-InfoV](https://www.gesetze-im-internet.de/dlinfov/__2.html), [§18 para. 2 MStV](https://www.die-medienanstalten.de/fileadmin/user_upload/Rechtsgrundlagen/Gesetze_Staatsvertraege/Medienstaatsvertrag_MStV.pdf)<br>
*Verdicts*: [OLG München, Az. 29 U 2681/03](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=OLG%20M%FCnchen&Datum=11.09.2003&Aktenzeichen=29%20U%202681%2F03), [BGH, Az. I ZR 228/03](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=BGH&Datum=20.07.2006&Aktenzeichen=I%20ZR%20228%2F03), [EuGH, Az. C-298/07](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=16.10.2008&Aktenzeichen=C-298/07)

* [ ] The imprint should be accessible from every subpage of the website via a maximum of 2 clicks (e.g. "Contact" - "Imprint").
* [ ] The imprint should contain all mandatory information according to §5 TMG, including:
  * First name and surname or company name and business form as well as owner, if applicable.
  * Chargeable address or address of the branch office
  * Telephone number (or contact form, if response time within 30 - 60 min.)
  * E-mail address
  * VAT ID (or reference to exemption) or business ID (**not a tax number!**)
  * Entry in the Commercial Register, Register of Associations, Register of Cooperatives or Register of Partnerships (if available)
  * Official license with details of the supervisory authority, if the profession is subject to mandatory licensing
  * Competent chamber (address, telephone number, website) in the case of chamber-based professions (e.g. lawyers, tax consultants, doctors)
  * Corresponding marking if the company is in liquidation or being wound up (only AG, KGaA and GmbH)
  * If the share or nominal capital (GmbH, voluntary) is indicated, this must be done correctly.
* [ ] If services are offered on the website, information obligations pursuant to §2 para. 1 DL-InfoV apply prior to conclusion of the contract or provision of the services. These **can** also be written in a central place in the imprint. In addition to the above information, the following points would then be necessary:
  * Details of professional liability insurance (if available).
  * Applicable general terms and conditions (AGB)
  * Applicable law and place of jurisdiction
  * Existing guarantees (if any)
* [ ] If the website contains journalistic-editorial content (e.g. in the case of a blog), a person responsible for the content with name and address must also be specified in accordance with **§18 para. 2 MStV** (Attention, see Notes!).
* Online merchants who sell goods to consumers must provide a link to the EU dispute resolution body.
* [ ] The imprint must be accessible! Address, phone number or mail address as an image or in coded form are **not** allowed!
* [ ] Disclaimers about links and content do **not** belong (in generalized form) in the imprint!
* [ ] Who has not understood it yet: "The LG Hamburg has decided in 1998..." is nonsense and can even lead to legal consequences!
* [ ] "No final warning without prior contact" has no effect!
* [ ] A reference to the own copyright can be made, but is not mandatory in Germany.
* [ ] The imprint is also a nice place to refer to co-authors as well as the designer, web developer, font creator, etc..
* [ ] Image credits only belong in the imprint if they are generally valid for the whole website! ("Unless otherwise stated...")

#### Notes <!-- omit in toc -->

* Since November 2020, the Interstate Media Treaty (MStV) has replaced the Interstate Broadcasting Treaty (RStV). Accordingly, the information on the person responsible for the content changes from §55 para. 2 RStV to [§18 para. 2 MStV](https://www.die-medienanstalten.de/fileadmin/user_upload/Rechtsgrundlagen/Gesetze_Staatsvertraege/Medienstaatsvertrag_MStV.pdf)). Don't forget to switch these mandatory details for journalistic-editorial content (e.g. a blog)!
* Furthermore, information on (voluntary) self-regulation for the purpose of quality assurance as well as on the corresponding complaints office (cf. §19 MStV) could become necessary in future jurisdictions.

#### Implementation Advice <!-- omit in toc -->

* For the creation of legal documents, it is recommended to take out a membership with [e-recht24.de](https://www.e-recht24.de/mitglieder/) and use their generators.

### Privacy Policy

*Legal basis*: [Art. 12 GDPR](https://GDPR-gesetz.de/art-12-GDPR/), [Art. 13 GDPR](https://GDPR-gesetz.de/art-13-GDPR/), [Art. 14 GDPR](https://GDPR-gesetz.de/art-14-GDPR/), [Art. 85 GDPR](https://GDPR-gesetz.de/art-85-GDPR/), [§13 TMG](https://dejure.org/gesetze/TMG/13.html), [§23 para. 2 & 3 MStV](https://www.die-medienanstalten.de/fileadmin/user_upload/Rechtsgrundlagen/Gesetze_Staatsvertraege/Medienstaatsvertrag_MStV.pdf)<br>
*Verdicts*: poss. accessibility in accordance with [OLG München, Az. 29 U 2681/03](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=OLG%20M%FCnchen&Datum=11.09.2003&Aktenzeichen=29%20U%202681%2F03)

* [ ] The privacy policy should be accessible from every subpage in one click (possibly also in 2 clicks, cf. imprint).
* [ ] The privacy policy should be detailed, but understandable and supported by legal basisn of the GDPR and the BDSG-neu.
* [ ] Double privacy policies (once short & understandable, once long & detailed) are usually accepted (not more than 2 clicks!).
* [ ] The privacy policy should include a scope of validity (e.g. also other named websites and social media) and an update date.
* [ ] The privacy policy can be created by a generator (free or paid) or directly by a lawyer or data protection officer.
* [ ] For press products/ journalistic purposes, the specifications for data processing as well as the information requirements according to §23 para. 2 & 3 MStV (of the federal state) deviate in accordance with Art. 85 GDPR ("media privilege").

#### Notes <!-- omit in toc -->

* Since the entry into force of the State Media Treaty (MStV) in November 2020, the data protection requirements regarding "media privilege" for journalistic editorial content have changed, see [§23 MStV](https://www.die-medienanstalten.de/fileadmin/user_upload/Rechtsgrundlagen/Gesetze_Staatsvertraege/Medienstaatsvertrag_MStV.pdf).

#### Implementation Advice <!-- omit in toc -->

* For the creation of legal documents, it is recommended to take out a membership with [e-recht24.de](https://www.e-recht24.de/mitglieder/) and use their generators.

### Imprint & Privacy Policy on Social Media

**Valid only under German law!**
*Legal basis*: see [Impressum](#impressum) & [Datenschutzerklärung](#datenschutzerklärung)<br>
*Verdicts*: [LG Aschaffenburg, Az. 2 HK O 54/11](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20Aschaffenburg&Datum=19.08.2011&Aktenzeichen=2%20HKO%2054/11), [OLG Düsseldorf, Az. I-20 U 17/07](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=OLG%20Düsseldorf&Datum=18.12.2007&Aktenzeichen=20%20U%2017%2F07), [EuGH, Az. C-210/16](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=EuGH&Datum=2222-12-31&Aktenzeichen=C-210%2F16)

* [ ] Imprint & privacy policy must also be stated on social media profiles.
* [ ] In addition, the privacy policy of the third-party provider must be mentioned in the privacy policy.
* [ ] For Facebook pages, there are now two entries that you can fill with links to the imprint & the privacy policy of your own website.
* [ ] Where there is no direct possibility to enter the corresponding links, you can work with short URLs (**without tracking!**) in the respective descriptions.

#### Notes <!-- omit in toc -->

* Since the new State Media Treaty (MStV) came into force in November 2020, automatically published journalistic editorial content (e.g. by a bot) must be marked as such. Depending on the interpretation, this could also affect automated cross-postings. The basis for this is [§18 para. 3 MStV](https://www.die-medienanstalten.de/fileadmin/user_upload/Rechtsgrundlagen/Gesetze_Staatsvertraege/Medienstaatsvertrag_MStV.pdf).

### Copyright / Image Credits

**Valid only under German law!**
*Legal basis*: [§§ 12, 13, 19a, 23, 31, 32, 39, 51, 57 uvm. UrhG](https://dejure.org/gesetze/UrhG)<br>
*Verdicts*: [LG Köln Az. 6 U 25/14](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=OLG%20K%F6ln&Datum=31.12.1111&Aktenzeichen=6%20U%2025/14), [LG Bochum, Az. 9 S 17/16](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=LG%20Bochum&Datum=16.08.2016&Aktenzeichen=9%20S%2017/16), [BGH, Az. I ZR 69/08](https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=BGH&Datum=29.04.2010&Aktenzeichen=I%20ZR%2069/08)

* [ ] When using external works (images, graphics, music, videos, texts, software, code) **always** read the corresponding license terms and, if necessary, provide the appropriate information about the author according to the specifications!
* [ ] No matter if large or small quotation: Works are only citations if you deal with them in detail. For decorative additions use only works with an appropriate license (eg Creative Commons or CC0 / Public Domain)!
* [ ] The picture credit belongs **always** directly under the picture! Some stock agencies even require the image credit to be **in** the image. The only exception (because it is common practice): images that are used under the corresponding free license (e.g. CC0) **without attribution** and extend over the entire website can also be named once in the imprint.
* [ ] However, it is controversial whether the **waiver of attribution of the author** is possible at all, so it is best to **always** indicate the name of the author to be on the safe side!
* [ ] Web designers/developers should check the image material provided by the customer for copyright infringements (cf. LG Bochum, Az. 9 S 17/16).
* [ ] Images (and other foreign works) may not be edited without appropriate exploitation rights!
* [ ] Metadata (EXIF, IPTC, watermarks) may **not** be removed from **foreign** images without the corresponding consent of the author (image editing & deprivation of authorship)!
