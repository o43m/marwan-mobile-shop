const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Load data
let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

function saveData() {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

function getHTML(title, dir = 'rtl') {
  return (content) => `<!DOCTYPE html>
<html dir="${dir}" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - مكتب مروان</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;direction:rtl;color:#333}
    .navbar{background:linear-gradient(135deg,#003d99 0%,#1a5bb8 100%);color:#fff;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 8px rgba(0,61,153,.2)}
    .navbar h1{font-size:1.5rem}.nav-links{display:flex;gap:1.5rem}.nav-links a{color:#fff;text-decoration:none;transition:color .3s}.nav-links a:hover{color:#e0f0ff}
    .container{max-width:1200px;margin:0 auto;padding:2rem}.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:2rem;margin:2rem 0}
    .product-card{background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;transition:transform .3s,box-shadow .3s;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .product-card:hover{transform:translateY(-5px);box-shadow:0 4px 16px rgba(0,61,153,.15)}.product-image{width:100%;height:200px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999}
    .product-info{padding:1rem}.product-name{font-weight:bold;margin-bottom:.5rem}.product-price{color:#003d99;font-size:1.2rem;font-weight:bold}
    .offer-badge{background:#ff6b6b;color:#fff;padding:.25rem .5rem;border-radius:4px;font-size:.85rem}
    .btn{padding:.75rem 1.5rem;background:#003d99;color:#fff;border:none;border-radius:4px;cursor:pointer;transition:background .3s}
    .btn:hover{background:#1a5bb8}.form-group{margin:1rem 0}.form-group label{display:block;margin-bottom:.5rem;font-weight:500}
    .form-group input,.form-group textarea,.form-group select{width:100%;padding:.75rem;border:1px solid #ddd;border-radius:4px;font-size:1rem}
    .form-group textarea{resize:vertical;min-height:100px}.categories{display:flex;gap:1rem;margin:1.5rem 0;flex-wrap:wrap}
    .category-btn{padding:.5rem 1rem;background:#e0e0e0;border:none;border-radius:4px;cursor:pointer;transition:all .3s}
    .category-btn.active{background:#003d99;color:#fff}.search-box{margin:1rem 0;display:flex;gap:.5rem}
    .search-box input{flex:1;padding:.75rem;border:1px solid #ddd;border-radius:4px}
    .header-section{background:linear-gradient(135deg,#e8f0ff 0%,#f0f8ff 100%);padding:3rem 0;border-bottom:2px solid #003d99}
    .offers-section{background:#fff8f0;padding:2rem;border-radius:8px;margin:2rem 0;border-left:4px solid #ff6b6b}
    .footer{background:#003d99;color:#fff;padding:2rem;margin-top:3rem;text-align:center}
    .admin-section{background:#fff;padding:2rem;margin:1rem 0;border:1px solid #ddd;border-radius:8px}
    .table{width:100%;border-collapse:collapse;margin:1rem 0}.table th,.table td{padding:1rem;text-align:right;border-bottom:1px solid #ddd}
    .table th{background:#003d99;color:#fff}.table tr:hover{background:#f9f9f9}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1rem 0}
    .stat-card{background:linear-gradient(135deg,#003d99 0%,#1a5bb8 100%);color:#fff;padding:1.5rem;border-radius:8px;text-align:center}
    .stat-card h3{font-size:2rem;margin:.5rem 0}.stat-card p{font-size:.9rem;opacity:.9}
    @media(max-width:768px){.products-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}.navbar{flex-direction:column;gap:1rem}.nav-links{flex-wrap:wrap;gap:1rem}.container{padding:1rem}}
  </style>
</head>
<body>
  <div class="navbar">
    <h1>🏪 مكتب مروان الخزعلي</h1>
    <div class="nav-links">
      <a href="/">الرئيسية</a>
      <a href="/shop">المتجر</a>
      <a href="/cart">السلة</a>
      <a href="/reservations">الحجوزات</a>
      <a href="/maintenance">الصيانة</a>
      <a href="/installments">التقسيط</a>
      <a href="/contact">التواصل</a>
      <a href="/account">حسابي</a>
      <a href="/admin">الإدارة</a>
    </div>
  </div>
  ${content}
  <div class="footer">
    <p>© 2026 مكتب مروان الخزعلي للموبايلات. جميع الحقوق محفوظة</p>
    <p>الهاتف: +966 50 XXXX XXXX | البريد: info@marwan.com</p>
  </div>
</body>
</html>`;
}

const routes = {
  '/': (req, res) => {
    const offers = data.products.filter(p => p.offer > 0);
    const html = getHTML('الرئيسية')(`
      <div class="header-section">
        <div class="container">
          <h2>أهلا وسهلا بك في مكتب مروان الخزعلي للموبايلات</h2>
          <p>أفضل الأسعار وأجودة الخدمة منذ 2010</p>
        </div>
      </div>
      <div class="container">
        <div class="offers-section">
          <h3>🎉 عروض خاصة اليوم</h3>
          <div class="products-grid">
            ${offers.map(p => `
              <div class="product-card">
                <div class="product-image">صورة</div>
                <div class="product-info">
                  <div class="product-name">${p.nameAr}</div>
                  <div>${p.description}</div>
                  <div style="margin-top:.5rem;"><span class="offer-badge">خصم ${p.offer}%</span></div>
                  <div class="product-price" style="margin-top:.5rem;">${Math.round(p.price * (1 - p.offer/100))} ر.س</div>
                  <button class="btn" style="width:100%;margin-top:.5rem;">اشتري الآن</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="stats">
          <div class="stat-card"><h3>${data.products.length}</h3><p>منتج</p></div>
          <div class="stat-card"><h3>${data.orders.length}</h3><p>طلب</p></div>
          <div class="stat-card"><h3>${data.users.length - 1}</h3><p>عميل</p></div>
          <div class="stat-card"><h3>4.6⭐</h3><p>التقييم</p></div>
        </div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/shop': (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const category = parsedUrl.query.category || '';
    const search = parsedUrl.query.search || '';
    let products = data.products;
    if (category) products = products.filter(p => p.category === category);
    if (search) products = products.filter(p => p.nameAr.includes(search) || p.name.includes(search));
    
    const html = getHTML('المتجر')(`
      <div class="container">
        <h2>متجرنا</h2>
        <div class="search-box">
          <input type="text" id="search" placeholder="ابحث..." value="${search}">
          <button class="btn" onclick="document.location='/shop?search='+document.getElementById('search').value">بحث</button>
        </div>
        <div class="categories">
          <a href="/shop" style="text-decoration:none;"><button class="category-btn ${!category ? 'active' : ''}">الكل</button></a>
          ${data.categories.map(c => `<a href="/shop?category=${c.id}" style="text-decoration:none;"><button class="category-btn ${category === c.id ? 'active' : ''}">${c.nameAr}</button></a>`).join('')}
        </div>
        <div class="products-grid">
          ${products.map(p => `
            <div class="product-card">
              <div class="product-image">صورة</div>
              <div class="product-info">
                <div class="product-name">${p.nameAr}</div>
                <div style="font-size:.9rem;color:#666;">${p.description}</div>
                ${p.offer > 0 ? `<span class="offer-badge">خصم ${p.offer}%</span>` : ''}
                <div class="product-price">${Math.round(p.price * (1 - p.offer/100))} ر.س</div>
                <button class="btn" style="width:100%;margin-top:.5rem;" onclick="addToCart(${p.id})">السلة</button>
                <a href="/product/${p.id}" style="text-decoration:none;"><button class="btn" style="width:100%;margin-top:.5rem;background:#666;">التفاصيل</button></a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <script>function addToCart(id){let cart=JSON.parse(localStorage.getItem('cart')||'[]');let item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});localStorage.setItem('cart',JSON.stringify(cart));alert('تمت الإضافة')}</script>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/product': (req, res) => {
    const id = parseInt(req.url.split('/')[2]);
    const product = data.products.find(p => p.id === id);
    if (!product) {
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(getHTML('غير موجود')('<div class="container"><p>المنتج غير موجود</p></div>'));
      return;
    }
    const html = getHTML(product.nameAr)(`
      <div class="container">
        <a href="/shop" style="color:#003d99;margin:1rem 0;display:inline-block;">← العودة</a>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:2rem 0;">
          <div class="product-image" style="height:400px;border-radius:8px;border:1px solid #ddd;">صورة</div>
          <div>
            <h2>${product.nameAr}</h2>
            <div style="color:#666;margin:1rem 0;">${product.description}</div>
            <div style="font-size:1.5rem;font-weight:bold;color:#003d99;margin:1rem 0;">
              ${product.offer > 0 ? `<span style="text-decoration:line-through;color:#999;">${product.price}</span> ${Math.round(product.price * (1 - product.offer/100))} ر.س<span class="offer-badge" style="margin-right:1rem;">خصم ${product.offer}%</span>` : `${product.price} ر.س`}
            </div>
            <div style="margin:1rem 0;"><strong>⭐ ${product.rating}</strong> (${product.reviews})</div>
            <div style="margin:1rem 0;"><strong>المتوفر:</strong> ${product.stock > 0 ? product.stock : 'غير متوفر'}</div>
            <button class="btn" style="width:100%;padding:1rem;font-size:1.1rem;margin:1rem 0;" onclick="addToCart(${product.id})">السلة 🛒</button>
          </div>
        </div>
      </div>
      <script>function addToCart(id){let cart=JSON.parse(localStorage.getItem('cart')||'[]');let item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});localStorage.setItem('cart',JSON.stringify(cart));alert('تمت الإضافة')}</script>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/cart': (req, res) => {
    const html = getHTML('السلة')(`
      <div class="container">
        <h2>سلة التسوق</h2>
        <div id="cart"></div>
      </div>
      <script>
        function loadCart(){let cart=JSON.parse(localStorage.getItem('cart')||'[]');let products=${JSON.stringify(data.products)};let html=cart.length?cart.map(item=>{const p=products.find(x=>x.id===item.id);const price=Math.round(p.price*(1-p.offer/100));return '<div style="padding:1rem;border-bottom:1px solid #ddd;"><strong>'+p.nameAr+'</strong> - '+price+'×'+item.qty+'='+(price*item.qty)+'<button onclick="removeFromCart('+item.id+')" class="btn" style="margin:0.5rem 0;">حذف</button></div>'}).join(''):'<p>السلة فارغة</p>';document.getElementById('cart').innerHTML=html}
        function removeFromCart(id){let cart=JSON.parse(localStorage.getItem('cart')||'[]');cart=cart.filter(i=>i.id!==id);localStorage.setItem('cart',JSON.stringify(cart));loadCart()}
        loadCart()
      </script>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/reservations': (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const params = new URLSearchParams(body);
        data.reservations.push({id: data.reservations.length + 1, customerName: params.get('name'), phone: params.get('phone'), device: params.get('device'), date: params.get('date'), status: 'pending', createdAt: new Date().toISOString()});
        saveData();
        res.writeHead(302, {'Location': '/reservations'});
        res.end();
      });
      return;
    }
    const html = getHTML('الحجوزات')(`
      <div class="container">
        <h2>حجز جهاز</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
          <form method="POST" style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <div class="form-group"><label>الاسم</label><input type="text" name="name" required></div>
            <div class="form-group"><label>الهاتف</label><input type="tel" name="phone" required></div>
            <div class="form-group"><label>الجهاز</label><select name="device" required><option value="">اختر</option>${data.products.filter(p=>p.category==='phones').map(p=>`<option value="${p.nameAr}">${p.nameAr}</option>`).join('')}</select></div>
            <div class="form-group"><label>التاريخ</label><input type="date" name="date" required></div>
            <button type="submit" class="btn" style="width:100%;padding:1rem;">احجز</button>
          </form>
          <div>${data.reservations.map(r=>`<div class="admin-section"><strong>${r.customerName}</strong><br/>📱 ${r.device}<br/>📅 ${r.date}<br/>📞 ${r.phone}</div>`).join('')}</div>
        </div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/maintenance': (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const params = new URLSearchParams(body);
        data.maintenanceRequests.push({id: data.maintenanceRequests.length + 1, customerName: params.get('name'), phone: params.get('phone'), device: params.get('device'), issue: params.get('issue'), status: 'pending', createdAt: new Date().toISOString()});
        saveData();
        res.writeHead(302, {'Location': '/maintenance'});
        res.end();
      });
      return;
    }
    const html = getHTML('الصيانة')(`
      <div class="container">
        <h2>خدمة الصيانة</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
          <form method="POST" style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <div class="form-group"><label>الاسم</label><input type="text" name="name" required></div>
            <div class="form-group"><label>الهاتف</label><input type="tel" name="phone" required></div>
            <div class="form-group"><label>الجهاز</label><input type="text" name="device" required></div>
            <div class="form-group"><label>المشكلة</label><textarea name="issue" required></textarea></div>
            <button type="submit" class="btn" style="width:100%;padding:1rem;">أرسل</button>
          </form>
          <div>${data.maintenanceRequests.map(m=>`<div class="admin-section"><strong>${m.customerName}</strong><br/>📱 ${m.device}<br/>⚠️ ${m.issue}<br/>📞 ${m.phone}</div>`).join('')}</div>
        </div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/installments': (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const params = new URLSearchParams(body);
        const totalPrice = parseInt(params.get('totalPrice'));
        const months = parseInt(params.get('months'));
        data.installments.push({id: data.installments.length + 1, customerName: params.get('name'), phone: params.get('phone'), device: params.get('device'), totalPrice: totalPrice, monthlyPayment: Math.round(totalPrice / months * 100) / 100, months: months, paidMonths: 0, status: 'active', createdAt: new Date().toISOString()});
        saveData();
        res.writeHead(302, {'Location': '/installments'});
        res.end();
      });
      return;
    }
    const html = getHTML('التقسيط')(`
      <div class="container">
        <h2>برنامج التقسيط</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
          <form method="POST" style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <div class="form-group"><label>الاسم</label><input type="text" name="name" required></div>
            <div class="form-group"><label>الهاتف</label><input type="tel" name="phone" required></div>
            <div class="form-group"><label>الجهاز</label><input type="text" name="device" required></div>
            <div class="form-group"><label>السعر الإجمالي</label><input type="number" name="totalPrice" required></div>
            <div class="form-group"><label>الأشهر</label><select name="months" required><option>3</option><option>6</option><option>9</option><option>12</option></select></div>
            <button type="submit" class="btn" style="width:100%;padding:1rem;">طلب</button>
          </form>
          <div>${data.installments.map(i=>`<div class="admin-section"><strong>${i.customerName}</strong><br/>📱 ${i.device}<br/>💰 ${i.monthlyPayment} × ${i.months} = ${i.totalPrice}<br/>✓ ${i.paidMonths}/${i.months}</div>`).join('')}</div>
        </div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/contact': (req, res) => {
    const html = getHTML('التواصل')(`
      <div class="container">
        <h2>تواصل معنا</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
          <div style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <h3>📍 العنوان</h3>
            <p>شارع التجارة، حي الخليج<br/>الرياض</p>
            <h3 style="margin-top:1rem;">📞 الهاتف</h3>
            <p><a href="tel:+966501234567" style="color:#003d99;">+966 50 123 4567</a></p>
            <h3 style="margin-top:1rem;">📧 البريد</h3>
            <p><a href="mailto:info@marwan.com" style="color:#003d99;">info@marwan.com</a></p>
          </div>
          <form style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <div class="form-group"><label>الاسم</label><input type="text" required></div>
            <div class="form-group"><label>البريد</label><input type="email" required></div>
            <div class="form-group"><label>الموضوع</label><input type="text" required></div>
            <div class="form-group"><label>الرسالة</label><textarea required></textarea></div>
            <button type="submit" class="btn" style="width:100%;padding:1rem;">أرسل</button>
          </form>
        </div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/account': (req, res) => {
    const html = getHTML('حسابي')(`
      <div class="container">
        <h2>حسابي</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
          <form style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <h3>دخول</h3>
            <div class="form-group"><label>البريد</label><input type="email" required></div>
            <div class="form-group"><label>كلمة المرور</label><input type="password" required></div>
            <button type="submit" class="btn" style="width:100%;padding:1rem;">دخول</button>
          </form>
          <form style="background:#f9f9f9;padding:2rem;border-radius:8px;">
            <h3>حساب جديد</h3>
            <div class="form-group"><label>الاسم</label><input type="text" required></div>
            <div class="form-group"><label>البريد</label><input type="email" required></div>
            <div class="form-group"><label>الهاتف</label><input type="tel" required></div>
            <div class="form-group"><label>كلمة المرور</label><input type="password" required></div>
            <button type="submit" class="btn" style="width:100%;padding:1rem;">إنشاء</button>
          </form>
        </div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/admin': (req, res) => {
    const totalRevenue = data.orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const html = getHTML('الإدارة')(`
      <div class="container">
        <h2>🔧 لوحة التحكم</h2>
        <div class="stats">
          <div class="stat-card"><h3>${data.products.length}</h3><p>منتجات</p></div>
          <div class="stat-card"><h3>${data.orders.length}</h3><p>طلبات</p></div>
          <div class="stat-card"><h3>${totalRevenue} ر.س</h3><p>إيرادات</p></div>
          <div class="stat-card"><h3>${data.users.filter(u=>u.type==='customer').length}</h3><p>عملاء</p></div>
        </div>
        <h3 style="margin-top:2rem;">📦 المنتجات</h3>
        <div class="admin-section"><table class="table"><thead><tr><th>المنتج</th><th>السعر</th><th>المتوفر</th><th>التقييم</th></tr></thead><tbody>${data.products.slice(0,5).map(p=>`<tr><td>${p.nameAr}</td><td>${p.price}</td><td>${p.stock}</td><td>⭐ ${p.rating}</td></tr>`).join('')}</tbody></table></div>
        <h3>🛒 الطلبات</h3>
        <div class="admin-section"><table class="table"><thead><tr><th>رقم</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>${data.orders.map(o=>`<tr><td>#${o.id}</td><td>${o.customerEmail}</td><td>${o.totalPrice}</td><td>${o.status}</td></tr>`).join('')}</tbody></table></div>
        <h3>📋 الحجوزات</h3>
        <div class="admin-section"><table class="table"><thead><tr><th>العميل</th><th>الجهاز</th><th>الحالة</th></tr></thead><tbody>${data.reservations.map(r=>`<tr><td>${r.customerName}</td><td>${r.device}</td><td>${r.status}</td></tr>`).join('')}</tbody></table></div>
        <h3>🔧 الصيانة</h3>
        <div class="admin-section"><table class="table"><thead><tr><th>العميل</th><th>الجهاز</th><th>المشكلة</th><th>الحالة</th></tr></thead><tbody>${data.maintenanceRequests.map(m=>`<tr><td>${m.customerName}</td><td>${m.device}</td><td>${m.issue}</td><td>${m.status}</td></tr>`).join('')}</tbody></table></div>
        <h3>💰 التقسيط</h3>
        <div class="admin-section"><table class="table"><thead><tr><th>العميل</th><th>الجهاز</th><th>المبلغ</th><th>الدفع الشهري</th><th>التقدم</th></tr></thead><tbody>${data.installments.map(i=>`<tr><td>${i.customerName}</td><td>${i.device}</td><td>${i.totalPrice}</td><td>${i.monthlyPayment}</td><td>${i.paidMonths}/${i.months}</td></tr>`).join('')}</tbody></table></div>
        <h3>👥 المستخدمون</h3>
        <div class="admin-section"><table class="table"><thead><tr><th>الاسم</th><th>البريد</th><th>النوع</th></tr></thead><tbody>${data.users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.type}</td></tr>`).join('')}</tbody></table></div>
      </div>
    `);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  },

  '/health': (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'ok', timestamp: new Date().toISOString()}));
  }
};

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
if (pathname === '/') {
  const html = fs.readFileSync('index.html', 'utf8');
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end(html);
  return;
}
  if (routes[pathname]) {
    routes[pathname](req, res);
  } else if (pathname.startsWith('/product/')) {
    routes['/product'](req, res);
  } else {
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(getHTML('غير موجود')('<div class="container"><p>الصفحة غير موجودة</p></div>'));
  }
});

server.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

