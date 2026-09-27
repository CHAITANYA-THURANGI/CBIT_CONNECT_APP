// Make chat functions globally available
window.openChat = openChat;
window.sendMessage = sendMessage;
window.toggleSendIcon = toggleSendIcon;
window.navigateToGroupCreator = navigateToGroupCreator;
window.commitGroup = commitGroup;
window.viewChatPartnerProfile = viewChatPartnerProfile;

// Chat Functions
function renderChatList() {
    const l = document.getElementById('chat-directory-list'); 
    if(!l) return; 
    l.innerHTML = '';
    
    groups.filter(g => g.members.includes(currentUser.user)).forEach(g => {
        const item = document.createElement('div'); 
        item.className = 'card card-dark'; 
        item.style = "display:flex; align-items:center; gap:15px; padding:15px;";
        item.onclick = () => openChat(g, true);
        item.innerHTML = `<div class="pfp-box" style="background:var(--primary-grad); color:white; border:none;">${g.name[0]}</div><div style="flex:1"><h4 style="margin:0;">${g.name}</h4><p style="margin:0; font-size:11px; opacity:0.6;">Academic Group</p></div><i class="fa-solid fa-users"></i>`;
        l.appendChild(item);
    });
    
    users.filter(u => u.user !== currentUser.user && u.role !== 'admin').forEach(u => {
        const item = document.createElement('div'); 
        item.className = 'card card-dark'; 
        item.style = "display:flex; align-items:center; gap:15px; padding:15px;";
        item.onclick = () => openChat(u, false);
        item.innerHTML = `<div class="pfp-box">${u.name[0]}<div class="online-indicator"></div></div><div style="flex:1"><h4 style="margin:0;">${u.name}</h4><p style="margin:0; font-size:11px; opacity:0.6;">Verified Member</p></div>`;
        l.appendChild(item);
    });
}

function openChat(p, isGroup) { 
    chatPartner = { ...p, isGroup }; 
    document.getElementById('chat-header-name').innerText = p.name; 
    document.getElementById('chat-header-avatar').innerText = p.name[0]; 
    renderMessages(); 
    navigateTo('sc-chat-detail'); 
}

function toggleSendIcon() { 
    const i = document.getElementById('msg-input'); 
    const ic = document.getElementById('btn-icon'); 
    if(ic) ic.className = i.value.trim() !== "" ? "fa-solid fa-paper-plane" : "fa-solid fa-microphone"; 
}

function sendMessage() {
    const i = document.getElementById('msg-input'); 
    const t = i ? i.value.trim() : null; 
    if(!t) return;
    
    chatHistory.push({ 
        from: currentUser.user, 
        fromName: currentUser.name, 
        to: chatPartner.user || chatPartner.id, 
        text: t, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        isGroup: chatPartner.isGroup 
    });
    
    i.value = ''; 
    toggleSendIcon(); 
    renderMessages();
}

function renderMessages() {
    const c = document.getElementById('chat-messages-container'); 
    if(!c) return; 
    c.innerHTML = '';
    
    const targetId = chatPartner.isGroup ? (chatPartner.user || chatPartner.id) : chatPartner.user;
    
    chatHistory.filter(m => chatPartner.isGroup ? m.to === targetId : 
        (m.from === currentUser.user && m.to === targetId) || (m.from === targetId && m.to === currentUser.user)
    ).forEach(m => {
        const d = document.createElement('div'); 
        d.className = `chat-bubble ${m.from === currentUser.user ? 'sent' : 'received'}`;
        let h = ''; 
        if(chatPartner.isGroup && m.from !== currentUser.user) h += `<span class="sender-label">${m.fromName}</span>`;
        h += `${m.text} <div class="chat-meta"><span>${m.time}</span>${m.from === currentUser.user ? '<i class="fa-solid fa-check-double"></i>' : ''}</div>`;
        d.innerHTML = h; 
        c.appendChild(d);
    });
    
    c.scrollTop = c.scrollHeight;
}

function navigateToGroupCreator() {
    const l = document.getElementById('group-member-selector'); 
    if(!l) return; 
    l.innerHTML = ''; 
    selectedGroupMembers = [];
    
    users.filter(u => u.user !== currentUser.user && u.role !== 'admin').forEach(u => {
        const item = document.createElement('div'); 
        item.className = 'member-select';
        item.innerHTML = `<div class="pfp-box" style="width:35px; height:35px;">${u.name[0]}</div><span>${u.name}</span>`;
        item.onclick = () => { 
            item.classList.toggle('selected'); 
            if(item.classList.contains('selected')) selectedGroupMembers.push(u.user); 
            else selectedGroupMembers = selectedGroupMembers.filter(id => id !== u.user); 
        };
        l.appendChild(item);
    });
    
    navigateTo('sc-create-group');
}

function commitGroup() { 
    const nameE = document.getElementById('group-name-input'); 
    const name = nameE.value; 
    if(!name || selectedGroupMembers.length === 0) return alert("Select members."); 
    
    groups.push({ 
        id: 'grp_'+Date.now(), 
        name, 
        user: 'grp_'+Date.now(), 
        members: [...selectedGroupMembers, currentUser.user] 
    }); 
    
    nameE.value = ''; 
    selectedGroupMembers = []; 
    renderChatList(); 
    navigateTo('sc-chat-list'); 
}

function viewChatPartnerProfile() { 
    if(chatPartner && !chatPartner.isGroup) { 
        let target = users.find(u => u.user === chatPartner.user); 
        if(target) showProfileExplicit(target); 
    } 
}