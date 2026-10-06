(function(){
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function setStatus(el,msg,type){
    if(!el)return;
    el.textContent=msg; el.dataset.status=type||"info";
    el.classList.remove("is-visible"); void el.offsetWidth; el.classList.add("is-visible");
  }

  async function loadJSON(url){
    const res=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error("Unable to load "+url);
    return res.json();
  }

  async function renderSearch(){
    const input=$("#bya-search-input"), results=$("#bya-search-results");
    if(!input||!results)return;
    let index=[];
    try{ index=(await loadJSON("data/search-index.json")).items||[]; }catch(e){results.innerHTML="<p>Search is temporarily unavailable.</p>";return;}
    const draw=(q)=>{
      q=q.trim().toLowerCase();
      const hits=!q?[]:index.filter(x=>(x.title+" "+x.type+" "+(x.tags||[]).join(" ")).toLowerCase().includes(q)).slice(0,12);
      results.innerHTML=hits.length?hits.map(x=>'<a class="v9-search-result" href="'+x.url+'"><strong>'+x.title+'</strong><span>'+x.type+'</span></a>').join(""):'<p class="v9-muted">'+(q?"No matching BYA content found.":"Type a keyword to search BYA.")+"</p>";
    };
    input.addEventListener("input",()=>draw(input.value)); draw("");
  }

  function validate(form){
    const endpoint=form.dataset.endpoint||"";
    const honeypot=form.querySelector("[name=website]");
    const started=Number(form.dataset.startedAt||Date.now());
    if(honeypot&&honeypot.value)return {ok:false,msg:"Submission blocked."};
    if(Date.now()-started<1200)return {ok:false,msg:"Please take a moment before submitting."};
    if(!endpoint)return {ok:false,config:true,msg:"This form is prepared but its submission service has not yet been connected."};
    return {ok:true,endpoint};
  }

  function wireForms(){
    $$("[data-bya-form]").forEach(form=>{
      form.dataset.startedAt=Date.now();
      form.addEventListener("submit",async e=>{
        e.preventDefault();
        const status=$(".v9-form-status",form), v=validate(form);
        if(v.config){setStatus(status,v.msg,"config");return;}
        if(!v.ok){setStatus(status,v.msg,"error");return;}
        setStatus(status,"Submitting…","loading");
        try{
          const payload=Object.fromEntries(new FormData(form).entries());
          delete payload.website;
          const res=await fetch(v.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
          if(!res.ok)throw new Error("Submission failed");
          form.reset(); setStatus(status,"Thank you. Your submission has been received.","success");
        }catch(err){setStatus(status,"We could not submit this form. Please use the official contact route instead.","error");}
      });
    });
  }

  function wirePasswordDemo(){
    $$("[data-portal-demo]").forEach(el=>el.addEventListener("click",()=>{
      const target=el.dataset.portalDemoTarget||"portal-dashboard.html";
      window.location.href=target;
    }));
  }

  document.addEventListener("DOMContentLoaded",()=>{renderSearch();wireForms();wirePasswordDemo();});
})();