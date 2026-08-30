# Risk or Reward: Touch the Stars! — Version 0.2

An original responsive probability-and-percentages space game by Divyam Chachan.

## Run it on a computer

Open `index.html` directly in a modern browser, or run a small local server from this folder:

```bash
# Mac
python3 -m http.server 8000

# Windows PowerShell
py -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). Stop the server with `Ctrl+C`.

## Play it on iPad Safari

1. Put the iPad and computer on the same Wi-Fi network.
2. Run the server command above on the computer.
3. Find the computer's local IP address: use `ipconfig getifaddr en0` on a Mac, or `ipconfig` and its IPv4 Address on Windows.
4. In Safari on the iPad, open `http://YOUR-IP:8000`, for example `http://192.168.1.42:8000`.
5. If the firewall asks, allow Python on private networks.

All main controls are large touch targets. Portrait stacks the play panels; landscape gives the full flight-deck layout.

## Files to change

- `game-config.js` — all editable content and balance numbers: starting resources, shop prices, Energy values, all 10 sector events, probabilities, rewards, penalties, percentage questions, and animation pacing.
- `game.js` — gameplay rules, resource updates, probability wheel result logic, Second Chance rules, and screen flow.
- `styles.css` — the retro-futuristic visual theme, ship, animated space environment, and responsive layout.
- `index.html` — launches the game.

## Font note

The game requests **Jungle Adventurer** for the main display type. If it is not installed, it automatically uses a bold retro/adventure-style local fallback so it remains readable without downloading any external asset.

## Version 0.2 additions

- Ten escalating sectors, each with a distinct event and space zone
- Animated flight deck with moving stars, particles, planet, comet, speed lines, and spacecraft
- Takeoff sequence before the mission begins
- Animated probability wheel: green success slice, red danger slice, and a spinning arrow that stops on the calculated outcome
- Second Chance feedback now includes the correct answer and a brief maths explanation after an incorrect response

## Recommended checks before Version 0.3

1. Try a Shield on an event and confirm it adds exactly 20 percentage points without exceeding 100%.
2. Test both Second Chance branches: a direct penalty and an event with no direct loss.
3. Buy Energy and Shields in the Shop, then use 5- and 10-Energy safe travel.
4. Reach the final screen with fewer than 1,000 Gems and with at least 1,000 Gems.
5. Test iPad Safari in portrait and landscape.
