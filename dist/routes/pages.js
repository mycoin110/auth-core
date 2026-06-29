import { Hono } from "hono";
/**
 * 创建内置登录/注册/管理页面路由。
 * 支持自定义主题色，提供完整的用户管理界面。
 */
export function createPageRoutes(config) {
    const app = new Hono();
    app.get(config.loginPath ?? "/login", (c) => c.html(loginHtml(config)));
    app.get(config.registerPath ?? "/register", (c) => c.html(registerHtml(config)));
    app.get(config.adminPath ?? "/admin", (c) => c.html(adminHtml(config)));
    return app;
}
// ==================== 颜色工具 ====================
function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}
// ==================== 登录页面 ====================
function loginHtml(config) {
    const pc = config.primaryColor ?? "#3b82f6";
    const rgb = hexToRgb(pc);
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>登录 - ${config.appName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC",sans-serif;background:linear-gradient(135deg, rgba(${rgb},0.08), rgba(${rgb},0.02));display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:16px;padding:40px;max-width:380px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.card h1{font-size:24px;margin-bottom:4px}
.card p{color:#888;font-size:14px;margin-bottom:24px}
.form-group{margin-bottom:16px}
.form-group label{display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#555}
.form-group input{width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:15px;outline:none;transition:border .2s}
.form-group input:focus{border-color:${pc}}
.btn{width:100%;padding:11px;background:${pc};color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer}
.btn:hover{filter:brightness(1.1)}
.error{color:#ef4444;font-size:13px;margin-top:12px;display:none}
.footer{margin-top:16px;text-align:center;font-size:13px;color:#999}
.footer a{color:${pc};text-decoration:none}
</style></head>
<body>
<div class="card"><h1>${config.appIcon ?? ""} ${config.appName}</h1><p>登录后开始使用</p><div class="error" id="e"></div>
<form id="f"><div class="form-group"><label>邮箱</label><input type="email" id="em" placeholder="your@email.com" required></div>
<div class="form-group"><label>密码</label><input type="password" id="pw" placeholder="......" required></div>
<button type="submit" class="btn">登录</button></form>
<div class="footer">没有账号？<a href="${config.registerPath ?? "/register"}">去注册</a></div></div>
<script>
document.getElementById('f').onsubmit=async function(e){e.preventDefault();
var r=await fetch('${config.authPrefix ?? "/api/auth"}/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('em').value,password:document.getElementById('pw').value})});
var d=await r.json();if(d.ok){var p=new URLSearchParams(location.search);window.location.href=p.get('next')||'/'}
else{var el=document.getElementById('e');el.style.display='block';el.textContent=d.error||'登录失败'}};
</script></body></html>`;
}
// ==================== 注册页面 ====================
function registerHtml(config) {
    const pc = config.primaryColor ?? "#3b82f6";
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>注册 - ${config.appName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC",sans-serif;background:linear-gradient(135deg, rgba(${hexToRgb(pc)},0.08), rgba(${hexToRgb(pc)},0.02));display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:16px;padding:40px;max-width:380px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.card h1{font-size:24px;margin-bottom:4px}
.card p{color:#888;font-size:14px;margin-bottom:24px}
.form-group{margin-bottom:16px}
.form-group label{display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#555}
.form-group input{width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:15px;outline:none;transition:border .2s}
.form-group input:focus{border-color:${pc}}
.btn{width:100%;padding:11px;background:${pc};color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer}
.btn:hover{filter:brightness(1.1)}
.success{color:#22c55e;font-size:13px;margin-top:12px;display:none}
.error{color:#ef4444;font-size:13px;margin-top:12px;display:none}
.footer{margin-top:16px;text-align:center;font-size:13px;color:#999}
.footer a{color:${pc};text-decoration:none}
</style></head>
<body>
<div class="card"><h1>${config.appIcon ?? ""} ${config.appName}</h1><p>创建你的账号</p>
<div class="error" id="e"></div><div class="success" id="s"></div>
<form id="f"><div class="form-group"><label>邮箱</label><input type="email" id="em" placeholder="your@email.com" required></div>
<div class="form-group"><label>显示名称</label><input type="text" id="dn" placeholder="你的昵称"></div>
<div class="form-group"><label>密码</label><input type="password" id="pw" placeholder="至少 8 位" required minlength="8"></div>
<button type="submit" class="btn">注册</button></form>
<div class="footer">已有账号？<a href="${config.loginPath ?? "/login"}">去登录</a></div></div>
<script>
document.getElementById('f').onsubmit=async function(e){e.preventDefault();
var r=await fetch('${config.authPrefix ?? "/api/auth"}/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('em').value,password:document.getElementById('pw').value,displayName:document.getElementById('dn').value})});
var d=await r.json();if(d.ok){document.getElementById('s').style.display='block';document.getElementById('s').textContent=d.message||'注册成功';document.getElementById('f').style.display='none'}
else{document.getElementById('e').style.display='block';document.getElementById('e').textContent=d.error||'注册失败'}};
</script></body></html>`;
}
// ==================== 管理页面 ====================
function adminHtml(config) {
    const pc = config.primaryColor ?? "#3b82f6";
    const rgb = hexToRgb(pc);
    const hasModules = config.modules && config.modules.length > 0;
    return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>用户管理 · ${config.appName}</title>
<style>
:root{color-scheme:light}
*{box-sizing:border-box}
html,body{margin:0}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg, rgba(${rgb},0.08) 0%, rgba(${rgb},0.02) 100%);min-height:100vh;color:#2a2a2a;padding:2rem 1rem 4rem}
.container{max-width:1200px;margin:0 auto}
header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}
h1{margin:0;font-size:1.6rem;font-weight:600}
.toolbar{display:flex;align-items:center;gap:0.85rem;font-size:0.9rem}
.toolbar a{color:${pc};text-decoration:none}
.toolbar a:hover{text-decoration:underline}
.toolbar #me{color:#555}
.toolbar #me strong{color:#2a2a2a}
.btn{padding:0.4rem 0.85rem;font-size:0.85rem;font-weight:500;border:1px solid #e0d4dc;border-radius:6px;background:white;color:#444;cursor:pointer;transition:all 0.15s}
.btn:hover:not(:disabled){border-color:${pc};color:${pc}}
.btn:disabled{opacity:0.4;cursor:not-allowed}
.btn-primary{background:linear-gradient(135deg, ${pc}, ${adjustBrightness(pc, -20)});border-color:transparent;color:white}
.btn-primary:hover:not(:disabled){filter:brightness(1.05);color:white}
.btn-danger{color:#c2410c;border-color:#fed7aa}
.btn-danger:hover:not(:disabled){color:#9a3412;border-color:#c2410c}
.btn-warn{color:#92400e;border-color:#fde68a}
.btn-warn:hover:not(:disabled){color:#78350f;border-color:#92400e}
.card{background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.06);overflow:hidden}
table{width:100%;border-collapse:collapse;font-size:0.9rem}
th,td{padding:0.75rem 0.85rem;text-align:left;border-bottom:1px solid #f3e8ee}
th{background:rgba(${rgb},0.06);font-weight:600;color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.03em}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(${rgb},0.03)}
td.email{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:0.85rem}
td.actions{white-space:nowrap}
td.actions .btn{margin-right:0.35rem}
td.actions .btn:last-child{margin-right:0}
.badge{display:inline-block;padding:0.15rem 0.6rem;font-size:0.75rem;border-radius:999px;font-weight:500}
.badge-pending{background:#fef3c7;color:#92400e}
.badge-active{background:#d1fae5;color:#065f46}
.badge-disabled{background:#e5e7eb;color:#6b7280}
.badge-admin{background:rgba(${rgb},0.15);color:${pc};margin-left:0.3rem}
.me-marker{font-size:0.72rem;color:#888;margin-left:0.4rem}
.empty,.loading{padding:3rem;text-align:center;color:#888}
.global-error{margin-bottom:1rem;padding:0.85rem 1rem;background:#fee2e2;color:#991b1b;border-radius:8px;font-size:0.9rem}
.small-text{font-size:0.78rem;color:#999}
.col-time{white-space:nowrap;font-size:0.82rem;color:#666}

.modal-backdrop{position:fixed;inset:0;background:rgba(40,20,30,0.55);align-items:center;justify-content:center;z-index:100;padding:1rem}
.modal-backdrop:not([hidden]){display:flex}
.modal{background:white;border-radius:12px;padding:2rem;max-width:460px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
.modal h2{margin:0 0 1rem;font-size:1.2rem}
.modal p{margin:0.5rem 0;color:#555;line-height:1.6;font-size:0.92rem}
.modal .pwd-box{margin:1.25rem 0;padding:0.85rem 1rem;background:rgba(${rgb},0.06);border:1px dashed ${pc};border-radius:8px;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:1.1rem;text-align:center;letter-spacing:0.05em;word-break:break-all;user-select:all}
.modal-actions{display:flex;gap:0.6rem;justify-content:flex-end;margin-top:1.25rem}
.warn-text{font-size:0.85rem;color:#92400e;background:#fef3c7;padding:0.5rem 0.75rem;border-radius:6px;margin-top:0.75rem}

@media(max-width:760px){body{padding:1rem 0.5rem 3rem}th,td{padding:0.55rem 0.5rem;font-size:0.82rem}td.email{font-size:0.76rem;word-break:break-all}td.actions{white-space:normal}td.actions .btn{margin-bottom:0.3rem}}
</style></head>
<body>
<div class="container">
<header>
<h1>👥 用户管理</h1>
<div class="toolbar">
<span id="me">加载中…</span>
<a href="/">← 返回首页</a>
<button class="btn" id="logout">登出</button>
</div></header>
<div class="global-error" id="globalError" hidden></div>
<div class="card">
<table>
<thead><tr>
<th>邮箱 / 昵称</th>
<th>状态</th>
<th>角色</th>
<th>注册时间</th>
<th>最后登录</th>
<th>操作</th>
</tr></thead>
<tbody id="rows"><tr><td colspan="6" class="loading">加载中…</td></tr></tbody>
</table></div></div>

<!-- 模块权限弹窗 -->
${hasModules ? `<div class="modal-backdrop" id="moduleModal" hidden>
<div class="modal" style="max-width:600px">
<h2 id="moduleModalTitle">权限管理</h2>
<div id="moduleList" style="max-height:400px;overflow-y:auto;padding:4px 0">加载中…</div>
<div class="modal-actions">
<button class="btn" id="moduleCancel">取消</button>
<button class="btn btn-primary" id="moduleSave">保存</button>
</div></div></div>` : ""}

<!-- 临时密码弹窗 -->
<div class="modal-backdrop" id="pwdModal" hidden>
<div class="modal">
<h2>🔑 临时密码已生成</h2>
<p>用户：<strong id="pwdEmail"></strong></p>
<div class="pwd-box" id="pwdBox"></div>
<div class="warn-text">⚠ 请立即把这串密码转给该用户。本接口不会再次显示明文。<br>对方所有旧 session 已被清除，必须用新密码重新登录。</div>
<div class="modal-actions">
<button class="btn" id="pwdCopy">复制</button>
<button class="btn btn-primary" id="pwdClose">我已记下</button>
</div></div></div>

<script>
const $$=(id)=>document.getElementById(id);
function fmtTime(ms){if(!ms)return"—";const d=new Date(ms);const pad=(n)=>String(n).padStart(2,"0");return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes())}
function esc(s){return String(s??"").replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function showErr(msg){const el=$$("globalError");el.textContent=msg;el.hidden=false}
function hideErr(){$$("globalError").hidden=true}
async function api(method,path,body){const opts={method,headers:{}};if(body!==undefined){opts.headers["Content-Type"]="application/json";opts.body=JSON.stringify(body)};const r=await fetch(path,opts);let j={};try{j=await r.json()}catch{};if(!r.ok)throw new Error(j.error||method+" "+path+" 失败");return j}
let _uid=null,users=[],modCache=null;

${hasModules ? `
async function loadMods(){if(modCache)return modCache;try{const j=await api("GET","/api/admin/modules");modCache=j.sections;return modCache}catch{return[]}}
let modUid=null;
async function openModModal(uid,email){modUid=uid;$$("moduleModalTitle").textContent="权限管理："+email;const secs=await loadMods();let uKeys=[];try{const j=await api("GET","/api/admin/users/"+uid+"/modules");uKeys=j.moduleKeys}catch{};const ks=new Set(uKeys);const el=$$("moduleList");let all=secs.every(s=>s.modules.every(m=>ks.has(m.key)));let h='<div style="margin-bottom:12px"><label style="font-size:14px;cursor:pointer"><input type="checkbox" id="msa"'+(all?' checked':'')+'> <strong>全选 / 取消全选</strong></label></div>';
for(const s of secs){const cnt=s.modules.filter(m=>ks.has(m.key)).length;h+='<div style="margin:12px 0 6px;font-size:14px;font-weight:600;color:#555">'+s.icon+' '+s.name+' <span style="font-weight:400;font-size:12px;color:#999">（'+cnt+'/'+s.modules.length+'）</span></div><div style="display:flex;flex-wrap:wrap;gap:6px;padding-left:4px">';for(const m of s.modules){const ch=ks.has(m.key)?' checked':'';h+='<label style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border:1px solid #e0d4dc;border-radius:6px;font-size:13px;cursor:pointer;background:'+(ch?'rgba(${rgb},0.06)':'#fff')+'"><input type="checkbox" class="mc" value="'+m.key+'"'+ch+'> '+m.name+'</label>'}h+='</div>'}
el.innerHTML=h;document.getElementById("msa").addEventListener("change",function(){const c=this.checked;document.querySelectorAll(".mc").forEach(cb=>cb.checked=c)});$$("moduleModal").hidden=false}
function closeModModal(){$$("moduleModal").hidden=true;modUid=null}
async function saveModModal(){const cbs=document.querySelectorAll(".mc:checked");const keys=Array.from(cbs).map(cb=>cb.value);try{await api("PUT","/api/admin/users/"+modUid+"/modules",{moduleKeys:keys});closeModModal()}catch(e){alert(e.message)}}
` : ""}

async function loadMe(){try{const j=await api("GET","/api/auth/me");_uid=j.user.id;const ia=j.user.role==="admin";$$("me").innerHTML="<strong>"+esc(j.user.email)+"</strong>"+(ia?'<span class="badge badge-admin">admin</span>':"");if(!ia)showErr("当前账号不是管理员，无法管理其他用户。")}catch{location.href="/login?next=/admin"}}

async function loadUsers(){hideErr();try{const j=await api("GET","/api/admin/users");users=j.users;render()}catch(e){showErr(e.message);$$("rows").innerHTML='<tr><td colspan="6" class="empty">无法加载用户列表</td></tr>'}}

function badge(s){const m={pending:"待审批",active:"可用",disabled:"已禁用"};return'<span class="badge badge-'+s+'">'+(m[s]||s)+"</span>"}

function acts(u){const isMe=u.id===_uid;const b=[];
if(u.status==="pending")b.push('<button class="btn btn-primary" data-act="approve" data-id="'+u.id+'">批准</button>');
if(u.status==="active"&&!isMe)b.push('<button class="btn btn-warn" data-act="disable" data-id="'+u.id+'">禁用</button>');
if(u.status==="disabled")b.push('<button class="btn" data-act="enable" data-id="'+u.id+'">启用</button>');
if(!isMe){b.push('<button class="btn" data-act="reset" data-id="'+u.id+'" data-email="'+esc(u.email)+'">重置密码</button>');${hasModules ? "b.push('<button class=\"btn\" data-act=\\\"modules\\\" data-id=\\\"' + u.id + '\\\" data-email=\\\"' + esc(u.email) + '\\\">权限管理</button>');" : ""}b.push('<button class="btn btn-danger" data-act="delete" data-id="'+u.id+'" data-email="'+esc(u.email)+'">删除</button>')}
return b.join("")}

function render(){const tb=$$("rows");if(!users.length){tb.innerHTML='<tr><td colspan="6" class="empty">暂无用户</td></tr>';return}
tb.innerHTML=users.map(function(u){const isMe=u.id===_uid;const mt=isMe?'<span class="me-marker">（你）</span>':"";const nm=u.displayName?esc(u.displayName):'<span class="small-text">未填昵称</span>';
return '<tr><td><div class="email">'+esc(u.email)+mt+'</div><div class="small-text">'+nm+'</div></td><td>'+badge(u.status)+'</td><td>'+u.role+(u.role==="admin"?('<span class="badge badge-admin">admin</span>'):"")+'</td><td class="col-time">'+fmtTime(u.createdAt)+'</td><td class="col-time">'+fmtTime(u.lastLoginAt)+'</td><td class="actions">'+acts(u)+'</td></tr>'}).join("")}

async function doAct(act,id,email){hideErr();try{if(act==="approve")await api("POST","/api/admin/users/"+id+"/approve");else if(act==="disable"){if(!confirm("确认禁用该用户？\\n所有 session 会被清除。"))return;await api("POST","/api/admin/users/"+id+"/disable")}else if(act==="enable")await api("POST","/api/admin/users/"+id+"/enable");else if(act==="delete"){if(!confirm("确认永久删除 "+email+"？此操作不可恢复。"))return;await api("DELETE","/api/admin/users/"+id)}else if(act==="reset"){if(!confirm("确认重置 "+email+" 的密码？\\n对方所有 session 会被清除。"))return;const j=await api("POST","/api/admin/users/"+id+"/reset-password");showPwd(email,j.tempPassword)}${hasModules ? 'else if(act==="modules"){openModModal(id,email)}' : ''};await loadUsers()}catch(e){showErr(e.message)}}

function showPwd(email,pwd){$$("pwdEmail").textContent=email;$$("pwdBox").textContent=pwd;$$("pwdModal").hidden=false}
function closePwd(){$$("pwdModal").hidden=true;$$("pwdBox").textContent=""}
$$("pwdClose").addEventListener("click",closePwd);
$$("pwdCopy").addEventListener("click",async function(){try{await navigator.clipboard.writeText($$("pwdBox").textContent);$$("pwdCopy").textContent="已复制 ✓";setTimeout(function(){$$("pwdCopy").textContent="复制"},1500)}catch{}});

$$("rows").addEventListener("click",function(e){const t=e.target;if(!(t instanceof HTMLButtonElement))return;const act=t.dataset.act,id=Number(t.dataset.id),email=t.dataset.email||"";if(act&&id)doAct(act,id,email)});

${hasModules ? `$$("moduleCancel")&&$$("moduleCancel").addEventListener("click",closeModModal);$$("moduleSave")&&$$("moduleSave").addEventListener("click",saveModModal);` : ""}

$$("logout").addEventListener("click",async function(){try{await api("POST","/api/auth/logout")}catch{};location.href="/login"});

(async function(){await loadMe();await loadUsers()})();
</script></body></html>`;
}
// ==================== User Widget ====================
/**
 * 返回用户信息小部件的 HTML 片段。
 * 适合插入到页面 header 的右上角。
 */
export function userWidgetHtml(config) {
    const pc = config.primaryColor ?? "#3b82f6";
    return `
<style>
.topbar-right{display:flex;align-items:center;gap:10px}
.topbar-admin-link{display:inline-flex;align-items:center;gap:4px;font-size:13px;color:${pc};background:rgba(${hexToRgb(pc)},0.1);border:1px solid rgba(${hexToRgb(pc)},0.25);padding:5px 12px;border-radius:999px;text-decoration:none;transition:background .15s,color .15s}
.topbar-admin-link:hover{background:rgba(${hexToRgb(pc)},0.2)}
.topbar-user{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#555}
.topbar-user-name{font-weight:500;color:#2a2a2a;cursor:default}
.topbar-logout{padding:4px 10px;border:1px solid #e0d4dc;border-radius:6px;background:#fff;color:#888;cursor:pointer;font-size:12px;transition:all .15s}
.topbar-logout:hover{border-color:#c2410c;color:#c2410c}
.topbar-login{font-size:13px;color:${pc};text-decoration:none;padding:5px 12px;border:1px solid rgba(${hexToRgb(pc)},0.3);border-radius:999px;transition:all .15s}
.topbar-login:hover{background:rgba(${hexToRgb(pc)},0.08)}
[hidden]{display:none!important}
</style>
<div class="topbar-right">
  <a class="topbar-admin-link" href="${config.adminPath ?? "/admin"}" id="topbarAdminLink" hidden title="管理后台"><span>管理</span></a>
  <div class="topbar-user" id="topbarUser" hidden>
    <span class="topbar-user-name" id="topbarUserName" title=""></span>
    <button class="topbar-logout" id="topbarLogout" type="button" title="登出">登出</button>
  </div>
  <a class="topbar-login" href="${config.loginPath ?? "/login"}" id="topbarLogin">登录</a>
</div>`;
}
// ==================== User Widget JS ====================
/**
 * 返回用户信息小部件的 JavaScript 逻辑（内联用）。
 */
export function userWidgetScript(config) {
    const cacheKey = `authcore_me_${config.appName?.replace(/\s+/g, "_") ?? "app"}`;
    return `
(function(){
var el=document.getElementById("topbarUser"),nl=document.getElementById("topbarLogin");
var ne=document.getElementById("topbarUserName"),al=document.getElementById("topbarAdminLink"),lo=document.getElementById("topbarLogout");
if(!el||!nl)return;
var user=null;
try{var c=sessionStorage.getItem("${cacheKey}");if(c)user=JSON.parse(c)}catch(e){}
if(!user){(async function(){try{var r=await fetch("${config.authPrefix ?? "/api/auth"}/me",{credentials:"same-origin"});if(r.ok){var j=await r.json();if(j&&j.user){user=j.user;try{sessionStorage.setItem("${cacheKey}",JSON.stringify(user))}catch(e){}}}}catch(e){}if(user){ne.textContent=user.displayName||user.email;ne.title=user.email;var isHome=location.pathname==="/"||location.pathname==="/index.html";al.hidden=user.role!=="admin"||!isHome;el.hidden=false;nl.hidden=true;lo&&lo.addEventListener("click",async function(){try{await fetch("${config.authPrefix ?? "/api/auth"}/logout",{method:"POST"})}catch(e){};try{sessionStorage.removeItem("${cacheKey}")}catch(e){};location.href="${config.loginPath ?? "/login"}"})}})()}})();
})();
`;
}
// ==================== 工具函数 ====================
function adjustBrightness(hex, percent) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const nr = Math.max(0, Math.min(255, r + percent));
    const ng = Math.max(0, Math.min(255, g + percent));
    const nb = Math.max(0, Math.min(255, b + percent));
    return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}
//# sourceMappingURL=pages.js.map