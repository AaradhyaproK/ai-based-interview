



// ==================================
// Configuration Constants
// ==================================

// --- Firebase Configuration ---
// !!! --- CRITICAL SECURITY WARNING --- !!!
// Using hardcoded keys client-side is insecure for production.
// Use backend functions or secure environment variables.
const firebaseConfig = {
    apiKey: "AIzaSyAvb4xyFo_R8KW2WH3V9YcBBv4eeDoPEx8", // Replace
    authDomain: "fir-ai-interview.firebaseapp.com",
    projectId: "fir-ai-interview",
    storageBucket: "fir-ai-interview.appspot.com",
    messagingSenderId: "1062000559385",
    appId: "1:1062000559385:web:acc0e5815f3c9433eeb188",
    measurementId: "G-GYPNPES5RL"
};

// --- Gemini Configuration ---
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
// !!! --- CRITICAL SECURITY WARNING --- !!!
const GEMINI_API_KEY = 'AIzaSyDdzdinlqXV0rQhB8BW0zoTaaGZD0ts_8o'; // Replace
const NUM_QUESTIONS = 5;

// --- Cloudinary Configuration ---
const CLOUDINARY_CLOUD_NAME = "dfp563ini"; // Replace
const VIDEO_CLOUDINARY_UPLOAD_PRESET = "Ai-interview"; // Replace
const VIDEO_CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
const RESUME_CLOUDINARY_UPLOAD_PRESET = "Ai-interview"; // Replace - VERIFY UNSIGNED
const RESUME_CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// --- Resume Configuration (Images) ---
const MAX_RESUME_SIZE_MB = 5;
const ALLOWED_RESUME_TYPES = ['image/jpeg', 'image/png'];

// --- Interview Timer Configuration ---
const AUTO_START_DELAY_MS = 2000; // 2 seconds delay before recording starts
const QUESTION_TIME_LIMIT_MS = 2 * 60 * 1000; // 2 minutes in milliseconds

// ==================================
// Firebase Initialization
// ==================================
let auth, db, storage; // Declare service variables

try {
    // Basic Check for valid config structure and API key format
    if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.apiKey.startsWith("AIza") || firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY") {
        throw new Error("Firebase config missing, invalid, or using placeholder values.");
    }
    // Initialize Firebase only if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized.");
    } else {
        firebase.app(); // Get default app if already initialized
        console.log("Firebase Already Initialized.");
    }

    // Get Firebase services if initialization was successful
    if (firebase.app()) {
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage(); // For potential future use
        console.log("Firebase services obtained.");
    } else {
        throw new Error("Firebase app object not available after init attempt.");
    }

} catch (e) {
    console.error("Firebase initialization critical error:", e);
    // Display a critical error message to the user if Firebase fails
    document.body.innerHTML = `<div class="error-message container" style="padding: 30px;">CRITICAL ERROR: Could not initialize Firebase. Check configuration and console. ${e.message}</div>`;
    // Prevent further script execution if Firebase core fails
    throw new Error("Halting execution due to Firebase initialization failure.");
}

// ==================================
// DOM Element References
// ==================================
// (Ensure these IDs match your index.html)

// --- Auth Elements ---
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const signupFullnameInput = document.getElementById('signup-fullname');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupExperienceInput = document.getElementById('signup-experience');
const signupRoleSelect = document.getElementById('signup-role');
const signupPhoneGroup = document.getElementById('signup-phone-group');
const signupPhoneInput = document.getElementById('signup-phone');
const signupBtn = document.getElementById('signup-btn');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const resetEmailInput = document.getElementById('reset-email-input');
const resetPasswordBtn = document.getElementById('reset-password-btn');
const backToLoginLink = document.getElementById('back-to-login-link');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');
const authError = document.getElementById('auth-error');
const authMessage = document.getElementById('auth-message');

// --- User Info Header ---
const userInfoSection = document.getElementById('user-info');
const userFullnameSpan = document.getElementById('user-fullname');
const userEmailSpan = document.getElementById('user-email');
const userRoleSpan = document.getElementById('user-role');
const userExperienceSpan = document.getElementById('user-experience');
const userPhoneDisplay = document.getElementById('user-phone-display');
const userPhoneSpan = document.getElementById('user-phone');
const logoutBtn = document.getElementById('logout-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');

// --- Edit Profile Section ---
const editProfileSection = document.getElementById('edit-profile-section');
const editProfileForm = document.getElementById('edit-profile-form');
const editFullnameInput = document.getElementById('edit-fullname');
const editExperienceInput = document.getElementById('edit-experience');
const editPhoneGroup = document.getElementById('edit-phone-group');
const editPhoneInput = document.getElementById('edit-phone');
const saveProfileBtn = document.getElementById('save-profile-btn');
const cancelEditProfileBtn = document.getElementById('cancel-edit-profile-btn');
const editProfileMsg = document.getElementById('edit-profile-msg');

// --- Recruiter Dashboard ---
const recruiterDashboard = document.getElementById('recruiter-dashboard');
const postJobSection = document.getElementById('post-job-section');
const postJobSectionTitle = document.getElementById('post-job-section-title');
const jobTitleInput = document.getElementById('job-title');
const jobCompanyNameInput = document.getElementById('job-company-name');
const jobQualificationsInput = document.getElementById('job-qualifications');
const jobDeadlineInput = document.getElementById('job-deadline');
const jobDescriptionInput = document.getElementById('job-description');
const postJobBtn = document.getElementById('post-job-btn');
const postJobMsg = document.getElementById('post-job-msg');
const cancelEditJobBtn = document.getElementById('cancel-edit-job-btn');
const recruiterJobsList = document.getElementById('recruiter-jobs-list');
const candidatesList = document.getElementById('candidates-list');
const selectedJobTitleRecruiter = document.getElementById('selected-job-title-recruiter');
const manageCandidatesList = document.getElementById('manage-candidates-list');
const manageCandidatesMsg = document.getElementById('manage-candidates-msg');

// --- Candidate Dashboard ---
const candidateDashboard = document.getElementById('candidate-dashboard');
const availableJobsList = document.getElementById('available-jobs-list');
const myInterviewsList = document.getElementById('my-interviews-list');

// --- Resume Upload Section Elements ---
const resumeUploadSection = document.getElementById('resume-upload-section');
const resumePromptJobTitle = document.getElementById('resume-prompt-job-title');
const resumeUploadJobIdInput = document.getElementById('resume-upload-job-id');
const interviewResumeInput = document.getElementById('interview-resume-input');
const interviewResumeStatus = document.getElementById('interview-resume-status');
const uploadResumeAndStartBtn = document.getElementById('upload-resume-and-start-btn');
const cancelInterviewStartBtn = document.getElementById('cancel-interview-start-btn');
const resumeUploadError = document.getElementById('resume-upload-error');

// --- Interview Section Elements ---
const interviewSection = document.getElementById('interview-section');
const interviewJobTitleSpan = document.getElementById('interview-job-title');
const interviewLoading = document.getElementById('interview-loading');
const interviewError = document.getElementById('interview-error');
const interviewQAArea = document.getElementById('interview-qa-area');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const videoArea = document.getElementById('video-area');
const webcamFeed = document.getElementById('webcam-feed');
const startRecordingBtn = document.getElementById('start-recording-btn');
const stopRecordingBtn = document.getElementById('stop-recording-btn');
const recordingStatusSpan = document.getElementById('recording-status');
const questionTimerDisplay = document.getElementById('question-timer-display');
const nextQuestionBtn = document.getElementById('next-question-btn');
const finishInterviewBtn = document.getElementById('finish-interview-btn');
const sttSimulationNote = document.getElementById('stt-simulation-note');
const loadingAnswer = document.getElementById('loading-answer');
const exitRealInterviewBtn = document.getElementById('exit-real-interview-btn');

// --- Report Section Elements ---
const reportSection = document.getElementById('report-section');
const reportJobTitleSpan = document.getElementById('report-job-title');
const reportCandidateEmailSpan = document.getElementById('report-candidate-email');
const reportStatusSpan = document.getElementById('report-status');
const reportResumeLinkArea = document.getElementById('report-resume-link-area');
const reportResumeLink = document.getElementById('report-resume-link');
const feedbackContent = document.getElementById('feedback-content');
const loadingFeedback = document.getElementById('loading-feedback');
const errorFeedback = document.getElementById('error-feedback');
const reportContent = document.getElementById('report-content'); // Q&A display area
const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
const recruiterStatusUpdateDiv = document.getElementById('recruiter-status-update');
const updateStatusSelect = document.getElementById('update-status-select');
const statusNotesInput = document.getElementById('status-notes');
const updateStatusBtn = document.getElementById('update-status-btn');
const updateStatusMsg = document.getElementById('update-status-msg');

// --- Global Load/Error ---
const mainContent = document.getElementById('main-content');
const globalLoading = document.getElementById('global-loading');
const globalError = document.getElementById('global-error');


// ==================================
// State Variables
// ==================================
let currentUser = null;                     // Firebase auth user object
let currentUserData = null;                 // User data from Firestore { fullname, email, role, experience, phone?, accountStatus?, createdAt, updatedAt? }
let currentInterviewState = {               // State for the active interview process
    jobId: null,
    jobTitle: null,
    jobDescription: null,
    candidateResumeURL: null,
    candidateResumeMimeType: null,
    questions: [],
    answers: [],
    videoURLs: [],
    currentQuestionIndex: 0,
};
let selectedInterviewForReport = null;      // Holds data of the interview being viewed in report
let editingJobId = null;                    // ID of the job currently being edited by recruiter
// Media Recorder State
let mediaStream = null;                     // User's webcam/mic stream
let mediaRecorder = null;                   // MediaRecorder instance
let recordedChunks = [];                    // Array for recorded video chunks
let isRecording = false;                    // Flag if recording active
// Timer State
let autoStartTimerId = null;                // Timeout ID for pre-recording delay
let questionTimerId = null;                 // Timeout ID for question time limit
let questionTimerIntervalId = null;         // Interval ID for countdown display


// ==================================
// Utility Functions
// ==================================

/** Shows or hides the global loading overlay */
function showGlobalLoading(isLoading) {
    if (globalLoading) globalLoading.style.display = isLoading ? 'flex' : 'none';
}

