## SSL/TLS Transport Encryption for Websites

*Legal basis*: [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [§64 para. 2, para. 3 no. 8 BDSG](https://GDPR-gesetz.de/bdsg/64-bdsg/)

* [ ] Transport encryption should always be used when personal data is transmitted, especially for all form data.
* [ ] Many browsers warn about unencrypted connections - so it would be better to use transport encryption all the way, regardless of whether forms are used or not.
* [ ] The entire website should be checked for internal HTTP links, so that there are no warnings about "mixed content".
* [ ] External links should also be checked for accessibility (Broken Link Checker), as many are currently switching to HTTPS.
* [ ] A 301 redirect should be set up so that the website is not accessible via an encrypted **and** unencrypted connection.
* [ ] **OPTIONAL**: HSTS ("HTTP Strict Transport Security") can be used to prevent attackers from "HTTP downgrading". However, it should be noted that this is a **permanent** setting and turning it off will result in massive accessibility limitations.

### Implementation Advice <!-- omit in toc -->

* If the web hoster allows it (with automatic renewal), use "Let's Encrypt" certificates (free of charge).
* For large companies with many subdomains: It is better to use certificates for wildcard domains for a fee.
* **WP Plugin**: For checking and changing internal links use [Better Search Replace](https://wordpress.org/plugins/better-search-replace/).
* For (regular) checking of external links (Broken Link Checker) **don't** use WP plugin, because it heavily burdens performance.
* Configure redirects from HTTP to HTTPS either via "Force SSL" function of the hoster (if offered) or via `.htaccess`.

## SSL/TLS Transport Encryption for Emails

*Legal basis*: [Art. 32 para. 1 lit. a GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [§64 para. 2, para. 3 no. 8 BDSG](https://GDPR-gesetz.de/bdsg/64-bdsg/)<br>
*Legitimation reason*: [Art. 6 para. 1 lit. b & f GDPR](https://GDPR-gesetz.de/art-6-GDPR/)

* [ ] Transport encryption should also be used when sending emails (even via a contact form). It is divided into three parts:
  * SSL/TLS encryption of the website (see above).
  * SSL/TLS encryption of the outgoing email (SMTP) from the sender (in the case of a form, the sender is also the recipient)
  * SSL/TLS encryption of the e-mail inbox (POP3/ IMAP4) from the recipient
* [ ] Avoid business e-mail traffic via private third-party accounts (e.g. Gmail, GMX, Web.de, etc.) (as AVV is usually not possible)!

### Implementation Advice <!-- omit in toc -->

* Make sure that emails are **not** sent with the `mail()` function of PHP when sending forms!
* Make sure that a possible plugin provides SMTP encryption at all.
* **OPTIONAL**: Also provide for a suitable SPAM protection (preferably honeypot method, reCaptchas are **not** GDPR compliant!).
* **WP Plugin**: If it's just about a single contact form, **not** use big form builders like CF7 (performance). Here I recommend my own: [Minimal Contact Form](https://wordpress.org/plugins/minimal-contact-form/) (SSL encryption still in the works).
* If necessary, put email account on own host.

## Security Concept of the CMS (e.g. WordPress)

*Legal basis*: [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/)

* [ ] For protection against brute force and dictionary attacks, a simple protection that limits the number of incorrect entries is sufficient.
* [ ] For protection against comment SPAM a simple protection is enough, preferably via honeypot method (reCaptcha is not GDPR compliant!).
* [ ] Do not use all-in-one security plugins like *iThemes Security* or *WordFence* (security holes!).
* [ ] For protection against security vulnerabilities CMS installation, plugins, modules and themes (even not activated) **always** keep up to date!
* [ ] For protection against security gaps **install as few** plugins/ themes as possible!

### Implementation Advice <!-- omit in toc -->

* **WP Plugin**: Brute Force Attacks - [Limit Login Attempts Reloaded](https://wordpress.org/plugins/limit-login-attempts-reloaded/)
* **WP Plugin**: Comment SPAM - [Antispam Bee](https://wordpress.org/plugins/antispam-bee/)
* **WP specific**: Info on security vulnerabilities in WordPress core, plugins and themes can be found [here](https://www.wpvulndb.com)

## Security Concept of the Server

*Legal basis*: [Art. 28 para. 3 lit. c GDPR](https://GDPR-gesetz.de/art-28-GDPR/), [Art. 29 GDPR](https://GDPR-gesetz.de/art-29-GDPR/), [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/)

* [ ] For shared web hosts or managed servers, the responsibility lies fully with the web host (request information/read DPA).
* [ ] For VPS and dedicated servers, the responsibility lies partly with the owner (request information).

## OPTIONAL: Signature and/or Content Encryption for Emails

*Legal basis*: [Art. 32 GDPR](https://GDPR-gesetz.de/art-32-GDPR/), [eIDAS/ EU 910/2014](https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32014R0910), [§2 no. 2 SigG](https://dejure.org/gesetze/SigG/2.html)

* [ ] An electronic signature promotes the verifiability of the sender.
* [ ] Content encryption prevents the contents of the e-mail from being read in the event of a MitM attack ("Man in the Middle").
* [ ] **Advice**: The common signatures S/MIME and PGP are considered "advanced electronic signatures" and can therefore also be used for legal transactions (see [Bundesnotarkammer](https://zertifizierungsstelle.bnotk.de/elektronische-signatur/)).

### Implementation Advice <!-- omit in toc -->

* There are essentially two popular signature and encryption methods:
  * S/MIME - via an email certificate.
  * PGP (paid) or GnuPGP (Open Source) - via a key pair
* PGP/ GPG should always be given preference!
* Free S/MIME email certificates are available from [Comodo](https://www.comodo.com/home/email-security/free-email-certificate.php) for one year each.
* For the free GPG there are several solutions available on the official [website](https://gnupg.org).
* For the signature only the sender needs the setup, for the encryption both sender and recipient.
