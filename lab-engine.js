/**
 * Laboratory Engine for Evaluation of Leather Colour Fastness to Perspiration
 * Standard: ISO 11641:2012 / IUP 15 / SATRA TM426 / ISO 105-E04
 * Professional Slide Deck Architecture with 8 Slides including Comprehensive Results & Grade Interpretation
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentSlide: 1,
    maxUnlockedSlide: 1, // Strict sequential gate: student cannot skip ahead until current step is done
    specimenId: 'calf-black',
    solutionType: 'acidic', // 'acidic' (pH 5.5) or 'alkaline' (pH 8.0)

    step1: {
      stitched: false
    },
    step2: {
      balanceTared: false,
      reagentsWeighed: false,
      currentPH: 6.80,
      phCalibrated: false
    },
    step3: {
      immersed: false,
      pressedCount: 0,
      dwellProgress: 0,
      dwellComplete: false
    },
    step4: {
      platesInserted: false,
      weightApplied: false,
      screwsTightened: 0, // needs 2
      weightRemoved: false,
      locked: false
    },
    step5: {
      ovenLoaded: false,
      ovenRunning: false,
      cycleProgress: 0,
      cycleComplete: false
    },
    step6: {
      unfolded: false,
      conditioned: false
    },
    step7: {
      selectedChangeGrade: null,
      selectedStaining: {
        CA: null, CO: null, PA: null, PES: null, PAC: null, WO: null
      }
    },
    step8: {
      reviewed: true
    }
  };

  const $ = (id) => document.getElementById(id);

  function getSpecimen() {
    return window.LAB_STANDARDS.specimens.find(s => s.id === state.specimenId) || window.LAB_STANDARDS.specimens[0];
  }

  function getReagentConfig() {
    return window.LAB_STANDARDS.reagents[state.solutionType];
  }

  // Populate Apparatus Checklist in Sidebar
  function renderApparatusChecklist(stepNum) {
    const listEl = $('apparatus-checklist-content');
    if (!listEl) return;
    const items = window.LAB_STANDARDS.stepApparatusDirectory[stepNum] || [];
    let html = '';
    items.forEach(item => {
      html += `
        <li class="checklist-item">
          <span class="checklist-bullet">&bull;</span>
          <div>
            <strong>${item.name}</strong>
            <span class="item-spec-note">${item.spec}</span>
          </div>
        </li>
      `;
    });
    listEl.innerHTML = html;
  }

  // Populate "What to do" & "How to do" Guide Panes
  function renderGuidePanes(stepNum) {
    const guide = window.LAB_STANDARDS.studentPracticalGuide[stepNum];
    if (!guide) return;
    const whatEl = $('guide-what-content');
    const howEl = $('guide-how-content');
    if (whatEl) whatEl.innerHTML = guide.what;
    if (howEl) howEl.innerHTML = guide.how;
  }

  // Step Completion Gatekeeper (1 to 8)
  function isStepCompleted(stepNum) {
    switch (stepNum) {
      case 1: return state.step1.stitched;
      case 2: return state.step2.reagentsWeighed && state.step2.phCalibrated;
      case 3: return state.step3.immersed && state.step3.pressedCount >= 3 && state.step3.dwellComplete;
      case 4: return state.step4.platesInserted && state.step4.locked;
      case 5: return state.step5.cycleComplete;
      case 6: return state.step6.unfolded && state.step6.conditioned;
      case 7: return (state.step7.selectedChangeGrade !== null);
      case 8: return true;
      default: return false;
    }
  }

  // Update Next Step Button & Progress Bar Lock State
  function updateStepLockState() {
    const completed = isStepCompleted(state.currentSlide);
    const badge = $('step-completion-badge');
    const actionBanner = $('sop-action-content');
    const nextBtn = $('btn-slide-next');

    if (completed) {
      if (state.maxUnlockedSlide < state.currentSlide + 1 && state.currentSlide < 8) {
        state.maxUnlockedSlide = state.currentSlide + 1;
      }
      if (badge) {
        badge.textContent = (state.currentSlide === 8) 
          ? "EXPERIMENT COMPLETE - RESULTS CERTIFIED"
          : "STEP COMPLETED - NEXT STEP UNLOCKED";
        badge.className = "step-status-tag unlocked";
      }
      if (actionBanner) {
        actionBanner.className = "directed-action-banner";
      }
      if (nextBtn) {
        nextBtn.disabled = (state.currentSlide === 8);
      }
    } else {
      if (badge) {
        badge.textContent = "STEP INCOMPLETE - COMPLETE ACTIONS FIRST";
        badge.className = "step-status-tag locked";
      }
      if (actionBanner) {
        actionBanner.className = "directed-action-banner pending";
      }
      if (nextBtn) {
        nextBtn.disabled = true; // Strict lock!
      }
    }

    // Refresh progress strip clickability
    document.querySelectorAll('.progress-step').forEach((el, idx) => {
      const stepIdx = idx + 1;
      el.classList.remove('active', 'completed', 'disabled');
      if (stepIdx === state.currentSlide) {
        el.classList.add('active');
      } else if (isStepCompleted(stepIdx)) {
        el.classList.add('completed');
      } else if (stepIdx > state.maxUnlockedSlide) {
        el.classList.add('disabled');
      }
    });
  }

  // Slide Metadata Matrix (1 to 8)
  const slideMetadata = [
    {
      step: 1,
      title: "Specimen Sampling & Composite Sandwich Preparation",
      subtitle: "Sampling from official butt location (ISO 2418) and composite stitching (ISO 11641)",
      standard: "ISO 11641 Clause 5.1 & ISO 2418"
    },
    {
      step: 2,
      title: "Artificial Perspiration Preparation & pH Standardization",
      subtitle: "Analytical weighing of reagents and glass electrode calibration",
      standard: "ISO 11641 Clause 4.1 / 4.2"
    },
    {
      step: 3,
      title: "Liquor Impregnation & Mechanical De-aeration",
      subtitle: "Immersion at 50:1 liquor ratio and glass rod compaction for 100% wet pickup",
      standard: "ISO 11641 Clause 6.1"
    },
    {
      step: 4,
      title: "Perspirometer Assembly & 12.5 kPa Mechanical Loading",
      subtitle: "Placement between acrylic plates and spring tension locking under 4.50 kg load",
      standard: "ISO 11641 Clause 5.2 / SATRA TM426"
    },
    {
      step: 5,
      title: "Thermostatic Dwell in Air-Circulating Incubator (37.0 °C)",
      subtitle: "Controlled physiological thermal exposure for 4 hours ± 10 minutes",
      standard: "ISO 11641 Clause 6.2"
    },
    {
      step: 6,
      title: "Apparatus Disassembly & Specimen Conditioning",
      subtitle: "Unfolding at stitched hinge and drying in conditioning atmosphere (20 °C, 65% RH)",
      standard: "ISO 11641 Clause 6.3 & ISO 2419"
    },
    {
      step: 7,
      title: "Visual Colour Fastness Assessment in D65 Viewing Cabinet",
      subtitle: "Instrumental visual grading against ISO 105-A02 and ISO 105-A03 Grey Scales",
      standard: "ISO 105-A01, ISO 105-A02, ISO 105-A03"
    },
    {
      step: 8,
      title: "Comprehensive Test Results & Engineering Interpretation",
      subtitle: "Analytical assessment of grey scale ratings, footwear tolerances, and failure analysis",
      standard: "ISO 11641 / SATRA TM426 / ISO 105"
    }
  ];

  // Navigation Controller
  function goToSlide(slideNum) {
    if (slideNum < 1 || slideNum > 8) return;
    if (slideNum > state.maxUnlockedSlide) {
      alert("Please complete the current laboratory step before proceeding to the next step.");
      return;
    }
    state.currentSlide = slideNum;

    // Update Banner & Headers
    const meta = slideMetadata[slideNum - 1];
    $('slide-number-display').textContent = `Slide ${slideNum} of 8`;
    $('slide-title-display').textContent = meta.title;
    $('slide-subtitle-display').textContent = meta.subtitle;
    $('slide-standard-display').textContent = meta.standard;
    $('slide-progress-counter').textContent = `Step ${slideNum} of 8`;

    // Render Apparatus Checklist & Guide Panes
    renderApparatusChecklist(slideNum);
    renderGuidePanes(slideNum);

    // Update Nav Buttons
    $('btn-slide-prev').disabled = (slideNum === 1);

    // Render Viewport
    switch (slideNum) {
      case 1: renderSlide1(); break;
      case 2: renderSlide2(); break;
      case 3: renderSlide3(); break;
      case 4: renderSlide4(); break;
      case 5: renderSlide5(); break;
      case 6: renderSlide6(); break;
      case 7: renderSlide7(); break;
      case 8: renderSlide8(); break;
    }

    updateStepLockState();
  }

  // ==========================================
  // SLIDE 1: Specimen Sampling & Stitching
  // ==========================================
  function renderSlide1() {
    const spec = getSpecimen();
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Cut a specimen of leather measuring <strong>100 mm × 40 mm</strong> from the official sampling position (butt region) specified in <strong>ISO 2418</strong> using a precision cutting die.
      Prepare a matching piece of multifibre adjacent fabric (<strong>ISO 105-F10 Type DW</strong>) of identical dimensions (100 mm × 40 mm).
      Place the grain surface of the leather in intimate face-to-face contact with the multifibre fabric and join along one of the 40 mm short edges using monofilament synthetic thread.
    `;

    sopAction.textContent = state.step1.stitched 
      ? "Step Complete: Composite sandwich assembled. Proceed to Step 2 using 'Next Step'."
      : "Required Action: Click 'Stitch Composite Sandwich' to join leather grain to multifibre fabric.";

    bench.innerHTML = `
      <div class="specimen-stage-display">
        <div class="specimen-pair-canvas">
          
          <!-- Realistic Leather Specimen -->
          <div class="realistic-leather-swatch leather-${spec.grainType}" style="background-color: ${spec.baseColor};" title="Test Specimen: ${spec.name}">
            <div style="font-size:0.75rem; font-weight:700; color:#fff; text-shadow:0 1px 2px #000; text-transform:uppercase;">
              Leather Specimen
            </div>
            
            <div style="font-size:0.78rem; font-weight:600; color:#fff; text-shadow:0 1px 2px #000; line-height:1.3;">
              ${spec.name}<br>
              <span style="font-size:0.68rem; font-weight:400; opacity:0.9;">Tannage: ${spec.tannage}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <span class="leather-dimension-stamp">100 mm × 40 mm</span>
              <span style="font-size:0.65rem; color:#fff; text-shadow:0 1px 2px #000; font-family:var(--font-mono);">GRAIN SIDE</span>
            </div>
          </div>

          <div style="font-size:1.4rem; font-weight:700; color:#64748b;">+</div>

          <!-- Realistic Multifibre DW Strip -->
          <div class="realistic-multifibre-strip" title="Multifibre Adjacent Fabric (ISO 105-F10 DW)">
            <div class="multifibre-stripe stripe-acetate"><span>Acetate (CA)</span><span>DW-1</span></div>
            <div class="multifibre-stripe stripe-cotton"><span>Bleached Cotton (CO)</span><span>DW-2</span></div>
            <div class="multifibre-stripe stripe-polyamide"><span>Polyamide 6.6 (PA)</span><span>DW-3</span></div>
            <div class="multifibre-stripe stripe-polyester"><span>Polyester (PES)</span><span>DW-4</span></div>
            <div class="multifibre-stripe stripe-acrylic"><span>Acrylic (PAC)</span><span>DW-5</span></div>
            <div class="multifibre-stripe stripe-wool"><span>Wool (WO)</span><span>DW-6</span></div>
          </div>

        </div>

        <!-- Stitched Composite Result -->
        <div id="slide1-stitched-preview" style="display:${state.step1.stitched ? 'block' : 'none'};">
          <div class="stitched-composite-visual">
            <div class="seam-stitching-header">
              <span>STITCHED SEAM (40 mm)</span>
              <span>ISO 11641</span>
            </div>
            <div class="leather-${spec.grainType}" style="flex:1; background-color:${spec.baseColor}; padding:0.85rem; color:#fff; display:flex; flex-direction:column; justify-content:space-between;">
              <span style="font-size:0.75rem; font-weight:700; text-shadow:0 1px 2px #000;">COMPOSITE TEST SANDWICH</span>
              <span style="font-size:0.7rem; font-family:var(--font-mono); text-shadow:0 1px 2px #000;">Grain facing Multifibre DW strip</span>
              <span style="font-size:0.65rem; font-family:var(--font-mono); text-align:right; text-shadow:0 1px 2px #000;">100 mm × 40 mm</span>
            </div>
          </div>
        </div>

      </div>
    `;

    controls.innerHTML = `
      <button id="btn-stitch-sandwich" class="btn-action-primary">
        ${state.step1.stitched ? "Composite Sandwich Assembled & Stitched" : "Stitch Composite Sandwich (Grain to Fabric)"}
      </button>
    `;

    updateTelemetry(
      "Specimen Sandwich Status",
      "Dimensions",
      state.step1.stitched ? "100 mm × 40 mm (Assembled)" : "Unassembled",
      state.step1.stitched ? "Composite sandwich assembled and ready for immersion" : "Awaiting alignment and cross-stitching",
      state.step1.stitched
    );

    $('btn-stitch-sandwich').onclick = () => {
      state.step1.stitched = true;
      $('slide1-stitched-preview').style.display = 'block';
      $('btn-stitch-sandwich').textContent = "Composite Sandwich Assembled & Stitched";
      updateTelemetry(
        "Specimen Sandwich Status",
        "Dimensions",
        "100 mm × 40 mm (Assembled)",
        "Composite sandwich assembled and ready for immersion",
        true
      );
      updateStepLockState();
    };
  }

  // ==========================================
  // SLIDE 2: Reagents & pH Standardization (High-Contrast Crucible)
  // ==========================================
  function renderSlide2() {
    const config = getReagentConfig();
    const isAcid = state.solutionType === 'acidic';
    const targetPH = config.targetPH;
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Prepare fresh synthetic perspiration solution conforming to <strong>ISO 11641</strong>:
      Dissolve <strong>0.50 g L-Histidine monohydrochloride monohydrate</strong>, 
      <strong>5.00 g Sodium chloride</strong>, and 
      <strong>${isAcid ? '2.20 g NaH2PO4·2H2O' : '2.50 g Na2HPO4·2H2O'}</strong> in grade 3 distilled water; make up to 1000 mL in a Class A volumetric flask.
      Immerse calibrated glass combination electrode and adjust potentiometrically to 
      <strong>pH ${targetPH.toFixed(1)} ± 0.2</strong> using 0.1 mol/L NaOH or dilute acid.
    `;

    sopAction.textContent = (state.step2.reagentsWeighed && state.step2.phCalibrated)
      ? "Step Complete: Solution standardized. Proceed to Step 3 using 'Next Step'."
      : "Required Action: Tare balance, click 'Weigh Reagents' to dispense salts, then titrate until pH is within ± 0.2.";

    bench.innerHTML = `
      <div class="weighing-rig-complete">
        
        <!-- Amber Chemical Reagent Bottle -->
        <div class="amber-reagent-bottle" title="L-Histidine Monohydrochloride Reagent">
          <div class="bottle-stopper"></div>
          <div class="bottle-chem-label">
            L-HISTIDINE<br>0.50 g/L<br>ISO 11641
          </div>
        </div>

        <!-- Mettler Toledo Analytical Balance with Spatula & Dark High-Contrast Crucible -->
        <div class="realistic-balance-station">
          <div style="font-size:0.75rem; font-weight:700; color:#334155; text-transform:uppercase;">
            Analytical Balance (0.001 g)
          </div>
          <div class="balance-draft-glass-hood">
            <div class="balance-leveling-bubble" title="Level Indicator"><div class="bubble-center-dot"></div></div>
            
            <!-- Animated Laboratory Spatula -->
            <div id="spatula-element" class="lab-spatula-visual">
              <div class="spatula-powder-tip" id="spatula-tip"></div>
            </div>

            <div id="falling-grains-stream" class="falling-grains-stream" style="display:none;"></div>

            <!-- Deep Ceramic High-Contrast Crucible -->
            <div class="weighing-boat-realistic" title="High-Contrast Laboratory Crucible">
              <div class="crucible-lip-rim"></div>
              <div class="white-powder-crystals" id="salt-crystals" style="opacity:${state.step2.reagentsWeighed ? '1' : '0'}; transform:${state.step2.reagentsWeighed ? 'scale(1)' : 'scale(0.3)'};"></div>
            </div>
            <div class="balance-pan-realistic"></div>
          </div>
          <div class="balance-display-strip">
            <span style="font-size:0.7rem; color:#94a3b8; font-family:var(--font-mono);">METTLER TOLEDO</span>
            <div class="balance-vfd-digits" id="live-balance-value">
              ${state.step2.reagentsWeighed ? (isAcid ? '7.700 g' : '8.000 g') : (state.step2.balanceTared ? '0.000 g' : '0.000 g')}
            </div>
          </div>
        </div>

        <!-- Digital Benchtop pH Meter with Glass Combination Electrode -->
        <div class="ph-measurement-rig">
          <div class="ph-benchtop-console">
            <div style="font-size:0.72rem; font-weight:700; color:#475569; text-transform:uppercase;">
              Digital pH Meter
            </div>
            <div class="ph-console-screen">
              <div class="ph-big-reading" id="live-ph-reading">${state.step2.currentPH.toFixed(2)}</div>
              <div class="ph-screen-meta">
                <span>ATC: 20.0 °C</span>
                <span>CAL: PASS</span>
              </div>
            </div>
          </div>

          <div class="beaker-container-realistic">
            <div class="glass-combination-electrode">
              <div class="electrode-tip-bulb"></div>
            </div>

            <div class="beaker-fluid-body">
              <div class="magnetic-stir-bar"></div>
              <div style="font-size:0.65rem; font-family:var(--font-mono); color:#0369a1; text-align:center; padding-top:12px;">
                ${config.title}
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    controls.innerHTML = `
      <div style="display:flex; gap:0.5rem;">
        <button id="btn-tare-scale" class="btn-action-secondary" style="flex:1;">Tare Balance</button>
        <button id="btn-weigh-salts" class="btn-action-secondary" style="flex:1;">Weigh Reagents</button>
      </div>
      <div style="display:flex; gap:0.5rem; margin-top:0.35rem;">
        <button id="btn-titrate-acid" class="btn-action-secondary" style="flex:1;">- 0.1 M Acid</button>
        <button id="btn-titrate-base" class="btn-action-secondary" style="flex:1;">+ 0.1 M NaOH</button>
      </div>
    `;

    const checkCalibration = () => {
      const diff = Math.abs(state.step2.currentPH - targetPH);
      state.step2.phCalibrated = (diff <= 0.205);
      const isOk = state.step2.phCalibrated;

      const digits = $('live-ph-reading');
      if (digits) {
        digits.textContent = state.step2.currentPH.toFixed(2);
        digits.style.color = isOk ? '#22c55e' : '#ef4444';
      }

      updateTelemetry(
        "Potentiometric Reading",
        "pH Units",
        `pH ${state.step2.currentPH.toFixed(2)}`,
        isOk ? `Standard compliant (${targetPH.toFixed(1)} ± 0.2)` : `Non-compliant: Adjust to target ${targetPH.toFixed(1)} ± 0.2`,
        isOk
      );

      updateStepLockState();
    };

    $('btn-tare-scale').onclick = () => {
      state.step2.balanceTared = true;
      $('live-balance-value').textContent = "0.000 g";
    };

    $('btn-weigh-salts').onclick = () => {
      const spatula = $('spatula-element');
      const stream = $('falling-grains-stream');
      const crystals = $('salt-crystals');
      if (spatula) spatula.classList.add('spatula-pouring-anim');
      if (stream) stream.style.display = 'block';

      setTimeout(() => {
        state.step2.reagentsWeighed = true;
        $('live-balance-value').textContent = isAcid ? "7.700 g" : "8.000 g";
        if (crystals) {
          crystals.style.opacity = '1';
          crystals.style.transform = 'scale(1)';
        }
        if (stream) stream.style.display = 'none';
        checkCalibration();
      }, 700);
    };

    $('btn-titrate-acid').onclick = () => {
      state.step2.currentPH = Math.max(3.0, +(state.step2.currentPH - 0.2).toFixed(2));
      checkCalibration();
    };

    $('btn-titrate-base').onclick = () => {
      state.step2.currentPH = Math.min(11.0, +(state.step2.currentPH + 0.2).toFixed(2));
      checkCalibration();
    };

    checkCalibration();
  }

  // ==========================================
  // SLIDE 3: Impregnation & Liquor Uptake
  // ==========================================
  function renderSlide3() {
    const spec = getSpecimen();
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Place the composite specimen into a flat-bottomed borosilicate crystallization dish containing synthetic perspiration.
      Maintain a liquor ratio of at least <strong>50:1</strong> (minimum 50 mL solution).
      Soak for <strong>30 minutes</strong> at room temperature (20 °C). 
      Press gently with a polished glass stirring rod to expel air pockets between the leather and the adjacent fabric.
      Pass specimen between two parallel glass rods or blot lightly on filter paper to leave exactly 100% wet pick-up.
    `;

    sopAction.textContent = (state.step3.dwellComplete)
      ? "Step Complete: 30-min soak finished (100% pickup). Proceed to Step 4 using 'Next Step'."
      : "Required Action: Immerse specimen, press 3 times with the glass rod to dislodge trapped bubbles, then run the 30-min soak timer.";

    bench.innerHTML = `
      <div class="soaking-bench-assembly">
        
        <div class="crystallization-dish-viewport">
          <div class="dish-grad-line" style="top:45px;"></div>
          <span class="dish-grad-text" style="top:39px;">50 mL LIQUOR (50:1 RATIO)</span>

          <!-- Submerged Specimen -->
          <div id="tray-specimen-submerged" class="leather-${spec.grainType}" style="width:220px; height:110px; background-color:${spec.baseColor}; border:1px solid #334155; border-radius:2px; box-shadow:0 3px 8px rgba(0,0,0,0.35); opacity:${state.step3.immersed ? '0.9' : '0.25'}; transition:opacity 0.3s; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.72rem; font-family:var(--font-mono); font-weight:700; text-shadow:0 1px 2px #000; position:relative;">
            ${state.step3.immersed ? "SUBMERGED COMPOSITE SPECIMEN" : "EMPTY TRAY (CLICK IMMERSE)"}

            <!-- Trapped Bubbles -->
            <div id="bubble-1" class="submerged-bubble" style="top:10px; left:25px; display:${state.step3.immersed && state.step3.pressedCount < 1 ? 'block' : 'none'};"></div>
            <div id="bubble-2" class="submerged-bubble" style="bottom:15px; left:95px; display:${state.step3.immersed && state.step3.pressedCount < 2 ? 'block' : 'none'};"></div>
            <div id="bubble-3" class="submerged-bubble" style="top:25px; right:35px; display:${state.step3.immersed && state.step3.pressedCount < 3 ? 'block' : 'none'};"></div>
          </div>

          <!-- Fire-Polished Glass Stirring Rod -->
          <div id="glass-stirring-rod" class="glass-stirring-rod-lifelike" title="Polished Glass Stirring Rod (Click to Tamp Specimen)">
            <div class="glass-rod-tip-bead"></div>
          </div>
        </div>

        <div style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono);">
          Bath Ratio: 50:1 | Volume: 50 mL | Temp: 20.0 °C | Air Expulsion: ${state.step3.pressedCount}/3 Press cycles
        </div>

      </div>
    `;

    controls.innerHTML = `
      <button id="btn-dish-immerse" class="btn-action-secondary" ${state.step3.immersed ? 'disabled' : ''}>
        1. Immerse Specimen in Solution
      </button>
      <button id="btn-dish-press" class="btn-action-secondary" ${state.step3.immersed && state.step3.pressedCount < 3 ? '' : 'disabled'}>
        2. Press with Glass Rod (${state.step3.pressedCount}/3)
      </button>
      <button id="btn-dish-dwell" class="btn-action-primary" ${state.step3.pressedCount >= 3 && !state.step3.dwellComplete ? '' : 'disabled'}>
        3. Run 30-Min Soak Timer
      </button>
    `;

    updateTelemetry(
      "Impregnation Dwell",
      "Duration",
      state.step3.dwellComplete ? "30 min (Completed)" : `${state.step3.dwellProgress} min`,
      state.step3.dwellComplete ? "Full liquor uptake (100% absorption) achieved" : "Dwell in progress",
      state.step3.dwellComplete
    );

    $('btn-dish-immerse').onclick = () => {
      state.step3.immersed = true;
      renderSlide3();
    };

    const tampWithRod = () => {
      if (!state.step3.immersed || state.step3.pressedCount >= 3) return;
      const rod = $('glass-stirring-rod');
      if (rod) rod.classList.add('rod-pressing-action');
      setTimeout(() => {
        if (rod) rod.classList.remove('rod-pressing-action');
        state.step3.pressedCount = Math.min(3, state.step3.pressedCount + 1);
        renderSlide3();
      }, 500);
    };

    $('btn-dish-press').onclick = tampWithRod;
    $('glass-stirring-rod').onclick = tampWithRod;

    $('btn-dish-dwell').onclick = () => {
      $('btn-dish-dwell').disabled = true;
      let val = 0;
      const timer = setInterval(() => {
        val += 6;
        state.step3.dwellProgress = val;
        updateTelemetry(
          "Impregnation Dwell",
          "Duration",
          `${val} min`,
          "Simulating 30-minute dwell",
          false
        );
        if (val >= 30) {
          clearInterval(timer);
          state.step3.dwellComplete = true;
          updateTelemetry(
            "Impregnation Dwell",
            "Duration",
            "30 min (Completed)",
            "Full liquor uptake (100% absorption) achieved",
            true
          );
          updateStepLockState();
        }
      }, 150);
    };
  }

  // ==========================================
  // SLIDE 4: Perspirometer Assembly & Loading
  // ==========================================
  function renderSlide4() {
    const spec = getSpecimen();
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Place the wet composite specimen flat between two smooth acrylic separator plates (115 mm × 60 mm × 1.5 mm).
      Mount the plates into the stainless steel perspirometer frame.
      Apply the calibrated dead weight mass of <strong>4.50 kg</strong> (exerting <strong>12.5 ± 0.9 kPa</strong> uniform pressure).
      Tighten the two knurled thumb nuts evenly to compress the internal calibrated springs and lock the pressure, then lift off the dead weight before oven transfer.
    `;

    sopAction.textContent = (state.step4.locked)
      ? "Step Complete: Perspirometer clamped under 12.5 kPa. Proceed to Step 5 using 'Next Step'."
      : "Required Action: Insert specimen between plates, apply 4.50 kg load, tighten both locking nuts, then remove dead load.";

    bench.innerHTML = `
      <div class="perspirometer-frame-visual">
        <div class="perspirometer-cross-bridge">
          <div class="knurled-locking-nut ${state.step4.screwsTightened >= 1 ? 'clamped' : ''}" id="nut-left" title="Knurled Locking Nut (Left)"></div>
          <div style="font-size:0.75rem; font-weight:700; color:#fff; font-family:var(--font-mono);">
            PERSPIROMETER CLAMP FRAME
          </div>
          <div class="knurled-locking-nut ${state.step4.screwsTightened >= 2 ? 'clamped' : ''}" id="nut-right" title="Knurled Locking Nut (Right)"></div>
        </div>

        <div class="solid-dead-weight-mass" id="dead-weight-cyl" style="opacity:${state.step4.weightApplied && !state.step4.weightRemoved ? '1' : '0.2'}; transform:${state.step4.weightApplied && !state.step4.weightRemoved ? 'translateY(0)' : 'translateY(-15px)'};">
          MASS: 4.50 kg
          <span style="font-size:0.65rem; font-weight:400; opacity:0.85;">P = 12.5 ± 0.9 kPa</span>
        </div>

        <div class="acrylic-pack-holder">
          <div class="acrylic-separator-plate" title="Acrylic Plate (Top)"></div>
          <div class="specimen-clamped-layer leather-${spec.grainType}" style="background-color:${spec.baseColor}; opacity:${state.step4.platesInserted ? '1' : '0.25'};">
            ${state.step4.platesInserted ? "COMPOSITE SPECIMEN SANDWICH" : "EMPTY PLATE SLOT"}
          </div>
          <div class="acrylic-separator-plate" title="Acrylic Plate (Bottom)"></div>
        </div>

        <div style="font-size:0.7rem; color:#475569; font-family:var(--font-mono); margin-top:0.75rem;">
          Conforming to ISO 11641 / SATRA TM426
        </div>
      </div>
    `;

    controls.innerHTML = `
      <button id="btn-persp-insert" class="btn-action-secondary" ${state.step4.platesInserted ? 'disabled' : ''}>
        1. Insert Specimen Between Acrylic Plates
      </button>
      <button id="btn-persp-weight" class="btn-action-secondary" ${state.step4.platesInserted && !state.step4.weightApplied ? '' : 'disabled'}>
        2. Apply 4.50 kg Dead Load (12.5 kPa)
      </button>
      <button id="btn-persp-tighten" class="btn-action-secondary" ${state.step4.weightApplied && state.step4.screwsTightened < 2 ? '' : 'disabled'}>
        3. Tighten Locking Nuts (${state.step4.screwsTightened}/2)
      </button>
      <button id="btn-persp-remove" class="btn-action-primary" ${state.step4.screwsTightened >= 2 && !state.step4.weightRemoved ? '' : 'disabled'}>
        4. Remove Dead Load (Spring Locked)
      </button>
    `;

    updateTelemetry(
      "Mechanical Clamping Load",
      "Pressure",
      state.step4.locked ? "12.5 kPa (Locked)" : (state.step4.weightApplied ? "12.5 kPa (Dead Load)" : "0.0 kPa"),
      state.step4.locked ? "Standard uniform pressure locked in internal springs" : "Apparatus awaiting loading & clamping",
      state.step4.locked
    );

    $('btn-persp-insert').onclick = () => {
      state.step4.platesInserted = true;
      renderSlide4();
    };

    $('btn-persp-weight').onclick = () => {
      state.step4.weightApplied = true;
      renderSlide4();
    };

    $('btn-persp-tighten').onclick = () => {
      state.step4.screwsTightened = Math.min(2, state.step4.screwsTightened + 1);
      renderSlide4();
    };

    $('btn-persp-remove').onclick = () => {
      state.step4.weightRemoved = true;
      state.step4.locked = true;
      renderSlide4();
      updateStepLockState();
    };
  }

  // ==========================================
  // SLIDE 5: Incubation (37.0 °C for 4 Hours)
  // ==========================================
  function renderSlide5() {
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Transfer the locked perspirometer into a precision laboratory incubator maintained at human body core temperature: 
      <strong>37.0 °C ± 2.0 °C</strong>.
      Incubate undisturbed for <strong>4 hours ± 10 minutes</strong>.
      This accelerates dye extraction and replicates human perspiration conditions inside a closed footwear microclimate.
    `;

    sopAction.textContent = (state.step5.cycleComplete)
      ? "Step Complete: 4-hour incubation complete. Proceed to Step 6 using 'Next Step'."
      : "Required Action: Load perspirometer into incubator, then click 'Run 4-Hour Incubation Cycle'.";

    bench.innerHTML = `
      <div class="incubator-cabinet-view">
        <div class="pid-controller-bezel">
          <div>
            <div style="font-size:0.65rem; color:#94a3b8; font-family:var(--font-mono);">PROCESS VALUE (PV)</div>
            <div class="pv-led">37.0 °C</div>
          </div>
          <div>
            <div style="font-size:0.65rem; color:#94a3b8; font-family:var(--font-mono);">COUNTDOWN TIMER</div>
            <div class="pv-led" id="pid-dwell-timer" style="color:#38bdf8; text-shadow:0 0 8px rgba(56,189,248,0.5);">
              ${state.step5.cycleComplete ? '4h 00m' : `${Math.floor(state.step5.cycleProgress * 0.04)}h 00m`}
            </div>
          </div>
          <div>
            <div style="font-size:0.65rem; color:#94a3b8; font-family:var(--font-mono);">SETPOINT (SV)</div>
            <div class="sv-led">SV: 37.0 °C</div>
          </div>
        </div>

        <div class="incubator-glass-door">
          <div class="wire-shelf-grid"></div>
          <div id="oven-unit-loaded" style="opacity:${state.step5.ovenLoaded ? '1' : '0.15'}; transition:opacity 0.4s; background:#475569; border:2px solid #64748b; padding:1.25rem 2rem; border-radius:2px; color:#fff; text-align:center; font-family:var(--font-mono); font-size:0.8rem; font-weight:700;">
            PERSPIROMETER UNIT LOADED<br>
            <span style="font-size:0.65rem; color:#38bdf8;">Uniform 12.5 kPa Pressure Active</span>
          </div>
        </div>
      </div>
    `;

    controls.innerHTML = `
      <button id="btn-oven-load" class="btn-action-secondary" ${state.step5.ovenLoaded ? 'disabled' : ''}>
        1. Load Perspirometer into Oven
      </button>
      <button id="btn-oven-start" class="btn-action-primary" ${state.step5.ovenLoaded && !state.step5.cycleComplete ? '' : 'disabled'}>
        2. Run 4-Hour Incubation Cycle
      </button>
    `;

    updateTelemetry(
      "Incubator Thermal Dwell",
      "Time / Temp",
      state.step5.cycleComplete ? "4.0 h @ 37.0 °C" : "0.0 h @ 37.0 °C",
      state.step5.cycleComplete ? "Thermal incubation complete conforming to ISO 11641" : "Awaiting cycle initiation",
      state.step5.cycleComplete
    );

    $('btn-oven-load').onclick = () => {
      state.step5.ovenLoaded = true;
      $('oven-unit-loaded').style.opacity = '1';
      $('btn-oven-load').disabled = true;
      $('btn-oven-start').disabled = false;
    };

    $('btn-oven-start').onclick = () => {
      $('btn-oven-start').disabled = true;
      let prog = 0;
      const intv = setInterval(() => {
        prog += 10;
        state.step5.cycleProgress = prog;
        const h = Math.floor(prog * 0.04);
        const m = Math.floor((prog * 0.04 - h) * 60);
        $('pid-dwell-timer').textContent = `${h}h ${m < 10 ? '0' : ''}${m}m`;

        if (prog >= 100) {
          clearInterval(intv);
          state.step5.cycleComplete = true;
          $('pid-dwell-timer').textContent = "4h 00m";
          updateTelemetry(
            "Incubator Thermal Dwell",
            "Time / Temp",
            "4.0 h @ 37.0 °C",
            "Thermal incubation complete conforming to ISO 11641",
            true
          );
          updateStepLockState();
        }
      }, 150);
    };
  }

  // ==========================================
  // SLIDE 6: Disassembly & Conditioning
  // ==========================================
  function renderSlide6() {
    const spec = getSpecimen();
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Remove the perspirometer from the incubator and release the clamping screws.
      Unfold the composite specimen so that leather and multifibre fabric touch only along the stitched seam.
      Suspend in standard conditioning atmosphere (<strong>20 °C ± 2 °C, 65% ± 4% RH</strong> conforming to <strong>ISO 2419</strong>) to dry at a temperature not exceeding 60 °C.
      Allow to condition for at least 4 hours before visual evaluation.
    `;

    sopAction.textContent = (state.step6.conditioned)
      ? "Step Complete: Specimen conditioned to equilibrium. Proceed to Step 7 using 'Next Step'."
      : "Required Action: Unfold specimen at hinge seam, then click 'Condition in Standard Atmosphere'.";

    bench.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.5rem;">
        
        <div style="background:#ffffff; border:1px solid #cbd5e1; padding:2rem; box-shadow:0 2px 8px rgba(0,0,0,0.1); display:flex; gap:2.5rem; align-items:center;">
          
          <!-- Tested Leather Half -->
          <div class="realistic-leather-swatch leather-${spec.grainType}" style="width:130px; height:200px; background-color:${spec.baseColor};" title="Tested Specimen">
            <span style="font-size:0.65rem; font-weight:700; color:#fff; text-shadow:0 1px 2px #000;">TESTED LEATHER</span>
            <span style="font-size:0.65rem; font-family:var(--font-mono); color:#fff; text-align:center; text-shadow:0 1px 2px #000;">Grain Surface</span>
            <span style="font-size:0.6rem; color:#fff; opacity:0.85; text-shadow:0 1px 2px #000;">20 °C / 65% RH</span>
          </div>

          <!-- Stitched Hinge Seam -->
          <div style="width:3px; height:180px; background:#0969da;" title="Stitched hinge seam"></div>

          <!-- Stained Multifibre Fabric Half -->
          <div class="realistic-multifibre-strip" style="width:130px; height:200px;">
            <div class="multifibre-stripe stripe-acetate"><span>CA</span><span>DW-1</span></div>
            <div class="multifibre-stripe stripe-cotton"><span>CO</span><span>DW-2</span></div>
            <div class="multifibre-stripe stripe-polyamide"><span>PA</span><span>DW-3</span></div>
            <div class="multifibre-stripe stripe-polyester"><span>PES</span><span>DW-4</span></div>
            <div class="multifibre-stripe stripe-acrylic"><span>PAC</span><span>DW-5</span></div>
            <div class="multifibre-stripe stripe-wool"><span>WO</span><span>DW-6</span></div>
          </div>
        </div>

        <div style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono);">
          Standard Conditioning Atmosphere: ISO 2419 (20.0 °C ± 2.0 °C, 65% ± 4% RH)
        </div>

      </div>
    `;

    controls.innerHTML = `
      <button id="btn-unfold-spec" class="btn-action-secondary" ${state.step6.unfolded ? 'disabled' : ''}>
        1. Unfold Specimen at Stitched Seam
      </button>
      <button id="btn-cond-spec" class="btn-action-primary" ${state.step6.unfolded && !state.step6.conditioned ? '' : 'disabled'}>
        2. Condition in Standard Atmosphere
      </button>
    `;

    updateTelemetry(
      "Atmospheric Conditioning",
      "Condition",
      state.step6.conditioned ? "Conditioned (Ready)" : "Unconditioned",
      state.step6.conditioned ? "Moisture equilibrium reached; proceed to D65 light booth" : "Awaiting drying and conditioning",
      state.step6.conditioned
    );

    $('btn-unfold-spec').onclick = () => {
      state.step6.unfolded = true;
      $('btn-unfold-spec').disabled = true;
      $('btn-cond-spec').disabled = false;
    };

    $('btn-cond-spec').onclick = () => {
      state.step6.conditioned = true;
      $('btn-cond-spec').disabled = true;
      updateTelemetry(
        "Atmospheric Conditioning",
        "Condition",
        "Conditioned (Ready)",
        "Moisture equilibrium reached; proceed to D65 light booth",
        true
      );
      updateStepLockState();
    };
  }

  // ==========================================
  // SLIDE 7: D65 Visual Assessment Studio
  // ==========================================
  function renderSlide7() {
    const spec = getSpecimen();
    const isAcid = state.solutionType === 'acidic';
    const testedColor = isAcid ? spec.bleedColorAcid : spec.bleedColorAlkaline;
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    sopText.innerHTML = `
      Evaluate test specimens in a standard viewing cabinet under <strong>CIE Illuminant D65 (6500 K Artificial Daylight)</strong> 
      with a <strong>45° / 0° viewing geometry</strong> on a neutral Munsell N5 background.
      Grade the change in colour of the leather against the <strong>ISO 105-A02 Grey Scale</strong>.
      Grade the degree of staining for each of the six fibres on the adjacent multifibre fabric against the <strong>ISO 105-A03 Grey Scale</strong>.
    `;

    sopAction.textContent = (state.step7.selectedChangeGrade !== null)
      ? "Step Complete: Visual grades recorded. Click 'Next Step' to view the Comprehensive Analysis & Test Certificate on Slide 8."
      : "Required Action: Select observed ISO Grey Scale grade for leather colour change and multifibre staining.";

    // Light Booth SVG View
    bench.innerHTML = `
      <div class="light-booth-view">
        <div class="booth-luminaire-hood">
          <span>CIE STANDARD ILLUMINANT D65 (6500 K)</span>
          <span>GEOMETRY: 45°/0°</span>
        </div>

        <div class="booth-cavity">
          <div class="viewing-easel-45deg">
            
            <!-- Reference Untested Specimen -->
            <div class="sample-holder-aperture">
              <div class="aperture-mask">
                <div class="specimen-swatch-view leather-${spec.grainType}" style="background-color: ${spec.baseColor};"></div>
              </div>
              <span style="font-size:0.7rem; font-family:var(--font-mono); color:#e2e8f0;">Original Reference</span>
            </div>

            <!-- Tested Specimen Under Solution -->
            <div class="sample-holder-aperture">
              <div class="aperture-mask">
                <div class="specimen-swatch-view leather-${spec.grainType}" style="background-color: ${testedColor};"></div>
              </div>
              <span style="font-size:0.7rem; font-family:var(--font-mono); color:#e2e8f0;">
                Exposed (${state.solutionType.toUpperCase()} pH ${isAcid ? '5.5' : '8.0'})
              </span>
            </div>

          </div>
        </div>
      </div>
    `;

    // Controls: ISO 105-A02 Grey Scale Selector & Multifibre Staining Table
    controls.innerHTML = `
      <div style="font-size:0.75rem; font-weight:700; color:#1e293b; margin-bottom:0.25rem;">
        Part A: Leather Colour Change (ISO 105-A02)
      </div>
      <div class="iso-greyscale-strip" id="iso-greyscale-strip-chips">
        <!-- 9 ISO Grey Scale chips -->
      </div>

      <div style="font-size:0.75rem; font-weight:700; color:#1e293b; margin-top:0.75rem; margin-bottom:0.25rem;">
        Part B: Adjacent Fabric Staining (ISO 105-A03)
      </div>
      <div id="multifibre-staining-inputs">
        <!-- 6 Fiber Selectors -->
      </div>
    `;

    // Render ISO Grey Scale Chips
    const chipContainer = $('iso-greyscale-strip-chips');
    window.LAB_STANDARDS.isoGreyScale.forEach(item => {
      const chip = document.createElement('div');
      chip.className = `iso-grade-chip ${state.step7.selectedChangeGrade === item.grade ? 'selected' : ''}`;
      chip.innerHTML = `
        <div class="grey-contrast-pair">
          <div class="grey-half-reference"></div>
          <div class="grey-half-test" style="background-color: rgb(${item.contrastTone}, ${item.contrastTone}, ${item.contrastTone});"></div>
        </div>
        <div class="grade-text">${item.grade}</div>
        <div class="delta-e-text">ΔE ${item.deltaE}</div>
      `;

      chip.onclick = () => {
        state.step7.selectedChangeGrade = item.grade;
        renderSlide7();
        updateStepLockState();
      };

      chipContainer.appendChild(chip);
    });

    // Render Multifibre Table
    const stainContainer = $('multifibre-staining-inputs');
    const fibers = window.LAB_STANDARDS.multifibreStrips;
    let tableHtml = `<table class="data-table-iso"><thead><tr><th>Fibre</th><th>Recorded Grade</th></tr></thead><tbody>`;
    
    fibers.forEach(f => {
      const val = state.step7.selectedStaining[f.id] || '';
      tableHtml += `
        <tr>
          <td><strong>${f.name}</strong> (${f.code})</td>
          <td>
            <select class="field-select stain-select" data-fiber="${f.id}" style="padding:0.25rem 0.4rem; font-size:0.75rem;">
              <option value="">Select Grade...</option>
              <option value="5" ${val === '5' ? 'selected' : ''}>Grade 5 (No staining)</option>
              <option value="4-5" ${val === '4-5' ? 'selected' : ''}>Grade 4-5</option>
              <option value="4" ${val === '4' ? 'selected' : ''}>Grade 4 (Slight)</option>
              <option value="3-4" ${val === '3-4' ? 'selected' : ''}>Grade 3-4</option>
              <option value="3" ${val === '3' ? 'selected' : ''}>Grade 3 (Noticeable)</option>
              <option value="2-3" ${val === '2-3' ? 'selected' : ''}>Grade 2-3</option>
              <option value="2" ${val === '2' ? 'selected' : ''}>Grade 2 (Heavy)</option>
              <option value="1-2" ${val === '1-2' ? 'selected' : ''}>Grade 1-2</option>
              <option value="1" ${val === '1' ? 'selected' : ''}>Grade 1 (Severe)</option>
            </select>
          </td>
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;
    stainContainer.innerHTML = tableHtml;

    stainContainer.querySelectorAll('.stain-select').forEach(sel => {
      sel.onchange = (e) => {
        state.step7.selectedStaining[e.target.dataset.fiber] = e.target.value;
        renderSlide7();
      };
    });

    const expectedGrade = isAcid ? spec.expectedAcid.changeGrade : spec.expectedAlkaline.changeGrade;
    const grade = state.step7.selectedChangeGrade || expectedGrade;
    const isPass = parseFloat(grade) >= 3.5 || grade.includes('4') || grade.includes('5');

    updateTelemetry(
      "Colour Fastness Evaluation",
      "ISO 105-A02",
      `Grade ${grade}`,
      isPass ? "COMPLIANT (PASS) for Footwear Upper & Lining application" : "NON-COMPLIANT (FAIL): Exceeds allowable bleeding tolerance",
      isPass
    );
  }

  // ==========================================
  // SLIDE 8: Comprehensive Test Results, Grade Meaning & Certificate
  // ==========================================
  function renderSlide8() {
    const spec = getSpecimen();
    const isAcid = state.solutionType === 'acidic';
    const bench = $('workbench-render-area');
    const sopText = $('sop-text-content');
    const sopAction = $('sop-action-content');
    const controls = $('step-controls-area');

    const expectedGrade = isAcid ? spec.expectedAcid.changeGrade : spec.expectedAlkaline.changeGrade;
    const grade = state.step7.selectedChangeGrade || expectedGrade;
    const isPass = parseFloat(grade) >= 3.5 || grade.includes('4') || grade.includes('5');

    const stainCA = state.step7.selectedStaining.CA || (isAcid ? spec.expectedAcid.staining.CA : spec.expectedAlkaline.staining.CA);
    const stainCO = state.step7.selectedStaining.CO || (isAcid ? spec.expectedAcid.staining.CO : spec.expectedAlkaline.staining.CO);
    const stainPA = state.step7.selectedStaining.PA || (isAcid ? spec.expectedAcid.staining.PA : spec.expectedAlkaline.staining.PA);
    const stainPES = state.step7.selectedStaining.PES || (isAcid ? spec.expectedAcid.staining.PES : spec.expectedAlkaline.staining.PES);
    const stainPAC = state.step7.selectedStaining.PAC || (isAcid ? spec.expectedAcid.staining.PAC : spec.expectedAlkaline.staining.PAC);
    const stainWO = state.step7.selectedStaining.WO || (isAcid ? spec.expectedAcid.staining.WO : spec.expectedAlkaline.staining.WO);

    // Get meaning of the observed grade from the ISO scale
    const gradeItem = window.LAB_STANDARDS.isoGreyScale.find(g => g.grade === grade) || window.LAB_STANDARDS.isoGreyScale[2];

    sopText.innerHTML = `
      Review the consolidated experimental results, official laboratory certificate, and technical engineering interpretations.
      Compare the measured <strong>Colour Change Grade (${grade})</strong> and <strong>Multifibre Staining Ratings</strong> against standard footwear commercial tolerances.
    `;

    sopAction.textContent = "Laboratory Investigation Complete. Click 'Print / Save Laboratory Report' if you need a physical copy.";

    // Render Full Certificate and Meaning Breakdown
    bench.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.85rem; width:100%; max-width:760px; overflow-y:auto; max-height:480px; padding-right:6px;">
        
        <!-- Official Test Certificate -->
        <div class="final-results-certificate" style="margin-top:0;">
          <div class="cert-header">
            <div class="cert-title">Official Laboratory Test Certificate</div>
            <div class="cert-subtitle">Colour Fastness to Artificial Perspiration &bull; ISO 11641 / SATRA TM426</div>
          </div>

          <div class="cert-meta-grid">
            <div><strong>Specimen Name:</strong> ${spec.name}</div>
            <div><strong>Footwear Classification:</strong> ${spec.category}</div>
            <div><strong>Tannage & Finish:</strong> ${spec.tannage} (${spec.finish})</div>
            <div><strong>Testing Medium:</strong> Artificial Sweat (${state.solutionType.toUpperCase()} pH ${isAcid ? '5.5 ± 0.2' : '8.0 ± 0.2'})</div>
            <div><strong>Mechanical Clamping:</strong> 12.5 ± 0.9 kPa (4.50 kg load)</div>
            <div><strong>Thermal Incubation:</strong> 37.0 °C ± 2.0 °C for 4.0 Hours</div>
          </div>

          <table class="data-table-iso" style="margin-bottom:0.75rem;">
            <thead>
              <tr>
                <th>Test Parameter</th>
                <th>Observed Rating</th>
                <th>Standard Reference</th>
                <th>Footwear Acceptance Criteria</th>
                <th>Result Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Leather Colour Change</strong></td>
                <td><strong style="color:#0969da; font-size:0.9rem;">Grade ${grade}</strong></td>
                <td>ISO 105-A02 (Colour Change)</td>
                <td>Min Grade 3-4 (Uppers) / Min Grade 4 (Linings)</td>
                <td><strong style="color:${isPass ? '#15803d' : '#cf222e'};">${isPass ? 'PASS' : 'FAIL'}</strong></td>
              </tr>
              <tr>
                <td>Staining on Acetate (CA)</td>
                <td>Grade ${stainCA}</td>
                <td>ISO 105-A03</td>
                <td>Min Grade 3-4</td>
                <td><span style="color:#15803d;">Compliant</span></td>
              </tr>
              <tr>
                <td>Staining on Cotton (CO)</td>
                <td>Grade ${stainCO}</td>
                <td>ISO 105-A03</td>
                <td>Min Grade 3-4 (Critical for Socks)</td>
                <td><span style="color:${parseFloat(stainCO) >= 3 ? '#15803d' : '#cf222e'};">${parseFloat(stainCO) >= 3 ? 'Compliant' : 'Non-Compliant'}</span></td>
              </tr>
              <tr>
                <td>Staining on Polyamide (PA)</td>
                <td>Grade ${stainPA}</td>
                <td>ISO 105-A03</td>
                <td>Min Grade 3-4 (Nylon Stockings)</td>
                <td><span style="color:${parseFloat(stainPA) >= 3 ? '#15803d' : '#cf222e'};">${parseFloat(stainPA) >= 3 ? 'Compliant' : 'High Dye Bleed'}</span></td>
              </tr>
              <tr>
                <td>Staining on Polyester (PES)</td>
                <td>Grade ${stainPES}</td>
                <td>ISO 105-A03</td>
                <td>Min Grade 4</td>
                <td><span style="color:#15803d;">Compliant</span></td>
              </tr>
              <tr>
                <td>Staining on Acrylic (PAC)</td>
                <td>Grade ${stainPAC}</td>
                <td>ISO 105-A03</td>
                <td>Min Grade 4</td>
                <td><span style="color:#15803d;">Compliant</span></td>
              </tr>
              <tr>
                <td>Staining on Wool (WO)</td>
                <td>Grade ${stainWO}</td>
                <td>ISO 105-A03</td>
                <td>Min Grade 3-4</td>
                <td><span style="color:#15803d;">Compliant</span></td>
              </tr>
            </tbody>
          </table>

          <div class="verdict-banner-box ${isPass ? 'verdict-pass' : 'verdict-fail'}">
            COMPLIANCE VERDICT: ${isPass ? 'COMPLIANT (PASS) - SUITABLE FOR COMMERCIAL FOOTWEAR' : 'NON-COMPLIANT (FAIL) - EXCESSIVE BLEEDING RISK'}
          </div>
        </div>

        <!-- Grade Meaning & Footwear Engineering Analysis -->
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:2px; padding:0.85rem; font-size:0.75rem;">
          <div style="font-weight:700; color:#0f172a; text-transform:uppercase; margin-bottom:0.4rem; font-size:0.78rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem;">
            What the Observed Ratings Mean in Footwear Engineering:
          </div>
          
          <ul style="padding-left:1.2rem; display:flex; flex-direction:column; gap:0.35rem; color:#334155;">
            <li>
              <strong>Leather Colour Change (Grade ${grade}):</strong> ${gradeItem.meaning}. 
              ${isPass ? 'The dyestuff-collagen ionic bonds resist hydrolytic cleavage under perspiration.' : 'The dye fixation is inadequate, leading to noticeable fading and shade alteration during active foot wear.'}
            </li>
            <li>
              <strong>Critical Sock Staining (Cotton: Grade ${stainCO} &amp; Nylon: Grade ${stainPA}):</strong> 
              ${parseFloat(stainCO) >= 3.5 
                ? 'Minimal dye migration observed. Wearer socks and hosiery will remain clean with zero contact discoloration.' 
                : 'Significant dye bleeding into cellulose and polyamide fibres. High customer return risk due to stained socks and skin contact irritation.'}
            </li>
            <li>
              <strong>Perspiration Chemistry Impact:</strong> Tested under <strong>${state.solutionType.toUpperCase()} sweat (pH ${isAcid ? '5.5' : '8.0'})</strong>. 
              ${isAcid 
                ? 'Acid perspiration simulates fresh athletic sweat. Acidic hydrolysis did not destabilize the tanning matrix.' 
                : 'Alkaline perspiration replicates decomposed urea-ammonia buildup inside closed footwear. Alkaline conditions test the resistance of vegetable tannins and anionic dyes against deprotonation.'}
            </li>
          </ul>
        </div>

      </div>
    `;

    controls.innerHTML = `
      <button id="btn-print-cert" class="btn-action-primary" style="background:#0f172a; border-color:#0f172a;">
        Print / Save Laboratory Report
      </button>
      <button id="btn-restart-exp" class="btn-action-secondary" style="margin-top:0.35rem;">
        Test Another Leather Sample
      </button>
    `;

    $('btn-print-cert').onclick = () => {
      window.print();
    };

    $('btn-restart-exp').onclick = () => {
      goToSlide(1);
    };

    updateTelemetry(
      "Final Compliance Verdict",
      "ISO 11641 Status",
      isPass ? "PASS (Certified)" : "FAIL (Non-Compliant)",
      isPass ? "Full commercial footwear clearance granted" : "Requires dye re-fixation and topcoat improvement",
      isPass
    );
  }

  // Telemetry Display Helper
  function updateTelemetry(label, unit, value, status, isOk) {
    $('telemetry-label').textContent = label;
    $('telemetry-unit').textContent = unit;
    $('telemetry-value-display').textContent = value;
    const stEl = $('telemetry-status-display');
    stEl.textContent = status;
    stEl.className = `readout-status-line ${isOk ? 'ok' : 'pending'}`;
  }

  // Initialization & Event Binding
  function init() {
    // Leather specimen selection
    const sampleSelect = $('select-leather-sample');
    if (sampleSelect) {
      sampleSelect.onchange = (e) => {
        state.specimenId = e.target.value;
        goToSlide(state.currentSlide);
      };
    }

    // Solution toggle (Acidic vs Alkaline)
    $('toggle-acidic').onclick = () => {
      $('toggle-acidic').classList.add('selected');
      $('toggle-alkaline').classList.remove('selected');
      state.solutionType = 'acidic';
      state.step2.currentPH = 6.80;
      goToSlide(state.currentSlide);
    };

    $('toggle-alkaline').onclick = () => {
      $('toggle-alkaline').classList.add('selected');
      $('toggle-acidic').classList.remove('selected');
      state.solutionType = 'alkaline';
      state.step2.currentPH = 7.40;
      goToSlide(state.currentSlide);
    };

    // Navigation Buttons
    $('btn-slide-next').onclick = () => {
      if (state.currentSlide < 8 && isStepCompleted(state.currentSlide)) {
        goToSlide(state.currentSlide + 1);
      }
    };

    $('btn-slide-prev').onclick = () => {
      if (state.currentSlide > 1) {
        goToSlide(state.currentSlide - 1);
      }
    };

    // Progress strip step clicks
    document.querySelectorAll('.progress-step').forEach(stepEl => {
      stepEl.onclick = () => {
        const target = parseInt(stepEl.dataset.step);
        if (target <= state.maxUnlockedSlide) {
          goToSlide(target);
        } else {
          alert("Please complete the current laboratory step before proceeding to this step.");
        }
      };
    });

    // Reset Lab
    $('btn-deck-reset').onclick = () => {
      if (confirm("Reset the entire experiment to Step 1?")) {
        state.currentSlide = 1;
        state.maxUnlockedSlide = 1;
        state.step1.stitched = false;
        state.step2.balanceTared = false;
        state.step2.reagentsWeighed = false;
        state.step2.currentPH = (state.solutionType === 'acidic' ? 6.80 : 7.40);
        state.step2.phCalibrated = false;
        state.step3.immersed = false;
        state.step3.pressedCount = 0;
        state.step3.dwellProgress = 0;
        state.step3.dwellComplete = false;
        state.step4.platesInserted = false;
        state.step4.weightApplied = false;
        state.step4.screwsTightened = 0;
        state.step4.weightRemoved = false;
        state.step4.locked = false;
        state.step5.ovenLoaded = false;
        state.step5.ovenRunning = false;
        state.step5.cycleProgress = 0;
        state.step5.cycleComplete = false;
        state.step6.unfolded = false;
        state.step6.conditioned = false;
        state.step7.selectedChangeGrade = null;
        goToSlide(1);
      }
    };

    // Initial slide render
    goToSlide(1);
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
