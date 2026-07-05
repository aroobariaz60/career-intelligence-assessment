import { useState, useCallback, useEffect } from 'react';
import { StudentForm } from './components/StudentForm';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Feedback } from './components/Feedback';
import { ThankYou } from './components/ThankYou';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { questions, categories } from './data/quizData';

type Step = 'student' | 'quiz' | 'results' | 'feedback' | 'thankyou';
type View = 'student' | 'admin-login' | 'admin-dashboard';

export interface Student {
  fullName: string;
  email: string;
}

export interface Answers {
  [questionId: number]: number;
}

export interface FeedbackData {
  easyToUse: string;
  enjoyedTest: string;
  quickFeedback?: string;
}

export interface Scores {
  body: number;
  picture: number;
  word: number;
  logic: number;
  music: number;
  people: number;
}

const ADMIN_PASSWORD = 'admin123'; // Simple password for demo - in production use proper auth

function App() {
  const [view, setView] = useState<View>('student');
  const [step, setStep] = useState<Step>('student');
  const [student, setStudent] = useState<Student>({ fullName: '', email: '' });
  const [answers, setAnswers] = useState<Answers>({});
  const [scores, setScores] = useState<Scores>({ body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 });
  const [feedback, setFeedback] = useState<FeedbackData>({ easyToUse: '', enjoyedTest: '', quickFeedback: '' });
  const [adminError, setAdminError] = useState('');
  const [, setIsSubmitting] = useState(false);

  // Check URL hash for admin access
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#admin' || hash === '#/admin') {
      setView('admin-login');
    }
  }, []);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleStudentSubmit = useCallback((data: Student) => {
    setStudent(data);
    setStep('quiz');
  }, []);

  const handleQuizSubmit = useCallback((newAnswers: Answers) => {
    setAnswers(newAnswers);
    const newScores: Scores = { body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 };

    questions.forEach((q) => {
      const answer = newAnswers[q.id];
      if (answer !== undefined) {
        newScores[q.category] += answer;
      }
    });

    setScores(newScores);
    setStep('results');
  }, []);

  const getHighestIntelligence = useCallback((s: Scores) => {
    const maxScore = Math.max(s.body, s.picture, s.word, s.logic, s.music, s.people);
    const highest = categories.filter((cat) => {
      switch (cat.key) {
        case 'body': return s.body === maxScore;
        case 'picture': return s.picture === maxScore;
        case 'word': return s.word === maxScore;
        case 'logic': return s.logic === maxScore;
        case 'music': return s.music === maxScore;
        case 'people': return s.people === maxScore;
        default: return false;
      }
    });
    return highest[0]?.label || 'Body Smart';
  }, []);

  const submitToDatabase = useCallback(async () => {
    setIsSubmitting(true);

    const highestIntelligence = getHighestIntelligence(scores);
    const matchingCategories = categories.filter((c) => c.label === highestIntelligence);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: student.fullName,
          email: student.email,
          answers,
          scores,
          highestIntelligence,
          recommendedCareers: matchingCategories.flatMap((c) => c.careers),
          feedback,
        }),
      });

      if (!response.ok) {
        console.error('Failed to submit to database');
      }
    } catch (err) {
      console.error('Error submitting to database:', err);
    }

    setIsSubmitting(false);
  }, [student, answers, scores, feedback, getHighestIntelligence]);

  const handleFeedbackSubmit = useCallback(async (data: FeedbackData) => {
    setFeedback(data);
    await submitToDatabase();
    setStep('thankyou');
  }, [submitToDatabase]);

  const handleRestart = useCallback(() => {
    setStep('student');
    setStudent({ fullName: '', email: '' });
    setAnswers({});
    setScores({ body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 });
    setFeedback({ easyToUse: '', enjoyedTest: '', quickFeedback: '' });
    window.location.hash = '';
    setView('student');
  }, []);

  const handleBackToResults = useCallback(() => {
    setStep('results');
  }, []);

  const handleAdminLogin = useCallback(async (_email: string, password: string) => {
    // Simple password check - in production, use proper Supabase auth
    if (password === ADMIN_PASSWORD) {
      setAdminError('');
      setView('admin-dashboard');
      return true;
    } else {
      setAdminError('Invalid password. Please try again.');
      return false;
    }
  }, []);

  const handleAdminLogout = useCallback(() => {
    setView('student');
    window.location.hash = '';
    setAdminError('');
  }, []);

  // Admin Login View
  if (view === 'admin-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <AdminLogin onLogin={handleAdminLogin} error={adminError} />
      </div>
    );
  }

  // Admin Dashboard View
  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard onLogout={handleAdminLogout} />
    );
  }

  // Student View
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Career Intelligence Assessment</h1>
                <p className="text-xs text-gray-500 font-urdu">کیریئر انٹیلیجنس تشخیص</p>
              </div>
            </div>
            {step !== 'student' && step !== 'thankyou' && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{student.fullName}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                  {student.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      {step !== 'student' && step !== 'thankyou' && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {['student', 'quiz', 'results', 'feedback'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    ['student', 'quiz', 'results', 'feedback'].indexOf(step) > i
                      ? 'bg-emerald-500 text-white'
                      : ['student', 'quiz', 'results', 'feedback'].indexOf(step) === i
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {['student', 'quiz', 'results', 'feedback'].indexOf(step) > i ? '\u2713' : i + 1}
                </div>
                {i < 3 && (
                  <div
                    className={`w-8 sm:w-16 h-1 rounded-full transition-all ${
                      ['student', 'quiz', 'results', 'feedback'].indexOf(step) > i
                        ? 'bg-emerald-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-xs sm:text-sm text-gray-500">
              Step {['student', 'quiz', 'results', 'feedback'].indexOf(step) + 1} of 4 - {
                step === 'quiz' ? 'Assessment' :
                step === 'results' ? 'Results' : 'Feedback'
              }
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4">
        {step === 'student' && (
          <StudentForm onSubmit={handleStudentSubmit} />
        )}
        {step === 'quiz' && (
          <Quiz
            questions={questions}
            categories={categories}
            initialAnswers={answers}
            onSubmit={handleQuizSubmit}
          />
        )}
        {step === 'results' && (
          <Results
            student={student}
            scores={scores}
            categories={categories}
            onNext={() => setStep('feedback')}
          />
        )}
        {step === 'feedback' && (
          <Feedback
            onSubmit={handleFeedbackSubmit}
            onBack={handleBackToResults}
          />
        )}
        {step === 'thankyou' && (
          <ThankYou
            student={student}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-8 text-center text-gray-500 text-sm">
        <p>Career Intelligence Assessment - Based on Multiple Intelligences Theory</p>
        <p className="font-urdu mt-1">کیریئر انٹیلیجنس تشخیص - کثیر ذہانت کے نظریے پر مبنی</p>
      </footer>
    </div>
  );
}

export default App;
