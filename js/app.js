// Make functions globally available
window.navigateTo = navigateTo;
window.tab = tab;
window.auth = auth;
window.logout = logout;
window.showModal = showModal;
window.closeDropdowns = closeDropdowns;
window.toggleLogoutMenu = toggleLogoutMenu;

// UI Helpers
function showModal(t, b) {
    const toast = document.getElementById('g-toast');
    const title = document.getElementById('t-title');
    const body = document.getElementById('t-body');
    if(toast && title && body) {
        title.innerText = t; 
        body.innerText = b; 
        toast.style.display = 'flex';
        setTimeout(() => { 
            toast.style.display = 'none'; 
            title.innerText = ''; 
            body.innerText = ''; 
        }, 3000);
    }
}

function navigateTo(id) {
    const s = document.getElementById(id); 
    if (!s) {
        console.error('Screen not found:', id);
        return;
    }
    
    // Remove active class from all screens
    document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
    s.classList.add('active');
    
    // Update dark mode class on app frame
    const frame = document.getElementById('main-frame');
    frame.className = s.classList.contains('dark-theme') ? 'app-frame dark-mode' : 'app-frame';
    
    // Hide bottom nav on onboarding, login, and admin screens
    const hideNavScreens = [
        'onboard1', 
        'onboard2', 
        'onboard3', 
        'sc-role', 
        'sc-login-student', 
        'sc-login-staff', 
        'sc-login-admin',
        'sc-admin'  // Add this to hide nav on admin page
    ];
    
    const nav = document.getElementById('app-nav');
    if (nav) {
        nav.style.display = hideNavScreens.includes(id) ? 'none' : 'flex';
    }
    
    console.log('Navigated to:', id, 'Nav display:', nav.style.display);
}

function toggleLogoutMenu(e, id) { 
    e.stopPropagation(); 
    const m = document.getElementById(id); 
    const v = m.style.display === 'block'; 
    closeDropdowns(); 
    if(!v) m.style.display = 'block'; 
}

function closeDropdowns() { 
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none'); 
}

// Authentication
function auth(role) {
    const uIn = document.getElementById(role === 'student' ? 'in-st-user' : (role === 'staff' ? 'in-fa-user' : 'in-ad-user')).value;
    const pIn = document.getElementById(role === 'student' ? 'in-st-pass' : (role === 'staff' ? 'in-fa-pass' : 'in-ad-pass')).value;
    
    if (role === 'admin' && uIn === 'admin' && pIn === 'admin123') { 
        currentUser = { role: "admin", name: "Admin", user: 'admin' }; 
        renderAdList(); 
        navigateTo('sc-admin'); 
        return; 
    }
    
    const u = users.find(x => x.user === uIn && x.pass === pIn && x.role === role);
    if (u) { 
        currentUser = u; 
        console.log('Login successful for:', currentUser);
        
        if (role === 'student') {
            initStudentData(); 
            navigateTo('sc-st-home'); 
        } else if (role === 'staff') {
            initStaffData(); 
            renderFaReqs(); 
            navigateTo('sc-fa-home'); 
        }
        showModal('Verified','Login Success.'); 
    } else {
        alert("Invalid credentials.");
    }
}

function logout() { 
    currentUser = null; 
    closeDropdowns(); 
    navigateTo('sc-role'); 
}

// Tab Navigation
function tab(type, el) {
    if (!currentUser) {
        navigateTo('sc-role');
        return;
    }
    
    // Don't allow tab navigation for admin
    if (currentUser.role === 'admin') {
        showModal('Admin Mode', 'Please use the admin controls');
        return;
    }
    
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if(el) el.classList.add('active'); 
    else { 
        let tp = document.getElementById('tab-profile-m'); 
        if(tp) tp.classList.add('active'); 
    }
    
    if (type === 'home') {
        navigateTo(currentUser.role === 'student' ? 'sc-st-home' : 'sc-fa-home');
    }
    if (type === 'gatepass') { 
        if (currentUser.role === 'staff') handleFaGateNav(); 
        else handleStGateNav(); 
    }
    if (type === 'talks') { 
        renderChatList(); 
        navigateTo('sc-chat-list'); 
    }
    if (type === 'profile') showProfile();
}

// Time Update
setInterval(() => { 
    const n = new Date(); 
    const cl = document.getElementById('time-clock'); 
    if(cl) cl.innerText = n.getHours().toString().padStart(2,'0') + ":" + n.getMinutes().toString().padStart(2,'0'); 
}, 1000);

