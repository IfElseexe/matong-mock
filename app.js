(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = (n, cur = '₦') => cur + Math.round(n).toLocaleString('en-US');
  const fmtM = n => '₦' + (n / 1e6).toFixed(1) + 'M';
  const pill = (t, k) => `<span class="pill p-${k}">${t}</span>`;
  const statusKind = { Paid: 'ok', Sent: 'info', Draft: 'mute', Overdue: 'bad', Approved: 'ok', Pending: 'warn', Declined: 'bad',
    Active: 'ok', Offshore: 'info', 'On leave': 'mute', 'On track': 'ok', Delayed: 'bad', Starting: 'info',
    New: 'warn', 'In review': 'info', Income: 'ok', Expense: 'mute' };
  const st = t => pill(t, statusKind[t] || 'mute');

  const brand = `<span class="wordmark"><img src="assets/logo.png" alt="" onerror="this.outerHTML='<i></i>'"><span>MATONG<small>ENERGY LTD</small></span></span>`;
  $$('[data-brand]').forEach(el => (el.innerHTML = brand));

  const ROUTES = [
    { k: 'dashboard', l: 'Dashboard', i: '▦', g: null },
    { k: 'hr', l: 'People and HR', i: '☻', g: 'Company' },
    { k: 'accounting', l: 'Accounting', i: '≣', g: 'Money' },
    { k: 'invoices', l: 'Invoices', i: '▤', g: 'Money' },
    { k: 'incoming', l: 'Incoming', i: '⇩', g: 'Operations' },
    { k: 'procurement', l: 'Procurement and stock', i: '▣', g: 'Operations' },
    { k: 'engineering', l: 'Engineering projects', i: '⚙', g: 'Operations' }
  ];

  const state = { hrTab: 'employees', ledger: 'All', procTab: 'orders', inTab: 'requests' };

  // ---------- views ----------
  const views = {};

  views.dashboard = () => {
    const unpaid = D.invoices.filter(i => ['Sent', 'Overdue'].includes(i.status));
    const unpaidNgn = unpaid.filter(i => i.cur === '₦').reduce((a, i) => a + i.amt, 0);
    const unpaidUsd = unpaid.filter(i => i.cur === '$').reduce((a, i) => a + i.amt, 0);
    const overdue = D.invoices.filter(i => i.status === 'Overdue').length;
    const offshore = D.employees.filter(e => e.status === 'Offshore').length;
    const certs = D.certs.filter(c => c.days <= 30);
    const low = D.stock.filter(s => s.qty < s.min);
    const pend = D.leave.filter(l => l.status === 'Pending');
    const max = Math.max(...D.months.flatMap(m => [m.in, m.out]));
    return `
    <div class="grid g4">
      <div class="card stat"><div class="l">Active jobs</div><div class="v">${D.jobs.length}</div><div class="s">${D.jobs.filter(j => j.status === 'Delayed').length} delayed</div></div>
      <div class="card stat o"><div class="l">Unpaid invoices</div><div class="v">${fmtM(unpaidNgn)}</div><div class="s">+ ${fmt(unpaidUsd, '$')} · ${overdue} overdue</div></div>
      <div class="card stat g"><div class="l">Staff offshore now</div><div class="v">${offshore}</div><div class="s">of ${D.employees.length} on the payroll</div></div>
      <div class="card stat r"><div class="l">Needs attention</div><div class="v">${certs.length + low.length + pend.length}</div><div class="s">certificates, stock, leave</div></div>
    </div>
    <div class="grid g2" style="margin-top:18px">
      <div class="card"><h3>Active jobs <a href="#engineering" class="small">All projects</a></h3>
        ${D.jobs.map(j => `
        <div class="job">
          <span class="id">${j.id}</span>
          <div><div class="t">${j.name}</div><div class="m">${j.facility} · ${j.client} · due ${j.due}</div></div>
          <div>${st(j.status)}</div>
          <div class="track ${j.status === 'Delayed' ? 'late' : ''}"><i style="width:${j.progress}%"></i></div>
        </div>`).join('')}
      </div>
      <div style="display:grid;gap:18px;align-content:start">
        <div class="card"><h3>Money in and out <span class="legend"><span><b style="background:var(--sea)"></b>In</span><span><b style="background:var(--signal)"></b>Out</span></span></h3>
          <div class="chart">${D.months.map(m => `<div class="col"><div class="pair"><i class="in" style="height:${m.in / max * 100}%" title="In ₦${m.in}M"></i><i class="out" style="height:${m.out / max * 100}%" title="Out ₦${m.out}M"></i></div><span>${m.m}</span></div>`).join('')}</div>
          <div class="muted small" style="margin-top:8px">₦ millions, sample figures</div>
        </div>
        <div class="card"><h3>Needs attention</h3>
          <table><tbody>
            ${certs.map(c => `<tr><td><a href="#hr">${c.who}</a><div class="muted small">${c.cert}</div></td><td class="num">${pill(c.days + ' days left', 'bad')}</td></tr>`).join('')}
            ${low.slice(0, 3).map(s => `<tr><td><a href="#procurement">${s.name}</a><div class="muted small">${s.qty} left, minimum ${s.min}</div></td><td class="num">${pill('Low stock', 'warn')}</td></tr>`).join('')}
            ${pend.slice(0, 2).map(l => `<tr><td><a href="#hr">${l.who}</a><div class="muted small">${l.type}, ${l.days} days</div></td><td class="num">${pill('Needs approval', 'warn')}</td></tr>`).join('')}
          </tbody></table>
        </div>
      </div>
    </div>`;
  };

  views.hr = () => {
    const tabs = [['employees', 'Employees'], ['leave', 'Leave requests'], ['certs', 'Certificates']];
    let body = '';
    if (state.hrTab === 'employees') {
      body = `<div class="card tw"><table><thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Site</th><th>Status</th><th class="num">Monthly pay</th></tr></thead><tbody>
      ${D.employees.map(e => `<tr><td>${e.id}</td><td><strong>${e.name}</strong></td><td>${e.role}</td><td>${e.dept}</td><td>${e.site}</td><td>${st(e.status)}</td><td class="num">${fmt(e.salary)}</td></tr>`).join('')}
      </tbody></table></div>`;
    } else if (state.hrTab === 'leave') {
      body = `<div class="card tw"><table><thead><tr><th>Staff</th><th>Type</th><th>From</th><th>To</th><th class="num">Days</th><th>Status</th><th></th></tr></thead><tbody>
      ${D.leave.map(l => `<tr><td><strong>${l.who}</strong></td><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td class="num">${l.days}</td><td>${st(l.status)}</td>
      <td class="num">${l.status === 'Pending' ? `<button class="btn sm ok" data-act="leave" data-id="${l.id}" data-v="Approved">Approve</button> <button class="btn sm" data-act="leave" data-id="${l.id}" data-v="Declined">Decline</button>` : ''}</td></tr>`).join('')}
      </tbody></table></div>`;
    } else {
      body = `<div class="card tw"><p class="muted small" style="margin-top:0">Staff are listed by how soon a certificate expires, so nobody is sent offshore with an out-of-date one.</p><table><thead><tr><th>Staff</th><th>Certificate</th><th>Time left</th><th></th></tr></thead><tbody>
      ${D.certs.map(c => `<tr><td><strong>${c.who}</strong></td><td>${c.cert}</td><td>${pill(c.days + ' days', c.days <= 30 ? 'bad' : c.days <= 60 ? 'warn' : 'ok')}</td><td class="num"><button class="btn sm" data-act="remind" data-who="${c.who}">Send reminder</button></td></tr>`).join('')}
      </tbody></table></div>`;
    }
    return `<div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${state.hrTab === k ? 'on' : ''}" data-act="hrtab" data-k="${k}">${l}</button>`).join('')}</div>${body}
    <p class="muted small">Departments in this preview: Operations, Engineering, Procurement, Finance, HSE, HR.</p>`;
  };

  views.accounting = () => {
    const ngn = D.ledger.filter(r => r.cur === '₦');
    const inc = ngn.filter(r => r.type === 'Income').reduce((a, r) => a + r.amt, 0);
    const exp = ngn.filter(r => r.type === 'Expense').reduce((a, r) => a + r.amt, 0);
    const rows = D.ledger.filter(r => state.ledger === 'All' || r.type === state.ledger);
    const max = Math.max(...D.months.flatMap(m => [m.in, m.out]));
    return `
    <div class="grid g3">
      <div class="card stat g"><div class="l">Money in (naira, last 2 weeks)</div><div class="v">${fmtM(inc)}</div><div class="s">plus $62,000 received</div></div>
      <div class="card stat o"><div class="l">Money out (naira)</div><div class="v">${fmtM(exp)}</div><div class="s">payroll is the largest line</div></div>
      <div class="card stat"><div class="l">Net position</div><div class="v">${fmtM(inc - exp)}</div><div class="s">before the dollar account</div></div>
    </div>
    <div class="grid g2" style="margin-top:18px">
      <div class="card tw"><div class="bar"><h3 style="margin:0">Ledger</h3>
        <div class="tabs" style="margin:0">${['All', 'Income', 'Expense'].map(f => `<button class="tab ${state.ledger === f ? 'on' : ''}" data-act="ledger" data-k="${f}">${f}</button>`).join('')}</div></div>
        <table><thead><tr><th>Date</th><th>Ref</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td>${r.d}</td><td>${r.ref}</td><td>${r.desc}</td><td>${r.cat}</td><td class="num" style="color:${r.type === 'Income' ? 'var(--ok)' : 'var(--ink)'};font-weight:600">${r.type === 'Income' ? '+' : '−'}${fmt(r.amt, r.cur)}</td></tr>`).join('')}
        </tbody></table></div>
      <div class="card"><h3>Six months <span class="legend"><span><b style="background:var(--sea)"></b>In</span><span><b style="background:var(--signal)"></b>Out</span></span></h3>
        <div class="chart">${D.months.map(m => `<div class="col"><div class="pair"><i class="in" style="height:${m.in / max * 100}%"></i><i class="out" style="height:${m.out / max * 100}%"></i></div><span>${m.m}</span></div>`).join('')}</div>
        <div class="muted small" style="margin-top:8px">₦ millions, sample figures</div>
        <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="toast" data-m="Report export is part of the full build">Export report</button><button class="btn sm" data-act="toast" data-m="Add expense form is part of the full build">Add expense</button></div>
      </div>
    </div>`;
  };

  views.invoices = () => {
    const c = s => D.invoices.filter(i => i.status === s).length;
    return `
    <div class="grid g4">
      <div class="card stat"><div class="l">Drafts</div><div class="v">${c('Draft')}</div></div>
      <div class="card stat"><div class="l">Sent, awaiting payment</div><div class="v">${c('Sent')}</div></div>
      <div class="card stat r"><div class="l">Overdue</div><div class="v">${c('Overdue')}</div></div>
      <div class="card stat g"><div class="l">Paid</div><div class="v">${c('Paid')}</div></div>
    </div>
    <div class="card tw" style="margin-top:18px"><div class="bar"><h3 style="margin:0">All invoices</h3><button class="btn primary sm" data-act="toast" data-m="Invoice creation form is part of the full build">New invoice</button></div>
      <table><thead><tr><th>No.</th><th>Client</th><th>Issued</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead><tbody>
      ${D.invoices.map(i => `<tr><td><strong>${i.no}</strong></td><td>${i.client}</td><td>${i.issued}</td><td>${i.due}</td><td class="num">${fmt(i.amt, i.cur)}</td><td>${st(i.status)}</td><td class="num"><button class="btn sm" data-act="invoice" data-no="${i.no}">View</button></td></tr>`).join('')}
      </tbody></table></div>`;
  };

  views.incoming = () => {
    const tabs = [['requests', 'Requests'], ['payments', 'Payments received'], ['goods', 'Goods received']];
    let body = '';
    if (state.inTab === 'requests') {
      body = `<div class="card tw"><table><thead><tr><th>Date</th><th>From</th><th>What they need</th><th>Type</th><th>Status</th></tr></thead><tbody>
      ${D.requests.map(r => `<tr><td>${r.d}</td><td><strong>${r.from}</strong></td><td>${r.what}</td><td>${r.type}</td><td>${st(r.status)}</td></tr>`).join('')}</tbody></table></div>`;
    } else if (state.inTab === 'payments') {
      body = `<div class="card tw"><table><thead><tr><th>Date</th><th>Reference</th><th>For</th><th class="num">Amount</th></tr></thead><tbody>
      ${D.ledger.filter(r => r.type === 'Income').map(r => `<tr><td>${r.d}</td><td>${r.ref}</td><td>${r.desc}</td><td class="num" style="font-weight:600;color:var(--ok)">${fmt(r.amt, r.cur)}</td></tr>`).join('')}</tbody></table></div>`;
    } else {
      body = `<div class="card tw"><table><thead><tr><th>PO</th><th>Item</th><th>Supplier</th><th>Received</th></tr></thead><tbody>
      ${D.orders.filter(o => o.stage >= 3).map(o => `<tr><td><strong>${o.po}</strong></td><td>${o.item}</td><td>${o.supplier}</td><td>${o.stage === 4 ? pill('Delivered to site', 'ok') : pill('In warehouse', 'info')}</td></tr>`).join('')}</tbody></table></div>`;
    }
    return `<div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${state.inTab === k ? 'on' : ''}" data-act="intab" data-k="${k}">${l}</button>`).join('')}</div>${body}`;
  };

  views.procurement = () => {
    const tabs = [['orders', 'Order tracker'], ['stock', 'Warehouse stock']];
    let body = '';
    if (state.procTab === 'orders') {
      body = `<div class="card">${D.orders.map(o => `
        <div class="order">
          <div class="order-h"><div><strong>${o.po}</strong> · ${o.item}<div class="muted small">${o.supplier} · for ${o.client}</div></div>
          <div class="small">${o.eta === 'Delivered' ? pill('Delivered', 'ok') : 'Expected ' + o.eta}</div></div>
          <div class="steps">${D.stages.map((s, i) => `<div class="step ${i < o.stage ? 'done' : ''} ${i === o.stage ? 'cur' : ''}">${s}</div>`).join('')}</div>
        </div>`).join('')}</div>`;
    } else {
      body = `<div class="card tw"><table><thead><tr><th>SKU</th><th>Item</th><th>Location</th><th class="num">In stock</th><th class="num">Minimum</th><th>Status</th></tr></thead><tbody>
      ${D.stock.map(s => `<tr><td>${s.sku}</td><td><strong>${s.name}</strong></td><td>${s.loc}</td><td class="num">${s.qty}</td><td class="num">${s.min}</td><td>${s.qty < s.min ? pill('Reorder', 'bad') : pill('OK', 'ok')}</td></tr>`).join('')}</tbody></table></div>`;
    }
    return `<div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${state.procTab === k ? 'on' : ''}" data-act="proctab" data-k="${k}">${l}</button>`).join('')}</div>${body}`;
  };

  views.engineering = () => `
    <div class="bar"><span class="muted">Drag and drop arrives in the full build.</span><button class="btn primary sm" data-act="toast" data-m="New project form is part of the full build">New project</button></div>
    <div class="kan">${D.kanban.map(c => `
      <div class="kcol"><h3>${c.col}<span class="muted">${c.cards.length}</span></h3>
      ${c.cards.map(k => `<div class="kcard"><b>${k.t}</b><span class="m">${k.who}</span><div style="display:flex;justify-content:space-between;gap:6px;align-items:center">${pill(k.tag, 'info')}<span class="m">${k.due}</span></div></div>`).join('')}
      </div>`).join('')}</div>`;

  // ---------- invoice modal ----------
  function invoiceHTML(no) {
    const inv = D.invoices.find(i => i.no === no);
    let lines;
    if (no === 'INV-1050') lines = D.invoiceLines;
    else {
      const sub = inv.amt / 1.075;
      lines = [{ d: 'Supply and services, per purchase order', q: 1, p: Math.round(sub * 0.8) }, { d: 'Inspection, freight and handling', q: 1, p: Math.round(sub * 0.2) }];
    }
    const sub = lines.reduce((a, l) => a + l.q * l.p, 0), vat = sub * 0.075;
    return `
      <div class="inv-h"><div class="brand-chip" style="padding:0;min-height:0">${brand}</div><div style="text-align:right"><h2>INVOICE</h2><div class="muted">${inv.no}</div>${st(inv.status)}</div></div>
      <div class="inv-meta">
        <div><b>Billed to</b>${inv.client}<br><span class="muted">Port Harcourt, Nigeria</span></div>
        <div><b>Dates</b>Issued: ${inv.issued}<br>Due: ${inv.due}</div>
      </div>
      <div class="tw"><table><thead><tr><th>Description</th><th class="num">Qty</th><th class="num hide-s">Unit price</th><th class="num">Amount</th></tr></thead><tbody>
      ${lines.map(l => `<tr><td>${l.d}</td><td class="num">${l.q}</td><td class="num hide-s">${fmt(l.p, inv.cur)}</td><td class="num">${fmt(l.q * l.p, inv.cur)}</td></tr>`).join('')}</tbody></table></div>
      <div class="tot"><div><span>Subtotal</span><span>${fmt(sub, inv.cur)}</span></div><div><span>VAT 7.5%</span><span>${fmt(vat, inv.cur)}</span></div><div class="gt"><span>Total</span><span>${fmt(sub + vat, inv.cur)}</span></div></div>
      <p class="muted small" style="margin-top:20px">Sample bank details: Sample Bank PLC · Account 0000000000 · Matong Energy LTD, KM 5 Refinery Road, Warri. This is a preview invoice with invented figures.</p>
      <div class="noprint" style="display:flex;gap:8px;margin-top:10px"><button class="btn primary" onclick="window.print()">Print or save as PDF</button><button class="btn" data-act="toast" data-m="Emailing invoices is part of the full build">Email to client</button></div>`;
  }

  // ---------- shell ----------
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#0d2a3c;color:#fff;padding:12px 18px;border-radius:10px;z-index:50;font-weight:500;max-width:90vw'; document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => (t.hidden = true), 2400);
  }

  function renderNav(cur) {
    let last = undefined, html = '';
    ROUTES.forEach(r => {
      if (r.g !== last && r.g) html += `<div class="grp">${r.g}</div>`;
      last = r.g;
      html += `<a href="#${r.k}" class="${r.k === cur ? 'on' : ''}"><span class="ic">${r.i}</span>${r.l}</a>`;
    });
    $('#nav').innerHTML = html;
  }

  function route() {
    const k = (location.hash || '#dashboard').slice(1);
    const r = ROUTES.find(x => x.k === k) || ROUTES[0];
    renderNav(r.k);
    $('#pageTitle').textContent = r.l;
    $('#view').innerHTML = views[r.k]();
    $('#search').value = '';
    $('#side').classList.remove('open'); $('#scrim').classList.remove('show');
    window.scrollTo(0, 0);
  }

  function rerender() { const s = $('#search').value; $('#view').innerHTML = views[(ROUTES.find(x => x.k === (location.hash || '#dashboard').slice(1)) || ROUTES[0]).k](); $('#search').value = s; filter(); }
  function filter() {
    const q = $('#search').value.trim().toLowerCase();
    $$('#view tbody tr, #view .job, #view .order, #view .kcard').forEach(el => (el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none'));
  }

  function enter() {
    $('#login').hidden = true; $('#app').hidden = false;
    try { sessionStorage.setItem('in', '1'); } catch (e) {}
    if (!location.hash) location.hash = '#dashboard';
    route();
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const a = b.dataset.act;
    if (a === 'hrtab') { state.hrTab = b.dataset.k; rerender(); }
    else if (a === 'ledger') { state.ledger = b.dataset.k; rerender(); }
    else if (a === 'proctab') { state.procTab = b.dataset.k; rerender(); }
    else if (a === 'intab') { state.inTab = b.dataset.k; rerender(); }
    else if (a === 'leave') { D.leave.find(l => l.id == b.dataset.id).status = b.dataset.v; toast('Leave request ' + b.dataset.v.toLowerCase()); rerender(); }
    else if (a === 'remind') toast('Reminder sent to ' + b.dataset.who);
    else if (a === 'toast') toast(b.dataset.m);
    else if (a === 'invoice') { $('#modalBody').innerHTML = invoiceHTML(b.dataset.no); $('#modal').hidden = false; }
  });

  $('#modalClose').onclick = () => ($('#modal').hidden = true);
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#modal').hidden = true; });
  $('#search').addEventListener('input', filter);
  $('#menu').onclick = () => { $('#side').classList.add('open'); $('#scrim').classList.add('show'); };
  $('#scrim').onclick = () => { $('#side').classList.remove('open'); $('#scrim').classList.remove('show'); };
  $('#loginForm').addEventListener('submit', e => { e.preventDefault(); enter(); });
  $('#logout').onclick = () => { try { sessionStorage.removeItem('in'); } catch (e) {} $('#app').hidden = true; $('#login').hidden = false; };
  window.addEventListener('hashchange', () => { if (!$('#app').hidden) route(); });

  let signedIn = false;
  try { signedIn = sessionStorage.getItem('in') === '1'; } catch (e) {}
  if (signedIn) enter(); else $('#login').hidden = false;
})();
