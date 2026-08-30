/*
 * RISK OR REWARD: TOUCH THE STARS! — Version 0.2
 *
 * GAME BALANCE + CONTENT SETTINGS
 * Edit this file to change resources, prices, events, questions, and pacing.
 * The gameplay rules and screen behaviour live in game.js.
 */
const GAME_CONFIG = {
  version: "0.2",
  creator: "Divyam Chachan",

  // Starting resources and final objective
  STARTING_GEMS: 100,
  STARTING_ENERGY: 10,
  STARTING_SHIELDS: 1,
  WIN_GEMS: 1000,
  WIN_PROGRESS: 100,

  // Journey, probability and animation settings
  SECTOR_PROGRESS: 10,
  TOTAL_SECTORS: 10,
  SHIELD_BONUS: 20,
  TAKEOFF_ANIMATION_MS: 1650,
  RESULT_ANIMATION_MS: 2650,

  // Space Shop and safe-travel values
  ENERGY_5_PRICE: 50,
  ENERGY_5_AMOUNT: 5,
  ENERGY_5_PROGRESS: 5,
  ENERGY_10_PRICE: 75,
  ENERGY_10_AMOUNT: 10,
  ENERGY_10_PROGRESS: 10,
  SHIELD_PRICE: 100,
  SHIELD_AMOUNT: 1,

  // Second Chance rewards
  SECOND_CHANCE_LOW_REWARD_PERCENT: 0.30,
  SECOND_CHANCE_HIGH_REWARD_PERCENT: 0.10,

  /*
   * One event for each sector. Later sectors are less certain and have bigger
   * rewards/risks. `directPenalty: 0` means there is no direct negative
   * outcome: a correct Second Chance answer redeems 30% of the reward.
   */
  EVENTS: [
    { id: "glimmer-belt", zone: "GLIMMER BELT", type: "💎 TREASURE RUN", name: "LUMEN CRYSTAL BELT", description: "A ribbon of blue crystals drifts ahead. Thread the ship through its calmest gap.", probability: 70, reward: 130, directPenalty: 30, icon: "◆", accent: "aqua", intensity: "CALM ORBIT" },
    { id: "ion-comet", zone: "ION TRAIL", type: "🎲 RISK JUMP", name: "COMET TAIL SLINGSHOT", description: "Hook onto a fast-moving comet tail and let its ion wake pull you through space.", probability: 68, reward: 100, directPenalty: 40, icon: "☄", accent: "violet", intensity: "SWIFT CURRENT" },
    { id: "satellite-ring", zone: "SATELLITE RING", type: "🛰️ SALVAGE RISK", name: "ORBITAL VAULT", description: "An abandoned research satellite is still broadcasting a Gem vault signal.", probability: 64, reward: 160, directPenalty: 60, icon: "✦", accent: "gold", intensity: "ORBITAL STATIC" },
    { id: "nebula-gate", zone: "VIOLET NEBULA", type: "🌌 RISK GATE", name: "NEBULA MIRROR GATE", description: "A glowing gate flickers in the gas clouds. Only one path leads to its treasure cache.", probability: 60, reward: 210, directPenalty: 85, icon: "◌", accent: "violet", intensity: "RIPPLING FOG" },
    { id: "asteroid-hop", zone: "EMBER DRIFT", type: "🎲 RISK RUN", name: "ASTEROID HOP", description: "A small Gem cache tumbles between hot asteroids. A quick manoeuvre can collect it safely.", probability: 58, reward: 90, directPenalty: 0, icon: "●", accent: "coral", intensity: "HEATED DRIFT" },
    { id: "magnetar", zone: "MAGNETAR WAKE", type: "⚠️ HAZARD RISK", name: "MAGNETIC VAULT", description: "A vault spins inside a magnetic storm. Its pulse can pull you in—or fling you away.", probability: 54, reward: 250, directPenalty: 110, icon: "✹", accent: "aqua", intensity: "ELECTRIC STORM" },
    { id: "nova-reef", zone: "NOVA REEF", type: "☄️ HAZARD RISK", name: "SUPERNOVA REEF", description: "A glittering reef surrounds a dying star. Bright Gem shards are caught in its energy waves.", probability: 50, reward: 280, directPenalty: 130, icon: "✺", accent: "coral", intensity: "SOLAR SURGE" },
    { id: "void-run", zone: "THE DEEP VOID", type: "🌑 VOID RISK", name: "SINGULARITY RUN", description: "A silent shortcut cuts through the Void. The signal says there is a rare cache on the other side.", probability: 46, reward: 320, directPenalty: 160, icon: "◉", accent: "violet", intensity: "GRAVITY SHEAR" },
    { id: "starforge", zone: "STARFORGE", type: "⭐ ELITE RISK", name: "STARFORGE TREASURE", description: "A legendary forge releases Gem fragments as its ancient engines flare back to life.", probability: 42, reward: 350, directPenalty: 200, icon: "✧", accent: "gold", intensity: "FORGE FLARE" },
    { id: "haven-approach", zone: "STAR HAVEN APPROACH", type: "🚀 FINAL RISK", name: "THE LAST STAR JUMP", description: "Star Haven is visible beyond the final rift. One legendary cache is suspended in the jump path.", probability: 38, reward: 450, directPenalty: 250, icon: "★", accent: "gold", intensity: "FINAL APPROACH" }
  ],

  /*
   * Percentage questions. `minSector` makes the maths gradually harder.
   * Keep four choices and make `correctIndex` 0=A, 1=B, 2=C, 3=D.
   * `explanation` is shown after a wrong answer.
   */
  PERCENTAGE_QUESTIONS: [
    { minSector: 1, question: "What is 25% of 80?", choices: ["10", "20", "30", "40"], correctIndex: 1, explanation: "25% is one quarter. One quarter of 80 is 80 ÷ 4 = 20." },
    { minSector: 2, question: "What is 15% of 200?", choices: ["20", "25", "30", "35"], correctIndex: 2, explanation: "10% of 200 is 20 and 5% is 10. Add them: 20 + 10 = 30." },
    { minSector: 3, question: "What is 40% of 75?", choices: ["25", "30", "35", "40"], correctIndex: 1, explanation: "40% = 0.40. Multiply 75 × 0.40 = 30." },
    { minSector: 4, question: "What is 35% of 120?", choices: ["36", "40", "42", "48"], correctIndex: 2, explanation: "30% of 120 is 36 and 5% is 6. Together, 36 + 6 = 42." },
    { minSector: 5, question: "What is 12.5% of 80?", choices: ["8", "10", "12", "16"], correctIndex: 1, explanation: "12.5% is one eighth. 80 ÷ 8 = 10." },
    { minSector: 6, question: "What is 60% of 90?", choices: ["45", "50", "54", "60"], correctIndex: 2, explanation: "60% = 0.60. Multiply 90 × 0.60 = 54." },
    { minSector: 7, question: "What is 18% of 150?", choices: ["24", "27", "30", "33"], correctIndex: 1, explanation: "10% of 150 is 15 and 8% is 12. Add them: 15 + 12 = 27." },
    { minSector: 8, question: "What is 45% of 160?", choices: ["64", "68", "72", "76"], correctIndex: 2, explanation: "40% of 160 is 64 and 5% is 8. Together, 64 + 8 = 72." },
    { minSector: 9, question: "What is 30% of 240?", choices: ["60", "66", "72", "78"], correctIndex: 2, explanation: "30% = 0.30. Multiply 240 × 0.30 = 72." },
    { minSector: 10, question: "What is 75% of 180?", choices: ["125", "130", "135", "140"], correctIndex: 2, explanation: "75% is three quarters. One quarter of 180 is 45, and 45 × 3 = 135." }
  ]
};
