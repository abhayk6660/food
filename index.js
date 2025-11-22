const mineflayer = require("mineflayer");

const CONFIG = {
  host: "mc.leftypvp.net",
  port: 25565,
  username: "abhay6660",
  version: "1.21.1",
  loginPassword: "86259233",
  warpCommand: "/is warp food"
};

let bot;
let isEating = false;
let waitingForEffect = false;

function startBot() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  // ---------------- SHOW ALL SERVER CHAT ----------------
  bot.on("message", msg => {
    console.log("[CHAT] " + msg.toString());
  });

  // ---------------- SPAWN → LOGIN → WARP → EAT ----------------
  bot.once("spawn", () => {
    console.log("Bot spawned, waiting...");

    setTimeout(() => {
      bot.chat(`/login ${CONFIG.loginPassword}`);
      console.log("Logging in...");
    }, 2000);

    setTimeout(() => {
      bot.chat(CONFIG.warpCommand);
      console.log("Warping...");
    }, 4500);

    setTimeout(() => {
      console.log("Starting auto-eating...");
      setInterval(autoEatGapple, 1500);
    }, 7000);
  });

  bot.on("error", err => console.log("Error:", err));
  bot.on("end", () => {
    console.log("Bot disconnected. Reconnecting...");
    setTimeout(startBot, 3000);
  });

  // ---------------- CONFIRM REAL EATING (POTION EFFECT RECEIVED) ----------------
  bot.on("entityEffect", (entity, effect) => {
    // When bot eats enchanted golden apple → Absorption + Regeneration triggered
    if (entity === bot.entity && waitingForEffect) {
      console.log("✔ Eating confirmed (effect applied).");
      waitingForEffect = false;
      isEating = false;
    }
  });
}

startBot();

// ------------------------------------------------------------
// REAL ANTI-BUG NON-STOP ENCHANTED GOLDEN APPLE EATING
// ------------------------------------------------------------
async function autoEatGapple() {
  try {
    if (isEating || waitingForEffect) return;

    const gapple = bot.inventory.items().find(i => i.name === "enchanted_golden_apple");
    if (!gapple) {
      console.log("No enchanted golden apples!");
      return;
    }

    console.log("Attempting to eat enchanted golden apple...");
    isEating = true;
    waitingForEffect = true;

    await bot.equip(gapple, "hand");
    await bot.consume();

    // RESET IF SERVER LAGS AND EFFECT DOESN'T ARRIVE
    setTimeout(() => {
      if (waitingForEffect) {
        console.log("⚠ Eating failed (lag or cancelled). Resetting...");
        waitingForEffect = false;
        isEating = false;
      }
    }, 4000);

  } catch (err) {
    console.log("Eat error:", err.message);
    isEating = false;
    waitingForEffect = false;
  }
}
