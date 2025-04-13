// --- Firebase Configuration ---
// !!! --- CRITICAL SECURITY WARNING --- !!!
// Using hardcoded keys client-side is insecure for production.
// Use backend functions or secure environment variables.
const firebaseConfig = {
    apiKey: "AIzaSyAvb4xyFo_R8KW2WH3V9YcBBv4eeDoPEx8",
    authDomain: "fir-ai-interview.firebaseapp.com",
    projectId: "fir-ai-interview",
    storageBucket: "fir-ai-interview.appspot.com", // Verify: .appspot.com or .firebasestorage.app?
    messagingSenderId: "1062000559385",
    appId: "1:1062000559385:web:acc0e5815f3c9433eeb188",
    measurementId: "G-GYPNPES5RL"
};

// --- Gemini Configuration ---
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
// !!! --- CRITICAL SECURITY WARNING --- !!!
// Hardcoded API key is insecure.
const GEMINI_API_KEY = 'AIzaSyDdzdinlqXV0rQhB8BW0zoTaaGZD0ts_8o';
const NUM_QUESTIONS = 5;

// --- Cloudinary Configuration ---
const CLOUDINARY_CLOUD_NAME = "dfp563ini";
// Preset for VIDEO uploads
const VIDEO_CLOUDINARY_UPLOAD_PRESET = "Ai-interview";
const VIDEO_CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
// Preset for RESUME IMAGE uploads - **VERIFY THIS PRESET IN YOUR CLOUDINARY ACCOUNT**
const RESUME_CLOUDINARY_UPLOAD_PRESET = "Ai-interview"; // <-- ASSUMING SAME PRESET, VERIFY!
const RESUME_CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`; // Use /image/upload endpoint


// --- Resume Configuration (Images) ---
const MAX_RESUME_SIZE_MB = 5;
const ALLOWED_RESUME_TYPES = [ 'image/jpeg', 'image/png' ];

// --- Interview Timer Configuration ---
const QUESTION_TIME_LIMIT_MS = 2 * 60 * 1000; // 2 minutes in milliseconds

// --- Initialize Firebase ---
try {
    // Basic Check
    if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.apiKey.startsWith("AIza") || firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY") { // Add check for placeholder
        throw new Error("Firebase config missing, invalid, or using placeholder values.");
    }
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase initialization critical error:", e);
    document.body.innerHTML = `<div class="error-message container" style="padding: 30px;">CRITICAL ERROR: Could not initialize Firebase. Check configuration and console. ${e.message}</div>`;
}

// --- Firebase Services ---
let auth, db, storage; // storage kept for potential other uses
if (typeof firebase !== 'undefined' && firebase.app) {
    try {
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        console.log("Firebase services initialized.");
    } catch (e) {
         console.error("Error getting Firebase services:", e);
         document.body.innerHTML = `<div class="error-message container" style="padding: 30px;">CRITICAL ERROR: Could not get Firebase services (Auth, Firestore). ${e.message}</div>`;
    }
} else {
     console.error("Firebase object not available after initialization attempt.");
     if (!document.body.innerHTML.includes("CRITICAL ERROR")) {
          document.body.innerHTML = `<div class="error-message container" style="padding: 30px;">CRITICAL ERROR: Firebase SDK failed to load/initialize.</div>`;
     }
}

// --- DOM Elements ---
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
const signupBtn = document.getElementById('signup-btn');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const resetEmailInput = document.getElementById('reset-email-input');
const resetPasswordBtn = document.getElementById('reset-password-btn');
const backToLoginLink = document.getElementById('back-to-login-link');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');
const authError = document.getElementById('auth-error');
const authMessage = document.getElementById('auth-message');
// User Info Display
const userInfoSection = document.getElementById('user-info');
const userFullnameSpan = document.getElementById('user-fullname');
const userEmailSpan = document.getElementById('user-email');
const userRoleSpan = document.getElementById('user-role');
const userExperienceSpan = document.getElementById('user-experience');
const logoutBtn = document.getElementById('logout-btn');
// Recruiter Dashboard
const recruiterDashboard = document.getElementById('recruiter-dashboard');
const postJobSection = document.getElementById('post-job-section');
const jobTitleInput = document.getElementById('job-title');
const jobDescriptionInput = document.getElementById('job-description');
const postJobBtn = document.getElementById('post-job-btn');
const postJobMsg = document.getElementById('post-job-msg');
const recruiterJobsList = document.getElementById('recruiter-jobs-list');
const candidatesList = document.getElementById('candidates-list');
const selectedJobTitleRecruiter = document.getElementById('selected-job-title-recruiter');
// Candidate Dashboard
const candidateDashboard = document.getElementById('candidate-dashboard');
const availableJobsList = document.getElementById('available-jobs-list');
const myInterviewsList = document.getElementById('my-interviews-list');
// Resume Upload Section Elements
const resumeUploadSection = document.getElementById('resume-upload-section');
const resumePromptJobTitle = document.getElementById('resume-prompt-job-title');
const resumeUploadJobIdInput = document.getElementById('resume-upload-job-id');
const interviewResumeInput = document.getElementById('interview-resume-input'); // Accepts images
const interviewResumeStatus = document.getElementById('interview-resume-status');
const uploadResumeAndStartBtn = document.getElementById('upload-resume-and-start-btn');
const cancelInterviewStartBtn = document.getElementById('cancel-interview-start-btn');
const resumeUploadError = document.getElementById('resume-upload-error');
// Interview Section Elements
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
const questionTimerDisplay = document.getElementById('question-timer-display'); // Timer display span
const nextQuestionBtn = document.getElementById('next-question-btn');
const finishInterviewBtn = document.getElementById('finish-interview-btn');
const sttSimulationNote = document.getElementById('stt-simulation-note');
const loadingAnswer = document.getElementById('loading-answer');
// Report Section Elements
const reportSection = document.getElementById('report-section');
const reportJobTitleSpan = document.getElementById('report-job-title');
const reportCandidateEmailSpan = document.getElementById('report-candidate-email');
const reportStatusSpan = document.getElementById('report-status');
const reportResumeLinkArea = document.getElementById('report-resume-link-area');
const reportResumeLink = document.getElementById('report-resume-link'); // Links to Cloudinary image
const feedbackArea = document.getElementById('feedback-area');
const loadingFeedback = document.getElementById('loading-feedback');
const errorFeedback = document.getElementById('error-feedback');
const feedbackContent = document.getElementById('feedback-content');
const reportContent = document.getElementById('report-content');
const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
const recruiterStatusUpdateDiv = document.getElementById('recruiter-status-update');
const updateStatusSelect = document.getElementById('update-status-select');
const statusNotesInput = document.getElementById('status-notes');
const updateStatusBtn = document.getElementById('update-status-btn');
const updateStatusMsg = document.getElementById('update-status-msg');
// Global Load/Error Elements
const mainContent = document.getElementById('main-content');
const globalLoading = document.getElementById('global-loading');
const globalError = document.getElementById('global-error');


// --- State Variables ---
let currentUser = null;
let currentUserData = null;
let currentInterviewState = {
    jobId: null,
    jobTitle: null,
    jobDescription: null,
    candidateResumeURL: null, // URL to the uploaded resume IMAGE (Cloudinary)
    candidateResumeMimeType: null, // Mime type of the uploaded image
    questions: [],
    answers: [],
    videoURLs: [], // Cloudinary video URLs
    currentQuestionIndex: 0,
};
let selectedInterviewForReport = null;
// Video Recording State
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
// Timer State
let autoStartTimerId = null; // Timeout ID for the delay BEFORE auto-recording starts
let questionTimerId = null;  // Timeout ID for the 2-minute question limit
let questionTimerIntervalId = null; // Interval ID for updating the timer display


// --- Utility Functions ---
function showGlobalLoading(isLoading) {
    if (globalLoading) globalLoading.style.display = isLoading ? 'flex' : 'none';
}
function showAuthMessage(message, isError = false) {
     const target = isError ? authError : authMessage;
     const other = isError ? authMessage : authError;
     if (target) { target.textContent = message; target.style.display = message ? 'block' : 'none'; }
     if (other) other.style.display = 'none';
}
function showInlineMessage(element, message, isError = false) {
     if (!element) return;
     element.textContent = message;
     let baseClass = 'message'; let errorClass = 'error-message';
     if (element.classList.contains('inline-msg')) { baseClass += ' inline-msg'; errorClass += ' inline-msg'; }
     // Add more specific class checks if needed (e.g., for upload-status-text, recording-status)
     element.className = isError ? `inline-msg ${errorClass}` : `inline-msg ${baseClass}`; // Ensure inline-msg is kept
     element.style.display = message ? 'inline-block' : 'none'; // Use inline-block for inline messages
}

function clearTimers() {
    clearTimeout(autoStartTimerId);
    clearTimeout(questionTimerId);
    clearInterval(questionTimerIntervalId);
    autoStartTimerId = null;
    questionTimerId = null;
    questionTimerIntervalId = null;
    if (questionTimerDisplay) {
         questionTimerDisplay.textContent = '';
         questionTimerDisplay.classList.add('hidden'); // Hide timer display
    }
    console.log("Timers cleared.");
}

function stopWebcamStream() {
     if (mediaStream) {
         console.log("Stopping webcam stream tracks.");
         mediaStream.getTracks().forEach(track => track.stop());
     }
     mediaStream = null;
     if (webcamFeed) webcamFeed.srcObject = null;
     // Stop recorder if it's somehow still active
     if (isRecording && mediaRecorder && mediaRecorder.state !== 'inactive') {
         try {
             mediaRecorder.stop();
             console.warn("Force stopped media recorder during webcam stream stop.");
         } catch (e) { console.error("Error force stopping recorder:", e); }
     }
     isRecording = false;
     mediaRecorder = null; // Nullify recorder object
     recordedChunks = []; // Clear chunks
     clearTimers(); // Ensure timers are cleared when stream stops
}

function clearAllSections() {
     const sections = mainContent?.children; if (!sections) return;
     for (let section of sections) {
         if (section.id !== 'global-loading' && section.id !== 'global-error' && section.tagName !== 'HEADER' && section.tagName !== 'FOOTER') {
             section.style.display = 'none';
         }
     }
     if (userInfoSection) userInfoSection.style.display = 'none';
     showAuthMessage(null);
     stopWebcamStream(); // Also clears timers
     if (resumeUploadSection) resumeUploadSection.style.display = 'none';
     if (interviewResumeInput) interviewResumeInput.value = '';
     if (interviewResumeStatus) interviewResumeStatus.textContent = '';
     showInlineMessage(resumeUploadError, null);
     // Reset interview state completely
     currentInterviewState = { jobId: null, jobTitle: null, jobDescription: null, candidateResumeURL: null, candidateResumeMimeType: null, questions: [], answers: [], videoURLs: [], currentQuestionIndex: 0 };
     selectedInterviewForReport = null;
     console.log("All sections cleared and state reset.");
}
function formatExperience(exp) {
    if (exp === null || exp === undefined || exp === '' || isNaN(exp)) return 'N/A'; return `${exp}`;
}
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

// --- Helper: Fetch image URL and convert to Base64 ---
async function imageUrlToBase64(url) {
    if (!url || typeof url !== 'string') {
        throw new Error("Invalid URL provided for Base64 conversion.");
    }
    try {
        console.log("Fetching image for Base64 conversion:", url);
        // Basic check for CORS issues - might need a proxy for some Cloudinary setups
        const response = await fetch(url); // Add { mode: 'cors' } if needed, but might break if server doesn't allow
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText} from ${url}`);
        }
        const blob = await response.blob();
        // Basic size check before reading into memory (e.g., 10MB limit for base64 processing)
        if (blob.size > 10 * 1024 * 1024) {
            throw new Error(`Image file too large (${(blob.size / 1024 / 1024).toFixed(1)}MB) to process for Base64.`);
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // result includes the 'data:mime/type;base64,' prefix, remove it
                const base64Data = reader.result.split(',')[1];
                if (!base64Data) {
                    reject(new Error('Failed to extract Base64 data from FileReader result.'));
                    return;
                }
                resolve(base64Data);
            };
            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                reject(new Error('Failed to read image file for Base64 conversion.'));
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error converting image URL to Base64:", error);
        throw new Error(`Could not process resume image from URL: ${error.message}`); // Rethrow for calling function
    }
}

