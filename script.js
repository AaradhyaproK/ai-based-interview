// --- Firebase Configuration ---
// !!! --- CRITICAL SECURITY WARNING --- !!!
// Replace with your *NEW* project's Firebase configuration!
// The keys shared previously ARE LIKELY COMPROMISED.
// Consider using environment variables or a backend for production.
const firebaseConfig = {
    apiKey: "AIzaSyAvb4xyFo_R8KW2WH3V9YcBBv4eeDoPEx8",
    authDomain: "fir-ai-interview.firebaseapp.com",
    projectId: "fir-ai-interview",
    storageBucket: "fir-ai-interview.firebasestorage.app",
    messagingSenderId: "1062000559385",
    appId: "1:1062000559385:web:acc0e5815f3c9433eeb188",
    measurementId: "G-GYPNPES5RL"
  };

// --- Gemini Configuration ---
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
// !!! --- CRITICAL SECURITY WARNING --- !!!
// The Gemini key shared previously IS COMPROMISED. DELETE IT.
// Replace with your *NEW* Gemini API key.
// Hardcoding API keys client-side is DANGEROUSLY insecure. Use a backend proxy for production.
const GEMINI_API_KEY = 'AIzaSyDdzdinlqXV0rQhB8BW0zoTaaGZD0ts_8o'; // <-- REPLACE
const NUM_QUESTIONS = 5; // Number of questions per interview

// --- Cloudinary Configuration ---
// !!! --- CLOUDINARY SETUP REQUIRED --- !!!
// Replace with your Cloudinary details and ensure the upload preset is UNSIGNED.
const CLOUDINARY_CLOUD_NAME = "dfp563ini"; // <-- REPLACE
const CLOUDINARY_UPLOAD_PRESET = "Ai-interview"; // <-- REPLACE
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

// --- Initialize Firebase ---
try {
    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_NEW")) {
         throw new Error("Firebase config missing or uses placeholders.");
    }
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase initialization critical error:", e);
    document.body.innerHTML = `<div class="error-message container" style="padding: 30px;">CRITICAL ERROR: Could not initialize Firebase. Please check your configuration in script.js. ${e.message}</div>`;
}
// Proceed only if initialization didn't throw
let auth, db;
if (typeof firebase !== 'undefined') {
    auth = firebase.auth();
    db = firebase.firestore();
    // storage = firebase.storage(); // Uncomment if using Firebase Storage uploads
} else {
     // Handle case where firebase object isn't available (initialization failed)
     console.error("Firebase object not available after initialization attempt.");
     if (!document.body.innerHTML.includes("CRITICAL ERROR")) { // Avoid duplicate messages
          document.body.innerHTML = `<div class="error-message container" style="padding: 30px;">CRITICAL ERROR: Firebase SDK failed to load or initialize properly.</div>`;
     }
}


// --- DOM Elements ---
// Auth & User Info
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

// Interview Section Elements
const interviewSection = document.getElementById('interview-section');
const interviewJobTitleSpan = document.getElementById('interview-job-title');
const interviewLoading = document.getElementById('interview-loading');
const interviewError = document.getElementById('interview-error');
const interviewQAArea = document.getElementById('interview-qa-area');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
// Video Elements
const videoArea = document.getElementById('video-area');
const webcamFeed = document.getElementById('webcam-feed');
const startRecordingBtn = document.getElementById('start-recording-btn');
const stopRecordingBtn = document.getElementById('stop-recording-btn');
const recordingStatusSpan = document.getElementById('recording-status');
const nextQuestionBtn = document.getElementById('next-question-btn');
const finishInterviewBtn = document.getElementById('finish-interview-btn');
const sttSimulationNote = document.getElementById('stt-simulation-note');
const loadingAnswer = document.getElementById('loading-answer');

// Report Section Elements
const reportSection = document.getElementById('report-section');
const reportJobTitleSpan = document.getElementById('report-job-title');
const reportCandidateEmailSpan = document.getElementById('report-candidate-email');
const reportStatusSpan = document.getElementById('report-status');
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
const globalError = document.getElementById('global-error'); // Use this for critical global errors


// --- State Variables ---
let currentUser = null;
let currentUserData = null; // Stores { role, fullname, experience } from Firestore
let currentInterviewState = {
    jobId: null,
    jobTitle: null,
    questions: [],
    answers: [], // Stores SIMULATED TEXT answers
    videoURLs: [], // Stores Cloudinary video URLs
    currentQuestionIndex: 0
};
let selectedInterviewForReport = null; // Stores data of the interview being viewed in report
// Video Recording State
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;


// --- Utility Functions ---
function showGlobalLoading(isLoading) {
    if (globalLoading) globalLoading.style.display = isLoading ? 'flex' : 'none';
}

function showAuthMessage(message, isError = false) {
    const targetElement = isError ? authError : authMessage;
    const otherElement = isError ? authMessage : authError;
    if (targetElement) {
        targetElement.textContent = message;
        targetElement.style.display = message ? 'block' : 'none';
    }
    if (otherElement) otherElement.style.display = 'none';
}

function showInlineMessage(element, message, isError = false) {
    if (!element) return; // Ignore if element doesn't exist
    element.textContent = message;
    // Use more specific classes if available, fallback to generic
    const errorClass = element.classList.contains('inline-msg') ? 'error-message inline-msg' : 'error-message';
    const successClass = element.classList.contains('inline-msg') ? 'message inline-msg' : 'message';
    element.className = isError ? errorClass : successClass;
    element.style.display = message ? 'block' : 'none';
}

function clearAllSections() {
    const sections = mainContent?.children;
    if (!sections) return;
    for (let section of sections) {
        // Keep header/footer, hide others unless global loading/error
        if (section.id !== 'global-loading' && section.id !== 'global-error' && section.tagName !== 'HEADER' && section.tagName !== 'FOOTER') {
            section.style.display = 'none';
        }
    }
    if (userInfoSection) userInfoSection.style.display = 'none';
    showAuthMessage(null); // Clear auth messages
    stopWebcamStream(); // Ensure webcam is off when navigating away
}

function formatExperience(exp) {
    if (exp === null || exp === undefined || exp === '' || isNaN(exp)) return 'N/A';
    return `${exp}`;
}

