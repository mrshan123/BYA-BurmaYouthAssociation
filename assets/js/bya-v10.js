/* BYA V10 — controlled public data layer */
(() => {
  "use strict";
  const DATASETS = Object.freeze({
    opportunities:"data/opportunities.json",
    events:"data/events.json",
    resources:"data/resources.json",
    partners:"data/partners.json",
    impact:"data/impact-metrics.json"
  });
  async function loadDataset(name){
    const url=DATASETS[name];
    if(!url) throw new Error("Unknown dataset");
    const response=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!response.ok) throw new Error("Dataset unavailable");
    return response.json();
  }
  window.BYA=Object.freeze({version:"10.0",loadDataset});
})();
