// ==UserScript==
// @name         GeoGuessr Spectate UI Rework
// @namespace    123cobloc
// @version      1.2.1
// @description  Applies custom CSS on the spectate page
// @author       123cobloc
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @supportURL   https://github.com/123cobloc/geoguessr-spect-ui-rework/issues
// @downloadURL  https://github.com/123cobloc/geoguessr-spect-ui-rework/raw/main/uirework.user.js
// @updateURL    https://github.com/123cobloc/geoguessr-spect-ui-rework/raw/main/uirework.user.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let value = GM_getValue("svh_value", 23);
    const styleId = "custom-spectate-style";

    function updateValue() {
        let newValue = prompt("Set the header height.\nThe value is the percentage of screen taken by the header.\nSuggested value: 23", value);
        if (newValue !== null && !isNaN(newValue)) {
            value = parseFloat(newValue);
            GM_setValue("svh_value", value);

            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
                applyStyle();
            }
        }
    }

    GM_registerMenuCommand("Set header height", updateValue);

    function getCss() {
        return `
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
            
            div[class*="spectate-damage-animation_distanceContainer"] {
                top: 0svh !important;
            }
        `
    };

    function applyStyle() {
        const isSpectatePage = /\/duels\/.*\/spectate/.test(window.location.href);
        let styleElement = document.getElementById(styleId);

        if (isSpectatePage) {
            if (!styleElement) {
                styleElement = document.createElement("style");
                styleElement.id = styleId;
                styleElement.textContent = getCss();
                document.head.appendChild(styleElement);
            }
        } else {
            if (styleElement) {
                styleElement.remove();
            }
        }
    }

    const patchHistory = (type) => {
        const original = history[type];

        return function (...args) {
            const result = original.apply(this, args);
            const event = new Event(type.toLowerCase());
            window.dispatchEvent(event);

            return result;
        };
    };

    history.pushState = patchHistory('pushState');
    history.replaceState = patchHistory('replaceState');

    window.addEventListener('pushstate', applyStyle);
    window.addEventListener('replacestate', applyStyle);
    window.addEventListener('popstate', applyStyle);

    applyStyle();

})();
