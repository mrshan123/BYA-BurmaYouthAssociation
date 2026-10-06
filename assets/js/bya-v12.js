/* BYA V12 — safe public foundation helpers */
(function(){
  'use strict';
  window.BYA_V12 = {
    version:'12.0',
    apiBase:'',
    configured:false,
    async getJSON(path){
      const res=await fetch(path,{headers:{Accept:'application/json'}});
      if(!res.ok) throw new Error('Unable to load BYA data');
      return res.json();
    },
    escape(value){
      return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    },
    apiConfigured(){
      return Boolean(this.apiBase);
    }
  };
})();