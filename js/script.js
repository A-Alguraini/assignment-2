const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const state = {
  projects: [],
  filtered: [],
  tags: new Set(),
  activeTags: new Set(),
  sort: 'title',
  query: ''
};

function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }

function setGreeting(){
  const name = load('username', null) || 'Guest';
  const hour = new Date().getHours();
  const part = hour<12 ? 'Good morning' : hour<18 ? 'Good afternoon' : 'Good evening';
  $('#greeting').textContent = `${part}, ${name}!`;
}

function applyTheme(){
  const theme = load('theme', 'light');
  document.body.classList.remove('light','dark');
  document.body.classList.add(theme);
}

function toggleTheme(){
  const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
  save('theme', theme);
  applyTheme();
  toast(`Theme: ${theme}`);
}

function initTabs(){
  $$('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.tab;
      $$('.panel').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-hidden','true'); });
      const target = '#' + id;
      $(target).classList.add('active');
      $(target).setAttribute('aria-hidden','false');
    });
  });
}

function initReveal(){
  const io = new IntersectionObserver(entries => {
    for(const e of entries){
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    }
  }, {threshold: 0.12});
  $$('.reveal').forEach(el => io.observe(el));
}

let toastTimer;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}

async function loadProjects(){
  $('#status').textContent = 'Loading projects…';
  try{
    const res = await fetch('assets/projects.json', {cache:'no-store'});
    if(!res.ok) throw new Error('Network error');
    const data = await res.json();
    state.projects = data.projects ?? [];
    $('#status').textContent = '';
  }catch(err){
    state.projects = [
      { title: 'Responsive Layout', date: '2025-09-12', summary: 'Grid-based layout with mobile-first approach.',
        details: 'Implements CSS Grid and Flexbox utilities. Lighthouse performance tuned.', tags:['web','ui'] },
      { title: 'API Fun Facts', date: '2025-10-05', summary: 'Small widget that shows rotating facts.',
        details: 'Originally fetched from a public API; replaced with local JSON and retry strategy.', tags:['javascript','api'] },
      { title: 'Data Viz Mini', date: '2025-08-20', summary: 'Canvas-based bar chart demo.',
        details: 'Accessible SVG/Canvas chart with keyboard navigation hints.', tags:['data','viz'] }
    ];
    $('#status').innerHTML = 'Couldn’t load remote data. Using local fallback. <button id="retryBtn" class="btn-outline">Retry</button>';
    $('#retryBtn')?.addEventListener('click', ()=>{ loadProjects().then(renderProjects); });
  }
  buildTags();
  applyFilters();
  renderProjects();
}

function buildTags(){
  state.tags = new Set();
  state.projects.forEach(p => (p.tags||[]).forEach(t => state.tags.add(t)));
  const wrap = $('#tagFilters');
  wrap.innerHTML='';
  [...state.tags].sort().forEach(tag => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = tag;
    b.addEventListener('click', () => {
      if(state.activeTags.has(tag)) state.activeTags.delete(tag); else state.activeTags.add(tag);
      b.classList.toggle('active');
      applyFilters();
      renderProjects();
    });
    wrap.appendChild(b);
  });
}

function applyFilters(){
  const q = state.query.toLowerCase();
  let arr = state.projects.filter(p => {
    const matchesQ = [p.title,p.summary,p.details,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
    const matchesTag = state.activeTags.size === 0 || (p.tags||[]).some(t => state.activeTags.has(t));
    return matchesQ && matchesTag;
  });
  if(state.sort==='title'){
    arr.sort((a,b)=>a.title.localeCompare(b.title));
  }else if(state.sort==='date'){
    arr.sort((a,b)=> new Date(b.date) - new Date(a.date));
  }
  state.filtered = arr;
}

function renderProjects(){
  const list = $('#projectList');
  list.innerHTML='';

  if(state.filtered.length===0){
    $('#status').textContent = 'No projects found.';
    return;
  } else {
    $('#status').textContent = '';
  }

  const tpl = $('#projectItemTemplate');
  state.filtered.forEach(p => {
    const node = tpl.content.cloneNode(true);

    const img = node.querySelector('.thumb');
    if (img) {
      if (p.image) {
        img.src = p.image;
        img.alt = p.imageAlt || `${p.title} preview`;
        img.loading = 'lazy';
        img.style.display = 'block';
      } else {
        img.remove();
      }
    }

    node.querySelector('.title').textContent = p.title;
    node.querySelector('.date').textContent = new Date(p.date).toLocaleDateString();
    node.querySelector('.summary').textContent = p.summary;
    node.querySelector('.details').textContent = p.details;

    const tags = node.querySelector('.tags');
    (p.tags || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });

    const accBtn = node.querySelector('.accordion');
    const panel = node.querySelector('.panel-acc');
    accBtn.addEventListener('click', () => {
      panel.style.maxHeight = panel.style.maxHeight ? '' : panel.scrollHeight + 'px';
    });

    list.appendChild(node);
  });

  initReveal(); 
}

function initForm(){
  const form = $('#contactForm');
  const status = $('#formStatus');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '';
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    let ok = true;
    ok &= setError('#name', name.length>=2 ? '' : 'Please enter at least 2 characters.');
    ok &= setError('#email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email.');
    ok &= setError('#message', message.length>=10 ? '' : 'Message should be at least 10 characters.');
    if(!ok){ toast('Please fix the highlighted fields.'); return; }

    $('#sendBtn').disabled = true;
    $('#sendBtn').textContent = 'Sending…';
    try{
      await new Promise(res=>setTimeout(res, 1200));
      toast('Message sent!');
      status.textContent = 'Thanks! I will get back to you soon.';
      form.reset();
    }catch(err){
      status.textContent = 'Failed to send. Please try again.';
      toast('Send failed');
    }finally{
      $('#sendBtn').disabled = false;
      $('#sendBtn').textContent = 'Send';
    }
  });

  function setError(sel, msg){
    const input = $(sel);
    const small = input.parentElement.querySelector('.error');
    small.textContent = msg;
    return msg === '';
  }
}

function initSearchSort(){
  $('#searchInput').addEventListener('input', (e)=>{
    state.query = e.target.value;
    applyFilters();
    renderProjects();
  });
  $('#sortSelect').addEventListener('change', (e)=>{
    state.sort = e.target.value;
    applyFilters();
    renderProjects();
  });
  $('#reloadBtn').addEventListener('click', ()=>{ loadProjects(); });
}

document.addEventListener('DOMContentLoaded', ()=>{
  $('#year').textContent = new Date().getFullYear();
  setGreeting();
  applyTheme();
  $('#themeToggle').addEventListener('click', toggleTheme);
  initTabs();
  initReveal();
  initForm();
  initSearchSort();
  loadProjects();
});
