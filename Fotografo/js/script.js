// LOADER
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('out'),2400))

// CURSOR
const cur=document.getElementById('cur'),curR=document.getElementById('cur-r')
let mx=0,my=0,rx=0,ry=0
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'})
;(function tick(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(tick)})()
document.querySelectorAll('a,button,.fb,.sc').forEach(el=>{
  el.addEventListener('mouseenter',()=>{document.body.classList.add('lh');document.body.classList.remove('ih')})
  el.addEventListener('mouseleave',()=>document.body.classList.remove('lh'))
})
document.querySelectorAll('.gi').forEach(el=>{
  el.addEventListener('mouseenter',()=>{document.body.classList.add('ih');document.body.classList.remove('lh')})
  el.addEventListener('mouseleave',()=>document.body.classList.remove('ih'))
})

// NAV
const nav=document.getElementById('nav')
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',window.scrollY>60),{passive:true})

// ── BIDIRECTIONAL SCROLL ANIMATION SYSTEM (original) ──
const animEls=[...document.querySelectorAll('[data-a]')]
const prevAbove=new Set()
function checkAnims(){
  animEls.forEach(el=>{
    const r=el.getBoundingClientRect()
    const inView=r.top<window.innerHeight*0.88&&r.bottom>window.innerHeight*0.06
    const isAbove=r.bottom<window.innerHeight*0.06
    const delay=parseFloat(el.dataset.delay||0)
    if(inView){
      el.style.transitionDelay=delay+'s'
      el.classList.add('in')
      el.classList.remove('out')
      prevAbove.delete(el)
    } else if(isAbove){
      el.style.transitionDelay='0s'
      el.classList.remove('in')
      el.classList.add('out')
      prevAbove.add(el)
    } else {
      el.style.transitionDelay='0s'
      el.classList.remove('in','out')
      prevAbove.delete(el)
    }
  })
}
window.addEventListener('scroll',checkAnims,{passive:true})
checkAnims()

// ── NOVO EFEITO DINÂMICO (escala/rotação baseado na distância do centro) ──
const dynamicElements = document.querySelectorAll('[data-dynamic]')
function applyDynamicEffects() {
  const viewportCenter = window.innerHeight / 2
  const maxDistance = window.innerHeight * 0.6
  dynamicElements.forEach(el => {
    const rect = el.getBoundingClientRect()
    const elementCenter = rect.top + rect.height / 2
    let distance = Math.abs(elementCenter - viewportCenter)
    let factor = Math.min(distance / maxDistance, 1)
    const scale = 1 - factor * 0.3      // escala entre 1 e 0.7
    const rotation = (elementCenter - viewportCenter) / maxDistance * 4 // -4deg a 4deg
    const opacity = 1 - factor * 0.5    // opacidade entre 1 e 0.5
    const blur = factor * 1.2           // blur entre 0 e 1.2px
    if (factor < 0.99) {
      el.style.transform = `scale(${scale}) rotate(${rotation}deg)`
      el.style.opacity = opacity
      el.style.filter = `blur(${blur}px)`
    } else {
      el.style.transform = `scale(0.7) rotate(${rotation}deg)`
      el.style.opacity = 0.3
      el.style.filter = `blur(2px)`
    }
  })
}
let ticking = false
function onScrollOrResize() {
  if (!ticking) {
    requestAnimationFrame(() => {
      applyDynamicEffects()
      ticking = false
    })
    ticking = true
  }
}
window.addEventListener('scroll', onScrollOrResize, {passive: true})
window.addEventListener('resize', onScrollOrResize)
applyDynamicEffects()

// PARALLAX
const parBg=document.getElementById('parBg'),ps=document.getElementById('parStrip')
const hvid=document.querySelector('.hvid')
function onScrollParallax(){
  if(ps){const r=ps.getBoundingClientRect();const p=(window.innerHeight-r.top)/(window.innerHeight+r.height);parBg.style.transform=`translateY(${(p-.5)*90}px)`}
  if(hvid){hvid.style.transform=`scale(1.05) translateY(${window.scrollY*.07}px)`}
}
window.addEventListener('scroll',onScrollParallax,{passive:true})

// GALLERY FILTER
document.querySelectorAll('.fb').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.fb').forEach(b=>b.classList.remove('on'))
    btn.classList.add('on')
    const f=btn.dataset.f
    document.querySelectorAll('.gi').forEach((item,i)=>{
      const show=f==='all'||item.dataset.cat===f
      item.style.transition=`opacity .55s ease ${i*.05}s, transform .55s ease ${i*.05}s, filter .55s ease ${i*.05}s`
      item.style.opacity=show?'1':'0.1'
      item.style.transform=show?'scale(1)':'scale(0.93) rotate(-2deg)'
      item.style.filter=show?'none':'grayscale(80%) blur(1.5px)'
      item.style.pointerEvents=show?'all':'none'
    })
  })
})

// LIGHTBOX
const lb=document.getElementById('lb'),lbi=document.getElementById('lbi')
document.querySelectorAll('.gi').forEach(gi=>{
  gi.addEventListener('click',()=>{
    const img=gi.querySelector('img')
    lbi.src=img.src.replace(/w=\d+/,'w=1800')
    lbi.alt=img.alt
    lb.classList.add('open')
    document.body.style.overflow='hidden'
  })
})
function closeLb(){lb.classList.remove('open');document.body.style.overflow=''}
document.getElementById('lbc').addEventListener('click',closeLb)
lb.addEventListener('click',e=>{if(e.target===lb)closeLb()})
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()})

// COUNTERS
function count(el,target,ms=1700){
  const s=performance.now()
  ;(function f(now){
    const t=Math.min((now-s)/ms,1)
    const e=1-Math.pow(1-t,4)
    el.textContent=Math.floor(e*target)+(t>=1&&target>9?'+':'')
    if(t<1)requestAnimationFrame(f)
  })(s)
}
const cObs=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting){count(document.getElementById('c1'),380);count(document.getElementById('c2'),12);count(document.getElementById('c3'),7);cObs.disconnect()}
},{threshold:.45})
cObs.observe(document.getElementById('sobre'))

// FORM (agora envia via PHP, mantém feedback visual)
document.getElementById('cForm').addEventListener('submit', function(e) {
  const btn = this.querySelector('.fsb')
  const span = btn.querySelector('span')
  span.textContent = 'Enviando...'
  btn.style.background = 'rgba(201,169,110,.25)'
  // O formulário será enviado normalmente para send-email.php
})

// MAGNETIC HERO TITLE 3D
const hh1=document.querySelector('.hh1')
hh1.addEventListener('mousemove',e=>{
  const r=hh1.getBoundingClientRect()
  const x=(e.clientX-r.left)/r.width-.5
  const y=(e.clientY-r.top)/r.height-.5
  hh1.style.transform=`perspective(700px) rotateY(${x*8}deg) rotateX(${-y*5}deg)`
  hh1.style.transition='transform .15s'
})
hh1.addEventListener('mouseleave',()=>{hh1.style.transform='perspective(700px) rotateY(0) rotateX(0)';hh1.style.transition='transform .9s cubic-bezier(0.34,1.56,0.64,1)'})

// MAGNETIC BUTTONS
document.querySelectorAll('.hcta,.fsb').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect()
    const x=e.clientX-r.left-r.width/2
    const y=e.clientY-r.top-r.height/2
    btn.style.transform=`translate(${x*.2}px,${y*.2}px)`
    btn.style.transition='transform .1s'
  })
  btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)';btn.style.transition='transform .7s cubic-bezier(0.34,1.56,0.64,1)'})
})