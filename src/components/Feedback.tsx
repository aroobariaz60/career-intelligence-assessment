import { useState, FormEvent } from 'react';
import { ArrowLeft, Send, MessageSquare, Mail, Loader2 } from 'lucide-react';
import type { FeedbackData } from '../App';

interface FeedbackProps {
  onSubmit: (data: FeedbackData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function Feedback({ onSubmit, onBack, isSubmitting }: FeedbackProps) {
  const [easyToUse, setEasyToUse] = useState('');
  const [enjoyedTest, setEnjoyedTest] = useState('');
  const [quickFeedback, setQuickFeedback] = useState('');
  const [errors, setErrors] = useState<{ easyToUse?: string; enjoyedTest?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { easyToUse?: string; enjoyedTest?: string } = {};

    if (!easyToUse) {
      newErrors.easyToUse = 'Please select an option';
    }

    if (!enjoyedTest) {
      newErrors.enjoyedTest = 'Please select an option';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ easyToUse, enjoyedTest, quickFeedback });
  };

  const yesNoOptions = [
    { value: 'yes', english: 'Yes', urdu: 'جی ہاں' },
    { value: 'no', english: 'No', urdu: 'جی نہیں' },
  ];

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      {/* Header */}
      <div className="card p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>
            <p className="font-urdu text-gray-600">تاثرات</p>
          </div>
        </div>
        <p className="text-gray-600">
          Please provide your feedback about the assessment. Your responses will help us improve.
        </p>
        <p className="font-urdu text-gray-600 mt-1">
          براہ کرم تشخیص کے بارے میں اپنا تاثرات فراہم کریں۔ آپ کے جوابات ہمیں بہتر بنانے میں مدد کریں گے۔
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
        {/* Question 1 */}
        <div className="mb-8">
          <div className="mb-4">
            <p className="font-semibold text-gray-900 text-lg">
              Was the website easy to use?
            </p>
            <p className="font-urdu text-gray-600 mt-1">
              کیا ویب سائٹ کو استعمال کرنا آسان تھا؟
            </p>
          </div>
          <div className="flex gap-4">
            {yesNoOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setEasyToUse(option.value);
                  if (errors.easyToUse) setErrors({ ...errors, easyToUse: undefined });
                }}
                className={`flex-1 option-card ${easyToUse === option.value ? 'selected' : ''}`}
              >
                <div className="option-radio" />
                <div>
                  <p className="font-medium text-gray-900">{option.english}</p>
                  <p className="font-urdu text-sm text-gray-600">{option.urdu}</p>
                </div>
              </button>
            ))}
          </div>
          {errors.easyToUse && (
            <p className="text-red-500 text-sm mt-2">{errors.easyToUse}</p>
          )}
        </div>

        {/* Question 2 */}
        <div className="mb-8">
          <div className="mb-4">
            <p className="font-semibold text-gray-900 text-lg">
              Did you enjoy taking this test?
            </p>
            <p className="font-urdu text-gray-600 mt-1">
              کیا آپ نے اس ٹیسٹ کو دینے میں دلچسپی لی؟
            </p>
          </div>
          <div className="flex gap-4">
            {yesNoOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setEnjoyedTest(option.value);
                  if (errors.enjoyedTest) setErrors({ ...errors, enjoyedTest: undefined });
                }}
                className={`flex-1 option-card ${enjoyedTest === option.value ? 'selected' : ''}`}
              >
                <div className="option-radio" />
                <div>
                  <p className="font-medium text-gray-900">{option.english}</p>
                  <p className="font-urdu text-sm text-gray-600">{option.urdu}</p>
                </div>
              </button>
            ))}
          </div>
          {errors.enjoyedTest && (
            <p className="text-red-500 text-sm mt-2">{errors.enjoyedTest}</p>
          )}
        </div>

        {/* Question 3 */}
        <div className="mb-8">
          <div className="mb-4">
            <p className="font-semibold text-gray-900 text-lg">
              Do you have any quick feedback for us?
            </p>
            <p className="font-urdu text-gray-600 mt-1">
              کیا آپ کے پاس ہمارے لیے کوئی مختصر رائے ہے؟
            </p>
          </div>
          <textarea
            value={quickFeedback}
            onChange={(e) => setQuickFeedback(e.target.value)}
            placeholder="Type your feedback here... / اپنا تاثرات یہاں لکھیں..."
            className="input-field min-h-[100px] resize-y"
            rows={4}
          />
        </div>

        {/* Contact Note */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-5 h-5" />
            <p className="text-sm">
              For any queries, please contact us at{' '}
              <a href="mailto:aroobariaz60@gmail.com" className="text-sky-600 hover:underline font-medium">
                aroobariaz60@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={onBack} className="btn-secondary" disabled={isSubmitting}>
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>
          <button
            type="submit"
            className="btn-primary min-w-[160px] justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Feedback
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