// --- UI Updates ---
function updateUIBasedOnAuthState(user) {
    clearAllSections(); // Clears state, timers, webcam too
    if (user) {
        currentUser = user; showGlobalLoading(true);
        if (!db) {
            showAuthMessage("Database service is unavailable. Please refresh.", true);
            showGlobalLoading(false);
            if (auth) auth.signOut();
            return;
        }
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    currentUserData = doc.data();
                    if (!currentUserData || !currentUserData.role) {
                         throw new Error("User data or role missing from profile.");
                    }
                    if (userEmailSpan) userEmailSpan.textContent = user.email;
                    if (userFullnameSpan) userFullnameSpan.textContent = currentUserData.fullname || user.email;
                    if (userRoleSpan) userRoleSpan.textContent = currentUserData.role;
                    if (userExperienceSpan) userExperienceSpan.textContent = formatExperience(currentUserData.experience);
                    if (userInfoSection) userInfoSection.style.display = 'flex';

                    if (currentUserData.role === 'recruiter') {
                        if (recruiterDashboard) recruiterDashboard.style.display = 'block';
                        loadRecruiterJobs();
                        if (candidatesList) candidatesList.innerHTML = '<p class="list-empty-msg">Select a job above to see candidates.</p>';
                        if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select job)';
                    } else if (currentUserData.role === 'candidate') {
                        if (candidateDashboard) candidateDashboard.style.display = 'block';
                        loadAvailableJobs();
                        loadMyInterviews();
                    } else {
                        throw new Error(`Invalid user role found: ${currentUserData.role}`);
                    }
                    console.log(`User logged in: ${user.email}, Role: ${currentUserData.role}`);
                } else {
                    throw new Error("User profile document not found in Firestore.");
                }
            })
            .catch(error => {
                console.error("Error loading user profile:", error);
                showAuthMessage(`Error loading profile: ${error.message}. Logging out.`, true);
                logout(); // Log out user if profile loading fails
            })
            .finally(() => { showGlobalLoading(false); });
    } else {
        currentUser = null; currentUserData = null;
        if (authSection) authSection.style.display = 'block';
        if (loginForm) loginForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
        if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        showGlobalLoading(false);
        console.log("User logged out or not logged in.");
    }
}

// --- Authentication Logic ---
if (auth) {
    auth.onAuthStateChanged(updateUIBasedOnAuthState);
} else {
    console.error("Firebase Auth service not available on initial load.");
    showAuthMessage("Authentication service failed to load. Please refresh.", true);
    if (authSection) authSection.style.display = 'block'; // Show login as fallback
}

// Signup
if (signupBtn) signupBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!db || !auth) return showAuthMessage("Core services unavailable. Cannot sign up.", true);

    const email = signupEmailInput?.value.trim();
    const password = signupPasswordInput?.value;
    const fullname = signupFullnameInput?.value.trim();
    const experienceStr = signupExperienceInput?.value;
    const role = signupRoleSelect?.value;

    showAuthMessage(null); // Clear previous messages

    // Validation
    if (!fullname || !email || !password || password.length < 6 || experienceStr === '' || !role) {
        return showAuthMessage("Please fill in all fields correctly (Password min 6 characters).", true);
    }
    const experience = parseInt(experienceStr);
    if (isNaN(experience) || experience < 0) {
         return showAuthMessage("Years of experience must be a valid non-negative number.", true);
    }

    signupBtn.disabled = true; showGlobalLoading(true);
    let userCredential;
    try {
        userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;
        const userData = {
            email: email,
            fullname: fullname,
            experience: experience,
            role: role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('users').doc(userId).set(userData);
        console.log("User signed up and profile created:", email, role);
        // onAuthStateChanged will handle the UI update
    } catch (error) {
        console.error("Signup Error:", error);
        let message = `Signup failed: ${error.message}`;
        if (error.code?.includes('email-already-in-use')) message = "This email address is already registered.";
        showAuthMessage(message, true);
        // Clean up created user if Firestore write failed (optional but good practice)
        if (userCredential?.user && error.code !== 'auth/email-already-in-use') {
            await userCredential.user.delete().catch(e => console.error("User cleanup failed after signup error:", e));
        }
    } finally {
        signupBtn.disabled = false; showGlobalLoading(false);
    }
});

// Login
if (loginBtn) loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!auth) return showAuthMessage("Auth service unavailable.", true);
    const email = loginEmailInput?.value.trim();
    const password = loginPasswordInput?.value;
    showAuthMessage(null);
    if (!email || !password) return showAuthMessage("Please provide both email and password.", true);

    loginBtn.disabled = true; showGlobalLoading(true);
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("User logged in:", userCredential.user.email);
            // onAuthStateChanged handles UI update
        })
        .catch(error => {
            console.error("Login error:", error);
            showAuthMessage(`Login failed: ${error.message}`, true);
        })
        .finally(() => {
            loginBtn.disabled = false; showGlobalLoading(false);
        });
});

// Logout
function logout() { // Make logout callable from other error handlers
     stopWebcamStream(); // Stop stream and clear timers
     currentInterviewState = { jobId: null, jobTitle: null, jobDescription: null, candidateResumeURL: null, candidateResumeMimeType: null, questions: [], answers: [], videoURLs: [], currentQuestionIndex: 0 }; // Reset state
     selectedInterviewForReport = null;
     if (auth) {
         auth.signOut().catch(error => {
             console.error("Error signing out:", error);
             showAuthMessage("Error logging out.", true); // Show error even after UI updates
         });
     } else {
         // If auth is not available, just force UI update to logged-out state
         updateUIBasedOnAuthState(null);
     }
     console.log("Logout initiated.");
     // onAuthStateChanged handles UI update
 }
if (logoutBtn) logoutBtn.addEventListener('click', logout);


// Password Reset Logic
if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('forgot'); });
if (resetPasswordBtn) resetPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!auth) return showAuthMessage("Auth service unavailable.", true);
    const email = resetEmailInput?.value.trim();
    showAuthMessage(null);
    if (!email) return showAuthMessage("Please enter your email address.", true);

    resetPasswordBtn.disabled = true; showGlobalLoading(true);
    auth.sendPasswordResetEmail(email)
        .then(() => {
            showAuthMessage("Password reset email sent! Check your inbox.", false);
            if (resetEmailInput) resetEmailInput.value = '';
            setTimeout(() => toggleAuthForms('login'), 5000); // Go back to login after delay
        })
        .catch(error => {
            console.error("Password reset error:", error);
            showAuthMessage(`Error sending reset email: ${error.message}`, true);
        })
        .finally(() => {
            resetPasswordBtn.disabled = false; showGlobalLoading(false);
        });
});
if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('login'); });

// Auth Form Toggles
if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('signup'); });
if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('login'); });
function toggleAuthForms(formToShow) {
    if (loginForm) loginForm.style.display = formToShow === 'login' ? 'block' : 'none';
    if (signupForm) signupForm.style.display = formToShow === 'signup' ? 'block' : 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = formToShow === 'forgot' ? 'block' : 'none';
    showAuthMessage(null); // Clear messages when switching forms
}


