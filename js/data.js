// Global State
let adRole = 'student';
let requests = []; 
let groups = [];
let chatPartner = null;
let chatHistory = [];
let currentUser = null;
let selectedGroupMembers = [];
let tInterval = null;
let selMentor = null;

// Users Database
let users = [
    { name: "Pavan Kumar", user: "pavan", pass: "pavan", role: "student", email: "pavan@cbit.org.in" },
    { name: "Swathi Tejah", user: "swathi", pass: "swathi", role: "staff", email: "swathi@cbit.ac.in" }
];

// Academic Data
const ACADEMIC_DATA = {
    tt: [
        { day: "Monday", slots: ["09:10 - BDA (L-102)", "11:10 - ML (L-104)", "13:10 - Ethics"] },
        { day: "Tuesday", slots: ["10:10 - Security (L-201)", "13:10 - Project"] },
        { day: "Wednesday", slots: ["09:10 - BDA (L-104)", "11:10 - ML (L-102)", "14:10 - Lab"] },
        { day: "Thursday", slots: ["11:10 - Security (L-201)", "15:10 - Sports"] },
        { day: "Friday", slots: ["09:10 - Soft Skills", "11:10 - Hub"] }
    ],
    att: [
        { sub: "Machine Learning", p: "89%" }, 
        { sub: "Big Data Analytics", p: "94%" }, 
        { sub: "Cyber Security", p: "72%" }
    ],
    tasks: [
        { t: "Analysis of BDA", d: "Sep 15", s: "PENDING" }
    ]
};

