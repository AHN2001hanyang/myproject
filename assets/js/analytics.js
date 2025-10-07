// 极简访问统计：通过 sendBeacon 上报（需部署 /api/hit 才会记录全站 PV/UV）
(function(){
  try{
    const ENDPOINT = window.__ENDPOINT__ || { hit: '/api/hit' };
    const uidKey = 'site_uid';
    const uid = localStorage.getItem(uidKey) || (crypto.randomUUID ? crypto.randomUUID() : String(+new Date()));
    localStorage.setItem(uidKey, uid);
    const payload = JSON.stringify({ path: location.pathname, ref: document.referrer, uid });
    if(navigator.sendBeacon){
      const blob = new Blob([payload], {type:'application/json'});
      navigator.sendBeacon(ENDPOINT.hit, blob);
    }else{
      fetch(ENDPOINT.hit, {method:'POST', headers:{'Content-Type':'application/json'}, body:payload});
    }
  }catch(e){}
})();
