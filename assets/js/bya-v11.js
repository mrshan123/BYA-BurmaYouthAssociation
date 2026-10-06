/* BYA V11 — public operating-model helpers; no privileged operations */
(() => {
  "use strict";
  const statusLabels = {
    "under-review":"Under Review",
    "verified":"Verified",
    "evidence-required":"Evidence Required",
    "configuration-required":"Configuration Required"
  };
  window.BYA_V11 = Object.freeze({
    version:"11.0",
    statusLabel:(key)=>statusLabels[key] || key || "Not specified"
  });
})();