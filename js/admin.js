// Make admin functions globally available
window.setAdRole = setAdRole;
window.adminCreate = adminCreate;
window.renderAdList = renderAdList;

function setAdRole(r) { 
    adRole = r; 
    const stBtn = document.getElementById('ad-role-st');
    const faBtn = document.getElementById('ad-role-fa');
    
    if (r === 'student') { 
        stBtn.className = "btn btn-primary btn-pill"; 
        faBtn.className = "btn btn-pill btn-outline"; 
        faBtn.style.borderColor = "rgba(255,255,255,0.3)"; 
    } else { 
        faBtn.className = "btn btn-primary btn-pill"; 
        stBtn.className = "btn btn-pill btn-outline"; 
        stBtn.style.borderColor = "rgba(255,255,255,0.3)"; 
    }
}

function adminCreate() { 
    const n = document.getElementById('ad-name').value, 
          u = document.getElementById('ad-user').value, 
          p = document.getElementById('ad-pass').value; 
          
    if(!n || !u || !p) return alert("Fill data."); 
    
    users.push({ 
        name: n, 
        user: u, 
        pass: p, 
        role: adRole, 
        email: adRole==='student'?`${u}@cbit.org.in`:`${u}@cbit.ac.in` 
    }); 
    
    renderAdList(); 
    showModal('Success','Account provisioned.'); 
    
    document.getElementById('ad-name').value=''; 
    document.getElementById('ad-user').value=''; 
    document.getElementById('ad-pass').value=''; 
}

function renderAdList() { 
    const l = document.getElementById('ad-user-list'); 
    if(!l) return; 
    
    l.innerHTML = '<h3 style="margin-top:20px; font-size:12px; opacity:0.5; color:white;">INSTITUTIONAL RECORDS</h3>'; 
    
    users.forEach(u => l.innerHTML += 
        `<div class="card card-dark" style="padding:10px; font-size:12px; display:flex; align-items-center;">
            <i class="fa-solid fa-${u.role==='student'?'user-graduate':(u.role==='staff'?'chalkboard-user':'shield-halved')}" style="margin-right:15px; color:var(--primary);"></i>
            <b>${u.name}</b>
        </div>` 
    ); 
}