// --- Gemini API Call (Handles Base64) ---
async function callGeminiAPI(prompt, imageData = null) {
    // ** SECURITY WARNING REMAINS **
    console.warn("Calling Gemini API from Client-Side with Hardcoded Key - INSECURE!");
    if (!GEMINI_API_KEY || !GEMINI_API_KEY.startsWith("AIza") || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') { // Check placeholder
        throw new Error("Gemini API Key missing, invalid, or using placeholder value.");
    }
    const url = `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`;
    const parts = [{ text: prompt }];

    // Use inlineData if base64 is provided
    if (imageData && imageData.base64Data && imageData.mimeType) {
        parts.push({
            inlineData: {
                mimeType: imageData.mimeType,
                data: imageData.base64Data // Send base64 string
            }
        });
        console.log(`Sending prompt ("${prompt.substring(0,50)}...") and image (${imageData.mimeType}) as Base64 data to Gemini.`);
    } else if (imageData) {
        console.warn("Image data provided to Gemini call but missing base64Data or mimeType.");
    } else {
        console.log(`Sending text-only prompt ("${prompt.substring(0,50)}...") to Gemini.`);
    }

    const requestBody = {
        contents: [{ parts: parts }],
        safetySettings: [ // Standard safety settings
             { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
             { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
             { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
             { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ],
        generationConfig: {
             // temperature: 0.7, // Optional: Adjust creativity vs predictability
             // maxOutputTokens: 1024, // Optional: Limit response length
        }
    };

    try {
        const response = await fetch(url, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(requestBody)
        });
        const responseBody = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error Response:", responseBody);
            throw new Error(responseBody.error?.message || `Gemini API Error (${response.status})`);
        }

        // Check for blocks or missing content more robustly
        const candidate = responseBody.candidates?.[0];
        if (!candidate) {
             if (responseBody.promptFeedback?.blockReason) {
                 throw new Error(`Gemini: Request blocked due to prompt content - ${responseBody.promptFeedback.blockReason}`);
             }
             throw new Error("Gemini: No candidate response received.");
        }
        if (candidate.finishReason === 'SAFETY') {
             console.error("Gemini Safety Block Details:", candidate.safetyRatings);
             throw new Error("Gemini: Response blocked by safety settings.");
        }
         if (candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
            console.warn(`Gemini finish reason: ${candidate.finishReason}`);
             // Handle other reasons if needed, e.g., 'RECITATION', 'OTHER'
         }

        const text = candidate.content?.parts?.[0]?.text;
        if (text === undefined || text === null || typeof text !== 'string') {
            console.error("Could not parse text from Gemini response:", responseBody);
            throw new Error("Gemini: Could not parse valid text from the response.");
        }
        console.log("Gemini API call successful.");
        return text;
    } catch (error) {
        console.error("Gemini API Call Error:", error);
        let displayError = `AI API call failed: ${error.message}.`;
        if (error.message.includes("Request payload size exceeds the limit")) {
            displayError = "AI API Error: Resume image is too large after encoding. Try a smaller or simpler image.";
        } else if (error.message.includes("image")) {
             displayError = `AI API Error processing image: ${error.message}`;
        } else if (error.message.includes("API key not valid")) {
             displayError = "AI API Error: Invalid API Key. Please check configuration.";
        }
        // Add other specific error messages if needed
        throw new Error(displayError); // Rethrow cleaned-up error
    }
}


// --- Cloudinary Upload Function (Video) ---
async function uploadVideoToCloudinary(videoBlob) {
    if (!CLOUDINARY_CLOUD_NAME || !VIDEO_CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME === "YOUR_CLOUDINARY_CLOUD_NAME") { // Check placeholder
        throw new Error("Cloudinary video configuration missing or using placeholder values.");
    }
    const formData = new FormData();
    formData.append('file', videoBlob, `interview_answer_${Date.now()}.webm`); // Add a filename
    formData.append('upload_preset', VIDEO_CLOUDINARY_UPLOAD_PRESET);
    // Optional: Add tags or context if needed
    // formData.append('tags', 'interview,video');

    console.log(`Uploading video (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB) to Cloudinary...`);

    try {
        const response = await fetch(VIDEO_CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok || data.error) {
            console.error("Cloudinary Video Upload Error Response:", data);
            throw new Error(data.error?.message || `Cloudinary Video Upload HTTP Error (${response.status})`);
        }
        if (!data.secure_url) {
            console.error("Cloudinary video response missing secure_url:", data);
            throw new Error("Cloudinary video upload succeeded but the URL is missing in the response.");
        }
        console.log("Cloudinary Video Upload Success:", data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error("Video Upload Network/Fetch Error:", error);
        throw new Error(`Video upload failed: ${error.message}`);
    }
}

// --- Cloudinary Upload Function (Resume Images) ---
async function uploadResumeImageToCloudinary(imageFile) {
     if (!CLOUDINARY_CLOUD_NAME || !RESUME_CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME === "YOUR_CLOUDINARY_CLOUD_NAME") { // Check placeholder
         throw new Error("Cloudinary resume image upload configuration missing or using placeholder values.");
     }
     console.log(`Uploading resume image (${(imageFile.size / 1024).toFixed(1)} KB) to Cloudinary...`);
     const formData = new FormData();
     formData.append('file', imageFile);
     formData.append('upload_preset', RESUME_CLOUDINARY_UPLOAD_PRESET);

     try {
         const response = await fetch(RESUME_CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
         const data = await response.json();
         if (!response.ok || data.error) {
             console.error("Cloudinary Image Upload Error Response:", data);
             throw new Error(data.error?.message || `Cloudinary Image Upload HTTP error (${response.status})`);
         }
         if (!data.secure_url) {
             console.error("Cloudinary image response missing secure_url:", data);
             throw new Error("Cloudinary image upload succeeded but the URL is missing in the response.");
         }
         console.log("Cloudinary Image Upload Success:", data.secure_url);
         return data.secure_url;
     } catch (error) {
         console.error("Cloudinary Image Upload Network/Parse Error:", error);
         throw new Error(`Resume image upload failed: ${error.message}`);
     }
}


// --- Recruiter Functions ---
if (postJobBtn) postJobBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!db) return showInlineMessage(postJobMsg, "DB error.", true);
    const title = jobTitleInput?.value.trim();
    const description = jobDescriptionInput?.value.trim();

    if (!title || !description) return showInlineMessage(postJobMsg, "Job title and description are required.", true);
    if (!currentUser || !currentUserData || currentUserData.role !== 'recruiter') return showInlineMessage(postJobMsg, "Authentication error or invalid role.", true);

    postJobBtn.disabled = true; showInlineMessage(postJobMsg, "Posting job...", false);

    db.collection('jobs').add({
        title: title,
        description: description,
        recruiterUID: currentUser.uid,
        recruiterEmail: currentUser.email,
        recruiterName: currentUserData.fullname || currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Job posted with ID:", docRef.id);
        showInlineMessage(postJobMsg, "Job posted successfully!", false);
        if (jobTitleInput) jobTitleInput.value = '';
        if (jobDescriptionInput) jobDescriptionInput.value = '';
        loadRecruiterJobs(); // Refresh the list
        setTimeout(() => showInlineMessage(postJobMsg, null), 4000); // Clear message after delay
    })
    .catch(error => {
        console.error("Error posting job:", error);
        showInlineMessage(postJobMsg, `Error posting job: ${error.message}`, true);
    })
    .finally(() => { postJobBtn.disabled = false; });
});

function loadRecruiterJobs() {
    if (!currentUser || !currentUserData || currentUserData.role !== 'recruiter' || !recruiterJobsList || !db) return;
    recruiterJobsList.innerHTML = '<div class="loading">Loading your jobs...</div>';
    db.collection('jobs').where('recruiterUID', '==', currentUser.uid).orderBy('createdAt', 'desc').get()
      .then(snapshot => {
          recruiterJobsList.innerHTML = ''; // Clear previous list
          if (snapshot.empty) {
              recruiterJobsList.innerHTML = '<p class="list-empty-msg">You have not posted any jobs yet.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const job = doc.data();
              const jobElement = document.createElement('div');
              jobElement.classList.add('list-item');
              jobElement.innerHTML = `
                  <div>
                      <strong class="job-title">${escapeHtml(job.title)}</strong><br>
                      <small>Posted: ${job.createdAt?.toDate().toLocaleDateString() || 'Date N/A'}</small>
                  </div>
                  <button data-job-id="${doc.id}" data-job-title="${escapeHtml(job.title)}" class="btn secondary-btn small-btn view-candidates-btn">View Candidates</button>`;

              const viewBtn = jobElement.querySelector('.view-candidates-btn');
              viewBtn?.addEventListener('click', (e) => {
                  // Highlight selected job
                  document.querySelectorAll('#recruiter-jobs-list .list-item.active').forEach(item => item.classList.remove('active'));
                  jobElement.classList.add('active');

                  const jobId = e.target.dataset.jobId;
                  const jobTitle = e.target.dataset.jobTitle;
                  if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = jobTitle;
                   if (candidatesList) candidatesList.innerHTML = ''; // Clear previous candidates immediately
                  loadCandidatesForJob(jobId);
              });
              recruiterJobsList.appendChild(jobElement);
          });
      }).catch(error => { handleFirestoreError(error, recruiterJobsList, "your posted jobs"); });
}

function loadCandidatesForJob(jobId) {
    if (!candidatesList || !db) return;
    candidatesList.innerHTML = '<div class="loading">Loading candidates...</div>';
    db.collection('interviews').where('jobId', '==', jobId).orderBy('submittedAt', 'desc').get()
      .then(snapshot => {
          candidatesList.innerHTML = ''; // Clear loading/previous
          if (snapshot.empty) {
              candidatesList.innerHTML = '<p class="list-empty-msg">No candidates have submitted interviews for this job yet.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const interview = doc.data();
              let scoreDisplay = "Pending"; let resumeScoreDisplay = "";
              // Parse scores more reliably
              if (interview.score && typeof interview.score === 'string' && interview.score !== "N/A") {
                   const m = interview.score.match(/(\d+)\s*\/\s*100/);
                   scoreDisplay = m ? `${m[1]}/100` : "Review"; // Use "Review" if format is unexpected
              } else if (interview.status && interview.status !== 'Pending' && interview.status !== 'InProgress') {
                    scoreDisplay = "N/A"; // Explicitly N/A if completed without score
              }

              if (interview.resumeScore && typeof interview.resumeScore === 'string' && interview.resumeScore !== "N/A") {
                   const m = interview.resumeScore.match(/(\d+)\s*\/\s*100/);
                   if (m) resumeScoreDisplay = ` | Resume: ${m[1]}/100`;
              }

              const status = interview.status || 'Pending';
              const el = document.createElement('div');
              el.classList.add('list-item');
              el.innerHTML = `
                  <div>
                      <strong class="candidate-email">${escapeHtml(interview.candidateName || interview.candidateEmail)}</strong><br>
                      <small>Submitted: ${interview.submittedAt?.toDate().toLocaleString() || 'Date N/A'}</small>
                  </div>
                  <span>Scores: ${scoreDisplay}${resumeScoreDisplay}</span>
                  <span class="interview-status status-${status.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(status)}</span>
                  <button data-interview-id="${doc.id}" class="btn secondary-btn small-btn view-report-btn-recruiter">View Report</button>`;

              el.querySelector('.view-report-btn-recruiter')?.addEventListener('click', () => viewInterviewReport(doc.id));
              candidatesList.appendChild(el);
          });
      }).catch(error => { handleFirestoreError(error, candidatesList, `candidates for job ${jobId}`); });
}


// --- Candidate Functions ---
function loadAvailableJobs() {
    if (!availableJobsList || !db) return;
    availableJobsList.innerHTML = '<div class="loading">Loading available jobs...</div>';
    // Consider adding pagination or limits for large numbers of jobs
    db.collection('jobs').orderBy('createdAt', 'desc').limit(50).get()
      .then(snapshot => {
          availableJobsList.innerHTML = '';
          if (snapshot.empty) {
              availableJobsList.innerHTML = '<p class="list-empty-msg">No jobs are currently available.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const job = doc.data();
              const el = document.createElement('div');
              el.classList.add('list-item');
              // Truncate description safely
              const shortDesc = job.description ? escapeHtml(job.description.substring(0, 120)) + (job.description.length > 120 ? '...' : '') : '(No description)';
              el.innerHTML = `
                  <div>
                      <strong>${escapeHtml(job.title)}</strong><br>
                      <small>${shortDesc}</small>
                      <small style="display: block;">Posted by: ${escapeHtml(job.recruiterName || 'Recruiter')}</small>
                  </div>
                  <button data-job-id="${doc.id}" data-job-title="${escapeHtml(job.title)}" class="btn primary-btn small-btn start-interview-btn">Start Interview</button>`;

              el.querySelector('.start-interview-btn')?.addEventListener('click', (e) => {
                  triggerResumeUpload(e.target.dataset.jobId, e.target.dataset.jobTitle);
              });
              availableJobsList.appendChild(el);
          });
      }).catch(error => { handleFirestoreError(error, availableJobsList, "available jobs"); });
}

function loadMyInterviews() {
    if (!currentUser || !myInterviewsList || !db) return;
    myInterviewsList.innerHTML = '<div class="loading">Loading your interviews...</div>';
    db.collection('interviews').where('candidateUID', '==', currentUser.uid).orderBy('submittedAt', 'desc').limit(50).get()
      .then(snapshot => {
          myInterviewsList.innerHTML = '';
          if (snapshot.empty) {
              myInterviewsList.innerHTML = '<p class="list-empty-msg">You have not completed any interviews yet.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const interview = doc.data();
              let scoreDisplay = "Pending"; let resumeScoreDisplay = "";
              // Score parsing copied from recruiter view for consistency
              if (interview.score && typeof interview.score === 'string' && interview.score !== "N/A") {
                   const m = interview.score.match(/(\d+)\s*\/\s*100/);
                   scoreDisplay = m ? `${m[1]}/100` : "Review";
              } else if (interview.status && interview.status !== 'Pending' && interview.status !== 'InProgress') {
                   scoreDisplay = "N/A";
              }
              if (interview.resumeScore && typeof interview.resumeScore === 'string' && interview.resumeScore !== "N/A") {
                   const m = interview.resumeScore.match(/(\d+)\s*\/\s*100/);
                   if (m) resumeScoreDisplay = ` | Resume: ${m[1]}/100`;
              }
              const status = interview.status || 'Pending';
              const el = document.createElement('div');
              el.classList.add('list-item');
              el.innerHTML = `
                  <div>
                      <strong class="job-title">${escapeHtml(interview.jobTitle)}</strong><br>
                      <small>Submitted: ${interview.submittedAt?.toDate().toLocaleString() || 'Date N/A'}</small>
                  </div>
                  <span>Scores: ${scoreDisplay}${resumeScoreDisplay}</span>
                  <span class="interview-status status-${status.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(status)}</span>
                  <button data-interview-id="${doc.id}" class="btn secondary-btn small-btn view-report-btn-candidate">View Report</button>`;

              el.querySelector('.view-report-btn-candidate')?.addEventListener('click', () => viewInterviewReport(doc.id));
              myInterviewsList.appendChild(el);
          });
      }).catch(error => { handleFirestoreError(error, myInterviewsList, "your past interviews"); });
}


// --- Firestore Error Helper ---
function handleFirestoreError(error, element, context) {
    let message = `Error loading ${context}: ${error.message}`;
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
        message = `Error loading ${context}: Database index missing. Check the Firestore console for index creation suggestions.`;
        console.error(" Firestore Index Error: Go to your Firebase console -> Firestore Database -> Indexes to create the required index.");
    } else if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
        message = `Error loading ${context}: Permission Denied. Please check Firestore rules or ensure you are logged in.`;
    }
    console.error(`Firestore Error while ${context}:`, error);
    if (element) {
        // If element is a list container, replace its content
        if (element.classList.contains('item-list') || element.id === 'candidates-list' || element.id === 'recruiter-jobs-list' || element.id === 'available-jobs-list' || element.id === 'my-interviews-list') {
             element.innerHTML = `<p class="error-message">${message}</p>`;
        } else { // Otherwise, use showInlineMessage
            showInlineMessage(element, message, true);
        }
    } else {
        showAuthMessage(message, true); // Fallback to main auth message area
    }
}


