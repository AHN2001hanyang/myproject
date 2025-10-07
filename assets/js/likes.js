// 简易点赞与下载统计（本地存储 + 可选服务端）
// 默认：本地存储避免重复点赞；如果部署了服务端 API，会自动上报。
(function(){
  const ENDPOINT = window.__ENDPOINT__ || {
    like: '/api/like',
    totals: '/api/totals',
    hit: '/api/hit'
  };

  function localKey(k){ return `like_${k}`; }
  function getLocalLike(k){ return localStorage.getItem(localKey(k)) === '1'; }
  function setLocalLike(k){ localStorage.setItem(localKey(k),'1'); }

  async function fetchTotals(){
    try{
      const res = await fetch(ENDPOINT.totals);
      if(!res.ok) throw 0;
      const data = await res.json();
      if(data.totalLikes != null) document.getElementById('totalLikes')?.replaceChildren(String(data.totalLikes));
      if(data.totalDownloads != null) document.getElementById('totalDownloads')?.replaceChildren(String(data.totalDownloads));
      // 填充每个项目的点赞数
      document.querySelectorAll('.like-count').forEach(el=>{
        const key = el.getAttribute('data-key');
        if(data.items && data.items[key] != null){
          el.textContent = data.items[key];
        }
      });
    }catch(e){
      // 忽略：无服务端时不报错
    }
  }

  async function sendLike(key){
    try{
      await fetch(ENDPOINT.like+`?key=${encodeURIComponent(key)}`, {method:'POST'});
    }catch(e){}
  }

  document.addEventListener('click', e=>{
    const btn = e.target.closest('.like-btn');
    if(!btn) return;
    const key = btn.getAttribute('data-key');
    if(getLocalLike(key)) return; // 防止重复本机点赞
    setLocalLike(key);
    const counter = document.querySelector(`.like-count[data-key="${key}"]`);
    if(counter){ counter.textContent = String((parseInt(counter.textContent||'0',10)||0)+1); }
    sendLike(key); // 可选上报服务端
    btn.classList.add('liked');
  });

  fetchTotals();
})();
