import { useState, FormEvent } from 'react';
import { User, Mail, ArrowRight, BookOpen } from 'lucide-react';
import type { Student } from '../App';

interface StudentFormProps {
  onSubmit: (data: Student) => void;
}

export function StudentForm({ onSubmit }: StudentFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ fullName: fullName.trim(), email: email.trim() });
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      {/* Hero Section */}
      <div className="card p-8 mb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome to Career Intelligence Assessment
        </h2>
        <p className="font-urdu text-lg text-gray-600 mb-4">
          کیریئر انٹیلیجنس تشخیص میں خوش آمدید
        </p>
        <p className="text-gray-600 max-w-lg mx-auto">
          Discover your strongest intelligence based on Multiple Intelligences Theory
          and get personalized career recommendations.
        </p>
        <p className="font-urdu text-gray-600 mt-2">
          کثیر ذہانت کے نظریے کی بنیاد پر اپنی مضبوط ترین ذہانت کا پتہ لگائیں اور ذاتی کیریئر کی سفارشات حاصل کریں۔
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Student Information</h3>
        <p className="font-urdu text-gray-600 mb-6">طلباء کی معلومات</p>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <p className="font-urdu text-sm text-gray-600 mb-2">پورا نام <span className="text-red-500">*</span></p>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                className={`input-field pl-12 ${errors.fullName ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <p className="font-urdu text-sm text-gray-600 mb-2">ای میل ایڈریس <span className="text-red-500">*</span></p>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`input-field pl-12 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-8 py-4 text-lg">
          Start Assessment
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="font-urdu text-center text-gray-500 mt-2">
          تشخیص شروع کریں
        </p>
      </form>
    </div>
  );
}