// --- MEDIA RECORDER / WEBCAM FUNCTIONS ---
async function setupWebcam() {
     console.log("Attempting to set up webcam...");
     if (!navigator.mediaDevices?.getUserMedia) {
         showInlineMessage(interviewError, "Webcam access (getUserMedia) is not supported by your browser.", true);
         return false;
     }
     if (!webcamFeed) {
          console.error("Webcam video element (#webcam-feed) not found.");
          showInlineMessage(interviewError, "Internal UI Error: Webcam display element missing.", true);
          return false;
     }

     try {
         stopWebcamStream(); // Ensure any previous stream is stopped first
         console.log("Requesting user media (video & audio)...");
         mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
         console.log("Media stream obtained.");

         webcamFeed.srcObject = mediaStream;
         // Muted is important to prevent feedback loops if speakers are on
         webcamFeed.muted = true;

         // Wait for metadata to load to ensure dimensions are available (optional but good practice)
         await new Promise((resolve, reject) => {
             webcamFeed.onloadedmetadata = () => {
                 console.log("Webcam metadata loaded.");
                 resolve();
             };
             webcamFeed.onerror = (e) => {
                 console.error("Video element error:", e);
                 reject(new Error(`Video element playback error: ${e.message || e.type}`));
             };
             // Timeout in case metadata never loads
             setTimeout(() => reject(new Error("Webcam metadata loading timed out.")), 5000);
         });

          // Play the video element (required by some browsers)
          await webcamFeed.play();
          console.log("Webcam feed playing.");

          // Enable the manual start button now that the stream is ready
          if (startRecordingBtn) startRecordingBtn.disabled = false;
          showInlineMessage(interviewError, null); // Clear any previous error
          return true;

     } catch (err) {
         console.error("Webcam/Microphone Access Error:", err);
         let msg = `Webcam/Mic Access Error: ${err.name}.`;
         if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
             msg += " Please grant camera and microphone permissions in your browser settings and reload.";
         } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
             msg += " No camera or microphone found. Ensure they are connected and enabled.";
         } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
              msg += " Camera or microphone might be in use by another application.";
         } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
              msg += " Your camera/mic doesn't meet the requested constraints.";
         } else {
             msg += ` ${err.message}. Please try reloading or using a different browser.`;
         }
         showInlineMessage(interviewError, msg, true);
         if (startRecordingBtn) startRecordingBtn.disabled = true; // Ensure start is disabled on error
         stopWebcamStream(); // Clean up partial stream if any
         return false;
     }
 }

 function startRecording() {
    // --- Guards ---
    if (isRecording) {
        console.warn("Start recording called, but already recording.");
        return;
    }
    if (!mediaStream || !mediaStream.active) { // Check if stream exists and is active
        showInlineMessage(interviewError, "Cannot start recording: Webcam stream is not available or inactive.", true);
        updateInterviewButtonStates();
        clearTimers();
        return;
    }
    // Check if MediaRecorder API is available
    if (typeof MediaRecorder === 'undefined') {
        showInlineMessage(interviewError, "Video recording (MediaRecorder API) is not supported by this browser.", true);
        updateInterviewButtonStates();
        clearTimers();
        return;
    }

    recordedChunks = []; // Reset chunks
    showInlineMessage(interviewError, null); // Clear previous errors

    try {
        // Determine the best MIME type
        const options = getSupportedMimeType(['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']);
        if (!options) {
            throw new Error("No suitable video recording format (MIME type) found for this browser.");
        }
        console.log("Using MIME type:", options.mimeType);

        console.log("Attempting to create MediaRecorder...");
        mediaRecorder = new MediaRecorder(mediaStream, options);

        // --- Event Handlers ---
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
                // console.log(`Data chunk received: ${event.data.size} bytes`);
            }
        };

        mediaRecorder.onstop = async () => {
            console.log(`MediaRecorder stopped. Recorded ${recordedChunks.length} chunks.`);
            // isRecording is set to false *after* processing in this handler
            clearTimers(); // Clear timers as soon as stop is effective

            if (loadingAnswer) loadingAnswer.style.display = 'block';
            if (recordingStatusSpan && recordingStatusSpan.textContent !== 'Time is up! Processing answer...') {
                 recordingStatusSpan.textContent = 'Processing & Uploading Video...';
            }
            if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden');


            if (recordedChunks.length === 0) {
                console.warn("Recording stopped, but no data chunks were recorded.");
                showInlineMessage(interviewError, "Recording failed (no video data was captured). Please try again.", true);
                if (loadingAnswer) loadingAnswer.style.display = 'none';
                isRecording = false; // Update state on failure
                updateInterviewButtonStates(); // Reflect failure in buttons
                return; // Don't proceed with upload
            }

            // Combine chunks into a single Blob
            const blob = new Blob(recordedChunks, { type: options.mimeType });
            console.log(`Blob created, size: ${blob.size} bytes, type: ${blob.type}`);

            try {
                const videoUrl = await uploadVideoToCloudinary(blob); // Upload the combined blob
                // Save URL and simulated answer
                currentInterviewState.videoURLs[currentInterviewState.currentQuestionIndex] = videoUrl;
                const simulatedText = `(STT Simulation Q${currentInterviewState.currentQuestionIndex + 1}) Video uploaded: ${videoUrl}. Analysis pending real transcription.`;
                currentInterviewState.answers[currentInterviewState.currentQuestionIndex] = simulatedText;

                 if (recordingStatusSpan) recordingStatusSpan.textContent = 'Answer Recorded & Uploaded.';
                if (sttSimulationNote) sttSimulationNote.style.display = 'block';
                console.log(`Answer for Q${currentInterviewState.currentQuestionIndex + 1} recorded and uploaded.`);

            } catch (uploadError) {
                 console.error("Video upload or processing failed:", uploadError);
                 // Store failure information
                 currentInterviewState.videoURLs[currentInterviewState.currentQuestionIndex] = null; // Indicate upload failed
                 currentInterviewState.answers[currentInterviewState.currentQuestionIndex] = `(Video Upload Failed: ${uploadError.message}. Please try recording again.)`;
                 showInlineMessage(interviewError, `Failed to upload video: ${uploadError.message}. You might need to record this answer again.`, true);
                 if (recordingStatusSpan) recordingStatusSpan.textContent = 'Video Upload Failed.';
            } finally {
                 if (loadingAnswer) loadingAnswer.style.display = 'none';
                 isRecording = false; // Set recording state to false AFTER processing attempt
                 recordedChunks = []; // Clear chunks regardless of success/failure
                 updateInterviewButtonStates(); // Update buttons based on final state (answer recorded or failed)
            }
        };

        mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder encountered an error:", event.error);
            showInlineMessage(interviewError, `Recording error occurred: ${event.error?.name || 'Unknown error'}. Please try again or reload.`, true);
            isRecording = false; // Set state on error
            if (recordingStatusSpan) recordingStatusSpan.textContent = 'Recording Error!';
            if (loadingAnswer) loadingAnswer.style.display = 'none';
            clearTimers(); // Clear timers on error
            recordedChunks = []; // Clear any partial data
            updateInterviewButtonStates(); // Update buttons to allow retry if possible
        };

        // --- Start Recording ---
        mediaRecorder.start(1000); // Trigger ondataavailable every 1000ms (1 second)
        isRecording = true; // Set state AFTER successful start attempt
        console.log("MediaRecorder started successfully.");
        if (recordingStatusSpan) recordingStatusSpan.textContent = 'Recording...';
        updateInterviewButtonStates(); // Update buttons now that we are recording

    } catch (error) {
        console.error("Error initializing or starting MediaRecorder:", error);
        showInlineMessage(interviewError, `Cannot start recording: ${error.message}`, true);
        isRecording = false; // Ensure state is false on failure
        if (recordingStatusSpan) recordingStatusSpan.textContent = 'Recording Setup Failed.';
        clearTimers(); // Clear timers on setup failure
        updateInterviewButtonStates(); // Update buttons
    }
 }

 function stopRecording() {
    console.log("Stop recording requested.");
    // --- Clear timers immediately on manual or automatic stop ---
    clearTimers();

    if (!mediaRecorder || !isRecording || mediaRecorder.state === 'inactive') {
        console.warn("StopRecording called but not recording or recorder inactive/unavailable.");
        // Ensure state is consistent if called unexpectedly
        if (isRecording) { // If state was true but recorder is bad
            isRecording = false;
            updateInterviewButtonStates();
        }
        return;
    }

    console.log("Attempting to stop MediaRecorder...");
    // Update status BEFORE stopping (unless it was set by timer expiry)
    if (recordingStatusSpan && recordingStatusSpan.textContent !== 'Time is up! Processing answer...') {
       recordingStatusSpan.textContent = 'Stopping Recording...';
    }
    if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden');

    // Disable buttons during stop process
    if (stopRecordingBtn) stopRecordingBtn.disabled = true;
    if (startRecordingBtn) startRecordingBtn.disabled = true; // Keep start disabled
    if (nextQuestionBtn) nextQuestionBtn.disabled = true;
    if (finishInterviewBtn) finishInterviewBtn.disabled = true;

    try {
        // The 'onstop' event handler (defined in startRecording) will handle processing/upload
        mediaRecorder.stop();
        // isRecording is set to false inside the onstop handler AFTER processing
    } catch (error) {
        console.error("Error explicitly calling mediaRecorder.stop():", error);
        // This might happen if the recorder is already stopped or in a bad state
        showInlineMessage(interviewError, `Error stopping recording: ${error.message}`, true);
        if (recordingStatusSpan) recordingStatusSpan.textContent = 'Error Stopping.';
        if (loadingAnswer) loadingAnswer.style.display = 'none';
        isRecording = false; // Force state update on error
        recordedChunks = []; // Clear chunks on error
        clearTimers(); // Clear timers again just in case
        updateInterviewButtonStates(); // Update buttons to reflect failed stop
    }
}

 function getSupportedMimeType(preferredTypes) {
    if (typeof MediaRecorder === 'undefined') return null;
    for (const type of preferredTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
            console.log(`Supported MIME type found: ${type}`);
            return { mimeType: type };
        }
    }
    console.warn("Preferred MIME types not supported, checking for generic video/webm.");
    if (MediaRecorder.isTypeSupported('video/webm')) { // Fallback
        console.log("Using fallback MIME type: video/webm");
        return { mimeType: 'video/webm' };
    }
    console.error("No supported MIME type found for MediaRecorder.");
    return null;
}


// --- INTERVIEW PROCESS (Candidate - Using Cloudinary + Base64) ---

// Step 1: Triggered by "Start Interview" -> Shows Resume Upload
async function triggerResumeUpload(jobId, jobTitle) {
     if (!currentUser || !currentUserData || currentUserData.role !== 'candidate') {
         alert("Authentication Error: Please login as a candidate."); return;
     }
     if (!jobId || !jobTitle) {
         alert("Error: Invalid job details provided."); return;
     }
     if (!db) {
         alert("Error: Database service is unavailable."); return;
     }

     // Optional: Check if candidate already completed this interview
     showGlobalLoading(true);
     try {
         const q = db.collection('interviews')
             .where('candidateUID', '==', currentUser.uid)
             .where('jobId', '==', jobId)
             .limit(1);
         const existingSnapshot = await q.get();

         if (!existingSnapshot.empty) {
             const existingInterview = existingSnapshot.docs[0].data();
             // Allow starting only if no status exists or if it was somehow left 'InProgress'
             // Prevent starting if 'Pending', 'Reviewed', 'Selected', 'Rejected', 'On Hold' etc.
             if (existingInterview.status && existingInterview.status !== 'InProgress') {
                  showGlobalLoading(false);
                  alert(`You have already submitted an interview for "${escapeHtml(jobTitle)}". Status: ${existingInterview.status}.`);
                  viewInterviewReport(existingSnapshot.docs[0].id); // Show them their report
                  return;
             }
              // If status is 'InProgress', maybe allow resuming? For now, treat as new.
             console.warn("Existing interview found with status 'InProgress'. Proceeding with new attempt.");
         }
     } catch (error) {
         showGlobalLoading(false);
         console.error("Error checking interview history:", error);
         alert(`Error checking previous interviews: ${error.message}. Proceeding anyway.`);
         // Decide if you want to proceed or block based on the error
     }
     showGlobalLoading(false); // Hide loading before showing the section

     // Show the resume upload section
     clearAllSections(); // Clear previous state, timers, etc.
     if (resumeUploadSection) {
         if (resumePromptJobTitle) resumePromptJobTitle.textContent = escapeHtml(jobTitle);
         if (resumeUploadJobIdInput) resumeUploadJobIdInput.value = jobId;
         if (interviewResumeInput) interviewResumeInput.value = ''; // Clear file input
         if (interviewResumeStatus) interviewResumeStatus.textContent = '';
         showInlineMessage(resumeUploadError, null); // Clear errors
         resumeUploadSection.style.display = 'block';
          if (userInfoSection) userInfoSection.style.display = 'flex'; // Keep user info visible
     } else {
          alert("Internal Application Error: Resume upload UI component is missing.");
          goBackToDashboard(); // Go back if UI is broken
     }
}

