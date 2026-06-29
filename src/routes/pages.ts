import { Hono } from "hono";
import type { AuthCoreConfig } from "../config.js";

/**
 * 内置登录/注册/管理页面路由。
 * 每个项目开箱即用，无需自己写 HTML。
 */
export function createPageRoutes(config: AuthCoreConfig) {
  const app = new Hono();

  app.get(config.loginPath!, (c) => c.html(loginHtml(config)));
  app.get(config.registerPath!, (c) => c.html(registerHtml(config)));
  app.get(config.adminPath!, (c) => c.html(adminHtml(config)));

  return app;
}

function loginHtml(c: AuthCoreConfig): string {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>登录 - ${c.appName}</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC",sans-serif;background:linear-gradient(135deg,#f0f4ff,#e8eafc);display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:16px;padding:40px;max-width:380px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.card h1{font-size:24px;margin-bottom:4px}
.card p{color:#888;font-size:14px;margin-bottom:24px}
.form-group{margin-bottom:16px}
.form-group label{display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#555}
.form-group input{width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:15px;outline:none;transition:border .2s}
.form-group input:focus{border-color:#3b82f6}
.btn{width:100%;padding:11px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer}
.btn:hover{background:#2563eb}
.error{color:#ef4444;font-size:13px;margin-top:12px;display:none}
.footer{margin-top:16px;text-align:center;font-size:13px;color:#999}
.footer a{color:#3b82f6;text-decoration:none}
</style></head><body>
<div class="card"><h1>${c.appIcon || ''} ${c.appName}</h1><p>登录后开始使用</p>
<div class="error" id="e"></div>
<form id="f">
<div class="form-group"><label>邮箱</label><input type="email" id="em" placeholder="your@email.com" required></div>
<div class="form-group"><label>密码</label><input type="password" id="pw" placeholder="......" required></div>
<button type="submit" class="btn">登录</button>
</form>
<div class="footer">没有账号？<a href="${c.registerPath}">去注册</a></div>
</div>
<script>
document.getElementById('f').onsubmit=async function(e){e.preventDefault();var r=await fetch('${c.authPrefix}/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('em').value,password:document.getElementById('pw').value})});var d=await r.json();if(d.ok){var p=new URLSearchParams(location.search);window.location.href=p.get('next')||'/'}else{var el=document.getElementById('e');el.style.display='block';el.textContent=d.error||'登录失败'}};
</script></body></html>`;
}

function registerHtml(c: AuthCoreConfig): string {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>注册 - ${c.appName}</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC",sans-serif;background:linear-gradient(135deg,#f0f4ff,#e8eafc);display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:16px;padding:40px;max-width:380px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.card h1{font-size:24px;margin-bottom:4px}
.card p{color:#888;font-size:14px;margin-bottom:24px}
.form-group{margin-bottom:16px}
.form-group label{display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#555}
.form-group input{width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:15px;outline:none;transition:border .2s}
.form-group input:focus{border-color:#3b82f6}
.btn{width:100%;padding:11px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer}
.btn:hover{background:#2563eb}
.success{color:#22c55e;font-size:13px;margin-top:12px;display:none}
.error{color:#ef4444;font-size:13px;margin-top:12px;display:none}
.footer{margin-top:16px;text-align:center;font-size:13px;color:#999}
.footer a{color:#3b82f6;text-decoration:none}
</style></head><body>
<div class="card"><h1>${c.appIcon || ''} ${c.appName}</h1><p>创建你的账号</p>
<div class="error" id="e"></div><div class="success" id="s"></div>
<form id="f">
<div class="form-group"><label>邮箱</label><input type="email" id="em" placeholder="your@email.com" required></div>
<div class="form-group"><label>显示名称</label><input type="text" id="dn" placeholder="你的昵称"></div>
<div class="form-group"><label>密码</label><input type="password" id="pw" placeholder="至少 8 位" required minlength="8"></div>
<button type="submit" class="btn">注册</button>
</form>
<div class="footer">已有账号？<a href="${c.loginPath}">去登录</a></div>
</div>
<script>
document.getElementById('f').onsubmit=async function(e){e.preventDefault();var r=await fetch('${c.authPrefix}/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('em').value,password:document.getElementById('pw').value,displayName:document.getElementById('dn').value})});var d=await r.json();if(d.ok){document.getElementById('s').style.display='block';document.getElementById('s').textContent=d.message||'注册成功';document.getElementById('f').style.display='none'}else{document.getElementById('e').style.display='block';document.getElementById('e').textContent=d.error||'注册失败'}};
</script></body></html>`;
}

function adminHtml(c: AuthCoreConfig): string {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>管理后台 - ${c.appName}</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC",sans-serif;background:#f8fafc;padding:24px;max-width:1000px;margin:0 auto}
h1{font-size:22px;margin-bottom:20px}
table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #e2e8f0}
th{color:#64748b;font-size:13px;font-weight:600}
td{font-size:14px}
.tag{font-size:11px;padding:2px 8px;border-radius:999px;background:#dbeafe;color:#1d4ed8}
.tag.admin{background:#fce7f3;color:#be185d}
.tag.pending{background:#fef3c7;color:#b45309}
.tag.disabled{background:#fef2f2;color:#dc2626}
.btn{font-size:12px;padding:4px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;margin-right:4px}
.btn:hover{background:#f1f5f9}
.p-actions{white-space:nowrap}
</style></head><body>
<h1> ${c.appName} - 用户管理</h1>
<p id="loading">加载中...</p>
<div id="content"></div>
<script>
async function load(){
  var u=await fetch('${c.authPrefix}/me');
  var d=await u.json();
  if(!d.user||d.user.role!=='admin'){document.getElementById('loading').textContent='无管理员权限';return}
  var r=await fetch('/api/admin/users');
  var data=await r.json();
  var users=data.users||[];
  var html='<table><thead><tr><th>状态</th><th>邮箱</th><th>角色</th><th>操作</th></tr></thead><tbody>';
  users.forEach(function(u){
    var tag='tag';
    if(u.role==='admin')tag+=' admin';
    if(u.status==='pending')tag+=' pending';
    if(u.status==='disabled')tag+=' disabled';
    html+='<tr><td><span class="tag '+tag+'">'+u.status+'</span></td><td>'+(u.displayName||'')+'<br><span style="font-size:12px;color:#999">'+u.email+'</span></td><td>'+u.role+'</td>';
    html+='<td class="p-actions">';
    if(u.role!=='admin'){
      if(u.status==='pending')html+='<button class="btn" onclick="doAction('+u.id+',\'approve\')">通过</button>';
      if(u.status==='active')html+='<button class="btn" onclick="doAction('+u.id+',\'disable\')">禁用</button>';
      if(u.status==='disabled')html+='<button class="btn" onclick="doAction('+u.id+',\'enable\')">启用</button>';
    }
    html+='<button class="btn" onclick="resetPwd('+u.id+')">重置密码</button></td></tr>';
  });
  html+='</tbody></table>';
  document.getElementById('loading').textContent='';
  document.getElementById('content').innerHTML=html;
}
async function doAction(id,action){await fetch('/api/admin/users/'+id+'/'+action,{method:'POST'});load()}
async function resetPwd(id){var r=await(await fetch('/api/admin/users/'+id+'/reset-password',{method:'POST'})).json();alert('临时密码：'+r.tempPassword)}
load();
</script></body></html>`;
}
