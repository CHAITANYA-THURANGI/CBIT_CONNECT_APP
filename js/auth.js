// Student Data Initialization
function initStudentData() {
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
            `<div style="background:rgba(0,0,0,0.03); padding:10px; border-radius:12px; margin-bottom:5px; font-weight:700; font-size:12px;">${s}</div>`
        ).join('') : `<div style="font-size:12px; opacity:0.6; padding:10px;">Free Day.</div>`;
    }
    
    const attL = document.getElementById('st-att-list'); 
    if(attL) attL.innerHTML = ACADEMIC_DATA.att.map(a => 
        `<div class="card" style="display:flex; justify-content:space-between;"><span>${a.sub}</span><b>${a.p}</b></div>`
    ).join('');
    
    const ttL = document.getElementById('st-tt-list'); 
    if(ttL) ttL.innerHTML = ACADEMIC_DATA.tt.map(d => 
        `<div class="card"><h3>${d.day}</h3>` + d.slots.map(s => 
            `<div class="tt-row">${s}</div>`
        ).join('') + `</div>`
    ).join('');
    
    const taskL = document.getElementById('st-assign-list'); 
    if(taskL) taskL.innerHTML = ACADEMIC_DATA.tasks.map(t => 
        `<div class="card" style="display:flex; justify-content:space-between;"><b>${t.t}</b><span>${t.d}</span></div>`
    ).join('');
}

// Staff Data Initialization
function initStaffData() {
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
            sM.innerText = "Timeline"; 
            hTt.innerHTML = ttObj.slots.map(s => 
                `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:12px; margin-bottom:5px; font-size:12px; font-weight:700;">${s}</div>`
            ).join(''); 
        } else { 
            sM.innerText = '"No more lectures scheduled today."'; 
            hTt.innerHTML = ''; 
        }
    }
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

function showProfileExplicit(target) { 
    if (target.role === 'student') { 
        navigateTo('sc-profile-student'); 
        document.getElementById('p-name-st').innerText = target.name; 
        document.getElementById('p-uid-st').innerText = target.user; 
        document.getElementById('p-email-st').innerText = target.email; 
        document.getElementById('p-avatar-lg-st').innerText = target.name[0]; 
    } else { 
        navigateTo('sc-profile-staff'); 
        document.getElementById('p-name-fa').innerText = target.name; 
        document.getElementById('p-email-fa').innerText = target.email; 
        document.getElementById('p-avatar-lg-fa').innerText = target.name[0]; 
    } 
}