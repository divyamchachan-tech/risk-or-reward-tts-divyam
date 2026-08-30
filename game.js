/* global GAME_CONFIG */

// RISK OR REWARD: TOUCH THE STARS! — Version 0.2
// Editable numbers and content live in game-config.js.

const app = document.querySelector("#app");
let state = newGameState();

function newGameState() {
  return { screen: "title", gems: GAME_CONFIG.STARTING_GEMS, energy: GAME_CONFIG.STARTING_ENERGY, shields: GAME_CONFIG.STARTING_SHIELDS, progress: 0, shieldArmed: false, shopOpen: false, pending: null };
}

function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
function formatGems(value) { return Math.round(value).toLocaleString(); }
function currentSectorNumber() { return Math.min(GAME_CONFIG.TOTAL_SECTORS, Math.floor(state.progress / GAME_CONFIG.SECTOR_PROGRESS) + 1); }
function currentEvent() { return GAME_CONFIG.EVENTS[currentSectorNumber() - 1]; }
function finalChance(event) { return clamp(event.probability + (state.shieldArmed ? GAME_CONFIG.SHIELD_BONUS : 0), 0, 100); }
function canTravel(energyCost) { return state.energy >= energyCost && state.progress < GAME_CONFIG.WIN_PROGRESS; }
function highRewardBonus(event) { return Math.round(event.reward * GAME_CONFIG.SECOND_CHANCE_HIGH_REWARD_PERCENT); }
function lowRewardBonus(event) { return Math.round(event.reward * GAME_CONFIG.SECOND_CHANCE_LOW_REWARD_PERCENT); }
function eventPenaltyText(event) { return event.directPenalty > 0 ? `−${formatGems(event.directPenalty)} 💎` : "No direct loss"; }

function renderHud() {
  const sector = state.progress >= GAME_CONFIG.WIN_PROGRESS ? GAME_CONFIG.TOTAL_SECTORS : currentSectorNumber();
  return `<header class="hud" aria-label="Player resources"><div class="command-badge"><b>✦</b><span>STAR HAVEN<br>COMMAND</span></div><div class="resource-grid"><div class="resource resource-gems"><span>💎</span><div><small>GEMS</small><strong>${formatGems(state.gems)}</strong></div></div><div class="resource resource-energy"><span>⚡</span><div><small>ENERGY</small><strong>${state.energy}</strong></div></div><div class="resource resource-shield"><span>🛡️</span><div><small>SHIELDS</small><strong>${state.shields}</strong></div></div><div class="resource resource-progress"><span>🚀</span><div><small>JOURNEY</small><strong>${state.progress}%</strong></div></div></div><p class="sector-readout">SECTOR ${String(sector).padStart(2, "0")} / ${GAME_CONFIG.TOTAL_SECTORS} <i></i> STAR HAVEN ROUTE</p></header>`;
}

function renderSpacecraft() {
  return `<div class="spacecraft" aria-hidden="true"><div class="engine-flame"></div><div class="ship-wing wing-left"></div><div class="ship-wing wing-right"></div><div class="ship-body"><div class="cockpit"></div></div></div>`;
}

function renderFlightDeck() {
  const event = currentEvent();
  const nodes = Array.from({ length: GAME_CONFIG.TOTAL_SECTORS }, (_, index) => {
    const reached = state.progress >= (index + 1) * GAME_CONFIG.SECTOR_PROGRESS;
    const active = index + 1 === currentSectorNumber();
    return `<span class="sector-node ${reached ? "reached" : ""} ${active ? "active" : ""}" aria-label="Sector ${index + 1}">${index + 1}</span>`;
  }).join("");
  const particles = Array.from({ length: 16 }, (_, index) => `<i class="space-particle p${index + 1}"></i>`).join("");
  return `<section class="flight-deck panel zone-${event.accent}" aria-label="Live space flight scene"><div class="flight-heading"><div><p class="eyebrow">CURRENT ZONE</p><h2>${event.zone}</h2></div><span>${event.intensity}</span></div><div class="flight-window"><div class="star-stream">${particles}</div><div class="distant-planet"></div><div class="orbit-ring"></div><div class="comet-object"></div><div class="speed-lines"></div>${renderSpacecraft()}<div class="window-label top">AUTOPILOT // ACTIVE</div><div class="window-label bottom">FLIGHT VECTOR: ${state.progress}%</div></div><div class="journey-track" aria-label="${state.progress}% Journey Progress"><div class="journey-fill" style="width:${state.progress}%"></div>${nodes}<span class="haven-star">★</span></div><div class="route-legend"><span>EARTH ORBIT</span><b>${state.progress}% JOURNEY PROGRESS</b><span>STAR HAVEN</span></div></section>`;
}