// Student Data Initialization
function initStudentData() {
    setTimeout(() => {
        const nE = document.getElementById('st-user-name'); 
        if(nE) nE.innerText = currentUser.name;
        
        const rS = document.getElementById('st-user-roll-sub'); 
        if(rS) rS.innerText = "Roll: " + currentUser.user;
        
        const bE = document.getElementById('st-avatar-badge'); 
        if(bE) bE.innerText = currentUser.name.split(' ').map(n => n[0]).join('');
        
        const dtE = document.getElementById('st-date-today'); 
        if(dtE) dtE.innerText = new Date().toLocaleDateString('en-GB');
        
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const ttObj = ACADEMIC_DATA.tt.find(t => t.day === day);
        const hTt = document.getElementById('st-home-tt-container');
        
        if(hTt) {
            hTt.innerHTML = ttObj ? ttObj.slots.map(s => 
                `<div style="background:rgba(0,122,255,0.1); padding:10px; border-radius:12px; margin-bottom:5px; font-weight:700; font-size:12px; color:var(--primary);">${s}</div>`
            ).join('') : `<div style="font-size:12px; opacity:0.6; padding:10px;">Free Day.</div>`;
        }
        
        // Initialize attendance list
        const attL = document.getElementById('st-att-list');
        if(attL) {
            attL.innerHTML = ACADEMIC_DATA.att.map(a => 
                `<div class="card" style="display:flex; justify-content:space-between; align-items:center; background: var(--dark-card);">
                    <span style="color: white;">${a.sub}</span>
                    <b style="color: var(--success);">${a.p}</b>
                </div>`
            ).join('');
        }
        
        // Initialize timetable list
        const ttL = document.getElementById('st-tt-list');
        if(ttL) {
            ttL.innerHTML = ACADEMIC_DATA.tt.map(d => 
                `<div class="card" style="background: var(--dark-card);">
                    <h3 style="color: var(--primary); margin-bottom:10px;">${d.day}</h3>
                    ${d.slots.map(s => `<div style="padding:8px 0; border-bottom:1px solid var(--dark-border); color: white;">${s}</div>`).join('')}
                </div>`
            ).join('');
        }
        
        // Initialize tasks list
        const taskL = document.getElementById('st-assign-list');
        if(taskL) {
            taskL.innerHTML = ACADEMIC_DATA.tasks.map(t => 
                `<div class="card" style="display:flex; justify-content:space-between; align-items:center; background: var(--dark-card);">
                    <b style="color: white;">${t.t}</b>
                    <span style="color: var(--warning);">${t.d}</span>
                </div>`
            ).join('');
        }
    }, 100);
}

// Staff Data Initialization
function initStaffData() {
    setTimeout(() => {
        const eH = document.getElementById('fa-user-email-header'); 
        if(eH) eH.innerText = currentUser.email;
        
        const bE = document.getElementById('fa-avatar-badge'); 
        if(bE) bE.innerText = currentUser.name.split(' ').map(n => n[0]).join('');
        
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const ttObj = ACADEMIC_DATA.tt.find(t => t.day === day);
        const hTt = document.getElementById('fa-home-tt-container');
        const sM = document.getElementById('fa-home-status-msg');
        
        if(hTt && sM) {
            if(ttObj) { 
                sM.innerText = "Today's Schedule"; 
                hTt.innerHTML = ttObj.slots.map(s => 
                    `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:12px; margin-bottom:5px; font-size:12px; font-weight:700; color:var(--primary);">${s}</div>`
                ).join(''); 
            } else { 
                sM.innerText = 'No lectures scheduled today'; 
                hTt.innerHTML = ''; 
            }
        }
    }, 100);
}

// Profile Display
function showProfile() {
    const t = currentUser;
    if (t.role === 'student') { 
        navigateTo('sc-profile-student'); 
        document.getElementById('p-name-st').innerText = t.name; 
        document.getElementById('p-uid-st').innerText = t.user; 
        document.getElementById('p-email-st').innerText = t.email; 
        document.getElementById('p-avatar-lg-st').innerText = t.name.split(' ').map(n => n[0]).join(''); 
    } else if (t.role === 'staff') { 
        navigateTo('sc-profile-staff'); 
        document.getElementById('p-name-fa').innerText = t.name; 
        document.getElementById('p-email-fa').innerText = t.email; 
        document.getElementById('p-avatar-lg-fa').innerText = t.name.split(' ').map(n => n[0]).join(''); 
    }
}