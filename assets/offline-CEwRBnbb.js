(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`Required Notice: Copyright (c) 2026 Anthony Mercer (https://github.com/antonsoo/dioptra)

# PolyForm Noncommercial License 1.0.0

<https://polyformproject.org/licenses/noncommercial/1.0.0>

## Acceptance

In order to get any license under these terms, you must agree to them as both strict obligations and conditions to all your licenses.

## Copyright License

The licensor grants you a copyright license for the software to do everything you might do with the software that would otherwise infringe the licensor's copyright in it for any permitted purpose.  However, you may only distribute the software according to [Distribution License](#distribution-license) and make changes or new works based on the software according to [Changes and New Works License](#changes-and-new-works-license).

## Distribution License

The licensor grants you an additional copyright license to distribute copies of the software.  Your license to distribute covers distributing the software with changes and new works permitted by [Changes and New Works License](#changes-and-new-works-license).

## Notices

You must ensure that anyone who gets a copy of any part of the software from you also gets a copy of these terms or the URL for them above, as well as copies of any plain-text lines beginning with \`Required Notice:\` that the licensor provided with the software.  For example:

> Required Notice: Copyright Yoyodyne, Inc. (http://example.com)

## Changes and New Works License

The licensor grants you an additional copyright license to make changes and new works based on the software for any permitted purpose.

## Patent License

The licensor grants you a patent license for the software that covers patent claims the licensor can license, or becomes able to license, that you would infringe by using the software.

## Noncommercial Purposes

Any noncommercial purpose is a permitted purpose.

## Personal Uses

Personal use for research, experiment, and testing for the benefit of public knowledge, personal study, private entertainment, hobby projects, amateur pursuits, or religious observance, without any anticipated commercial application, is use for a permitted purpose.

## Noncommercial Organizations

Use by any charitable organization, educational institution, public research organization, public safety or health organization, environmental protection organization, or government institution is use for a permitted purpose regardless of the source of funding or obligations resulting from the funding.

## Fair Use

You may have "fair use" rights for the software under the law. These terms do not limit them.

## No Other Rights

These terms do not allow you to sublicense or transfer any of your licenses to anyone else, or prevent the licensor from granting licenses to anyone else.  These terms do not imply any other licenses.

## Patent Defense

If you make any written claim that the software infringes or contributes to infringement of any patent, your patent license for the software granted under these terms ends immediately. If your company makes such a claim, your patent license ends immediately for work on behalf of your company.

## Violations

The first time you are notified in writing that you have violated any of these terms, or done anything with the software not covered by your licenses, your licenses can nonetheless continue if you come into full compliance with these terms, and take practical steps to correct past violations, within 32 days of receiving notice.  Otherwise, all your licenses end immediately.

## No Liability

***As far as the law allows, the software comes as is, without any warranty or condition, and the licensor will not be liable to you for any damages arising out of these terms or the use or nature of the software, under any kind of legal claim.***

## Definitions

The **licensor** is the individual or entity offering these terms, and the **software** is the software the licensor makes available under these terms.

**You** refers to the individual or entity agreeing to these terms.

**Your company** is any legal entity, sole proprietorship, or other kind of organization that you work for, plus all organizations that have control over, are under the control of, or are under common control with that organization.  **Control** means ownership of substantially all the assets of an entity, or the power to direct its management and policies by vote, contract, or otherwise.  Control can be direct or indirect.

**Your licenses** are all the licenses granted to you for the software under these terms.

**Use** means anything you do with the software requiring one of your licenses.
`,t={"fonts/IBMPlex-OFL.txt":`7e6b2818edbd8f6a01ae80641cc8f16a51080d08fb4e532be3a0b6f74adb07da`,"fonts/IBMPlexSans-Regular.woff2":`ba711a3085ff9f27440b6b9c4550cfc47c97bf36591d5da958b975bb3add8c1a`,"fonts/IBMPlexSans-SemiBold.woff2":`f78048030eab62e860efa39a0df79e2e5581bf122eb95b9bc42c0b8a4988d205`,"fonts/NotoSerif-OFL.txt":`cee9892f9f0cc8fe882c9e9537ee6a89621d86ee7ceaf70b02e2b2b1c25c061a`,"fonts/NotoSerif-Regular.ttf":`5473d2e43bdd018ee124a4addba8091fd0a29894b121cbb741023af6549662b6`,"sources/CC-BY-SA-4.0.txt":`28a9529c7d0bb4dc51f4bf5c116a3d16ef247a052f7591466768ddf563fd1cf5`,"sources/NOTICES.txt":`ca471b5392d02935544aaf095e54c9485396f49c93de93e7ebcd2af487e323de`,"sources/schone-238.jpg":`7c522d6280a658413f368732f0e1fbf45e1242a45c429e5bf51768c766e910b7`,"sources/schone-239.jpg":`69b3c015e1c21c67302b2201d7b6f3ec735efd78a2c10e1fe5447dc787a0ec20`,"sources/schone-240.jpg":`97cd0e70fb289b4620a9f45862e4a062325e520445d1b1de2c41151f6b379e40`,"sources/schone-241.jpg":`9b7d2f2e5e501cd5ff1ad669f921a995c996254b5f44cd2e1cef9613f127156d`};async function n(e){if(!(`serviceWorker`in navigator)){e.textContent=`Offline saving unavailable in this browser`;return}let t,n=0,r=!1,i=()=>!!(t?.installing||t?.waiting),a=async()=>{let a=++n;if(i()){e.textContent=t.active?`Downloading the updated survey & sources…`:`Downloading survey & sources for offline use…`;return}let o=navigator.serviceWorker.controller;if(!o||o!==t.active||o.state!==`activated`){e.textContent=r?`Offline download unavailable; survey still works online`:`Finishing the offline installation…`;return}let s=new MessageChannel,c;try{let t=await new Promise((e,t)=>{c=setTimeout(()=>t(Error(`Offline inspection timed out`)),4e3),s.port1.onmessage=t=>e(t.data),o.postMessage({type:`DIOPTRA_INSPECT`},[s.port2])});if(a!==n||o!==navigator.serviceWorker.controller)return;e.textContent=t.complete&&t.edition===`14119dcc1cc37fbf20967ab897e63fe8e7b395ca74532401032fb2641ee04013`?`Survey & sources saved offline`:i()?`Downloading the updated survey & sources…`:r?`Offline update incomplete; reload online to retry.`:`A different offline edition is saved. Reload online to finish updating.`}catch{a===n&&(e.textContent=`Offline download unavailable; survey still works online`)}finally{clearTimeout(c),s.port1.close(),s.port2.close()}},o=new WeakSet,s=()=>{for(let e of[t.installing,t.waiting,t.active,navigator.serviceWorker.controller]){if(!e||(e.state===`installed`&&e.postMessage({type:`DIOPTRA_ACTIVATE`}),o.has(e)))continue;o.add(e);let n=e.state===`activated`;e===t.installing&&(r=!1),e.addEventListener(`statechange`,()=>{e.state===`installed`&&e.postMessage({type:`DIOPTRA_ACTIVATE`}),e.state===`activated`&&(n=!0),e.state===`redundant`&&!n&&(r=!0),a()})}a()};try{t=await navigator.serviceWorker.register(`/dioptra/sw.js`),t.addEventListener(`updatefound`,s),navigator.serviceWorker.addEventListener(`controllerchange`,s),s(),await a()}catch{e.textContent=`Offline download unavailable; survey still works online`}}export{t as n,e as r,n as t};