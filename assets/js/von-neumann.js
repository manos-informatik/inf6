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
        level: 'Leicht',
        title: 'Verdoppler',
        text: 'Lies eine Zahl ein, verdopple sie und gib sie aus.',
        program: `in a
ld a
mul 2
out akku
end`
      },
      {
        level: 'Leicht',
        title: 'Durchschnitt von zwei Zahlen',
        text: 'Lies zwei Zahlen ein und gib ihren Durchschnitt aus.',
        program: `in a
in b
ld a
add b
div 2
out akku
end`
      },
      {
        level: 'Mittel',
        title: 'Summe aus drei Zahlen',
        text: 'Lies drei Zahlen ein und gib ihre Summe aus.',
        program: `in a
in b
in c
ld a
add b
add c
out akku
end`
      },
      {
        level: 'Mittel',
        title: 'Differenz mal 2',
        text: 'Ziehe b von a ab, verdopple das Ergebnis und gib es aus.',
        program: `in a
in b
ld a
sub b
mul 2
out akku
end`
      },
      {
        level: 'Schwer',
        title: 'Zwischenergebnis nutzen',
        text: 'Speichere a + b in e, lade e erneut und addiere c.',
        program: `in a
in b
in c
ld a
add b
st e
ld e
add c
out akku
end`
      },
      {
        level: 'Schwer',
        title: 'Erste 5 Fibonacci-Zahlen',
        text: 'Gib 0, 1, 1, 2 und 3 nacheinander aus.',
        program: `ld 0
st a
out a
ld 1
st b
out b
ld a
add b
st c
out c
ld b
add c
st d
out d
ld c
add d
st e
out e
end`
      }
    ];

    this.state = this.createInitialState();
    this.selectedComponent = null;
    this.runTimer = null;
    this.busMoveTimers = [];
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
      bottleneckRequests: 8,
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
      busTo: 'memory'
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
    this.capacitySlider = document.getElementById('capacitySlider');
    this.capacityCountLabel = document.getElementById('capacityCountLabel');
    this.requestSlider = document.getElementById('requestSlider');
    this.requestCountLabel = document.getElementById('requestCountLabel');
    this.requestQueue = document.getElementById('requestQueue');
    this.processedCount = document.getElementById('processedCount');
    this.waitingCount = document.getElementById('waitingCount');
    this.busLoadText = document.getElementById('busLoadText');
    this.busLoadBar = document.getElementById('busLoadBar');
    this.memoryFillText = document.getElementById('memoryFillText');
    this.memoryBuffer = document.getElementById('memoryBuffer');
    this.bottleneckPacket = document.getElementById('bottleneckPacket');
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

    this.capacitySlider.addEventListener('input', () => {
      this.state.bottleneckCapacity = Number(this.capacitySlider.value);
      this.renderTask4();
      this.saveState();
    });

    this.requestSlider.addEventListener('input', () => {
      this.state.bottleneckRequests = Number(this.requestSlider.value);
      this.renderTask4();
      this.saveState();
    });

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

    window.addEventListener('beforeunload', () => {
      this.stopAutoRun('');
      this.saveState();
    });
  }

  renderAll() {
    this.renderTask2();
    this.renderTask3();
    this.renderTask4();
    this.renderSimulator();
    this.renderExtensionTasks();
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
    const capacity = Math.max(1, Math.min(6, Number(this.state.bottleneckCapacity) || 3));
    const requests = Math.max(1, Math.min(12, Number(this.state.bottleneckRequests) || 8));
    const processed = Math.min(capacity, requests);
    const waiting = Math.max(0, requests - capacity);
    const load = Math.min(100, Math.round((requests / capacity) * 100));
    const memoryLimit = 12;
    const memoryFill = Math.min(memoryLimit, waiting * 3);
    const memoryFull = memoryFill >= memoryLimit;

    this.capacitySlider.value = String(capacity);
    this.requestSlider.value = String(requests);
    this.capacityCountLabel.textContent = String(capacity);
    this.requestCountLabel.textContent = String(requests);
    this.processedCount.textContent = String(processed);
    this.waitingCount.textContent = String(waiting);
    this.busLoadText.textContent = `${load}%`;
    this.busLoadBar.style.width = `${load}%`;
    this.memoryFillText.textContent = memoryFull ? 'voll' : `${memoryFill}/${memoryLimit}`;
    this.bottleneckPacket.textContent = `${processed}/s`;

    this.requestQueue.innerHTML = '';
    for (let index = 1; index <= requests; index += 1) {
      const chip = document.createElement('span');
      chip.className = `request-chip${index > capacity ? ' waiting' : ' passing'}`;
      chip.textContent = index <= capacity ? '✓' : String(index - capacity);
      chip.title = index <= capacity ? 'Diese Anfrage passt in dieser Sekunde auf den Bus.' : 'Diese Anfrage muss warten.';
      this.requestQueue.appendChild(chip);
    }

    this.memoryBuffer.innerHTML = '';
    for (let index = 0; index < memoryLimit; index += 1) {
      const slot = document.createElement('span');
      slot.className = `memory-slot${index < memoryFill ? ' filled' : ''}${memoryFull ? ' danger' : ''}`;
      this.memoryBuffer.appendChild(slot);
    }

    if (waiting === 0) {
      this.setFeedback(this.task4Feedback, `Der Bus schafft ${capacity} pro Sekunde. Bei ${requests} Anfragen entsteht kein Stau.`, 'success');
    } else if (memoryFull) {
      this.setFeedback(this.task4Feedback, `Flaschenhals: Der Bus schafft ${capacity}, aber ${requests} Anfragen kommen pro Sekunde. Der Wartespeicher läuft voll, das Programm bricht ab.`, 'error');
    } else {
      this.setFeedback(this.task4Feedback, `Engpass: ${processed} werden verarbeitet, ${waiting} pro Sekunde müssen warten. Der Wartespeicher füllt sich.`, '');
    }
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
    this.ioOutputValue.textContent = sim.output.length ? String(sim.output[sim.output.length - 1]) : '-';
    this.currentBusText.textContent = sim.busText;

    this.renderMemory();
    this.renderProgramLines();
    this.moveBusPacket(sim.busFrom, sim.busTo, sim.ir && sim.ir !== '-' ? sim.ir : 'Bus');

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
      const activeIndex = this.state.simulator.pendingInputCell
        ? this.state.simulator.activeLine
        : this.state.simulator.pc;
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
        button.innerHTML = `<strong>${task.title}</strong>${task.text}`;
        button.addEventListener('click', () => this.loadProgram(task.program));
        group.appendChild(button);
      });

      this.extensionTasksContainer.appendChild(group);
    });
  }

  updateProgramFromEditor() {
    this.state.simulator.program = this.programEditor.value;
    this.softResetMachineState();
    this.renderSimulator();
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
    sim.activeLine = sim.pc;
    sim.error = '';
    sim.alu = 'Eingabe gespeichert';
    this.setBus('io', 'memory', `Ein-/Ausgabe sendet ${value} über den Bus an Speicherzelle ${cell}.`);
    this.renderSimulator();
    this.saveState();
  }

  loadProgram(program) {
    this.stopAutoRun('');
    this.state.simulator = this.createFreshSimulatorState(program);
    this.renderSimulator();
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

    this.busPacket.style.transition = 'none';
    this.busPacket.style.left = start.left;
    this.busPacket.style.top = start.top;

    window.requestAnimationFrame(() => {
      this.busPacket.style.transition = 'left 320ms linear, top 320ms linear, opacity 180ms ease';
      this.busPacket.style.left = center.left;
      this.busPacket.style.top = center.top;

      this.busMoveTimers.push(window.setTimeout(() => {
        this.busPacket.style.left = end.left;
        this.busPacket.style.top = end.top;
      }, 330));
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
    return {
      ...this.state,
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
    this.state.bottleneckCapacity = Math.max(1, Math.min(6, Number(this.state.bottleneckCapacity) || 3));
    this.state.bottleneckRequests = Math.max(1, Math.min(12, Number(this.state.bottleneckRequests) || 8));
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
