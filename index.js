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

function startBot() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  // ------------ SHOW ALL SERVER CHAT ------------
  bot.on("message", msg => {
    console.log("[CHAT] " + msg.toString());
  });

  // ------------ SPAWN → LOGIN → WARP → EAT ------------
  bot.once("spawn", () => {
    console.log("Bot spawned, waiting for world load...");

    setTimeout(() => {
      bot.chat(`/login ${CONFIG.loginPassword}`);
      console.log("Logging in...");
    }, 2000);

    setTimeout(() => {
      bot.chat(CONFIG.warpCommand);
      console.log("Warping...");
    }, 4500);

    setTimeout(() => {
      console.log("Auto eating enchanted golden apples started!");
      setInterval(autoEatGapple, 1500);
    }, 7000);
  });

  bot.on("error", err => console.log("Error:", err));
  bot.on("end", () => {
    console.log("Bot disconnected. Reconnecting...");
    setTimeout(startBot, 3000);
  });
}

startBot();


// ------------ CONSTANT ENCHANTED GOLDEN APPLE EATING ------------
async function autoEatGapple() {
  try {
    if (isEating) return;

    const gapple = bot.inventory.items().find(item =>
      item.name === "enchanted_golden_apple"
    );

    if (!gapple) {
      console.log("No enchanted golden apples!");
      return;
    }

    isEating = true;
    console.log("Eating enchanted golden apple...");

    await bot.equip(gapple, "hand");
    await bot.consume();

    isEating = false;
  } catch (err) {
    console.log("Gapple eat error:", err.message);
    isEating = false;
  }
}