// --- UI Updates ---
function updateUIBasedOnAuthState(user) {
    clearAllSections(); // Clear everything first
    if (user) {
        currentUser = user;
        showGlobalLoading(true);
        // Ensure db is initialized before using it
        if (!db) {
             console.error("Firestore (db) not initialized. Cannot fetch user data.");
             showAuthMessage("Internal Error: Database connection failed.", true);
             showGlobalLoading(false);
             // Optionally try to log out the user if stuck
             // if (auth) auth.signOut();
             return;
        }
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    currentUserData = doc.data();
                    if (userEmailSpan) userEmailSpan.textContent = user.email;
                    if (userFullnameSpan) userFullnameSpan.textContent = currentUserData.fullname || user.email;
                    if (userRoleSpan) userRoleSpan.textContent = currentUserData.role || 'Unknown';
                    if (userExperienceSpan) userExperienceSpan.textContent = formatExperience(currentUserData.experience);
                    if (userInfoSection) userInfoSection.style.display = 'flex';

                    if (currentUserData.role === 'recruiter') {
                        if (recruiterDashboard) recruiterDashboard.style.display = 'block';
                        loadRecruiterJobs(); // Load data specific to recruiter
                        if (candidatesList) candidatesList.innerHTML = 'Select a job to view candidates.';
                        if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select a job)';
                    } else if (currentUserData.role === 'candidate') {
                        if (candidateDashboard) candidateDashboard.style.display = 'block';
                        loadAvailableJobs(); // Load data specific to candidate
                        loadMyInterviews();
                    } else {
                        showAuthMessage("Your user profile has an invalid role.", true);
                        logout(); // Log out user with invalid role
                    }
                } else {
                    // User exists in Auth but not Firestore - potentially incomplete signup
                    showAuthMessage("Your user profile data is missing. Please sign up again or contact support.", true);
                    logout();
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                showAuthMessage(`Error loading your profile: ${error.message}`, true);
                logout(); // Log out if profile fetch fails
            })
            .finally(() => {
                showGlobalLoading(false);
            });
    } else {
        // User is logged out
        currentUser = null;
        currentUserData = null;
        if (authSection) authSection.style.display = 'block';
        if (loginForm) loginForm.style.display = 'block'; // Default to login
        if (signupForm) signupForm.style.display = 'none';
        if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        showGlobalLoading(false);
    }
}

// --- Authentication Logic ---
// Ensure auth is initialized before adding listener
if (auth) {
    auth.onAuthStateChanged(updateUIBasedOnAuthState);
} else {
    console.error("Firebase Auth not initialized. Authentication flow disabled.");
    // Display an error to the user if auth is critical and failed
    showAuthMessage("Authentication service failed to load. Please refresh or contact support.", true);
    if (authSection) authSection.style.display = 'block'; // Show auth section with error
}


// Signup
if (signupBtn) signupBtn.addEventListener('click', () => {
    // Ensure db is available
    if (!db) return showAuthMessage("Database connection error. Cannot sign up.", true);

    const email = signupEmailInput?.value.trim();
    const password = signupPasswordInput?.value;
    const fullname = signupFullnameInput?.value.trim();
    const experience = signupExperienceInput?.value;
    const role = signupRoleSelect?.value;

    showAuthMessage(null); // Clear previous messages
    // Input validation
    if (!fullname) return showAuthMessage("Please enter your full name.", true);
    if (!email) return showAuthMessage("Please enter your email.", true);
    if (!password || password.length < 6) return showAuthMessage("Password must be at least 6 characters long.", true);
    if (experience === '' || experience === null || isNaN(parseInt(experience)) || parseInt(experience) < 0) return showAuthMessage("Please enter valid years of experience (0 or more).", true);
    if (!role) return showAuthMessage("Please select your role.", true);

    signupBtn.disabled = true;
    showGlobalLoading(true);

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
             const experienceNum = parseInt(experience);
            // Store user profile in Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                fullname: fullname,
                experience: experienceNum,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            console.log("User signed up and profile stored.");
            // onAuthStateChanged will handle UI update upon successful login
        })
        .catch(error => {
            console.error("Signup Error:", error);
            showAuthMessage(`Signup failed: ${error.message}`, true);
        })
         .finally(() => {
            signupBtn.disabled = false;
            showGlobalLoading(false);
        });
});

// Login
if (loginBtn) loginBtn.addEventListener('click', () => {
    const email = loginEmailInput?.value.trim();
    const password = loginPasswordInput?.value;
    showAuthMessage(null);
    if (!email || !password) return showAuthMessage("Please provide email and password.", true);

    loginBtn.disabled = true;
    showGlobalLoading(true);

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
             console.log("Login successful");
             // onAuthStateChanged handles UI update
        })
        .catch(error => {
            console.error("Login Error:", error);
            showAuthMessage(`Login failed: ${error.message}`, true);
        })
        .finally(() => {
            loginBtn.disabled = false;
            showGlobalLoading(false);
        });
});

// Logout
if (logoutBtn) logoutBtn.addEventListener('click', () => {
    stopWebcamStream(); // Stop webcam if running
    auth.signOut().then(() => {
        console.log("User logged out.");
        // onAuthStateChanged handles UI update
    }).catch(error => {
        console.error("Logout error:", error);
        showAuthMessage("Error logging out.", true);
    });
});

// Password Reset Logic
if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('forgot'); });
if (resetPasswordBtn) resetPasswordBtn.addEventListener('click', () => {
    const email = resetEmailInput?.value.trim();
    showAuthMessage(null);
    if (!email) return showAuthMessage("Please enter your email address.", true);

    resetPasswordBtn.disabled = true;
    showGlobalLoading(true);
    auth.sendPasswordResetEmail(email)
        .then(() => {
            showAuthMessage("Password reset email sent! Check your inbox (and spam folder).", false);
            if (resetEmailInput) resetEmailInput.value = '';
             // Return to login form after a delay
             setTimeout(() => { if (forgotPasswordForm?.style.display === 'block') toggleAuthForms('login'); }, 5000);
        })
        .catch(error => { showAuthMessage(`Error sending reset email: ${error.message}`, true); })
        .finally(() => { resetPasswordBtn.disabled = false; showGlobalLoading(false); });
});
if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('login'); });

// Auth Form Toggles
if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('signup'); });
if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms('login'); });

function toggleAuthForms(formToShow) {
    if (loginForm) loginForm.style.display = formToShow === 'login' ? 'block' : 'none';
    if (signupForm) signupForm.style.display = formToShow === 'signup' ? 'block' : 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = formToShow === 'forgot' ? 'block' : 'none';
    showAuthMessage(null); // Clear messages when switching
}


// --- Gemini API Call ---
async function callGeminiAPI(prompt) {
    // !! SECURITY WARNING !! - Your Gemini API Key is hardcoded here. INSECURE.
    console.warn("Calling Gemini API from Client-Side with Hardcoded Key - INSECURE!");
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_NEW")) {
        throw new Error("Gemini API Key is missing or is a placeholder in script.js.");
    }

    const url = `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`;
    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [ // Standard safety settings
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
        // Add generationConfig if needed (e.g., temperature, maxOutputTokens)
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        const responseBody = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error Response:", responseBody);
            const errorMessage = responseBody.error?.message || `API request failed (${response.status})`;
            throw new Error(errorMessage);
        }
        // Check for explicit blocks or missing content
        if (responseBody.candidates?.[0]?.finishReason === 'SAFETY') {
             throw new Error("Response blocked by Gemini's safety settings.");
        }
        if (responseBody.promptFeedback?.blockReason){
             throw new Error(`Request blocked due to: ${responseBody.promptFeedback.blockReason}`);
        }
        const text = responseBody.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text === undefined || text === null) {
            console.error("Unexpected Gemini API response structure:", responseBody);
            throw new Error("Could not parse valid text from Gemini response.");
        }
        return text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        let displayError = `Gemini API call failed: ${error.message}. Check API key, network, and console.`;
        // Refine error messages based on common issues
        if (error.message.includes("API key not valid")) {
             displayError = "Gemini API call failed: The provided API Key is not valid.";
        } else if (error.message.includes("quota")) {
            displayError = "Gemini API call failed: API quota exceeded.";
        } else if (error.message.includes("blocked")) {
             displayError = `Gemini API call failed: ${error.message}`; // Show block reason if available
        }
        throw new Error(displayError); // Re-throw cleaned error
    }
}