function renderMissionCard() {
  const event = currentEvent();
  const chance = finalChance(event);
  const shieldAvailable = state.shields > 0;
  const shieldMessage = state.shieldArmed ? `<div class="shield-console armed"><span>🛡️ SHIELD LOCKED</span><b>${event.probability}% + ${GAME_CONFIG.SHIELD_BONUS}% = ${chance}%</b><em>Shield will be consumed at launch.</em></div>` : `<div class="shield-console"><span>BASE SUCCESS CHANCE</span><b>${event.probability}%</b><em>${shieldAvailable ? `Shield gives +${GAME_CONFIG.SHIELD_BONUS} percentage points (max 100%).` : "No Shield in cargo."}</em></div>`;
  return `<section class="mission-card panel accent-${event.accent}"><div class="mission-strip"><span>${event.type}</span><b>SECTOR ${String(currentSectorNumber()).padStart(2, "0")}</b></div><div class="event-sigil" aria-hidden="true"><i></i><span>${event.icon}</span></div><h1>${event.name}</h1><p class="mission-description">${event.description}</p><div class="odds-board"><div class="chance-stat"><small>SUCCESS</small><strong>${chance}%</strong></div><div><small>REWARD</small><strong>+${formatGems(event.reward)} 💎</strong></div><div><small>RISK</small><strong class="negative">${eventPenaltyText(event)}</strong></div></div>${shieldMessage}<div class="mission-actions">${shieldAvailable && !state.shieldArmed ? `<button class="button button-shield" data-action="arm-shield">USE SHIELD <b>+${GAME_CONFIG.SHIELD_BONUS}%</b></button>` : ""}${state.shieldArmed ? `<button class="button button-muted" data-action="disarm-shield">STOW SHIELD</button>` : ""}<button class="button button-launch" data-action="risk">TAKE THE RISK <span>▶</span></button></div><p class="card-footnote">A successful event advances ${GAME_CONFIG.SECTOR_PROGRESS}% towards Star Haven. The odds are real, not pre-chosen.</p></section>`;
}

function renderTravelControls() {
  const fiveDisabled = canTravel(GAME_CONFIG.ENERGY_5_AMOUNT) ? "" : "disabled";
  const tenDisabled = canTravel(GAME_CONFIG.ENERGY_10_AMOUNT) ? "" : "disabled";
  return `<section class="travel-controls panel" aria-label="Safe energy travel"><div><p class="eyebrow">SAFETY OPTION</p><h2>Burn Energy. Skip danger.</h2><p>Energy moves the ship without a probability event.</p></div><div class="travel-buttons"><button class="button button-energy" data-action="travel-five" ${fiveDisabled}>USE 5 ⚡ <b>+5%</b></button><button class="button button-energy" data-action="travel-ten" ${tenDisabled}>USE 10 ⚡ <b>+10%</b></button><button class="button button-shop" data-action="open-shop">SPACE SHOP <span>🛒</span></button></div></section>`;
}

function renderExplore() { return `${renderHud()}<main class="game-grid"><div class="left-column">${renderFlightDeck()}${renderTravelControls()}</div>${renderMissionCard()}</main><footer class="game-footer"><span>V${GAME_CONFIG.version} // DEEP-SPACE PROBABILITY MISSION</span><button class="text-button" data-action="restart">RESTART MISSION</button></footer>${state.shopOpen ? renderShop() : ""}`; }

function renderShop() {
  const shopItems = [{ action: "buy-energy-five", icon: "⚡", title: "5 ENERGY CELLS", detail: `Unlock +${GAME_CONFIG.ENERGY_5_PROGRESS}% safe travel`, price: GAME_CONFIG.ENERGY_5_PRICE }, { action: "buy-energy-ten", icon: "⚡", title: "10 ENERGY CELLS", detail: `Unlock +${GAME_CONFIG.ENERGY_10_PROGRESS}% safe travel`, price: GAME_CONFIG.ENERGY_10_PRICE }, { action: "buy-shield", icon: "🛡️", title: "1 STAR SHIELD", detail: `Boost one event by +${GAME_CONFIG.SHIELD_BONUS} points`, price: GAME_CONFIG.SHIELD_PRICE }];
  return `<div class="modal-backdrop"><section class="shop-modal panel" role="dialog" aria-modal="true" aria-labelledby="shop-title"><button class="close-button" aria-label="Close Space Shop" data-action="close-shop">×</button><p class="eyebrow">STAR HAVEN SUPPLY DRONE</p><h1 id="shop-title">SPACE SHOP <span>🛒</span></h1><p class="shop-balance">CARGO BALANCE <b>💎 ${formatGems(state.gems)}</b></p><div class="shop-items">${shopItems.map((item) => `<article class="shop-item"><span class="shop-icon">${item.icon}</span><div><h2>${item.title}</h2><p>${item.detail}</p></div><button class="button button-buy" data-action="${item.action}" ${state.gems < item.price ? "disabled" : ""}>${item.price} 💎</button></article>`).join("")}</div><p class="tiny-note">The supply drone only docks between encounters.</p></section></div>`;
}

