import json, time, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas

w = Wanas(9341, f'http://localhost:8107/index.html?cb={int(time.time())}')
w.open(); time.sleep(1.5)
res = w.evp("""(async function(){
  const out = {};
  // seed an OLD-version token in localStorage (test the migration)
  localStorage.setItem('wanas_gh', JSON.stringify({token:'ghp_OLDTOKEN123'}));
  // reload so migration runs
  location.reload();
  return 'reloading';
})()""")
time.sleep(2)
r = w.evp("""(async function(){
  const out = {};
  // 1. migration: old localStorage token moved to session + removed from localStorage
  out.oldLS = localStorage.getItem('wanas_gh');
  out.sessionHas = (JSON.parse(sessionStorage.getItem('wanas_gh_session')||'{}').token === 'ghp_OLDTOKEN123');
  // 2. field-only publish: clear session, put token in field only
  sessionStorage.removeItem('wanas_gh_session');
  document.getElementById('adminBtn').style.display='';
  document.getElementById('adminBtn').click();
  document.getElementById('adminPass').value='wanas123';
  document.getElementById('adminLoginBtn').click();
  await new Promise(r=>setTimeout(r,300));
  document.querySelectorAll('#settingsTabs button').forEach(b=>{ if(b.dataset.st==='github') b.click(); });
  document.getElementById('ghToken').value = 'ghp_FIELDONLY';
  out.ghTokenFn = ghToken();  // should read the FIELD
  // 3. mock fetch: capture GET+PUT
  const calls = [];
  const real = window.fetch;
  window.fetch = async function(url, opts){
    calls.push({u:String(url), m:(opts&&opts.method)||'GET', body:opts?opts.body:null, h:opts?opts.headers:{}});
    if((opts&&opts.method)==='PUT'){
      return {ok:true, json: async()=>({commit:{sha:'newsha'}}), status:200};
    }
    return {ok:true, status:200, json: async()=>({sha:'sha_mock', content: btoa('x')})};
  };
  publishToGitHub();
  await new Promise(r=>setTimeout(r,600));
  out.getCalls = calls.filter(c=>c.m==='GET').length;
  out.putCalls = calls.filter(c=>c.m==='PUT').length;
  out.sessionAfterSuccess = sessionStorage.getItem('wanas_gh_session');
  out.lsAfterSuccess = localStorage.getItem('wanas_gh');
  out.fieldAfter = document.getElementById('ghToken').value;
  // 4. publish content hygiene: decode last PUT and confirm no token inside
  const put = calls.find(c=>c.m==='PUT');
  let leak=false;
  if(put){
    const body=JSON.parse(put.body);
    const html = decodeURIComponent(escape(atob(body.content)));
    leak = html.includes('ghp_FIELDONLY') || html.includes('ghp_OLDTOKEN123');
    out.putShaUsed = body.sha;
  }
  out.tokenLeakInContent = leak;
  out.errs = [];
  return JSON.stringify(out);
})()""")
print("token lifecycle:", r)
print("console:", w.console_errors())