// --- Cloudinary Upload Function ---
async function uploadToCloudinary(videoBlob) {
    // !! CONFIGURATION CHECK !!
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME.includes("YOUR_") || CLOUDINARY_UPLOAD_PRESET.includes("YOUR_")) {
         throw new Error("Cloudinary configuration (Cloud Name or Upload Preset) is missing or uses placeholders in script.js.");
    }
    console.log(`Uploading video blob (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB) to Cloudinary...`);
    const formData = new FormData();
    formData.append('file', videoBlob);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // Optional: Add context for transcription or analysis if preset configured
    // formData.append('context', 'alt=ai-interview-answer');

    try {
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
            // Note: Do NOT set Content-Type header when using FormData, browser handles it
        });
        const data = await response.json(); // Always try to parse JSON

        if (!response.ok || data.error) {
            console.error("Cloudinary Upload Error Response:", data);
            throw new Error(data.error?.message || `Cloudinary upload HTTP error (${response.status})`);
        }
        if (!data.secure_url) {
             console.error("Cloudinary success response missing secure_url:", data);
             throw new Error("Cloudinary upload succeeded but response is missing the video URL.");
        }
        console.log("Cloudinary Upload Success. URL:", data.secure_url);
        return data.secure_url; // Return the secure URL

    } catch (error) {
        console.error("Network or parsing error during Cloudinary upload:", error);
        // Provide specific feedback if possible
        let detailedError = error.message;
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
             detailedError = "Network error. Check connection or Cloudinary URL/status.";
        }
        showInlineMessage(interviewError, `Video upload failed: ${detailedError}`, true);
        throw new Error(`Video upload failed: ${detailedError}`); // Re-throw
    }
}


// --- Recruiter Functions ---
if (postJobBtn) postJobBtn.addEventListener('click', () => {
    if (!db) return showInlineMessage(postJobMsg, "Database connection error.", true);
    const title = jobTitleInput?.value.trim();
    const description = jobDescriptionInput?.value.trim();
    if (!title || !description) return showInlineMessage(postJobMsg, "Job Title and Description are required.", true);
    if (!currentUser || currentUserData?.role !== 'recruiter') return showInlineMessage(postJobMsg, "Authentication error or invalid role.", true);

    postJobBtn.disabled = true;
    showInlineMessage(postJobMsg, "Posting job...");
    db.collection('jobs').add({
        title: title,
        description: description,
        recruiterUID: currentUser.uid,
        recruiterEmail: currentUser.email,
        recruiterName: currentUserData.fullname || currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        showInlineMessage(postJobMsg, "Job posted successfully!");
        if (jobTitleInput) jobTitleInput.value = '';
        if (jobDescriptionInput) jobDescriptionInput.value = '';
        loadRecruiterJobs(); // Refresh list
        setTimeout(() => showInlineMessage(postJobMsg, null), 4000); // Auto-hide success msg
    })
    .catch(error => { showInlineMessage(postJobMsg, `Error posting job: ${error.message}`, true); })
    .finally(() => { postJobBtn.disabled = false; });
});

function loadRecruiterJobs() {
    if (!currentUser || !recruiterJobsList) return;
    if (!db) return recruiterJobsList.innerHTML = '<div class="error-message">Database connection error.</div>';

    recruiterJobsList.innerHTML = '<div class="loading">Loading your jobs...</div>';
    // Needs Firestore index: recruiterUID ASC, createdAt DESC
    db.collection('jobs')
      .where('recruiterUID', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get()
      .then(snapshot => {
          recruiterJobsList.innerHTML = ''; // Clear loading/previous
          if (snapshot.empty) {
              recruiterJobsList.innerHTML = '<p class="list-empty-msg">You haven\'t posted any jobs yet.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const job = doc.data();
              const jobElement = document.createElement('div');
              jobElement.classList.add('list-item');
              jobElement.innerHTML = `
                  <div>
                      <strong class="job-title">${job.title || 'Untitled Job'}</strong><br>
                      <small>Posted: ${job.createdAt?.toDate().toLocaleDateString() || 'N/A'}</small>
                  </div>
                  <button data-job-id="${doc.id}" data-job-title="${job.title || 'Untitled Job'}" class="secondary-btn small-btn view-candidates-btn">View Candidates</button>
              `;
              const viewBtn = jobElement.querySelector('.view-candidates-btn');
              if (viewBtn) {
                  viewBtn.addEventListener('click', (e) => {
                      // Highlight active job
                      document.querySelectorAll('#recruiter-jobs-list .list-item.active').forEach(item => item.classList.remove('active'));
                      jobElement.classList.add('active');
                      // Load candidates for this job
                      const jobId = e.target.dataset.jobId;
                      const jobTitle = e.target.dataset.jobTitle;
                      if (selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = jobTitle;
                      loadCandidatesForJob(jobId);
                  });
              }
              recruiterJobsList.appendChild(jobElement);
          });
      })
      .catch(error => {
          handleFirestoreError(error, recruiterJobsList, "recruiter jobs");
      });
}

function loadCandidatesForJob(jobId) {
    if (!candidatesList) return;
    if (!db) return candidatesList.innerHTML = '<div class="error-message">Database connection error.</div>';

    candidatesList.innerHTML = '<div class="loading">Loading candidates...</div>';
    // Needs Firestore index: jobId ASC, submittedAt DESC
    db.collection('interviews')
      .where('jobId', '==', jobId)
      .orderBy('submittedAt', 'desc')
      .get()
      .then(snapshot => {
          candidatesList.innerHTML = ''; // Clear loading/previous
          if (snapshot.empty) {
              candidatesList.innerHTML = '<p class="list-empty-msg">No interviews submitted for this job yet.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const interview = doc.data();
              let scoreDisplay = "Pending";
               if (interview.score && typeof interview.score === 'string' && interview.score !== "N/A") {
                    const scoreMatch = interview.score.match(/(\d+)\s*\/\s*100/);
                    scoreDisplay = scoreMatch ? `${scoreMatch[1]} / 100` : "Review";
               } else if (interview.status && interview.status !== 'Pending') {
                   scoreDisplay = "N/A"; // Only show N/A if processed but no score
               }

              const candidateElement = document.createElement('div');
              candidateElement.classList.add('list-item');
              candidateElement.innerHTML = `
                  <div>
                    <strong class="candidate-email">${interview.candidateName || interview.candidateEmail || 'Unknown'}</strong> <br>
                    <small>Submitted: ${interview.submittedAt?.toDate().toLocaleString() || 'N/A'}</small>
                  </div>
                  <span>Score: ${scoreDisplay}</span>
                  <span class="interview-status status-${interview.status || 'Pending'}">${interview.status || 'Pending'}</span>
                  <button data-interview-id="${doc.id}" class="secondary-btn small-btn view-report-btn-recruiter">View Report</button>
              `;
               const reportBtn = candidateElement.querySelector('.view-report-btn-recruiter');
               if (reportBtn) {
                   reportBtn.addEventListener('click', () => {
                       viewInterviewReport(doc.id);
                   });
               }
              candidatesList.appendChild(candidateElement);
          });
      })
      .catch(error => {
          handleFirestoreError(error, candidatesList, `candidates for job ${jobId}`);
      });
}