/** Displays messages in the main authentication area */
function showAuthMessage(message, isError = false) {
    const targetElement = isError ? authError : authMessage;
    const otherElement = isError ? authMessage : authError;
    if (targetElement) {
        targetElement.textContent = message;
        targetElement.style.display = message ? 'block' : 'none';
    }
    if (otherElement) {
        otherElement.style.display = 'none';
    }
}

/** Displays inline messages (success or error) next to specific elements */
function showInlineMessage(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    let baseClass = 'message';
    let errorClass = 'error-message';
    if (element.classList.contains('inline-msg')) { baseClass += ' inline-msg'; errorClass += ' inline-msg'; }
    element.className = isError ? errorClass : baseClass;
    element.style.display = message ? (element.classList.contains('inline-msg') ? 'inline-block' : 'block') : 'none';
}

/** Clears all active interview timers */
function clearTimers() {
    clearTimeout(autoStartTimerId);
    clearTimeout(questionTimerId);
    clearInterval(questionTimerIntervalId);
    autoStartTimerId = null; questionTimerId = null; questionTimerIntervalId = null;
    if (questionTimerDisplay) {
        questionTimerDisplay.textContent = '';
        questionTimerDisplay.classList.add('hidden');
    }
}

/** Stops the webcam stream and cleans up recorder state */
function stopWebcamStream() {
    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
    if (webcamFeed) webcamFeed.srcObject = null;
    if (isRecording && mediaRecorder?.state !== 'inactive') {
        try { mediaRecorder.stop(); } catch (e) { console.error("Force stop recorder err:", e); }
    }
    isRecording = false; mediaRecorder = null; recordedChunks = [];
    clearTimers();
}

/** Hides all main content sections and resets interview/job states */
function clearAllSections() {
    const sections = mainContent?.children; if (!sections) return;
    for (let section of sections) {
        if (!['global-loading', 'global-error'].includes(section.id) && !['HEADER', 'FOOTER'].includes(section.tagName)) {
            section.style.display = 'none';
        }
    }
    if (userInfoSection) userInfoSection.style.display = 'none';
    showAuthMessage(null);
    stopWebcamStream();
    if (interviewResumeInput) interviewResumeInput.value = ''; if (interviewResumeStatus) interviewResumeStatus.textContent = ''; showInlineMessage(resumeUploadError, null);
    currentInterviewState = { jobId: null, jobTitle: null, jobDescription: null, candidateResumeURL: null, candidateResumeMimeType: null, questions: [], answers: [], videoURLs: [], currentQuestionIndex: 0 };
    selectedInterviewForReport = null; editingJobId = null;
    cancelEditJob(); // Reset job form
    console.log("All sections cleared and state reset.");
}

/** Formats experience years for display */
function formatExperience(exp) {
    if (exp === null || exp === undefined || exp === '' || isNaN(exp)) return 'N/A';
    return `${exp}`;
}

/** Formats phone number to 10 digits (removes non-digits) */
function formatPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 ? cleaned : phone; // Display cleaned 10 digits
}

/** Formats a Date or Timestamp object to 'YYYY-MM-DD' for date input fields */
function formatDateForInput(date) {
    if (!date) return ''; let d;
    if (date instanceof firebase.firestore.Timestamp) d = date.toDate();
    else if (date instanceof Date) d = date;
    else return '';
    try { const year = d.getFullYear(); const month = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; }
    catch (e) { console.error("Error formatting date:", e); return ''; }
}

/** Escapes HTML special characters to prevent XSS */
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return unsafe; // Return non-strings unchanged
    }
    return unsafe
         .replace(/&/g, "&amp;") // Replace & first
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;"); // Numeric entity for single quote
}
// --- Add these near your other DOM Element References ---
const showManageCandidatesBtn = document.getElementById('show-manage-candidates-btn');
const manageCandidatesSection = document.getElementById('manage-candidates-section');
const hideManageCandidatesBtn = document.getElementById('hide-manage-candidates-btn'); // Optional

// --- Add these event listeners, likely within your DOMContentLoaded handler or initialization logic ---

if (showManageCandidatesBtn && manageCandidatesSection) {
    showManageCandidatesBtn.addEventListener('click', () => {
        // Load the candidates *when the button is clicked*
        // This avoids loading them unnecessarily every time the dashboard loads.
        loadManageableCandidates(); // Assumes this function exists and populates #manage-candidates-list

        // Show the section
        manageCandidatesSection.style.display = 'block';

        // Optional: Scroll to the section
        manageCandidatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Optional: Add listener for the hide button
if (hideManageCandidatesBtn && manageCandidatesSection) {
    hideManageCandidatesBtn.addEventListener('click', () => {
        manageCandidatesSection.style.display = 'none';
    });
}

/** Fetches an image from a URL and converts it to a Base64 string */
async function imageUrlToBase64(url) {
    if (!url || typeof url !== 'string') throw new Error("Invalid URL for Base64.");
    try { const r = await fetch(url); if (!r.ok) throw new Error(`Fetch fail: ${r.statusText}`); const b = await r.blob(); if (b.size > MAX_RESUME_SIZE_MB * 1024 * 1024) throw new Error(`Img too large.`); return new Promise((res, rej) => { const rd = new FileReader(); rd.onloadend = () => { const d = rd.result?.split(',')[1]; if (!d) rej(new Error('Base64 extract fail.')); else res(d); }; rd.onerror = () => rej(new Error('File read error.')); rd.readAsDataURL(b); }); }
    catch (e) { console.error("URL to Base64 err:", e); throw new Error(`Image process err: ${e.message}`); }
}

// ==================================
// UI Update Logic
// ==================================

/** Updates the entire UI based on the user's authentication state */
function updateUIBasedOnAuthState(user) {
    clearAllSections();
    if (user) {
        currentUser = user; showGlobalLoading(true);
        if (!db) { showAuthMessage("DB unavailable.", true); showGlobalLoading(false); if (auth) auth.signOut(); return; }
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                currentUserData = doc.data(); if (!currentUserData?.role) throw new Error("User data/role missing.");
                displayUserInfo();
                if (currentUserData.role === 'recruiter') {
                    if (recruiterDashboard) recruiterDashboard.style.display = 'block';
                    loadRecruiterJobs(); loadManageableCandidates(); // Also load candidates to manage
                    if (candidatesList) candidatesList.innerHTML = '<p>Select job.</p>'; if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select job)';
                } else if (currentUserData.role === 'candidate') {
                    if (candidateDashboard) candidateDashboard.style.display = 'block';
                    loadAvailableJobs(); loadMyInterviews();
                } else { throw new Error(`Invalid role: ${currentUserData.role}`); }
                console.log(`Logged in: ${user.email}, Role: ${currentUserData.role}`);
            } else { throw new Error("User profile not found."); }
        }).catch(error => { console.error("Profile load error:", error); showAuthMessage(`Profile error: ${error.message}. Logging out.`, true); logout(); })
            .finally(() => { showGlobalLoading(false); });
    } else {
        currentUser = null; currentUserData = null; if (authSection) authSection.style.display = 'block'; if (loginForm) loginForm.style.display = 'block'; if (signupForm) signupForm.style.display = 'none'; if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        showGlobalLoading(false); console.log("Logged out.");
    }
}

/** Populates the user info header bar */
function displayUserInfo() {
    if (!currentUser || !currentUserData) return;
    if (userEmailSpan) userEmailSpan.textContent = currentUser.email; if (userFullnameSpan) userFullnameSpan.textContent = currentUserData.fullname || currentUser.email; if (userRoleSpan) userRoleSpan.textContent = currentUserData.role; if (userExperienceSpan) userExperienceSpan.textContent = formatExperience(currentUserData.experience);
    // Display formatted phone number for candidates
    if (currentUserData.role === 'candidate' && currentUserData.phone && userPhoneSpan && userPhoneDisplay) { userPhoneSpan.textContent = formatPhoneNumber(currentUserData.phone); userPhoneDisplay.style.display = 'inline'; }
    else if (userPhoneDisplay) { userPhoneDisplay.style.display = 'none'; }
    if (userInfoSection) userInfoSection.style.display = 'flex';
}

// ==================================
// Authentication Logic
// ==================================

// --- Auth State Listener ---
if (auth) { auth.onAuthStateChanged(updateUIBasedOnAuthState); }
else { console.error("Firebase Auth unavailable."); showAuthMessage("Auth service failed.", true); if (authSection) authSection.style.display = 'block'; }

// --- Signup ---
if (signupBtn) signupBtn.addEventListener('click', async (e) => {
    e.preventDefault(); if (!db || !auth) return showAuthMessage("Services unavailable.", true);
    const email = signupEmailInput?.value.trim(); const password = signupPasswordInput?.value; const fullname = signupFullnameInput?.value.trim(); const experienceStr = signupExperienceInput?.value; const role = signupRoleSelect?.value; const phone = signupPhoneInput?.value.trim();
    showAuthMessage(null); if (!fullname || !email || !password || password.length < 6 || experienceStr === '' || !role) return showAuthMessage("Fill all fields (Pwd min 6 chars).", true);
    const experience = parseInt(experienceStr); if (isNaN(experience) || experience < 0) return showAuthMessage("Experience must be >= 0.", true);
    let cleanedPhone = ''; if (role === 'candidate') { if (!phone) return showAuthMessage("Phone required for candidates.", true); cleanedPhone = phone.replace(/\D/g, ''); if (cleanedPhone.length !== 10) return showAuthMessage("Enter a valid 10-digit phone number.", true); }
    signupBtn.disabled = true; showGlobalLoading(true); let uc;
    try { uc = await auth.createUserWithEmailAndPassword(email, password); const uid = uc.user.uid; const data = { email, fullname, experience, role, accountStatus: 'active', createdAt: firebase.firestore.FieldValue.serverTimestamp() }; if (role === 'candidate') data.phone = cleanedPhone; /* Store cleaned */ await db.collection('users').doc(uid).set(data); console.log("User signed up:", email, role); }
    catch (error) { console.error("Signup Error:", error); let msg = `Signup failed: ${error.message}`; if (error.code?.includes('email-already-in-use')) msg = "Email already registered."; showAuthMessage(msg, true); if (uc?.user && !error.code?.includes('email-already-in-use')) { await uc.user.delete().catch(e => console.error("User cleanup failed:", e)); } }
    finally { signupBtn.disabled = false; showGlobalLoading(false); }
});

