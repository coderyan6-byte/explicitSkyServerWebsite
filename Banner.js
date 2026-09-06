// Banner.js
// Load with:
// <script src="Banner.js"></script>

(function () {
    "use strict";

    const firebaseConfig = {
        apiKey: "AIzaSyAMlZXiyRcJ1PWg-3nBfqhtamwqIDI9Eyo",
        authDomain: "explicitskyserver.firebaseapp.com",
        projectId: "explicitskyserver",
        storageBucket: "explicitskyserver.firebasestorage.app",
        messagingSenderId: "114617019545",
        appId: "1:114617019545:web:8fc27a10458274318c1c08"
    };

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            const script = document.createElement("script");

            script.src = src;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }

    async function startBanner() {
        try {
            // Load Firebase without ES modules.
            if (!window.firebase) {
                await loadScript(
                    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js"
                );
            }

            if (!window.firebase.firestore) {
                await loadScript(
                    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore-compat.js"
                );
            }

            // Don't initialize Firebase twice.
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            const db = firebase.firestore();

            // Same document used by Console.html:
            // SiteConfig / banner
            const snapshot = await db
                .collection("SiteConfig")
                .doc("banner")
                .get();

            if (!snapshot.exists) {
                return;
            }

            const data = snapshot.data();

            // No active banner.
            if (!data || data.enabled !== true || !data.text) {
                return;
            }

            createBanner(data.text);
        } catch (error) {
            console.error("Site banner error:", error);
        }
    }

    function createBanner(text) {
        if (document.getElementById("explicitSkySiteBanner")) {
            return;
        }

        const banner = document.createElement("div");

        banner.id = "explicitSkySiteBanner";

        banner.innerHTML = `
    <span class="explicitSkyBannerIcon">!</span>
    <span class="explicitSkyBannerText"></span>
  `;

        banner.querySelector(".explicitSkyBannerText").textContent = text;

        const style = document.createElement("style");

        style.textContent = `
    #explicitSkySiteBanner {
      width: 100%;
      min-height: 32px;
      padding: 7px 18px;
      box-sizing: border-box;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      background: #0b0e15;
      color: #d7dbe4;

      border-bottom: 1px solid #2a303c;

      font-family: Inter, Arial, Helvetica, sans-serif;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.3;

      position: relative;
      z-index: 999999;
    }

    .explicitSkyBannerIcon {
      width: 16px;
      height: 16px;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 16px;

      background: #ffd900;
      color: #111;

      border-radius: 50%;

      font-family: Arial, sans-serif;
      font-size: 10px;
      font-weight: 900;
    }

    .explicitSkyBannerText {
      color: #e4e7ed;
    }

    @media (max-width: 560px) {
      #explicitSkySiteBanner {
        padding: 7px 12px;
        font-size: 10px;
      }

      .explicitSkyBannerIcon {
        width: 15px;
        height: 15px;
        flex-basis: 15px;
      }
    }
  `;

        document.head.appendChild(style);

        const nav = document.querySelector("nav");

        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(banner, nav);
        } else {
            document.body.insertBefore(banner, document.body.firstChild);
        }
    }

    /*
      Wait until the HTML has loaded so the <nav>
      exists before inserting the banner.
    */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startBanner);
    } else {
        startBanner();
    }
})();