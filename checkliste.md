# Datenschutz-Checkliste (DSGVO)

*Open Source Checkliste für Webdesigner und -entwickler, um datenschutz-relevante Aufgaben nach aktuell geltendem Recht umzusetzen.*

## Sicherheit

*Rechtsgrundlage*: Art. 32 Abs. 1 DSGVO

### SSL/TLS-Transportverschlüsselung Webseite

* [ ] Transportverschlüsselung sollte immer dann verwendet werden, wenn personenbezogene Daten übertragen werden, insbesondere bei sämtlichen Formulardaten.
* [ ] Viele Browser warnen bei unverschlüsselten Verbindungen - besser wäre also eine durchgängige Transportverschlüsselung, egal, ob Formulare verwendet werden oder nicht.
* [ ] Es sollte die gesamte Webseite auf interne HTTP-Links überprüft werden, damit nicht vor »Mixed Content« gewarnt wird.
* [ ] Es sollten auch externe Links auf Erreichbarkeit überprüft werden (Broken Link Checker), da gerade viele auf HTTPS umstellen.
* [ ] Es sollte eine 301-Weiterleitung eingerichtet werden, damit die Webseite nicht über eine verschlüsselte **und** unverschlüsselte Verbindung erreichbar ist.
* [ ] **OPTIONAL**: Es kann HSTS (»HTTP Strict Transport Security«) eingesetzt werden, um Angreifern die Möglichkeit zum »HTTP Downgrading« zu nehmen. Allerdings sollte man darauf hinweisen, dass dies eine **dauerhafte** Einstellung ist und es beim Abschalten dieser Funktion zu massiven Einschränkungen in der Erreichbarkeit führt.

#### Tipps zur Umsetzung

