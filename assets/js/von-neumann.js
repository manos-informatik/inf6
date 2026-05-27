class VonNeumannTrainer {
  constructor() {
    this.storageKey = 'tc6-von-neumann-state-v1';
    this.defaultProgram = `in a
in b
ld a
add b
div 2
st e
out e
end`;

    this.components = [
      { id: 'memory', label: 'Speicherwerk' },
      { id: 'control', label: 'Steuerwerk' },
      { id: 'alu', label: 'Rechenwerk' },
      { id: 'io', label: 'Ein-/Ausgabewerk' },
      { id: 'bus', label: 'Bus-System' }
    ];
    this.componentOrder = ['alu', 'bus', 'memory', 'io', 'control'];

    this.functions = [
      { id: 'stores', expected: 'memory', text: 'Speichert Daten und Programme am gleichen Speicherort.' },
      { id: 'fetches', expected: 'control', text: 'Holt Befehle und Daten aus dem Speicher.' },
      { id: 'calculates', expected: 'alu', text: 'Führt Berechnungen und logische Operationen aus.' },
      { id: 'inputoutput', expected: 'io', text: 'Kümmert sich um Ein- und Ausgabe des Rechners.' },
      { id: 'connects', expected: 'bus', text: 'Dient zur Kommunikation der Werke untereinander.' }
    ];
    this.functionOrder = ['inputoutput', 'connects', 'calculates', 'stores', 'fetches'];

    this.clozeItems = [
      { id: 'simple', answer: 'einfacher' },
      { id: 'flexible', answer: 'flexibler' },
      { id: 'program', answer: 'Programm' },
      { id: 'same', answer: 'gleichen' },
      { id: 'storage', answer: 'Speicherung' },
      { id: 'data', answer: 'Daten' }
    ];

    this.words = ['einfacher', 'flexibler', 'Programm', 'gleichen', 'Speicherung', 'Daten'];

    this.extensionTasks = [
      {
        id: 'double',
        level: 'Leicht',
        title: 'Verdoppler',
        text: 'Lies eine Zahl ein, verdopple sie und gib sie aus.',
        test: 'Teste mit Eingabe 7. Erwartete Ausgabe: 14.',
        expectedOutput: [14]
      },
      {
        id: 'average',
        level: 'Leicht',
        title: 'Durchschnitt von zwei Zahlen',
        text: 'Lies zwei Zahlen ein und gib ihren Durchschnitt aus.',
        test: 'Teste mit Eingaben 8 und 12. Erwartete Ausgabe: 10.',
        expectedOutput: [10]
      },
      {
        id: 'sum3',
        level: 'Mittel',
        title: 'Summe aus drei Zahlen',
        text: 'Lies drei Zahlen ein und gib ihre Summe aus.',
        test: 'Teste mit Eingaben 3, 4 und 5. Erwartete Ausgabe: 12.',
        expectedOutput: [12]
      },
      {
        id: 'diff2',
        level: 'Mittel',
        title: 'Differenz mal 2',
        text: 'Ziehe b von a ab, verdopple das Ergebnis und gib es aus.',
        test: 'Teste mit Eingaben 12 und 5. Erwartete Ausgabe: 14.',
        expectedOutput: [14]
      },
      {
        id: 'stored',
        level: 'Schwer',
        title: 'Zwischenergebnis nutzen',
        text: 'Speichere a + b in e, lade e erneut und addiere c.',
        test: 'Teste mit Eingaben 2, 8 und 10. Erwartete Ausgabe: 20.',
        expectedOutput: [20]
      },
      {
        id: 'fibonacci',
        level: 'Schwer',
        title: 'Erste 5 Fibonacci-Zahlen',
        text: 'Gib 0, 1, 1, 2 und 3 nacheinander aus.',
        test: 'Keine Eingabe nötig. Erwartete Ausgaben: 0, 1, 1, 2, 3.',
        expectedOutput: [0, 1, 1, 2, 3]
      }
    ];

    this.commandGlossary = [
      { command: 'in x', text: 'Wartet auf eine Eingabe und speichert die Zahl in Speicherzelle x, zum Beispiel in a.' },
      { command: 'ld x', text: 'Lädt den Wert aus Speicherzelle x in den Akku. Statt x darf auch direkt eine Zahl stehen.' },
      { command: 'st x', text: 'Speichert den aktuellen Akku-Wert in Speicherzelle x.' },
      { command: 'add x', text: 'Addiert x zum Akku. x kann eine Speicherzelle oder eine Zahl sein.' },
      { command: 'sub x', text: 'Zieht x vom Akku ab.' },
      { command: 'mul x', text: 'Multipliziert den Akku mit x.' },
      { command: 'div x', text: 'Teilt den Akku durch x. Division durch 0 ist nicht erlaubt.' },
      { command: 'out x', text: 'Gibt den Wert aus x aus. Mit out akku wird direkt der Akku ausgegeben.' },
      { command: 'end', text: 'Beendet das Programm.' }
    ];

    this.maxBottleneckCapacity = 5;
    this.maxBottleneckRequests = 10;

    this.state = this.createInitialState();
    this.selectedComponent = null;
    this.runTimer = null;
    this.bottleneckTimer = null;
    this.busMoveTimers = [];
    this.busMoveToken = 0;
    this.isRestoring = false;

    this.cacheElements();
    this.registerProgressBridge();
    this.restoreSavedState();
    this.bindEvents();
    this.renderAll();
    this.saveState();
  }

  createInitialState() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      assignments: {},
      task2Checked: false,
      task2Solved: false,
      clozeAnswers: {},
      task3Solved: false,
      task3Revealed: false,
      bottleneckCapacity: 3,
      bottleneckRequests: 6,
      bottleneckElapsed: 0,
      bottleneckWaiting: 0,
      bottleneckProcessedThisSecond: 0,
      bottleneckProcessedTotal: 0,
      bottleneckRunning: false,
      bottleneckAborted: false,
      bottleneckHistory: [],
      activeTaskId: '',
      taskPrograms: {},
      taskResults: {},
      completedTasks: [],
      simulator: this.createFreshSimulatorState()
    };
  }

  createFreshSimulatorState(program = this.defaultProgram, inputDraft = '') {
    return {
      program,
      inputDraft,
      pendingInputCell: '',
      memory: this.createEmptyMemory(),
      output: [],
      pc: 0,
      activeLine: 0,
      ir: '-',
      acc: 0,
      alu: 'wartet',
      halted: false,
      error: '',
      lastChangedCell: '',
      busText: 'Der Bus wartet auf den nächsten Schritt.',
      busFrom: 'control',
      busTo: 'memory',
      busVisible: false
    };
  }

  createEmptyMemory() {
    return {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0
    };
  }

  cacheElements() {
    this.componentBank = document.getElementById('componentBank');
    this.functionTargets = document.getElementById('functionTargets');
    this.task2Feedback = document.getElementById('task2Feedback');
    this.clozeText = document.getElementById('clozeText');
    this.task3Feedback = document.getElementById('task3Feedback');
    this.capacityInput = document.getElementById('capacityInput');
    this.requestInput = document.getElementById('requestInput');
    this.requestQueue = document.getElementById('requestQueue');
    this.processedCount = document.getElementById('processedCount');
    this.waitingCount = document.getElementById('waitingCount');
    this.bottleneckTime = document.getElementById('bottleneckTime');
    this.busLoadText = document.getElementById('busLoadText');
    this.busLoadBar = document.getElementById('busLoadBar');
    this.memoryFillText = document.getElementById('memoryFillText');
    this.memoryBuffer = document.getElementById('memoryBuffer');
    this.bottleneckHistory = document.getElementById('bottleneckHistory');
    this.bottleneckPacket = document.getElementById('bottleneckPacket');
    this.bottleneckStartBtn = document.getElementById('bottleneckStartBtn');
    this.bottleneckStopBtn = document.getElementById('bottleneckStopBtn');
    this.bottleneckResetBtn = document.getElementById('bottleneckResetBtn');
    this.task4Feedback = document.getElementById('task4Feedback');
    this.programEditor = document.getElementById('programEditor');
    this.inputQueue = document.getElementById('inputQueue');
    this.submitInputBtn = document.getElementById('submitInputBtn');
    this.inputHint = document.getElementById('inputHint');
    this.programLines = document.getElementById('programLines');
    this.memoryCells = document.getElementById('memoryCells');
    this.pcValue = document.getElementById('pcValue');
    this.irValue = document.getElementById('irValue');
    this.accValue = document.getElementById('accValue');
    this.aluValue = document.getElementById('aluValue');
    this.ioInputValue = document.getElementById('ioInputValue');
    this.ioOutputValue = document.getElementById('ioOutputValue');
    this.simFeedback = document.getElementById('simFeedback');
    this.busPacket = document.getElementById('busPacket');
    this.currentBusText = document.getElementById('currentBusText');
    this.extensionTasksContainer = document.getElementById('extensionTasks');
    this.activeTaskBox = document.getElementById('activeTaskBox');
    this.openCommandGlossary = document.getElementById('openCommandGlossary');
    this.closeCommandGlossary = document.getElementById('closeCommandGlossary');
    this.commandGlossaryModal = document.getElementById('commandGlossaryModal');
    this.commandGlossaryList = document.getElementById('commandGlossaryList');
  }

  registerProgressBridge() {
    window.TC6PageState = {
      collectProgress: () => this.buildSerializableState(),
      restoreProgress: (state) => {
        this.applySerializableState(state);
        this.saveState();
      }
    };
  }

  restoreSavedState() {
    const localState = this.readLocalState();
    const progressState = this.readProgressState();
    const selectedState = this.pickNewestState(localState, progressState);

    if (selectedState) {
      this.applySerializableState(selectedState);
    }
  }

  readLocalState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  readProgressState() {
    try {
      const progress = window.TC6Progress?.readStoredProgress?.();
      const pageKey = window.TC6Progress?.getPageKey?.() || 'von-neumann';
      return progress?.pages?.[pageKey]?.pageState || null;
    } catch {
      return null;
    }
  }

  pickNewestState(first, second) {
    if (!first) {
      return second;
    }
    if (!second) {
      return first;
    }

    const firstTime = Date.parse(first.savedAt || '') || 0;
    const secondTime = Date.parse(second.savedAt || '') || 0;
    return secondTime > firstTime ? second : first;
  }

  bindEvents() {
    document.getElementById('task2Check').addEventListener('click', () => this.checkTask2());

    document.getElementById('task3Check').addEventListener('click', () => this.checkTask3());
    document.getElementById('task3Reveal').addEventListener('click', () => {
      this.state.task3Revealed = true;
      this.clozeItems.forEach((item) => {
        this.state.clozeAnswers[item.id] = item.answer;
      });
      this.renderTask3();
      this.saveState();
    });

    this.capacityInput.addEventListener('input', () => this.updateBottleneckDraft());
    this.requestInput.addEventListener('input', () => this.updateBottleneckDraft());
    this.capacityInput.addEventListener('change', () => this.updateBottleneckSettings());
    this.requestInput.addEventListener('change', () => this.updateBottleneckSettings());
    this.bottleneckStartBtn.addEventListener('click', () => this.startBottleneckSimulation());
    this.bottleneckStopBtn.addEventListener('click', () => this.stopBottleneckSimulation('Simulation gestoppt.'));
    this.bottleneckResetBtn.addEventListener('click', () => this.resetBottleneckSimulation());

    this.programEditor.addEventListener('input', () => this.updateProgramFromEditor());
    this.inputQueue.addEventListener('input', () => this.updateInputsFromField());
    this.inputQueue.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.submitLiveInput();
      }
    });
    this.submitInputBtn.addEventListener('click', () => this.submitLiveInput());

    document.getElementById('loadExampleBtn').addEventListener('click', () => this.loadProgram(this.defaultProgram));
    document.getElementById('resetSimBtn').addEventListener('click', () => this.resetSimulation());
    document.getElementById('stepBtn').addEventListener('click', () => this.stepSimulation());
    document.getElementById('runBtn').addEventListener('click', () => this.startAutoRun());
    document.getElementById('stopBtn').addEventListener('click', () => this.stopAutoRun('Auto-Lauf gestoppt.'));

    this.openCommandGlossary.addEventListener('click', () => this.showCommandGlossary());
    this.closeCommandGlossary.addEventListener('click', () => this.hideCommandGlossary());
    this.commandGlossaryModal.addEventListener('click', (event) => {
      if (event.target === this.commandGlossaryModal) {
        this.hideCommandGlossary();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.stopAutoRun('');
      this.stopBottleneckSimulation('');
      this.saveState();
    });
  }

  renderAll() {
    this.renderTask2();
    this.renderTask3();
    this.renderTask4();
    this.renderSimulator();
    this.renderExtensionTasks();
    this.renderCommandGlossary();
  }

  renderTask2() {
    this.componentBank.innerHTML = '';
    const assignedIds = new Set(Object.values(this.state.assignments));

    this.componentOrder
      .map((id) => this.components.find((component) => component.id === id))
      .filter(Boolean)
      .forEach((component) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'match-choice';
      button.textContent = component.label;
      button.dataset.component = component.id;

      if (this.selectedComponent === component.id) {
        button.classList.add('selected');
      }
      if (assignedIds.has(component.id)) {
        button.classList.add('used');
      }

      button.addEventListener('click', () => {
        this.selectedComponent = this.selectedComponent === component.id ? null : component.id;
        this.renderTask2();
      });

      this.componentBank.appendChild(button);
    });

    this.functionTargets.innerHTML = '';
    this.functionOrder
      .map((id) => this.functions.find((target) => target.id === id))
      .filter(Boolean)
      .forEach((target) => {
      const drop = document.createElement('button');
      drop.type = 'button';
      drop.className = 'drop-target';
      drop.dataset.target = target.id;

      const assignedComponent = this.components.find((component) => component.id === this.state.assignments[target.id]);
      if (this.state.task2Checked) {
        const hasAssignment = Boolean(assignedComponent);
        const isCorrect = assignedComponent?.id === target.expected;
        drop.classList.toggle('correct', isCorrect);
        drop.classList.toggle('incorrect', hasAssignment && !isCorrect);
      }

      drop.innerHTML = `
        <span class="target-text">${target.text}</span>
        <span class="assigned-chip">${assignedComponent ? assignedComponent.label : 'noch frei'}</span>
      `;

      drop.addEventListener('click', () => this.assignComponent(target.id));
      this.functionTargets.appendChild(drop);
    });

    if (this.state.task2Solved) {
      this.setFeedback(this.task2Feedback, 'Richtig. Diese fünf Begriffe kannst du nun in Aufgabe 2 eintragen.', 'success');
    }
  }

  assignComponent(targetId) {
    if (!this.selectedComponent) {
      if (this.state.assignments[targetId]) {
        delete this.state.assignments[targetId];
        this.state.task2Checked = false;
        this.state.task2Solved = false;
        this.clearFeedback(this.task2Feedback);
        this.renderTask2();
        this.saveState();
      }
      return;
    }

    Object.entries(this.state.assignments).forEach(([id, component]) => {
      if (component === this.selectedComponent) {
        delete this.state.assignments[id];
      }
    });

    this.state.assignments[targetId] = this.selectedComponent;
    this.selectedComponent = null;
    this.state.task2Checked = false;
    this.state.task2Solved = false;
    this.clearFeedback(this.task2Feedback);
    this.renderTask2();
    this.saveState();
  }

  checkTask2() {
    let correct = 0;
    this.functions.forEach((target) => {
      if (this.state.assignments[target.id] === target.expected) {
        correct += 1;
      }
    });

    this.state.task2Solved = correct === this.functions.length;
    this.state.task2Checked = true;

    if (this.state.task2Solved) {
      this.setFeedback(this.task2Feedback, 'Alles korrekt. Diese fünf Begriffe kannst du nun in Aufgabe 2 eintragen.', 'success');
    } else {
      this.setFeedback(this.task2Feedback, `${correct} von ${this.functions.length} Zuordnungen stimmen. Schau dir die markierten Felder noch einmal an.`, 'error');
    }

    this.renderTask2();
    this.saveState();
  }

  renderTask3() {
    this.clozeText.innerHTML = `
      <p>Der Von-Neumann-Rechner ist im Vergleich zu früheren Spezialmaschinen ${this.createSelect('simple')} aufgebaut.</p>
      <p>Er ist ${this.createSelect('flexible')} einsetzbar, da ein und dieselbe Maschine durch ein anderes ${this.createSelect('program')} völlig neue Aufgaben lösen kann.</p>
      <p>Daten und Programme werden im ${this.createSelect('same')} Speicher abgelegt, was die ${this.createSelect('storage')} und Anpassung erleichtert.</p>
      <p>Programme können ${this.createSelect('data')} verändern - und umgekehrt.</p>
    `;

    this.clozeText.querySelectorAll('select').forEach((select) => {
      select.addEventListener('change', () => {
        this.state.clozeAnswers[select.dataset.cloze] = select.value;
        this.state.task3Solved = false;
        this.clearFeedback(this.task3Feedback);
        this.saveState();
      });
    });

    if (this.state.task3Revealed || this.state.task3Solved) {
      this.checkTask3({ silent: true });
    }
  }

  createSelect(id) {
    const selected = this.state.clozeAnswers[id] || '';
    const options = [''].concat(this.words)
      .map((word) => {
        const label = word || 'Wort wählen';
        const isSelected = word === selected ? ' selected' : '';
        return `<option value="${word}"${isSelected}>${label}</option>`;
      })
      .join('');

    return `<select data-cloze="${id}" aria-label="Lücke ${id}">${options}</select>`;
  }

  checkTask3(options = {}) {
    let correct = 0;
    this.clozeText.querySelectorAll('select').forEach((select) => {
      const item = this.clozeItems.find((entry) => entry.id === select.dataset.cloze);
      const isCorrect = select.value === item.answer;
      select.classList.toggle('correct', isCorrect);
      select.classList.toggle('incorrect', Boolean(select.value) && !isCorrect);
      if (isCorrect) {
        correct += 1;
      }
    });

    this.state.task3Solved = correct === this.clozeItems.length;

    if (!options.silent) {
      if (this.state.task3Solved) {
        this.setFeedback(this.task3Feedback, 'Sehr gut. Der Lückentext passt zu Aufgabe 3.', 'success');
      } else {
        this.setFeedback(this.task3Feedback, `${correct} von ${this.clozeItems.length} Lücken sind richtig.`, 'error');
      }
      this.saveState();
    }
  }

  renderTask4() {
    const capacity = this.normalizePositiveNumber(this.state.bottleneckCapacity, 3, this.maxBottleneckCapacity);
    const requests = this.normalizePositiveNumber(this.state.bottleneckRequests, 6, this.maxBottleneckRequests);
    const memoryLimit = 30;
    const load = Math.min(100, Math.round((requests / capacity) * 100));
    const memoryPercent = Math.min(100, Math.round((this.state.bottleneckWaiting / memoryLimit) * 100));
    const memoryFull = this.state.bottleneckWaiting >= memoryLimit;

    this.capacityInput.value = String(capacity);
    this.requestInput.value = String(requests);
    this.processedCount.textContent = String(this.state.bottleneckProcessedThisSecond);
    this.waitingCount.textContent = String(this.state.bottleneckWaiting);
    this.bottleneckTime.textContent = `${this.state.bottleneckElapsed} s`;
    this.busLoadText.textContent = `${load}%`;
    this.busLoadBar.style.width = `${load}%`;
    this.memoryFillText.textContent = memoryFull ? '100%' : `${memoryPercent}%`;
    this.bottleneckPacket.textContent = `${capacity}/s`;
    this.bottleneckPacket.classList.toggle('moving', this.state.bottleneckRunning);
    this.bottleneckStartBtn.disabled = this.state.bottleneckRunning || this.state.bottleneckAborted;
    this.bottleneckStopBtn.disabled = !this.state.bottleneckRunning;

    this.requestQueue.innerHTML = '';
    for (let index = 1; index <= Math.min(requests, this.maxBottleneckRequests); index += 1) {
      const chip = document.createElement('span');
      chip.className = `request-chip${index > capacity ? ' waiting' : ' passing'}`;
      chip.textContent = index <= capacity ? '✓' : String(index - capacity);
      chip.title = index <= capacity ? 'Diese Anfrage kann in dieser Sekunde auf den Bus.' : 'Diese Anfrage kommt in die Warteschlange.';
      this.requestQueue.appendChild(chip);
    }

    this.memoryBuffer.innerHTML = '';
    const slots = 15;
    const filledSlots = Math.min(slots, Math.ceil((this.state.bottleneckWaiting / memoryLimit) * slots));
    for (let index = 0; index < slots; index += 1) {
      const slot = document.createElement('span');
      slot.className = `memory-slot${index < filledSlots ? ' filled' : ''}${memoryFull ? ' danger' : ''}`;
      this.memoryBuffer.appendChild(slot);
    }

    this.bottleneckHistory.innerHTML = '';
    const history = Array.isArray(this.state.bottleneckHistory) ? this.state.bottleneckHistory.slice(-6) : [];
    if (!history.length) {
      const emptyRow = document.createElement('p');
      emptyRow.textContent = 'Starte die Simulation: jede Sekunde kommt eine neue Anfragewelle.';
      this.bottleneckHistory.appendChild(emptyRow);
    } else {
      history.forEach((entry) => {
        const row = document.createElement('p');
        row.textContent = `${entry.second} s: ${entry.incoming} kommen an, ${entry.processed} fahren durch, ${entry.waiting} warten.`;
        this.bottleneckHistory.appendChild(row);
      });
    }

    if (this.state.bottleneckAborted) {
      this.setFeedback(this.task4Feedback, `Nach ${this.state.bottleneckElapsed} Sekunden ist der Wartespeicher voll: ${this.state.bottleneckWaiting} Anfragen warten. Das Programm bricht ab.`, 'error');
    } else if (this.state.bottleneckElapsed === 0) {
      this.setFeedback(this.task4Feedback, `Beispiel: Bus = ${capacity}, Anfragen = ${requests}. Starte die Simulation und beobachte, wie der Wartespeicher pro Sekunde wächst.`, '');
    } else if (this.state.bottleneckWaiting === 0) {
      this.setFeedback(this.task4Feedback, `Nach ${this.state.bottleneckElapsed} Sekunden gibt es keinen Stau. Der Bus schafft alle Anfragen.`, 'success');
    } else if (memoryFull) {
      this.setFeedback(this.task4Feedback, `Der Wartespeicher ist voll. Das Programm bricht ab.`, 'error');
    } else {
      this.setFeedback(this.task4Feedback, `Nach ${this.state.bottleneckElapsed} Sekunden warten ${this.state.bottleneckWaiting} Anfragen. Die Leistung des Computers wird gedrosselt, da zunächst vorhandene Anfragen bearbeitet werden müssen.`, '');
    }
  }

  updateBottleneckSettings() {
    this.clearBottleneckTimer();
    this.state.bottleneckCapacity = this.normalizePositiveNumber(this.capacityInput.value, 3, this.maxBottleneckCapacity);
    this.state.bottleneckRequests = this.normalizePositiveNumber(this.requestInput.value, 6, this.maxBottleneckRequests);
    this.resetBottleneckCounters();
    this.renderTask4();
    this.saveState();
  }

  updateBottleneckDraft() {
    this.clearBottleneckTimer();

    const capacity = Number(this.capacityInput.value);
    const requests = Number(this.requestInput.value);
    if (Number.isFinite(capacity) && capacity > 0) {
      this.state.bottleneckCapacity = Math.min(this.maxBottleneckCapacity, Math.floor(capacity));
    }
    if (Number.isFinite(requests) && requests > 0) {
      this.state.bottleneckRequests = Math.min(this.maxBottleneckRequests, Math.floor(requests));
    }

    this.resetBottleneckCounters();
    this.bottleneckStartBtn.disabled = false;
    this.bottleneckStopBtn.disabled = true;
    this.bottleneckPacket.classList.remove('moving');
    this.saveState();
  }

  startBottleneckSimulation() {
    if (this.state.bottleneckRunning || this.state.bottleneckAborted) {
      return;
    }

    this.state.bottleneckCapacity = this.normalizePositiveNumber(this.capacityInput.value, 3, this.maxBottleneckCapacity);
    this.state.bottleneckRequests = this.normalizePositiveNumber(this.requestInput.value, 6, this.maxBottleneckRequests);
    this.state.bottleneckRunning = true;
    this.renderTask4();
    this.saveState();

    this.bottleneckTimer = window.setInterval(() => this.tickBottleneckSimulation(), 1000);
  }

  tickBottleneckSimulation() {
    const capacity = this.normalizePositiveNumber(this.state.bottleneckCapacity, 3, this.maxBottleneckCapacity);
    const requests = this.normalizePositiveNumber(this.state.bottleneckRequests, 6, this.maxBottleneckRequests);
    const available = this.state.bottleneckWaiting + requests;
    const processed = Math.min(capacity, available);

    this.state.bottleneckElapsed += 1;
    const waitingAfterProcessing = Math.max(0, available - processed);

    this.state.bottleneckProcessedThisSecond = processed;
    this.state.bottleneckProcessedTotal += processed;
    this.state.bottleneckWaiting = Math.min(30, waitingAfterProcessing);
    this.state.bottleneckHistory.push({
      second: this.state.bottleneckElapsed,
      incoming: requests,
      processed,
      waiting: this.state.bottleneckWaiting
    });
    this.state.bottleneckHistory = this.state.bottleneckHistory.slice(-10);

    if (waitingAfterProcessing >= 30) {
      this.state.bottleneckAborted = true;
      this.stopBottleneckSimulation('');
    }

    this.renderTask4();
    this.saveState();
  }

  stopBottleneckSimulation(message) {
    this.clearBottleneckTimer();
    this.renderTask4();
    if (message) {
      this.setFeedback(this.task4Feedback, message, '');
    }
  }

  resetBottleneckSimulation() {
    this.stopBottleneckSimulation('');
    this.resetBottleneckCounters();
    this.renderTask4();
    this.saveState();
  }

  clearBottleneckTimer() {
    if (this.bottleneckTimer) {
      window.clearInterval(this.bottleneckTimer);
      this.bottleneckTimer = null;
    }
    this.state.bottleneckRunning = false;
  }

  resetBottleneckCounters() {
    this.state.bottleneckElapsed = 0;
    this.state.bottleneckWaiting = 0;
    this.state.bottleneckProcessedThisSecond = 0;
    this.state.bottleneckProcessedTotal = 0;
    this.state.bottleneckRunning = false;
    this.state.bottleneckAborted = false;
    this.state.bottleneckHistory = [];
  }

  normalizePositiveNumber(rawValue, fallback, max) {
    const value = Number(rawValue);
    if (!Number.isFinite(value)) {
      return fallback;
    }
    return Math.max(1, Math.min(max, Math.floor(value)));
  }

  renderSimulator() {
    const sim = this.state.simulator;
    this.programEditor.value = sim.program;
    this.inputQueue.value = sim.inputDraft || '';
    this.inputQueue.disabled = !sim.pendingInputCell;
    this.submitInputBtn.disabled = !sim.pendingInputCell;
    this.inputQueue.placeholder = sim.pendingInputCell ? `Zahl für ${sim.pendingInputCell}` : 'Warte auf in ...';
    this.inputHint.textContent = sim.pendingInputCell
      ? `Der Befehl ${sim.ir} wartet. Gib jetzt eine Zahl ein und klicke Übernehmen.`
      : 'Bei einem in-Befehl fragt der Rechner hier nach einer Zahl.';
    this.pcValue.textContent = String(sim.pendingInputCell ? sim.activeLine : sim.pc);
    this.irValue.textContent = sim.ir || '-';
    this.accValue.textContent = String(sim.acc);
    this.aluValue.textContent = sim.alu || 'wartet';
    this.ioInputValue.textContent = sim.pendingInputCell ? `wartet auf ${sim.pendingInputCell}` : 'bereit';
    this.ioOutputValue.textContent = sim.output.length ? sim.output.join(', ') : '-';
    this.currentBusText.textContent = sim.busText;

    this.renderMemory();
    this.renderProgramLines();
    if (sim.busVisible) {
      this.moveBusPacket(sim.busFrom, sim.busTo, sim.ir && sim.ir !== '-' ? sim.ir : 'Bus');
    } else {
      this.hideBusPacket();
    }

    const statusType = sim.error ? 'error' : (sim.halted ? 'success' : '');
    const statusText = sim.error || (sim.halted ? 'Programm beendet.' : (sim.pendingInputCell ? `Eingabe für ${sim.pendingInputCell} erforderlich.` : 'Bereit für den nächsten Schritt.'));
    this.setStatus(statusText, statusType);
  }

  renderMemory() {
    const sim = this.state.simulator;
    this.memoryCells.innerHTML = '';
    Object.entries(sim.memory).forEach(([cell, value]) => {
      const item = document.createElement('div');
      item.className = 'memory-cell';
      if (cell === sim.lastChangedCell) {
        item.classList.add('changed');
      }
      item.innerHTML = `<strong>${cell}</strong><span>${value}</span>`;
      this.memoryCells.appendChild(item);
    });
  }

  renderProgramLines() {
    const lines = this.parseProgram(this.state.simulator.program, { allowErrors: true });
    this.programLines.innerHTML = '';

    lines.forEach((line, index) => {
      const row = document.createElement('div');
      row.className = 'program-line';
      const activeIndex = this.state.simulator.activeLine;
      if (index === activeIndex && !this.state.simulator.halted) {
        row.classList.add('active');
      }
      row.innerHTML = `<span>${index}</span><span>${line.raw}</span>`;
      this.programLines.appendChild(row);
    });
  }

  renderExtensionTasks() {
    this.extensionTasksContainer.innerHTML = '';
    const levels = ['Leicht', 'Mittel', 'Schwer'];
    const completed = new Set(this.state.completedTasks);
    const activeTask = this.getActiveTask();

    const activeResult = activeTask ? this.state.taskResults[activeTask.id] : null;
    this.activeTaskBox.textContent = activeTask
      ? `Aktiv: ${activeTask.title}. ${activeTask.test}${activeResult?.length ? ` Letzte Ausgabe: ${activeResult.join(', ')}.` : ''}`
      : 'Keine Aufgabe ausgewählt.';

    levels.forEach((level) => {
      const tasks = this.extensionTasks.filter((task) => task.level === level);
      if (!tasks.length) {
        return;
      }

      const group = document.createElement('section');
      group.className = 'extension-level';
      group.innerHTML = `<h4 class="extension-level-title">${level}</h4>`;

      tasks.forEach((task) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'extension-task';
        button.classList.toggle('completed', completed.has(task.id));
        button.classList.toggle('current', this.state.activeTaskId === task.id);
        const result = this.state.taskResults[task.id];
        const resultLine = result?.length ? `<small class="task-result">Letzte Ausgabe: ${result.join(', ')}</small>` : '';
        button.innerHTML = `
          <strong>${task.title}</strong>
          <span>${task.text}</span>
          <small>${task.test}</small>
          ${resultLine}
          <em>${completed.has(task.id) ? 'geschafft' : 'bearbeiten'}</em>
        `;
        button.addEventListener('click', () => this.selectExtensionTask(task.id));
        group.appendChild(button);
      });

      this.extensionTasksContainer.appendChild(group);
    });
  }

  selectExtensionTask(taskId) {
    const task = this.extensionTasks.find((entry) => entry.id === taskId);
    if (!task) {
      return;
    }

    this.saveCurrentTaskProgram();
    this.stopAutoRun('');
    this.state.activeTaskId = taskId;
    this.state.simulator = this.createFreshSimulatorState(this.state.taskPrograms[taskId] || '');
    this.renderSimulator();
    this.renderExtensionTasks();
    this.saveState();
  }

  saveCurrentTaskProgram() {
    if (!this.state.activeTaskId) {
      return;
    }
    this.state.taskPrograms[this.state.activeTaskId] = this.programEditor?.value ?? this.state.simulator.program;
    this.state.taskResults[this.state.activeTaskId] = [...this.state.simulator.output];
  }

  getActiveTask() {
    return this.extensionTasks.find((task) => task.id === this.state.activeTaskId) || null;
  }

  checkActiveTaskCompletion() {
    const task = this.getActiveTask();
    if (!task) {
      return;
    }

    const output = this.state.simulator.output;
    this.state.taskResults[task.id] = [...output];
    const solved = output.length === task.expectedOutput.length
      && output.every((value, index) => Number(value) === Number(task.expectedOutput[index]));

    if (!solved || this.state.completedTasks.includes(task.id)) {
      return;
    }

    this.state.completedTasks.push(task.id);
    this.setStatus(`Aufgabe "${task.title}" geschafft.`, 'success');
    this.renderExtensionTasks();
  }

  renderCommandGlossary() {
    this.commandGlossaryList.innerHTML = '';
    this.commandGlossary.forEach((entry) => {
      const item = document.createElement('article');
      item.className = 'command-item';
      item.innerHTML = `<h3>${entry.command}</h3><p>${entry.text}</p>`;
      this.commandGlossaryList.appendChild(item);
    });
  }

  showCommandGlossary() {
    this.commandGlossaryModal.hidden = false;
    this.closeCommandGlossary.focus();
  }

  hideCommandGlossary() {
    this.commandGlossaryModal.hidden = true;
    this.openCommandGlossary.focus();
  }

  updateProgramFromEditor() {
    this.state.simulator.program = this.programEditor.value;
    this.saveCurrentTaskProgram();
    this.softResetMachineState();
    this.renderSimulator();
    this.renderExtensionTasks();
    this.saveState();
  }

  updateInputsFromField() {
    this.state.simulator.inputDraft = this.inputQueue.value;
    this.state.simulator.error = '';
    this.saveState();
  }

  submitLiveInput() {
    const sim = this.state.simulator;
    if (!sim.pendingInputCell) {
      return;
    }

    const value = Number(this.inputQueue.value);
    if (!Number.isFinite(value)) {
      sim.error = 'Bitte gib eine gültige Zahl ein.';
      this.renderSimulator();
      this.saveState();
      return;
    }

    const cell = sim.pendingInputCell;
    sim.memory[cell] = value;
    sim.lastChangedCell = cell;
    sim.pendingInputCell = '';
    sim.inputDraft = '';
    sim.activeLine = Math.max(0, sim.pc - 1);
    sim.error = '';
    sim.alu = 'Eingabe gespeichert';
    this.setBus('io', 'memory', `Ein-/Ausgabe sendet ${value} über den Bus an Speicherzelle ${cell}.`);
    this.checkActiveTaskCompletion();
    this.renderSimulator();
    this.saveState();
  }

  loadProgram(program) {
    this.saveCurrentTaskProgram();
    this.stopAutoRun('');
    this.state.activeTaskId = '';
    this.state.simulator = this.createFreshSimulatorState(program);
    this.renderSimulator();
    this.renderExtensionTasks();
    this.saveState();
  }

  resetSimulation() {
    this.stopAutoRun('');
    this.state.simulator = this.createFreshSimulatorState(this.state.simulator.program);
    this.renderSimulator();
    this.saveState();
  }

  softResetMachineState() {
    const program = this.state.simulator.program;
    this.state.simulator = this.createFreshSimulatorState(program);
  }

  stepSimulation() {
    this.stopAutoRun('');
    this.executeStep();
  }

  startAutoRun() {
    if (this.runTimer) {
      return;
    }

    this.executeStep();
    if (this.state.simulator.pendingInputCell || this.state.simulator.halted || this.state.simulator.error) {
      return;
    }

    this.runTimer = window.setInterval(() => {
      if (this.state.simulator.pendingInputCell) {
        this.stopAutoRun('Auto-Lauf pausiert für eine Eingabe.');
        return;
      }
      if (this.state.simulator.halted || this.state.simulator.error) {
        this.stopAutoRun('');
        return;
      }
      this.executeStep();
    }, 950);
  }

  stopAutoRun(message) {
    if (this.runTimer) {
      window.clearInterval(this.runTimer);
      this.runTimer = null;
    }
    if (message) {
      this.setStatus(message, '');
    }
  }

  executeStep() {
    const sim = this.state.simulator;
    if (sim.pendingInputCell) {
      this.setStatus(`Bitte zuerst eine Zahl für ${sim.pendingInputCell} eingeben.`, '');
      this.inputQueue.focus();
      return;
    }

    if (sim.halted) {
      this.setStatus('Das Programm ist bereits beendet. Setze zurück oder lade ein Beispiel.', 'success');
      return;
    }

    try {
      const program = this.parseProgram(sim.program);
      if (sim.pc < 0 || sim.pc >= program.length) {
        sim.halted = true;
        sim.ir = 'end';
        sim.busText = 'Kein weiterer Befehl vorhanden. Das Programm stoppt.';
        sim.busFrom = 'control';
        sim.busTo = 'control';
        this.renderSimulator();
        this.saveState();
        return;
      }

      const instruction = program[sim.pc];
      sim.activeLine = sim.pc;
      sim.ir = instruction.raw;
      sim.pc += 1;
      sim.lastChangedCell = '';
      this.executeInstruction(instruction);
      this.checkActiveTaskCompletion();
    } catch (error) {
      sim.error = error.message || 'Das Programm konnte nicht ausgeführt werden.';
      sim.halted = true;
    }

    this.renderSimulator();
    if (this.state.simulator.pendingInputCell) {
      window.requestAnimationFrame(() => this.inputQueue.focus());
    }
    this.saveState();
  }

  executeInstruction(instruction) {
    const sim = this.state.simulator;
    const op = instruction.op;
    const arg = instruction.arg;

    if (op === 'end') {
      sim.halted = true;
      sim.alu = 'Stopp';
      this.setBus('control', 'control', 'Das Steuerwerk liest end. Das Programm stoppt.');
      return;
    }

    if (!arg && op !== 'end') {
      throw new Error(`Befehl "${op}" braucht einen Wert oder eine Speicherzelle.`);
    }

    switch (op) {
      case 'in': {
        const cell = this.requireCell(arg);
        sim.pendingInputCell = cell;
        sim.inputDraft = '';
        sim.alu = 'wartet auf Eingabe';
        this.setBus('control', 'io', `Der Befehl ${instruction.raw} fordert eine Zahl für Speicherzelle ${cell} an.`);
        break;
      }
      case 'ld': {
        const value = this.resolveValue(arg);
        sim.acc = value;
        sim.alu = `lade ${value}`;
        this.setBus(this.isCell(arg) ? 'memory' : 'control', 'alu', `${arg} wird in den Akku geladen.`);
        break;
      }
      case 'st': {
        const cell = this.requireCell(arg);
        sim.memory[cell] = sim.acc;
        sim.lastChangedCell = cell;
        sim.alu = `speichere ${sim.acc}`;
        this.setBus('alu', 'memory', `Der Akku sendet ${sim.acc} über den Bus an Speicherzelle ${cell}.`);
        break;
      }
      case 'add':
      case 'sub':
      case 'mul':
      case 'div': {
        const value = this.resolveValue(arg);
        const before = sim.acc;
        if (op === 'add') {
          sim.acc += value;
          sim.alu = `${before} + ${value}`;
        }
        if (op === 'sub') {
          sim.acc -= value;
          sim.alu = `${before} - ${value}`;
        }
        if (op === 'mul') {
          sim.acc *= value;
          sim.alu = `${before} * ${value}`;
        }
        if (op === 'div') {
          if (value === 0) {
            throw new Error('Division durch 0 ist nicht erlaubt.');
          }
          sim.acc = before / value;
          sim.alu = `${before} / ${value}`;
        }
        this.setBus(this.isCell(arg) ? 'memory' : 'control', 'alu', `Die ALU rechnet mit ${value}. Im Akku steht jetzt ${sim.acc}.`);
        break;
      }
      case 'out': {
        const value = arg === 'akku' ? sim.acc : this.resolveValue(arg);
        sim.output.push(value);
        sim.alu = `Ausgabe ${value}`;
        this.setBus(arg === 'akku' ? 'alu' : 'memory', 'io', `${value} wandert über den Bus zum Ausgaberegister.`);
        break;
      }
      default:
        throw new Error(`Unbekannter Befehl: ${op}`);
    }
  }

  setBus(from, to, text) {
    const sim = this.state.simulator;
    sim.busFrom = from;
    sim.busTo = to;
    sim.busVisible = true;
    sim.busText = `Fetch: Speicherwerk → Steuerwerk. Ausführen: ${text}`;
  }

  parseProgram(programText, options = {}) {
    const lines = programText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const parsed = lines.map((line) => {
      const parts = line.split(/\s+/);
      const op = (parts[0] || '').toLowerCase();
      const arg = parts.slice(1).join(' ').toLowerCase();
      return { raw: line, op, arg };
    });

    if (!options.allowErrors) {
      parsed.forEach((instruction) => {
        const validOps = ['in', 'ld', 'st', 'add', 'sub', 'mul', 'div', 'out', 'end'];
        if (!validOps.includes(instruction.op)) {
          throw new Error(`Unbekannter Befehl: ${instruction.op}`);
        }
      });
    }

    return parsed;
  }

  resolveValue(valueOrCell) {
    if (this.isCell(valueOrCell)) {
      return Number(this.state.simulator.memory[valueOrCell]);
    }

    const value = Number(valueOrCell);
    if (!Number.isFinite(value)) {
      throw new Error(`"${valueOrCell}" ist keine Speicherzelle und keine Zahl.`);
    }
    return value;
  }

  requireCell(cell) {
    if (!this.isCell(cell)) {
      throw new Error(`"${cell}" ist keine gültige Speicherzelle. Nutze a bis h.`);
    }
    return cell;
  }

  isCell(value) {
    return /^[a-h]$/.test(value || '');
  }

  moveBusPacket(from, to, label) {
    const positions = {
      memory: { left: '45%', top: '42%' },
      control: { left: '55%', top: '20%' },
      alu: { left: '55%', top: '48%' },
      io: { left: '50%', top: '76%' },
      bus: { left: '50%', top: '50%' }
    };

    const start = positions[from] || positions.bus;
    const end = positions[to] || positions.bus;
    const center = positions.bus;

    document.querySelectorAll('.sim-unit').forEach((unit) => {
      unit.classList.toggle('active', unit.dataset.unit === from || unit.dataset.unit === to);
    });

    this.busPacket.textContent = label;
    this.busMoveTimers.forEach((timer) => window.clearTimeout(timer));
    this.busMoveTimers = [];
    const moveToken = (this.busMoveToken += 1);

    this.busPacket.style.transition = 'none';
    this.busPacket.style.opacity = '1';
    this.busPacket.style.left = start.left;
    this.busPacket.style.top = start.top;

    window.requestAnimationFrame(() => {
      if (moveToken !== this.busMoveToken) {
        return;
      }
      this.busPacket.style.transition = 'left 320ms linear, top 320ms linear, opacity 180ms ease';
      this.busPacket.style.left = center.left;
      this.busPacket.style.top = center.top;

      this.busMoveTimers.push(window.setTimeout(() => {
        if (moveToken !== this.busMoveToken) {
          return;
        }
        this.busPacket.style.left = end.left;
        this.busPacket.style.top = end.top;
      }, 330));
    });
  }

  hideBusPacket() {
    this.busMoveTimers.forEach((timer) => window.clearTimeout(timer));
    this.busMoveTimers = [];
    this.busMoveToken += 1;
    this.busPacket.textContent = '';
    this.busPacket.style.opacity = '0';
    document.querySelectorAll('.sim-unit').forEach((unit) => {
      unit.classList.remove('active');
    });
  }

  setFeedback(element, text, type) {
    element.textContent = text;
    element.classList.toggle('success', type === 'success');
    element.classList.toggle('error', type === 'error');
  }

  clearFeedback(element) {
    element.textContent = '';
    element.classList.remove('success', 'error');
  }

  setStatus(text, type) {
    this.simFeedback.textContent = text;
    this.simFeedback.classList.toggle('success', type === 'success');
    this.simFeedback.classList.toggle('error', type === 'error');
  }

  buildSerializableState() {
    const taskPrograms = { ...this.state.taskPrograms };
    const taskResults = { ...this.state.taskResults };
    if (this.state.activeTaskId) {
      taskPrograms[this.state.activeTaskId] = this.programEditor?.value ?? this.state.simulator.program;
      taskResults[this.state.activeTaskId] = [...this.state.simulator.output];
    }

    return {
      ...this.state,
      taskPrograms,
      taskResults,
      savedAt: new Date().toISOString(),
      simulator: {
        ...this.state.simulator,
        program: this.programEditor?.value ?? this.state.simulator.program,
        inputDraft: this.inputQueue?.value ?? this.state.simulator.inputDraft
      }
    };
  }

  applySerializableState(savedState) {
    if (!savedState || typeof savedState !== 'object') {
      return;
    }

    this.isRestoring = true;
    const fresh = this.createInitialState();
    this.state = {
      ...fresh,
      ...savedState,
      assignments: savedState.assignments && typeof savedState.assignments === 'object' ? savedState.assignments : {},
      clozeAnswers: savedState.clozeAnswers && typeof savedState.clozeAnswers === 'object' ? savedState.clozeAnswers : {},
      taskPrograms: savedState.taskPrograms && typeof savedState.taskPrograms === 'object' ? savedState.taskPrograms : {},
      taskResults: savedState.taskResults && typeof savedState.taskResults === 'object' ? savedState.taskResults : {},
      completedTasks: Array.isArray(savedState.completedTasks) ? savedState.completedTasks : [],
      bottleneckHistory: Array.isArray(savedState.bottleneckHistory) ? savedState.bottleneckHistory.slice(-10) : [],
      simulator: {
        ...fresh.simulator,
        ...(savedState.simulator && typeof savedState.simulator === 'object' ? savedState.simulator : {})
      }
    };

    this.state.simulator.memory = {
      ...this.createEmptyMemory(),
      ...(this.state.simulator.memory && typeof this.state.simulator.memory === 'object' ? this.state.simulator.memory : {})
    };

    if (typeof this.state.simulator.inputDraft !== 'string') {
      this.state.simulator.inputDraft = '';
    }
    if (typeof this.state.simulator.pendingInputCell !== 'string') {
      this.state.simulator.pendingInputCell = '';
    }
    this.state.bottleneckCapacity = this.normalizePositiveNumber(this.state.bottleneckCapacity, 3, this.maxBottleneckCapacity);
    this.state.bottleneckRequests = this.normalizePositiveNumber(this.state.bottleneckRequests, 6, this.maxBottleneckRequests);
    this.state.bottleneckRunning = false;
    Object.keys(this.state.taskResults).forEach((taskId) => {
      if (!Array.isArray(this.state.taskResults[taskId])) {
        delete this.state.taskResults[taskId];
      }
    });
    this.state.simulator.activeLine = Math.max(0, Number(this.state.simulator.activeLine) || 0);

    this.isRestoring = false;
    this.renderAll();
  }

  saveState() {
    if (this.isRestoring) {
      return;
    }

    const state = this.buildSerializableState();
    this.state.savedAt = state.savedAt;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch {
      // Keep the page usable if localStorage is unavailable.
    }

    try {
      window.TC6Progress?.saveCurrentPageState?.();
    } catch {
      // Optional bridge only.
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VonNeumannTrainer();
});