function renderProbabilityWheel(pending, isResolved) {
  const danger = 100 - pending.chance;
  return `<div class="probability-wheel ${isResolved ? "wheel-resolved" : "wheel-spinning"}" style="--success-angle:${pending.chance * 3.6}deg; --spin-end:${pending.spinEnd}deg"><div class="pie-slice"><span class="pie-success">${pending.chance}%<i>SUCCESS</i></span><span class="pie-danger">${danger}%<i>DANGER</i></span><div class="pie-core">ODDS<br><b>LOCKED</b></div></div><div class="pie-arrow" aria-hidden="true"><i>▲</i></div></div>`;
}

function renderResult() {
  const pending = state.pending;
  const event = pending.event;
  const wheel = renderProbabilityWheel(pending, pending.resolved);
  if (!pending.resolved) return `${renderHud()}<section class="result-screen panel resolving"><p class="eyebrow">PROBABILITY ENGINE</p>${wheel}<h1>CHARTING THE JUMP</h1><p>The arrow is spinning through the real ${pending.chance}% success / ${100 - pending.chance}% danger split.</p><div class="signal-bars"><i></i><i></i><i></i><i></i><i></i></div></section>`;
  const success = pending.success;
  const copy = success ? `The arrow landed in the success zone. You collect +${formatGems(event.reward)} 💎 and advance ${GAME_CONFIG.SECTOR_PROGRESS}% through the route.` : event.directPenalty > 0 ? `The arrow landed in danger. A −${formatGems(pending.appliedPenalty)} 💎 outcome is queued—but a Percentage Second Chance can cancel it.` : "The arrow landed in danger. This event has no direct loss, so a correct Percentage Second Chance can redeem part of its reward.";
  return `${renderHud()}<section class="result-screen panel ${success ? "result-success" : "result-failure"}"><p class="eyebrow">${success ? "SUCCESS SIGNAL" : "RISK RESULT"}</p>${wheel}<h1>${success ? "REWARD SECURED!" : "TRAJECTORY MISSED"}</h1><p class="result-copy">${copy}</p><div class="result-stat"><span>${success ? "CARGO RECEIVED" : "NEXT MOVE"}</span><b>${success ? `+${formatGems(event.reward)} 💎` : "SECOND CHANCE"}</b></div><button class="button button-launch" data-action="continue-result">${success ? "CONTINUE FLIGHT" : "OPEN SECOND CHANCE"} <span>▶</span></button></section>`;
}

function renderSecondChance() {
  const pending = state.pending;
  const event = pending.event;
  const question = pending.question;
  const answered = Boolean(pending.secondChance);
  const ruleText = event.directPenalty > 0 ? `Correct: cancel the −${formatGems(pending.appliedPenalty)} 💎 outcome and collect +${formatGems(highRewardBonus(event))} 💎 (10% of the reward). Incorrect: the −${formatGems(pending.appliedPenalty)} 💎 outcome applies.` : `Correct: redeem +${formatGems(lowRewardBonus(event))} 💎 (30% of the ${formatGems(event.reward)} 💎 reward). Incorrect: the reward is not redeemed.`;
  const feedback = pending.secondChance ? `<div class="answer-feedback ${pending.secondChance.correct ? "correct" : "incorrect"}"><h2>${pending.secondChance.correct ? "NAVIGATION FIXED!" : "MATHS CHECK"}</h2><p>${pending.secondChance.message}</p><button class="button button-launch" data-action="continue-second">RETURN TO FLIGHT <span>▶</span></button></div>` : "";
  return `${renderHud()}<section class="second-chance panel"><div class="math-orbit" aria-hidden="true">%</div><p class="eyebrow">PERCENTAGE SECOND CHANCE</p><h1>Repair the jump calculation</h1><p class="recovery-rule">${ruleText}</p><div class="question-card"><span>FLIGHT MATHS TERMINAL</span><h2>${question.question}</h2><div class="answer-grid">${question.choices.map((choice, index) => `<button class="answer-button ${answered && index === question.correctIndex ? "answer-correct" : ""}" data-action="answer" data-answer="${index}" ${answered ? "disabled" : ""}><b>${"ABCD"[index]}</b>${choice}</button>`).join("")}</div></div>${feedback}</section>`;
}

