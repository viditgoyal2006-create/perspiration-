/**
 * Technical Reference Data and Physical Parameters
 * Standard: ISO 11641:2012 / IUP 15 / SATRA TM426 / ISO 105-E04
 */

window.LAB_STANDARDS = {
  specification: {
    title: "Leather - Tests for colour fastness - Colour fastness to perspiration",
    standardCode: "ISO 11641:2012 / IUF 426",
    apparatusPressure: "12.5 ± 0.9 kPa",
    deadLoadMass: "4.50 kg",
    incubationTemp: "37.0 ± 2.0 °C",
    incubationTime: "4 hours ± 10 min",
    specimenSize: "100 mm × 40 mm",
    illuminant: "CIE Illuminant D65 (6500 K)",
    geometry: "45° / 0°"
  },

  // Practical Student Guide: Explicit "What to do" and "How to do" for each step (1 to 8)
  studentPracticalGuide: {
    1: {
      what: "Prepare the leather sample (100 mm × 40 mm) and multifibre fabric DW, then sew them together along one short edge with the leather grain facing the fabric.",
      how: "Examine the leather sample dimensions and grain side orientation. Click 'Stitch Composite Sandwich' to mechanically join the short edge (40 mm) with cross-stitches. When stitching completes, the Next Step will unlock."
    },
    2: {
      what: "Weigh analytical reagents (L-Histidine, NaCl, Phosphates) on a digital analytical balance and titrate solution to target pH 5.5 ± 0.2 (Acidic) or pH 8.0 ± 0.2 (Alkaline).",
      how: "1. Click 'Tare Balance' to zero the balance pan (0.000 g).<br>2. Click 'Weigh Reagents' to watch spatula transfer salts into the weighing boat.<br>3. Use '+ 0.1 M NaOH' or '- 0.1 M Acid' until the digital pH meter reads within the ± 0.2 green tolerance window. Next Step unlocks once pH is calibrated."
    },
    3: {
      what: "Immerse composite specimen in 50 mL artificial perspiration liquor (50:1 ratio), tamp with polished glass rod to dislodge air bubbles, and soak for 30 minutes.",
      how: "1. Click 'Immerse Specimen in Solution'.<br>2. Click 'Press with Glass Rod' 3 times to compress the sandwich and release trapped micro-bubbles.<br>3. Click 'Run 30-Min Soak Timer' to achieve uniform 100% wet pickup. Next Step unlocks when soak finishes."
    },
    4: {
      what: "Mount the wet composite specimen between smooth acrylic separator plates in the perspiration tester and clamp under uniform 12.5 kPa pressure.",
      how: "1. Click 'Insert Specimen Between Acrylic Plates'.<br>2. Click 'Apply 4.50 kg Dead Load' (exerting 12.5 kPa).<br>3. Click 'Tighten Locking Nuts' twice to lock internal spring compression.<br>4. Click 'Remove Dead Load' so frame retains 12.5 kPa independently. Next Step unlocks upon locking."
    },
    5: {
      what: "Transfer the locked perspirometer into a forced-convection laboratory incubator at 37.0 °C ± 2.0 °C for 4 hours.",
      how: "1. Click 'Load Perspirometer into Oven' to place on chamber wire shelf.<br>2. Click 'Run 4-Hour Incubation Cycle' to start thermostatic dwell. The PID countdown timer simulates the 4-hour cycle. Next Step unlocks once dwell is complete."
    },
    6: {
      what: "Unscrew perspirometer, unfold the composite specimen at the stitched hinge seam, and condition in standard testing atmosphere (20 °C, 65% RH).",
      how: "1. Click 'Unfold Specimen at Stitched Seam' (leather and fabric only touch along stitched seam).<br>2. Click 'Condition in Standard Atmosphere' to reach moisture equilibrium. Next Step unlocks when conditioning completes."
    },
    7: {
      what: "Grade colour change of leather against ISO 105-A02 Grey Scale and adjacent multifibre staining against ISO 105-A03 Grey Scale in D65 Light Booth.",
      how: "1. Compare exposed leather against original reference in D65 viewing cabinet and select an ISO 105-A02 Grade chip.<br>2. Record staining grades for all 6 multifibre stripes in the table.<br>3. Once grades are recorded, proceed to Slide 8 to analyze comprehensive results, engineering interpretations, and footwear compliance."
    },
    8: {
      what: "Review the comprehensive laboratory evaluation results, understand the engineering interpretation of the grey scale grades, and examine the footwear compliance verdict.",
      how: "Study the Complete Test Certificate, the Detailed Grade Interpretation breakdown, and the Footwear Application Guidelines. Click 'Print / Save Laboratory Report' if you wish to export the document."
    }
  },

  // Complete Apparatus and Materials Checklist by Step
  stepApparatusDirectory: {
    1: [
      { name: "Leather Specimen", spec: "100 mm × 40 mm, cut from official sampling area (ISO 2418)" },
      { name: "Multifibre Adjacent Fabric (DW)", spec: "100 mm × 40 mm, ISO 105-F10 (Acetate, Cotton, Polyamide, Polyester, Acrylic, Wool)" },
      { name: "Hardened Steel Cutting Die / Scalpel", spec: "Precision template conforming to ISO 2419" },
      { name: "Sewing Needle & Monofilament Thread", spec: "Synthetic thread inert to test perspiration liquor" }
    ],
    2: [
      { name: "Digital Analytical Balance", spec: "Readability 0.001 g (Mettler Toledo / Sartorius grade)" },
      { name: "Stainless Steel Lab Spatula", spec: "Polished spoon/flat spatula for analytical salt transfers" },
      { name: "Plastic Weighing Boat", spec: "Polystyrene boat with pour spout" },
      { name: "Amber Chemical Reagent Bottles", spec: "L-Histidine monohydrochloride, Sodium Chloride (NaCl)" },
      { name: "Volumetric Flask", spec: "Class A, 1000 mL with ground-glass stopper" },
      { name: "Digital Benchtop pH Meter", spec: "Resolution 0.01 pH, automatic temperature compensation (ATC)" },
      { name: "Glass Combination Electrode", spec: "Double junction, 3 mol/L KCl reference electrolyte" },
      { name: "Phosphate Buffer Salts", spec: "NaH2PO4·2H2O (2.20 g) for Acidic / Na2HPO4·2H2O (2.50 g) for Alkaline" },
      { name: "Titration Solutions", spec: "0.1 mol/L NaOH and 0.1 mol/L Acetic acid / Orthophosphoric acid" },
      { name: "Distilled / Deionized Water", spec: "Grade 3 conforming to ISO 3696" }
    ],
    3: [
      { name: "Crystallization / Flat Soaking Dish", spec: "Borosilicate 3.3 glass, flat-bottomed, 150 mm diameter" },
      { name: "Polished Glass Stirring Rod", spec: "Diameter 12 mm, length 240 mm, fire-polished rounded end for tamping" },
      { name: "Analytical Graduated Cylinder", spec: "100 mL Class B for measuring 50 mL liquor volume" },
      { name: "Laboratory Whatman Grade 1 Filter Paper", spec: "For blotting excess surface liquor to 100% absorption" }
    ],
    4: [
      { name: "Perspiration Tester (Perspirometer)", spec: "Stainless steel AISI 304 frame with two guide columns and bridge" },
      { name: "Acrylic Resin Separator Plates", spec: "115 mm × 60 mm × 1.5 mm, optically smooth, chemical resistant" },
      { name: "Calibrated Loading Dead Weight", spec: "Solid stainless steel cylindrical mass, 4.50 kg ± 0.05 kg (12.5 kPa)" },
      { name: "Internal Calibrated Springs & Thumb Screws", spec: "Dual knurled brass/steel locking screws to preserve spring compression" }
    ],
    5: [
      { name: "Precision Laboratory Incubator", spec: "Forced convection air circulation, setpoint 37.0 °C ± 2.0 °C" },
      { name: "Digital Microprocessor PID Controller", spec: "Dual LED display (Process Value PV / Setpoint Value SV)" },
      { name: "Stainless Steel Wire Shelf", spec: "Perforated grate allowing uniform air circulation around tester" }
    ],
    6: [
      { name: "Laboratory Conditioning Frame", spec: "Non-corrosive stainless steel suspension rack" },
      { name: "Suspension Non-Metallic Clips", spec: "Inert clips securing specimen along single edge without pinching test area" },
      { name: "Standard Atmosphere Chamber", spec: "ISO 2419: Temperature 20.0 °C ± 2.0 °C, Relative Humidity 65% ± 4%" }
    ],
    7: [
      { name: "Standard Colour Matching Viewing Booth", spec: "VeriVide / Macbeth cabinet lined with Munsell N5 / N7 neutral grey" },
      { name: "CIE Standard Illuminant D65", spec: "Correlated colour temperature 6500 K artificial daylight" },
      { name: "45° / 0° Viewing Stage", spec: "Illumination perpendicular to sample (0°), observation at 45° angle" },
      { name: "Standard ISO Grey Mask with Apertures", spec: "Neutral grey mask with dual cutouts to isolate comparison swatches" },
      { name: "ISO 105-A02 Grey Scale", spec: "9-step standard scale for assessing change in colour" },
      { name: "ISO 105-A03 Grey Scale", spec: "9-step standard scale for assessing staining on adjacent fibres" }
    ],
    8: [
      { name: "Laboratory Information Management System (LIMS)", spec: "Automated standard test evaluation and certificate engine" },
      { name: "ISO / SATRA Footwear Requirements Database", spec: "Tolerance tables for Footwear Upper, Insole, and Lining Leathers" },
      { name: "Official Test Certificate Documentation", spec: "ISO/IEC 17025 accredited laboratory report format" }
    ]
  },

  reagents: {
    acidic: {
      title: "Acidic Artificial Perspiration (ISO 11641)",
      description: "Simulates freshly excreted eccrine sweat from human skin pores.",
      targetPH: 5.5,
      phTolerance: 0.2,
      components: [
        { name: "L-Histidine monohydrochloride monohydrate", amount: "0.50 g" },
        { name: "Sodium chloride (NaCl)", amount: "5.00 g" },
        { name: "Sodium dihydrogen orthophosphate dihydrate (NaH2PO4·2H2O)", amount: "2.20 g" },
        { name: "Distilled water (Grade 3)", amount: "Make up to 1000 mL" }
      ],
      adjustmentReagent: "0.1 mol/L Sodium Hydroxide (NaOH) or 0.1 mol/L Acetic acid"
    },
    alkaline: {
      title: "Alkaline Artificial Perspiration (ISO 11641)",
      description: "Simulates aged, decomposed sweat inside warm closed footwear where bacterial urease breaks urea into ammonia.",
      targetPH: 8.0,
      phTolerance: 0.2,
      components: [
        { name: "L-Histidine monohydrochloride monohydrate", amount: "0.50 g" },
        { name: "Sodium chloride (NaCl)", amount: "5.00 g" },
        { name: "Disodium hydrogen orthophosphate dihydrate (Na2HPO4·2H2O)", amount: "2.50 g" },
        { name: "Distilled water (Grade 3)", amount: "Make up to 1000 mL" }
      ],
      adjustmentReagent: "0.1 mol/L Sodium Hydroxide (NaOH) or 0.1 mol/L Orthophosphoric acid"
    }
  },

  specimens: [
    {
      id: "calf-black",
      name: "Bovine Calf Upper Leather (Black Aniline)",
      category: "Footwear Upper Leather",
      tannage: "Basic Chromium(III) Sulfate mineral tannage",
      finish: "Full-grain, light protein topcoat, metal-complex acid dye",
      grainType: "smooth-calf",
      baseColor: "#171717",
      bleedColorAcid: "#2a2a2d",
      bleedColorAlkaline: "#3d3d42",
      expectedAcid: {
        changeGrade: "4-5",
        staining: { CA: "4-5", CO: "4", PA: "4", PES: "5", PAC: "5", WO: "4" }
      },
      expectedAlkaline: {
        changeGrade: "4",
        staining: { CA: "4", CO: "3-4", PA: "3-4", PES: "4-5", PAC: "4-5", WO: "3-4" }
      }
    },
    {
      id: "lining-tan",
      name: "Pigskin Counter & Sock Lining (Natural Tan)",
      category: "Footwear Insole / Lining",
      tannage: "Semi-vegetable mimosa and syntan combination",
      finish: "Drum-dyed crust, unpigmented, open grain pore structure",
      grainType: "pigskin-pores",
      baseColor: "#8d5b38",
      bleedColorAcid: "#9f6e4a",
      bleedColorAlkaline: "#6d4323",
      expectedAcid: {
        changeGrade: "4",
        staining: { CA: "4", CO: "4", PA: "3-4", PES: "4-5", PAC: "5", WO: "4" }
      },
      expectedAlkaline: {
        changeGrade: "3",
        staining: { CA: "3", CO: "2-3", PA: "2-3", PES: "4", PAC: "4", WO: "2-3" }
      }
    },
    {
      id: "suede-blue",
      name: "Buffed Flesh Split Suede (Royal Blue)",
      category: "Footwear Casual Upper",
      tannage: "Wet-blue chrome tanned bovine split",
      finish: "Buffed fibrous velvet nap, saturated reactive dye strike",
      grainType: "suede-nap",
      baseColor: "#1e3a8a",
      bleedColorAcid: "#2563eb",
      bleedColorAlkaline: "#172554",
      expectedAcid: {
        changeGrade: "3-4",
        staining: { CA: "3", CO: "3", PA: "2-3", PES: "4", PAC: "4", WO: "3" }
      },
      expectedAlkaline: {
        changeGrade: "2-3",
        staining: { CA: "2-3", CO: "2", PA: "1-2", PES: "3-4", PAC: "3-4", WO: "2" }
      }
    },
    {
      id: "veg-insole",
      name: "Vegetable Tanned Steerhide Insole (Buff Tan)",
      category: "Footwear Insole Core Leather",
      tannage: "Heavy vegetable pit tannage (Mimosa & Quebracho extracts)",
      finish: "Natural vegetable strike, uncolored crust",
      grainType: "steer-firm",
      baseColor: "#a3703c",
      bleedColorAcid: "#b2804c",
      bleedColorAlkaline: "#73481f",
      expectedAcid: {
        changeGrade: "4",
        staining: { CA: "4-5", CO: "4", PA: "4", PES: "5", PAC: "5", WO: "4-5" }
      },
      expectedAlkaline: {
        changeGrade: "2-3",
        staining: { CA: "3", CO: "2-3", PA: "2", PES: "3-4", PAC: "4", WO: "2" }
      }
    }
  ],

  multifibreStrips: [
    { id: "CA", code: "DW-1", name: "Acetate (Cellulose Diacetate)", texture: "acetate-silk", sensitivity: "Moderate" },
    { id: "CO", code: "DW-2", name: "Bleached Cotton", texture: "cotton-weave", sensitivity: "High (Sock contact indicator)" },
    { id: "PA", code: "DW-3", name: "Polyamide (Nylon 6.6)", texture: "nylon-twill", sensitivity: "Very High (Anionic dye receptor)" },
    { id: "PES", code: "DW-4", name: "Polyester (PET)", texture: "poly-smooth", sensitivity: "Low at 37 °C" },
    { id: "PAC", code: "DW-5", name: "Acrylic (Polyacrylonitrile)", texture: "acrylic-spun", sensitivity: "Low" },
    { id: "WO", code: "DW-6", name: "Wool (Worsted)", texture: "wool-fleece", sensitivity: "Very High (Protein fibre receptor)" }
  ],

  isoGreyScale: [
    { grade: "5", deltaE: "0.00", contrastTone: 115, hex: "#737373", meaning: "No perceptible difference; excellent fastness (flawless)" },
    { grade: "4-5", deltaE: "0.80", contrastTone: 121, hex: "#797979", meaning: "Just perceptible difference; outstanding fastness" },
    { grade: "4", deltaE: "1.50", contrastTone: 129, hex: "#818181", meaning: "Slight difference; highly acceptable for premium footwear lining and socks" },
    { grade: "3-4", deltaE: "2.10", contrastTone: 140, hex: "#8c8c8c", meaning: "Noticeable difference; minimum acceptable limit for commercial footwear uppers" },
    { grade: "3", deltaE: "3.00", contrastTone: 155, hex: "#9b9b9b", meaning: "Appreciable colour loss; borderline, unacceptable for socks/linings" },
    { grade: "2-3", deltaE: "4.80", contrastTone: 175, hex: "#afafaf", meaning: "Considerable loss of dye / heavy cross-staining; failing quality" },
    { grade: "2", deltaE: "6.00", contrastTone: 195, hex: "#c3c3c3", meaning: "Heavy discolouration and severe staining onto socks" },
    { grade: "1-2", deltaE: "9.00", contrastTone: 215, hex: "#d7d7d7", meaning: "Very heavy colour destruction" },
    { grade: "1", deltaE: "12.00", contrastTone: 235, hex: "#ebebeb", meaning: "Complete loss of original shade / catastrophic dye migration" }
  ]
};
