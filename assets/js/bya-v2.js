(() => {
  "use strict";
  const root=document.documentElement;
  const body=document.body;

  // Persist language across pages without replacing the site's existing language engine.
  const savedLang=localStorage.getItem("bya_lang");
  if(savedLang==="en") body.classList.add("lang-en");

  // Unified language control. Preserve the legacy engine where present, otherwise provide a standalone fallback.
  const legacyToggle=window.toggleLang;
  if(typeof legacyToggle==="function"){
    window.toggleLang=function(){
      legacyToggle();
      const lang=body.classList.contains("lang-en")?"en":"my";
      localStorage.setItem("bya_lang",lang);
      root.lang=lang==="en"?"en":"my";
      const label=document.getElementById("lang-btn-text");
      if(label) label.textContent=lang==="en"?"MY":"EN";
    };
  }else{
    window.toggleLang=function(){
      const lang=body.classList.contains("lang-en")?"my":"en";
      body.classList.toggle("lang-en",lang==="en");
      localStorage.setItem("bya_lang",lang);
      root.lang=lang;
      const label=document.getElementById("lang-btn-text");
      if(label) label.textContent=lang==="en"?"MY":"EN";
    };
  }
  root.lang=body.classList.contains("lang-en")?"en":"my";
  const initialLangLabel=document.getElementById("lang-btn-text");
  if(initialLangLabel) initialLangLabel.textContent=root.lang==="en"?"MY":"EN";

  // Unified theme control for pages that do not have the legacy inline theme engine.
  if(typeof window.toggleTheme!=="function"){
    window.toggleTheme=function(){
      root.classList.toggle("dark");
      const dark=root.classList.contains("dark");
      localStorage.setItem("theme",dark?"dark":"light");
      const icon=document.getElementById("theme-icon");
      if(icon) icon.classList.toggle("fa-moon",!dark), icon.classList.toggle("fa-sun",dark);
    };
  }
  if(localStorage.getItem("theme")==="dark") root.classList.add("dark");

  // Active navigation.
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  document.querySelectorAll("nav a[href]").forEach(link=>{
    const raw=(link.getAttribute("href")||"").split("#")[0].split("?")[0];
    const target=(raw||"index.html").split("/").pop().toLowerCase();
    if(target===page && target!==""){
      link.setAttribute("aria-current","page");
    }
  });

  // Safe external links.
  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    const rel=(a.getAttribute("rel")||"").split(/\s+/).filter(Boolean);
    if(!rel.includes("noopener")) rel.push("noopener");
    if(!rel.includes("noreferrer")) rel.push("noreferrer");
    a.setAttribute("rel",rel.join(" "));
  });

  // Reveal on scroll, with reduced-motion support.
  const reveals=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("active");observer.unobserve(entry.target);}
      });
    },{threshold:.12});
    reveals.forEach(el=>observer.observe(el));
  }else{
    reveals.forEach(el=>el.classList.add("active"));
  }

  // Back-to-top button.
  const top=document.getElementById("backToTop");
  if(top){
    const sync=()=>{top.style.display=scrollY>520?"flex":"none";};
    addEventListener("scroll",sync,{passive:true}); sync();
    top.addEventListener("click",e=>{e.preventDefault();scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});
  }

  // Mobile menu accessibility enhancement.
  const menu=document.getElementById("mobile-menu");
  const menuBtn=document.getElementById("menu-btn");
  if(menu&&menuBtn){
    menuBtn.setAttribute("aria-expanded",String(!menu.classList.contains("hidden")));
    menuBtn.setAttribute("aria-controls","mobile-menu");
    menuBtn.addEventListener("click",()=>{
      requestAnimationFrame(()=>menuBtn.setAttribute("aria-expanded",String(!menu.classList.contains("hidden"))));
    });
    menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>menu.classList.add("hidden")));
  }

  // Close modal/dialog-like overlays with Escape.
  addEventListener("keydown",e=>{
    if(e.key!=="Escape") return;
    document.querySelectorAll('[role="dialog"],#registerModal,#contactModal').forEach(el=>{
      if(getComputedStyle(el).display!=="none"){
        const close=el.querySelector("[onclick*='close']");
        if(close) close.click();
      }
    });
  });

  // Service worker registration with a non-fatal error path.
  if("serviceWorker" in navigator){
    addEventListener("load",()=>{
      navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{});
    });
  }
})();