function renderTitle() { return `<section class="title-screen"><div class="title-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="title-ship">${renderSpacecraft()}</div><p class="eyebrow">A DEEP-SPACE MATH ADVENTURE</p><h1><span>RISK OR REWARD</span><strong>TOUCH THE STARS!</strong></h1><p class="byline">By ${GAME_CONFIG.creator}</p><button class="button button-launch start-button" data-action="start">START JOURNEY <span>▶</span></button><p class="title-note">Master probability. Rescue rewards. Reach Star Haven.</p></section>`; }
function renderTakeoff() { return `<section class="takeoff-screen"><div class="takeoff-stars" aria-hidden="true"></div><p class="eyebrow">LAUNCH SEQUENCE</p><h1>ENGINES IGNITING</h1><div class="takeoff-ship">${renderSpacecraft()}</div><div class="launch-meter"><span></span></div><p>STAR HAVEN ROUTE // READY</p></section>`; }
function renderFinal() { const won = state.gems >= GAME_CONFIG.WIN_GEMS; const copy = won ? "You completed the route and collected enough Gems to enter Star Haven." : `You completed the route, but your cargo holds ${formatGems(state.gems)} 💎. Star Haven requires ${formatGems(GAME_CONFIG.WIN_GEMS)} 💎.`; return `<section class="final-screen panel ${won ? "final-win" : "final-fail"}"><div class="final-emblem">${won ? "★" : "☄"}</div><p class="eyebrow">JOURNEY COMPLETE</p><h1>${won ? "STAR HAVEN REACHED!" : "MISSION FAILED"}</h1><p>${copy}</p><div class="final-score"><span>JOURNEY PROGRESS</span><b>${state.progress}%</b><span>GEMS COLLECTED</span><b>💎 ${formatGems(state.gems)}</b></div><p class="tiny-note">Victory needs 100% Journey Progress and at least ${formatGems(GAME_CONFIG.WIN_GEMS)} Gems.</p><button class="button button-launch" data-action="restart">START NEW JOURNEY <span>▶</span></button></section>`; }

function render() { const screens = { title: renderTitle, takeoff: renderTakeoff, explore: renderExplore, result: renderResult, "second-chance": renderSecondChance, final: renderFinal }; app.innerHTML = screens[state.screen](); }

function startGame() { state = newGameState(); state.screen = "takeoff"; const launchState = state; render(); window.setTimeout(() => { if (state === launchState && state.screen === "takeoff") { state.screen = "explore"; render(); } }, GAME_CONFIG.TAKEOFF_ANIMATION_MS); }
function selectQuestion(sector) { const eligible = GAME_CONFIG.PERCENTAGE_QUESTIONS.filter((question) => question.minSector <= sector); return eligible[Math.floor(Math.random() * eligible.length)]; }
function landingAngle(success, chance) { const successArc = chance * 3.6; const padding = 6; let min = success ? padding : successArc + padding; let max = success ? successArc - padding : 360 - padding; if (max < min) { min = success ? 0 : successArc; max = success ? successArc : 360; } return 1080 + min + Math.random() * Math.max(1, max - min); }

function takeRisk() {
  if (state.screen !== "explore" || state.shopOpen) return;
  const event = currentEvent(); const chance = finalChance(event); const usedShield = state.shieldArmed; const success = Math.random() < chance / 100;
  if (usedShield) state.shields -= 1;
  state.shieldArmed = false;
  state.pending = { event, chance, success, spinEnd: landingAngle(success, chance), resolved: false, appliedPenalty: Math.min(state.gems, event.directPenalty) };
  state.screen = "result"; const pendingResult = state.pending; render();
  // The outcome comes from the displayed chance; it is never selected to help the player.
  window.setTimeout(() => { if (state.screen !== "result" || state.pending !== pendingResult) return; pendingResult.resolved = true; if (pendingResult.success) { state.gems += event.reward; state.progress = clamp(state.progress + GAME_CONFIG.SECTOR_PROGRESS, 0, GAME_CONFIG.WIN_PROGRESS); } render(); }, GAME_CONFIG.RESULT_ANIMATION_MS);
}

