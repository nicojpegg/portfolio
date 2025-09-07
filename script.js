// Interactive terminal script
// Commands: about, projects, photography, links, contact, clear, help, home
// Simplified: no custom loading spinner or typewriter; relies on existing .line CSS animations in content blocks.

const terminal = document.getElementById('terminal');
const output = document.getElementById('terminal-output');
const typedSpan = document.getElementById('typed');
const inputLine = document.getElementById('active-input-line');
const mobileInput = document.getElementById('mobile-input');

// Cache for fetched pages (to avoid re-fetching)
const pageCache = {};

const COMMANDS = ['about','projects','photography','links','contact','clear','help','home','tousend','skibidi'];
const history = [];
let historyIndex = -1;
let currentInput = '';
// Removed obsolete overlay / gallery state (moved to dedicated photography page)
let skibidiInterval = null;
let confettiInterval = null;

function createPrompt(commandText = '') {
  const div = document.createElement('div');
  div.className = 'cmd';
  div.innerHTML = `<p><span class="grey">guest</span><span class="dark">@</span><span class="green">nicojpeg.tech</span><span class="dark">:$ ~</span> ${commandText ? `<span class='grey'>${escapeHtml(commandText)}</span>`:''}</p>`;
  return div;
}
function escapeHtml(str){ return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
async function fetchPage(path){ if(pageCache[path]) return pageCache[path]; try { const res=await fetch(path); const text=await res.text(); const blocks={}; const parser=new DOMParser(); const doc=parser.parseFromString(text,'text/html'); ['about','projects','photography','links','contact'].forEach(name=>{ const el=doc.querySelector(`div.${name}`); if(el) blocks[name]=el.outerHTML; }); pageCache[path]={ raw:text, blocks }; return pageCache[path]; } catch(e){ return { error:true, message:e.message }; } }
function appendContent(fragmentHtml, commandName){
  const container=document.createElement('div');
  container.className='command-result';
  if(['about','projects','links','contact'].includes(commandName)) container.classList.add('section-block');
  container.innerHTML=fragmentHtml;
  output.appendChild(container);
  const lines=container.querySelectorAll('.line');
  lines.forEach((el,idx)=>{ el.style.animationDelay=(idx*40)+'ms'; });
  const imgs=container.querySelectorAll('img'); imgs.forEach(img=>{ img.classList.add('fade-in-media'); });
  scrollToBottom();
  return container;
}
function clearTerminal(){
  // Stop any ongoing skibidi madness
  if(document.body.classList.contains('skibidi-active')) endSkibidi();
  const header = document.getElementById('terminal-header');
  // Remove everything except the persistent header
  Array.from(output.children).forEach(child=>{ if(child!==header) output.removeChild(child); });
}
function helpText(){ return `<div class='help'>\n  <span class='green'>Available commands</span>\n<pre class="help-block">about         Show about section\nprojects      Show projects portfolio\nphotography   Show photography section\nlinks         Show saved links/bookmarks\ncontact       Show contact information\nhome          Show banner again\nclear         Clear the screen\nhelp          Show this help</pre></div>`; }
async function runCommand(cmd){
  const command=cmd.toLowerCase();
  if(!command) return;
  if(!COMMANDS.includes(command)){
    appendContent(`<div class='error'>command not found: ${escapeHtml(command)}</div>`);
    return;
  }
  if(command==='clear'||command==='home'){ clearTerminal(); return; }
  if(command==='help'){ appendContent(helpText(),'help'); return; }
  if(command==='photography'){
    appendContent(`<div class='photography-link line'>Open photography gallery: <a class='green' href='/photography/' rel='noopener'>/photography/</a></div>`, 'photography');
    return;
  }
  if(command==='tousend'){
    appendContent(`<div class='line'>Opening <a class='green' href='https://tousend.me' target='_blank' rel='noopener'>tousend.me</a> ...</div>`,'tousend');
    setTimeout(()=>{ window.open('https://tousend.me','_blank','noopener'); },650);
    return;
  }
  if(command==='skibidi'){
    triggerSkibidi();
    return;
  }
  const path=`/${command}/`;
  const result=await fetchPage(path);
  if(result.error){
    appendContent(`<div class='error'>Error loading ${escapeHtml(path)}: ${escapeHtml(result.message)}</div>`);
    return;
  }
  const block=result.blocks[command] || `<div class='error'>No content block found for ${escapeHtml(command)}</div>`;
  appendContent(block, command);
}
function scrollToBottom(){ window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'}); }
// remove duplicate currentInput declaration (already declared above)

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Backspace'){
    currentInput = currentInput.slice(0,-1);
    typedSpan.textContent = currentInput;
    e.preventDefault();
    return;
  }
  if(e.key === 'Enter'){
    const prompt = createPrompt(currentInput);
    output.appendChild(prompt);
    const executing = currentInput;
    if(executing){ history.push(executing); historyIndex = history.length; }
    currentInput='';
    typedSpan.textContent='';
    runCommand(executing);
    scrollToBottom();
    e.preventDefault();
    return;
  }
  if(e.key === 'ArrowUp'){
    if(history.length && historyIndex > 0){ historyIndex--; currentInput = history[historyIndex]; typedSpan.textContent = currentInput; }
    e.preventDefault();
    return;
  }
  if(e.key === 'ArrowDown'){
    if(history.length && historyIndex < history.length - 1){ historyIndex++; currentInput = history[historyIndex]; } else { historyIndex = history.length; currentInput=''; }
    typedSpan.textContent = currentInput; e.preventDefault(); return;
  }
  if(e.key.length === 1 && !e.metaKey && !e.ctrlKey){ currentInput += e.key; typedSpan.textContent = currentInput; e.preventDefault(); }
  else if(e.key === 'Tab'){ const match=COMMANDS.filter(c=>c.startsWith(currentInput.toLowerCase())); if(match.length===1){ currentInput=match[0]; typedSpan.textContent=currentInput; } e.preventDefault(); }
});

