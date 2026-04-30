class SoftwareLayerVisualizer {
    constructor() {
        this.currentMission = 0;
        this.completedMissions = new Set();
        this.exploredLayers = new Set();
        this.selectedAssignItem = null;

        // ===== GLOSSARY DATA =====
        this.glossary = [
            {
                term: 'Hardware',
                definition: 'Alle physischen Bestandteile eines Computers, die man anfassen kann - z.\u00a0B. Prozessor, Festplatte, Bildschirm oder Drucker.',
                example: 'Beispiele: Tastatur, Maus, Grafikkarte, USB-Stick'
            },
            {
                term: 'Treiber',
                definition: 'Ein kleines Programm, das dem Betriebssystem erklärt, wie es mit einem bestimmten Hardware-Gerät kommunizieren soll.',
                example: 'Beispiele: Druckertreiber, Grafikkartentreiber, Soundtreiber'
            },
            {
                term: 'Betriebssystem',
                definition: 'Die grundlegende Software, die den Computer verwaltet. Es startet Programme, verwaltet Dateien und steuert die Hardware über Treiber.',
                example: 'Beispiele: Windows, macOS, Linux, Android, iOS'
            },
            {
                term: 'Anwendersoftware',
                definition: 'Programme, die du direkt benutzt, um Aufgaben zu erledigen - Texte schreiben, im Internet surfen, Musik hören oder Spiele spielen.',
                example: 'Beispiele: Microsoft Word, Firefox, Spotify, Minecraft'
            },
            {
                term: 'Systemsoftware',
                definition: 'Software, die im Hintergrund arbeitet und den Computer am Laufen hält. Dazu gehören das Betriebssystem und die Treiber.',
                example: 'Beispiele: Windows (Betriebssystem), Grafiktreiber, Antivirusprogramm'
            },
            {
                term: 'Schnittstelle',
                definition: 'Ein Verbindungspunkt, an dem zwei Systeme miteinander kommunizieren. Es gibt Hardware-Schnittstellen (z.\u00a0B. USB-Anschluss) und Software-Schnittstellen.',
                example: 'Beispiele: USB-Anschluss, HDMI-Port, Bluetooth'
            },
            {
                term: 'Kernel',
                definition: 'Der innerste Kern des Betriebssystems. Er steuert die Hardware direkt und verteilt Rechenzeit und Speicher an Programme.',
                example: 'Der Linux-Kernel ist der Kern von Linux, Android und Chrome OS.'
            },
            {
                term: 'Prozessor (CPU)',
                definition: 'Die Central Processing Unit (CPU) ist das Rechenwerk und Steuerwerk des Computers in einem Bauteil. Sie führt alle Berechnungen durch und steuert den Ablauf der Programme.',
                example: 'Beispiele: Intel Core i7, AMD Ryzen 5, Apple M2'
            },
            {
                term: 'Arbeitsspeicher (RAM)',
                definition: 'Der Random Access Memory (RAM) ist der schnelle Zwischenspeicher des Computers. Er speichert die Daten und Programme, die gerade benutzt werden. Beim Ausschalten gehen alle Inhalte verloren (flüchtig).',
                example: 'Typische Größen: 8 GB oder 16 GB RAM in modernen Computern.'
            }
        ];

        // ===== LAYER DETAIL DATA =====
        this.layerDetails = {
            hardware: {
                icon: '🖥️',
                title: 'Hardware',
                description: 'Hardware sind alle Teile eines Computers, die du anfassen kannst. Ohne Hardware wäre ein Computer nur eine Idee - die Hardware ist das physische Gerät.',
                examples: ['Prozessor (CPU) - das „Gehirn" des Computers', 'Festplatte / SSD - speichert alle Daten', 'Grafikkarte - erzeugt das Bild auf dem Monitor', 'Drucker, Maus, Tastatur, Bildschirm']
            },
            driver: {
                icon: '🔧',
                title: 'Treiber',
                description: 'Ein Treiber ist ein kleines Programm, das als Übersetzer zwischen der Hardware und dem Betriebssystem arbeitet. Jedes Hardware-Gerät braucht einen passenden Treiber, damit das Betriebssystem es nutzen kann.',
                examples: ['Druckertreiber - damit der Drucker drucken kann', 'Grafikkartentreiber - damit Spiele flüssig laufen', 'Soundtreiber - damit Ton aus den Lautsprechern kommt', 'USB-Treiber - damit USB-Geräte erkannt werden']
            },
            os: {
                icon: '⚙️',
                title: 'Betriebssystem',
                description: 'Das Betriebssystem (kurz: BS oder OS) ist die wichtigste Software auf deinem Computer. Es verwaltet die Hardware, startet Programme und sorgt dafür, dass alles zusammenarbeitet. Ohne Betriebssystem könntest du keine Anwendersoftware nutzen.',
                examples: ['Windows - das häufigste BS auf PCs', 'macOS - das BS auf Apple-Computern', 'Linux - ein freies, quelloffenes BS', 'Android - das BS auf den meisten Smartphones', 'iOS - das BS auf iPhones']
            },
            app: {
                icon: '📱',
                title: 'Anwendersoftware',
                description: 'Anwendersoftware (auch: Anwendungsprogramme oder Apps) sind die Programme, die du direkt benutzt. Sie laufen auf dem Betriebssystem und erledigen bestimmte Aufgaben für dich.',
                examples: ['Microsoft Word / LibreOffice - Texte schreiben', 'Firefox / Chrome - im Internet surfen', 'Spotify - Musik hören', 'Minecraft - Spiele spielen', 'WhatsApp - Nachrichten schreiben']
            }
        };

        // ===== MISSION DEFINITIONS =====
        this.missions = [
            {
                title: '🔗 Begriffe verbinden',
                text: 'Verbinde die zusammengehörenden Satzteile korrekt! Klicke zuerst auf einen <strong>Satzanfang</strong> (links) und dann auf das passende <strong>Satzende</strong> (rechts).',
                format: 'matching',
                data: {
                    pairs: [
                        { left: 'Windows ist', right: 'ein Betriebssystem.' },
                        { left: 'Spotify ist', right: 'eine Anwendersoftware.' },
                        { left: 'Ein Druckertreiber ist', right: 'ein Übersetzer zwischen Betriebssystem und Drucker.' },
                        { left: 'Eine Maus gehört zur', right: 'Hardware.' },
                        { left: 'Ohne Betriebssystem lässt sich', right: 'keine Anwendersoftware starten.' },
                        { left: 'USB und HDMI sind', right: 'Schnittstellen am Computer.' }
                    ]
                },
                check: () => this._matchingCorrect,
                success: 'Stark! Du hast wichtige Begriffe rund um Hard- und Software korrekt verbunden.',
                timer: 5
            },
            {
                title: '🔍 Entdecke die Schichten',
                text: 'Willkommen! Klicke oben im <strong>Schichtenmodell</strong> auf jede der vier Schichten und lies dir die Erklärungen durch. Sobald du alle vier Schichten entdeckt hast, ist die Mission geschafft!',
                format: 'exploration',
                check: () => this.exploredLayers.size >= 4,
                success: 'Super! Du kennst jetzt die vier Schichten: Hardware, Treiber, Betriebssystem und Anwendersoftware. Jede Schicht baut auf der darunterliegenden auf!',
                timer: 5
            },
            {
                title: '🏷️ Was gehört wohin?',
                text: 'Ordne die Begriffe der richtigen Schicht zu! Klicke zuerst auf einen <strong>Begriff</strong> und dann auf die passende <strong>Schicht</strong>.',
                format: 'assignment',
                data: {
                    items: [
                        { label: 'Windows', target: 'os' },
                        { label: 'Druckertreiber', target: 'driver' },
                        { label: 'Microsoft Word', target: 'app' },
                        { label: 'Grafikkarte', target: 'hardware' },
                        { label: 'Firefox', target: 'app' },
                        { label: 'Grafiktreiber', target: 'driver' },
                        { label: 'Linux', target: 'os' },
                        { label: 'Spotify', target: 'app' },
                        { label: 'Festplatte', target: 'hardware' },
                        { label: 'Soundtreiber', target: 'driver' }
                    ],
                    targets: [
                        { id: 'app', label: '📱 Anwendersoftware' },
                        { id: 'os', label: '⚙️ Betriebssystem' },
                        { id: 'driver', label: '🔧 Treiber' },
                        { id: 'hardware', label: '🖥️ Hardware' }
                    ]
                },
                check: () => this._assignmentAllCorrect,
                success: 'Perfekt! Du kannst die vier Kategorien sicher unterscheiden. Hardware ist physisch, Treiber übersetzen, das Betriebssystem verwaltet, und Anwendersoftware nutzt du direkt.',
                timer: 5
            },
            {
                title: '✅ Richtig oder Falsch?',
                text: 'Entscheide bei jeder Aussage, ob sie <strong>richtig</strong> oder <strong>falsch</strong> ist. Du brauchst mindestens <strong>6 von 8</strong> richtig.',
                format: 'truefalse',
                data: [
                    { statement: 'Ein Treiber ist ein Programm, das die Kommunikation zwischen Hardware und Betriebssystem ermöglicht.', answer: true, explanation: 'Der Treiber übersetzt zwischen Hardware-Gerät und Betriebssystem.' },
                    { statement: 'Microsoft Word ist ein Betriebssystem.', answer: false, explanation: 'Word ist eine Anwendersoftware. Betriebssysteme sind z.\u00a0B. Windows oder Linux.' },
                    { statement: 'Ohne Betriebssystem kann man keine Anwendersoftware starten.', answer: true, explanation: 'Das Betriebssystem muss zuerst laufen, damit Programme gestartet werden können.' },
                    { statement: 'Ein Drucker funktioniert auch ohne Treiber ganz normal.', answer: false, explanation: 'Ohne den passenden Treiber kann das Betriebssystem nicht mit dem Drucker kommunizieren.' },
                    { statement: 'Android ist ein Betriebssystem für Smartphones.', answer: true, explanation: 'Android ist das am weitesten verbreitete Smartphone-Betriebssystem.' },
                    { statement: 'Ein Treiber ist eine Anwendersoftware, die man im App-Store kauft.', answer: false, explanation: 'Treiber sind Systemsoftware und werden meist vom Hersteller der Hardware mitgeliefert oder automatisch installiert.' },
                    { statement: 'Eine Grafikkarte gehört zur Hardware.', answer: true, explanation: 'Die Grafikkarte ist ein physisches Bauteil des Computers und damit Hardware.' },
                    { statement: 'Treiber werden nur für Drucker benötigt.', answer: false, explanation: 'Auch Grafikkarten, Soundkarten, Netzwerkkarten und viele andere Geräte benötigen passende Treiber.' }
                ],
                threshold: 6,
                check: () => this._tfScore >= 6,
                success: 'Stark! Du hast die wichtigsten Fakten über Hard- und Software verstanden.',
                timer: 4
            },
            {
                title: '🧩 Beispiele zuordnen',
                text: 'Ordne die Beispiele der passenden <strong>Kategorie</strong> zu! Klicke zuerst auf ein <strong>Beispiel</strong> (links) und dann auf die passende <strong>Beschreibung</strong> (rechts).',
                format: 'matching',
                data: {
                    pairs: [
                        { left: 'Android', right: 'ist ein Betriebssystem.' },
                        { left: 'Grafikkartentreiber', right: 'ist ein Treiber.' },
                        { left: 'Minecraft', right: 'ist eine Anwendersoftware.' },
                        { left: 'Tastatur', right: 'ist Hardware.' },
                        { left: 'HDMI', right: 'ist eine Schnittstelle.' }
                    ]
                },
                check: () => this._matchingCorrect,
                success: 'Super! Du kannst typische Beispiele jetzt sicher den richtigen Bereichen zuordnen.',
                timer: 5
            },
            {
                title: '🧩 Das Schichten-Puzzle',
                text: 'Bringe die vier Schichten in die <strong>richtige Reihenfolge</strong> - von <strong>oben</strong> (Nutzer) nach <strong>unten</strong> (Gerät). Nutze die Pfeile zum Verschieben.',
                format: 'sorting',
                data: {
                    items: [
                        { id: 'driver', label: '🔧 Treiber' },
                        { id: 'app', label: '📱 Anwendersoftware' },
                        { id: 'hardware', label: '🖥️ Hardware' },
                        { id: 'os', label: '⚙️ Betriebssystem' }
                    ],
                    correctOrder: ['app', 'os', 'driver', 'hardware']
                },
                check: () => this._sortingCorrect,
                success: 'Genau richtig! Die Reihenfolge von oben nach unten: Anwendersoftware → Betriebssystem → Treiber → Hardware. Jede Schicht baut auf der darunterliegenden auf.',
                timer: 4
            },
            {
                title: '🧠 Experten-Quiz',
                text: 'Beantworte die Fragen - <strong>immer nur eine Antwort</strong> ist richtig. Du brauchst mindestens <strong>5 von 6</strong>!',
                format: 'singlechoice',
                data: [
                    {
                        question: 'Welche Aufgabe hat ein Betriebssystem?',
                        options: ['Hardware verwalten und Programme starten', 'Texte schreiben und drucken', 'Drucker bauen', 'Videos schneiden'],
                        correct: 0,
                        explanation: 'Das Betriebssystem verwaltet die Hardware und startet Programme - es ist die Schaltzentrale.'
                    },
                    {
                        question: 'Was ist ein Beispiel für Anwendersoftware?',
                        options: ['Windows', 'Grafikkartentreiber', 'Microsoft PowerPoint', 'BIOS'],
                        correct: 2,
                        explanation: 'PowerPoint ist eine Anwendersoftware. Windows ist ein Betriebssystem, der Grafikkartentreiber ist Systemsoftware.'
                    },
                    {
                        question: 'Was passiert, wenn der Druckertreiber fehlt?',
                        options: ['Der Drucker druckt schneller', 'Der Computer kann nicht mit dem Drucker kommunizieren', 'Das Betriebssystem stürzt ab', 'Word funktioniert nicht mehr'],
                        correct: 1,
                        explanation: 'Ohne Treiber versteht das Betriebssystem die „Sprache" des Druckers nicht - die Kommunikation funktioniert nicht.'
                    },
                    {
                        question: 'Welches davon ist KEIN Betriebssystem?',
                        options: ['Windows', 'Excel', 'Linux', 'macOS'],
                        correct: 1,
                        explanation: 'Excel ist eine Anwendersoftware (Tabellenkalkulation). Windows, Linux und macOS sind Betriebssysteme.'
                    },
                    {
                        question: 'Wer „übersetzt" zwischen Hardware und Betriebssystem?',
                        options: ['Die Anwendersoftware', 'Der Treiber', 'Der Benutzer', 'Das Internet'],
                        correct: 1,
                        explanation: 'Der Treiber ist der Übersetzer zwischen Hardware und Betriebssystem.'
                    },
                    {
                        question: 'Warum braucht eine App wie Word das Betriebssystem?',
                        options: ['Weil das Betriebssystem Hardware, Dateien und Programmstarts verwaltet', 'Weil das Betriebssystem den Monitor baut', 'Weil das Betriebssystem die Maus ersetzt', 'Weil das Betriebssystem das Internet speichert'],
                        correct: 0,
                        explanation: 'Anwendersoftware nutzt die Dienste des Betriebssystems, damit sie auf Hardware, Dateien und andere Systemfunktionen zugreifen kann.'
                    }
                ],
                threshold: 5,
                check: () => this._scScore >= 5,
                success: 'Hervorragend! Du hast das Experten-Quiz gemeistert!',
                timer: 4
            },
            {
                title: '🔎 Alltagsdetektiv',
                text: 'Hier können <strong>mehrere Antworten</strong> richtig sein! Kreuze alle richtigen an und klicke dann auf „Prüfen". Du brauchst mindestens <strong>3 von 4</strong> Fragen komplett richtig.',
                format: 'multiplechoice',
                data: [
                    {
                        question: 'Welche davon sind Betriebssysteme?',
                        options: [
                            { text: 'Windows', correct: true },
                            { text: 'Android', correct: true },
                            { text: 'Word', correct: false },
                            { text: 'Linux', correct: true },
                            { text: 'Spotify', correct: false }
                        ]
                    },
                    {
                        question: 'Welche Aufgaben hat ein Betriebssystem?',
                        options: [
                            { text: 'Dateien verwalten', correct: true },
                            { text: 'Hardware ansprechen', correct: true },
                            { text: 'Texte formatieren', correct: false },
                            { text: 'Programme starten', correct: true }
                        ]
                    },
                    {
                        question: 'Welche davon sind Anwendersoftware?',
                        options: [
                            { text: 'Spotify', correct: true },
                            { text: 'Windows', correct: false },
                            { text: 'Firefox', correct: true },
                            { text: 'Minecraft', correct: true },
                            { text: 'Soundtreiber', correct: false }
                        ]
                    },
                    {
                        question: 'Welche Aussagen über Treiber stimmen?',
                        options: [
                            { text: 'Werden für jedes Hardware-Gerät benötigt', correct: true },
                            { text: 'Sind immer kostenpflichtig', correct: false },
                            { text: 'Ermöglichen Kommunikation mit Hardware', correct: true },
                            { text: 'Sind dasselbe wie Apps', correct: false }
                        ]
                    }
                ],
                threshold: 3,
                check: () => this._mcScore >= 3,
                success: 'Klasse! Du kannst differenziert zwischen den verschiedenen Software-Arten unterscheiden.',
                timer: 4
            },
            {
                title: '🛤️ Der Kommunikationsweg',
                text: 'Stell dir vor, du klickst in <strong>Word auf „Drucken"</strong>. Klicke die Schritte unten <strong>in der richtigen Reihenfolge</strong> an, um den Weg des Druckauftrags durch die Schichten nachzuvollziehen!',
                format: 'scenario',
                data: {
                    steps: [
                        { id: 'app', label: '📱 Anwendersoftware - Word gibt den Druckbefehl' },
                        { id: 'os', label: '⚙️ Betriebssystem - Windows leitet den Auftrag weiter' },
                        { id: 'driver', label: '🔧 Treiber - Der Druckertreiber übersetzt für den Drucker' },
                        { id: 'hardware', label: '🖥️ Hardware - Der Drucker druckt das Dokument' }
                    ],
                    correctOrder: ['app', 'os', 'driver', 'hardware']
                },
                check: () => this._scenarioComplete,
                success: 'Perfekt! Du hast den Kommunikationsweg verstanden: Anwendersoftware → Betriebssystem → Treiber → Hardware. So fließen alle Befehle durch die Schichten!',
                timer: 5
            },
            {
                title: '🏆 Meisterprüfung',
                text: 'Fülle die Lücken im Text aus, indem du jeweils den <strong>richtigen Begriff</strong> aus der Liste wählst. Alle Lücken müssen korrekt sein!',
                format: 'cloze',
                data: {
                    // Segments: plain text strings alternate with gap objects
                    segments: [
                        'Das ',
                        { id: 0, correct: 'Betriebssystem', options: ['Betriebssystem', 'Treiber', 'Anwendersoftware', 'Hardware'] },
                        ' verwaltet die Hardware eines Computers und startet Programme. Damit ein Drucker funktioniert, benötigt man einen passenden ',
                        { id: 1, correct: 'Treiber', options: ['Treiber', 'Browser', 'Bildschirm', 'Betriebssystem'] },
                        '. Programme wie Word oder Spotify nennt man ',
                        { id: 2, correct: 'Anwendersoftware', options: ['Anwendersoftware', 'Treiber', 'Hardware', 'Systemsoftware'] },
                        '. Ohne ein Betriebssystem könnte man keine ',
                        { id: 3, correct: 'Anwendersoftware', options: ['Hardware', 'Anwendersoftware', 'Festplatte', 'Treiber'] },
                        ' starten. Ein Treiber ermöglicht die Kommunikation zwischen ',
                        { id: 4, correct: 'Hardware', options: ['Hardware', 'Spielen', 'Internet', 'Apps'] },
                        ' und Betriebssystem. Die Tastatur, die Maus und der Bildschirm gehören zur ',
                        { id: 5, correct: 'Hardware', options: ['Anwendersoftware', 'Hardware', 'Treiber', 'Software'] },
                        ' eines Computers.'
                    ]
                },
                check: () => this._clozeCorrect,
                success: '🎉 Herzlichen Glückwunsch! Du bist jetzt ein Software-Schichten-Experte! Du verstehst den Unterschied zwischen Betriebssystem, Treiber und Anwendersoftware - und wie sie zusammenarbeiten! 🏆',
                timer: 8
            }
        ];

        // Runtime state per exercise
        this._assignmentAllCorrect = false;
        this._tfScore = 0;
        this._sortingCorrect = false;
        this._scScore = 0;
        this._mcScore = 0;
        this._scenarioComplete = false;
        this._clozeCorrect = false;
        this._matchingCorrect = false;

        this.init();
    }

    // ===========================
    //  INIT
    // ===========================
    init() {
        this.bindEvents();
        this.createMissionButtons();
        this.updateMission();
        this.renderGlossaryModal();
        this.initExploration();
    }

    bindEvents() {
        // Layer model clicks
        document.querySelectorAll('.layer').forEach(el => {
            el.addEventListener('click', () => this.showLayerDetail(el.dataset.layer));
        });
        document.getElementById('close-detail').addEventListener('click', () => {
            document.getElementById('layer-detail').style.display = 'none';
            document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
        });

        // Glossary modal
        document.getElementById('open-glossary').addEventListener('click', () => {
            document.getElementById('glossary-modal').classList.add('active');
        });
        document.getElementById('close-glossary').addEventListener('click', () => {
            document.getElementById('glossary-modal').classList.remove('active');
        });
        document.getElementById('glossary-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
        });

        // Inline glossary popup close
        document.getElementById('close-popup').addEventListener('click', () => {
            document.getElementById('glossary-popup').style.display = 'none';
        });
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('glossary-popup');
            if (popup.style.display !== 'none' && !popup.contains(e.target) && !e.target.classList.contains('glossary-term')) {
                popup.style.display = 'none';
            }
        });

        // Mission continue
        document.getElementById('continue-mission').addEventListener('click', () => this.nextMission());

        // Close mission modal on overlay click
        document.getElementById('mission-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                // only close if continue button is visible
                const btn = document.getElementById('continue-mission');
                if (btn.style.display !== 'none') this.nextMission();
            }
        });
    }

    // ===========================
    //  LAYER MODEL
    // ===========================
    showLayerDetail(layerId) {
        const data = this.layerDetails[layerId];
        if (!data) return;

        // Mark explored
        this.exploredLayers.add(layerId);
        document.querySelector(`.layer[data-layer="${layerId}"]`).classList.add('explored');

        // Highlight active layer
        document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
        document.querySelector(`.layer[data-layer="${layerId}"]`).classList.add('active');

        // Fill detail panel
        document.getElementById('detail-icon').textContent = data.icon;
        document.getElementById('detail-title').textContent = data.title;
        document.getElementById('detail-description').textContent = data.description;
        const exList = document.getElementById('detail-examples');
        exList.innerHTML = data.examples.map(e => `<li>${e}</li>`).join('');

        document.getElementById('layer-detail').style.display = 'block';

        // Check if mission is completed
        this.checkMission();
    }

    // ===========================
    //  GLOSSARY
    // ===========================
    renderGlossaryModal() {
        const container = document.getElementById('glossary-list');
        container.innerHTML = this.glossary.map(g => `
            <div class="glossary-entry">
                <div class="glossary-entry-term">${g.term}</div>
                <div class="glossary-entry-def">${g.definition}</div>
            </div>
        `).join('');
    }

    showGlossaryPopup(term, anchorEl) {
        const entry = this.glossary.find(g => g.term.toLowerCase() === term.toLowerCase());
        if (!entry) return;
        const popup = document.getElementById('glossary-popup');
        document.getElementById('popup-term').textContent = entry.term;
        document.getElementById('popup-definition').textContent = entry.definition;
        document.getElementById('popup-example').textContent = entry.example;

        popup.style.display = 'block';
        // Position near anchor
        const rect = anchorEl.getBoundingClientRect();
        let top = rect.bottom + 8;
        let left = rect.left;
        // Keep in viewport
        if (left + 340 > window.innerWidth) left = window.innerWidth - 350;
        if (left < 8) left = 8;
        if (top + 200 > window.innerHeight) top = rect.top - 210;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }

    // ===========================
    //  ERKUNDUNGSBEREICH
    // ===========================
    initExploration() {
        this.renderScenarioWorkshop();
        this.renderCompareTable();
        this.renderPortQuiz();
    }

    // --- Szenarien-Werkstatt ---
    renderScenarioWorkshop() {
        const selectorEl = document.getElementById('scenario-selector');
        const walkthroughEl = document.getElementById('scenario-walkthrough');
        if (!selectorEl || !walkthroughEl) return;

        const scenarios = [
            {
                id: 'print', label: '🖨️ Dokument drucken',
                steps: [
                    { icon: '📱', layer: 'Anwendersoftware', text: 'Du klickst in <strong>Word</strong> auf „Drucken".', detail: 'Word erstellt einen Druckauftrag und gibt ihn an das Betriebssystem weiter.' },
                    { icon: '⚙️', layer: 'Betriebssystem', text: '<strong>Windows</strong> nimmt den Druckauftrag entgegen.', detail: 'Das Betriebssystem prüft, welcher Drucker angeschlossen ist, und leitet den Auftrag an den passenden Treiber.' },
                    { icon: '🔧', layer: 'Treiber', text: 'Der <strong>Druckertreiber</strong> übersetzt den Auftrag.', detail: 'Der Treiber wandelt den Druckauftrag in eine Sprache um, die genau dein Drucker-Modell versteht.' },
                    { icon: '🖥️', layer: 'Hardware', text: 'Der <strong>Drucker</strong> druckt das Dokument.', detail: 'Die Hardware führt den Befehl aus: Papier wird eingezogen, Tinte aufgetragen, das Blatt kommt heraus.' }
                ]
            },
            {
                id: 'music', label: '🎵 Musik abspielen',
                steps: [
                    { icon: '📱', layer: 'Anwendersoftware', text: 'Du drückst „Play" in <strong>Spotify</strong>.', detail: 'Spotify dekodiert die Musikdatei und gibt die Audiodaten an das Betriebssystem weiter.' },
                    { icon: '⚙️', layer: 'Betriebssystem', text: '<strong>Windows</strong> empfängt die Audiodaten.', detail: 'Das Betriebssystem verwaltet den Audio-Ausgang und leitet die Daten an den Soundtreiber.' },
                    { icon: '🔧', layer: 'Treiber', text: 'Der <strong>Soundtreiber</strong> übersetzt die Daten.', detail: 'Der Treiber wandelt die digitalen Audiodaten in ein Format um, das die Soundkarte verarbeiten kann.' },
                    { icon: '🖥️', layer: 'Hardware', text: 'Die <strong>Lautsprecher</strong> spielen den Ton ab.', detail: 'Die Soundkarte erzeugt elektrische Signale, die von den Lautsprechern in Schallwellen umgewandelt werden.' }
                ]
            },
            {
                id: 'web', label: '🌐 Website öffnen',
                steps: [
                    { icon: '📱', layer: 'Anwendersoftware', text: 'Du tippst eine Adresse in <strong>Firefox</strong> ein.', detail: 'Der Browser bereitet eine Anfrage vor und bittet das Betriebssystem, eine Netzwerkverbindung herzustellen.' },
                    { icon: '⚙️', layer: 'Betriebssystem', text: '<strong>Windows</strong> stellt die Netzwerkverbindung her.', detail: 'Das Betriebssystem verwaltet die Netzwerkprotokolle (TCP/IP) und leitet die Anfrage an den Netzwerktreiber.' },
                    { icon: '🔧', layer: 'Treiber', text: 'Der <strong>Netzwerktreiber</strong> sendet die Daten.', detail: 'Der Treiber steuert die WLAN- oder LAN-Karte, damit die Datenpakete korrekt gesendet und empfangen werden.' },
                    { icon: '🖥️', layer: 'Hardware', text: 'Die <strong>Netzwerkkarte</strong> überträgt die Daten.', detail: 'Die Hardware sendet Funksignale (WLAN) oder elektrische Signale (LAN-Kabel) zum Router und empfängt die Antwort.' }
                ]
            },
            {
                id: 'photo', label: '📸 Foto speichern',
                steps: [
                    { icon: '📱', layer: 'Anwendersoftware', text: 'Du klickst „Speichern" in einer <strong>Foto-App</strong>.', detail: 'Die App teilt dem Betriebssystem mit, dass eine Datei auf die Festplatte geschrieben werden soll.' },
                    { icon: '⚙️', layer: 'Betriebssystem', text: '<strong>Windows</strong> verwaltet das Dateisystem.', detail: 'Das Betriebssystem sucht freien Speicherplatz, erstellt einen Dateieintrag und leitet die Schreiboperation weiter.' },
                    { icon: '🔧', layer: 'Treiber', text: 'Der <strong>Festplattentreiber</strong> steuert den Speicher.', detail: 'Der Treiber übersetzt den Schreibbefehl in die konkrete Ansteuerung der SSD oder Festplatte.' },
                    { icon: '🖥️', layer: 'Hardware', text: 'Die <strong>SSD/Festplatte</strong> speichert die Daten.', detail: 'Die Hardware schreibt die Nullen und Einsen physisch auf den Speicherchip oder die Magnetplatte.' }
                ]
            }
        ];

        // Render selector buttons
        selectorEl.innerHTML = scenarios.map(s =>
            `<button class="scenario-select-btn" data-scenario="${s.id}">${s.label}</button>`
        ).join('');

        let currentStep = 0;

        const renderWalkthrough = (scenario) => {
            currentStep = 0;
            walkthroughEl.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'sw-step-container';

            scenario.steps.forEach((step, idx) => {
                if (idx > 0) {
                    const arrow = document.createElement('div');
                    arrow.className = 'sw-arrow-down';
                    arrow.id = `sw-arrow-${idx}`;
                    arrow.textContent = '▼';
                    container.appendChild(arrow);
                }
                const stepEl = document.createElement('div');
                stepEl.className = 'sw-step';
                stepEl.id = `sw-step-${idx}`;
                stepEl.innerHTML = `
                    <span class="sw-step-num">${idx + 1}</span>
                    <div>
                        <div class="sw-step-text">${step.icon} <strong>${step.layer}</strong> - ${step.text}</div>
                        <div class="sw-step-detail">${step.detail}</div>
                    </div>`;
                container.appendChild(stepEl);
            });
            walkthroughEl.appendChild(container);

            // Navigation
            const nav = document.createElement('div');
            nav.className = 'sw-nav';
            nav.innerHTML = `
                <button class="sw-nav-btn" id="sw-prev">← Zurück</button>
                <button class="sw-nav-btn" id="sw-next">Weiter →</button>
                <span class="sw-nav-info" id="sw-info"></span>`;
            walkthroughEl.appendChild(nav);

            const updateSteps = () => {
                scenario.steps.forEach((_, idx) => {
                    const el = document.getElementById(`sw-step-${idx}`);
                    el.classList.toggle('visible', idx <= currentStep);
                    el.classList.toggle('current-sw', idx === currentStep);
                    if (idx > 0) {
                        document.getElementById(`sw-arrow-${idx}`).classList.toggle('visible', idx <= currentStep);
                    }
                });
                document.getElementById('sw-prev').disabled = currentStep === 0;
                document.getElementById('sw-next').disabled = currentStep >= scenario.steps.length - 1;
                document.getElementById('sw-info').textContent = `Schritt ${currentStep + 1} / ${scenario.steps.length}`;
            };

            document.getElementById('sw-prev').addEventListener('click', () => {
                if (currentStep > 0) { currentStep--; updateSteps(); }
            });
            document.getElementById('sw-next').addEventListener('click', () => {
                if (currentStep < scenario.steps.length - 1) { currentStep++; updateSteps(); }
            });
            updateSteps();
        };

        selectorEl.querySelectorAll('.scenario-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectorEl.querySelectorAll('.scenario-select-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const scenario = scenarios.find(s => s.id === btn.dataset.scenario);
                renderWalkthrough(scenario);
            });
        });

        // Auto-select first scenario
        selectorEl.querySelector('.scenario-select-btn').click();
    }
    renderPortQuiz() {
        const area = document.getElementById('port-quiz-area');
        if (!area) return;

        const ports = [
            { id: 'usb-a-2', label: 'USB-A 2.0', img: '../assets/images/ports/usb-a-2.svg' },
            { id: 'usb-a-3', label: 'USB-A 3.0', img: '../assets/images/ports/usb-a-3.svg' },
            { id: 'usb-c', label: 'USB-C', img: '../assets/images/ports/usb-c.svg' },
            { id: 'displayport', label: 'DisplayPort', img: '../assets/images/ports/displayport.svg' },
            { id: 'hdmi', label: 'HDMI', img: '../assets/images/ports/hdmi.svg' },
            { id: 'dvi', label: 'DVI', img: '../assets/images/ports/dvi.svg' },
            { id: 'vga', label: 'VGA', img: '../assets/images/ports/vga.svg' },
            { id: 'rj45', label: 'RJ45 (Netzwerk)', img: '../assets/images/ports/rj45.svg' },
            { id: 'audio', label: 'Audio (3,5 mm)', img: '../assets/images/ports/audio.svg' },
            { id: 'ps2', label: 'PS/2', img: '../assets/images/ports/ps2.svg' }
        ];

        // Shuffle images order
        const shuffledPorts = [...ports].sort(() => Math.random() - 0.5);
        // Shuffle labels independently
        const shuffledLabels = [...ports].sort(() => Math.random() - 0.5);

        const assigned = {}; // portId -> label
        let selectedLabel = null;

        const pairColors = [
            '#388bfd', '#e5534b', '#57ab5a', '#c69026',
            '#b083f0', '#39c5cf', '#e0823d', '#6cb6ff',
            '#d63384', '#20c997'
        ];
        let colorIdx = 0;
        const portColorMap = {}; // portId -> color

        const render = () => {
            // Remove only label bar and grid, keep buttons
            const oldBar = area.querySelector('.port-label-bar');
            const oldGrid = area.querySelector('.port-grid');
            if (oldBar) oldBar.remove();
            if (oldGrid) oldGrid.remove();
            // Insert before button row
            const btnRowEl = area.querySelector('.port-btn-row');

            // Label chips
            const labelBar = document.createElement('div');
            labelBar.className = 'port-label-bar';
            shuffledLabels.forEach(port => {
                const chip = document.createElement('span');
                chip.className = 'port-label-chip';
                chip.textContent = port.label;
                const isUsed = Object.values(assigned).some(a => a.id === port.id);
                if (isUsed) {
                    chip.classList.add('used');
                    const c = portColorMap[port.id];
                    if (c) {
                        chip.style.borderColor = c;
                        chip.style.boxShadow = `inset 0 -3px 0 ${c}`;
                    }
                }
                if (selectedLabel && selectedLabel.id === port.id) chip.classList.add('selected');
                chip.addEventListener('click', () => {
                    if (isUsed) return;
                    selectedLabel = port;
                    render();
                });
                labelBar.appendChild(chip);
            });
            if (btnRowEl) {
                area.insertBefore(labelBar, btnRowEl);
            } else {
                area.appendChild(labelBar);
            }

            // Image grid
            const grid = document.createElement('div');
            grid.className = 'port-grid';
            shuffledPorts.forEach(port => {
                const card = document.createElement('div');
                card.className = 'port-card';

                const img = document.createElement('img');
                img.src = port.img;
                img.alt = 'Schnittstelle';
                img.draggable = false;
                card.appendChild(img);

                if (assigned[port.id]) {
                    card.classList.add('assigned');
                    const c = portColorMap[port.id];
                    if (c) {
                        card.style.borderColor = c;
                        card.style.boxShadow = `0 0 0 3px ${c}40`;
                    }
                    const badge = document.createElement('div');
                    badge.className = 'port-badge';
                    badge.textContent = assigned[port.id].label;
                    if (c) badge.style.background = c;
                    card.appendChild(badge);
                }

                card.addEventListener('click', () => {
                    if (!selectedLabel) return;
                    if (assigned[port.id]) return;
                    portColorMap[port.id] = pairColors[colorIdx % pairColors.length];
                    portColorMap[selectedLabel.id] = portColorMap[port.id];
                    colorIdx++;
                    assigned[port.id] = selectedLabel;
                    selectedLabel = null;
                    render();
                    if (Object.keys(assigned).length === ports.length) {
                        checkBtn.style.display = 'inline-block';
                    }
                });
                grid.appendChild(card);
            });
            if (btnRowEl) {
                area.insertBefore(grid, btnRowEl);
            } else {
                area.appendChild(grid);
            }
        };

        // Button row (created once, outside render cycle)
        const btnRow = document.createElement('div');
        btnRow.className = 'port-btn-row';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'matching-reset-btn';
        resetBtn.textContent = '\u21ba Zur\u00fccksetzen';
        resetBtn.addEventListener('click', () => {
            Object.keys(assigned).forEach(k => delete assigned[k]);
            Object.keys(portColorMap).forEach(k => delete portColorMap[k]);
            colorIdx = 0;
            selectedLabel = null;
            checkBtn.style.display = 'none';
            const fb = area.parentElement.querySelector('.port-feedback');
            if (fb) fb.remove();
            render();
        });
        btnRow.appendChild(resetBtn);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'matching-check-btn';
        checkBtn.textContent = '\u2714 Pr\u00fcfen';
        checkBtn.style.display = 'none';
        checkBtn.addEventListener('click', () => {
            let correct = 0;
            const cards = area.querySelectorAll('.port-card');
            shuffledPorts.forEach((port, i) => {
                const card = cards[i];
                card.classList.remove('correct', 'incorrect');
                if (assigned[port.id] && assigned[port.id].id === port.id) {
                    card.classList.add('correct');
                    correct++;
                } else if (assigned[port.id]) {
                    card.classList.add('incorrect');
                }
            });

            let existing = area.parentElement.querySelector('.port-feedback');
            if (existing) existing.remove();
            const fb = document.createElement('div');
            fb.className = 'port-feedback';
            if (correct === ports.length) {
                fb.className += ' sort-feedback quiz-score pass';
                fb.textContent = `\ud83c\udf89 Perfekt! Alle ${ports.length} Schnittstellen richtig zugeordnet!`;
            } else {
                fb.className += ' sort-feedback quiz-score fail';
                fb.textContent = `${correct} von ${ports.length} richtig \u2013 die rot markierten sind falsch. Setze zur\u00fcck und versuche es erneut!`;
            }
            area.parentElement.appendChild(fb);
        });
        btnRow.appendChild(checkBtn);
        area.appendChild(btnRow);

        render();
    }

    // --- Vergleichstabelle ---
    renderCompareTable() {
        const wrapper = document.getElementById('compare-table-wrapper');
        const checkBtn = document.getElementById('compare-check-btn');
        const feedbackEl = document.getElementById('compare-feedback');
        if (!wrapper || !checkBtn) return;

        const rows = [
            {
                label: 'Was ist es?',
                os: { correct: 'Die Verwaltungssoftware des Computers', options: ['Die Verwaltungssoftware des Computers', 'Ein Übersetzungsprogramm für Hardware', 'Ein Programm zum Arbeiten', 'Ein physisches Bauteil'] },
                driver: { correct: 'Ein Übersetzungsprogramm für Hardware', options: ['Die Verwaltungssoftware des Computers', 'Ein Übersetzungsprogramm für Hardware', 'Ein Programm zum Arbeiten', 'Ein physisches Bauteil'] },
                app: { correct: 'Ein Programm zum Arbeiten', options: ['Die Verwaltungssoftware des Computers', 'Ein Übersetzungsprogramm für Hardware', 'Ein Programm zum Arbeiten', 'Ein physisches Bauteil'] }
            },
            {
                label: 'Typische Beispiele',
                os: { correct: 'Windows, Linux, Android', options: ['Windows, Linux, Android', 'Druckertreiber, Grafiktreiber', 'Word, Spotify, Firefox', 'Festplatte, Maus, Drucker'] },
                driver: { correct: 'Druckertreiber, Grafiktreiber', options: ['Windows, Linux, Android', 'Druckertreiber, Grafiktreiber', 'Word, Spotify, Firefox', 'Festplatte, Maus, Drucker'] },
                app: { correct: 'Word, Spotify, Firefox', options: ['Windows, Linux, Android', 'Druckertreiber, Grafiktreiber', 'Word, Spotify, Firefox', 'Festplatte, Maus, Drucker'] }
            },
            {
                label: 'Benutzt du es direkt?',
                os: { correct: 'Teilweise (Dateien verwalten, Einstellungen)', options: ['Ja, ständig', 'Teilweise (Dateien verwalten, Einstellungen)', 'Nein, arbeitet im Hintergrund'] },
                driver: { correct: 'Nein, arbeitet im Hintergrund', options: ['Ja, ständig', 'Teilweise (Dateien verwalten, Einstellungen)', 'Nein, arbeitet im Hintergrund'] },
                app: { correct: 'Ja, ständig', options: ['Ja, ständig', 'Teilweise (Dateien verwalten, Einstellungen)', 'Nein, arbeitet im Hintergrund'] }
            },
            {
                label: 'Was braucht es zum Laufen?',
                os: { correct: 'Hardware (wird direkt darauf installiert)', options: ['Hardware (wird direkt darauf installiert)', 'Betriebssystem + Hardware', 'Betriebssystem + Treiber + Hardware'] },
                driver: { correct: 'Betriebssystem + Hardware', options: ['Hardware (wird direkt darauf installiert)', 'Betriebssystem + Hardware', 'Betriebssystem + Treiber + Hardware'] },
                app: { correct: 'Betriebssystem + Treiber + Hardware', options: ['Hardware (wird direkt darauf installiert)', 'Betriebssystem + Hardware', 'Betriebssystem + Treiber + Hardware'] }
            },
        ];

        const makeSelect = (cell, rowIdx, col) => {
            const shuffled = [...cell.options].sort(() => Math.random() - 0.5);
            return `<select data-row="${rowIdx}" data-col="${col}" data-correct="${cell.correct}">
                <option value="">- wählen -</option>
                ${shuffled.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>`;
        };

        wrapper.innerHTML = `<table class="compare-table">
            <thead>
                <tr>
                    <th></th>
                    <th class="col-os">⚙️ Betriebssystem</th>
                    <th class="col-driver">🔧 Treiber</th>
                    <th class="col-app">📱 Anwendersoftware</th>
                </tr>
            </thead>
            <tbody>
                ${rows.map((row, rIdx) => `<tr>
                    <td class="row-label">${row.label}</td>
                    <td>${makeSelect(row.os, rIdx, 'os')}</td>
                    <td>${makeSelect(row.driver, rIdx, 'driver')}</td>
                    <td>${makeSelect(row.app, rIdx, 'app')}</td>
                </tr>`).join('')}
            </tbody>
        </table>`;

        checkBtn.addEventListener('click', () => {
            let allCorrect = true;
            let totalCells = 0;
            let correctCells = 0;
            wrapper.querySelectorAll('select').forEach(sel => {
                totalCells++;
                sel.classList.remove('correct', 'incorrect');
                if (sel.value === sel.dataset.correct) {
                    sel.classList.add('correct');
                    correctCells++;
                } else {
                    sel.classList.add('incorrect');
                    allCorrect = false;
                }
            });
            feedbackEl.className = 'compare-feedback ' + (allCorrect ? 'pass' : 'fail');
            feedbackEl.textContent = allCorrect
                ? `🎉 Perfekt! Alle ${totalCells} Felder sind richtig!`
                : `${correctCells} / ${totalCells} richtig - die rot markierten Felder stimmen noch nicht. Versuch es nochmal!`;
        });
    }

    // ===========================
    //  MISSION SYSTEM
    // ===========================
    createMissionButtons() {
        const container = document.getElementById('mission-buttons');
        container.innerHTML = '';
        this.missions.forEach((mission, index) => {
            const button = document.createElement('button');
            button.className = 'mission-btn';
            button.textContent = index + 1;
            button.title = mission.title;
            if (index === this.currentMission) {
                button.classList.add('current');
            } else if (this.completedMissions.has(index)) {
                button.classList.add('completed');
            } else if (index > this.getMaxUnlockedMission()) {
                button.classList.add('locked');
            }
            if (!button.classList.contains('locked')) {
                button.addEventListener('click', () => this.selectMission(index));
            }
            container.appendChild(button);
        });
    }

    getMaxUnlockedMission() {
        let max = 0;
        for (let i = 0; i < this.missions.length; i++) {
            if (this.completedMissions.has(i)) max = Math.max(max, i + 1);
        }
        return Math.min(max, this.missions.length - 1);
    }

    selectMission(idx) {
        const max = this.getMaxUnlockedMission();
        if (idx === 0 || this.completedMissions.has(idx) || idx <= max) {
            this.currentMission = idx;
            this.updateMission();
            this.createMissionButtons();
        }
    }

    updateMission() {
        const area = document.getElementById('exercise-area');
        area.innerHTML = '';
        if (this.currentMission < this.missions.length) {
            const m = this.missions[this.currentMission];
            document.getElementById('mission-content').innerHTML = `<strong>${m.title}</strong><br><br>${m.text}`;
            document.getElementById('mission-counter').textContent = `${this.currentMission + 1} / ${this.missions.length}`;
            // Set Byte mood
            const byteMascot = document.getElementById('mission-byte-mascot');
            byteMascot.querySelector('img').src = '../assets/images/byte/Byte_Thinking.png';
            // Render exercise
            this.renderExercise(m);
        } else {
            document.getElementById('mission-content').textContent = '🎉 Alle Missionen erfüllt! Du bist ein Software-Schichten-Experte!';
        }
        this.createMissionButtons();
    }

    checkMission() {
        if (this.completedMissions.size >= this.missions.length) return;
        if (this.currentMission < this.missions.length) {
            const m = this.missions[this.currentMission];
            if (m.check() && !this.completedMissions.has(this.currentMission)) {
                this.completedMissions.add(this.currentMission);
                this.showMissionSuccess(m.success, m.timer);
            }
        }
    }

    showMissionSuccess(message, timer = 3) {
        document.getElementById('mission-result').textContent = message;
        document.getElementById('mission-modal').classList.add('active');
        const continueBtn = document.getElementById('continue-mission');
        const timerContainer = document.getElementById('mission-timer');
        const timerProgress = document.getElementById('timer-progress');
        continueBtn.style.display = 'none';
        timerContainer.style.display = 'block';
        timerProgress.style.width = '0%';

        // Byte celebration
        const missionByte = document.getElementById('mission-success-byte');
        missionByte.classList.add('celebrating');
        setTimeout(() => missionByte.classList.remove('celebrating'), 600);

        // Timer
        const startTime = Date.now();
        const duration = timer * 1000;
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            timerProgress.style.width = (progress * 100) + '%';
            if (progress < 1) {
                requestAnimationFrame(updateTimer);
            } else {
                timerContainer.style.display = 'none';
                continueBtn.style.display = 'block';
                continueBtn.focus();
            }
        };
        requestAnimationFrame(updateTimer);

        // Confetti on final mission
        if (this.currentMission === this.missions.length - 1) this.showConfetti();
    }

    showConfetti() {
        if (!document.querySelector('style[data-confetti]')) {
            const style = document.createElement('style');
            style.setAttribute('data-confetti', 'true');
            style.textContent = '@keyframes confetti-fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }';
            document.head.appendChild(style);
        }
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.innerHTML = ['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)];
                confetti.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-50px;font-size:20px;pointer-events:none;z-index:10000;animation:confetti-fall 3s linear forwards;`;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
    }

    nextMission() {
        document.getElementById('mission-modal').classList.remove('active');
        let next = this.currentMission;
        for (let i = this.currentMission + 1; i < this.missions.length; i++) {
            if (!this.completedMissions.has(i)) { next = i; break; }
        }
        this.currentMission = next;
        this.updateMission();
    }

    // ===========================
    //  EXERCISE RENDERERS
    // ===========================
    renderExercise(mission) {
        switch (mission.format) {
            case 'exploration': return; // no special UI, just click layers
            case 'assignment': return this.renderAssignment(mission);
            case 'truefalse': return this.renderTrueFalse(mission);
            case 'sorting': return this.renderSorting(mission);
            case 'singlechoice': return this.renderSingleChoice(mission);
            case 'multiplechoice': return this.renderMultipleChoice(mission);
            case 'scenario': return this.renderScenario(mission);
            case 'cloze': return this.renderCloze(mission);
            case 'matching': return this.renderMatching(mission);
        }
    }

    // --- ASSIGNMENT ---
    renderAssignment(mission) {
        this._assignmentAllCorrect = false;
        this.selectedAssignItem = null;
        const area = document.getElementById('exercise-area');
        const d = mission.data;

        // Shuffle items
        const shuffled = [...d.items].sort(() => Math.random() - 0.5);
        const placed = {}; // itemLabel -> targetId
        let itemEls;

        const render = () => {
            area.innerHTML = '';
            // Items
            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'assignment-items';
            shuffled.forEach((item, idx) => {
                const chip = document.createElement('span');
                chip.className = 'assign-item';
                chip.textContent = item.label;
                chip.dataset.idx = idx;
                if (placed[item.label]) chip.classList.add('placed');
                chip.addEventListener('click', () => {
                    if (placed[item.label]) return;
                    document.querySelectorAll('.assign-item').forEach(c => c.classList.remove('selected'));
                    chip.classList.add('selected');
                    this.selectedAssignItem = item;
                });
                itemsDiv.appendChild(chip);
            });
            area.appendChild(itemsDiv);

            // Targets
            const targetsDiv = document.createElement('div');
            targetsDiv.className = 'assign-targets';
            d.targets.forEach(t => {
                const targetEl = document.createElement('div');
                targetEl.className = 'assign-target';
                targetEl.dataset.target = t.id;
                targetEl.innerHTML = `<div class="assign-target-label">${t.label}</div><div class="assign-target-items" data-target-id="${t.id}"></div>`;
                // Show already placed items
                Object.entries(placed).forEach(([label, tid]) => {
                    if (tid === t.id) {
                        const c = document.createElement('span');
                        c.className = 'assigned-chip';
                        c.textContent = label;
                        c.style.background = this.getLayerColor(t.id);
                        c.addEventListener('click', () => {
                            delete placed[label];
                            render();
                        });
                        targetEl.querySelector('.assign-target-items').appendChild(c);
                    }
                });
                targetEl.addEventListener('click', (e) => {
                    if (!this.selectedAssignItem) return;
                    if (e.target.classList.contains('assigned-chip')) return;
                    placed[this.selectedAssignItem.label] = t.id;
                    this.selectedAssignItem = null;
                    render();
                    // Check if all placed
                    if (Object.keys(placed).length === d.items.length) {
                        checkAll();
                    }
                });
                targetsDiv.appendChild(targetEl);
            });
            area.appendChild(targetsDiv);
        };

        const checkAll = () => {
            let allCorrect = true;
            d.items.forEach(item => {
                if (placed[item.label] !== item.target) allCorrect = false;
            });
            // Show feedback on chips
            document.querySelectorAll('.assigned-chip').forEach(chip => {
                const label = chip.textContent;
                const item = d.items.find(i => i.label === label);
                if (item && placed[label] === item.target) {
                    chip.classList.add('correct');
                } else {
                    chip.classList.add('incorrect');
                }
            });
            if (allCorrect) {
                this._assignmentAllCorrect = true;
                this.checkMission();
            } else {
                // After a moment, reset incorrect ones
                setTimeout(() => {
                    d.items.forEach(item => {
                        if (placed[item.label] !== item.target) {
                            delete placed[item.label];
                        }
                    });
                    render();
                }, 1200);
            }
        };

        render();
    }

    getLayerColor(layerId) {
        const colors = { app: '#238636', os: '#1f6feb', driver: '#fb8500', hardware: '#8b949e' };
        return colors[layerId] || '#555';
    }

    // --- TRUE/FALSE ---
    renderTrueFalse(mission) {
        this._tfScore = 0;
        const area = document.getElementById('exercise-area');
        let answered = 0;

        mission.data.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'tf-statement';
            div.innerHTML = `
                <div class="statement-text">${idx + 1}. ${item.statement}</div>
                <div class="tf-buttons">
                    <button class="tf-btn" data-answer="true">✅ Richtig</button>
                    <button class="tf-btn" data-answer="false">❌ Falsch</button>
                </div>
                <div class="tf-feedback" id="tf-fb-${idx}"></div>
            `;
            div.querySelectorAll('.tf-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const userAnswer = btn.dataset.answer === 'true';
                    const correct = userAnswer === item.answer;
                    const fb = div.querySelector('.tf-feedback');
                    if (correct) {
                        fb.className = 'tf-feedback correct';
                        fb.textContent = '✓ ' + item.explanation;
                        this._tfScore++;
                    } else {
                        fb.className = 'tf-feedback incorrect';
                        fb.textContent = '✗ ' + item.explanation;
                    }
                    div.querySelectorAll('.tf-btn').forEach(b => b.disabled = true);
                    answered++;
                    if (answered === mission.data.length) {
                        this.showQuizScore(area, this._tfScore, mission.data.length, mission.threshold);
                        this.checkMission();
                    }
                });
            });
            area.appendChild(div);
        });
    }

    showQuizScore(area, score, total, threshold) {
        const div = document.createElement('div');
        div.className = `quiz-score ${score >= threshold ? 'pass' : 'fail'}`;
        div.textContent = score >= threshold
            ? `${score} / ${total} richtig - Geschafft! 🎉`
            : `${score} / ${total} richtig - Leider nicht genug (${threshold} nötig). Versuche es erneut!`;
        area.appendChild(div);
        if (score < threshold) {
            const retryBtn = document.createElement('button');
            retryBtn.textContent = '🔄 Nochmal versuchen';
            retryBtn.style.marginTop = '12px';
            retryBtn.addEventListener('click', () => this.updateMission());
            area.appendChild(retryBtn);
        }
    }

    // --- SORTING ---
    renderSorting(mission) {
        this._sortingCorrect = false;
        const area = document.getElementById('exercise-area');
        const items = [...mission.data.items]; // mutable copy

        const render = () => {
            area.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'sort-container';
            items.forEach((item, idx) => {
                const row = document.createElement('div');
                row.className = 'sort-item';
                row.innerHTML = `
                    <span class="sort-label">${item.label}</span>
                    <div class="sort-arrows">
                        <button title="Nach oben">▲</button>
                        <button title="Nach unten">▼</button>
                    </div>
                `;
                const [upBtn, downBtn] = row.querySelectorAll('button');
                upBtn.addEventListener('click', () => {
                    if (idx > 0) { [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; render(); }
                });
                downBtn.addEventListener('click', () => {
                    if (idx < items.length - 1) { [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; render(); }
                });
                container.appendChild(row);
            });
            area.appendChild(container);

            const checkBtn = document.createElement('button');
            checkBtn.className = 'sort-check-btn';
            checkBtn.textContent = '✔ Reihenfolge prüfen';
            checkBtn.addEventListener('click', () => {
                const correct = items.every((item, i) => item.id === mission.data.correctOrder[i]);
                const fb = document.createElement('div');
                fb.className = `sort-feedback ${correct ? 'quiz-score pass' : 'quiz-score fail'}`;
                if (correct) {
                    fb.textContent = '🎉 Richtig! Perfekte Reihenfolge!';
                    this._sortingCorrect = true;
                    this.checkMission();
                } else {
                    fb.textContent = '❌ Noch nicht ganz - versuch es nochmal!';
                }
                // Remove old feedback
                area.querySelectorAll('.sort-feedback').forEach(f => f.remove());
                area.appendChild(fb);
            });
            area.appendChild(checkBtn);
        };

        render();
    }

    // --- SINGLE CHOICE ---
    renderSingleChoice(mission) {
        this._scScore = 0;
        const area = document.getElementById('exercise-area');
        let qIdx = 0;

        const renderQ = () => {
            area.innerHTML = '';
            if (qIdx >= mission.data.length) {
                this.showQuizScore(area, this._scScore, mission.data.length, mission.threshold);
                this.checkMission();
                return;
            }
            const q = mission.data[qIdx];
            const div = document.createElement('div');
            div.className = 'quiz-question';
            div.innerHTML = `<div class="quiz-question-text">Frage ${qIdx + 1}/${mission.data.length}: ${q.question}</div>`;
            q.options.forEach((opt, oIdx) => {
                const optEl = document.createElement('div');
                optEl.className = 'quiz-option';
                optEl.innerHTML = `<input type="radio" name="sc-q" value="${oIdx}"><span>${opt}</span>`;
                optEl.addEventListener('click', () => {
                    // Disable all
                    div.querySelectorAll('.quiz-option').forEach(o => {
                        o.classList.add('disabled');
                        if (parseInt(o.querySelector('input').value) === q.correct) {
                            o.classList.add('correct');
                        }
                    });
                    if (oIdx === q.correct) {
                        optEl.classList.add('correct');
                        this._scScore++;
                    } else {
                        optEl.classList.add('incorrect');
                    }
                    // Show explanation
                    const fb = document.createElement('div');
                    fb.className = `quiz-feedback ${oIdx === q.correct ? 'correct' : 'incorrect'}`;
                    fb.textContent = q.explanation;
                    div.appendChild(fb);
                    // Next question after delay
                    setTimeout(() => { qIdx++; renderQ(); }, 2000);
                });
                div.appendChild(optEl);
            });
            area.appendChild(div);
        };

        renderQ();
    }

    // --- MULTIPLE CHOICE ---
    renderMultipleChoice(mission) {
        this._mcScore = 0;
        const area = document.getElementById('exercise-area');
        let qIdx = 0;

        const renderQ = () => {
            area.innerHTML = '';
            if (qIdx >= mission.data.length) {
                this.showQuizScore(area, this._mcScore, mission.data.length, mission.threshold);
                this.checkMission();
                return;
            }
            const q = mission.data[qIdx];
            const div = document.createElement('div');
            div.className = 'quiz-question';
            div.innerHTML = `<div class="quiz-question-text">Frage ${qIdx + 1}/${mission.data.length}: ${q.question}</div>`;
            const selections = new Set();
            q.options.forEach((opt, oIdx) => {
                const optEl = document.createElement('div');
                optEl.className = 'quiz-option';
                optEl.innerHTML = `<input type="checkbox" value="${oIdx}"><span>${opt.text}</span>`;
                optEl.addEventListener('click', (e) => {
                    if (optEl.classList.contains('disabled')) return;
                    const cb = optEl.querySelector('input');
                    if (e.target !== cb) cb.checked = !cb.checked;
                    if (cb.checked) {
                        selections.add(oIdx);
                        optEl.classList.add('selected');
                    } else {
                        selections.delete(oIdx);
                        optEl.classList.remove('selected');
                    }
                });
                div.appendChild(optEl);
            });
            // Check button
            const checkBtn = document.createElement('button');
            checkBtn.className = 'quiz-check-btn';
            checkBtn.textContent = '✔ Prüfen';
            checkBtn.addEventListener('click', () => {
                let correct = true;
                div.querySelectorAll('.quiz-option').forEach((optEl, oIdx) => {
                    optEl.classList.add('disabled');
                    const isCorrect = q.options[oIdx].correct;
                    const isSelected = selections.has(oIdx);
                    if (isCorrect) {
                        optEl.classList.add('correct');
                    }
                    if (isSelected && !isCorrect) {
                        optEl.classList.add('incorrect');
                        correct = false;
                    }
                    if (!isSelected && isCorrect) {
                        correct = false;
                    }
                });
                if (correct) this._mcScore++;
                const fb = document.createElement('div');
                fb.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
                fb.textContent = correct ? '✓ Richtig!' : '✗ Leider nicht ganz richtig.';
                div.appendChild(fb);
                checkBtn.remove();
                setTimeout(() => { qIdx++; renderQ(); }, 2000);
            });
            div.appendChild(checkBtn);
            area.appendChild(div);
        };

        renderQ();
    }

    // --- SCENARIO (Communication Path) ---
    renderScenario(mission) {
        this._scenarioComplete = false;
        const area = document.getElementById('exercise-area');
        const d = mission.data;
        let nextExpected = 0;

        area.innerHTML = '<p class="scenario-instruction">Klicke die Schritte in der richtigen Reihenfolge an:</p>';
        const container = document.createElement('div');
        container.className = 'scenario-exercise';

        // Show steps in shuffled order
        const shuffled = [...d.steps].sort(() => Math.random() - 0.5);
        shuffled.forEach(step => {
            const el = document.createElement('div');
            el.className = 'scenario-step';
            el.dataset.step = step.id;
            el.innerHTML = `<span class="scenario-num">?</span><span>${step.label}</span>`;
            el.addEventListener('click', () => {
                if (el.classList.contains('done')) return;
                if (step.id === d.correctOrder[nextExpected]) {
                    el.classList.add('done');
                    el.querySelector('.scenario-num').textContent = nextExpected + 1;
                    nextExpected++;
                    if (nextExpected === d.correctOrder.length) {
                        this._scenarioComplete = true;
                        this.checkMission();
                    }
                } else {
                    el.classList.add('wrong');
                    setTimeout(() => el.classList.remove('wrong'), 600);
                }
            });
            container.appendChild(el);
        });
        area.appendChild(container);
    }

    // --- MATCHING (Zuordnung Satzteile) ---
    renderMatching(mission) {
        this._matchingCorrect = false;
        const area = document.getElementById('exercise-area');
        const d = mission.data;

        const matched = {}; // leftIdx -> rightIdx
        let selectedLeft = null;

        // Distinct colors for each matched pair
        const pairColors = [
            '#388bfd', '#e5534b', '#57ab5a', '#c69026',
            '#b083f0', '#39c5cf', '#e0823d', '#6cb6ff'
        ];

        // Shuffle right side independently
        const rightShuffled = d.pairs.map((p, i) => ({ text: p.right, origIdx: i })).sort(() => Math.random() - 0.5);

        const container = document.createElement('div');
        container.className = 'matching-container';

        // Track which color index each pair gets (by order of matching)
        let colorIndex = 0;
        const pairColorMap = {}; // leftIdx -> color

        const render = () => {
            container.innerHTML = '';

            const leftCol = document.createElement('div');
            leftCol.className = 'matching-col matching-left';
            const rightCol = document.createElement('div');
            rightCol.className = 'matching-col matching-right';

            d.pairs.forEach((pair, li) => {
                const el = document.createElement('div');
                el.className = 'matching-item matching-item-left';
                el.textContent = pair.left;
                el.dataset.idx = li;
                if (matched[li] !== undefined) {
                    el.classList.add('matched');
                    const c = pairColorMap[li];
                    el.style.borderColor = c;
                    el.style.boxShadow = `inset 3px 0 0 ${c}`;
                }
                if (selectedLeft === li) el.classList.add('selected');
                el.addEventListener('click', () => {
                    if (matched[li] !== undefined) return;
                    selectedLeft = li;
                    render();
                });
                leftCol.appendChild(el);
            });

            rightShuffled.forEach((item, ri) => {
                const el = document.createElement('div');
                el.className = 'matching-item matching-item-right';
                el.textContent = item.text;
                el.dataset.idx = ri;
                const isUsed = Object.values(matched).includes(ri);
                // Find which left index this right index belongs to
                const ownerLeft = Object.keys(matched).find(k => matched[k] === ri);
                if (isUsed && ownerLeft !== undefined) {
                    el.classList.add('matched');
                    const c = pairColorMap[ownerLeft];
                    el.style.borderColor = c;
                    el.style.boxShadow = `inset -3px 0 0 ${c}`;
                }
                el.addEventListener('click', () => {
                    if (selectedLeft === null || isUsed) return;
                    pairColorMap[selectedLeft] = pairColors[colorIndex % pairColors.length];
                    colorIndex++;
                    matched[selectedLeft] = ri;
                    selectedLeft = null;
                    render();
                    // Check if all matched
                    if (Object.keys(matched).length === d.pairs.length) {
                        checkBtn.style.display = 'inline-block';
                    }
                });
                rightCol.appendChild(el);
            });

            container.appendChild(leftCol);
            container.appendChild(rightCol);
        };

        area.appendChild(container);

        // Reset button
        const btnRow = document.createElement('div');
        btnRow.className = 'matching-btn-row';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'matching-reset-btn';
        resetBtn.textContent = '↺ Zurücksetzen';
        resetBtn.addEventListener('click', () => {
            Object.keys(matched).forEach(k => delete matched[k]);
            Object.keys(pairColorMap).forEach(k => delete pairColorMap[k]);
            colorIndex = 0;
            selectedLeft = null;
            checkBtn.style.display = 'none';
            const fb = area.querySelector('.sort-feedback');
            if (fb) fb.remove();
            render();
        });
        btnRow.appendChild(resetBtn);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'matching-check-btn';
        checkBtn.textContent = '✔ Prüfen';
        checkBtn.style.display = 'none';
        checkBtn.addEventListener('click', () => {
            let allCorrect = true;
            const leftItems = container.querySelectorAll('.matching-item-left');
            const rightItems = container.querySelectorAll('.matching-item-right');

            Object.entries(matched).forEach(([li, ri]) => {
                const leftEl = leftItems[parseInt(li)];
                const rightEl = rightItems[parseInt(ri)];
                const isCorrect = rightShuffled[ri].origIdx === parseInt(li);
                leftEl.classList.remove('correct', 'incorrect');
                rightEl.classList.remove('correct', 'incorrect');
                if (isCorrect) {
                    leftEl.classList.add('correct');
                    rightEl.classList.add('correct');
                } else {
                    leftEl.classList.add('incorrect');
                    rightEl.classList.add('incorrect');
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                this._matchingCorrect = true;
                this.checkMission();
            } else {
                let existing = area.querySelector('.sort-feedback');
                if (existing) existing.remove();
                const fb = document.createElement('div');
                fb.className = 'sort-feedback quiz-score fail';
                fb.textContent = 'Noch nicht ganz richtig - die rot markierten Paare stimmen nicht. Setze zurück und versuche es erneut!';
                area.appendChild(fb);
            }
        });
        btnRow.appendChild(checkBtn);
        area.appendChild(btnRow);

        render();
    }

    // --- CLOZE (Lückentext) ---
    renderCloze(mission) {
        this._clozeCorrect = false;
        const area = document.getElementById('exercise-area');
        const d = mission.data;

        const clozeDiv = document.createElement('div');
        clozeDiv.className = 'cloze-text';
        let html = '';
        d.segments.forEach(seg => {
            if (typeof seg === 'string') {
                html += seg;
            } else {
                const shuffledOpts = [...seg.options].sort(() => Math.random() - 0.5);
                html += `<select data-gap="${seg.id}" data-correct="${seg.correct}">`;
                html += `<option value="">- wählen -</option>`;
                shuffledOpts.forEach(opt => {
                    html += `<option value="${opt}">${opt}</option>`;
                });
                html += `</select>`;
            }
        });
        clozeDiv.innerHTML = html;
        area.appendChild(clozeDiv);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'cloze-check-btn';
        checkBtn.textContent = '✔ Prüfen';
        checkBtn.addEventListener('click', () => {
            let allCorrect = true;
            clozeDiv.querySelectorAll('select').forEach(sel => {
                sel.classList.remove('correct', 'incorrect');
                if (sel.value === sel.dataset.correct) {
                    sel.classList.add('correct');
                } else {
                    sel.classList.add('incorrect');
                    allCorrect = false;
                }
            });
            if (allCorrect) {
                this._clozeCorrect = true;
                this.checkMission();
            } else {
                // Show retry hint
                let existing = area.querySelector('.sort-feedback');
                if (existing) existing.remove();
                const fb = document.createElement('div');
                fb.className = 'sort-feedback quiz-score fail';
                fb.textContent = 'Noch nicht ganz - schau dir die rot markierten Lücken nochmal an!';
                area.appendChild(fb);
            }
        });
        area.appendChild(checkBtn);
    }

    // ===========================
    //  UTILITIES
    // ===========================
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--accent-danger);color:white;padding:12px 20px;border-radius:8px;z-index:10000;box-shadow:var(--shadow);';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        errorDiv.classList.add('fade-in');
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize the application
const visualizer = new SoftwareLayerVisualizer();