function openSecondChance() { if (state.screen !== "result" || !state.pending?.resolved || state.pending.success) return; state.pending.question = selectQuestion(currentSectorNumber()); state.screen = "second-chance"; render(); }
function answerQuestion(answerIndex) {
  if (state.screen !== "second-chance" || state.pending.secondChance) return;
  const pending = state.pending; const question = pending.question; const correct = answerIndex === question.correctIndex; const event = pending.event; let message;
  if (event.directPenalty > 0) { if (correct) { const bonus = highRewardBonus(event); state.gems += bonus; message = `Correct! The queued −${formatGems(pending.appliedPenalty)} 💎 outcome is cancelled, and you collect +${formatGems(bonus)} 💎 (10% of ${formatGems(event.reward)}).`; } else { state.gems = Math.max(0, state.gems - pending.appliedPenalty); message = `The correct answer was ${question.choices[question.correctIndex]}. ${question.explanation} The −${formatGems(pending.appliedPenalty)} 💎 outcome now applies.`; } }
  else if (correct) { const bonus = lowRewardBonus(event); state.gems += bonus; message = `Correct! You redeem 30% of the reward: +${formatGems(bonus)} 💎.`; }
  else { message = `The correct answer was ${question.choices[question.correctIndex]}. ${question.explanation} There was no direct Gem loss on this event, but its reward was not redeemed.`; }
  pending.secondChance = { correct, message }; render();
}
function finishIfAtStarHaven() { if (state.progress >= GAME_CONFIG.WIN_PROGRESS) { state.progress = GAME_CONFIG.WIN_PROGRESS; state.shopOpen = false; state.screen = "final"; } }
function continueResult() { if (state.screen !== "result" || !state.pending?.resolved) return; if (!state.pending.success) { openSecondChance(); return; } state.pending = null; finishIfAtStarHaven(); if (state.screen !== "final") state.screen = "explore"; render(); }
function continueSecondChance() { if (state.screen !== "second-chance" || !state.pending?.secondChance) return; state.pending = null; state.screen = "explore"; render(); }
function buy(price, receive) { if (state.screen !== "explore" || !state.shopOpen || state.gems < price) return; state.gems -= price; receive(); render(); }
function travel(cost, progressGain) { if (state.screen !== "explore" || state.shopOpen || !canTravel(cost)) return; state.energy -= cost; state.progress = clamp(state.progress + progressGain, 0, GAME_CONFIG.WIN_PROGRESS); state.shieldArmed = false; finishIfAtStarHaven(); render(); }

function handleAction(action, button) {
  switch (action) {
    case "start": startGame(); break; case "restart": state = newGameState(); render(); break;
    case "open-shop": if (state.screen === "explore") { state.shopOpen = true; render(); } break; case "close-shop": state.shopOpen = false; render(); break;
    case "arm-shield": if (state.shields > 0 && state.screen === "explore") { state.shieldArmed = true; render(); } break; case "disarm-shield": if (state.screen === "explore") { state.shieldArmed = false; render(); } break;
    case "risk": takeRisk(); break; case "continue-result": continueResult(); break; case "answer": answerQuestion(Number(button.dataset.answer)); break; case "continue-second": continueSecondChance(); break;
    case "travel-five": travel(GAME_CONFIG.ENERGY_5_AMOUNT, GAME_CONFIG.ENERGY_5_PROGRESS); break; case "travel-ten": travel(GAME_CONFIG.ENERGY_10_AMOUNT, GAME_CONFIG.ENERGY_10_PROGRESS); break;
    case "buy-energy-five": buy(GAME_CONFIG.ENERGY_5_PRICE, () => { state.energy += GAME_CONFIG.ENERGY_5_AMOUNT; }); break; case "buy-energy-ten": buy(GAME_CONFIG.ENERGY_10_PRICE, () => { state.energy += GAME_CONFIG.ENERGY_10_AMOUNT; }); break; case "buy-shield": buy(GAME_CONFIG.SHIELD_PRICE, () => { state.shields += GAME_CONFIG.SHIELD_AMOUNT; }); break;
    default: break;
  }
}

app.addEventListener("click", (event) => { const button = event.target.closest("[data-action]"); if (button && !button.disabled) handleAction(button.dataset.action, button); });
render();