// Step 2: Handle Resume Image Upload to Cloudinary
if (uploadResumeAndStartBtn) uploadResumeAndStartBtn.addEventListener('click', async () => {
    if (!currentUser) { showInlineMessage(resumeUploadError, "Authentication error. Please log in again.", true); return; }

    const jobId = resumeUploadJobIdInput?.value;
    const jobTitle = resumePromptJobTitle?.textContent; // Get title from display
    const file = interviewResumeInput?.files[0];

    showInlineMessage(resumeUploadError, null);
    if (interviewResumeStatus) interviewResumeStatus.textContent = '';
    if (!jobId || !jobTitle) {
         showInlineMessage(resumeUploadError, "Internal error: Job details missing. Please go back and try again.", true);
         return;
    }

    // File Validation
    if (!file) {
         showInlineMessage(resumeUploadError, "Please select a resume image file (JPG or PNG).", true);
         return;
    }
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
         showInlineMessage(resumeUploadError, `Invalid file type (${file.type}). Only JPG and PNG images are allowed.`, true);
         return;
    }
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > MAX_RESUME_SIZE_MB) {
         showInlineMessage(resumeUploadError, `Image file is too large (${fileSizeMB.toFixed(1)}MB). Maximum allowed size is ${MAX_RESUME_SIZE_MB}MB.`, true);
         return;
    }

    // Disable buttons and show status
    uploadResumeAndStartBtn.disabled = true;
    if (cancelInterviewStartBtn) cancelInterviewStartBtn.disabled = true;
    if (interviewResumeStatus) interviewResumeStatus.textContent = 'Uploading resume image...';
    showGlobalLoading(true); // Use global loading

    try {
        const resumeURL = await uploadResumeImageToCloudinary(file); // Upload
        const resumeMimeType = file.type;
        console.log("Resume uploaded to Cloudinary:", resumeURL);
        if (interviewResumeStatus) interviewResumeStatus.textContent = 'Upload complete! Preparing interview...';

        // Hide upload section and proceed
        if (resumeUploadSection) resumeUploadSection.style.display = 'none';
        proceedToInterviewSetup(jobId, jobTitle, resumeURL, resumeMimeType);

    } catch (error) {
        console.error("Resume Upload or Setup Error:", error);
        showInlineMessage(resumeUploadError, `Upload failed: ${error.message}`, true);
        if (interviewResumeStatus) interviewResumeStatus.textContent = 'Upload failed.';
        // Re-enable buttons on failure
        uploadResumeAndStartBtn.disabled = false;
        if (cancelInterviewStartBtn) cancelInterviewStartBtn.disabled = false;
        showGlobalLoading(false);
    }
    // Note: Global loading will be hidden by proceedToInterviewSetup or the catch block
});

// Step 2b: Handle Cancellation
if (cancelInterviewStartBtn) cancelInterviewStartBtn.addEventListener('click', goBackToDashboard);


// Step 3: Proceed to Interview Setup (Fetches Base64 *before* calling Gemini)
async function proceedToInterviewSetup(jobId, jobTitle, resumeURL, resumeMimeType) {
     console.log(`Setting up interview for job "${jobTitle}". Resume (Cloudinary): ${resumeURL}`);

     // Reset and initialize interview state
     currentInterviewState = {
         jobId: jobId,
         jobTitle: jobTitle,
         candidateResumeURL: resumeURL,
         candidateResumeMimeType: resumeMimeType,
         questions: [],
         answers: [],
         videoURLs: [],
         currentQuestionIndex: 0,
         jobDescription: null, // Will be fetched
     };

     // Show interview section and loading state
     if (interviewSection) interviewSection.style.display = 'block';
     if (userInfoSection) userInfoSection.style.display = 'flex'; // Keep user info visible
     if (interviewJobTitleSpan) interviewJobTitleSpan.textContent = escapeHtml(jobTitle);
     if (interviewQAArea) interviewQAArea.style.display = 'none'; // Hide Q&A initially
     showInlineMessage(interviewError, null); // Clear errors
     if (interviewLoading) {
         interviewLoading.textContent = "Fetching job details...";
         interviewLoading.style.display = 'block';
     }
     showGlobalLoading(false); // Hide global loading if it was shown by caller

     // --- Fetch Job Description ---
     try {
         const jobDoc = await db.collection('jobs').doc(jobId).get();
         if (jobDoc.exists) {
             currentInterviewState.jobDescription = jobDoc.data().description || '(No description provided)';
             console.log("Job description fetched.");
         } else {
             currentInterviewState.jobDescription = '(Job details not found)';
             console.warn("Job document not found for ID:", jobId);
         }
     } catch (e) {
         console.error("Error fetching job description:", e);
         currentInterviewState.jobDescription = '(Error fetching job description)';
         // Optionally show a warning to the user, but proceed for now
         showInlineMessage(interviewError,"Warning: Could not fetch full job description.", false);
     }

     // --- Setup Webcam ---
     if (interviewLoading) interviewLoading.textContent = "Setting up webcam and microphone...";
     const webcamReady = await setupWebcam();
     if (!webcamReady) {
          if (interviewLoading) interviewLoading.style.display = 'none';
          // setupWebcam shows its own error message
          addBackButtonToError(interviewError); // Add back button below the error
          return; // Stop setup if webcam fails
     }

     // --- Generate Questions using Resume Image (via Base64) ---
     if (interviewLoading) interviewLoading.textContent = "Analyzing resume image...";
     try {
         // ** Fetch and convert Cloudinary image URL to Base64 FIRST **
         const resumeBase64Data = await imageUrlToBase64(currentInterviewState.candidateResumeURL);
         console.log("Resume image successfully converted to Base64.");

         if (interviewLoading) interviewLoading.textContent = "Generating interview questions with AI...";

         // Prepare prompt for Gemini
         const candidateExp = currentUserData?.experience !== undefined ? `${currentUserData.experience} years` : 'experience not specified';
         const prompt = `You are an AI interviewer. Analyze the attached resume image for a candidate applying for the role of "${currentInterviewState.jobTitle}".
The job description is: "${currentInterviewState.jobDescription}".
The candidate states they have ${candidateExp} of experience.

Based *directly* on the skills, projects, experience, and keywords visible in the resume image, generate ${NUM_QUESTIONS} diverse interview questions.
Focus on specific details from the resume. Ask behavioral, technical, or project-related questions relevant to the resume content and the job.

Instructions:
- Generate exactly ${NUM_QUESTIONS} questions.
- List each question on a NEW LINE.
- DO NOT include numbering (like 1., 2.) or any introductory/concluding text. Just the questions.`;

         // Prepare image data object with BASE64
         const imageDataForApi = {
             mimeType: currentInterviewState.candidateResumeMimeType,
             base64Data: resumeBase64Data // Pass the converted data
         };

         // Call Gemini API
         const generatedText = await callGeminiAPI(prompt, imageDataForApi);

         // Process the response
         currentInterviewState.questions = generatedText
             .split('\n') // Split by newline
             .map(q => q.trim()) // Trim whitespace
             .filter(q => q && q.length > 10); // Filter out empty lines or very short fragments

         if (currentInterviewState.questions.length === 0) {
             throw new Error("AI failed to generate valid questions from the resume image data. The response might have been empty or improperly formatted.");
         }
         // If fewer questions than expected, maybe adjust NUM_QUESTIONS? For now, proceed with what we have.
         if (currentInterviewState.questions.length < NUM_QUESTIONS) {
              console.warn(`AI generated only ${currentInterviewState.questions.length} questions (expected ${NUM_QUESTIONS}).`);
              // Optionally show a non-blocking warning?
         }

         // Initialize answers and video URLs arrays
         const numGeneratedQuestions = currentInterviewState.questions.length;
         currentInterviewState.answers = new Array(numGeneratedQuestions).fill(null);
         currentInterviewState.videoURLs = new Array(numGeneratedQuestions).fill(null);

         // --- Start the Interview ---
         if (interviewLoading) interviewLoading.style.display = 'none'; // Hide loading message
         if (interviewQAArea) interviewQAArea.style.display = 'block'; // Show Q&A area
         displayNextQuestion(); // Display the first question (this will handle auto-start)

     } catch (error) {
          console.error("Error during question generation or Base64 conversion:", error);
          if (interviewLoading) interviewLoading.style.display = 'none';
          showInlineMessage(interviewError, `Failed to prepare interview: ${error.message}. Please try again later.`, true);
          addBackButtonToError(interviewError);
          stopWebcamStream(); // Stop webcam if setup fails here
     }
}