// Show/hide phone input on signup role change
if (signupRoleSelect) signupRoleSelect.addEventListener('change', (e) => { if (signupPhoneGroup) signupPhoneGroup.style.display = e.target.value === 'candidate' ? 'block' : 'none'; if (e.target.value !== 'candidate' && signupPhoneInput) signupPhoneInput.value = ''; });

// --- Login ---
if (loginBtn) loginBtn.addEventListener('click', (e) => {
    e.preventDefault(); if (!auth) return showAuthMessage("Auth unavailable.", true); const email = loginEmailInput?.value.trim(); const password = loginPasswordInput?.value; showAuthMessage(null); if (!email || !password) return showAuthMessage("Provide email/password.", true); loginBtn.disabled = true; showGlobalLoading(true);
    auth.signInWithEmailAndPassword(email, password)
        .then(uc => console.log("Logged in:", uc.user.email)) // onAuthStateChanged handles UI
        .catch(err => { console.error("Login error:", err); let msg = `Login failed: ${err.message}`; if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = "Invalid email or password."; showAuthMessage(msg, true); })
        .finally(() => { loginBtn.disabled = false; showGlobalLoading(false); });
});

// --- Logout ---
function logout() {
    stopWebcamStream(); currentInterviewState={jobId:null,jobTitle:null,jobDescription:null,candidateResumeURL:null,candidateResumeMimeType:null,questions:[],answers:[],videoURLs:[],currentQuestionIndex:0}; selectedInterviewForReport=null; editingJobId=null; cancelEditJob();
    if(auth){ auth.signOut().catch(err=>{console.error("Sign out err:",err);showAuthMessage("Logout error.",true);}); }
    else { updateUIBasedOnAuthState(null); } // Force UI update if auth failed init
    console.log("Logout.");
}
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// --- Password Reset ---
if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('forgot'); });
if (resetPasswordBtn) resetPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault(); if (!auth) return showAuthMessage("Auth unavailable.", true); const email = resetEmailInput?.value.trim(); showAuthMessage(null); if (!email) return showAuthMessage("Enter email.", true); resetPasswordBtn.disabled = true; showGlobalLoading(true);
    auth.sendPasswordResetEmail(email)
        .then(() => { showAuthMessage("Reset email sent!", false); if (resetEmailInput) resetEmailInput.value = ''; setTimeout(() => toggleAuthForms('login'), 5000); })
        .catch(err => { console.error("Pwd reset err:", err); let msg = `Reset email err: ${err.message}`; if (err.code === 'auth/user-not-found') msg = "No account found with that email."; showAuthMessage(msg, true); })
        .finally(() => { resetPasswordBtn.disabled = false; showGlobalLoading(false); });
});
if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('login'); });

// --- Auth Form Toggles ---
if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('signup'); });
if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('login'); });
function toggleAuthForms(form) { if(loginForm)loginForm.style.display=form==='login'?'block':'none'; if(signupForm)signupForm.style.display=form==='signup'?'block':'none'; if(forgotPasswordForm)forgotPasswordForm.style.display=form==='forgot'?'block':'none'; showAuthMessage(null); }

// ==================================
// Profile Editing
// ==================================
if (editProfileBtn) editProfileBtn.addEventListener('click', () => {
    if (!currentUser || !currentUserData) return;
    if (editFullnameInput) editFullnameInput.value = currentUserData.fullname || '';
    if (editExperienceInput) editExperienceInput.value = currentUserData.experience ?? '';
    if (currentUserData.role === 'candidate') {
        if (editPhoneInput) editPhoneInput.value = currentUserData.phone || ''; // Use raw phone data
        if (editPhoneGroup) editPhoneGroup.style.display = 'block';
    } else { if (editPhoneGroup) editPhoneGroup.style.display = 'none'; }
    showInlineMessage(editProfileMsg, null); clearAllSections();
    if (editProfileSection) editProfileSection.style.display = 'block'; if (userInfoSection) userInfoSection.style.display = 'flex';
});

if (cancelEditProfileBtn) cancelEditProfileBtn.addEventListener('click', goBackToDashboard);

if (editProfileForm) editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!currentUser || !currentUserData || !db) return showInlineMessage(editProfileMsg, 'Error: Not logged in or DB unavailable.', true);
    const newFullname = editFullnameInput?.value.trim(); const newExperienceStr = editExperienceInput?.value; const newPhone = editPhoneInput?.value.trim();
    if (!newFullname) return showInlineMessage(editProfileMsg, 'Full name required.', true); const newExperience = parseInt(newExperienceStr); if (isNaN(newExperience) || newExperience < 0) return showInlineMessage(editProfileMsg, 'Valid experience required (>= 0).', true);
    let cleanedPhone = ''; if (currentUserData.role === 'candidate') { if (!newPhone) return showInlineMessage(editProfileMsg, 'Phone required for candidates.', true); cleanedPhone = newPhone.replace(/\D/g, ''); if (cleanedPhone.length !== 10) return showInlineMessage(editProfileMsg, 'Enter a valid 10-digit phone number.', true); }
    saveProfileBtn.disabled = true; showInlineMessage(editProfileMsg, 'Saving...', false);
    try { const updateData = { fullname: newFullname, experience: newExperience, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }; if (currentUserData.role === 'candidate') updateData.phone = cleanedPhone; // Store cleaned phone
        await db.collection('users').doc(currentUser.uid).update(updateData);
        currentUserData.fullname = newFullname; currentUserData.experience = newExperience; if (currentUserData.role === 'candidate') currentUserData.phone = cleanedPhone; // Update local state cleaned
        console.log("Profile updated for:", currentUser.email); showInlineMessage(editProfileMsg, 'Profile updated!', false); saveProfileBtn.disabled = false; // Re-enable on success
        displayUserInfo(); setTimeout(() => { goBackToDashboard(); }, 1500);
    } catch (error) { console.error("Profile update error:", error); showInlineMessage(editProfileMsg, `Update error: ${error.message}`, true); saveProfileBtn.disabled = false; }
});

// ==================================
// Gemini API Call
// ==================================
async function callGeminiAPI(prompt, imageData = null) {
    console.warn("CLIENT-SIDE GEMINI CALL - INSECURE"); if (!GEMINI_API_KEY?.startsWith("AIza")) throw new Error("Gemini key invalid."); const url = `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`; const parts = [{ text: prompt }];
    if (imageData?.base64Data && imageData.mimeType) { if (imageData.base64Data.startsWith('data:')) throw new Error("Invalid Base64 format."); parts.push({ inlineData: { mimeType: imageData.mimeType, data: imageData.base64Data } }); /* console.log(`Gemini: Sending prompt + image (${imageData.mimeType})`); */ } else { /* console.log(`Gemini: Sending text prompt.`); */ }
    const reqBody = { contents: [{ parts: parts }], safetySettings: [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }], generationConfig: {} };
    try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) }); const respBody = await r.json(); if (!r.ok) throw new Error(respBody?.error?.message || `Gemini API Error (${r.status})`); const c = respBody.candidates?.[0]; if (!c) { if (respBody.promptFeedback?.blockReason) throw new Error(`Gemini: Blocked - ${respBody.promptFeedback.blockReason}`); throw new Error(`Gemini: No candidate response. Reason: ${respBody?.candidates?.[0]?.finishReason || 'Unknown'}`); } if (c.finishReason === 'SAFETY') throw new Error(`Gemini: Safety block - ${c.safetyRatings?.map(r => r.category).join(', ')}`); const txt = c.content?.parts?.[0]?.text; if (txt === undefined || txt === null || typeof txt !== 'string') throw new Error("Gemini: Cannot parse text from response."); console.log("Gemini call ok."); return txt; } catch (e) { console.error("Gemini API Call Err:", e); let dispErr = `AI API fail: ${e.message}.`; throw new Error(dispErr); }
}