// Screens HTML Collection
const SCREENS = {
    onboard1: `
        <div class="screen active" id="onboard1" style="background: var(--lavender-bg);">
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:25px; position:relative; z-index:10;">
                <h1 style="text-align:center;">Welcome to<br>CBIT Connect</h1>
                <div style="font-size:120px;">🛸</div>
            </div>
            <button class="btn btn-pill btn-outline" style="position:relative; z-index:100;" onclick="window.navigateTo('onboard2')">Get Started</button>
        </div>
    `,
    onboard2: `
        <div class="screen" id="onboard2" style="background: var(--yellow-accent);">
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:25px;">
                <h1 style="text-align:center;">Stay Up to date<br>with Campus Life</h1>
                <div style="font-size:120px;">😴</div>
            </div>
            <button class="btn btn-pill btn-outline" onclick="window.navigateTo('onboard3')">Next</button>
        </div>
    `,
    onboard3: `
        <div class="screen" id="onboard3" style="background: var(--lavender-bg);">
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:25px;">
                <h1 style="text-align:center;">Go To Place<br>to Learn</h1>
                <div style="font-size:120px;">✨</div>
            </div>
            <button class="btn btn-pill btn-outline" onclick="window.navigateTo('sc-role')">Next</button>
        </div>
    `,
    'sc-role': `
        <div class="screen" id="sc-role" style="background: var(--lavender-bg);">
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px;">
                <h1>Let's Get Started</h1>
                <div style="font-size:120px;">🎨</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:15px; margin-bottom:20px;">
                <button class="btn btn-pill btn-yellow" onclick="window.navigateTo('sc-login-student')">Student Portal</button>
                <button class="btn btn-pill btn-white" onclick="window.navigateTo('sc-login-staff')">Faculty Portal</button>
                <button class="btn btn-pill btn-outline" style="border:1px dashed #000;" onclick="window.navigateTo('sc-login-admin')">Administrator</button>
            </div>
        </div>
    `,
    'sc-login-student': `
        <div class="screen dark-theme" id="sc-login-student">
            <h1 style="margin-top:60px;">Welcome,<br>CBITian</h1>
            <div style="margin-top:50px;">
                <input type="text" id="in-st-user" class="ios-input" placeholder="Roll Number">
                <input type="password" id="in-st-pass" class="ios-input" placeholder="Password">
                <button class="btn btn-pill btn-yellow" style="margin-top:30px;" onclick="window.auth('student')">Login</button>
                <button class="btn btn-pill btn-outline" style="margin-top:15px;" onclick="window.navigateTo('sc-role')">Back</button>
            </div>
        </div>
    `,
    'sc-login-staff': `
        <div class="screen dark-theme" id="sc-login-staff">
            <h1 style="margin-top:60px;">Welcome,<br>Faculty Team!</h1>
            <div style="margin-top:50px;">
                <input type="text" id="in-fa-user" class="ios-input" placeholder="Faculty ID">
                <input type="password" id="in-fa-pass" class="ios-input" placeholder="Password">
                <button class="btn btn-pill btn-yellow" style="margin-top:30px;" onclick="window.auth('staff')">Login</button>
                <button class="btn btn-pill btn-outline" style="margin-top:15px;" onclick="window.navigateTo('sc-role')">Back</button>
            </div>
        </div>
    `,
    'sc-login-admin': `
        <div class="screen dark-theme" id="sc-login-admin">
            <h1>Admin Auth</h1>
            <div style="margin-top:40px; display:flex; flex-direction:column; gap:16px;">
                <input type="text" id="in-ad-user" class="ios-input" placeholder="admin">
                <input type="password" id="in-ad-pass" class="ios-input" placeholder="admin123">
                <button class="btn btn-pill btn-yellow" onclick="window.auth('admin')">Unlock DB</button>
            </div>
        </div>
    `,
    'sc-admin': `
        <div class="screen dark-theme" id="sc-admin">
            <h2>Institutional Control</h2>
            <div class="card" style="margin-top:20px;">
                <h3>Provision New Account</h3>
                <input type="text" id="ad-name" class="ios-input" placeholder="Full Legal Name">
                <input type="text" id="ad-user" class="ios-input" placeholder="Identifier">
                <input type="password" id="ad-pass" class="ios-input" placeholder="Password">
                <div style="display:flex; gap:12px; margin-bottom:20px;">
                    <button class="btn btn-primary btn-pill" id="ad-role-st" onclick="window.setAdRole('student')" style="flex:1;"><i class="fa-solid fa-user-graduate"></i> Student</button>
                    <button class="btn btn-pill btn-outline" id="ad-role-fa" onclick="window.setAdRole('staff')" style="flex:1; border-color:rgba(255,255,255,0.3);"><i class="fa-solid fa-chalkboard-user"></i> Staff</button>
                </div>
                <button class="btn btn-pill btn-white" onclick="window.adminCreate()">Commit Account</button>
            </div>
            <div id="ad-user-list"></div>
            <button class="btn btn-pill btn-outline" onclick="window.logout()">Terminate Session</button>
        </div>
    `,
    'sc-st-home': `
    <div class="screen dark-theme" id="sc-st-home">
        <div class="official-header">
            <div class="pfp-box" onclick="window.tab('profile')" id="st-avatar-badge">PK</div>
            <div style="flex:1"><h2 id="st-user-name">Loading...</h2><p id="st-user-roll-sub" style="font-size:11px; opacity:0.6;">Loading...</p></div>
            <i class="fa-regular fa-bell" style="font-size:20px; padding:10px; cursor:pointer;" onclick="window.showModal('CBIT Alerts','System check complete. No new academic alerts.')"></i>
            <i class="fa-solid fa-ellipsis-vertical" style="font-size:20px; padding:10px; cursor:pointer;" onclick="window.toggleLogoutMenu(event, 'dropdown-st-h')"></i>
            <div class="dropdown-menu" id="dropdown-st-h">
                <div class="dropdown-item" onclick="window.tab('profile')"><i class="fa-solid fa-user-gear"></i> Profile</div>
                <div class="dropdown-item danger" onclick="window.logout()"><i class="fa-solid fa-power-off"></i> Logout</div>
            </div>
        </div>
        
        <div class="card card-accent" onclick="window.navigateTo('sc-st-att')" style="cursor:pointer;">
            <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:800;">
                <span>Attendance Audit</span>
                <span id="st-date-today">---</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:10px;">
                <p style="margin:0; font-size:13px; opacity:0.8;">Analyze institutional progress.</p>
                <div class="att-circle">87%</div>
            </div>
        </div>
        
        <div class="card" onclick="window.navigateTo('sc-st-tt')" style="background:#fff; color:#000; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>Today's Routine</h3>
                <span class="btn-black" style="padding:4px 12px; font-size:11px; border-radius:12px;">VIEW ALL</span>
            </div>
            <div id="st-home-tt-container" style="margin-top:10px;"></div>
        </div>
        
        <div class="features-grid">
            <div class="feature-box" onclick="window.handleStGateNav()">
                <i class="fa-solid fa-id-card"></i>
                <span>GatePass</span>
            </div>
            <div class="feature-box" onclick="window.navigateTo('sc-st-assign')">
                <i class="fa-solid fa-file-invoice"></i>
                <span>Courses</span>
            </div>
            <div class="feature-box" onclick="window.tab('talks')">
                <i class="fa-solid fa-comments"></i>
                <span>Talks</span>
            </div>
            <div class="feature-box" onclick="window.showModal('Buzz Feed','Academic orientation dates updated.')">
                <i class="fa-solid fa-bullhorn"></i>
                <span>Buzz feed</span>
            </div>
        </div>
    </div>
`,
    'sc-fa-home': `
        <div class="screen dark-theme" id="sc-fa-home">
            <div class="official-header">
                <div class="pfp-box" onclick="window.tab('profile')" id="fa-avatar-badge">ST</div>
                <div style="flex:1"><h2 id="fa-user-email-header">---</h2><p style="font-size:11px; opacity:0.6;">Senior Faculty Member</p></div>
                <i class="fa-regular fa-bell" style="font-size:20px; padding:10px; cursor:pointer;" onclick="window.showModal('Faculty Hub','System synchronized. Check clearance queue.')"></i>
                <i class="fa-solid fa-ellipsis-vertical" style="font-size:20px; padding:10px; cursor:pointer;" onclick="window.toggleLogoutMenu(event, 'dropdown-fa-h')"></i>
                <div class="dropdown-menu" id="dropdown-fa-h">
                    <div class="dropdown-item" onclick="window.tab('profile')"><i class="fa-solid fa-id-card-clip"></i> Profile</div>
                    <div class="dropdown-item danger" onclick="window.logout()"><i class="fa-solid fa-power-off"></i> Logout</div>
                </div>
            </div>
            <div class="card card-green" id="fa-home-status-msg" style="margin-bottom:10px;">"Timeline synced."</div>
            <div id="fa-home-tt-container" style="margin-bottom: 20px;"></div>
            <div class="features-grid">
                <div class="feature-box" onclick="window.handleFaGateNav()"><i class="fa-solid fa-clipboard-user"></i><span>Verify Pass</span></div>
                <div class="feature-box" onclick="window.navigateTo('sc-fa-classes')"><i class="fa-solid fa-users-viewfinder"></i><span>Class Hub</span></div>
                <div class="feature-box" onclick="window.tab('talks')"><i class="fa-solid fa-comments"></i><span>Talks</span></div>
                <div class="feature-box" onclick="window.navigateTo('sc-fa-schedule-assign')"><i class="fa-solid fa-plus"></i><span>Post Task</span></div>
            </div>
            <div id="fa-req-list"></div>
        </div>
    `,
    'sc-chat-list': `
        <div class="screen dark-theme" id="sc-chat-list">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2>Institutional Talks</h2>
                <button class="btn btn-pill btn-primary" style="width:auto; padding:8px 15px; font-size:12px;" onclick="window.navigateToGroupCreator()"><i class="fa-solid fa-users-viewfinder"></i> New Group</button>
            </div>
            <div class="ios-input" style="padding: 12px 18px; display:flex; align-items:center; gap:12px; background:#1C1C1E; color:#999; border: 1px solid #333; border-radius:15px;">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>Search institutional directory...</span>
            </div>
            <div id="chat-directory-list" style="display:flex; flex-direction:column; gap:8px; margin-top:20px;"></div>
        </div>
    `,
    'sc-create-group': `
        <div class="screen dark-theme" id="sc-create-group">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-chat-list')"></i>
                <h2>New Group</h2>
            </div>
            <input type="text" id="group-name-input" class="ios-input" placeholder="Group Name">
            <p style="font-size:11px; font-weight:800; color:var(--text-sec); margin:10px 0;">SELECT MEMBERS</p>
            <div id="group-member-selector" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:8px;"></div>
            <button class="btn btn-pill btn-primary" style="margin-top:20px;" onclick="window.commitGroup()">Create Group</button>
        </div>
    `,
    'sc-chat-detail': `
        <div class="screen dark-theme" id="sc-chat-detail" style="padding:0; background: #0b141a;">
            <div style="padding: 15px 20px; display:flex; align-items:center; gap:12px; background: #202c33; z-index:10; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fa-solid fa-chevron-left" style="font-size:20px; cursor:pointer;" onclick="window.navigateTo('sc-chat-list')"></i>
                <div class="pfp-box" style="width:42px; height:42px;" id="chat-header-avatar" onclick="window.viewChatPartnerProfile()">?</div>
                <div style="flex:1" onclick="window.viewChatPartnerProfile()">
                    <h3 id="chat-header-name" style="font-size:16px; margin:0;">---</h3>
                    <p id="chat-status-text" style="font-size:11px; color:rgba(255,255,255,0.6); margin:0;">online</p>
                </div>
                <div style="display:flex; gap:20px; color: #8696a0;">
                    <i class="fa-solid fa-video"></i>
                    <i class="fa-solid fa-phone"></i>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div id="chat-messages-container" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; scrollbar-width:none; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); background-blend-mode: overlay; background-color: #0b141a; background-size: 50%;"></div>
            <div class="chat-input-area">
                <div class="chat-input-container">
                    <i class="fa-regular fa-face-smile"></i>
                    <input type="text" id="msg-input" class="chat-input" placeholder="Message..." oninput="window.toggleSendIcon()">
                    <i class="fa-solid fa-paperclip"></i>
                    <i class="fa-solid fa-camera"></i>
                </div>
                <button class="send-btn" id="chat-action-btn" onclick="window.sendMessage()">
                    <i class="fa-solid fa-microphone" id="btn-icon"></i>
                </button>
            </div>
        </div>
    `,
    'sc-profile-student': `
        <div class="screen dark-theme" id="sc-profile-student">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <i class="fa-solid fa-chevron-left" onclick="window.navigateTo('sc-st-home')"></i>
                <h2>Verified ID</h2>
                <i class="fa-solid fa-ellipsis-vertical" style="font-size:20px; padding:10px; cursor:pointer;" onclick="window.toggleLogoutMenu(event, 'dropdown-st')"></i>
                <div class="dropdown-menu" id="dropdown-st"><div class="dropdown-item danger" onclick="window.logout()"><i class="fa-solid fa-power-off"></i> Logout</div></div>
            </div>
            <div style="text-align:center; margin-top:20px;">
                <div class="pfp-lg" id="p-avatar-lg-st">PK</div>
                <h1 id="p-name-st">---</h1>
                <p id="p-uid-st" style="color:var(--primary); font-weight:800; letter-spacing:1px; margin-bottom:5px;">---</p>
                <div style="background:rgba(52,199,89,0.1); color:var(--success-green); display:inline-block; padding:4px 12px; border-radius:10px; font-size:10px; font-weight:900;"><i class="fa-solid fa-circle-check"></i> INSTITUTIONAL VERIFIED</div>
            </div>
            <p style="font-size:10px; font-weight:800; color:var(--text-sec); margin:25px 0 10px; text-transform:uppercase;">Academic Audit</p>
            <div class="stats-grid">
                <div class="stat-card"><b>8.74</b><span>CGPA</span></div>
                <div class="stat-card"><b>124</b><span>Credits</span></div>
                <div class="stat-card"><b>7th</b><span>Sem</span></div>
            </div>
            <div class="detail-list">
                <div class="detail-item"><span>Email</span><b id="p-email-st">---</b></div>
                <div class="detail-item"><span>Department</span><b>AI & Data Science</b></div>
            </div>
        </div>
    `,
    'sc-profile-staff': `
        <div class="screen dark-theme" id="sc-profile-staff">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <i class="fa-solid fa-chevron-left" onclick="window.navigateTo('sc-fa-home')"></i>
                <h2>Faculty Profile</h2>
                <i class="fa-solid fa-ellipsis-vertical" style="font-size:20px; padding:10px; cursor:pointer;" onclick="window.toggleLogoutMenu(event, 'dropdown-fa')"></i>
                <div class="dropdown-menu" id="dropdown-fa"><div class="dropdown-item danger" onclick="window.logout()"><i class="fa-solid fa-power-off"></i> Logout</div></div>
            </div>
            <div style="display:flex; gap:20px; margin-top:30px; align-items:center;">
                <div class="pfp-lg" style="margin:0; width:85px; height:85px;" id="p-avatar-lg-fa">ST</div>
                <div style="flex:1;"><h2 id="p-name-fa">---</h2><p id="p-email-fa" style="font-size:12px; opacity:0.6;">---</p></div>
            </div>
            <div class="stats-grid">
                <div class="stat-card"><b>14+</b><span>Research</span></div>
                <div class="stat-card"><b>600+</b><span>Students</span></div>
                <div class="stat-card"><b>12Y</b><span>Exp.</span></div>
            </div>
            <div class="tab-bar"><span class="tab-item active">About</span><span class="tab-item">Office</span></div>
            <div class="card card-dark" style="border:none; padding:15px; background:rgba(255,255,255,0.03); font-size:13px; opacity:0.8;">Institutional departmental mentor specializing in AI and Data Systems.</div>
        </div>
    `,
    'sc-st-att': `
        <div class="screen dark-theme" id="sc-st-att">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-st-home')"></i>
                <h2>Subject Audit</h2>
            </div>
            <div id="st-att-list"></div>
        </div>
    `,
    'sc-st-tt': `
        <div class="screen dark-theme" id="sc-st-tt">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-st-home')"></i>
                <h2>Full Schedule</h2>
            </div>
            <div id="st-tt-list"></div>
        </div>
    `,
    'sc-st-assign': `
        <div class="screen dark-theme" id="sc-st-assign">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-st-home')"></i>
                <h2>Academic Tasks</h2>
            </div>
            <div id="st-assign-list"></div>
        </div>
    `,
    'sc-fa-classes': `
        <div class="screen dark-theme" id="sc-fa-classes">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-fa-home')"></i>
                <h2>Section Hub</h2>
            </div>
            <div class="card" onclick="window.showModal('Sync','Updating records...')"><h3>Roll Access</h3></div>
            <div class="card"><h3>Analytics</h3></div>
        </div>
    `,
    'sc-fa-schedule-assign': `
        <div class="screen dark-theme" id="sc-fa-schedule-assign">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-fa-home')"></i>
                <h2>Post Task</h2>
            </div>
            <input type="text" class="ios-input" placeholder="Title">
            <button class="btn btn-pill btn-white" onclick="window.showModal('Broadcasted','Sent to section timeline.')">Commit</button>
        </div>
    `,
    'sc-st-gate-form': `
        <div class="screen dark-theme" id="sc-st-gate-form">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:30px;">
                <i class="fa-solid fa-arrow-left" onclick="window.navigateTo('sc-st-home')"></i>
                <h2>Gate Clearance</h2>
            </div>
            <div class="card card-dark" style="background:#000; border:1px solid #333;">
                <label style="font-size:10px; font-weight:800; color:#8E8E93;">NAME</label>
                <p id="gp-name-display" style="margin-bottom:15px; font-weight:700;">---</p>
                <label style="font-size:10px; font-weight:800; color:#8E8E93;">ROLL NO</label>
                <p id="gp-roll-display" style="margin-bottom:15px; font-weight:700;">---</p>
                <input type="text" id="gp-reason" class="ios-input ios-input-dark" placeholder="Official Reason">
                <label style="font-size:10px; font-weight:800; color:#8E8E93; margin-bottom:10px; display:block;">SELECT MENTOR</label>
                <div id="mentor-list" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; margin-top:15px;"></div>
                <button class="btn btn-pill btn-white" onclick="window.submitGate()">Generate Request</button>
            </div>
        </div>
    `,
    'sc-gate-qr': `
        <div class="screen dark-theme" id="sc-gate-qr">
            <h1 style="text-align:center; margin-top:30px;">Pass</h1>
            <div class="secure-exit-card">
                <div class="qr-container" id="qr-code-box"></div>
                <div class="timer-display" id="cd-timer">40:00</div>
            </div>
        </div>
    `
};

// Initialize screens
document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('viewport');
    if (viewport) {
        viewport.innerHTML = Object.values(SCREENS).join('');
    }
});