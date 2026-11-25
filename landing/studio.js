(() => {
  const screen = document.querySelector('#screen');
  const status = document.querySelector('#demo-status');
  const buttons = [...document.querySelectorAll('[data-template]')];
  const composition = document.querySelector('#composition');
  const slug = 'gehlen-konfigurator-kopie';
  const sizeStage = () => composition.style.setProperty('--stage-scale',composition.parentElement.clientWidth/1080);
  sizeStage();
  new ResizeObserver(sizeStage).observe(composition.parentElement);
  async function loadOriginal(){
    const config = window.FS_CONFIG;
    const response = await fetch(config.supabaseUrl+'/rest/v1/rpc/get_public_funnel',{
      method:'POST',headers:{apikey:config.supabaseAnonKey,'Content-Type':'application/json'},
      body:JSON.stringify({p_slug:slug})
    });
    if(!response.ok) throw Error('Funnel laden');
    const funnel=await response.json();
    if(!funnel?.pages?.length) throw Error('Funnel fehlt');
    FP.usedFonts(funnel).forEach(name=>{
      if((funnel.fonts||[]).some(f=>f.name===name)) return;
      const href=FP.fontLink(name);
      if(href){const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.append(l);}
    });
    (funnel.fonts||[]).forEach(font=>{
      const face=new FontFace(font.name,'url('+JSON.stringify(font.data)+')');
      face.load().then(f=>document.fonts.add(f)).catch(()=>{});
    });
    const choices=funnel.pages.map((p,i)=>i>0 && p.blocks.some(b=>b.type==='choice' && b.props.options?.some(o=>o.img))?i:-1).filter(i=>i>=0);
    const indices=[choices[0]??0,0,choices[1]??choices[0]??0];
    document.querySelectorAll('.model>div').forEach((el,i)=>{
      el.innerHTML=FP.renderPage(funnel,indices[i],{scope:'gallery'+i,noAnim:true,noFab:true});
    });
    document.querySelector('#hero-status').textContent='';
    return funnel;
  }
  function originalLink(){
    const a=document.createElement('a');a.href='https://taptell.vercel.app/'+slug;
    a.textContent='Original-Konfigurator öffnen ↗';return a;
  }
  let original;
  let revision=0;
  async function mount(button){
    const current=++revision;
    const host=document.createElement('div');
    screen.replaceChildren(host);screen.scrollTop=0;status.textContent='';
    buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const featured=button.dataset.template==='gehlen-tisch';
    try{
      if(featured && !original) original=loadOriginal();
      const f=featured?await original:FS_T.newFunnel(button.dataset.template);
      if(current!==revision) return;
      FP.mount(host,f,{live:false,scrollEl:screen,
        onSubmit(){status.textContent='Demo abgeschlossen. Deine Angaben wurden nicht versendet.';},
        onUrl(){status.textContent='Dieser Link gehört zur Demo.';}
      });
    }catch(error){
      if(featured){original=null;document.querySelector('#hero-status').replaceChildren(originalLink());}
      if(current===revision) status.replaceChildren('Beispiel konnte nicht geladen werden. ',originalLink());
    }
  }
  buttons.forEach(button=>button.addEventListener('click',()=>mount(button)));
  mount(buttons[0]);
})();