// displayNextQuestion: Shows the next question and initiates auto-start/timer
function displayNextQuestion() {
    // --- Clear any previous timers FIRST ---
    clearTimers();

    const state = currentInterviewState;
    const index = state.currentQuestionIndex;

    // Basic validation
    if (!state.questions || state.questions.length === 0) {
        console.error("displayNextQuestion called with no questions in state.");
        showInlineMessage(interviewError, "Error: No interview questions were loaded.", true);
        addBackButtonToError(interviewError);
        return;
    }
    const totalQuestions = state.questions.length;
    if (index < 0 || index >= totalQuestions) {
        console.error(`displayNextQuestion called with invalid index: ${index} (Total: ${totalQuestions})`);
        showInlineMessage(interviewError, "Error: Invalid question number.", true);
        addBackButtonToError(interviewError);
        return;
    }
    console.log(`Displaying question ${index + 1} of ${totalQuestions}.`);

    // Update UI elements
    if (questionTitle) questionTitle.textContent = `Question ${index + 1} of ${totalQuestions}:`;
    if (questionText) questionText.textContent = state.questions[index]; // Display the question text
    if (sttSimulationNote) sttSimulationNote.style.display = 'none'; // Hide simulation note initially
    if (loadingAnswer) loadingAnswer.style.display = 'none'; // Hide processing indicator
    showInlineMessage(interviewError, null); // Clear previous question errors
    if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); // Hide timer initially


    // Determine if an answer/video already exists for this question (shouldn't happen with current flow, but good check)
    const answerExists = (state.answers[index] !== null) || (state.videoURLs[index] !== null);
    if(answerExists) {
        console.warn(`Answer already exists for question ${index + 1}. Skipping recording setup.`);
        if (recordingStatusSpan) recordingStatusSpan.textContent = 'Answer previously recorded.';
        updateInterviewButtonStates(); // Update buttons to reflect recorded state
        return; // Don't set up recording again
    }

    // Initial button state update BEFORE auto-start logic
    updateInterviewButtonStates(); // Sets buttons to 'ready' or 'webcam error' state

    // --- AUTO-START RECORDING & TIMER LOGIC ---
    if (!isRecording && !answerExists && mediaStream && mediaStream.active) {
        const startDelayMs = 2000; // 2 seconds delay before recording starts

        if (recordingStatusSpan) {
             recordingStatusSpan.textContent = `Ready. Recording starts in ${startDelayMs / 1000}s... (Limit: ${QUESTION_TIME_LIMIT_MS / 1000 / 60} min)`;
        }
        if (questionTimerDisplay) questionTimerDisplay.classList.add('hidden'); // Keep hidden during delay

        // Start the delay timer for auto-recording
        console.log(`Setting auto-start timer (${startDelayMs}ms) for Q${index + 1}`);
        autoStartTimerId = setTimeout(() => {
            console.log(`Auto-start timer fired for Q${index + 1}`);
            // --- Double-check conditions right before starting ---
            const currentState = currentInterviewState; // Get fresh state
            const stillOnSameQuestion = currentState.currentQuestionIndex === index;
             // Check again if answer was recorded manually during delay
            const currentAnswerExists = (currentState.answers[index] !== null) || (currentState.videoURLs[index] !== null);

            if (!isRecording && stillOnSameQuestion && !currentAnswerExists && mediaStream && mediaStream.active) {
                 console.log(`Conditions met. Auto-starting recording for Q${index + 1}.`);
                 // --- Start Recording ---
                 startRecording(); // This function should now handle setting isRecording = true and updating buttons/status

                 // --- Start 2-Minute Timer *AFTER* recording should have begun ---
                 // Check isRecording flag which should be set by startRecording()
                 if (isRecording) {
                     console.log(`Recording started. Starting ${QUESTION_TIME_LIMIT_MS / 1000}s timer for Q${index + 1}.`);
                     const timerEndTime = Date.now() + QUESTION_TIME_LIMIT_MS;

                     // Update display immediately and start interval
                     updateTimerDisplay(timerEndTime); // Show initial time
                     if (questionTimerDisplay) questionTimerDisplay.classList.remove('hidden'); // Show timer

                     // Update the display every second
                     questionTimerIntervalId = setInterval(() => {
                         updateTimerDisplay(timerEndTime);
                     }, 1000);

                     // Set the main timeout to stop recording after the limit
                     questionTimerId = setTimeout(() => {
                         console.log(`Timer expired for Q${index + 1}. Auto-stopping recording.`);
                         if (isRecording) { // Check if still recording (user might have stopped manually just before)
                             if (recordingStatusSpan) recordingStatusSpan.textContent = 'Time is up! Processing answer...';
                             stopRecording(); // Automatically stop and process
                         } else {
                              console.log("Timer expired, but recording was already stopped.");
                         }
                         // Interval is cleared within stopRecording via clearTimers
                     }, QUESTION_TIME_LIMIT_MS);
                 } else {
                     // This might happen if startRecording() failed immediately
                     console.error("Attempted auto-start, but isRecording is still false. Timer not initiated.");
                     if (recordingStatusSpan) recordingStatusSpan.textContent = 'Auto-start failed.';
                     // Buttons should reflect the failure via updateInterviewButtonStates in startRecording failure path
                 }

            } else {
                 console.log(`Auto-start recording for Q${index + 1} cancelled or preempted. Conditions: isRecording=${isRecording}, stillOnSameQuestion=${stillOnSameQuestion}, currentAnswerExists=${currentAnswerExists}, mediaStreamActive=${mediaStream?.active}`);
                 // Update status if needed (e.g., if already recorded manually)
                 if (recordingStatusSpan && !isRecording) {
                     recordingStatusSpan.textContent = currentAnswerExists ? 'Answer recorded.' : 'Ready to record.';
                 }
                 updateInterviewButtonStates(); // Ensure buttons are correct
            }
        }, startDelayMs);

    } else {
        // Log why auto-start didn't happen
        if(isRecording) console.warn("displayNextQuestion: Already recording.");
        if(answerExists) console.log(`displayNextQuestion: Answer exists for Q${index + 1}.`);
        if(!mediaStream || !mediaStream.active) console.error("displayNextQuestion: MediaStream not available/active for auto-start.");
        // Button states should already reflect the situation from the initial updateInterviewButtonStates call
        if (!mediaStream || !mediaStream.active && recordingStatusSpan) recordingStatusSpan.textContent = 'Webcam Error!';
    }
    // --- END AUTO-START & TIMER LOGIC ---
}

// --- Helper function to update timer display ---
function updateTimerDisplay(endTime) {
    if (!questionTimerDisplay) return;
    const now = Date.now();
    const timeLeft = Math.max(0, endTime - now); // Ensure time doesn't go negative
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Format MM:SS
    const displayString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    questionTimerDisplay.textContent = displayString;

    if (timeLeft <= 0 && questionTimerIntervalId) {
        console.log("Timer display reached 00:00, clearing interval.");
        clearInterval(questionTimerIntervalId); // Stop interval when time reaches 0
        questionTimerIntervalId = null;
        // Timer itself (questionTimerId) handles the stop action
    }
}

// updateInterviewButtonStates: Manages button visibility and enabled state
function updateInterviewButtonStates() {
    // Ensure elements exist
    if (!startRecordingBtn || !stopRecordingBtn || !nextQuestionBtn || !finishInterviewBtn) {
        console.error("One or more interview control buttons are missing from the DOM.");
        return;
    }

    // Default states
    startRecordingBtn.disabled = true; // Usually disabled unless explicitly enabled
    stopRecordingBtn.disabled = true;
    nextQuestionBtn.style.display = 'none';
    finishInterviewBtn.style.display = 'none';

    // Check prerequisites
    if (!currentInterviewState?.questions || currentInterviewState.questions.length === 0 || !mediaStream || !mediaStream.active) {
         // If no questions or webcam error, keep all disabled
         if (!mediaStream || !mediaStream.active) {
              // Optionally show webcam error state on start button?
              // startRecordingBtn.textContent = "Webcam Error";
         }
         return;
    }

    const state = currentInterviewState;
    const index = state.currentQuestionIndex;
    const totalQuestions = state.questions.length;

    if (index < 0 || index >= totalQuestions) {
        console.error("Invalid question index in updateInterviewButtonStates:", index);
        return; // Invalid state
    }

    const answerRecorded = (state.videoURLs[index] !== null) || (state.answers[index] !== null && !state.answers[index]?.startsWith('(Video Upload Failed'));
    const isLastQuestion = index === totalQuestions - 1;

    // --- Logic ---
    if (isRecording) {
        // Currently recording: Only Stop should be enabled
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
        nextQuestionBtn.style.display = 'none';
        finishInterviewBtn.style.display = 'none';
    } else {
        // Not currently recording
        stopRecordingBtn.disabled = true; // Stop is disabled if not recording

        if (answerRecorded) {
            // Answer is recorded: Disable Start/Stop. Show Next or Finish.
            startRecordingBtn.disabled = true;
            if (isLastQuestion) {
                finishInterviewBtn.style.display = 'inline-block';
                finishInterviewBtn.disabled = false;
                nextQuestionBtn.style.display = 'none';
            } else {
                nextQuestionBtn.style.display = 'inline-block';
                nextQuestionBtn.disabled = false;
                finishInterviewBtn.style.display = 'none';
            }
        } else {
            // No answer recorded yet: Enable Start. Hide Next/Finish.
            startRecordingBtn.disabled = false; // Ready to record
            nextQuestionBtn.style.display = 'none';
            finishInterviewBtn.style.display = 'none';
        }
    }
     // console.log(`Button States Updated: isRecording=${isRecording}, answerRecorded=${answerRecorded}, isLast=${isLastQuestion}`);
}


// --- Event Listeners for Interview Controls ---
if (startRecordingBtn) startRecordingBtn.addEventListener('click', () => {
    console.log("Manual Start Recording button clicked.");
    clearTimeout(autoStartTimerId); // Cancel any pending auto-start
    autoStartTimerId = null;
    startRecording(); // Attempt manual start
     // Start the timer manually ONLY IF recording actually started
     if (isRecording) {
         console.log(`Starting 2-minute timer for Q${currentInterviewState.currentQuestionIndex + 1} after manual start.`);
         const timerEndTime = Date.now() + QUESTION_TIME_LIMIT_MS;
         updateTimerDisplay(timerEndTime);
         if (questionTimerDisplay) questionTimerDisplay.classList.remove('hidden');
         questionTimerIntervalId = setInterval(() => updateTimerDisplay(timerEndTime), 1000);
         questionTimerId = setTimeout(() => {
             console.log(`Timer expired for Q${currentInterviewState.currentQuestionIndex + 1} (manual start). Auto-stopping.`);
             if (isRecording) {
                 if (recordingStatusSpan) recordingStatusSpan.textContent = 'Time is up! Processing answer...';
                 stopRecording();
             }
         }, QUESTION_TIME_LIMIT_MS);
     }
});

if (stopRecordingBtn) stopRecordingBtn.addEventListener('click', () => {
     console.log("Manual Stop Recording button clicked.");
     stopRecording(); // This also clears timers
});

if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', () => {
    // Button state logic should prevent clicking while recording
    if (!isRecording && currentInterviewState.currentQuestionIndex < currentInterviewState.questions.length - 1) {
        console.log("Next Question button clicked.");
        clearTimers(); // Clear timers before moving on
        currentInterviewState.currentQuestionIndex++;
        displayNextQuestion(); // This will set up new timers/auto-start for the next question
    } else {
         console.warn(`Next question clicked but conditions not met: isRecording=${isRecording}, index=${currentInterviewState.currentQuestionIndex}`);
    }
});

if (finishInterviewBtn) finishInterviewBtn.addEventListener('click', () => {
     // Button state logic should prevent clicking while recording
    if (!isRecording) {
        console.log("Finish Interview button clicked.");
        clearTimers(); // Clear timers before finishing
        finishInterview();
    } else {
        console.warn("Finish interview clicked while recording - ignored.");
    }
});