// --- Candidate Functions ---
function loadAvailableJobs() {
    if (!availableJobsList) return;
    if (!db) return availableJobsList.innerHTML = '<div class="error-message">Database connection error.</div>';

    availableJobsList.innerHTML = '<div class="loading">Loading available jobs...</div>';
    // Needs Firestore index: createdAt DESC
    db.collection('jobs')
      .orderBy('createdAt', 'desc')
      .limit(50) // Sensible limit
      .get()
      .then(snapshot => {
          availableJobsList.innerHTML = ''; // Clear loading/previous
          if (snapshot.empty) {
              availableJobsList.innerHTML = '<p class="list-empty-msg">No jobs currently available.</p>';
              return;
          }
          snapshot.forEach(doc => {
              const job = doc.data();
              const jobElement = document.createElement('div');
              jobElement.classList.add('list-item');
              jobElement.innerHTML = `
                  <div>
                      <strong class="job-title">${job.title || 'Untitled Job'}</strong><br>
                      <small>${job.description?.substring(0, 120) || 'No description'}...</small>
                      <small style="display: block; margin-top: 5px;">Posted by: ${job.recruiterName || 'Recruiter'}</small>
                  </div>
                  <button data-job-id="${doc.id}" data-job-title="${job.title || 'Untitled Job'}" class="primary-btn small-btn start-interview-btn">Start Interview</button>
              `;
               const startBtn = jobElement.querySelector('.start-interview-btn');
               if (startBtn) {
                   startBtn.addEventListener('click', (e) => {
                       startInterviewProcess(e.target.dataset.jobId, e.target.dataset.jobTitle);
                   });
               }
              availableJobsList.appendChild(jobElement);
          });
      })
      .catch(error => {
          handleFirestoreError(error, availableJobsList, "available jobs");
      });
}

function loadMyInterviews() {
     if (!currentUser || !myInterviewsList) return;
     if (!db) return myInterviewsList.innerHTML = '<div class="error-message">Database connection error.</div>';

     myInterviewsList.innerHTML = '<div class="loading">Loading your interview history...</div>';
     // Needs Firestore index: candidateUID ASC, submittedAt DESC
     db.collection('interviews')
       .where('candidateUID', '==', currentUser.uid)
       .orderBy('submittedAt', 'desc')
       .limit(50) // Sensible limit
       .get()
       .then(snapshot => {
           myInterviewsList.innerHTML = ''; // Clear loading/previous
           if (snapshot.empty) {
               myInterviewsList.innerHTML = '<p class="list-empty-msg">You haven\'t completed any interviews yet.</p>';
               return;
           }
           snapshot.forEach(doc => {
               const interview = doc.data();
                let scoreDisplay = "Pending";
                 if (interview.score && typeof interview.score === 'string' && interview.score !== "N/A") {
                      const scoreMatch = interview.score.match(/(\d+)\s*\/\s*100/);
                      scoreDisplay = scoreMatch ? `${scoreMatch[1]} / 100` : "Review";
                 } else if (interview.status && interview.status !== 'Pending') {
                     scoreDisplay = "N/A";
                 }

               const interviewElement = document.createElement('div');
               interviewElement.classList.add('list-item');
               interviewElement.innerHTML = `
                    <div>
                         <strong class="job-title">${interview.jobTitle || 'Unknown Job'}</strong><br>
                         <small>Submitted: ${interview.submittedAt?.toDate().toLocaleString() || 'N/A'}</small>
                    </div>
                    <span>Score: ${scoreDisplay}</span>
                    <span class="interview-status status-${interview.status || 'Pending'}">${interview.status || 'Pending'}</span>
                    <button data-interview-id="${doc.id}" class="secondary-btn small-btn view-report-btn-candidate">View Report</button>
               `;
               const reportBtn = interviewElement.querySelector('.view-report-btn-candidate');
               if (reportBtn) {
                   reportBtn.addEventListener('click', () => {
                       viewInterviewReport(doc.id);
                   });
               }
               myInterviewsList.appendChild(interviewElement);
           });
       })
       .catch(error => {
            handleFirestoreError(error, myInterviewsList, "your interviews");
       });
}


// --- Firestore Error Helper ---
function handleFirestoreError(error, element, context) {
    let message = `Error loading ${context}: ${error.message}`;
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
       // Specific message for missing index
       message = `Error loading ${context}: Firestore index missing. Check browser console (Ctrl+Shift+J or Cmd+Opt+J) for a link to create index.`;
       console.error(`Firestore index missing for query on '${context}'. Firestore error: ${error.message}`);
    } else {
       // Log generic Firestore errors
       console.error(`Error loading ${context}:`, error);
    }
    // Display the error message in the specified UI element
    if (element) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
    } else {
        // Fallback to global error display if no specific element provided
        showAuthMessage(message, true);
    }
}


// --- MEDIA RECORDER / WEBCAM FUNCTIONS ---

async function setupWebcam() {
    console.log("Setting up webcam...");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
         showInlineMessage(interviewError, "Webcam access (getUserMedia) is not supported by this browser.", true);
         return false;
    }
    try {
        stopWebcamStream(); // Stop previous stream if any
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (webcamFeed) {
            webcamFeed.srcObject = mediaStream;
            await new Promise((resolve, reject) => {
                webcamFeed.onloadedmetadata = resolve;
                webcamFeed.onerror = (e) => reject(new Error(`Video element error: ${e.message}`)); // Handle video element errors
            });
            console.log("Webcam stream acquired and ready.");
            return true;
        } else {
            throw new Error("Webcam video element not found in DOM.");
        }
    } catch (err) {
        console.error("Error accessing media devices:", err);
        let userMessage = `Could not access webcam/microphone: ${err.name}.`;
        if (err.name === 'NotAllowedError') {
            userMessage += " Please grant camera/microphone permissions in your browser settings and reload.";
        } else if (err.name === 'NotFoundError') {
            userMessage += " No camera/microphone found. Please ensure they are connected and enabled.";
        } else {
             userMessage += ` ${err.message}. Try reloading or using a different browser.`;
        }
        showInlineMessage(interviewError, userMessage, true);
        return false; // Indicate failure
    }
}

