import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react';
import type { QuizQuestion, CategoryInfo } from '../data/quizData';
import type { Answers } from '../App';

interface QuizProps {
  questions: QuizQuestion[];
  categories: CategoryInfo[];
  initialAnswers: Answers;
  onSubmit: (answers: Answers) => void;
}

export function Quiz({ questions, categories, initialAnswers, onSubmit }: QuizProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Answers>(initialAnswers);
  const [showValidation, setShowValidation] = useState(false);

  const categoryKeys = ['body', 'picture', 'word', 'logic', 'music', 'people'] as const;

  const currentCategoryKey = categoryKeys[currentSection];
  const currentCategory = categories.find(c => c.key === currentCategoryKey)!;
  const sectionQuestions = questions.filter(q => q.category === currentCategoryKey);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(localAnswers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('quiz_answers', JSON.stringify(localAnswers));
  }, [localAnswers]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quiz_answers');
    if (saved) {
      try {
        setLocalAnswers(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleAnswer = useCallback((questionId: number, value: number) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const currentSectionAnsweredCount = sectionQuestions.filter(q => localAnswers[q.id] !== undefined).length;
  const currentSectionProgress = (currentSectionAnsweredCount / sectionQuestions.length) * 100;

  const canGoNext = currentSection < categories.length - 1;
  const canGoPrev = currentSection > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => localAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      setShowValidation(true);
      return;
    }
    onSubmit(localAnswers);
    localStorage.removeItem('quiz_answers');
  };

  return (
    <div className="animate-fadeIn">
      {/* Progress Bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Overall Progress: {answeredCount}/{totalQuestions} questions answered
          </span>
          <span className="text-sm font-bold text-sky-600">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat, idx) => {
          const catQuestions = questions.filter(q => q.category === cat.key);
          const catAnswered = catQuestions.filter(q => localAnswers[q.id] !== undefined).length;
          const isComplete = catAnswered === catQuestions.length;
          const isCurrent = idx === currentSection;

          return (
            <button
              key={cat.key}
              onClick={() => setCurrentSection(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isCurrent
                  ? 'bg-white shadow-md border-2 border-sky-500 text-sky-700'
                  : isComplete
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {isComplete && (
                  <span className="text-emerald-500">\u2713</span>
                )}
                <span>{cat.label}</span>
                <span className="text-xs opacity-75">({catAnswered}/{catQuestions.length})</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Section Card */}
      <div className="card p-6 sm:p-8 mb-6">
        {/* Section Header */}
        <div className="mb-6">
          <div
            className="section-badge mb-3"
            style={{
              backgroundColor: currentCategory.lightBg,
              color: currentCategory.color,
              border: `1px solid ${currentCategory.borderColor}`
            }}
          >
            Section {currentSection + 1} of 6
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {currentCategory.label}
          </h2>
          <p className="font-urdu text-xl text-gray-600">{currentCategory.urdu}</p>

          {/* Section Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Section Progress</span>
              <span className="font-semibold" style={{ color: currentCategory.color }}>
                {currentSectionAnsweredCount}/{sectionQuestions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${currentSectionProgress}%`,
                  backgroundColor: currentCategory.color
                }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {sectionQuestions.map((question) => {
            const selectedValue = localAnswers[question.id];
            const isUnanswered = showValidation && selectedValue === undefined;

            return (
              <div
                key={question.id}
                className={`p-5 rounded-xl transition-all ${
                  isUnanswered
                    ? 'bg-red-50 border-2 border-red-300'
                    : 'bg-gray-50 border-2 border-gray-100'
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: currentCategory.color }}
                    >
                      {question.id}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{question.english}</p>
                      <p className="font-urdu text-gray-600 mt-1">{question.urdu}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={`option-card ${selectedValue === option.value ? 'selected' : ''}`}
                    >
                      <div className="option-radio" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{option.value}. {option.english}</p>
                        <p className="font-urdu text-sm text-gray-600">{option.urdu}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Warning */}
      {showValidation && (
        <div className="card p-4 mb-6 bg-red-50 border-2 border-red-200 animate-scaleIn">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">Please answer all questions before submitting.</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`btn-secondary ${!canGoPrev ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {currentSection === categories.length - 1 ? (
          <button onClick={handleSubmit} className="btn-primary">
            <Send className="w-5 h-5" />
            Submit Assessment
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary">
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
