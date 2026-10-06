(() => {
  "use strict";
  const root=document.documentElement;
  const body=document.body;

  // Persist language across pages without replacing the site's existing language engine.
  const savedLang=localStorage.getItem("bya_lang");
  if(savedLang==="en") body.classList.add("lang-en");

  // Upgrade existing language switchers where the legacy function is present.
  const legacyToggle=window.toggleLang;
  if(typeof legacyToggle==="function"){
    window.toggleLang=function(){
      legacyToggle();
      const lang=body.classList.contains("lang-en")?"en":"my";
      localStorage.setItem("bya_lang",lang);
      root.lang=lang==="en"?"en":"my";
    };
  }
  root.lang=body.classList.contains("lang-en")?"en":"my";

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