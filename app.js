/* Shared UI helpers (pure JS, no dependencies) */
(function(){
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root=document) => root.querySelector(sel);

  // Scroll reveal for .card
  const reveal = () => {
    const cards = $$('.card');
    if (!cards.length) return;
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (e.isIntersecting){
          e.target.classList.add('show');
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.15});
    cards.forEach(c=>io.observe(c));
  };

  // Tiny tap ripple (cheap + pretty)
  const ripples = () => {
    $$('.btn, .navitem, .iconbtn, .day').forEach(el=>{
      el.addEventListener('pointerdown', (ev)=>{
        const r = document.createElement('span');
        r.style.position='absolute';
        r.style.pointerEvents='none';
        r.style.borderRadius='999px';
        r.style.background='rgba(255,255,255,.18)';
        r.style.width = r.style.height = '10px';
        r.style.left = (ev.offsetX ?? 10) + 'px';
        r.style.top  = (ev.offsetY ?? 10) + 'px';
        r.style.transform='translate(-50%,-50%)';
        r.style.filter='blur(.2px)';
        r.style.opacity='1';
        r.style.transition='width .55s ease, height .55s ease, opacity .55s ease';
        el.style.position = el.style.position || 'relative';
        el.appendChild(r);
        requestAnimationFrame(()=>{
          r.style.width = r.style.height = '160px';
          r.style.opacity = '0';
        });
        setTimeout(()=>r.remove(), 600);
      }, {passive:true});
    });
  };

  // Home: affirmation generator
  const affirmations = [
    "You’re the kind of calm that makes the world feel less loud.",
    "You don’t just glow — you *organize* the light around you.",
    "You’re proof that softness and strength can be the same thing.",
    "You have a way of making ordinary moments feel like they mattered.",
    "You’re the human version of ‘it’s going to be okay.’",
    "You carry grace like it’s casual. It’s not. It’s magic.",
    "You’re rare — not because you try, but because you exist exactly as you are.",
    "If kindness had a signature, it would look like you.",
    "You’re beautiful in a way that feels safe, not loud.",
    "You’re the reason some people still believe in good things."
  ];

  const initHome = () => {
    const card = document.getElementById('affirmationCard');
    const btn  = document.getElementById('affirmationBtn');
    if (!card || !btn) return;

    const pick = () => affirmations[Math.floor(Math.random()*affirmations.length)];
    const set = () => {
      card.classList.remove('pop');
      void card.offsetWidth; // reflow
      card.textContent = pick();
      card.classList.add('pop');
    };
    btn.addEventListener('click', set);
    set();
  };

  // Compliment generator (rule-based, fun, optional spicy)
  const initCompliments = () => {
    const out = document.getElementById('complimentOut');
    const meta = document.getElementById('complimentMeta');
    const gen = document.getElementById('genBtn');
    const copy = document.getElementById('copyBtn');
    const fav = document.getElementById('favBtn');
    const sw = document.getElementById('spicySwitch');
    if (!out || !gen) return;

    let spicy = false;
    const storeKey = 'sreelekshmi_favs_v1';

    const baseOpeners = [
      "Sreelekshmi, listen…",
      "Okay, important announcement:",
      "Breaking news:",
      "I was thinking and then I remembered…",
      "Just saying, for the record:",
      "No dramatic reason — just facts:",
      "Public service message:",
      "Gentle reminder:"
    ];
    const admiration = [
      "you have this quiet power that makes things feel possible.",
      "you’re ridiculously good at being both soft and unstoppable.",
      "you’re the kind of beautiful that doesn’t need permission.",
      "you make comfort look like an art form.",
      "you have main-character energy with best-friend warmth.",
      "you’re literally the standard.",
      "you’re elegant, but in a ‘real life’ way — not a pretend way.",
      "you turn chaos into calm like it’s your hobby."
    ];
    const specifics = [
      "The way you carry yourself? unreal.",
      "Your laugh could fix timelines.",
      "Your heart is a safe place.",
      "Your presence is a reset button.",
      "Your eyes have this ‘I know’ sparkle.",
      "Your vibe is a warm blanket with a plan.",
      "You’re cute *and* competent. Dangerous combo.",
      "You’re soft-spoken and somehow still intimidating (in the best way)."
    ];
    const closers = [
      "I’m proud of you. Always.",
      "I don’t say this lightly: you’re my favorite kind of person.",
      "If I could bottle your energy, the world would be nicer.",
      "You deserve love that feels like ease. Every day.",
      "Anyway. That’s it. That’s the truth.",
      "Now go be iconic like you always do.",
      "And yes, I mean all of it."
    ];

    // Playful + suggestive without explicit sexual content
    const spicyBits = [
      "Also… you’re unfairly attractive. Like, this should be regulated.",
      "Your glow is illegal in at least three countries.",
      "You have that ‘I could ruin someone’s focus’ kind of beauty.",
      "If pretty was a currency, you’d crash the economy.",
      "You’re the reason people forget what they were saying mid-sentence.",
      "Respectfully… you’re a problem. A very pretty problem.",
      "If I had to behave around you, I’d need a user manual."
    ];

    const emojis = ["💗","✨","🌸","🫶","💞","🥹","🎀","🌙","💫"];

    const build = () => {
      const op = baseOpeners[Math.floor(Math.random()*baseOpeners.length)];
      const a  = admiration[Math.floor(Math.random()*admiration.length)];
      const s  = specifics[Math.floor(Math.random()*specifics.length)];
      const c  = closers[Math.floor(Math.random()*closers.length)];
      const e  = emojis[Math.floor(Math.random()*emojis.length)];
      const pieces = [op, a, s];
      if (spicy) pieces.push(spicyBits[Math.floor(Math.random()*spicyBits.length)]);
      pieces.push(c);
      return {text: pieces.join(" "), emoji:e, spicy};
    };

    const setOut = () => {
      const r = build();
      out.textContent = r.text + " " + r.emoji;
      meta.innerHTML = `
        <span class="chip">${r.spicy ? "Spicy mode: on 🔥" : "Spicy mode: off 🧁"}</span>
        <span class="chip">Tap again for a new one</span>
      `;
      out.parentElement.classList.remove('flash');
      void out.parentElement.offsetWidth;
      out.parentElement.classList.add('flash');
    };

    // toggle
    if (sw){
      const btn = sw;
      const setSw = (v)=>{
        spicy = v;
        btn.classList.toggle('on', spicy);
        btn.setAttribute('aria-checked', spicy ? 'true':'false');
      };
      btn.addEventListener('click', ()=> setSw(!spicy));
      setSw(false);
    }

    gen.addEventListener('click', setOut);

    // copy
    if (copy){
      copy.addEventListener('click', async ()=>{
        try{
          await navigator.clipboard.writeText(out.textContent.trim());
          copy.textContent = "Copied ✨";
          setTimeout(()=>copy.textContent="Copy", 1200);
        }catch(e){
          alert("Couldn’t copy (browser blocked it). You can long-press and copy manually.");
        }
      });
    }

    // favorites
    const loadFavs = ()=>{
      try{ return JSON.parse(localStorage.getItem(storeKey) || "[]"); }catch(e){ return []; }
    };
    const saveFavs = (arr)=>{
      localStorage.setItem(storeKey, JSON.stringify(arr.slice(0,30)));
    };
    if (fav){
      fav.addEventListener('click', ()=>{
        const t = out.textContent.trim();
        if (!t) return;
        const arr = loadFavs();
        if (!arr.includes(t)) arr.unshift(t);
        saveFavs(arr);
        fav.textContent = "Saved 💾";
        setTimeout(()=>fav.textContent="Save", 1200);
        renderFavs();
      });
    }

    const list = document.getElementById('favList');
    const renderFavs = ()=>{
      if (!list) return;
      const arr = loadFavs();
      list.innerHTML = arr.length ? "" : `<div class="small">No saved lines yet. Hit <b>Save</b> on one you love.</div>`;
      arr.forEach((t, idx)=>{
        const item = document.createElement('div');
        item.className = "card show";
        item.innerHTML = `<h3>Saved #${idx+1}</h3><p>${escapeHtml(t)}</p>
          <div class="btns">
            <button class="btn" data-copy="${idx}">Copy</button>
            <button class="btn" data-del="${idx}">Remove</button>
          </div>`;
        list.appendChild(item);
      });
      list.querySelectorAll('[data-copy]').forEach(b=>{
        b.addEventListener('click', async ()=>{
          const i = Number(b.getAttribute('data-copy'));
          const arr2 = loadFavs();
          try{
            await navigator.clipboard.writeText(arr2[i] || "");
            b.textContent = "Copied ✨";
            setTimeout(()=>b.textContent="Copy", 1200);
          }catch(e){
            alert("Couldn’t copy. Long-press to copy.");
          }
        });
      });
      list.querySelectorAll('[data-del]').forEach(b=>{
        b.addEventListener('click', ()=>{
          const i = Number(b.getAttribute('data-del'));
          const arr2 = loadFavs();
          arr2.splice(i,1);
          saveFavs(arr2);
          renderFavs();
        });
      });
    };

    setOut();
    renderFavs();
  };

  function escapeHtml(s){
    return (s||"").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // Calendar
  const initCalendar = () => {
    const root = document.getElementById('calendarRoot');
    if (!root) return;

    const now = new Date();
    let view = new Date(now.getFullYear(), now.getMonth(), 1);

    const specials = [
      {m: 4, d: 21, emoji:"🎂", title:"Birthday", note:"Happy Birthday, Sreelekshmi. The world gets softer because you exist."},
      {m: 4, d: 1,  emoji:"💍", title:"Wedding Anniversary", note:"A beautiful day. Wishing you love that feels like home."},
      {m: 0, d: 13, emoji:"✨", title:"Our Anniversary", note:"A date that still feels like a bookmark in my heart."},
    ];
    // m is 0-based; May=4, Jan=0.

    const qs = (id)=>document.getElementById(id);

    const monthName = (d)=> d.toLocaleString(undefined, {month:'long', year:'numeric'});
    const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const sheet = qs('daySheet');
    const sheetTitle = qs('sheetTitle');
    const sheetText = qs('sheetText');

    const render = ()=>{
      qs('calTitle').textContent = monthName(view);
      qs('calSub').textContent = "Tap any day";
      const week = qs('calWeek');
      week.innerHTML = dow.map(x=>`<div style="text-align:center">${x}</div>`).join("");
      const days = qs('calDays');
      days.innerHTML = "";

      const y = view.getFullYear(), m = view.getMonth();
      const firstDow = new Date(y,m,1).getDay();
      const lastDay = new Date(y,m+1,0).getDate();
      const prevLast = new Date(y,m,0).getDate();

      const total = 42; // 6 weeks grid
      for (let i=0;i<total;i++){
        const cell = document.createElement('div');
        cell.className = "day";
        let dayNum, cellMonth = m, cellYear = y;
        if (i < firstDow){
          dayNum = prevLast - (firstDow - i - 1);
          cell.classList.add('dim');
          cellMonth = m-1;
          if (cellMonth < 0){ cellMonth = 11; cellYear = y-1; }
        } else if (i >= firstDow + lastDay){
          dayNum = i - (firstDow + lastDay) + 1;
          cell.classList.add('dim');
          cellMonth = m+1;
          if (cellMonth > 11){ cellMonth = 0; cellYear = y+1; }
        } else {
          dayNum = i - firstDow + 1;
        }

        const dateObj = new Date(cellYear, cellMonth, dayNum);
        const isToday = sameDay(dateObj, now);
        if (isToday) cell.classList.add('today');

        const sp = specials.find(s=> s.m===cellMonth && s.d===dayNum);
        if (sp) cell.classList.add('special');

        cell.innerHTML = `<b>${dayNum}</b>${sp ? `<div class="mark">${sp.emoji}</div>` : ""}`;
        cell.addEventListener('click', ()=>openDay(dateObj, sp));
        days.appendChild(cell);
      }
    };

    const openDay = (dateObj, sp)=>{
      const pretty = dateObj.toLocaleString(undefined, {weekday:'long', day:'numeric', month:'long', year:'numeric'});
      sheetTitle.textContent = pretty;
      if (sp){
        sheetText.innerHTML = `<b>${sp.emoji} ${sp.title}</b><br>${sp.note}`;
        burstConfetti();
      } else {
        sheetText.textContent = "No special event marked here. But honestly… every day you exist is a good day.";
      }
      sheet.classList.add('open');
    };

    const closeSheet = ()=> sheet.classList.remove('open');

    qs('prevMonth').addEventListener('click', ()=>{
      view = new Date(view.getFullYear(), view.getMonth()-1, 1);
      render();
    });
    qs('nextMonth').addEventListener('click', ()=>{
      view = new Date(view.getFullYear(), view.getMonth()+1, 1);
      render();
    });
    qs('todayBtn').addEventListener('click', ()=>{
      view = new Date(now.getFullYear(), now.getMonth(), 1);
      render();
      burstConfetti(10);
    });
    qs('closeSheet').addEventListener('click', closeSheet);
    sheet.addEventListener('click', (e)=>{
      if (e.target === sheet) closeSheet();
    });

    // swipe
    let sx=0, sy=0;
    root.addEventListener('touchstart', (e)=>{
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, {passive:true});
    root.addEventListener('touchend', (e)=>{
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)){
        if (dx < 0) qs('nextMonth').click();
        else qs('prevMonth').click();
      }
    }, {passive:true});

    render();
  };

  function sameDay(a,b){
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  function burstConfetti(n=26){
    const c = document.createElement('div');
    c.className = "confetti";
    document.body.appendChild(c);
    const w = window.innerWidth;
    for (let i=0;i<n;i++){
      const p = document.createElement('i');
      const left = Math.random()*w;
      const delay = Math.random()*0.2;
      const dur = 1.2 + Math.random()*0.7;
      const size = 8 + Math.random()*8;
      p.style.left = left + "px";
      p.style.animationDelay = delay + "s";
      p.style.animationDuration = dur + "s";
      p.style.width = size + "px";
      p.style.height = (size*1.4) + "px";
      const hue = 320 + Math.random()*50; // pinkish
      p.style.background = `hsla(${hue}, 90%, 70%, .95)`;
      c.appendChild(p);
    }
    setTimeout(()=>c.remove(), 1700);
  }

  
  // Story modals (Us page)
  const initStoryModals = () => {
    const back = document.getElementById('modalBack');
    const modal = document.getElementById('modalSheet');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const close = document.getElementById('modalClose');
    if (!back || !modal || !title || !body || !close) return;

    const open = (t, htmlStr)=>{
      title.textContent = t;
      body.innerHTML = htmlStr;
      back.classList.add('open');
      modal.classList.add('open');
      // small confetti for happy moments
      try{ burstConfetti(14); }catch(e){}
    };
    const shut = ()=>{
      back.classList.remove('open');
      modal.classList.remove('open');
    };

    close.addEventListener('click', shut);
    back.addEventListener('click', shut);

    // bind cards
    document.querySelectorAll('[data-story]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();

    // keep the viewport where it is (prevents “jump down” feeling)
    const y = window.scrollY;

    const key = btn.getAttribute('data-story');
    const tpl = document.getElementById('story_' + key);
    if (!tpl) return;

    open(btn.getAttribute('data-title') || "Us", tpl.innerHTML);

    // restore scroll position after opening modal
    requestAnimationFrame(()=> window.scrollTo(0, y));
  });
});



  // Kick off
  document.addEventListener('DOMContentLoaded', ()=>{
    reveal();
    ripples();
    initHome();
    initCompliments();
    initCalendar();
    initStoryModals();
  });
})();
