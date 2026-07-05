import { RotateCcw, Star, CheckCircle2 } from 'lucide-react';
import type { Student } from '../App';

interface ThankYouProps {
  student: Student;
  onRestart: () => void;
}

export function ThankYou({ student, onRestart }: ThankYouProps) {
  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      {/* Success Card */}
      <div className="card p-8 sm:p-12 text-center mb-6 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Thank You!
        </h2>
        <p className="font-urdu text-2xl text-gray-600 mb-4">
          شکریہ!
        </p>

        <div className="max-w-md mx-auto mb-6">
          <p className="text-lg text-gray-700">
            Thank you for completing the Career Assessment, <span className="font-semibold">{student.fullName}</span>.
          </p>
          <p className="font-urdu text-gray-600 mt-2">
            {student.fullName}، کیریئر تشخیص مکمل کرنے کے لیے شکریہ۔
          </p>
        </div>

        {/* Decorative Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="w-8 h-8 text-amber-400 fill-amber-400"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-white/80 rounded-xl p-6 sm:p-8 mb-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            What Happens Next?
          </h3>
          <p className="font-urdu text-gray-600 mb-4">
            اگلا کیا ہوتا ہے؟
          </p>
          <ul className="text-left text-gray-700 space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-bold">1</span>
              </div>
              <span>You can review your results and career recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-bold">2</span>
              </div>
              <span>Download or print your assessment report</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-bold">3</span>
              </div>
              <span>Explore the recommended career paths</span>
            </li>
          </ul>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="btn-primary py-4 px-8 text-lg"
        >
          <RotateCcw className="w-5 h-5" />
          Take Assessment Again
        </button>
        <p className="font-urdu text-gray-500 mt-2">
          تشخیص دوبارہ لیں
        </p>
      </div>

      {/* Additional Info */}
      <div className="card p-6 text-center">
        <p className="text-gray-600">
          Your responses have been recorded. If you have any questions or need further guidance,
          please consult with a career counselor.
        </p>
        <p className="font-urdu text-gray-600 mt-2">
          آپ کے جوابات ریکارڈ کر لیے گئے ہیں۔ اگر آپ کے کوئی سوال ہیں یا مزید رہنمائی کی ضرورت ہے،
          براہ کرم کیریئر کونسلر سے مشورہ کریں۔
        </p>
      </div>
    </div>
  );
}
