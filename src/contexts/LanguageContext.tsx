import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'english' | 'hindi' | 'marathi' | 'kannada' | 'telugu';

export const LANGUAGES: { id: Language; name: string; nativeName: string }[] = [
  { id: 'english', name: 'English', nativeName: 'English' },
  { id: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
  { id: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
  { id: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { id: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
];

// Translations object
export const translations: Record<Language, Record<string, string>> = {
  english: {
    // Auth
    'auth.createAccount': 'Create Account',
    'auth.welcomeBack': 'Welcome Back',
    'auth.signUp': 'Sign Up',
    'auth.signIn': 'Sign In',
    'auth.student': 'Student',
    'auth.admin': 'Admin',
    'auth.studentLogin': 'Student Login',
    'auth.studentSignUp': 'Student Sign Up',
    'auth.adminLogin': 'Admin Login',
    'auth.usn': 'USN',
    'auth.usnOrEmail': 'USN or Email',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.fullName': 'Full Name',
    'auth.useUSN': 'Create your account with USN and email',
    'auth.useEmail': 'Use your admin email and password',
    'auth.enterUSN': 'e.g., 3GN24CI000',
    'auth.enterPassword': 'Enter your password',
    'auth.enterName': 'Enter your full name',
    'auth.enterEmail': 'Enter your email',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.backToLogin': 'Back to Login',
    'auth.signUpToAccess': 'Sign up to access your study materials',
    'auth.signInToAccess': 'Sign in to access your study materials',
    
    // Dashboard
    'dashboard.goodMorning': 'Good morning',
    'dashboard.goodAfternoon': 'Good afternoon',
    'dashboard.goodEvening': 'Good evening',
    'dashboard.accessMaterials': 'Access your study materials and resources',
    'dashboard.welcomeBack': 'Welcome back to',
    'dashboard.continueJourney': 'Continue your learning journey and master artificial intelligence',
    'dashboard.semester3': '3rd Semester',
    'dashboard.semester4': '4th Semester',
    'dashboard.subjects': 'Subjects',
    'dashboard.viewMaterials': 'View materials',
    'dashboard.quiz': 'Quiz',
    'dashboard.comingSoon': 'Coming Soon',
    'dashboard.noSubjects': 'No Subjects Yet',
    'dashboard.checkLater': '4th semester subjects will be added here when available. Check back later!',
    'dashboard.calculator': 'Calculator',
    'dashboard.upload': 'Upload',
    'dashboard.signOut': 'Sign Out',
    'dashboard.aimlPortal': 'AIML Portal',
    
    // Stats
    'stats.resourcesViewed': 'Resources Viewed',
    'stats.quizzesCompleted': 'Quizzes Completed',
    'stats.subjectsExplored': 'Subjects Explored',
    'stats.studyStreak': 'Study Streak',
    'stats.days': 'days',
    'stats.thisWeek': 'this week',
    'stats.thisMonth': 'this month',
    'stats.keepItUp': 'Keep it up!',
    
    // Quiz
    'quiz.dailyQuiz': 'Daily Quiz',
    'quiz.question': 'Question',
    'quiz.previous': 'Previous',
    'quiz.next': 'Next',
    'quiz.submit': 'Submit Quiz',
    'quiz.complete': 'Quiz Complete!',
    'quiz.excellentWork': 'Excellent work!',
    'quiz.goodEffort': 'Good effort!',
    'quiz.keepPracticing': 'Keep practicing!',
    'quiz.alreadyAttempted': 'Already Attempted Today!',
    'quiz.alreadyTaken': "You've already taken the quiz today.",
    'quiz.yourScore': 'Your Score',
    'quiz.comeBackTomorrow': 'Come back tomorrow for new questions!',
    'quiz.backToDashboard': 'Back to Dashboard',
    'quiz.exitQuiz': 'Exit Quiz',
    'quiz.leaderboard': 'Leaderboard',
    'quiz.rank': 'Rank',
    'quiz.usn': 'USN',
    'quiz.score': 'Score',
    
    // Subject
    'subject.materials': 'Materials',
    'subject.pyqs': 'PYQs',
    'subject.semester': 'Semester',
    'subject.noFiles': 'No Files Yet',
    'subject.materialsEmpty': 'Study materials will appear here once uploaded by admins.',
    'subject.pyqsEmpty': 'Past year question papers will appear here once uploaded by admins.',
    'subject.view': 'View',
    'subject.download': 'Download',
    'subject.delete': 'Delete',
    'subject.deleteResource': 'Delete Resource',
    'subject.deleteConfirm': 'Are you sure you want to delete this resource? This action cannot be undone.',
    'subject.cancel': 'Cancel',
    
    // Landing
    'landing.signIn': 'Sign In',
    'landing.badge': 'AIML Department Resource Portal',
    'landing.title1': 'Your Study Materials,',
    'landing.title2': 'All in One Place',
    'landing.description': 'Access lecture notes, PDFs, and study resources for your AIML courses. Organized by semester and subject for easy navigation.',
    'landing.getStarted': 'Get Started',
    'landing.adminLogin': 'Admin Login',
    'landing.organizedResources': 'Organized Resources',
    'landing.organizedDesc': 'Study materials organized by semester and subject for quick access',
    'landing.easyDownloads': 'Easy Downloads',
    'landing.downloadsDesc': 'Download PDFs and documents instantly with a single click',
    'landing.roleBasedAccess': 'Role-Based Access',
    'landing.roleBasedDesc': 'Separate interfaces for students and administrators',
    'landing.footer': '© 2024 AIML Department. All rights reserved.',
    
    // Settings
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select Language',
    'settings.theme': 'Theme',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark all read',
    'notifications.noNotifications': 'No notifications yet',
    
    // Share
    'share.shareApp': 'Share App',
    'share.copyLink': 'Copy Link',
    'share.linkCopied': 'Link copied!',
    
    // Common
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  hindi: {
    // Auth
    'auth.createAccount': 'खाता बनाएं',
    'auth.welcomeBack': 'वापसी पर स्वागत है',
    'auth.signUp': 'साइन अप',
    'auth.signIn': 'साइन इन',
    'auth.student': 'छात्र',
    'auth.admin': 'एडमिन',
    'auth.studentLogin': 'छात्र लॉगिन',
    'auth.studentSignUp': 'छात्र साइन अप',
    'auth.adminLogin': 'एडमिन लॉगिन',
    'auth.usn': 'यूएसएन',
    'auth.usnOrEmail': 'यूएसएन या ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.email': 'ईमेल',
    'auth.fullName': 'पूरा नाम',
    'auth.useUSN': 'यूएसएन और ईमेल से अपना खाता बनाएं',
    'auth.useEmail': 'अपना एडमिन ईमेल और पासवर्ड उपयोग करें',
    'auth.enterUSN': 'जैसे, 3GN24CI000',
    'auth.enterPassword': 'अपना पासवर्ड दर्ज करें',
    'auth.enterName': 'अपना पूरा नाम दर्ज करें',
    'auth.enterEmail': 'अपना ईमेल दर्ज करें',
    'auth.alreadyHaveAccount': 'पहले से खाता है?',
    'auth.dontHaveAccount': 'खाता नहीं है?',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.resetPassword': 'पासवर्ड रीसेट करें',
    'auth.sendResetLink': 'रीसेट लिंक भेजें',
    'auth.backToLogin': 'लॉगिन पर वापस जाएं',
    'auth.signUpToAccess': 'अपनी अध्ययन सामग्री प्राप्त करने के लिए साइन अप करें',
    'auth.signInToAccess': 'अपनी अध्ययन सामग्री प्राप्त करने के लिए साइन इन करें',
    
    // Dashboard
    'dashboard.goodMorning': 'सुप्रभात',
    'dashboard.goodAfternoon': 'नमस्ते',
    'dashboard.goodEvening': 'शुभ संध्या',
    'dashboard.accessMaterials': 'अपनी अध्ययन सामग्री और संसाधन प्राप्त करें',
    'dashboard.welcomeBack': 'वापसी पर स्वागत है',
    'dashboard.continueJourney': 'अपनी सीखने की यात्रा जारी रखें और AI में महारत हासिल करें',
    'dashboard.semester3': 'तीसरा सेमेस्टर',
    'dashboard.semester4': 'चौथा सेमेस्टर',
    'dashboard.subjects': 'विषय',
    'dashboard.viewMaterials': 'सामग्री देखें',
    'dashboard.quiz': 'क्विज़',
    'dashboard.comingSoon': 'जल्द आ रहा है',
    'dashboard.noSubjects': 'अभी कोई विषय नहीं',
    'dashboard.checkLater': 'चौथे सेमेस्टर के विषय उपलब्ध होने पर यहां जोड़े जाएंगे।',
    'dashboard.calculator': 'कैलकुलेटर',
    'dashboard.upload': 'अपलोड',
    'dashboard.signOut': 'साइन आउट',
    'dashboard.aimlPortal': 'एआईएमएल पोर्टल',
    
    // Stats
    'stats.resourcesViewed': 'देखे गए संसाधन',
    'stats.quizzesCompleted': 'पूर्ण क्विज़',
    'stats.subjectsExplored': 'खोजे गए विषय',
    'stats.studyStreak': 'अध्ययन स्ट्रीक',
    'stats.days': 'दिन',
    'stats.thisWeek': 'इस हफ्ते',
    'stats.thisMonth': 'इस महीने',
    'stats.keepItUp': 'जारी रखें!',
    
    // Quiz
    'quiz.dailyQuiz': 'दैनिक क्विज़',
    'quiz.question': 'प्रश्न',
    'quiz.previous': 'पिछला',
    'quiz.next': 'अगला',
    'quiz.submit': 'क्विज़ जमा करें',
    'quiz.complete': 'क्विज़ पूर्ण!',
    'quiz.excellentWork': 'उत्कृष्ट कार्य!',
    'quiz.goodEffort': 'अच्छा प्रयास!',
    'quiz.keepPracticing': 'अभ्यास जारी रखें!',
    'quiz.alreadyAttempted': 'आज पहले ही प्रयास किया!',
    'quiz.alreadyTaken': 'आपने आज क्विज़ पहले ही ले लिया है।',
    'quiz.yourScore': 'आपका स्कोर',
    'quiz.comeBackTomorrow': 'नए प्रश्नों के लिए कल वापस आएं!',
    'quiz.backToDashboard': 'डैशबोर्ड पर वापस',
    'quiz.exitQuiz': 'क्विज़ से बाहर',
    'quiz.leaderboard': 'लीडरबोर्ड',
    'quiz.rank': 'रैंक',
    'quiz.usn': 'यूएसएन',
    'quiz.score': 'स्कोर',
    
    // Subject
    'subject.materials': 'सामग्री',
    'subject.pyqs': 'पिछले साल के प्रश्न',
    'subject.semester': 'सेमेस्टर',
    'subject.noFiles': 'अभी कोई फ़ाइल नहीं',
    'subject.materialsEmpty': 'एडमिन द्वारा अपलोड होने पर अध्ययन सामग्री यहां दिखाई देगी।',
    'subject.pyqsEmpty': 'एडमिन द्वारा अपलोड होने पर पिछले साल के प्रश्न पत्र यहां दिखाई देंगे।',
    'subject.view': 'देखें',
    'subject.download': 'डाउनलोड',
    'subject.delete': 'हटाएं',
    'subject.deleteResource': 'संसाधन हटाएं',
    'subject.deleteConfirm': 'क्या आप वाकई इस संसाधन को हटाना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।',
    'subject.cancel': 'रद्द करें',
    
    // Landing
    'landing.signIn': 'साइन इन',
    'landing.badge': 'एआईएमएल विभाग संसाधन पोर्टल',
    'landing.title1': 'आपकी अध्ययन सामग्री,',
    'landing.title2': 'सब एक जगह',
    'landing.description': 'अपने एआईएमएल पाठ्यक्रमों के लिए लेक्चर नोट्स, पीडीएफ और अध्ययन संसाधन प्राप्त करें। आसान नेविगेशन के लिए सेमेस्टर और विषय के अनुसार व्यवस्थित।',
    'landing.getStarted': 'शुरू करें',
    'landing.adminLogin': 'एडमिन लॉगिन',
    'landing.organizedResources': 'व्यवस्थित संसाधन',
    'landing.organizedDesc': 'त्वरित पहुंच के लिए सेमेस्टर और विषय के अनुसार व्यवस्थित अध्ययन सामग्री',
    'landing.easyDownloads': 'आसान डाउनलोड',
    'landing.downloadsDesc': 'एक क्लिक में पीडीएफ और दस्तावेज़ तुरंत डाउनलोड करें',
    'landing.roleBasedAccess': 'भूमिका आधारित पहुंच',
    'landing.roleBasedDesc': 'छात्रों और प्रशासकों के लिए अलग इंटरफेस',
    'landing.footer': '© 2024 एआईएमएल विभाग। सर्वाधिकार सुरक्षित।',
    
    // Settings
    'settings.language': 'भाषा',
    'settings.selectLanguage': 'भाषा चुनें',
    'settings.theme': 'थीम',
    
    // Notifications
    'notifications.title': 'सूचनाएं',
    'notifications.markAllRead': 'सभी पढ़े हुए चिह्नित करें',
    'notifications.noNotifications': 'कोई सूचना नहीं',
    
    // Share
    'share.shareApp': 'ऐप शेयर करें',
    'share.copyLink': 'लिंक कॉपी करें',
    'share.linkCopied': 'लिंक कॉपी हो गया!',
    
    // Common
    'common.back': 'वापस',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
  },
  marathi: {
    // Auth
    'auth.createAccount': 'खाते तयार करा',
    'auth.welcomeBack': 'परत स्वागत आहे',
    'auth.signUp': 'साइन अप',
    'auth.signIn': 'साइन इन',
    'auth.student': 'विद्यार्थी',
    'auth.admin': 'अॅडमिन',
    'auth.studentLogin': 'विद्यार्थी लॉगिन',
    'auth.studentSignUp': 'विद्यार्थी साइन अप',
    'auth.adminLogin': 'अॅडमिन लॉगिन',
    'auth.usn': 'यूएसएन',
    'auth.usnOrEmail': 'यूएसएन किंवा ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.email': 'ईमेल',
    'auth.fullName': 'पूर्ण नाव',
    'auth.useUSN': 'यूएसएन आणि ईमेलने तुमचे खाते तयार करा',
    'auth.useEmail': 'तुमचा अॅडमिन ईमेल आणि पासवर्ड वापरा',
    'auth.enterUSN': 'उदा., 3GN24CI000',
    'auth.enterPassword': 'तुमचा पासवर्ड टाका',
    'auth.enterName': 'तुमचे पूर्ण नाव टाका',
    'auth.enterEmail': 'तुमचा ईमेल टाका',
    'auth.alreadyHaveAccount': 'आधीच खाते आहे?',
    'auth.dontHaveAccount': 'खाते नाही?',
    'auth.forgotPassword': 'पासवर्ड विसरलात?',
    'auth.resetPassword': 'पासवर्ड रीसेट करा',
    'auth.sendResetLink': 'रीसेट लिंक पाठवा',
    'auth.backToLogin': 'लॉगिनवर परत जा',
    'auth.signUpToAccess': 'तुमची अभ्यास साहित्य मिळवण्यासाठी साइन अप करा',
    'auth.signInToAccess': 'तुमची अभ्यास साहित्य मिळवण्यासाठी साइन इन करा',
    
    // Dashboard
    'dashboard.goodMorning': 'सुप्रभात',
    'dashboard.goodAfternoon': 'शुभ दुपार',
    'dashboard.goodEvening': 'शुभ संध्याकाळ',
    'dashboard.accessMaterials': 'तुमची अभ्यास साहित्य आणि संसाधने मिळवा',
    'dashboard.welcomeBack': 'परत स्वागत आहे',
    'dashboard.continueJourney': 'तुमचा शिक्षण प्रवास सुरू ठेवा आणि AI मध्ये प्रावीण्य मिळवा',
    'dashboard.semester3': 'तिसरे सेमेस्टर',
    'dashboard.semester4': 'चौथे सेमेस्टर',
    'dashboard.subjects': 'विषय',
    'dashboard.viewMaterials': 'साहित्य पहा',
    'dashboard.quiz': 'क्विझ',
    'dashboard.comingSoon': 'लवकरच येत आहे',
    'dashboard.noSubjects': 'अद्याप विषय नाहीत',
    'dashboard.checkLater': 'चौथ्या सेमेस्टरचे विषय उपलब्ध झाल्यावर येथे जोडले जातील.',
    'dashboard.calculator': 'कॅल्क्युलेटर',
    'dashboard.upload': 'अपलोड',
    'dashboard.signOut': 'साइन आउट',
    'dashboard.aimlPortal': 'एआयएमएल पोर्टल',
    
    // Stats
    'stats.resourcesViewed': 'पाहिलेली संसाधने',
    'stats.quizzesCompleted': 'पूर्ण केलेल्या क्विझ',
    'stats.subjectsExplored': 'शोधलेले विषय',
    'stats.studyStreak': 'अभ्यास स्ट्रीक',
    'stats.days': 'दिवस',
    'stats.thisWeek': 'या आठवड्यात',
    'stats.thisMonth': 'या महिन्यात',
    'stats.keepItUp': 'असेच सुरू ठेवा!',
    
    // Quiz
    'quiz.dailyQuiz': 'दैनिक क्विझ',
    'quiz.question': 'प्रश्न',
    'quiz.previous': 'मागील',
    'quiz.next': 'पुढील',
    'quiz.submit': 'क्विझ सबमिट करा',
    'quiz.complete': 'क्विझ पूर्ण!',
    'quiz.excellentWork': 'उत्कृष्ट काम!',
    'quiz.goodEffort': 'चांगला प्रयत्न!',
    'quiz.keepPracticing': 'सराव सुरू ठेवा!',
    'quiz.alreadyAttempted': 'आज आधीच प्रयत्न केला!',
    'quiz.alreadyTaken': 'तुम्ही आज आधीच क्विझ दिला आहे.',
    'quiz.yourScore': 'तुमचा स्कोर',
    'quiz.comeBackTomorrow': 'नवीन प्रश्नांसाठी उद्या या!',
    'quiz.backToDashboard': 'डॅशबोर्डवर परत',
    'quiz.exitQuiz': 'क्विझमधून बाहेर',
    'quiz.leaderboard': 'लीडरबोर्ड',
    'quiz.rank': 'रँक',
    'quiz.usn': 'यूएसएन',
    'quiz.score': 'स्कोर',
    
    // Subject
    'subject.materials': 'साहित्य',
    'subject.pyqs': 'मागील वर्षाचे प्रश्न',
    'subject.semester': 'सेमेस्टर',
    'subject.noFiles': 'अद्याप फाइल्स नाहीत',
    'subject.materialsEmpty': 'अॅडमिनने अपलोड केल्यावर अभ्यास साहित्य येथे दिसेल.',
    'subject.pyqsEmpty': 'अॅडमिनने अपलोड केल्यावर मागील वर्षाचे प्रश्नपत्र येथे दिसतील.',
    'subject.view': 'पहा',
    'subject.download': 'डाउनलोड',
    'subject.delete': 'हटवा',
    'subject.deleteResource': 'संसाधन हटवा',
    'subject.deleteConfirm': 'तुम्हाला खात्री आहे की तुम्ही हे संसाधन हटवू इच्छिता? ही क्रिया परत केली जाऊ शकत नाही.',
    'subject.cancel': 'रद्द करा',
    
    // Landing
    'landing.signIn': 'साइन इन',
    'landing.badge': 'एआयएमएल विभाग संसाधन पोर्टल',
    'landing.title1': 'तुमची अभ्यास साहित्य,',
    'landing.title2': 'सर्व एकाच ठिकाणी',
    'landing.description': 'तुमच्या एआयएमएल अभ्यासक्रमांसाठी लेक्चर नोट्स, पीडीएफ आणि अभ्यास संसाधने मिळवा. सोप्या नेव्हिगेशनसाठी सेमेस्टर आणि विषयानुसार व्यवस्थित.',
    'landing.getStarted': 'सुरू करा',
    'landing.adminLogin': 'अॅडमिन लॉगिन',
    'landing.organizedResources': 'व्यवस्थित संसाधने',
    'landing.organizedDesc': 'जलद प्रवेशासाठी सेमेस्टर आणि विषयानुसार व्यवस्थित अभ्यास साहित्य',
    'landing.easyDownloads': 'सोपे डाउनलोड',
    'landing.downloadsDesc': 'एका क्लिकवर पीडीएफ आणि दस्तऐवज त्वरित डाउनलोड करा',
    'landing.roleBasedAccess': 'भूमिका आधारित प्रवेश',
    'landing.roleBasedDesc': 'विद्यार्थी आणि प्रशासकांसाठी वेगळे इंटरफेस',
    'landing.footer': '© 2024 एआयएमएल विभाग. सर्व हक्क राखीव.',
    
    // Settings
    'settings.language': 'भाषा',
    'settings.selectLanguage': 'भाषा निवडा',
    'settings.theme': 'थीम',
    
    // Notifications
    'notifications.title': 'सूचना',
    'notifications.markAllRead': 'सर्व वाचलेले म्हणून चिन्हांकित करा',
    'notifications.noNotifications': 'कोणत्याही सूचना नाहीत',
    
    // Share
    'share.shareApp': 'अॅप शेअर करा',
    'share.copyLink': 'लिंक कॉपी करा',
    'share.linkCopied': 'लिंक कॉपी झाली!',
    
    // Common
    'common.back': 'मागे',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.success': 'यशस्वी',
  },
  kannada: {
    // Auth
    'auth.createAccount': 'ಖಾತೆ ರಚಿಸಿ',
    'auth.welcomeBack': 'ಮರಳಿ ಸ್ವಾಗತ',
    'auth.signUp': 'ಸೈನ್ ಅಪ್',
    'auth.signIn': 'ಸೈನ್ ಇನ್',
    'auth.student': 'ವಿದ್ಯಾರ್ಥಿ',
    'auth.admin': 'ಅಡ್ಮಿನ್',
    'auth.studentLogin': 'ವಿದ್ಯಾರ್ಥಿ ಲಾಗಿನ್',
    'auth.studentSignUp': 'ವಿದ್ಯಾರ್ಥಿ ಸೈನ್ ಅಪ್',
    'auth.adminLogin': 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್',
    'auth.usn': 'ಯುಎಸ್ಎನ್',
    'auth.usnOrEmail': 'ಯುಎಸ್ಎನ್ ಅಥವಾ ಇಮೇಲ್',
    'auth.password': 'ಪಾಸ್‌ವರ್ಡ್',
    'auth.email': 'ಇಮೇಲ್',
    'auth.fullName': 'ಪೂರ್ಣ ಹೆಸರು',
    'auth.useUSN': 'ಯುಎಸ್ಎನ್ ಮತ್ತು ಇಮೇಲ್‌ನೊಂದಿಗೆ ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ',
    'auth.useEmail': 'ನಿಮ್ಮ ಅಡ್ಮಿನ್ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ',
    'auth.enterUSN': 'ಉದಾ., 3GN24CI000',
    'auth.enterPassword': 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    'auth.enterName': 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ',
    'auth.enterEmail': 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
    'auth.alreadyHaveAccount': 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    'auth.dontHaveAccount': 'ಖಾತೆ ಇಲ್ಲವೇ?',
    'auth.forgotPassword': 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    'auth.resetPassword': 'ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಮಾಡಿ',
    'auth.sendResetLink': 'ರೀಸೆಟ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ',
    'auth.backToLogin': 'ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    'auth.signUpToAccess': 'ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳನ್ನು ಪಡೆಯಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    'auth.signInToAccess': 'ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳನ್ನು ಪಡೆಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
    
    // Dashboard
    'dashboard.goodMorning': 'ಶುಭೋದಯ',
    'dashboard.goodAfternoon': 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    'dashboard.goodEvening': 'ಶುಭ ಸಂಜೆ',
    'dashboard.accessMaterials': 'ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳನ್ನು ಪಡೆಯಿರಿ',
    'dashboard.welcomeBack': 'ಮರಳಿ ಸ್ವಾಗತ',
    'dashboard.continueJourney': 'ನಿಮ್ಮ ಕಲಿಕೆಯ ಪ್ರಯಾಣವನ್ನು ಮುಂದುವರಿಸಿ ಮತ್ತು AI ಯಲ್ಲಿ ಪ್ರಾವೀಣ್ಯ ಪಡೆಯಿರಿ',
    'dashboard.semester3': '3ನೇ ಸೆಮಿಸ್ಟರ್',
    'dashboard.semester4': '4ನೇ ಸೆಮಿಸ್ಟರ್',
    'dashboard.subjects': 'ವಿಷಯಗಳು',
    'dashboard.viewMaterials': 'ಸಾಮಗ್ರಿ ವೀಕ್ಷಿಸಿ',
    'dashboard.quiz': 'ಕ್ವಿಜ್',
    'dashboard.comingSoon': 'ಶೀಘ್ರದಲ್ಲಿ ಬರುತ್ತಿದೆ',
    'dashboard.noSubjects': 'ಇನ್ನೂ ವಿಷಯಗಳಿಲ್ಲ',
    'dashboard.checkLater': '4ನೇ ಸೆಮಿಸ್ಟರ್ ವಿಷಯಗಳು ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ಸೇರಿಸಲಾಗುವುದು.',
    'dashboard.calculator': 'ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    'dashboard.upload': 'ಅಪ್‌ಲೋಡ್',
    'dashboard.signOut': 'ಸೈನ್ ಔಟ್',
    'dashboard.aimlPortal': 'ಎಐಎಮ್ಎಲ್ ಪೋರ್ಟಲ್',
    
    // Stats
    'stats.resourcesViewed': 'ವೀಕ್ಷಿಸಿದ ಸಂಪನ್ಮೂಲಗಳು',
    'stats.quizzesCompleted': 'ಪೂರ್ಣಗೊಂಡ ಕ್ವಿಜ್‌ಗಳು',
    'stats.subjectsExplored': 'ಅನ್ವೇಷಿಸಿದ ವಿಷಯಗಳು',
    'stats.studyStreak': 'ಅಧ್ಯಯನ ಸ್ಟ್ರೀಕ್',
    'stats.days': 'ದಿನಗಳು',
    'stats.thisWeek': 'ಈ ವಾರ',
    'stats.thisMonth': 'ಈ ತಿಂಗಳು',
    'stats.keepItUp': 'ಮುಂದುವರಿಸಿ!',
    
    // Quiz
    'quiz.dailyQuiz': 'ದೈನಿಕ ಕ್ವಿಜ್',
    'quiz.question': 'ಪ್ರಶ್ನೆ',
    'quiz.previous': 'ಹಿಂದಿನ',
    'quiz.next': 'ಮುಂದಿನ',
    'quiz.submit': 'ಕ್ವಿಜ್ ಸಲ್ಲಿಸಿ',
    'quiz.complete': 'ಕ್ವಿಜ್ ಪೂರ್ಣ!',
    'quiz.excellentWork': 'ಅತ್ಯುತ್ತಮ ಕೆಲಸ!',
    'quiz.goodEffort': 'ಉತ್ತಮ ಪ್ರಯತ್ನ!',
    'quiz.keepPracticing': 'ಅಭ್ಯಾಸ ಮುಂದುವರಿಸಿ!',
    'quiz.alreadyAttempted': 'ಇಂದು ಈಗಾಗಲೇ ಪ್ರಯತ್ನಿಸಲಾಗಿದೆ!',
    'quiz.alreadyTaken': 'ನೀವು ಇಂದು ಈಗಾಗಲೇ ಕ್ವಿಜ್ ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ.',
    'quiz.yourScore': 'ನಿಮ್ಮ ಸ್ಕೋರ್',
    'quiz.comeBackTomorrow': 'ಹೊಸ ಪ್ರಶ್ನೆಗಳಿಗಾಗಿ ನಾಳೆ ಬನ್ನಿ!',
    'quiz.backToDashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    'quiz.exitQuiz': 'ಕ್ವಿಜ್‌ನಿಂದ ನಿರ್ಗಮಿಸಿ',
    'quiz.leaderboard': 'ಲೀಡರ್‌ಬೋರ್ಡ್',
    'quiz.rank': 'ಶ್ರೇಣಿ',
    'quiz.usn': 'ಯುಎಸ್ಎನ್',
    'quiz.score': 'ಸ್ಕೋರ್',
    
    // Subject
    'subject.materials': 'ಸಾಮಗ್ರಿಗಳು',
    'subject.pyqs': 'ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆಗಳು',
    'subject.semester': 'ಸೆಮಿಸ್ಟರ್',
    'subject.noFiles': 'ಇನ್ನೂ ಫೈಲ್‌ಗಳಿಲ್ಲ',
    'subject.materialsEmpty': 'ಅಡ್ಮಿನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದಾಗ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    'subject.pyqsEmpty': 'ಅಡ್ಮಿನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದಾಗ ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    'subject.view': 'ವೀಕ್ಷಿಸಿ',
    'subject.download': 'ಡೌನ್‌ಲೋಡ್',
    'subject.delete': 'ಅಳಿಸಿ',
    'subject.deleteResource': 'ಸಂಪನ್ಮೂಲ ಅಳಿಸಿ',
    'subject.deleteConfirm': 'ಈ ಸಂಪನ್ಮೂಲವನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    'subject.cancel': 'ರದ್ದುಮಾಡಿ',
    
    // Landing
    'landing.signIn': 'ಸೈನ್ ಇನ್',
    'landing.badge': 'ಎಐಎಮ್ಎಲ್ ವಿಭಾಗ ಸಂಪನ್ಮೂಲ ಪೋರ್ಟಲ್',
    'landing.title1': 'ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು,',
    'landing.title2': 'ಎಲ್ಲಾ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ',
    'landing.description': 'ನಿಮ್ಮ ಎಐಎಮ್ಎಲ್ ಕೋರ್ಸ್‌ಗಳಿಗಾಗಿ ಲೆಕ್ಚರ್ ನೋಟ್ಸ್, ಪಿಡಿಎಫ್‌ಗಳು ಮತ್ತು ಅಧ್ಯಯನ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಪಡೆಯಿರಿ. ಸುಲಭ ನ್ಯಾವಿಗೇಶನ್‌ಗಾಗಿ ಸೆಮಿಸ್ಟರ್ ಮತ್ತು ವಿಷಯದ ಪ್ರಕಾರ ವ್ಯವಸ್ಥಿತಗೊಳಿಸಲಾಗಿದೆ.',
    'landing.getStarted': 'ಪ್ರಾರಂಭಿಸಿ',
    'landing.adminLogin': 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್',
    'landing.organizedResources': 'ವ್ಯವಸ್ಥಿತ ಸಂಪನ್ಮೂಲಗಳು',
    'landing.organizedDesc': 'ತ್ವರಿತ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸೆಮಿಸ್ಟರ್ ಮತ್ತು ವಿಷಯದ ಪ್ರಕಾರ ವ್ಯವಸ್ಥಿತಗೊಳಿಸಿದ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು',
    'landing.easyDownloads': 'ಸುಲಭ ಡೌನ್‌ಲೋಡ್‌ಗಳು',
    'landing.downloadsDesc': 'ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಪಿಡಿಎಫ್‌ಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ತಕ್ಷಣ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    'landing.roleBasedAccess': 'ಪಾತ್ರ ಆಧಾರಿತ ಪ್ರವೇಶ',
    'landing.roleBasedDesc': 'ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ಪ್ರತ್ಯೇಕ ಇಂಟರ್ಫೇಸ್‌ಗಳು',
    'landing.footer': '© 2024 ಎಐಎಮ್ಎಲ್ ವಿಭಾಗ. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    
    // Settings
    'settings.language': 'ಭಾಷೆ',
    'settings.selectLanguage': 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    'settings.theme': 'ಥೀಮ್',
    
    // Notifications
    'notifications.title': 'ಅಧಿಸೂಚನೆಗಳು',
    'notifications.markAllRead': 'ಎಲ್ಲವನ್ನೂ ಓದಿದ ಎಂದು ಗುರುತಿಸಿ',
    'notifications.noNotifications': 'ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ',
    
    // Share
    'share.shareApp': 'ಆ್ಯಪ್ ಹಂಚಿಕೊಳ್ಳಿ',
    'share.copyLink': 'ಲಿಂಕ್ ನಕಲಿಸಿ',
    'share.linkCopied': 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
    
    // Common
    'common.back': 'ಹಿಂದೆ',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.error': 'ದೋಷ',
    'common.success': 'ಯಶಸ್ಸು',
  },
    'common.back': 'ಹಿಂದೆ',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.error': 'ದೋಷ',
    'common.success': 'ಯಶಸ್ಸು',
  },
  telugu: {
    // Auth
    'auth.createAccount': 'ఖాతా సృష్టించండి',
    'auth.welcomeBack': 'తిరిగి స్వాగతం',
    'auth.signUp': 'సైన్ అప్',
    'auth.signIn': 'సైన్ ఇన్',
    'auth.student': 'విద్యార్థి',
    'auth.admin': 'అడ్మిన్',
    'auth.studentLogin': 'విద్యార్థి లాగిన్',
    'auth.studentSignUp': 'విద్యార్థి సైన్ అప్',
    'auth.adminLogin': 'అడ్మిన్ లాగిన్',
    'auth.usn': 'యుఎస్ఎన్',
    'auth.usnOrEmail': 'యుఎస్ఎన్ లేదా ఇమెయిల్',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.email': 'ఇమెయిల్',
    'auth.fullName': 'పూర్తి పేరు',
    'auth.useUSN': 'యుఎస్ఎన్ మరియు ఇమెయిల్‌తో మీ ఖాతా సృష్టించండి',
    'auth.useEmail': 'మీ అడ్మిన్ ఇమెయిల్ మరియు పాస్‌వర్డ్ ఉపయోగించండి',
    'auth.enterUSN': 'ఉదా., 3GN24CI000',
    'auth.enterPassword': 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
    'auth.enterName': 'మీ పూర్తి పేరు నమోదు చేయండి',
    'auth.enterEmail': 'మీ ఇమెయిల్ నమోదు చేయండి',
    'auth.alreadyHaveAccount': 'ఇప్పటికే ఖాతా ఉందా?',
    'auth.dontHaveAccount': 'ఖాతా లేదా?',
    'auth.forgotPassword': 'పాస్‌వర్డ్ మర్చిపోయారా?',
    'auth.resetPassword': 'పాస్‌వర్డ్ రీసెట్ చేయండి',
    'auth.sendResetLink': 'రీసెట్ లింక్ పంపండి',
    'auth.backToLogin': 'లాగిన్‌కు తిరిగి వెళ్ళండి',
    'auth.signUpToAccess': 'మీ అధ్యయన సామగ్రిని పొందడానికి సైన్ అప్ చేయండి',
    'auth.signInToAccess': 'మీ అధ్యయన సామగ్రిని పొందడానికి సైన్ ఇన్ చేయండి',
    
    // Dashboard
    'dashboard.goodMorning': 'శుభోదయం',
    'dashboard.goodAfternoon': 'శుభ మధ్యాహ్నం',
    'dashboard.goodEvening': 'శుభ సాయంత్రం',
    'dashboard.accessMaterials': 'మీ అధ్యయన సామగ్రి మరియు వనరులను పొందండి',
    'dashboard.welcomeBack': 'తిరిగి స్వాగతం',
    'dashboard.continueJourney': 'మీ అభ్యాస ప్రయాణాన్ని కొనసాగించండి మరియు AI లో నైపుణ్యం పొందండి',
    'dashboard.semester3': '3వ సెమిస్టర్',
    'dashboard.semester4': '4వ సెమిస్టర్',
    'dashboard.subjects': 'సబ్జెక్టులు',
    'dashboard.viewMaterials': 'సామగ్రి చూడండి',
    'dashboard.quiz': 'క్విజ్',
    'dashboard.comingSoon': 'త్వరలో వస్తోంది',
    'dashboard.noSubjects': 'ఇంకా సబ్జెక్టులు లేవు',
    'dashboard.checkLater': '4వ సెమిస్టర్ సబ్జెక్టులు అందుబాటులో ఉన్నప్పుడు ఇక్కడ జోడించబడతాయి.',
    'dashboard.calculator': 'కాల్క్యులేటర్',
    'dashboard.upload': 'అప్‌లోడ్',
    'dashboard.signOut': 'సైన్ ఔట్',
    'dashboard.aimlPortal': 'ఏఐఎమ్ఎల్ పోర్టల్',
    
    // Stats
    'stats.resourcesViewed': 'చూసిన వనరులు',
    'stats.quizzesCompleted': 'పూర్తి చేసిన క్విజ్‌లు',
    'stats.subjectsExplored': 'అన్వేషించిన సబ్జెక్టులు',
    'stats.studyStreak': 'అధ్యయన స్ట్రీక్',
    'stats.days': 'రోజులు',
    'stats.thisWeek': 'ఈ వారం',
    'stats.thisMonth': 'ఈ నెల',
    'stats.keepItUp': 'కొనసాగించండి!',
    
    // Quiz
    'quiz.dailyQuiz': 'రోజువారీ క్విజ్',
    'quiz.question': 'ప్రశ్న',
    'quiz.previous': 'మునుపటి',
    'quiz.next': 'తదుపరి',
    'quiz.submit': 'క్విజ్ సమర్పించండి',
    'quiz.complete': 'క్విజ్ పూర్తయింది!',
    'quiz.excellentWork': 'అద్భుతమైన పని!',
    'quiz.goodEffort': 'మంచి ప్రయత్నం!',
    'quiz.keepPracticing': 'సాధన కొనసాగించండి!',
    'quiz.alreadyAttempted': 'ఈరోజు ఇప్పటికే ప్రయత్నించారు!',
    'quiz.alreadyTaken': 'మీరు ఈరోజు ఇప్పటికే క్విజ్ తీసుకున్నారు.',
    'quiz.yourScore': 'మీ స్కోర్',
    'quiz.comeBackTomorrow': 'కొత్త ప్రశ్నల కోసం రేపు రండి!',
    'quiz.backToDashboard': 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి',
    'quiz.exitQuiz': 'క్విజ్ నుండి నిష్క్రమించండి',
    'quiz.leaderboard': 'లీడర్‌బోర్డ్',
    'quiz.rank': 'ర్యాంక్',
    'quiz.usn': 'యుఎస్ఎన్',
    'quiz.score': 'స్కోర్',
    
    // Subject
    'subject.materials': 'సామగ్రి',
    'subject.pyqs': 'గత సంవత్సరం ప్రశ్నలు',
    'subject.semester': 'సెమిస్టర్',
    'subject.noFiles': 'ఇంకా ఫైల్స్ లేవు',
    'subject.materialsEmpty': 'అడ్మిన్ అప్‌లోడ్ చేసినప్పుడు అధ్యయన సామగ్రి ఇక్కడ కనిపిస్తుంది.',
    'subject.pyqsEmpty': 'అడ్మిన్ అప్‌లోడ్ చేసినప్పుడు గత సంవత్సరం ప్రశ్న పత్రాలు ఇక్కడ కనిపిస్తాయి.',
    'subject.view': 'చూడండి',
    'subject.download': 'డౌన్‌లోడ్',
    'subject.delete': 'తొలగించు',
    'subject.deleteResource': 'వనరు తొలగించు',
    'subject.deleteConfirm': 'ఈ వనరును తొలగించాలనుకుంటున్నారా? ఈ చర్యను రద్దు చేయలేరు.',
    'subject.cancel': 'రద్దు చేయండి',
    
    // Landing
    'landing.signIn': 'సైన్ ఇన్',
    'landing.badge': 'ఏఐఎమ్ఎల్ విభాగం వనరుల పోర్టల్',
    'landing.title1': 'మీ అధ్యయన సామగ్రి,',
    'landing.title2': 'అన్నీ ఒకే చోట',
    'landing.description': 'మీ ఏఐఎమ్ఎల్ కోర్సుల కోసం లెక్చర్ నోట్స్, పిడిఎఫ్‌లు మరియు అధ్యయన వనరులను పొందండి. సులభమైన నావిగేషన్ కోసం సెమిస్టర్ మరియు సబ్జెక్ట్ ప్రకారం నిర్వహించబడింది.',
    'landing.getStarted': 'ప్రారంభించండి',
    'landing.adminLogin': 'అడ్మిన్ లాగిన్',
    'landing.organizedResources': 'వ్యవస్థీకృత వనరులు',
    'landing.organizedDesc': 'త్వరిత యాక్సెస్ కోసం సెమిస్టర్ మరియు సబ్జెక్ట్ ప్రకారం వ్యవస్థీకృత అధ్యయన సామగ్రి',
    'landing.easyDownloads': 'సులభమైన డౌన్‌లోడ్‌లు',
    'landing.downloadsDesc': 'ఒకే క్లిక్‌లో పిడిఎఫ్‌లు మరియు డాక్యుమెంట్‌లను తక్షణమే డౌన్‌లోడ్ చేయండి',
    'landing.roleBasedAccess': 'పాత్ర ఆధారిత యాక్సెస్',
    'landing.roleBasedDesc': 'విద్యార్థులు మరియు నిర్వాహకులకు ప్రత్యేక ఇంటర్‌ఫేస్‌లు',
    'landing.footer': '© 2024 ఏఐఎమ్ఎల్ విభాగం. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
    
    // Settings
    'settings.language': 'భాష',
    'settings.selectLanguage': 'భాష ఎంచుకోండి',
    'settings.theme': 'థీమ్',
    
    // Notifications
    'notifications.title': 'నోటిఫికేషన్లు',
    'notifications.markAllRead': 'అన్నీ చదివినట్లు గుర్తించండి',
    'notifications.noNotifications': 'నోటిఫికేషన్లు లేవు',
    
    // Share
    'share.shareApp': 'యాప్ షేర్ చేయండి',
    'share.copyLink': 'లింక్ కాపీ చేయండి',
    'share.linkCopied': 'లింక్ కాపీ అయింది!',
    
    // Common
    'common.back': 'వెనుకకు',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
  },
};
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('english');

  // Load language preference
  useEffect(() => {
    const loadLanguage = async () => {
      // First check localStorage for guest users
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && LANGUAGES.find(l => l.id === savedLang)) {
        setLanguageState(savedLang);
      }

      // If logged in, fetch from database
      if (user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('language')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data?.language) {
          setLanguageState(data.language as Language);
          localStorage.setItem('language', data.language);
        }
      }
    };

    loadLanguage();
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: lang,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.english[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