function startRecording() {
    if (!mediaStream) return showInlineMessage(interviewError, "Webcam not ready.", true);
    if (isRecording) return console.warn("Already recording.");
    if (typeof MediaRecorder === 'undefined') {
         return showInlineMessage(interviewError, "Video recording (MediaRecorder) is not supported by this browser.", true);
    }


    recordedChunks = []; // Reset chunks
    showInlineMessage(interviewError, null); // Clear errors

    try {
        const options = getSupportedMimeType(['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']);
        if (!options) throw new Error("No suitable video format for recording found.");

        mediaRecorder = new MediaRecorder(mediaStream, options);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
            // console.log(`Data available: ${event.data.size} bytes`); // Optional: for debugging chunk sizes
        };

        mediaRecorder.onstop = async () => {
            console.log("MediaRecorder stopped event.");
            loadingAnswer.style.display = 'block';
            recordingStatusSpan.textContent = 'Processing & Uploading Video...';

            if (recordedChunks.length === 0) {
                console.warn("No data chunks recorded.");
                showInlineMessage(interviewError, "Recording failed (no data). Please try again.", true);
                loadingAnswer.style.display = 'none';
                isRecording = false; // Ensure state consistency
                updateInterviewButtonStates();
                return;
            }

            const blob = new Blob(recordedChunks, { type: options.mimeType });
            console.log(`Final Blob size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

            try {
                // --- Upload to Cloudinary ---
                const videoUrl = await uploadToCloudinary(blob); // Await the upload
                currentInterviewState.videoURLs[currentInterviewState.currentQuestionIndex] = videoUrl;

                // --- STT SIMULATION (runs AFTER successful upload) ---
                const simulatedText = `(STT Simulation for Q${currentInterviewState.currentQuestionIndex + 1}) Video uploaded: ${videoUrl}. Candidate likely addressed "${currentInterviewState.questions[currentInterviewState.currentQuestionIndex].substring(0, 30)}...". Key points assumed: [Simulated Point A, Simulated Point B]. --- [REAL TRANSCRIPTION REQUIRES BACKEND PROCESSING] ---`;
                currentInterviewState.answers[currentInterviewState.currentQuestionIndex] = simulatedText;
                // --- END SIMULATION ---

                recordingStatusSpan.textContent = 'Uploaded. Answer Recorded (Simulated Text).';
                if (sttSimulationNote) sttSimulationNote.style.display = 'block';
                loadingAnswer.style.display = 'none';
                isRecording = false; // Confirm stopped
                updateInterviewButtonStates(); // Enable Next/Finish

            } catch (uploadError) {
                console.error("Upload or STT simulation failed:", uploadError);
                // Don't save URL or simulated text if upload failed
                currentInterviewState.videoURLs[currentInterviewState.currentQuestionIndex] = null;
                currentInterviewState.answers[currentInterviewState.currentQuestionIndex] = null; // Mark answer as failed for this attempt
                showInlineMessage(interviewError, `Failed to process answer: ${uploadError.message}. Please try recording again.`, true);
                recordingStatusSpan.textContent = 'Processing Failed. Try again.';
                loadingAnswer.style.display = 'none';
                isRecording = false;
                updateInterviewButtonStates(); // Allow retry
            }
        };

        mediaRecorder.onerror = (event) => {
            const error = event.error || {};
            console.error("MediaRecorder error:", error);
            showInlineMessage(interviewError, `Recording error: ${error.name || 'UnknownError'} - ${error.message || 'No details'}. Please try again.`, true);
            isRecording = false;
            recordingStatusSpan.textContent = 'Recording Error!';
            loadingAnswer.style.display = 'none';
            updateInterviewButtonStates();
        };

        mediaRecorder.start();
        isRecording = true;
        recordingStatusSpan.textContent = 'Recording...';
        updateInterviewButtonStates(); // Update buttons for recording

    } catch (error) {
        console.error("Failed to initialize recording:", error);
        showInlineMessage(interviewError, `Cannot start recording: ${error.message}`, true);
        isRecording = false;
        recordingStatusSpan.textContent = 'Recording Setup Failed.';
        updateInterviewButtonStates();
    }
}

function stopRecording() {
    if (!mediaRecorder || !isRecording) {
        console.warn("Stop called but not recording or recorder not ready.");
        isRecording = false; // Ensure state is correct
        updateInterviewButtonStates();
        return;
    }

    // Provide Instant UI Feedback
    console.log("Initiating stop recording...");
    recordingStatusSpan.textContent = 'Stopping recording...';
    if (stopRecordingBtn) stopRecordingBtn.disabled = true;
    if (startRecordingBtn) startRecordingBtn.disabled = true; // Keep disabled during stop/process
    if (nextQuestionBtn) nextQuestionBtn.disabled = true;
    if (finishInterviewBtn) finishInterviewBtn.disabled = true;
    isRecording = false; // Update state immediately

    try {
        mediaRecorder.stop(); // Trigger the onstop handler
        // 'onstop' will handle further UI updates and processing
    } catch (error) {
        console.error("Error calling mediaRecorder.stop():", error);
        showInlineMessage(interviewError, `Error stopping recording: ${error.message}`, true);
        recordingStatusSpan.textContent = 'Error stopping.';
        loadingAnswer.style.display = 'none';
        updateInterviewButtonStates(); // Reset UI
    }
}

function getSupportedMimeType(preferredTypes) {
    if (typeof MediaRecorder === 'undefined') return null; // Check if MR exists
    for (const type of preferredTypes) {
        if (MediaRecorder.isTypeSupported(type)) { return { mimeType: type }; }
    }
    if (MediaRecorder.isTypeSupported('video/webm')) { // Fallback
         console.warn("Preferred MIME types not supported, using video/webm.");
         return { mimeType: 'video/webm' };
     }
    return null; // No supported type found
}

function stopWebcamStream() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        console.log("Webcam stream stopped.");
    }
    mediaStream = null;
    if (webcamFeed) webcamFeed.srcObject = null; // Clear video element
    isRecording = false; // Ensure recording state is false if stream stops
}


// --- INTERVIEW PROCESS (Candidate - Updated for Video) ---

async function startInterviewProcess(jobId, jobTitle) {
    if (!currentUser || !currentUserData || currentUserData.role !== 'candidate') {
       alert("Login required to start interview.");
       return;
    }
    // Basic check on inputs
    if (!jobId || !jobTitle) {
         console.error("startInterviewProcess called with missing jobId or jobTitle.");
         alert("Error starting interview: Invalid job details.");
         return;
    }

    showGlobalLoading(true);
    clearAllSections();
    if (interviewSection) interviewSection.style.display = 'block';
    if (userInfoSection) userInfoSection.style.display = 'flex';
    if (interviewJobTitleSpan) interviewJobTitleSpan.textContent = jobTitle;
    if (interviewQAArea) interviewQAArea.style.display = 'none';
    showInlineMessage(interviewError, null);
    if (interviewLoading) {
        interviewLoading.textContent = "Checking prerequisites...";
        interviewLoading.style.display = 'block';
    }

    // 1. Check for existing interview
    try {
        if (!db) throw new Error("Database connection failed.");
        // Needs index: candidateUID ASC, jobId ASC
        const existingInterview = await db.collection('interviews')
            .where('candidateUID', '==', currentUser.uid)
            .where('jobId', '==', jobId)
            .limit(1)
            .get();

        if (!existingInterview.empty) {
            showGlobalLoading(false);
            alert("You have already completed an interview for this job.");
            viewInterviewReport(existingInterview.docs[0].id); // Show existing report
            return; // Stop
        }
    } catch (error) {
         showGlobalLoading(false);
         handleFirestoreError(error, interviewError, "checking existing interviews");
         addBackButtonToError(interviewError);
         return; // Stop
    }

    // 2. Setup Webcam
    if (interviewLoading) interviewLoading.textContent = "Setting up webcam...";
    const webcamReady = await setupWebcam();
    if (!webcamReady) {
        showGlobalLoading(false);
        if (interviewLoading) interviewLoading.style.display = 'none';
        // Error message/back button handled within setupWebcam()
        return; // Stop
    }

    // 3. Generate Questions
    currentInterviewState = { // Reset state for new interview
        jobId: jobId, jobTitle: jobTitle, questions: [], answers: [], videoURLs: [], currentQuestionIndex: 0
    };
    if (interviewLoading) interviewLoading.textContent = "Generating AI questions...";

    try {
        if (!db) throw new Error("Database connection failed."); // Check again just before use
        let jobDescription = 'General Professional Role'; // Default description
        try {
            const jobDoc = await db.collection('jobs').doc(jobId).get();
            if (jobDoc.exists && jobDoc.data()?.description) {
                 jobDescription = jobDoc.data().description;
            }
        } catch (fetchError) { console.warn("Could not fetch job description:", fetchError); }

        const candidateExp = currentUserData.experience !== undefined ? `${currentUserData.experience} years` : 'unspecified';
        const prompt = `Generate ${NUM_QUESTIONS} diverse interview questions (behavioral, situational, potentially technical based on title/description) for a candidate with ${candidateExp} of experience applying for the job: "${jobTitle}". Job description: "${jobDescription}". List each question on a new line ONLY. No numbering, bullets, or intro/outro text. Keep questions clear and concise.`;

        const generatedText = await callGeminiAPI(prompt);
        currentInterviewState.questions = generatedText.split('\n').map(q => q.trim()).filter(q => q !== ''); // Ensure trimmed and not empty
        currentInterviewState.answers = new Array(currentInterviewState.questions.length).fill(null);
        currentInterviewState.videoURLs = new Array(currentInterviewState.questions.length).fill(null);

        if (currentInterviewState.questions.length === 0) {
             throw new Error("AI failed to generate any valid questions. Please try again later.");
        }
        if (currentInterviewState.questions.length < NUM_QUESTIONS) {
             console.warn(`AI generated ${currentInterviewState.questions.length}/${NUM_QUESTIONS} questions.`);
             // Adjust NUM_QUESTIONS if needed, or proceed with fewer
        }

        // 4. Display First Question
        if (interviewLoading) interviewLoading.style.display = 'none';
        if (interviewQAArea) interviewQAArea.style.display = 'block';
        displayNextQuestion(); // Display Q1 and set initial button states

    } catch (error) {
        console.error("Error during interview setup (Questions/Job Desc):", error);
        if (interviewLoading) interviewLoading.style.display = 'none';
        showInlineMessage(interviewError, `Failed to start interview: ${error.message}`, true);
        addBackButtonToError(interviewError);
        stopWebcamStream(); // Stop webcam if setup fails
    } finally {
         showGlobalLoading(false);
    }
}

function displayNextQuestion() {
    const state = currentInterviewState;
    const index = state.currentQuestionIndex;

    if (!state.questions || index < 0 || index >= state.questions.length) {
        console.error("Invalid state or index for displayNextQuestion:", index, state);
        showInlineMessage(interviewError, "Error: Cannot proceed to the next question.", true);
        // Attempt to recover or go back
        addBackButtonToError(interviewError);
        return;
    }

    // Update UI elements if they exist
    if (questionTitle) questionTitle.textContent = `Question ${index + 1} of ${state.questions.length}:`;
    if (questionText) questionText.textContent = state.questions[index];
    if (recordingStatusSpan) recordingStatusSpan.textContent = 'Ready to record answer.';
    if (sttSimulationNote) sttSimulationNote.style.display = 'none'; // Hide note until first recording is done
    if (loadingAnswer) loadingAnswer.style.display = 'none';
    showInlineMessage(interviewError, null); // Clear errors from previous question

    updateInterviewButtonStates(); // Set button states for the new question
}

function updateInterviewButtonStates() {
    // Check if DOM elements exist before manipulating
    if (!startRecordingBtn || !stopRecordingBtn || !nextQuestionBtn || !finishInterviewBtn) {
        console.warn("Interview control buttons not found in DOM.");
        return;
    }

    // Default state: disable all actions until state is confirmed valid
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = true;
    nextQuestionBtn.style.display = 'none';
    finishInterviewBtn.style.display = 'none';

    // Check interview state validity
    if (!currentInterviewState || !currentInterviewState.questions || currentInterviewState.questions.length === 0) {
        console.warn("updateInterviewButtonStates: Invalid interview state.");
        return; // Keep buttons disabled
    }

    const state = currentInterviewState;
    const index = state.currentQuestionIndex;

    // Check index validity
    if (index < 0 || index >= state.questions.length) {
         console.warn(`updateInterviewButtonStates: Index out of bounds (${index}).`);
         return; // Keep buttons disabled
    }

    const totalQuestions = state.questions.length;
    // Check if the answer (simulated text) for the *current* index exists
    const answerRecorded = state.answers[index] !== null;
    const isLastQuestion = index === totalQuestions - 1;

    // Determine button states based on recording status and answer status
    startRecordingBtn.disabled = isRecording || answerRecorded;
    stopRecordingBtn.disabled = !isRecording;

    nextQuestionBtn.style.display = !isLastQuestion && answerRecorded && !isRecording ? 'inline-block' : 'none';
    nextQuestionBtn.disabled = isRecording;

    finishInterviewBtn.style.display = isLastQuestion && answerRecorded && !isRecording ? 'inline-block' : 'none';
    finishInterviewBtn.disabled = isRecording;
}

// Event Listeners for Interview Controls (Ensure elements exist)
if (startRecordingBtn) startRecordingBtn.addEventListener('click', startRecording);
if (stopRecordingBtn) stopRecordingBtn.addEventListener('click', stopRecording);

if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', () => {
    if (isRecording) return; // Safety check
    if (currentInterviewState.currentQuestionIndex < currentInterviewState.questions.length - 1) {
        currentInterviewState.currentQuestionIndex++;
        displayNextQuestion();
    }
});

if (finishInterviewBtn) finishInterviewBtn.addEventListener('click', () => {
     if (isRecording) return; // Safety check
     finishInterview();
});


async function finishInterview() {
    console.log("Attempting to finish interview...");
    // 1. Validate State
    if (!currentUser || !currentUserData || !currentInterviewState.jobId) {
       showInlineMessage(interviewError, "Cannot save interview. Session data lost. Please reload.", true);
       addBackButtonToError(interviewError);
       return;
    }
    if (!db) {
        showInlineMessage(interviewError, "Database connection error. Cannot save.", true);
        addBackButtonToError(interviewError);
        return;
    }
    const firstNullAnswerIndex = currentInterviewState.answers.findIndex(ans => ans === null);
    if (firstNullAnswerIndex !== -1) {
         showInlineMessage(interviewError, `Cannot finish. Answer for question ${firstNullAnswerIndex + 1} is missing.`, true);
         // Ideally, navigate back to that question - complex UI, for now just block.
         return;
    }
     const firstNullUrlIndex = currentInterviewState.videoURLs.findIndex(url => url === null);
     if (firstNullUrlIndex !== -1) {
          showInlineMessage(interviewError, `Cannot finish. Video upload for question ${firstNullUrlIndex + 1} may have failed or is missing.`, true);
          // Allow finishing but maybe flag the report? Or block? Blocking for safety now.
          return;
     }


    // 2. Update UI - Show Loading
    if (interviewQAArea) interviewQAArea.style.display = 'none';
    if (interviewLoading) {
        interviewLoading.textContent = "Generating final feedback & saving report...";
        interviewLoading.style.display = 'block';
    }
    showInlineMessage(interviewError, null); // Clear previous errors
    stopWebcamStream(); // Ensure webcam is off

    try {
        // 3. Generate Feedback Prompt (using SIMULATED TEXT)
        const candidateExp = currentUserData.experience !== undefined ? `${currentUserData.experience} years` : 'unspecified';
        let feedbackPrompt = `Act as an expert interviewer reviewing interview answers.\n`;
        feedbackPrompt += `Role Applied For: "${currentInterviewState.jobTitle}"\nCandidate Experience: ${candidateExp}\n\n`;
        feedbackPrompt += `Evaluate the following Questions and the candidate's corresponding Answers (which are simulated text representations):\n---\n`;
        currentInterviewState.questions.forEach((q, i) => {
            feedbackPrompt += `Q${i + 1}: ${q}\n`;
            feedbackPrompt += `A${i + 1} (Simulated Text): ${currentInterviewState.answers[i] || '(No simulated answer recorded)'}\n---\n`;
        });
        feedbackPrompt += `\nInstructions:\n`;
        feedbackPrompt += `1. Provide constructive feedback based ONLY on the simulated text answers. Assess potential clarity, relevance, and indicators of skills mentioned in the text.\n`;
        feedbackPrompt += `2. Give an overall summary evaluation.\n`;
        feedbackPrompt += `3. Provide a final score out of 100, with a brief justification.\n\n`;
        feedbackPrompt += `Format EXACTLY as:\n**Feedback:**\n[Detailed feedback here, referencing the simulated text]\n\n**Overall Score:** [Score]/100 - [Brief justification based on the simulated text analysis]`;

        // 4. Call Gemini API
        const feedbackResult = await callGeminiAPI(feedbackPrompt);

        // 5. Parse Score
        let scoreString = "N/A";
        if (feedbackResult) {
            const scoreLineMatch = feedbackResult.match(/\*\*Overall Score:\*\*\s*(.*?)(?:\n|$)/im);
            if (scoreLineMatch && scoreLineMatch[1]) {
                 scoreString = scoreLineMatch[1].trim();
            } else {
                console.warn("Could not parse score line from feedback:", feedbackResult);
                scoreString = "N/A (Parsing Failed)";
            }
        }

        // 6. Prepare Firestore Data
        const interviewData = {
            jobId: currentInterviewState.jobId,
            jobTitle: currentInterviewState.jobTitle,
            candidateUID: currentUser.uid,
            candidateEmail: currentUser.email,
            candidateName: currentUserData.fullname || currentUser.email,
            candidateExperience: currentUserData.experience,
            questions: currentInterviewState.questions,
            answers: currentInterviewState.answers, // The SIMULATED text
            videoURLs: currentInterviewState.videoURLs, // The Cloudinary URLs
            feedback: feedbackResult || "AI feedback generation failed or was blocked.",
            score: scoreString,
            status: 'Pending', // Initial status
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 7. Save to Firestore
        const docRef = await db.collection('interviews').add(interviewData);
        console.log("Interview report saved successfully with ID:", docRef.id);

        // 8. Transition to Report View
        if (interviewLoading) interviewLoading.style.display = 'none';
        if (interviewSection) interviewSection.style.display = 'none';
        viewInterviewReport(docRef.id);

    } catch (error) {
        // Handle errors during feedback generation or saving
        console.error("Error finishing interview:", error);
        if (interviewLoading) interviewLoading.style.display = 'none';
        // Make Q&A visible again if needed for context, or keep hidden? Keep hidden for now.
        // if (interviewQAArea) interviewQAArea.style.display = 'block';
        showInlineMessage(interviewError, `Failed to finalize interview: ${error.message}. Please go back to the dashboard and check 'My Interviews' later.`, true);
        addBackButtonToError(interviewError);
        // Don't stop webcam here as it was already stopped
    }
}


// --- Report Viewing & Other Functions ---
if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', goBackToDashboard);

function goBackToDashboard() {
    // Hide report/interview, show correct dashboard
    if (reportSection) reportSection.style.display = 'none';
    if (interviewSection) interviewSection.style.display = 'none';
    selectedInterviewForReport = null; // Clear selected report
    stopWebcamStream(); // Ensure webcam is off
    showGlobalLoading(true);

    if (currentUserData?.role === 'recruiter') {
        if (recruiterDashboard) recruiterDashboard.style.display = 'block';
        loadRecruiterJobs(); // Refresh jobs
        // Try reloading candidates for the last viewed job
         const activeJobItem = document.querySelector('#recruiter-jobs-list .list-item.active');
         if (activeJobItem && candidatesList) {
             const jobId = activeJobItem.querySelector('.view-candidates-btn')?.dataset.jobId;
             if (jobId) loadCandidatesForJob(jobId);
             else candidatesList.innerHTML = 'Select a job to view candidates.';
         } else if (candidatesList){
              candidatesList.innerHTML = 'Select a job to view candidates.';
              if(selectedJobTitleRecruiter) selectedJobTitleRecruiter.textContent = '(Select a job)';
         }
    } else if (currentUserData?.role === 'candidate') {
        if (candidateDashboard) candidateDashboard.style.display = 'block';
        loadAvailableJobs(); // Refresh jobs
        loadMyInterviews(); // Refresh history
    } else {
        // Fallback if role is unclear or user logged out during process
        if (authSection) authSection.style.display = 'block';
    }
     showGlobalLoading(false);
}


function viewInterviewReport(interviewId) {
    clearAllSections(); // Clear current view
    showGlobalLoading(true);
    if (reportSection) reportSection.style.display = 'block';
    if (userInfoSection) userInfoSection.style.display = 'flex'; // Keep user info

    if (!db) {
         showInlineMessage(errorFeedback, "Database connection error.", true);
         showGlobalLoading(false);
         addBackButtonToError(errorFeedback);
         return;
    }
    if (!interviewId) {
         showInlineMessage(errorFeedback, "Invalid interview ID.", true);
         showGlobalLoading(false);
         addBackButtonToError(errorFeedback);
         return;
    }


    db.collection('interviews').doc(interviewId).get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error('Interview report not found.');
            }

            const interview = doc.data();
            selectedInterviewForReport = { ...interview, id: interviewId }; // Store current report data

            // Populate Header Info
            if (reportJobTitleSpan) reportJobTitleSpan.textContent = interview.jobTitle || 'N/A';
            if (reportCandidateEmailSpan) reportCandidateEmailSpan.textContent = interview.candidateEmail || 'N/A';
            if (reportStatusSpan) {
                reportStatusSpan.textContent = interview.status || 'Pending';
                reportStatusSpan.className = `interview-status status-${interview.status || 'Pending'}`;
            }

            // Recruiter Status Update Section
            const isRecruiter = currentUserData?.role === 'recruiter';
            if (recruiterStatusUpdateDiv) recruiterStatusUpdateDiv.style.display = isRecruiter ? 'block' : 'none';
            if (isRecruiter) {
                if (updateStatusSelect) updateStatusSelect.value = interview.status || 'Pending';
                if (statusNotesInput) statusNotesInput.value = interview.statusNotes || '';
                 showInlineMessage(updateStatusMsg, null); // Clear previous update messages
            }

            // Display AI Feedback
            if (loadingFeedback) loadingFeedback.style.display = 'none';
            showInlineMessage(errorFeedback, null); // Clear previous errors
            if (feedbackContent) {
                feedbackContent.innerHTML = formatFeedback(interview.feedback); // Use helper
                feedbackContent.style.display = 'block';
            }

            // Display Q&A Report (with simulated text & video links)
            if (reportContent) {
                reportContent.innerHTML = generateQAReport(interview);
            }

        })
        .catch(error => {
            console.error("Error loading interview report:", error);
             if (reportContent) reportContent.innerHTML = ''; // Clear partial content on error
             if (feedbackContent) feedbackContent.innerHTML = '';
            showInlineMessage(errorFeedback, `Error loading report: ${error.message}`, true);
            addBackButtonToError(errorFeedback); // Add back button on error
        })
        .finally(() => {
            showGlobalLoading(false);
        });
}

