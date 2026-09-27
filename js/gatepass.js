// Make gate pass functions globally available
window.handleStGateNav = handleStGateNav;
window.handleFaGateNav = handleFaGateNav;
window.submitGate = submitGate;
window.faAct = faAct;

function renderMentors() { 
    const l = document.getElementById('mentor-list'); 
    if(!l) return; 
    l.innerHTML = ''; 
    
    users.filter(u => u.role === 'staff').forEach(s => { 
        const b = document.createElement('div'); 
        b.style = "padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:12px; cursor:pointer; font-size:12px; font-weight:700; color:white;"; 
        b.innerText = s.name; 
        b.onclick = () => { 
            document.querySelectorAll('#mentor-list div').forEach(x => x.style.background='rgba(255,255,255,0.1)'); 
            b.style.background='var(--primary)'; 
            selMentor = s; 
        }; 
        l.appendChild(b); 
    }); 
}

function handleStGateNav() { 
    if(!currentUser) return;
    
    const r = requests.find(r => r.stId === currentUser.user && r.status !== 'denied'); 
    if (!r) { 
        navigateTo('sc-st-gate-form'); 
        document.getElementById('gp-name-display').innerText = currentUser.name; 
        document.getElementById('gp-roll-display').innerText = currentUser.user; 
        renderMentors(); 
    } else {
        renderStGateStatus(r); 
    }
}

function startTimer() { 
    if (tInterval) clearInterval(tInterval); 
    let s = 40 * 60; 
    tInterval = setInterval(() => { 
        s--; 
        const m=Math.floor(s/60), sc=s%60; 
        const el=document.getElementById('cd-timer'); 
        if(el) el.innerText=`${m.toString().padStart(2,'0')}:${sc.toString().padStart(2,'0')}`; 
    }, 1000); 
}

function renderStGateStatus(req) { 
    if (req.status === 'pending') {
        navigateTo('sc-st-home'); 
        showModal('Pending','Verifying identity...'); 
    } else { 
        navigateTo('sc-gate-qr'); 
        const box = document.getElementById('qr-code-box'); 
        if(box) { 
            box.innerHTML = ''; 
            new QRCode(box, { text: `AUTH-${req.stId}`, width: 160, height: 160 }); 
        } 
        startTimer(); 
    } 
}

function submitGate() { 
    if(!selMentor) return alert("Select mentor."); 
    
    requests.push({ 
        id: Date.now(), 
        stId: currentUser.user, 
        stName: currentUser.name, 
        mUser: selMentor.user, 
        mentor: selMentor.name, 
        status: 'pending', 
        reason: "Institutional Leave" 
    }); 
    
    handleStGateNav(); 
}

function handleFaGateNav() { 
    renderFaReqs(); 
    navigateTo('sc-fa-home'); 
}

function renderFaReqs() { 
    const l = document.getElementById('fa-req-list'); 
    if(!l) return; 
    
    const pending = requests.filter(r => r.mUser === currentUser.user && r.status === 'pending'); 
    l.innerHTML = pending.length ? '<h3 style="margin:20px 0 10px; color:white;">Clearance Queue</h3>' : ''; 
    
    pending.forEach(r => { 
        l.innerHTML += `<div class="card card-dark"><h3>${r.stName}</h3><p style="font-size:12px; opacity:0.6;">Leave Authorization Request</p><button class="btn btn-white" style="margin-top:10px; padding:12px; font-size:13px;" onclick="window.faAct(${r.id}, 'approved')">Approve Pass</button></div>`; 
    }); 
}

function faAct(id, s) { 
    const r = requests.find(x => x.id === id); 
    if(r) r.status = s; 
    renderFaReqs(); 
    showModal('Success','Exit Authorized.'); 
}