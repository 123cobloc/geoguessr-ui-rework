// ==UserScript==
// @name         GeoGuessr Spectate UI Rework
// @namespace    123cobloc
// @version      1.0
// @description  Applies custom CSS on the spectate page
// @author       123cobloc
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @run-at       document-idle 
// @supportURL   https://github.com/123cobloc/geoguessr-ui-rework/issues
// @downloadURL  https://github.com/123cobloc/geoguessr-ui-rework/raw/main/uirework.user.js
// @updateURL    https://github.com/123cobloc/geoguessr-ui-rework/raw/main/uirework.user.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const value = 23;
    const styleId = "custom-spectate-style";

    const newCss = `
        div[class*="spectate-sidebar_root"] {
            display: none !important;
        }
        
        div[class*="spectate-header_root"] {
            height: ${value}svh !important;
            width: ${value * 2.25}svw !important;
            margin: 0 auto !important;
        }
        
        div[class*="spectate_layout_root"] {
            padding: calc(10svw / 6) !important;
        }
        
        div[class*="settings_settingsButtonContainer"] {
            top: 2.5svh !important;
            right: 1.5svw !important;
            bottom: auto !important;
            left: auto !important;
        }
        
        div[class*="spectate-map_buttonWrapper"] {
            bottom: calc(10svw / -6.3) !important;
        }
    `;

    function applyStyle() {
        const isSpectatePage = /\/duels\/.*\/spectate/.test(window.location.href);
        let styleElement = document.getElementById(styleId);

        if (isSpectatePage) {
            if (!styleElement) {
                styleElement = document.createElement("style");
                styleElement.id = styleId;
                styleElement.textContent = newCss;
                (document.head || document.documentElement).appendChild(styleElement);
            }
        } else if (styleElement) {
            styleElement.remove();
        }
    }

    // --- Gestione della navigazione SPA ---
    
    // Osservatore per i cambiamenti nell'URL (metodo più affidabile)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            applyStyle();
        }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Eseguiamo anche all'avvio
    applyStyle();
})();