// Recruiter Status Update Listener
if (updateStatusBtn) updateStatusBtn.addEventListener('click', () => {
    if (!db) return showInlineMessage(updateStatusMsg, 'Database connection error.', true);
    const newStatus = updateStatusSelect?.value;
    const notes = statusNotesInput?.value.trim();
    if (!selectedInterviewForReport || !selectedInterviewForReport.id) return showInlineMessage(updateStatusMsg, 'Error: No interview selected.', true);
    if (!newStatus) return showInlineMessage(updateStatusMsg, 'Please select a status.', true);


    updateStatusBtn.disabled = true;
    showInlineMessage(updateStatusMsg, 'Updating status...');

    db.collection('interviews').doc(selectedInterviewForReport.id).update({
        status: newStatus,
        statusNotes: notes,
        statusUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        statusUpdatedBy: currentUser?.email || 'Unknown Recruiter' // Store who updated
    })
    .then(() => {
        showInlineMessage(updateStatusMsg, 'Status updated successfully!');
        // Update UI immediately
        if (reportStatusSpan) {
            reportStatusSpan.textContent = newStatus;
            reportStatusSpan.className = `interview-status status-${newStatus}`;
        }
        // Update local cache
        selectedInterviewForReport.status = newStatus;
        selectedInterviewForReport.statusNotes = notes;
        setTimeout(() => showInlineMessage(updateStatusMsg, null), 4000); // Auto-hide
    })
    .catch(error => { showInlineMessage(updateStatusMsg, `Error updating status: ${error.message}`, true); })
    .finally(() => { updateStatusBtn.disabled = false; });
});

