// ==UserScript==
// @name         scoop.sh install cmd with bucket name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  scoop.sh install cmd with bucket name (让scoop.sh增加一个按钮使得复制命令时可以附带上bucket名,如:scoop install sudo -> scoop install main/sudo)
// @author       stoneman
// @match        *://scoop.sh/*
// @icon         https://scoop.sh/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      BSD
// ==/UserScript==

(function () {
    'use strict';

    var added_el = [];
    let observer = new MutationObserver(observer_action);
    observer.observe(document, { childList: true, subtree: true });

    function observer_action(observer) {
        let cards = document.querySelectorAll("div.card-body")
        for (const element of cards) {
            if (added_el.includes(element)) {
                continue;
            }
            added_el.push(element);

            let bucket_name = element.querySelector("div#bucket-command input").value.split(' ')[3];
            let cmd = element.querySelector("div#app-command input").value;
            let cmd_new = cmd.slice(0, 14) + `${bucket_name}/` + cmd.slice(14);

            let el_bt = element.querySelector("div#app-command button");
            let el = document.createElement("button");
            el.value = cmd_new;
            el.type = 'button';
            el.title = '复制含bucket名的命令';
            el.className = el_bt.className;
            for (const cel of el_bt.children) {
                el.append(cel.cloneNode(true));
            };
            el.addEventListener('click', async (e) => {
                // observer.disconnect();
                el.disabled = true;
                element.querySelector("div#app-command input").value = el.value;
                await navigator.clipboard.writeText(el.value)
                setTimeout(() => {
                    el.disabled = false;
                }, 1000);
            });
            el_bt.parentElement.appendChild(el);
            //console.log(cmd_new);
        };
    }
})();