// ==================================
// Cloudinary Upload Functions
// ==================================
async function uploadVideoToCloudinary(blob) { if (!CLOUDINARY_CLOUD_NAME || !VIDEO_CLOUDINARY_UPLOAD_PRESET) throw new Error("Cloudinary vid config err."); const fd = new FormData(); fd.append('file', blob, `interview_${Date.now()}.webm`); fd.append('upload_preset', VIDEO_CLOUDINARY_UPLOAD_PRESET); console.log(`Uploading vid (${(blob.size / 1024 / 1024).toFixed(2)}MB)...`); try { const r = await fetch(VIDEO_CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd }); const d = await r.json(); if (!r.ok || d.error) throw new Error(d.error?.message || `HTTP Err (${r.status})`); if (!d.secure_url) throw new Error("Upload ok but no URL."); console.log("Vid Upload OK:", d.secure_url); return d.secure_url; } catch (e) { console.error("Vid Upload Err:", e); throw new Error(`Vid upload fail: ${e.message}`); } }
async function uploadResumeImageToCloudinary(file) { if (!CLOUDINARY_CLOUD_NAME || !RESUME_CLOUDINARY_UPLOAD_PRESET) throw new Error("Cloudinary img config err."); console.log(`Uploading img (${(file.size / 1024).toFixed(1)}KB) preset: ${RESUME_CLOUDINARY_UPLOAD_PRESET}`); const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', RESUME_CLOUDINARY_UPLOAD_PRESET); try { const r = await fetch(RESUME_CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd }); const d = await r.json(); if (!r.ok || d.error) { const msg = d.error?.message || `HTTP err (${r.status})`; if (msg.includes("Invalid upload preset")) throw new Error("Cloudinary Err: Invalid/UNSIGNED Preset?"); if (msg.includes("signature")) throw new Error("Cloudinary Err: Preset requires signing?"); throw new Error(msg); } if (!d.secure_url) throw new Error("Upload ok but no URL."); console.log("Img Upload OK:", d.secure_url); return d.secure_url; } catch (e) { console.error("Img Upload Err:", e); throw new Error(`Resume upload fail: ${e.message}`); } }

// ==================================
// Recruiter Functions
// ==================================

// --- Job Management ---
if (postJobBtn) postJobBtn.addEventListener('click', async (e) => {
    e.preventDefault(); if (!db) return showInlineMessage(postJobMsg, "DB error.", true);
    const title = jobTitleInput?.value.trim(); const description = jobDescriptionInput?.value.trim(); const companyName = jobCompanyNameInput?.value.trim(); const qualifications = jobQualificationsInput?.value.trim(); const deadlineStr = jobDeadlineInput?.value;
    if (!title || !description || !companyName || !qualifications || !deadlineStr) return showInlineMessage(postJobMsg, "Fill all job fields.", true);
    if (!currentUser || !currentUserData || currentUserData.role !== 'recruiter') return showInlineMessage(postJobMsg, "Auth error.", true);
    let applyDeadline = null; try { const d = new Date(deadlineStr + 'T23:59:59'); if (isNaN(d.getTime())) throw new Error(); applyDeadline = firebase.firestore.Timestamp.fromDate(d); } catch (e) { return showInlineMessage(postJobMsg, "Invalid Deadline.", true); }
    postJobBtn.disabled = true; showInlineMessage(postJobMsg, editingJobId ? "Updating..." : "Posting...", false);
    const jobData = { title, description, companyName, qualifications, applyDeadline, recruiterUID: currentUser.uid, recruiterEmail: currentUser.email, recruiterName: currentUserData.fullname || currentUser.email, [editingJobId ? 'updatedAt' : 'createdAt']: firebase.firestore.FieldValue.serverTimestamp() }; if (!editingJobId) jobData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    try { if (editingJobId) { await db.collection('jobs').doc(editingJobId).update(jobData); showInlineMessage(postJobMsg, "Job updated!", false); cancelEditJob(); } else { await db.collection('jobs').add(jobData); showInlineMessage(postJobMsg, "Job posted!", false); if (jobTitleInput) jobTitleInput.value = ''; if (jobDescriptionInput) jobDescriptionInput.value = ''; if (jobCompanyNameInput) jobCompanyNameInput.value = ''; if (jobQualificationsInput) jobQualificationsInput.value = ''; if (jobDeadlineInput) jobDeadlineInput.value = ''; postJobBtn.disabled = false; } loadRecruiterJobs(); setTimeout(() => showInlineMessage(postJobMsg, null), 4000); }
    catch (error) { console.error("Job save err:", error); showInlineMessage(postJobMsg, `Save error: ${error.message}`, true); postJobBtn.disabled = false; }
});

function editJob(jobId, title, description, companyName, qualifications, deadlineDateStr) {
    if (!jobId || !jobTitleInput || !jobDescriptionInput || !jobCompanyNameInput || !jobQualificationsInput || !jobDeadlineInput || !postJobBtn || !postJobSectionTitle || !cancelEditJobBtn) return console.error("Missing elements for editJob");
    console.log("Editing job:", jobId); editingJobId = jobId;
    jobTitleInput.value = title; jobDescriptionInput.value = description; jobCompanyNameInput.value = companyName || ''; jobQualificationsInput.value = qualifications || ''; jobDeadlineInput.value = deadlineDateStr || '';
    postJobBtn.textContent = "Update Job"; postJobSectionTitle.textContent = `Edit Job: ${escapeHtml(title)}`; cancelEditJobBtn.style.display = 'inline-block'; if (postJobBtn) postJobBtn.disabled = false;
    showInlineMessage(postJobMsg, null); postJobSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEditJob() {
    editingJobId = null; if (jobTitleInput) jobTitleInput.value = ''; if (jobDescriptionInput) jobDescriptionInput.value = ''; if (jobCompanyNameInput) jobCompanyNameInput.value = ''; if (jobQualificationsInput) jobQualificationsInput.value = ''; if (jobDeadlineInput) jobDeadlineInput.value = '';
    if (postJobBtn) { postJobBtn.textContent = "Post Job"; postJobBtn.disabled = false; }
    if (postJobSectionTitle) postJobSectionTitle.textContent = "Post a New Job"; if (cancelEditJobBtn) cancelEditJobBtn.style.display = 'none'; showInlineMessage(postJobMsg, null);
}
if (cancelEditJobBtn) cancelEditJobBtn.addEventListener('click', cancelEditJob);

async function deleteJob(jobId, jobTitle) {
    if (!jobId || !db || !currentUser || currentUserData?.role !== 'recruiter') return alert('Error deleting.');
    if (confirm(`Delete job "${jobTitle}"?`)) {
        console.log("Deleting job:", jobId); showGlobalLoading(true);
        try { await db.collection('jobs').doc(jobId).delete(); console.log("Job deleted:", jobId); alert(`Job "${jobTitle}" deleted.`); loadRecruiterJobs(); if (candidatesList && selectedJobTitleRecruiter?.textContent === jobTitle) { candidatesList.innerHTML = '<p>Select job.</p>'; if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select job)'; } if (editingJobId === jobId) cancelEditJob(); }
        catch (error) { console.error("Delete err:", error); alert(`Delete failed: ${error.message}`); handleFirestoreError(error, postJobMsg, `deleting ${jobId}`); }
        finally { showGlobalLoading(false); }
    }
}

function loadRecruiterJobs() {
    if (!currentUser || !currentUserData || currentUserData.role !== 'recruiter' || !recruiterJobsList || !db) return; recruiterJobsList.innerHTML = '<div class="loading">Loading jobs...</div>';
    db.collection('jobs').where('recruiterUID', '==', currentUser.uid).orderBy('createdAt', 'desc').get()
      .then(snapshot => {
          recruiterJobsList.innerHTML = ''; if (snapshot.empty) { recruiterJobsList.innerHTML = '<p>No jobs posted.</p>'; return; }
          snapshot.forEach(doc => {
              const job = doc.data(); const el = document.createElement('div'); el.classList.add('list-item'); const id = doc.id; const title=job.title||''; const desc=job.description||''; const comp=job.companyName||''; const qual=job.qualifications||''; const dlTS=job.applyDeadline; const dlDisp = dlTS ? dlTS.toDate().toLocaleDateString() : 'N/A'; const dlEdit = dlTS ? formatDateForInput(dlTS.toDate()) : ''; const escTitle = escapeHtml(title); const escComp = escapeHtml(comp);
              el.innerHTML = ` <div class="job-info"> <strong class="job-title">${escTitle}</strong> ${escComp ? `<span class="company-name"> at ${escComp}</span>` : ''}<br> <small>Deadline: ${dlDisp}</small><br> <small>Posted: ${job.createdAt?.toDate().toLocaleDateString() || 'N/A'}</small> ${job.updatedAt ? `<br><small>Updated: ${job.updatedAt.toDate().toLocaleDateString()}</small>` : ''} </div> <div class="job-actions"> <button data-job-id="${id}" data-job-title="${escTitle}" class="btn secondary-btn small-btn view-candidates-btn">Candidates</button> <button data-job-id="${id}" data-job-title="${escapeHtml(title)}" data-job-desc="${escapeHtml(desc)}" data-job-company="${escapeHtml(comp)}" data-job-qualifications="${escapeHtml(qual)}" data-job-deadline="${dlEdit}" class="btn edit-btn small-btn edit-job-btn">Edit</button> <button data-job-id="${id}" data-job-title="${escTitle}" class="btn danger-btn small-btn delete-job-btn">Delete</button> </div>`;
              el.querySelector('.view-candidates-btn')?.addEventListener('click', (e) => { document.querySelectorAll('#recruiter-jobs-list .list-item.active').forEach(i=>i.classList.remove('active')); el.classList.add('active'); const jid=e.target.dataset.jobId; const jtitle=e.target.dataset.jobTitle; if(selectedJobTitleRecruiter)selectedJobTitleRecruiter.textContent=jtitle; if(candidatesList)candidatesList.innerHTML=''; loadCandidatesForJob(jid); });
              el.querySelector('.edit-job-btn')?.addEventListener('click', (e) => { editJob( e.target.dataset.jobId, title, desc, comp, qual, e.target.dataset.jobDeadline ); });
              el.querySelector('.delete-job-btn')?.addEventListener('click', (e) => { deleteJob(e.target.dataset.jobId, title); });
              recruiterJobsList.appendChild(el);
          });
      }).catch(error => { handleFirestoreError(error, recruiterJobsList, "your jobs"); });
}

// --- Candidate Listing (for specific job) ---
function loadCandidatesForJob(jobId) {
    if (!candidatesList || !db) return; candidatesList.innerHTML='<div class="loading">Loading...</div>';
    db.collection('interviews').where('jobId','==',jobId).orderBy('submittedAt','desc').get().then(snap=>{
        candidatesList.innerHTML=''; if(snap.empty){candidatesList.innerHTML='<p>No candidates yet.</p>'; return;}
        snap.forEach(doc=>{ const i=doc.data(); let sD="Pending",rSD=""; if(i.score?.includes('/'))sD=i.score.match(/(\d+)\s*\/\s*100/)?.[1]+'/100'||'Review'; else if(i.status&&!['Pending','InProgress'].includes(i.status))sD="N/A"; if(i.resumeScore?.includes('/'))rSD=` | Resume: ${i.resumeScore.match(/(\d+)\s*\/\s*100/)?.[1]+'/100'||'Review'}`; const stat=i.status||'Pending'; const el=document.createElement('div'); el.classList.add('list-item'); el.innerHTML=`<div><strong>${escapeHtml(i.candidateName||i.candidateEmail)}</strong><br><small>Submitted: ${i.submittedAt?.toDate().toLocaleString()||'N/A'}</small></div><span>Scores: ${sD}${rSD}</span><span class="interview-status status-${stat.toLowerCase().replace(/\s+/g,'-')}">${escapeHtml(stat)}</span><button data-interview-id="${doc.id}" class="btn small secondary-btn view-report-btn-recruiter">Report</button>`; el.querySelector('.view-report-btn-recruiter')?.addEventListener('click',()=>viewInterviewReport(doc.id)); candidatesList.appendChild(el); });
    }).catch(e=>{handleFirestoreError(e,candidatesList,`candidates for ${jobId}`);});
}

// --- Candidate Account Management (Recruiter) ---
async function loadManageableCandidates() {
    if (!currentUser || !currentUserData || currentUserData.role !== 'recruiter' || !manageCandidatesList || !db) return;
    manageCandidatesList.innerHTML = '<div class="loading">Loading candidates...</div>'; showInlineMessage(manageCandidatesMsg, null);
    try {
        // Optimization: Fetch all candidates directly if feasible, or stick to job-based fetching if candidate pool is huge
        // Simple approach: Get all users with role 'candidate' (might be slow for many users)
        const usersSnapshot = await db.collection('users').where('role', '==', 'candidate').get();

        manageCandidatesList.innerHTML = ''; // Clear loading
        if (usersSnapshot.empty) {
            manageCandidatesList.innerHTML = '<p class="list-empty-msg">No candidate accounts found.</p>';
            return;
        }

        usersSnapshot.forEach(userDoc => {
            const candidate = userDoc.data(); const candidateId = userDoc.id;
            const accountStatus = candidate.accountStatus || 'active'; const isEnabled = accountStatus === 'active';
            const btnClass = isEnabled ? 'warning-btn' : 'success-btn'; const btnText = isEnabled ? 'Disable' : 'Enable';
            const el = document.createElement('div'); el.classList.add('list-item', 'candidate-manage-item');
            el.innerHTML = ` <div class="candidate-info"> <strong>${escapeHtml(candidate.fullname || candidate.email)}</strong><br> <small>${escapeHtml(candidate.email)}</small> </div> <div class="candidate-status"> Status: <span class="status-indicator status-${accountStatus}">${accountStatus}</span> </div> <div class="candidate-actions"> <button data-uid="${candidateId}" data-status="${accountStatus}" class="btn ${btnClass} small-btn toggle-status-btn">${btnText}</button> <button data-uid="${candidateId}" data-email="${escapeHtml(candidate.email)}" class="btn danger-btn small-btn delete-candidate-btn">Delete Profile</button> </div>`;
            el.querySelector('.toggle-status-btn')?.addEventListener('click', (e) => { toggleCandidateAccountStatus(e.target.dataset.uid, e.target.dataset.status); });
            el.querySelector('.delete-candidate-btn')?.addEventListener('click', (e) => { deleteCandidateAccount(e.target.dataset.uid, e.target.dataset.email); });
            manageCandidatesList.appendChild(el);
        });

    } catch (error) { console.error("Error loading candidates:", error); handleFirestoreError(error, manageCandidatesList, "manageable candidates"); }
}

async function toggleCandidateAccountStatus(candidateUID, currentStatus) {
    if (!db || !currentUser || currentUserData?.role !== 'recruiter' || !candidateUID) return showInlineMessage(manageCandidatesMsg, "Error: Permission denied.", true);
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    const actionText = newStatus === 'active' ? 'Enable' : 'Disable';
    console.log(`${actionText} action for UID: ${candidateUID}`); showGlobalLoading(true); showInlineMessage(manageCandidatesMsg, `${actionText}ing candidate...`, false);
    try {
        await db.collection('users').doc(candidateUID).update({ accountStatus: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        console.log(`Candidate ${candidateUID} status updated to ${newStatus}.`); showInlineMessage(manageCandidatesMsg, `Candidate account ${newStatus}.`, false);
        loadManageableCandidates(); // Refresh list
        setTimeout(() => showInlineMessage(manageCandidatesMsg, null), 4000);
    } catch (error) { console.error(`Error ${actionText}ing candidate ${candidateUID}:`, error); showInlineMessage(manageCandidatesMsg, `Error updating status: ${error.message}`, true); handleFirestoreError(error, manageCandidatesMsg, `toggling status`); }
    finally { showGlobalLoading(false); }
}

async function deleteCandidateAccount(candidateUID, candidateEmail) {
    if (!db || !currentUser || currentUserData?.role !== 'recruiter' || !candidateUID) return showInlineMessage(manageCandidatesMsg, "Error: Permission denied.", true);
    const confirmation = confirm(`DELETE PROFILE DATA?\nFor candidate "${candidateEmail}" (${candidateUID}).\n\n*** IMPORTANT ***\nThis ONLY deletes Firestore data. It DOES NOT delete their login account.\nFull deletion requires backend setup.\n\nProceed with deleting Firestore profile data?`);
    if (confirmation) {
        console.log(`Deleting Firestore profile for UID: ${candidateUID}`); showGlobalLoading(true); showInlineMessage(manageCandidatesMsg, `Deleting profile...`, false);
        try { await db.collection('users').doc(candidateUID).delete(); console.log(`Candidate profile deleted: ${candidateUID}`); showInlineMessage(manageCandidatesMsg, `Profile for ${candidateEmail} deleted.`, false); loadManageableCandidates(); setTimeout(() => showInlineMessage(manageCandidatesMsg, null), 5000); }
        catch (error) { console.error(`Error deleting profile ${candidateUID}:`, error); showInlineMessage(manageCandidatesMsg, `Error deleting profile: ${error.message}`, true); handleFirestoreError(error, manageCandidatesMsg, `deleting profile`); }
        finally { showGlobalLoading(false); }
    } else { console.log(`Deletion cancelled for UID: ${candidateUID}`); }
}

// ==================================
// Candidate Functions
// ==================================
function loadAvailableJobs() {
    if (!availableJobsList || !db) return; availableJobsList.innerHTML = '<div class="loading">Loading jobs...</div>';
    const now = firebase.firestore.Timestamp.now();
    db.collection('jobs').where('applyDeadline', '>', now).orderBy('applyDeadline', 'asc').limit(50).get()
      .then(snapshot => {
          availableJobsList.innerHTML = ''; if (snapshot.empty) { availableJobsList.innerHTML = '<p>No jobs available.</p>'; return; }
          snapshot.forEach(doc => {
              const job = doc.data(); const el = document.createElement('div'); el.classList.add('list-item');
              const deadlineStr = job.applyDeadline ? `Apply by: ${job.applyDeadline.toDate().toLocaleDateString()}` : 'No deadline';
              const qualSnippet = job.qualifications ? escapeHtml(job.qualifications.substring(0,100))+(job.qualifications.length>100?'...':''):'(N/A)';
              const companyInfo = job.companyName ? `<small style="display: block; font-weight: 500;">Company: ${escapeHtml(job.companyName)}</small>` : '';
              el.innerHTML = `<div><strong>${escapeHtml(job.title)}</strong><br>${companyInfo}<small style="display: block; color: var(--danger-color);">${deadlineStr}</small><small style="display: block; margin-top: 5px;"><i>Qualifications: ${qualSnippet}</i></small><small style="display: block; margin-top: 5px;">Posted by: ${escapeHtml(job.recruiterName||'Recruiter')}</small></div><button data-job-id="${doc.id}" data-job-title="${escapeHtml(job.title)}" class="btn primary-btn small-btn start-interview-btn">Start Interview</button>`;
              el.querySelector('.start-interview-btn')?.addEventListener('click', (e) => { triggerResumeUpload(e.target.dataset.jobId, e.target.dataset.jobTitle); });
              availableJobsList.appendChild(el);
          });
      }).catch(error => { if (error.message.includes('index')) { handleFirestoreError(error, availableJobsList, "available jobs (Index Required)"); } else { handleFirestoreError(error, availableJobsList, "available jobs"); } });
}

function loadMyInterviews() {
    if (!currentUser || !myInterviewsList || !db) return; myInterviewsList.innerHTML = '<div class="loading">Loading interviews...</div>';
    db.collection('interviews').where('candidateUID', '==', currentUser.uid).orderBy('submittedAt', 'desc').limit(50).get()
      .then(snapshot => {
          myInterviewsList.innerHTML = ''; if (snapshot.empty) { myInterviewsList.innerHTML = '<p>No interviews completed.</p>'; return; }
          snapshot.forEach(doc => { const i = doc.data(); let sD="Pending",rSD=""; if(i.score?.includes('/'))sD=i.score.match(/(\d+)\s*\/\s*100/)?.[1]+'/100'||'Review'; else if(i.status&&!['Pending','InProgress'].includes(i.status))sD="N/A"; if(i.resumeScore?.includes('/'))rSD=` | Resume: ${i.resumeScore.match(/(\d+)\s*\/\s*100/)?.[1]+'/100'||'Review'}`; const stat=i.status||'Pending'; const el=document.createElement('div'); el.classList.add('list-item'); el.innerHTML=`<div><strong>${escapeHtml(i.jobTitle)}</strong><br><small>Submitted: ${i.submittedAt?.toDate().toLocaleString()||'N/A'}</small></div><span>Scores: ${sD}${rSD}</span><span class="interview-status status-${stat.toLowerCase().replace(/\s+/g,'-')}">${escapeHtml(stat)}</span><button data-interview-id="${doc.id}" class="btn small secondary-btn view-report-btn-candidate">Report</button>`; el.querySelector('.view-report-btn-candidate')?.addEventListener('click',()=>viewInterviewReport(doc.id)); myInterviewsList.appendChild(el); });
      }).catch(error => { handleFirestoreError(error, myInterviewsList, "your interviews"); });
}

// ==================================
// Firestore Error Helper
// ==================================
function handleFirestoreError(error, element, context) { let msg=`Err loading ${context}: ${error.message}`; if(error.code==='failed-precondition'&&error.message.includes('index')){msg=`Err loading ${context}: DB index missing.`; console.error("Firestore Index Error: Check console.");}else if(error.code==='permission-denied'||error.code==='unauthenticated'){msg=`Err loading ${context}: Permission Denied.`;} console.error(`Firestore Err (${context}):`,error); if(element){if(element.classList.contains('item-list')||['candidates-list','recruiter-jobs-list','available-jobs-list','my-interviews-list', 'manage-candidates-list'].includes(element.id)){element.innerHTML=`<p class="error-message">${msg}</p>`;}else{showInlineMessage(element,msg,true);}}else{showAuthMessage(msg,true);} }

// ==================================
// Media Recorder / Webcam Functions
// ==================================
async function setupWebcam() { console.log("Setting up webcam..."); if (!navigator.mediaDevices?.getUserMedia) { showInlineMessage(interviewError, "getUserMedia not supported.", true); return false; } if (!webcamFeed) { showInlineMessage(interviewError, "UI Error: Webcam element missing.", true); return false; } try { stopWebcamStream(); console.log("Requesting media..."); mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); webcamFeed.srcObject = mediaStream; webcamFeed.muted = true; await new Promise((res, rej) => { webcamFeed.onloadedmetadata = res; webcamFeed.onerror = rej; setTimeout(() => rej(new Error("Meta timeout.")), 5000); }); await webcamFeed.play(); console.log("Webcam playing."); if (startRecordingBtn) startRecordingBtn.disabled = false; showInlineMessage(interviewError, null); return true; } catch (err) { console.error("Webcam/Mic Err:", err); let msg = `Webcam/Mic Err: ${err.name}.`; showInlineMessage(interviewError, msg, true); if (startRecordingBtn) startRecordingBtn.disabled = true; stopWebcamStream(); return false; } }
function startRecording() { if (isRecording) return console.warn("Already recording."); if (!mediaStream?.active) { showInlineMessage(interviewError, "Webcam inactive.", true); updateInterviewButtonStates(); clearTimers(); return; } if (typeof MediaRecorder === 'undefined') { showInlineMessage(interviewError, "MediaRecorder not supported.", true); updateInterviewButtonStates(); clearTimers(); return; } recordedChunks = []; showInlineMessage(interviewError, null); try { const options = getSupportedMimeType(['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']); if (!options) throw new Error("No suitable video format."); mediaRecorder = new MediaRecorder(mediaStream, options); mediaRecorder.ondataavailable = (e) => { if (e.data?.size > 0) recordedChunks.push(e.data); }; mediaRecorder.onstop = async () => { console.log(`Recorder stopped. Chunks: ${recordedChunks.length}`); clearTimers(); if (loadingAnswer) loadingAnswer.style.display = 'block'; if (recordingStatusSpan?.textContent !== 'Time is up! Processing...') recordingStatusSpan.textContent = 'Processing...'; if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); if (recordedChunks.length === 0) { showInlineMessage(interviewError, "Record failed (no data).", true); if (loadingAnswer) loadingAnswer.style.display = 'none'; isRecording = false; updateInterviewButtonStates(); return; } const blob = new Blob(recordedChunks, { type: options.mimeType }); try { const videoUrl = await uploadVideoToCloudinary(blob); currentInterviewState.videoURLs[currentInterviewState.currentQuestionIndex] = videoUrl; currentInterviewState.answers[currentInterviewState.currentQuestionIndex] = `(STT Sim Q${currentInterviewState.currentQuestionIndex + 1}) Vid: ${videoUrl}.`; if (recordingStatusSpan) recordingStatusSpan.textContent = 'Recorded & Uploaded.'; if (sttSimulationNote) sttSimulationNote.style.display = 'block'; console.log(`Answer Q${currentInterviewState.currentQuestionIndex + 1} processed.`); } catch (e) { currentInterviewState.videoURLs[currentInterviewState.currentQuestionIndex] = null; currentInterviewState.answers[currentInterviewState.currentQuestionIndex] = `(Vid Upload Fail: ${e.message}.)`; showInlineMessage(interviewError, `Upload fail: ${e.message}`, true); if (recordingStatusSpan) recordingStatusSpan.textContent = 'Upload Failed.'; } finally { if (loadingAnswer) loadingAnswer.style.display = 'none'; isRecording = false; recordedChunks = []; updateInterviewButtonStates(); } }; mediaRecorder.onerror = (e) => { console.error("Recorder err:", e.error); showInlineMessage(interviewError, `Record err: ${e.error?.name || 'Unknown'}.`, true); isRecording = false; if (recordingStatusSpan) recordingStatusSpan.textContent = 'Record Err!'; if (loadingAnswer) loadingAnswer.style.display = 'none'; clearTimers(); recordedChunks = []; updateInterviewButtonStates(); }; mediaRecorder.start(1000); isRecording = true; console.log(`Recorder started.`); if (recordingStatusSpan) recordingStatusSpan.textContent = 'Recording...'; updateInterviewButtonStates(); console.log(`Starting timer Q${currentInterviewState.currentQuestionIndex + 1}.`); const endTime = Date.now() + QUESTION_TIME_LIMIT_MS; updateTimerDisplay(endTime); if (questionTimerDisplay) questionTimerDisplay.classList.remove('hidden'); questionTimerIntervalId = setInterval(() => updateTimerDisplay(endTime), 1000); questionTimerId = setTimeout(() => { console.log(`Timer expired Q${currentInterviewState.currentQuestionIndex + 1}.`); if (isRecording) { console.log("Auto-stopping."); if (recordingStatusSpan) recordingStatusSpan.textContent = 'Time is up! Processing...'; stopRecording(); } else { console.log("Timer expired, but stopped."); if(questionTimerIntervalId) clearInterval(questionTimerIntervalId); if(questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); } }, QUESTION_TIME_LIMIT_MS); } catch (e) { console.error("Start Recorder Err:", e); showInlineMessage(interviewError, `Cannot start record: ${e.message}`, true); isRecording = false; if (recordingStatusSpan) recordingStatusSpan.textContent = 'Setup Fail.'; clearTimers(); updateInterviewButtonStates(); } }
function stopRecording() { console.log("Stop requested."); clearTimers(); if (!mediaRecorder || !isRecording || mediaRecorder.state === 'inactive') { if (isRecording) { isRecording = false; updateInterviewButtonStates(); } return; } if (recordingStatusSpan?.textContent !== 'Time is up! Processing...') recordingStatusSpan.textContent = 'Stopping...'; if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); if (stopRecordingBtn) stopRecordingBtn.disabled = true; if (startRecordingBtn) startRecordingBtn.disabled = true; if (nextQuestionBtn) nextQuestionBtn.disabled = true; if (finishInterviewBtn) finishInterviewBtn.disabled = true; try { mediaRecorder.stop(); } catch (e) { console.error("Stop recorder err:", e); showInlineMessage(interviewError, `Stop err: ${e.message}`, true); if (recordingStatusSpan) recordingStatusSpan.textContent = 'Err Stopping.'; if (loadingAnswer) loadingAnswer.style.display = 'none'; isRecording = false; recordedChunks = []; updateInterviewButtonStates(); } }
function getSupportedMimeType(types) { if(typeof MediaRecorder==='undefined')return null; for(const t of types)if(MediaRecorder.isTypeSupported(t))return{mimeType:t}; if(MediaRecorder.isTypeSupported('video/webm'))return{mimeType:'video/webm'}; return null; }

// ==================================
// Interview Process (Candidate - REAL)
// ==================================
async function triggerResumeUpload(jobId, jobTitle) { if (!currentUser?.uid || currentUserData?.role !== 'candidate') return alert("Auth Error."); if (!jobId || !jobTitle) return alert("Invalid job."); if (!db) return alert("DB unavailable."); showGlobalLoading(true); try { const q = db.collection('interviews').where('candidateUID', '==', currentUser.uid).where('jobId', '==', jobId).limit(1); const snap = await q.get(); if (!snap.empty) { const d = snap.docs[0].data(); if (d.status && d.status !== 'InProgress') { showGlobalLoading(false); alert(`Submitted for "${escapeHtml(jobTitle)}". Status: ${d.status}.`); viewInterviewReport(snap.docs[0].id); return; } } } catch (e) { showGlobalLoading(false); console.error("History check err:", e); alert(`History check err: ${e.message}. Proceeding.`); } showGlobalLoading(false); clearAllSections(); if (resumeUploadSection) { if(resumePromptJobTitle) resumePromptJobTitle.textContent = escapeHtml(jobTitle); if(resumeUploadJobIdInput) resumeUploadJobIdInput.value = jobId; if(interviewResumeInput) interviewResumeInput.value = ''; if(interviewResumeStatus) interviewResumeStatus.textContent = ''; showInlineMessage(resumeUploadError, null); resumeUploadSection.style.display = 'block'; if(userInfoSection) userInfoSection.style.display = 'flex'; } else { alert("UI Error: Resume upload missing."); goBackToDashboard(); } }
if (uploadResumeAndStartBtn) uploadResumeAndStartBtn.addEventListener('click', async () => { if (!currentUser) return showInlineMessage(resumeUploadError, "Auth error.", true); const jobId = resumeUploadJobIdInput?.value; const jobTitle = resumePromptJobTitle?.textContent; const file = interviewResumeInput?.files[0]; showInlineMessage(resumeUploadError, null); if (interviewResumeStatus) interviewResumeStatus.textContent = ''; if (!jobId || !jobTitle) return showInlineMessage(resumeUploadError, "Internal error: Job missing.", true); if (!file) return showInlineMessage(resumeUploadError, "Select resume (JPG/PNG).", true); if (!ALLOWED_RESUME_TYPES.includes(file.type)) return showInlineMessage(resumeUploadError, `Invalid type (${file.type}).`, true); const sizeMB = file.size / 1024 / 1024; if (sizeMB > MAX_RESUME_SIZE_MB) return showInlineMessage(resumeUploadError, `Image too large (${sizeMB.toFixed(1)}MB). Max ${MAX_RESUME_SIZE_MB}MB.`, true); uploadResumeAndStartBtn.disabled = true; if (cancelInterviewStartBtn) cancelInterviewStartBtn.disabled = true; if (interviewResumeStatus) interviewResumeStatus.textContent = 'Uploading...'; showGlobalLoading(true); try { const url = await uploadResumeImageToCloudinary(file); const mime = file.type; if (interviewResumeStatus) interviewResumeStatus.textContent = 'Upload complete! Preparing...'; if (resumeUploadSection) resumeUploadSection.style.display = 'none'; proceedToInterviewSetup(jobId, jobTitle, url, mime); } catch (e) { console.error("Resume Upload/Setup Err:", e); showInlineMessage(resumeUploadError, `Upload failed: ${e.message}.`, true); if (interviewResumeStatus) interviewResumeStatus.textContent = 'Upload failed.'; uploadResumeAndStartBtn.disabled = false; if (cancelInterviewStartBtn) cancelInterviewStartBtn.disabled = false; showGlobalLoading(false); } });
if (cancelInterviewStartBtn) cancelInterviewStartBtn.addEventListener('click', goBackToDashboard);
async function proceedToInterviewSetup(jobId, jobTitle, resumeURL, resumeMimeType) { console.log(`Setting up REAL interview: "${jobTitle}".`); currentInterviewState = { jobId, jobTitle, candidateResumeURL: resumeURL, candidateResumeMimeType: resumeMimeType, questions: [], answers: [], videoURLs: [], currentQuestionIndex: 0, jobDescription: null }; if (interviewSection) interviewSection.style.display = 'block'; if (userInfoSection) userInfoSection.style.display = 'flex'; if (interviewJobTitleSpan) interviewJobTitleSpan.textContent = escapeHtml(jobTitle); if (interviewQAArea) interviewQAArea.style.display = 'none'; showInlineMessage(interviewError, null); if (interviewLoading) { interviewLoading.textContent = "Fetching job..."; interviewLoading.style.display = 'block'; } showGlobalLoading(false); try { const jobDoc = await db.collection('jobs').doc(jobId).get(); currentInterviewState.jobDescription = jobDoc.exists ? (jobDoc.data().description || '(N/A)') : '(Not found)'; } catch (e) { currentInterviewState.jobDescription = '(Err fetch desc)'; showInlineMessage(interviewError, "Warn: Could not fetch desc.", false); } if (interviewLoading) interviewLoading.textContent = "Setting up webcam..."; const webcamOK = await setupWebcam(); if (!webcamOK) { if (interviewLoading) interviewLoading.style.display = 'none'; addBackButtonToError(interviewError); return; } if (interviewLoading) interviewLoading.textContent = "Analyzing resume..."; try { const b64 = await imageUrlToBase64(currentInterviewState.candidateResumeURL); if (interviewLoading) interviewLoading.textContent = "Generating questions (AI)..."; const exp = currentUserData?.experience !== undefined ? `${currentUserData.experience}y` : 'N/A'; const prompt = `AI Interviewer: Analyze resume for "${currentInterviewState.jobTitle}". Desc:"${currentInterviewState.jobDescription}". Exp:${exp}. Generate ${NUM_QUESTIONS} diverse questions from resume. Instructions: ${NUM_QUESTIONS} Qs. Newline separated. NO numbers/extra text.`; const imgData = { mimeType: currentInterviewState.candidateResumeMimeType, base64Data: b64 }; const genTxt = await callGeminiAPI(prompt, imgData); currentInterviewState.questions = genTxt.split('\n').map(q => q.trim()).filter(q => q && q.length > 10); if (currentInterviewState.questions.length === 0) throw new Error("AI failed questions."); if (currentInterviewState.questions.length < NUM_QUESTIONS) console.warn(`AI generated ${currentInterviewState.questions.length}/${NUM_QUESTIONS} Qs.`); const numQ = currentInterviewState.questions.length; currentInterviewState.answers = new Array(numQ).fill(null); currentInterviewState.videoURLs = new Array(numQ).fill(null); if (interviewLoading) interviewLoading.style.display = 'none'; if (interviewQAArea) interviewQAArea.style.display = 'block'; displayNextQuestion(); } catch (e) { console.error("REAL Q gen step err:", e); if (interviewLoading) interviewLoading.style.display = 'none'; showInlineMessage(interviewError, `Prep fail: ${e.message}.`, true); addBackButtonToError(interviewError); stopWebcamStream(); } }
function displayNextQuestion() { clearTimers(); const state = currentInterviewState; const index = state.currentQuestionIndex; if (!state.questions?.length) { showInlineMessage(interviewError, "Err: No questions.", true); return; } const totalQuestions = state.questions.length; if (index < 0 || index >= totalQuestions) { showInlineMessage(interviewError, "Err: Invalid question index.", true); return; } console.log(`Displaying REAL Q ${index + 1}/${totalQuestions}.`); if (questionTitle) questionTitle.textContent = `Question ${index + 1}/${totalQuestions}:`; if (questionText) questionText.textContent = state.questions[index]; if (sttSimulationNote) sttSimulationNote.style.display = 'none'; if (loadingAnswer) loadingAnswer.style.display = 'none'; showInlineMessage(interviewError, null); if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); const answerExists = (state.answers[index] !== null) || (state.videoURLs[index] !== null); if (answerExists) { if (recordingStatusSpan) recordingStatusSpan.textContent = 'Answered.'; updateInterviewButtonStates(); return; } updateInterviewButtonStates(); if (!isRecording && !answerExists && mediaStream?.active) { if (recordingStatusSpan) recordingStatusSpan.textContent = `Ready. Starts in ${AUTO_START_DELAY_MS / 1000}s...`; if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); console.log(`Setting auto-start (${AUTO_START_DELAY_MS}ms) REAL Q${index + 1}`); autoStartTimerId = setTimeout(() => { const currentState = currentInterviewState; const stillOnSameQ = currentState.currentQuestionIndex === index; const currAnsExists = (currentState.answers[index] !== null) || (currentState.videoURLs[index] !== null); if (!isRecording && stillOnSameQ && !currAnsExists && mediaStream?.active) { console.log(`Auto-starting record REAL Q${index + 1}.`); startRecording(); } else { console.log(`Auto-start REAL Q${index + 1} cancelled.`); if (recordingStatusSpan && !isRecording) recordingStatusSpan.textContent = currAnsExists ? 'Answered.' : 'Ready.'; updateInterviewButtonStates(); } }, AUTO_START_DELAY_MS); } else { if (!mediaStream?.active && recordingStatusSpan) recordingStatusSpan.textContent = 'Webcam Error!'; updateInterviewButtonStates(); } }
function updateTimerDisplay(endTime) { if (!questionTimerDisplay) return; const now = Date.now(); const left = Math.max(0, endTime - now); const m = Math.floor(left / 60000); const s = Math.floor((left % 60000) / 1000); questionTimerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
function updateInterviewButtonStates() { if (!startRecordingBtn || !stopRecordingBtn || !nextQuestionBtn || !finishInterviewBtn) return; startRecordingBtn.disabled = true; stopRecordingBtn.disabled = true; nextQuestionBtn.style.display = 'none'; finishInterviewBtn.style.display = 'none'; if (!currentInterviewState?.questions?.length || !mediaStream?.active) return; const state = currentInterviewState; const index = state.currentQuestionIndex; const totalQuestions = state.questions.length; if (index < 0 || index >= totalQuestions) return; const answerRecorded = (state.videoURLs?.[index] !== null) || (state.answers?.[index] !== null && !state.answers[index]?.startsWith('(Vid Fail')); const isLastQuestion = index === totalQuestions - 1; if (isRecording) { stopRecordingBtn.disabled = false; } else { if (answerRecorded) { if (isLastQuestion) { finishInterviewBtn.style.display = 'inline-block'; finishInterviewBtn.disabled = false; } else { nextQuestionBtn.style.display = 'inline-block'; nextQuestionBtn.disabled = false; } } else { startRecordingBtn.disabled = false; } } }

// --- Event Listeners for REAL Interview Controls ---
if (startRecordingBtn) startRecordingBtn.addEventListener('click', () => { console.log("Manual Start (REAL)."); clearTimers(); startRecording(); });
if (stopRecordingBtn) stopRecordingBtn.addEventListener('click', () => stopRecording());
if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', () => { if (!isRecording && currentInterviewState.currentQuestionIndex < currentInterviewState.questions.length - 1) { currentInterviewState.currentQuestionIndex++; displayNextQuestion(); } });
if (finishInterviewBtn) finishInterviewBtn.addEventListener('click', () => { if (!isRecording) finishInterview(); });
if (exitRealInterviewBtn) exitRealInterviewBtn.addEventListener('click', () => { if (confirm("Exit interview? Progress lost.")) goBackToDashboard(); });

// Finish REAL Interview
async function finishInterview() { console.log("Finishing REAL interview..."); clearTimers(); if (!currentUser || !currentInterviewState.jobId || !currentInterviewState.candidateResumeURL || !db) return showInlineMessage(interviewError, "Cannot save: Session/DB missing.", true); const firstUnp = currentInterviewState.answers.findIndex((a, i) => a === null && currentInterviewState.videoURLs[i] === null); if (firstUnp !== -1) return showInlineMessage(interviewError, `Cannot finish. Q${firstUnp + 1} not processed.`, true); if (interviewQAArea) interviewQAArea.style.display = 'none'; if (interviewLoading) { interviewLoading.textContent = "Analyzing..."; interviewLoading.style.display = 'block'; } showInlineMessage(interviewError, null); stopWebcamStream(); try { const b64 = await imageUrlToBase64(currentInterviewState.candidateResumeURL); if (interviewLoading) interviewLoading.textContent = "Generating AI feedback..."; const exp = currentUserData.experience !== undefined ? `${currentUserData.experience}y` : 'N/A'; let prompt = `Evaluate candidate for "${currentInterviewState.jobTitle}". Desc:"${currentInterviewState.jobDescription}". Exp:${exp}. Resume attached. Q&A (Simulated):\n---\n`; currentInterviewState.questions.forEach((q, i) => { prompt += `Q${i + 1}: ${q}\nA${i + 1}: ${currentInterviewState.answers[i] || '(N/A)'} ${currentInterviewState.videoURLs[i] ? '(Vid OK)' : '(Vid Fail)'}\n---\n`; }); prompt += `\nInstructions: Analyze resume. Eval answers. Summary. Overall Score:[Score]/100 - [Justify]. Resume Score:[Score]/100 - [Justify]. Use MD heads: **Resume Analysis:**, **Answer Feedback:**, **Overall Evaluation:**, **Overall Score:**, **Resume Score:**`; const imgData = { mimeType: currentInterviewState.candidateResumeMimeType, base64Data: b64 }; const feedback = await callGeminiAPI(prompt, imgData); let oScore = "N/A", rScore = "N/A"; if (feedback) { try { const oM = feedback.match(/Overall Score:\*\*\s*(.*?)(?:\n\*\*|$)/im); oScore = oM ? oM[1].trim() : "N/A(P)"; const rM = feedback.match(/Resume Score:\*\*\s*(.*?)(?:\n\*\*|$)/im); rScore = rM ? rM[1].trim() : "N/A(P)"; } catch (e) { console.error("Score parse err:", e); } } if (interviewLoading) interviewLoading.textContent = "Saving report..."; const interviewData = { jobId: currentInterviewState.jobId, jobTitle: currentInterviewState.jobTitle, jobDescription: currentInterviewState.jobDescription, candidateUID: currentUser.uid, candidateEmail: currentUser.email, candidateName: currentUserData.fullname || currentUser.email, candidateExperience: currentUserData.experience ?? null, candidateResumeURL: currentInterviewState.candidateResumeURL, candidateResumeMimeType: currentInterviewState.candidateResumeMimeType, questions: currentInterviewState.questions, answers: currentInterviewState.answers, videoURLs: currentInterviewState.videoURLs, feedback: feedback || "Feedback fail.", score: oScore, resumeScore: rScore, status: 'Pending', submittedAt: firebase.firestore.FieldValue.serverTimestamp() }; const docRef = await db.collection('interviews').add(interviewData); console.log("Report saved:", docRef.id); if (interviewLoading) interviewLoading.style.display = 'none'; if (interviewSection) interviewSection.style.display = 'none'; viewInterviewReport(docRef.id); } catch (e) { console.error("Finish REAL interview err:", e); if (interviewLoading) interviewLoading.style.display = 'none'; if (interviewSection) interviewSection.style.display = 'block'; showInlineMessage(interviewError, `Finalize fail: ${e.message}.`, true); addBackButtonToError(interviewError); } }

// ==================================
// Report Viewing & Other Functions
// ==================================
function goBackToDashboard() { clearAllSections(); showGlobalLoading(true); if (!currentUser || !currentUserData) { if (authSection) authSection.style.display = 'block'; } else { displayUserInfo(); if (currentUserData.role === 'recruiter') { if (recruiterDashboard) recruiterDashboard.style.display = 'block'; loadRecruiterJobs(); loadManageableCandidates(); if (candidatesList) candidatesList.innerHTML = '<p>Select job.</p>'; if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select job)'; } else if (currentUserData.role === 'candidate') { if (candidateDashboard) candidateDashboard.style.display = 'block'; loadAvailableJobs(); loadMyInterviews(); } else { if (authSection) authSection.style.display = 'block'; showAuthMessage("Invalid role.", true); logout(); } } showGlobalLoading(false); }
if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', goBackToDashboard);
function viewInterviewReport(id) { if (!id) { alert("Error: No report ID."); goBackToDashboard(); return; } console.log("Loading report:", id); clearAllSections(); showGlobalLoading(true); if (reportSection) reportSection.style.display = 'block'; if (userInfoSection) userInfoSection.style.display = 'flex'; if (reportContent) reportContent.innerHTML = '<div class="loading">Loading Q&A...</div>'; if (feedbackContent) feedbackContent.style.display = 'none'; if (loadingFeedback) loadingFeedback.style.display = 'block'; showInlineMessage(errorFeedback, null); if (recruiterStatusUpdateDiv) recruiterStatusUpdateDiv.style.display = 'none'; if (reportResumeLinkArea) reportResumeLinkArea.style.display = 'none'; if (!db || !currentUser || !currentUserData) { handleFirestoreError({ message: "Auth/DB unavailable." }, errorFeedback, "loading report"); addBackButtonToError(errorFeedback); showGlobalLoading(false); return; } db.collection('interviews').doc(id).get().then(doc => { if (!doc.exists) throw new Error(`Report ${id} not found.`); const i = doc.data(); const isCand = i.candidateUID === currentUser.uid; const isRec = currentUserData.role === 'recruiter'; if (!isCand && !isRec) throw new Error("Permission denied."); selectedInterviewForReport = { ...i, id: id }; if (reportJobTitleSpan) reportJobTitleSpan.textContent = escapeHtml(i.jobTitle || 'N/A'); if (reportCandidateEmailSpan) reportCandidateEmailSpan.textContent = escapeHtml(i.candidateEmail || 'N/A'); const stat = i.status || 'Pending'; if (reportStatusSpan) { reportStatusSpan.textContent = escapeHtml(stat); reportStatusSpan.className = `interview-status status-${stat.toLowerCase().replace(/\s+/g, '-')}`; } if (i.candidateResumeURL && reportResumeLinkArea && reportResumeLink) { reportResumeLink.href = i.candidateResumeURL; reportResumeLink.textContent = "View Resume"; reportResumeLinkArea.style.display = 'block'; } else { reportResumeLinkArea.style.display = 'none'; } if (isRec && recruiterStatusUpdateDiv) { recruiterStatusUpdateDiv.style.display = 'block'; if (updateStatusSelect) updateStatusSelect.value = stat; if (statusNotesInput) statusNotesInput.value = i.statusNotes || ''; showInlineMessage(updateStatusMsg, null); } if (loadingFeedback) loadingFeedback.style.display = 'none'; showInlineMessage(errorFeedback, null); if (feedbackContent) { if (i.feedback?.length > 1) { feedbackContent.innerHTML = formatFeedbackWithScoresVision(i.feedback, i.score, i.resumeScore); feedbackContent.style.display = 'block'; } else { showInlineMessage(errorFeedback, "AI feedback unavailable.", false); feedbackContent.style.display = 'none'; } } if (reportContent) reportContent.innerHTML = generateQAReport(i); }).catch(e => { console.error("Load report err:", e); handleFirestoreError(e, errorFeedback, `loading report ${id}`); addBackButtonToError(errorFeedback); if (reportContent) reportContent.innerHTML = ''; if (feedbackContent) feedbackContent.style.display = 'none'; }).finally(() => { showGlobalLoading(false); }); }
if (updateStatusBtn) updateStatusBtn.addEventListener('click', (e) => { e.preventDefault(); if (!db || !currentUser || currentUserData?.role !== 'recruiter' || !selectedInterviewForReport?.id) return showInlineMessage(updateStatusMsg, 'Err updating.', true); const newStat = updateStatusSelect?.value; const notes = statusNotesInput?.value.trim(); if (!newStat) return showInlineMessage(updateStatusMsg, 'Select status.', true); updateStatusBtn.disabled = true; showInlineMessage(updateStatusMsg, 'Updating...', false); db.collection('interviews').doc(selectedInterviewForReport.id).update({ status: newStat, statusNotes: notes || null, statusUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(), statusUpdatedByUID: currentUser.uid, statusUpdatedByEmail: currentUser.email }).then(() => { console.log(`Interview ${selectedInterviewForReport.id} status: ${newStat}`); showInlineMessage(updateStatusMsg, 'Status updated!', false); if (reportStatusSpan) { reportStatusSpan.textContent = escapeHtml(newStat); reportStatusSpan.className = `interview-status status-${newStat.toLowerCase().replace(/\s+/g, '-')}`; } selectedInterviewForReport.status = newStat; selectedInterviewForReport.statusNotes = notes || null; setTimeout(() => showInlineMessage(updateStatusMsg, null), 4000); }).catch(e => { console.error("Update status err:", e); handleFirestoreError(e, updateStatusMsg, "updating status"); }).finally(() => { updateStatusBtn.disabled = false; }); });
function formatFeedbackWithScoresVision(feedback, oScoreStr, rScoreStr) { if (!feedback || typeof feedback !== 'string') return '<p>Feedback unavailable.</p>'; const resM=feedback.match(/Resume Analysis:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/im); const feedM=feedback.match(/Answer Feedback:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/im); const evalM=feedback.match(/Overall Evaluation:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/im); let oScore=oScoreStr||"N/A"; if(oScore==="N/A"||oScore.includes("Parse")||oScore.includes("Exc")){const m=feedback.match(/Overall Score:\*\*\s*(.*?)(?:\n\*\*|$)/im); oScore=m?m[1].trim():oScore;} let rScore=rScoreStr||"N/A"; if(rScore==="N/A"||rScore.includes("Parse")||rScore.includes("Exc")){const m=feedback.match(/Resume Score:\*\*\s*(.*?)(?:\n\*\*|$)/im); rScore=m?m[1].trim():rScore;} const res=resM?escapeHtml(resM[1].trim()).replace(/\n/g,'<br>'):'(N/A)'; const feed=feedM?escapeHtml(feedM[1].trim()).replace(/\n/g,'<br>'):'(N/A)'; const ev=evalM?escapeHtml(evalM[1].trim()).replace(/\n/g,'<br>'):'(N/A)'; let fallback=''; if(!resM&&!feedM&&!evalM)fallback=`<p><strong>Raw:</strong></p><pre>${escapeHtml(feedback)}</pre>`; return `<div class="feedback-section"><h4>Resume Analysis:</h4><p>${res}</p><h4>Answer Feedback:</h4><p>${feed}</p><h4>Overall Evaluation:</h4><p>${ev}</p><div><h4>Scores:</h4><p><span class="feedback-score-display">Overall: ${escapeHtml(oScore)}</span> <span class="feedback-score-display">Resume: ${escapeHtml(rScore)}</span></p></div>${fallback}</div>`; }
function generateQAReport(interview) { if (!interview?.questions?.length) return '<p>No Q&A.</p>'; const ans=interview.answers||[]; const vids=interview.videoURLs||[]; let html=''; interview.questions.forEach((q,i)=>{const a=ans[i]||'(N/A)'; const v=vids[i]; let vL=v?`<p><a href="${v}" target="_blank" class="btn small secondary-btn">Watch Video (Q${i+1})</a></p>`:(a.includes("Fail")?`<p class="message inline-msg error-message">(Video Upload Failed)</p>`:`<p class="message inline-msg">(Video N/A)</p>`); html+=`<div class="qa-block"><h4>Question ${i+1}:</h4><p class="question-text">${escapeHtml(q)}</p><h4>Answer (Simulated):</h4><pre class="answer-text">${escapeHtml(a)}</pre>${vL}</div>${i<interview.questions.length-1?'<hr class="qa-separator">':''}`;}); return html; }
function addBackButtonToError(container) { if (!container?.parentNode || container.parentNode.querySelector('.back-btn-error')) return; const btn=document.createElement('button'); btn.textContent='← Back to Dashboard'; btn.classList.add('btn','secondary-btn','back-btn-error'); btn.onclick=goBackToDashboard; container.parentNode.insertBefore(btn, container.nextSibling);}

// ==================================
// Initial Load Trigger
// ==================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing...");
    let cfgErr = false; if (!firebaseConfig?.apiKey?.startsWith("AIza")) { cfgErr = true; console.error("CRITICAL Firebase config err!"); showAuthMessage("CRITICAL Firebase Config Error.", true); }
    if (!GEMINI_API_KEY?.startsWith("AIza")) { console.warn("Gemini key missing."); }
    if (!CLOUDINARY_CLOUD_NAME || !VIDEO_CLOUDINARY_UPLOAD_PRESET || !RESUME_CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME === "YOUR_CLOUDINARY_CLOUD_NAME") { console.warn("Cloudinary config missing."); }
    if (cfgErr) { if (authSection) authSection.style.display = 'block'; if (globalLoading) globalLoading.style.display = 'none'; if (mainContent) mainContent.style.display = 'block'; return; }
    // Add event listeners to prevent default form submissions
    loginForm?.addEventListener('submit', e => e.preventDefault());
    signupForm?.addEventListener('submit', e => e.preventDefault());
    forgotPasswordForm?.addEventListener('submit', e => e.preventDefault());
    document.getElementById('post-job-form')?.addEventListener('submit', e => e.preventDefault());
    editProfileForm?.addEventListener('submit', e => e.preventDefault());
    document.getElementById('resume-upload-form')?.addEventListener('submit', e => e.preventDefault());
    console.log("Initial checks ok. Waiting for Auth...");
    showGlobalLoading(true); // Show loading until auth state resolves
    // Auth listener (defined earlier) handles main application flow.
});