// Helper: Format AI Feedback for display
function formatFeedback(feedbackText) {
    if (!feedbackText || typeof feedbackText !== 'string') {
        return '<p>Feedback not available or unreadable.</p>';
    }
    // Use regex to capture parts, make it robust
    const scoreMatch = feedbackText.match(/\*\*Overall Score:\*\*\s*(.*?)(?:\n|$)/im);
    // Capture everything after "**Feedback:**" until the score section or end of string
    const feedbackMatch = feedbackText.match(/\*\*Feedback:\*\*\s*([\s\S]*?)(?=\*\*Overall Score:|$)/im);

    // Trim results, provide defaults, escape HTML in user content? (No, assuming AI output is safe-ish)
    const scoreContent = scoreMatch ? scoreMatch[1].trim() : "N/A";
    // Use full text as feedback if pattern fails, replace newlines with <br> for HTML display
    const detailedFeedback = feedbackMatch ? feedbackMatch[1].trim().replace(/\n/g, '<br>') : feedbackText.replace(/\n/g, '<br>');

    return `
        <div class="feedback-section">
            <div class="feedback-score">
                <h4>Overall Score:</h4>
                <p>${scoreContent}</p>
            </div>
            <hr style="margin: 10px 0; border-color: #eee;">
            <div class="feedback-details">
                <h4>Detailed Feedback:</h4>
                <p>${detailedFeedback || 'No detailed feedback provided.'}</p>
            </div>
        </div>
    `;
}