// Responsive ASCII: scale down font-size on narrow screens
function adjustAscii(){ const ascii=document.getElementById('ascii-art'); if(!ascii) return; const width=window.innerWidth; if(width<360){ ascii.style.fontSize='6px'; ascii.style.lineHeight='6px'; ascii.style.whiteSpace='pre-wrap'; } else if(width<500){ ascii.style.fontSize='8px'; ascii.style.lineHeight='8px'; ascii.style.whiteSpace='pre-wrap'; } else if(width<700){ ascii.style.fontSize='10px'; ascii.style.lineHeight='10px'; ascii.style.whiteSpace='pre'; } else { ascii.style.fontSize=''; ascii.style.lineHeight=''; ascii.style.whiteSpace='pre'; } }
window.addEventListener('resize', adjustAscii); adjustAscii();
// Focus hidden mobile input on tap to summon keyboard
function focusMobile(){ if(mobileInput){ mobileInput.focus({preventScroll:true}); setTimeout(()=>mobileInput.setSelectionRange(mobileInput.value.length, mobileInput.value.length), 0); } }
window.addEventListener('click', (e)=>{ if(terminal.contains(e.target)) focusMobile(); });
inputLine.addEventListener('click', focusMobile);

// Keep typed content in sync with hidden input
if(mobileInput){
  mobileInput.addEventListener('input', ()=>{
    currentInput = mobileInput.value;
    typedSpan.textContent = currentInput;
  });
  mobileInput.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){
      const prompt = createPrompt(currentInput);
      output.appendChild(prompt);
      const executing = currentInput;
      if(executing){ history.push(executing); historyIndex = history.length; }
      currentInput='';
      typedSpan.textContent='';
      mobileInput.value='';
      runCommand(executing);
      scrollToBottom();
      e.preventDefault();
    }
  });
}
// Initial state already present (ASCII + hint) – nothing else to do on load.

// --- Easter Egg: Skibidi effect ---
function triggerSkibidi(){
  if(document.body.classList.contains('skibidi-active')) return;
  document.body.classList.add('skibidi-active');
  const container = document.createElement('div');
  container.className='command-result skibidi-eggs skibidi-box';
  container.innerHTML = `<div class='skibidi-stream'></div><div class='sk-hint'>type 'clear' to stop (good luck)</div>`;
  output.appendChild(container);
  const stream = container.querySelector('.skibidi-stream');
  const phrases=["SKIBIDI","TOILET","RIZZ","GYATT","OHIO","SIGMA","MEWING","NPC","AURA","GOONER","SKULL","GOOFY","MEME"];
  const emojis=['🚽','🔥','⚡','🌀','💥','👻','🛸','🧠','💫','🪽','🥶','🎯','🎲','🪩'];
  let count=0;
  function spawnLine(){
    if(!document.body.classList.contains('skibidi-active')) return;
    const line=document.createElement('div');
    line.className='sk-line';
    // Build a randomized sequence of multiple distinct phrases
    const selectionCount = 3 + Math.floor(Math.random()*4); // 3-6 words
    const shuffled = [...phrases].sort(()=>Math.random()-0.5).slice(0, selectionCount);
    // Optionally append emojis to some words
    const parts = shuffled.map(word => {
      const emojiCount = Math.random() < 0.6 ? 1 + Math.floor(Math.random()*3) : 0;
      if(!emojiCount) return word;
      const emo = emojis[Math.floor(Math.random()*emojis.length)].repeat(emojiCount);
      return word + ' ' + emo;
    });
    line.style.setProperty('--sk-rand-rot', (Math.random()*16-8)+'deg');
    line.style.setProperty('--sk-rand-hue', Math.floor(Math.random()*360));
    line.textContent = parts.join(' ');
    stream.appendChild(line);
    count++;
    if(count>220){ // prune oldest (skip hint which is outside stream)
      stream.firstChild && stream.removeChild(stream.firstChild);
    }
  // removed auto scroll to make box non-scrollable
  }
  skibidiInterval = setInterval(spawnLine, 150);
  for(let i=0;i<22;i++) spawnLine();
  // confetti madness
  function spawnConfetti(){
    if(!document.body.classList.contains('skibidi-active')) return;
    const piece=document.createElement('span');
    piece.className='sk-confetti';
    const size = (Math.random()*8+6).toFixed(1);
    piece.style.width=size+'px'; piece.style.height=size+'px';
    piece.style.left=(Math.random()*100)+'%';
    piece.style.setProperty('--sk-fall-time', (Math.random()*3+3).toFixed(2)+'s');
    piece.style.setProperty('--sk-x-drift', (Math.random()*40-20).toFixed(1)+'px');
    piece.style.background=`hsl(${Math.floor(Math.random()*360)} 85% 60%)`;
    container.appendChild(piece);
    setTimeout(()=>piece.remove(), 5000);
  }
  confettiInterval = setInterval(()=>{ for(let i=0;i<6;i++) spawnConfetti(); }, 600);
}
function endSkibidi(){
  document.body.classList.remove('skibidi-active');
  if(skibidiInterval){ clearInterval(skibidiInterval); skibidiInterval=null; }
  if(confettiInterval){ clearInterval(confettiInterval); confettiInterval=null; }
  // No removal of container: clearing clears output anyway
}