// finishInterview: Generates feedback using Vision (Base64), saves report
async function finishInterview() {
     console.log("Attempting to finish interview...");
     clearTimers(); // Ensure timers are stopped

     if (!currentUser || !currentUserData || !currentInterviewState.jobId || !currentInterviewState.candidateResumeURL || !currentInterviewState.candidateResumeMimeType || !db) {
         showInlineMessage(interviewError, "Cannot save interview: Session data or database connection is missing. Please try refreshing.", true);
         addBackButtonToError(interviewError);
         stopWebcamStream(); // Clean up webcam
         return;
     }

     // Check if all questions have been processed (either video URL or failure message)
     const firstUnprocessedIndex = currentInterviewState.answers.findIndex((ans, i) => ans === null && currentInterviewState.videoURLs[i] === null);
     if (firstUnprocessedIndex !== -1) {
         showInlineMessage(interviewError, `Cannot finish interview. Question ${firstUnprocessedIndex + 1} has not been answered or processed yet.`, true);
         // Do NOT add back button here, let them potentially fix the question
         // Maybe force display of the problematic question?
         // currentInterviewState.currentQuestionIndex = firstUnprocessedIndex;
         // displayNextQuestion(); // Re-display the question
         return;
     }
     console.log("All questions processed. Proceeding to finalize.");

     // Update UI to show final processing
     if (interviewQAArea) interviewQAArea.style.display = 'none';
     if (interviewLoading) {
         interviewLoading.textContent = "Analyzing resume image for final feedback...";
         interviewLoading.style.display = 'block';
     }
     showInlineMessage(interviewError, null); // Clear previous errors
     stopWebcamStream(); // Stop webcam now

     try {
         // ** Fetch and convert resume image to Base64 AGAIN for feedback generation **
         const resumeBase64Data = await imageUrlToBase64(currentInterviewState.candidateResumeURL);
         console.log("Resume image converted to Base64 for feedback generation.");

         if (interviewLoading) interviewLoading.textContent = "Generating final AI feedback...";

         // --- Construct Feedback Prompt for Gemini ---
         const candidateExp = currentUserData.experience !== undefined ? `${currentUserData.experience} years` : 'experience not specified';
         let feedbackPrompt = `You are an AI evaluating a candidate's video interview responses and resume image.
Candidate applying for: "${currentInterviewState.jobTitle}"
Job Description: "${currentInterviewState.jobDescription}"
Candidate Experience: ${candidateExp}

Candidate Resume: [Image is attached]
Interview Q&A (Simulated Text based on video uploads):
---
`;
         currentInterviewState.questions.forEach((q, i) => {
             const answerText = currentInterviewState.answers[i] || '(No answer processed)';
             const videoInfo = currentInterviewState.videoURLs[i] ? `(Video: ${currentInterviewState.videoURLs[i]})` : '(Video upload failed or N/A)';
             feedbackPrompt += `Q${i + 1}: ${q}\nA${i + 1}: ${answerText} ${videoInfo}\n---\n`;
         });

         feedbackPrompt += `\nEvaluation Instructions:
1.  **Resume Analysis:** Briefly analyze the key skills, experiences, and overall presentation visible in the attached resume image. How relevant is it to the job title and description?
2.  **Answer Feedback:** Briefly evaluate the simulated answers provided. Consider relevance to the questions (which were based on the resume) and the job requirements. Note: Since the text is simulated, focus on the *potential* points covered if the video were transcribed, relating back to the resume content.
3.  **Overall Evaluation:** Provide a concise overall summary of the candidate's suitability based *only* on the resume image content and the simulated Q&A. Mention strengths and potential areas for clarification.
4.  **Overall Score:** Assign an overall score out of 100 based on the combined fit of the resume image and simulated answers to the job. Provide a brief justification.
5.  **Resume Score:** Assign a score out of 100 based *only* on the quality, clarity, relevance, and effectiveness of the resume image itself for the target role. Provide a brief justification.

Output Format (Use Markdown headings EXACTLY):
**Resume Analysis:**
[Your analysis of the resume image content]

**Answer Feedback:**
[Your feedback on the simulated answers in relation to the resume and job]

**Overall Evaluation:**
[Your overall evaluation summary]

**Overall Score:** [Score]/100 - [Brief justification]

**Resume Score:** [Score]/100 - [Brief justification]`;


         // Prepare image data object with BASE64
         const imageDataForApi = {
             mimeType: currentInterviewState.candidateResumeMimeType,
             base64Data: resumeBase64Data
         };

         // --- Call Gemini API for Feedback ---
         const feedbackResult = await callGeminiAPI(feedbackPrompt, imageDataForApi);
         console.log("AI feedback generated.");

         // --- Parse Scores from Feedback ---
         let overallScoreString = "N/A"; let resumeScoreString = "N/A";
         if (feedbackResult) {
             try {
                 // More robust parsing using regex, looking for the score pattern after the heading
                 const overallMatch = feedbackResult.match(/\*\*Overall Score:\*\*\s*(\d{1,3}\s*\/\s*100.*?)(?:\n\*\*|$)/im);
                 overallScoreString = overallMatch ? overallMatch[1].trim() : "N/A (Parse Failed)";

                 const resumeMatch = feedbackResult.match(/\*\*Resume Score:\*\*\s*(\d{1,3}\s*\/\s*100.*?)(?:\n\*\*|$)/im);
                 resumeScoreString = resumeMatch ? resumeMatch[1].trim() : "N/A (Parse Failed)";

                 if(overallScoreString === "N/A (Parse Failed)") console.warn("Failed to parse Overall Score from feedback.");
                 if(resumeScoreString === "N/A (Parse Failed)") console.warn("Failed to parse Resume Score from feedback.");

             } catch (parseError) {
                 console.error("Error parsing scores from feedback:", parseError);
                 overallScoreString = "N/A (Exception)";
                 resumeScoreString = "N/A (Exception)";
             }
         }

         if (interviewLoading) interviewLoading.textContent = "Saving interview report...";

         // --- Prepare Interview Data for Firestore ---
         const interviewData = {
             jobId: currentInterviewState.jobId,
             jobTitle: currentInterviewState.jobTitle,
             jobDescription: currentInterviewState.jobDescription, // Store job desc for context
             recruiterUID: null, // Will be fetched from job if needed for report view permissions? Add if req.
             candidateUID: currentUser.uid,
             candidateEmail: currentUser.email,
             candidateName: currentUserData.fullname || currentUser.email,
             candidateExperience: currentUserData.experience !== undefined ? currentUserData.experience : null,
             candidateResumeURL: currentInterviewState.candidateResumeURL, // Save Cloudinary URL for viewing
             candidateResumeMimeType: currentInterviewState.candidateResumeMimeType,
             questions: currentInterviewState.questions,
             answers: currentInterviewState.answers, // Contains simulated text or error messages
             videoURLs: currentInterviewState.videoURLs, // Contains Cloudinary URLs or null
             feedback: feedbackResult || "Feedback generation failed.",
             score: overallScoreString,
             resumeScore: resumeScoreString,
             status: 'Pending', // Initial status for recruiter review
             statusNotes: null,
             submittedAt: firebase.firestore.FieldValue.serverTimestamp()
             // Add recruiter info if needed for permissions later
             // recruiterUID: fetchedRecruiterUID,
             // recruiterEmail: fetchedRecruiterEmail
         };

         // --- Save to Firestore ---
         const docRef = await db.collection('interviews').add(interviewData);
         console.log("Interview report saved successfully to Firestore with ID:", docRef.id);

         // --- Show Report ---
         if (interviewLoading) interviewLoading.style.display = 'none';
         if (interviewSection) interviewSection.style.display = 'none';
         viewInterviewReport(docRef.id); // Navigate to the report view

     } catch (error) {
          console.error("Error during interview finalization (Feedback Gen or Save):", error);
          if (interviewLoading) interviewLoading.style.display = 'none';
          // Show error in the interview section, allowing potential retry? Or force back?
          if (interviewSection) interviewSection.style.display = 'block'; // Re-show section to display error
          showInlineMessage(interviewError, `Failed to finalize interview: ${error.message}. Please try again later or contact support.`, true);
          addBackButtonToError(interviewError); // Add back button to escape
          // Stop webcam just in case it wasn't stopped
          stopWebcamStream();
     }
}


// --- Report Viewing & Other Functions ---

// Go back to the appropriate dashboard
function goBackToDashboard() {
    // Clear all potentially active states
    if (reportSection) reportSection.style.display = 'none';
    if (interviewSection) interviewSection.style.display = 'none';
    if (resumeUploadSection) resumeUploadSection.style.display = 'none';
    clearAllSections(); // This stops webcam, clears timers, resets state

    // No need to reset state here, clearAllSections does it.
    // selectedInterviewForReport = null;
    // currentInterviewState = { ... };
    // stopWebcamStream(); // Called by clearAllSections

    showGlobalLoading(true); // Show loading while determining dashboard

    if (!currentUser || !currentUserData) {
        // If somehow logged out, show auth section
        if (authSection) authSection.style.display = 'block';
        console.log("Going back to dashboard, but user is logged out.");
    } else {
        // Ensure user info is visible
        if (userInfoSection) userInfoSection.style.display = 'flex';
        // Show the correct dashboard based on role
        if (currentUserData.role === 'recruiter') {
            if (recruiterDashboard) recruiterDashboard.style.display = 'block';
            loadRecruiterJobs(); // Reload jobs
            if (candidatesList) candidatesList.innerHTML = '<p class="list-empty-msg">Select a job above to see candidates.</p>'; // Reset candidates list
            if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select job)'; // Reset title
            console.log("Navigating back to Recruiter Dashboard.");
        } else if (currentUserData.role === 'candidate') {
            if (candidateDashboard) candidateDashboard.style.display = 'block';
            loadAvailableJobs(); // Reload available jobs
            loadMyInterviews(); // Reload interview history
            console.log("Navigating back to Candidate Dashboard.");
        } else {
            // Invalid role, show auth section as fallback
            if (authSection) authSection.style.display = 'block';
            showAuthMessage("Invalid user role detected. Logging out.", true);
            logout();
            console.error("Invalid user role on navigating back to dashboard:", currentUserData.role);
        }
    }
    showGlobalLoading(false); // Hide loading after dashboard is potentially visible
}
if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', goBackToDashboard);


// View Interview Report (Used by both Candidate and Recruiter)
function viewInterviewReport(interviewId) {
    if (!interviewId) {
        console.error("viewInterviewReport called with no ID.");
        alert("Error: Cannot load report without an ID.");
        goBackToDashboard();
        return;
    }
    console.log("Loading report for interview ID:", interviewId);

    clearAllSections(); // Clear everything first
    showGlobalLoading(true);
    if (reportSection) reportSection.style.display = 'block';
    if (userInfoSection) userInfoSection.style.display = 'flex'; // Keep user info visible

    // Reset report fields
    if (reportContent) reportContent.innerHTML = '<div class="loading">Loading Questions & Answers...</div>';
    if (feedbackContent) feedbackContent.style.display = 'none'; // Hide content area
    if (loadingFeedback) loadingFeedback.style.display = 'block'; // Show loading spinner
    showInlineMessage(errorFeedback, null); // Clear errors
    if (recruiterStatusUpdateDiv) recruiterStatusUpdateDiv.style.display = 'none'; // Hide recruiter controls initially
    if (reportResumeLinkArea) reportResumeLinkArea.style.display = 'none'; // Hide resume link initially

    if (!db || !currentUser || !currentUserData) {
         handleFirestoreError({ message: "Authentication or Database service unavailable." }, errorFeedback, "loading report prerequisites");
         addBackButtonToError(errorFeedback); // Use errorFeedback as container
         showGlobalLoading(false);
         return;
    }

    db.collection('interviews').doc(interviewId).get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error(`Interview report with ID ${interviewId} was not found.`);
            }
            const interview = doc.data();
             // Check permissions (basic check: user must be candidate or recruiter associated with the job)
             // More robust check: Fetch job data if recruiterUID is not on interview doc?
             const isCandidate = interview.candidateUID === currentUser.uid;
             // Assuming recruiterUID might be added later or fetched via jobID:
             // const isRecruiter = currentUserData.role === 'recruiter' && interview.jobId === some_selected_job_id;
             const isRecruiter = currentUserData.role === 'recruiter'; // Simplified check for now

             if (!isCandidate && !isRecruiter) { // Basic permission check
                  throw new Error("You do not have permission to view this report.");
             }

            selectedInterviewForReport = { ...interview, id: interviewId }; // Store for status update

            // --- Populate Header ---
            if (reportJobTitleSpan) reportJobTitleSpan.textContent = escapeHtml(interview.jobTitle || 'N/A');
            if (reportCandidateEmailSpan) reportCandidateEmailSpan.textContent = escapeHtml(interview.candidateEmail || 'N/A');
            const status = interview.status || 'Pending';
            if (reportStatusSpan) {
                reportStatusSpan.textContent = escapeHtml(status);
                reportStatusSpan.className = `interview-status status-${status.toLowerCase().replace(/\s+/g, '-')}`; // Set class for styling
            }

            // --- Resume Image Link ---
            if (interview.candidateResumeURL && reportResumeLinkArea && reportResumeLink) {
                reportResumeLink.href = interview.candidateResumeURL;
                reportResumeLink.textContent = "View Uploaded Resume Image"; // More descriptive
                reportResumeLinkArea.style.display = 'block'; // Use block for paragraph
            } else {
                reportResumeLinkArea.style.display = 'none';
            }

            // --- Recruiter Controls ---
            if (currentUserData.role === 'recruiter' && recruiterStatusUpdateDiv) {
                recruiterStatusUpdateDiv.style.display = 'block';
                if (updateStatusSelect) updateStatusSelect.value = status; // Set current status
                if (statusNotesInput) statusNotesInput.value = interview.statusNotes || ''; // Set current notes
                showInlineMessage(updateStatusMsg, null); // Clear previous update messages
            }

            // --- AI Feedback ---
            if (loadingFeedback) loadingFeedback.style.display = 'none'; // Hide loading spinner
            showInlineMessage(errorFeedback, null); // Clear errors
            if (feedbackContent) {
                if (interview.feedback && typeof interview.feedback === 'string') {
                    feedbackContent.innerHTML = formatFeedbackWithScoresVision(interview.feedback, interview.score, interview.resumeScore);
                    feedbackContent.style.display = 'block';
                } else {
                    // Show message if feedback is missing or not a string
                    showInlineMessage(errorFeedback, "AI feedback is not available for this interview.", false);
                    feedbackContent.style.display = 'none'; // Ensure content area is hidden
                }
            }

            // --- Q&A ---
            if (reportContent) {
                reportContent.innerHTML = generateQAReport(interview); // Generate and display Q&A HTML
            }

        }).catch(error => {
            console.error("Error loading interview report:", error);
            handleFirestoreError(error, errorFeedback, `loading report ${interviewId}`);
            addBackButtonToError(errorFeedback); // Add back button to error message area
            // Hide the content areas if loading failed
            if (reportContent) reportContent.innerHTML = '';
            if (feedbackContent) feedbackContent.style.display = 'none';
        }).finally(() => {
            showGlobalLoading(false); // Hide global loading
        });
}

