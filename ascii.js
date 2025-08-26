// Shared ASCII responsiveness for subpages
(function(){
  function adjust(){
    const ascii=document.getElementById('ascii-art');
    if(!ascii) return;
    const w=window.innerWidth;
    if(w<360){ ascii.style.fontSize='6px'; ascii.style.lineHeight='6px'; ascii.style.whiteSpace='pre-wrap'; }
    else if(w<500){ ascii.style.fontSize='8px'; ascii.style.lineHeight='8px'; ascii.style.whiteSpace='pre-wrap'; }
    else if(w<700){ ascii.style.fontSize='10px'; ascii.style.lineHeight='10px'; ascii.style.whiteSpace='pre'; }
    else { ascii.style.fontSize=''; ascii.style.lineHeight=''; ascii.style.whiteSpace='pre'; }
  }
  window.addEventListener('resize', adjust);
  adjust();
})();
