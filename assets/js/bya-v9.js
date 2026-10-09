(function(){
  "use strict";
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));

  function setStatus(el,message,type){
    if(!el)return;
    el.textContent=message;
    el.dataset.status=type||"info";
    el.classList.remove("is-visible");
    void el.offsetWidth;
    el.classList.add("is-visible");
  }

  async function loadJSON(url){
    const response=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!response.ok)throw new Error("Unable to load "+url);
    return response.json();
  }

  function safePageUrl(value){
    if(typeof value!=="string"||!value||value.startsWith("/")||value.includes("\\")||value.includes(".."))return null;
    if(!/^[a-z0-9][a-z0-9._/-]*\.html(?:#[a-z0-9_-]+)?$/i.test(value))return null;
    return value;
  }

  async function renderSearch(){
    const input=$("#bya-search-input"),results=$("#bya-search-results");
    if(!input||!results)return;
    let index=[];
    try{
      const data=await loadJSON("data/search-index.json");
      index=Array.isArray(data.items)?data.items:[];
    }catch(error){
      results.replaceChildren();
      const message=document.createElement("p");
      message.className="v9-muted";
      message.textContent="Search is temporarily unavailable. Please use the navigation menu.";
      results.append(message);
      return;
    }
    const draw=query=>{
      const q=query.trim().toLocaleLowerCase();
      results.replaceChildren();
      const hits=!q?[]:index.filter(item=>{
        const haystack=[item.title,item.type,...(Array.isArray(item.tags)?item.tags:[])].filter(Boolean).join(" ").toLocaleLowerCase();
        return haystack.includes(q);
      }).slice(0,12);
      if(!hits.length){
        const message=document.createElement("p");
        message.className="v9-muted";
        message.textContent=q?"No matching BYA content found.":"Type a keyword to search BYA.";
        results.append(message);
        return;
      }
      hits.forEach(item=>{
        const href=safePageUrl(item.url);
        if(!href)return;
        const link=document.createElement("a");
        link.className="v9-search-result";
        link.href=href;
        const title=document.createElement("strong");
        title.textContent=String(item.title||"BYA page");
        const type=document.createElement("span");
        type.textContent=String(item.type||"Page");
        link.append(title,type);
        results.append(link);
      });
      if(!results.childElementCount){
        const message=document.createElement("p");
        message.className="v9-muted";
        message.textContent="No safe search results are available.";
        results.append(message);
      }
    };
    input.addEventListener("input",()=>draw(input.value));
    draw("");
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
      form.addEventListener("submit",async event=>{
        event.preventDefault();
        const status=$(".v9-form-status",form),validation=validate(form);
        if(validation.config){setStatus(status,validation.msg,"config");return;}
        if(!validation.ok){setStatus(status,validation.msg,"error");return;}
        setStatus(status,"Submitting…","loading");
        try{
          const payload=Object.fromEntries(new FormData(form).entries());
          delete payload.website;
          const response=await fetch(validation.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
          if(!response.ok)throw new Error("Submission failed");
          form.reset();
          setStatus(status,"Thank you. Your submission has been received.","success");
        }catch(error){
          setStatus(status,"We could not confirm submission. Please keep your information and use the official contact route instead.","error");
        }
      });
    });
  }

  function wirePasswordDemo(){
    $$("[data-portal-demo]").forEach(element=>element.addEventListener("click",()=>{
      const target=safePageUrl(element.dataset.portalDemoTarget||"portal-dashboard.html");
      if(target)window.location.href=target;
    }));
  }

  document.addEventListener("DOMContentLoaded",()=>{renderSearch();wireForms();wirePasswordDemo();});
})();