// Helper: Generate Q&A Report HTML (uses simulated answers and video URLs)
function generateQAReport(interview) {
    if (!interview?.questions || !Array.isArray(interview.questions)) {
        return '<p class="error-message">Error: Interview question data missing.</p>';
    }
    // Safely access answers and URLs, providing defaults
    const answers = interview.answers && Array.isArray(interview.answers) ? interview.answers : [];
    const videoURLs = interview.videoURLs && Array.isArray(interview.videoURLs) ? interview.videoURLs : [];

    return interview.questions.map((question, index) => {
        const answerText = answers[index] || '(Simulated answer not found/processed)';
        const videoUrl = videoURLs[index];
        const videoLinkHtml = videoUrl
         ? `<p style="font-size: 0.9em; margin-top: 8px;"><a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="secondary-btn small-btn">Watch Recorded Video</a></p>` // Styled button link
         : '<p style="font-size: 0.9em; margin-top: 8px; color: #888;">(Video link not available)</p>';

        return `
            <div class="qa-block">
                <h4>Question ${index + 1}:</h4>
                <p class="question">${question || '(Question text missing)'}</p>
                <h4>Candidate's Answer (Simulated Text):</h4>
                <pre class="answer">${answerText}</pre>
                ${videoLinkHtml} 
            </div>
        `;
    }).join('');
}

// Helper: Adds a 'Back to Dashboard' button to an error message area
function addBackButtonToError(errorElement) {
     if (!errorElement || errorElement.querySelector('.back-btn-error')) return; // Don't add multiple
     const backBtn = document.createElement('button');
     backBtn.textContent = '← Back to Dashboard';
     backBtn.classList.add('secondary-btn', 'back-btn-error'); // Add class to identify
     backBtn.style.marginTop = '1rem';
     backBtn.style.display = 'block'; // Ensure it's visible
     backBtn.onclick = goBackToDashboard; // Use the common function
     errorElement.parentNode.appendChild(backBtn);
}


// --- Initial Load Trigger ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing App...");
    // Basic check for Firebase config completeness before auth listener runs
    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_NEW") || firebaseConfig.apiKey.length < 10) {
        console.error("CRITICAL: Firebase config missing/invalid in script.js!");
        // Display a prominent error even before auth state is checked
        showAuthMessage("CRITICAL: App configuration error. Firebase details missing.", true);
        if(authSection) authSection.style.display = 'block'; // Ensure auth section is visible to show error
    }
    // Check for other critical configs if needed (Gemini, Cloudinary)
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_NEW")) {
         console.warn("Gemini API Key missing/invalid. AI features may fail.");
         // Optionally show a non-critical warning?
    }
     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME.includes("YOUR_") || CLOUDINARY_UPLOAD_PRESET.includes("YOUR_")) {
         console.warn("Cloudinary config missing/invalid. Video uploads will fail.");
         // Optionally show a non-critical warning?
    }

    // The Firebase auth.onAuthStateChanged listener handles the main application flow after this.
});