// Recruiter Status Update Listener
if (updateStatusBtn) updateStatusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!db || !currentUser || currentUserData?.role !== 'recruiter' || !selectedInterviewForReport?.id) {
        return showInlineMessage(updateStatusMsg, 'Error: Cannot update status. Invalid context or permissions.', true);
    }

    const newStatus = updateStatusSelect?.value;
    const notes = statusNotesInput?.value.trim();

    if (!newStatus) return showInlineMessage(updateStatusMsg, 'Please select a status.', true);

    updateStatusBtn.disabled = true;
    showInlineMessage(updateStatusMsg, 'Updating status...', false);

    db.collection('interviews').doc(selectedInterviewForReport.id).update({
        status: newStatus,
        statusNotes: notes || null, // Store null if empty
        statusUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        statusUpdatedByUID: currentUser.uid, // Track who updated
        statusUpdatedByEmail: currentUser.email
    })
    .then(() => {
        console.log(`Interview ${selectedInterviewForReport.id} status updated to ${newStatus} by ${currentUser.email}`);
        showInlineMessage(updateStatusMsg, 'Status updated successfully!', false);
        // Update status display in the report header
        if (reportStatusSpan) {
            reportStatusSpan.textContent = escapeHtml(newStatus);
            reportStatusSpan.className = `interview-status status-${newStatus.toLowerCase().replace(/\s+/g, '-')}`;
        }
        // Update local state if needed, though typically reload/re-query is better
        selectedInterviewForReport.status = newStatus;
        selectedInterviewForReport.statusNotes = notes || null;
        setTimeout(() => showInlineMessage(updateStatusMsg, null), 4000); // Clear message after delay
        // Consider reloading candidate list if recruiter stays on dashboard
        // loadCandidatesForJob(selectedInterviewForReport.jobId);
    })
    .catch(error => {
         console.error("Error updating status:", error);
         handleFirestoreError(error, updateStatusMsg, "updating interview status");
    })
    .finally(() => {
        updateStatusBtn.disabled = false; // Re-enable button
    });
});

// Helper: Format AI Feedback WITH SCORES for display (VISION version)
function formatFeedbackWithScoresVision(feedbackText, overallScoreString, resumeScoreString) {
    if (!feedbackText || typeof feedbackText !== 'string') {
        return '<p class="message">Feedback data is missing or invalid.</p>';
    }

    // Use regex to extract sections based on markdown headings
    const resumeAnalysisMatch = feedbackText.match(/\*\*Resume Analysis:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/im);
    const feedbackMatch = feedbackText.match(/\*\*Answer Feedback:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/im);
    const evaluationMatch = feedbackText.match(/\*\*Overall Evaluation:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/im);

    // Use provided score strings first, fallback to parsing from text if necessary (or if parsing failed during save)
    let overallScoreContent = overallScoreString || "N/A";
    if (overallScoreContent === "N/A" || overallScoreContent.includes("Parse Failed") || overallScoreContent.includes("Exception")) {
        const oMatch = feedbackText.match(/\*\*Overall Score:\*\*\s*(\d{1,3}\s*\/\s*100.*?)(?:\n\*\*|$)/im);
        overallScoreContent = oMatch ? oMatch[1].trim() : overallScoreString; // Keep original N/A if still not found
    }

    let resumeScoreContent = resumeScoreString || "N/A";
    if (resumeScoreContent === "N/A" || resumeScoreContent.includes("Parse Failed") || resumeScoreContent.includes("Exception")) {
        const rMatch = feedbackText.match(/\*\*Resume Score:\*\*\s*(\d{1,3}\s*\/\s*100.*?)(?:\n\*\*|$)/im);
        resumeScoreContent = rMatch ? rMatch[1].trim() : resumeScoreString;
    }

    // Extract content or provide defaults
    const resumeAnalysis = resumeAnalysisMatch ? escapeHtml(resumeAnalysisMatch[1].trim()).replace(/\n/g, '<br>') : '(Resume analysis not found in feedback)';
    const detailedFeedback = feedbackMatch ? escapeHtml(feedbackMatch[1].trim()).replace(/\n/g, '<br>') : '(Answer feedback not found in feedback)';
    const overallEvaluation = evaluationMatch ? escapeHtml(evaluationMatch[1].trim()).replace(/\n/g, '<br>') : '(Overall evaluation not found in feedback)';

    // Fallback: Show raw text if no sections were parsed correctly
    let fallbackFeedback = '';
    if (!resumeAnalysisMatch && !feedbackMatch && !evaluationMatch) {
        console.warn("Could not parse structured feedback. Displaying raw text.");
        fallbackFeedback = `<p style="margin-top: 1rem;"><strong>Raw AI Output:</strong></p><pre class="answer-text" style="white-space: pre-wrap;">${escapeHtml(feedbackText)}</pre>`;
    }

    return `
        <div class="feedback-section">
            ${resumeAnalysisMatch ? `<h4>Resume Analysis (from Image):</h4><p>${resumeAnalysis}</p>` : `<p><em>${resumeAnalysis}</em></p>`}
            ${feedbackMatch ? `<h4 style="margin-top: var(--space-md);">Answer Feedback (Simulated):</h4><p>${detailedFeedback}</p>` : `<p style="margin-top: var(--space-md);"><em>${detailedFeedback}</em></p>`}
            ${evaluationMatch ? `<h4 style="margin-top: var(--space-md);">Overall Evaluation:</h4><p>${overallEvaluation}</p>` : `<p style="margin-top: var(--space-md);"><em>${overallEvaluation}</em></p>`}

            <div style="margin-top: var(--space-lg);">
                <h4>Scores:</h4>
                <p>
                    <span class="feedback-score-display">Overall Fit: ${escapeHtml(overallScoreContent)}</span>
                    <span class="feedback-score-display">Resume Quality: ${escapeHtml(resumeScoreContent)}</span>
                </p>
            </div>
            ${fallbackFeedback}
        </div>`;
}

// Helper: Generate Q&A Report HTML
function generateQAReport(interview) {
    if (!interview?.questions || !Array.isArray(interview.questions) || interview.questions.length === 0) {
        return '<p class="message">No Questions & Answers were recorded for this interview.</p>';
    }

    const answers = interview.answers || [];
    const videoURLs = interview.videoURLs || [];
    let html = '';

    interview.questions.forEach((q, i) => {
        const ans = (i < answers.length && answers[i]) ? answers[i] : '(Answer processing pending or failed)';
        const vidUrl = (i < videoURLs.length) ? videoURLs[i] : null;

        let vidLink = '';
        if (vidUrl && typeof vidUrl === 'string' && vidUrl.startsWith('http')) {
            vidLink = `<p><a href="${vidUrl}" target="_blank" rel="noopener noreferrer" class="btn secondary-btn small-btn">Watch Video Recording (Q${i+1})</a></p>`;
        } else if (ans.includes("Video Upload Failed")) {
             vidLink = `<p class="message inline-msg error-message">(Video Upload Failed)</p>`;
        }
         else {
             vidLink = `<p class="message inline-msg">(Video Not Available)</p>`;
        }

        html += `
            <div class="qa-block">
                <h4>Question ${i+1}:</h4>
                <p class="question-text">${escapeHtml(q)}</p>
                <h4>Answer (Simulated Text / Status):</h4>
                <pre class="answer-text">${escapeHtml(ans)}</pre>
                ${vidLink}
            </div>
            ${i < interview.questions.length - 1 ? '<hr class="qa-separator">' : ''}`; // Add separator between questions
    });
    return html;
}

// Helper: Adds 'Back to Dashboard' button inside a container element during error states
function addBackButtonToError(errorElementContainer) {
     // Check if the container exists and if a button isn't already there
    if (!errorElementContainer || !errorElementContainer.parentNode || errorElementContainer.parentNode.querySelector('.back-btn-error')) {
        // console.log("Skipping addBackButtonToError: Container missing or button already exists.");
        return;
    }
    console.log("Adding 'Back to Dashboard' button to error display.");
    const btn = document.createElement('button');
    btn.textContent = '← Back to Dashboard';
    btn.classList.add('btn', 'secondary-btn', 'back-btn-error'); // Use classes from style.css
    // Style is now primarily handled by CSS class .back-btn-error
    // btn.style.cssText = 'margin-top: var(--space-md); display: block; margin-left: auto; margin-right: auto; max-width: 200px;';
    btn.onclick = goBackToDashboard; // Use the existing function

    // Append the button *after* the error message container for better flow
    errorElementContainer.parentNode.insertBefore(btn, errorElementContainer.nextSibling);
}


// --- Initial Load Trigger ---
document.addEventListener('DOMContentLoaded', () => {
     console.log("DOM Loaded. Initializing Application...");

     // --- Configuration Checks ---
     let configError = false;
     if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.apiKey.startsWith("AIza") || firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY") {
         configError = true; console.error("CRITICAL: Firebase config error or using placeholder!");
         showAuthMessage("CRITICAL: Firebase Configuration Error.", true);
     }
     if (!GEMINI_API_KEY || !GEMINI_API_KEY.startsWith("AIza") || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
          console.warn("Gemini API Key missing or using placeholder. AI features will fail.");
          // Don't set configError = true, allow app to load partially
     }
     if (!CLOUDINARY_CLOUD_NAME || !VIDEO_CLOUDINARY_UPLOAD_PRESET || !RESUME_CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME === "YOUR_CLOUDINARY_CLOUD_NAME") {
          console.warn("Cloudinary config missing or using placeholder. Uploads will fail.");
          // Don't set configError = true, allow app to load partially
     }

     if (configError) {
         console.error("Halting initialization due to critical Firebase config error.");
         if(authSection) authSection.style.display='block'; // Show login as fallback
         if(globalLoading) globalLoading.style.display='none';
         if (mainContent) mainContent.style.display = 'block'; // Ensure main is visible to show auth section
         return; // Stop further execution
     }

     // Prevent default form submissions (handled by button clicks)
     loginForm?.addEventListener('submit', (e) => e.preventDefault());
     signupForm?.addEventListener('submit', (e) => e.preventDefault());
     forgotPasswordForm?.addEventListener('submit', (e) => e.preventDefault());
     document.getElementById('post-job-form')?.addEventListener('submit', (e) => e.preventDefault());

     console.log("Initial checks passed. Waiting for Firebase Auth state...");
     // Firebase auth.onAuthStateChanged listener (setup earlier) will handle the main application flow.
     // Display initial loading state until auth state is resolved
     showGlobalLoading(true);

     // Test message display
     // showAuthMessage("App Initialized.", false);
     // showInlineMessage(postJobMsg, "Test inline message", false);
});