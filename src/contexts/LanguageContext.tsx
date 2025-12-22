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
    'auth.adminLogin': 'Admin Login',
    'auth.usn': 'USN',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.fullName': 'Full Name',
    'auth.useUSN': 'Use your University Seat Number (USN)',
    'auth.useEmail': 'Use your admin email and password',
    'auth.enterUSN': 'e.g., 1MS21AI001',
    'auth.enterPassword': 'Enter your password',
    'auth.enterName': 'Enter your full name',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account? (Students only)",
    
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
    
    // Stats
    'stats.resourcesViewed': 'Resources Viewed',
    'stats.quizzesCompleted': 'Quizzes Completed',
    'stats.subjectsExplored': 'Subjects Explored',
    'stats.studyStreak': 'Study Streak',
    'stats.days': 'days',
    
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
    
    // Settings
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select Language',
    'settings.theme': 'Theme',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark all as read',
    'notifications.noNotifications': 'No notifications',
    
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
    'auth.adminLogin': 'एडमिन लॉगिन',
    'auth.usn': 'यूएसएन',
    'auth.password': 'पासवर्ड',
    'auth.email': 'ईमेल',
    'auth.fullName': 'पूरा नाम',
    'auth.useUSN': 'अपना विश्वविद्यालय सीट नंबर (USN) उपयोग करें',
    'auth.useEmail': 'अपना एडमिन ईमेल और पासवर्ड उपयोग करें',
    'auth.enterUSN': 'जैसे, 1MS21AI001',
    'auth.enterPassword': 'अपना पासवर्ड दर्ज करें',
    'auth.enterName': 'अपना पूरा नाम दर्ज करें',
    'auth.alreadyHaveAccount': 'पहले से खाता है?',
    'auth.dontHaveAccount': 'खाता नहीं है? (केवल छात्र)',
    
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
    
    // Stats
    'stats.resourcesViewed': 'देखे गए संसाधन',
    'stats.quizzesCompleted': 'पूर्ण क्विज़',
    'stats.subjectsExplored': 'खोजे गए विषय',
    'stats.studyStreak': 'अध्ययन स्ट्रीक',
    'stats.days': 'दिन',
    
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
    
    // Settings
    'settings.language': 'भाषा',
    'settings.selectLanguage': 'भाषा चुनें',
    'settings.theme': 'थीम',
    
    // Notifications
    'notifications.title': 'सूचनाएं',
    'notifications.markAllRead': 'सभी को पढ़ा हुआ चिह्नित करें',
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
    'auth.adminLogin': 'अॅडमिन लॉगिन',
    'auth.usn': 'यूएसएन',
    'auth.password': 'पासवर्ड',
    'auth.email': 'ईमेल',
    'auth.fullName': 'पूर्ण नाव',
    'auth.useUSN': 'तुमचा विद्यापीठ सीट क्रमांक (USN) वापरा',
    'auth.useEmail': 'तुमचा अॅडमिन ईमेल आणि पासवर्ड वापरा',
    'auth.enterUSN': 'उदा., 1MS21AI001',
    'auth.enterPassword': 'तुमचा पासवर्ड टाका',
    'auth.enterName': 'तुमचे पूर्ण नाव टाका',
    'auth.alreadyHaveAccount': 'आधीच खाते आहे?',
    'auth.dontHaveAccount': 'खाते नाही? (फक्त विद्यार्थी)',
    
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
    
    // Stats
    'stats.resourcesViewed': 'पाहिलेली संसाधने',
    'stats.quizzesCompleted': 'पूर्ण केलेल्या क्विझ',
    'stats.subjectsExplored': 'शोधलेले विषय',
    'stats.studyStreak': 'अभ्यास स्ट्रीक',
    'stats.days': 'दिवस',
    
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
    'auth.adminLogin': 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್',
    'auth.usn': 'ಯುಎಸ್ಎನ್',
    'auth.password': 'ಪಾಸ್‌ವರ್ಡ್',
    'auth.email': 'ಇಮೇಲ್',
    'auth.fullName': 'ಪೂರ್ಣ ಹೆಸರು',
    'auth.useUSN': 'ನಿಮ್ಮ ವಿಶ್ವವಿದ್ಯಾಲಯ ಸೀಟ್ ಸಂಖ್ಯೆ (USN) ಬಳಸಿ',
    'auth.useEmail': 'ನಿಮ್ಮ ಅಡ್ಮಿನ್ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ',
    'auth.enterUSN': 'ಉದಾ., 1MS21AI001',
    'auth.enterPassword': 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    'auth.enterName': 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ',
    'auth.alreadyHaveAccount': 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    'auth.dontHaveAccount': 'ಖಾತೆ ಇಲ್ಲವೇ? (ವಿದ್ಯಾರ್ಥಿಗಳು ಮಾತ್ರ)',
    
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
    
    // Stats
    'stats.resourcesViewed': 'ವೀಕ್ಷಿಸಿದ ಸಂಪನ್ಮೂಲಗಳು',
    'stats.quizzesCompleted': 'ಪೂರ್ಣಗೊಂಡ ಕ್ವಿಜ್‌ಗಳು',
    'stats.subjectsExplored': 'ಅನ್ವೇಷಿಸಿದ ವಿಷಯಗಳು',
    'stats.studyStreak': 'ಅಧ್ಯಯನ ಸ್ಟ್ರೀಕ್',
    'stats.days': 'ದಿನಗಳು',
    
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
  telugu: {
    // Auth
    'auth.createAccount': 'ఖాతా సృష్టించండి',
    'auth.welcomeBack': 'తిరిగి స్వాగతం',
    'auth.signUp': 'సైన్ అప్',
    'auth.signIn': 'సైన్ ఇన్',
    'auth.student': 'విద్యార్థి',
    'auth.admin': 'అడ్మిన్',
    'auth.studentLogin': 'విద్యార్థి లాగిన్',
    'auth.adminLogin': 'అడ్మిన్ లాగిన్',
    'auth.usn': 'యుఎస్ఎన్',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.email': 'ఇమెయిల్',
    'auth.fullName': 'పూర్తి పేరు',
    'auth.useUSN': 'మీ యూనివర్సిటీ సీట్ నంబర్ (USN) ఉపయోగించండి',
    'auth.useEmail': 'మీ అడ్మిన్ ఇమెయిల్ మరియు పాస్‌వర్డ్ ఉపయోగించండి',
    'auth.enterUSN': 'ఉదా., 1MS21AI001',
    'auth.enterPassword': 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
    'auth.enterName': 'మీ పూర్తి పేరు నమోదు చేయండి',
    'auth.alreadyHaveAccount': 'ఇప్పటికే ఖాతా ఉందా?',
    'auth.dontHaveAccount': 'ఖాతా లేదా? (విద్యార్థులు మాత్రమే)',
    
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
    
    // Stats
    'stats.resourcesViewed': 'చూసిన వనరులు',
    'stats.quizzesCompleted': 'పూర్తి చేసిన క్విజ్‌లు',
    'stats.subjectsExplored': 'అన్వేషించిన సబ్జెక్టులు',
    'stats.studyStreak': 'అధ్యయన స్ట్రీక్',
    'stats.days': 'రోజులు',
    
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
