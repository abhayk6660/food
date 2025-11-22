const mineflayer = require("mineflayer");

const CONFIG = {
  host: "SERVER_IP",
  port: 25565,
  username: "BOT_USERNAME",
  version: "1.21.1",
  loginPassword: "YOUR_PASSWORD",
  warpCommand: "/is warp food"
};

let bot;

function startBot() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  bot.once("spawn", () => {
    console.log("Bot spawned!");

    setTimeout(() => {
      bot.chat(`/login ${CONFIG.loginPassword}`);
      console.log("Logging in...");
    }, 1500);

    setTimeout(() => {
      bot.chat(CONFIG.warpCommand);
      console.log("Warping...");
    }, 3500);

    setTimeout(() => {
      console.log("Auto-eating enchanted golden apples started!");
      setInterval(autoEatGapple, 1200);
    }, 6000);
  });

  bot.on("error", err => console.log("Error:", err));
  bot.on("end", () => {
    console.log("Bot disconnected. Reconnecting...");
    setTimeout(startBot, 3000);
  });
}

startBot();

async function autoEatGapple() {
  try {
    const gapple = bot.inventory.items().find(item =>
      item.name === "enchanted_golden_apple"
    );

    if (!gapple) {
      console.log("No enchanted golden apples!");
      return;
    }

    console.log("Eating enchanted golden apple...");
    await bot.equip(gapple, "hand");
    await bot.consume();

  } catch (err) {
    console.log("Gapple eat error:", err.message);
  }
}