* Sofern es der Webhoster (mit automatischer Verlängerung) zulässt, auf »Let's Encrypt«-Zertifikate setzen (kostenlos).
* Für große Firmen mit vielen Subdomains: Lieber kostenpflichtig auf Zertifikate für Wildcard-Domains setzen.
* **WP-Plugin**: Für die Überprüfung und Umstellung der internen Links [Better Search Replace](https://wordpress.org/plugins/better-search-replace/) verwenden.
* Für die (regelmäßige) Überprüfung externer Links (Broken Link Checker) **kein** WP-Plugin verwenden, weil es die Performance stark belastet.
* Weiterleitungen von HTTP auf HTTPS wahlweise per »Force SSL«-Funktion des Hosters (wenn angeboten) oder per `.htaccess` konfigurieren.


### SSL/TLS-Transportverschlüsselung E-Mail

* [ ] Auch beim Versand von E-Mails (auch über ein Kontaktformular) sollte Transportverschlüsselung eingesetzt werden. Sie ist dreigeteilt:
  1. SSL/TLS-Verschlüsselung der Webseite (siehe oben)
  2. SSL/TLS-Verschlüsselung des E-Mail-Postausgangs (SMTP) vom Absender (im Falle eines Formulars ist der Absender auch der Empfänger)
  3. SSL/TLS-Verschlüsselung des E-Mail-Posteingangs (POP3/ IMAP4) vom Empfänger
* [ ] Geschäftlichen E-Mail-Verkehr über private Drittanbieter-Konten (z.B. Gmail, GMX, Web.de usw.) vermeiden (da meistens kein AVV möglich)!

#### Tipps zur Umsetzung

* Darauf achten, dass E-Mails beim Formular-Versand **nicht** mit der `mail()`-Funktion von PHP versendet werden!
* Darauf achten, dass ein mgl. Plugin die SMTP-Verschlüsselung überhaupt vorsieht.
* **OPTIONAL**: Auch für einen geeigneten SPAM-Schutz (vorzugsweise Honeypot-Methode, reCaptchas sind **nicht** DSGVO-konform!) sorgen.
* **WP-Plugin**: Wenn es nur um ein einzelnes Kontaktformular geht, **nicht** große Formbuilder wie CF7 einsetzen (Performance). Hier empfehle ich mein eigenes: [Minimal Contact Form](https://wordpress.org/plugins/minimal-contact-form/) (SSL-Verschlüsselung noch in Arbeit)
* Ggf. E-Mail-Konto auf eigenen Hoster legen.


### Sicherheitskonzept des CMS (z.B. WordPress)

* [ ] Für den Schutz vor Brute-Force- und Wörterbuch-Attacken reicht ein einfacher Schutz, der die Anzahl der falschen Eingaben begrenzt.
* [ ] Für den Schutz vor Kommentar-SPAM reicht ein einfacher Schutz, vorzugsweise per Honeypot-Methode (reCaptcha nicht DSGVO-konform!).
* [ ] Auf All-In-One Sicherheits-Plugins wie *iThemes Security* oder *WordFence* verzichten (Sicherheitslücken!).
* [ ] Für den Schutz vor Sicherheitslücken CMS-Installation, Plugins, Module und Themes (auch nicht aktivierte) **immer** aktuell halten!
* [ ] Für den Schutz vor Sicherheitslücken **so wenig** Plugins/ Themes wie nur möglich installieren!

#### Tipps zur Umsetzung

* **WP-Plugin**: Brute-Force-Attacken - [Limit Login Attempts Reloaded](https://wordpress.org/plugins/limit-login-attempts-reloaded/)
* **WP-Plugin**: Kommentar-SPAM - [Antispam Bee](https://wordpress.org/plugins/antispam-bee/)
* **WP-spezifisch**: Infos zu Sicherheitslücken im WordPress Core, Plugins und Themes gibt es [hier](https://www.wpvulndb.com)


### Sicherheitskonzept des Servers

* [ ] Bei Shared Hosting oder Managed Servern liegt die Verantwortung voll beim Webhoster (Auskunft anfordern/ AVV lesen).
* [ ] Bei VPS und dedizierten Servern liegt die Verantwortung teilweise auch beim Inhaber (Auskunft anfordern).


### OPTIONAL: Signatur und/ oder Inhaltsverschlüsselung bei E-Mails

* [ ] Eine elektronische Signatur fördert die Nachweisbarkeit des Absenders.
* [ ] Eine Inhaltsverschlüsselung verhindert das Lesen des Inhalts der E-Mail bei einer MitM-Attacke (»Man in the Middle«).

#### Tipps zur Umsetzung

* Im wesentlichen gibt es zwei populäre Signatur- und Verschlüsselungsverfahren:
  1. S/MIME - über ein E-Mail-Zertifikat
  2. PGP (kostenplichtig) bzw. GnuPGP (Open Source) - über ein Schlüsselpaar
* PGP/ GPG ist immer den Vorzug zu geben!
* Kostenlose S/MIME-E-Mail-Zertifikate gibt es bei [Comodo](https://www.comodo.com/home/email-security/free-email-certificate.php) für jeweils ein Jahr.
* Für das kostenlose GPG gibt es verschiedene Lösungen, die auf der offiziellen [Webseite](https://gnupg.org) erhältlich sind.
* Für die Signatur braucht nur der Absender die Einrichtung, für die Verschlüsselung sowohl Absender als auch Empfänger.


---

## Webhoster

*Rechtsgrundlage*: Art. 28 DSGVO

### Access Logs

* [ ] In den Access Logs des Servers gespeicherte personenbezogene Daten (insbes. die IP-Adresse) sollten nach Möglichkeit pseudonymisiert werden.
* [ ] Alternativ kann natürlich im Zuge der Datensparsamkeit komplett auf die Speicherung der IP-Adresse (sofern vom Webhoster zugelassen) verzichtet werden.
* [ ] Auch die Speicherdauer sollte wenn möglich auf 7 - 14 Tage verkürzt werden.

#### Tipps zur Umsetzung

* Fast jeder Hoster bietet inzwischen die Pseudonymisierung von IP-Adressen (Kürzung des letzten Bytes, z.B. 192.168.10.X) an.
* Bei vielen Hostern ist auch die Speicherdauer einzuschränken - oder sie wurde zur DSGVO-Umstellung automatisch verkürzt (im Zweifelsfall beim Webhoster anfragen).


### Weitere Server Logs

* [ ] Der Webhoster ist auch immer dazu verpflichtet, weitere Server Logs zu (insbes. zur Früherkennung von nicht authorisierten Zugriffen, Schadcode und allgemeinen Fehlermeldungen) führen, die ebenfalls IP-Adressen speichern. Hier ist eine Kürzung nicht vorgesehen.

#### Tipps zur Umsetzung

* Auskunft über die Speicherung und Speicherdauer beim Hoster einholen (oder im AVV nachschlagen).


### Webseiten-Installation

* [ ] Alle auf dem Server gespeicherten personenbezogenen Daten gelten auch als »Verarbeitung« - Auftragsverarbeitungsvertrag (AVV) mit Webhoster abschließen!

---

## Externe Dienste

*Rechtsgrundlage*: Art. 6 Abs. 1, 7, 28, 44 ff. DSGVO

### Analysetools (z.B. Google Analytics, Matomo/ Piwik, WordPress Stats/ Jetpack)

* [ ] Abwägen, welches Analysetool unter der Berücksichtigung des Datensparsamkeits-Prinzips geeignet erscheint.
* [ ] Abwägen, ob ein Verarbeitungsgrund nach Art. 6 Abs. 1 lit. b) - f) DSGVO vorliegt oder nach Art. 6 Abs. 1 lit. a) ein vorheriges Einverständnis eingeholt werden sollte.
* [ ] Sofern Cookies gespeichert werden, über einen Cookie-Banner darüber informieren und Opt-Out-Funktion bereit stellen.
* [ ] Altdaten, die die maximale Verarbeitungszeit überschreiten, müssen händisch gelöscht werden.
* [ ] **Google Analytics**: AVV abschließen, minimale Verarbeitungszeit (14 Monate) einstellen, Targeting-Funktionen ausstellen, IP-Adressen pseudonymisieren
* [ ] **Matomo/ Piwik**: AVV mit Webhoster abschließen, IP-Adressen pseudonymisieren, Speicherdauer einstellen
* [ ] **Webalizer**: AVV mit Webhoster abschließen, IP-Adressen in den Server Logs pseudonymisieren
* [ ] **WP Stats/ Jetpack**: Da es derzeit keinen AVV für Jetpack gibt, das Plugin vollkommen abschalten!

#### Tipps zur Umsetzung

* AVV bei Google Analytics braucht **nicht mehr** schriftlich erfolgen - mit wenigen Klicks abschließbar
* Einbindung von GA oder Matomo nach Möglichkeit per Plugin, um Fehler zu vermeiden
* Beim Cookie-Banner reicht derzeit die Opt-Out-Methode, da die DSGVO nicht explizit Cookies regelt. Das Opt-In wird derzeit im Allgemeinen recht kritisch betrachtet.
* **WP-Plugin**: [Borlabs Cookie](https://de.borlabs.io/borlabs-cookie/) (Cookie-Banner & 2-Klick-Lösungen, kostenpflichtig) oder [Google Analytics Germanized](https://wordpress.org/plugins/ga-germanized/) (GA-Einbindung, Cookie-Banner & DNT, kostenlos)
* **WP-Plugin**: Alternativ [Statify](https://wordpress.org/plugins/statify/) einsetzen - trackt nur Page Impressions und ist vollkommen DSGVO-konform.


### Marketing-Tools (z.B. Google AdSense/ AdWords, Affiliate-Netzwerke)

* [ ] Google AdSense verlangt derzeit das vorherige Einverständnis (Opt-In) lt. [Programmrichtlinien](https://support.google.com/adsense/answer/48182?hl=de), nicht nur für die Cookies und Beacons (Zählpixel), sondern auch für die Übertragung jeglicher personenbezogenen Daten.
* [ ] Funktionen wie Remarketing oder die Auslieferung von personenbezogener Werbung sind derzeit fraglich und sollten - zumindest vorübergehend - abgeschaltet werden.
* [ ] Richtlinien bzw. AGBs bei sämtlichen Affiliate-Netzwerken beachten!
* [ ] Widgets, grafische Einbettungen oder JavaScript-Einbettungen von Werbemitteln von Affiliate-Netzwerken mindestens in der DSE erwähnen (sicherer: 2-Klick-Lösung)

#### Tipps zur Umsetzung

* **WP-Plugin**: Für Google AdSense [Advanced Ads](https://wordpress.org/plugins/advanced-ads/) mit GDPR-Funktion (2-Klick-Lösung) einsetzen.
* Bei Affiliate-Netzwerken vorübergehend nur auf (für die DSGVO nicht relevante) Text-Links setzen.


### Newsletter-Tools (z.B. Mailchimp, Clicktipp, Newsletter2Go, Jetpack Abonnement)

* [ ] Newsletter-Formulare sollten mit einem adäquaten Hinweistext versehen und in der E-Mail beim Double-Opt-In-Verfahren wiederholt werden.
* [ ] Drittanbieter nicht-europäischen Ländern sollten auf die Mitgliedschaft beim [Privacy Shield](https://www.privacyshield.gov/list) überprüft oder ggf. gemieden werden.
* [ ] Ein Newsletter-Eintrag sollte nicht an eine (kostenlosen oder kostenpflichtigen) Dienstleistung gekoppelt werden (»Kopplungsverbot«)
* [ ] Das Einverständnis für Newsletter-Einträge muss dokumentiert (Hinweistext, Zeitpunkt) und es muss ein Opt-Out bereit gestellt werden. 

#### Tipps zur Umsetzung

* **Kopplungsverbot**: Ein angebotenes Freebie darf **nicht** von der Zustimmung zur Erhebung personenbezogener Daten abhängig gemacht werden. »Als Dankeschön erhalten Sie [...]« wäre aber machbar.
* AVV mit dem Drittanbieter abschließen
* **Sicherste Methode**: Auf Drittanbieter verzichten und auf stationäre Lösungen wie dem **WP-Plugin** [Newsletter](https://wordpress.org/plugins/newsletter/) setzen.


### Social Plugins (z.B. Facebook, Instagram, Twitter, Google+)

* [ ] Sämtliche eingebundene Social Plugins laden personenbezogene Daten bereits beim Besuch der Webseite. Sofern der Nutzer im sozialen Netzwerk eingeloggt ist, erfolgt eine genaue Zuordnung sowie eine Art »Bewegungsprofil« über alle mit Social Plugins versehenen Webseiten.
* [ ] Bei Login-Verfahren (z.B. Facebook Connect) und Kommentarfunktionen mit Verknüpfung zu sozialen Netzen wird ebenso verfahren.
* [ ] Sharing-Buttons, die die Anzahl der Shares anzeigen, haben das gleiche Problem.
* [ ] Einzig reine Links (Text oder Grafik) sind DSGVO-sicher.
* [ ] Beacons (Zählpixel) für Statistik-Zwecke sind ebenfalls sehr kritisch zu bewerten.

#### Tipps zur Umsetzung

* Vor dem Laden des Social Plugins über die Datenverarbeitung informieren (2-Klick-Lösung) oder Social Plugins komplett abschalten.
* Facebook Connect, Jetpack Kommentarfunktion (und ähnliche) komplett abschalten.
* Sharing-Buttons entweder ohne Kennzahlen anzeigen oder das **WP-Plugin** [Shariff](https://wordpress.org/plugins/shariff/) verwenden.
* Beacons (Zählpixel) komplett entfernen.


### Verwertungsgesellschaften (z.B. VG-Wort)

* [ ] Der Zählpixel der VG-Wort sollte auf HTTPS umgestellt werden, um »mixed Content« zu vermeiden.
* [ ] Der Zählpixel der VG-WOrt sollte in der Datenschutzerklärung erwähnt werden.


### Content Delivery Networks (CDN)

* [ ] CDNs (z.B. Google Fonts, Adobe Typekit, Bootstrap/ Fontawesome, CDNJS/ Cloudflare, Jetpack usw.) können durchaus als kritisch betrachtet werden, da die Inhalte auf Server der ganzen Welt verteilt werden und potentiell beim Abruf mindestens die IP-Adresse gespeichert wird.
* [ ] Bei CDNs sollte abgewogen werden, ob diese überhaupt notwendig sind (z.B. Zielgruppe ausschließlich D-A-CH).
* [ ] Inhalte von CDNs (z.B. Bilder, Fonts, CSS- oder JS- Dateien) sollten nach Möglichkeit lokalisiert werden.

#### Tipps zur Umsetzung

* Von CDNs geladene Dateien (Fonts, CSS, JS usw.) insbesondere bei rein deutschsprachigen Seiten **immer** lokalisieren. Diese können direkt im (Child-)Theme abgelegt werden.
* Auch prüfen, ob es nicht WordPress-eigene Alternativen gibt (z.B. jQuery).
* Auch Drittanbieter-Plugins auf CDNs prüfen.
* Abwägung zwischen Notwendigkeit und Risiko im besonderen Fall (z.B. Instagram-Widget bei Fotografen)


### Webfonts (z.B. Google Fonts, Adobe Typekit, Fontawesome)

* [ ] Google Fonts, Adobe Typekit- und Fontaweome-Fonts (BootstrapCDN) sollten **immer** lokalisiert werden (siehe CDNs)!
* [ ] Fonts könnten unter Umständen auch gegen andere lokale Open-Source-Fonts oder sogar dem CSS Font Stack ersetzt werden.

#### Tipps zur Umsetzung

* Google Fonts über den [Google Webfonts Helper](https://google-webfonts-helper.herokuapp.com/fonts) im (Child-)Theme lokalisieren.
* Wenn nötig, [CSS Font Stack](https://www.cssfontstack.com) einsetzen.
* Wer das **WP-Plugin** [Autoptimize](https://wordpress.org/plugins/autoptimize/) einsetzt, kann auch dort Google Fonts abschalten (funktioniert allerdings nicht immer).


### Profile bzw. Profilbilder (z.B. Gravatar, About.me)

* [ ] Profile und/ oder Avatarbilder sollten nach Möglichkeit lokalisiert oder abgeschaltet werden, da sie mit Sicherheit personenbezogene Daten enthalten.
* [ ] Die in WordPress fest integrierte Gravatar-Funktion sollte nicht nur wegen den Bildern, sondern auch in den im Bild-Link als Hash abgelegten E-Mail-Adressen komplett abgeschaltet werden.

#### Tipps zur Umsetzung

* Die Gravatarfunktion lässt sich direkt in WordPress unter »Einstellungen > Diskussion > Avatare anzeigen« abschalten.
 

### Emojis/ Emoticons (z.B. WP-Emojis)

* [ ] Wenn Emojis extern von einem CDN geladen werden, werden für gewöhnlich IP-Adressen beim Abruf abgerufen.
* [ ] Speziell bei den **WP-Emojis** wird zusätzlich [Canvas Fingerprinting](https://de.wikipedia.org/wiki/Canvas_Fingerprinting) eingesetzt, was eine Zuordnung des Rechners ohne Speicherung von Cookies ermöglicht (auch, wenn keine Emojis angezeigt werden).
* [ ] **WP-Emojis** sollte daher immer abgeschaltet werden! Jeder moderne Browser zeigt trotzdem weiter Emojis und Emoticons an.

#### Tipps zur Umsetzung

* Sofern der Webseitenbetreiber WordPress bereits **vor** Version 4.4 installiert hat, gibt es unter »Einstellungen > Diskussion« die Möglichkeit, die WP-Emojis direkt abzuschalten.
* Jüngere Webseiten haben diese Funktion nicht - hier sollten die Emojis (zzgl. DNS-Prefetching) über die `functions.php` des (Child-)Themes abgeschaltet werden.
* Wer das **WP-Plugin** [Autoptimize](https://wordpress.org/plugins/autoptimize/) einsetzt, kann auch dort die Emojis abschalten (funktioniert allerdings nicht immer).


### DNS-Prefetching

* [ ] Beim DNS-Prefetching wird bereits beim Laden der Webseite der Browser angewiesen, beim Name Server weitere Domains aufzulösen. Dies zieht natürlich auch die Speicherung der IP-Adresse beim Name Server nach sich. Da diese Anfragen häufig nicht zwingend erforderlich sind, **könnte** auch hier ein Verstoß gegen die DSGVO vorliegen.
* [ ] Bei WordPress werden die meisten Prefetching-Tags bereits mit dem Entfernen der entsprechenden Funktion (z.B. Google Fonts, WP-Emojis, Jetpack) entfernt.
* [ ] Mindestens ein Eintrag (von WordPress selbst) bleibt aber erhalten und muss manuell entfernt werden.

#### Tipps zur Umsetzung

* Darauf achten, dass beim Entfernen von WP-Emojis auch das Prefetching entfernt wird.
* Den WordPress-eigenen Eintrag über die `functions.php` des (Child-)Themes entfernen.


### WP-Embeds/ oEmbeds

* [ ] Wenn man bestimmte Links aus derzeit 34 Quellen (z.B. WordPress-Blogs, YouTube-Videos usw.) in den visuellen Editor in WordPress einfügt, werden sie automatisch in so genannte oEmbeds umgewandelt. Dabei werden Teile der Zielwebseite per `iframe` in die Webseite grafisch aufgearbeitet geladen. Beim Laden der Webseite werden damit automatisch alle Inhalte des iFrames mitgeladen (z.B. Analytics-Tools, Zählpixel).
* [ ] Sofern in den Posts, Seiten oder Kommentaren solche oEmbeds auftauchen, sollte die Funktion vollständig deaktiviert werden.
* [ ] Alte Einträge werden **nicht** vollständig entfernt und müssen händisch gelöscht werden.

#### Tipps zur Umsetzung

* Nähere Informationen zu den WP-Embeds gibt es [hier](https://codex.wordpress.org/Embeds).
* oEmbeds kann man vermeiden, indem man Links in den Text-Editor von WordPress eingibt oder eigene Shortcodes verwendet.
* Die gesamte Webseite (jede Unterseite) sollte auf iFrames getestet werden.
* Bei positiven Ergebnissen sollte die oEmbed-Funktion über die `functions.php` des Child Themes komplett entfernt werden.
* Alte Einträge müssen danach noch händisch gelöscht bzw. wieder zu normalen Links konvertiert werden.


### Video- und Musikdienste (z.B. YouTube, Vimeo, Soundcloud)

* [ ] Einbettungen von sämtlichen Video- und Musikdiensten übertragen bereits beim Laden der Webseite personenbezogene Daten und müssen deshalb über eine 2-Klick-Lösung verfügen. Zudem werden häufig auch Cookies gespeichert.
* [ ] YouTube-Videos können in einen »Erweiterten Datenschutzmodus« geschaltet werden, was aber nur die Speicherung von Cookies verhindert.
* [ ] Vimeo hingegen ist noch nicht einmal im *Privacy Shield* eingetragen.
* [ ] SoundCloud hat zwar ihre Datenschutz-Einstellungen verbessert, erfordert aber dennoch eine 2-Klick-Lösung.

#### Tipps zur Umsetzung

* YouTube-Videos sollten nur im »Erweiterten Datenschutzmodus« erfolgen.
* **Einfachste Lösung**: Video-Vorschauen manuell als Bild einbetten und auf die jeweiligen Plattformen verlinken
* 2-Klick-Lösung für YouTube-Videos mit [WP YouTube Lyte](https://wordpress.org/plugins/wp-youtube-lyte/)
* 2-Klick-Lösung für YouTube- und Vimeo-Videos als Lightbox mit [Responsive YouTube & Vimeo Video Popup](https://wordpress.org/plugins/responsive-youtube-vimeo-popup/)
* 2-Klick-Lösung für **alle** Dienste mit [Borlabs Cookie](https://de.borlabs.io/borlabs-cookie/) (kostenpflichtig)


### Kartendienste (z.B. Google Maps, Open Street Maps, Mapbox, Leaflet)

* [ ] Ebenso wie Video- und Musikdienste werden auch bei Kartendiensten bereits beim Laden der Webseite personenbezogene Daten erhoben. Auch hier bleibt derzeit nur eine 2-Klick-Lösung.

#### Tipps zur Umsetzung

* **Einfachste Lösung**: Kartenausschnitt manuell als Bild einbetten und auf die jeweilige Plattform verlinken.
* Derzeit keine eigenständigen Plugins mit 2-Klick-Lösung vorhanden.
* 2-Klick-Lösung für **alle** Dienste mit [Borlabs Cookie](https://de.borlabs.io/borlabs-cookie/) (kostenpflichtig)

---

## Weitere Aspekte

### Kommentarfunktion

* [ ] Die Speicherung von IP-Adressen in der Kommentarfunktion sollte auf einen minimalen Zeitraum begrenzt (z.B. bis zur Freischaltung zur rechtlichen Absicherung) oder alternativ deaktiviert werden.
* [ ] Vor dem Absenden eines Kommentars (oder jedes anderen Formulars) sollte auf die Speicherung personenbezogenen Daten hingewiesen werden (Opt-In kritisch!).
* [ ] Die Option zum Speichern eines Cookies für das Merken von Name und E-Mail-Adresse sollte abgeschaltet werden (bei WordPress in Arbeit, vgl. [#44373](https://core.trac.wordpress.org/ticket/44373)).

#### Tipps zur Umsetzung

* IP-Adressen vor Freischaltung händisch löschen oder per die Speicherung im (Child-)Theme via `functions.php` ausschließen.
* Hinweistext einfügen - am besten im (Child-)Theme in der `comments.php` oder als Option.


### Weblinks

* [ ] Weblinks zu externen Webseiten sind erst einmal unkritisch. Dennoch sollte in der Datenschutzerklärung darauf hingewiesen werden, dass beim Verlassen der Webseite über einen Link auf der Zielwebseite weitere personenbezogene Daten erhoben werden können.

### Plugins/ Erweiterungen / Module

* [ ] Plugins sollte genaustens überprüft werden, ob und wie personenbezogene Daten erhoben werden (für WordPress vgl. auch [Blogmojo](https://www.blogmojo.de/wordpress-plugins-dsgvo/)).

### Webshop

* [ ] Bei Webshops macht es Sinn, sich das Einverständnis zur Datenerhebung bzw. -verarbeitung zu holen. Es dürfte aber ausreichen, wie bisher ein gemeinsames Häkchen für »ich habe die Allgemeinen Geschäftsbedingungen, die Widerrufsbelehrung und die Datenschutzerklärung gelesen« inkl. entsprechender Verlinkung vor dem »kostenpflichtig kaufen«-Button einzurichten.
* [ ] Bei externen Shop-Lösungen und/ oder externen Zahlungsanbietern sollte **immer** ein Auftragsverarbeitungsvertrag (AVV) abgeschlossen werden.
* [ ] Auch die statistische Erhebung des Kaufverhaltens sollte vertraglich geregelt sein (vgl. Analysetools & Marketingtools)

---

## Rechtsdokumente/ Pflichtangaben

### Allgemein

* [ ] Impressum und Datenschutzerklärung sollten gut sichtbar von jeder Unterseite der Webseite mit maximal 2 Klicks erreichbar sein!
* [ ] Impressum und Datenschutzerklärung sollten auf zwei Unterseiten getrennt zugänglich sein.
* [ ] Sobald Pflichtangaben (z.B. durch einen Cookie-Banner) verdeckt werden, werden sie als »nicht existent« behandelt.
* [ ] Auch eine »weiße Seite« bzw. Baustellen-Seite erfordert in aller Regel diese Pflichtangaben!
* [ ] Auch **frei zugängliche** Login- und Registrierungs-Seiten müssen diese Pflichtangaben enthalten.


### Impressum

* [ ] Das Impressum sollte alle Pflichtangaben gemäß §5 TMG enthalten, dazu gehören (nicht abschließend):
  * Vor- und Zuname oder Firmenname und Geschäftsform sowie ggf. Inhaber
  * Anschrift
  * Telefonnummer (oder Kontaktformular, wenn Reaktionszeit binnen 30 - 60 min.)
  * E-Mail-Adresse
  * USt-ID (oder Hinweis auf Befreiung)
  * Aktuelles Eigenkapital (bei GmbH)
  * Eintrag des Handelsregisters (wenn vorhanden)
* [ ] Sollte die Webseite journalistisch-redaktionelle Inhalte enthalten (z.B. bei einem Weblog), muss auch nach §55 Abs. 2 RStV ein inhaltlich Veranwortlicher mit Name und Adresse angegeben werden.
* [ ] Das Impressum muss barrierefrei sein! Anschrift, Telefonnummer oder Mail-Adresse als Bild oder in kodierter Form sind **nicht** zulässig!
* [ ] Haftungsausschlüsse/ Disclaimer zu Links und Inhalt gehören **nicht** (in verallgemeinerter Form) ins Impressum!
* [ ] Wer es noch nicht verstanden hat: »Das LG Hamburg hat 1998 entschieden...« ist Blödsinn und kann sogar zu Abmahnungen führen!
* [ ] »Keine Abmahnung ohne vorherigen Kontakt« entfaltet keine Wirkung!
* [ ] Ein Hinweis auf das eigene Urheberrecht kann gemacht werden, ist aber in Deutschland nicht zwingend notwendig.
* [ ] Das Impressum ist auch ein schöner Ort, um auf Miturheber wie den Designer, Webentwickler, Font-Ersteller usw. hinzuweisen.
* [ ] Bildnachweise gehören nur dann ins Impressum, wenn sie allgemeingültig für die ganze Webseite sind! (»Sofern nicht anders angegeben...«)


### Datenschutzerklärung

* [ ] Die Datenschutzerklärung (DSE) sollte ausführlich, aber verständlich und durch Rechtsgrundlagen der DSGVO und des BDSG-neu belegt sein.
* [ ] Doppelte DSEs (einmal kurz & verständlich, einmal lang & ausführlich) werden i.d.R. anerkannt (nicht mehr als 2 Klicks!)
* [ ] Die DSE sollte einen Gültigkeitsbereich (z.B. auch andere benannte Webseiten und soziale Medien) sowie ein Aktualisierungdatum enthalten.
* [ ] Die DSE kann durch einen (kostenlosen oder kostenpflichtigen) Generator oder direkt durch einen Anwalt oder Datenschutzbeauftragten erstellt werden.

#### Tipps zur Umsetzung

* Kostenlos für Privatpersonen und Kleinunternehmer ist der [Datenschutz-Generator des RA Dr. Schwenke](https://datenschutz-generator.de) zu empfehlen.
* Darüber hinaus kann der gleich DSG ebenfalls - allerdings kostenpflichtig - genommen werden. Oder aber man nutzt das Abo [...]


### Impressum & Datenschutzerklärung bei sozialen Medien

* [ ] Auch in den sozialen Medien ist Impressum & Datenschutzerklärung anzugeben.
* [ ] Zudem ist in der DSE die DSE des Drittanbieters zu nennen.
* [ ] Bei Facebook-Seiten gibt  mittlerweise zwei Einträge, die man mit Links zum Impressum & der DSE der eigenen Webseite füllen kann.
* [ ] Wo keine direkte Möglichkeit ist, die entsprechenden Links einzutragen, kann mit Short-URLs (**ohne** Tracking!) in den jeweiligen Beschreibungen gearbeitet werden. 


### Urheberrecht / Bildnachweise

* [ ] Beim Verwenden fremder Werke (Bilder, Grafiken, Musik, Videos, Texte, Software, Code) **immer** die dazu gehörigen Lizenzbestimmungen lesen und ggf. laut Vorgaben entsprechende Angaben zum Urheber machen!
* [ ] Egal ob Groß- oder Kleinzitat: Werke sind nur dann Zitate, wenn man sie damit auch inhaltlich detailliert auseinander setzt. Für schmückende Beigaben nur Werke mit einer entsprechenden Lizenz (z.B. Creative Commons oder CC0/ Public Domain) nutzen!
* [ ] Der Bildnachweis gehört **immer** direkt unter das Bild! Manche Stock-Agenturen verlagen sogar, den Bildnachweis **im** Bild anzubringen. Einzige Ausnahme (weil gängige Praxis): Bilder, die unter der entsprechenden freien Lizenz (z.B. CC0) **ohne Namensnennung** auskommen und sich über die gesamte Webseite erstrecken, können auch einmalig im Impressum benannt werden.
* [ ] Bilder (und andere fremde Werke) dürfen ohne entsprechenden Verwertungsrechten auch nicht bearbeitet werden!
* [ ] Metadaten (EXIF, IPTC, Wasserzeichen) dürfen aus **fremden** Bildern ohne entsprechende Einwilligung des Urhebers **nicht** entfernt werden (Bildbearbeitung & Aberkennung der Urheberschaft)!

