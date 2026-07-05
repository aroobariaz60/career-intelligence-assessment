import { useRef, useCallback } from 'react';
import { Trophy, ArrowRight, Download, Printer, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Student, Scores } from '../App';
import type { CategoryInfo } from '../data/quizData';

interface ResultsProps {
  student: Student;
  scores: Scores;
  categories: CategoryInfo[];
  onNext: () => void;
}

export function Results({ student, scores, categories, onNext }: ResultsProps) {
  const resultRef = useRef<HTMLDivElement>(null);

  const maxScore = Math.max(...Object.values(scores));
  const highestCategories = categories.filter(cat => scores[cat.key] === maxScore);

  const getScorePercentage = (score: number) => {
    const maxPossiblePerCategory = 24; // 6 questions * 4 max points
    return Math.round((score / maxPossiblePerCategory) * 100);
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback(async () => {
    if (!resultRef.current) return;

    const canvas = await html2canvas(resultRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`career-assessment-${student.fullName.replace(/\s+/g, '-')}.pdf`);
  }, [student.fullName]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'My Career Intelligence Assessment Result',
      text: `I scored highest in ${highestCategories.map(c => c.label).join(' and ')}! Take the assessment to discover your strongest intelligence.`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  }, [highestCategories]);

  return (
    <div className="animate-fadeIn">
      {/* Action Buttons */}
      <div className="card p-4 mb-6 no-print">
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={handlePrint} className="btn-secondary text-sm">
            <Printer className="w-4 h-4" />
            Print Result
          </button>
          <button onClick={handleDownload} className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button onClick={handleShare} className="btn-secondary text-sm">
            <Share2 className="w-4 h-4" />
            Share Result
          </button>
        </div>
      </div>

      {/* Results to Print */}
      <div ref={resultRef} className="space-y-6">
        {/* Header Card */}
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Career Intelligence Assessment Result
          </h2>
          <p className="font-urdu text-lg text-gray-600 mb-4">
            کیریئر انٹیلیجنس تشخیص کا نتیجہ
          </p>
          <div className="inline-block px-6 py-3 bg-sky-50 rounded-xl border border-sky-200">
            <p className="text-sm text-gray-600">Student Name / طالب علم کا نام</p>
            <p className="font-bold text-xl text-gray-900">{student.fullName}</p>
          </div>
        </div>

        {/* Scores Overview */}
        <div className="card p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Intelligence Scores / ذہانت کے اسکور</h3>

          <div className="space-y-4">
            {categories.map((cat) => {
              const score = scores[cat.key];
              const percentage = getScorePercentage(score);
              const isHighest = score === maxScore;

              return (
                <div
                  key={cat.key}
                  className={`result-card ${isHighest ? 'highlighted' : ''} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div>
                        <span className="font-semibold text-gray-900">{cat.label}</span>
                        <span className="font-urdu text-sm text-gray-600 ml-2">{cat.urdu}</span>
                      </div>
                      {isHighest && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                          HIGHEST
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold" style={{ color: cat.color }}>{score}</span>
                      <span className="text-gray-400 text-sm ml-1">/ 24</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Bar Chart */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Score Comparison Chart / اسکور موازنہ چارٹ
            </h4>
            <div className="flex items-end justify-center gap-2 sm:gap-4 h-48 sm:h-56">
              {categories.map((cat) => {
                const score = scores[cat.key];
                const percentage = getScorePercentage(score);
                const isHighest = score === maxScore;

                return (
                  <div key={cat.key} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 sm:w-14 rounded-t-lg transition-all duration-1000 relative ${
                        isHighest ? 'ring-4 ring-amber-400 ring-offset-2' : ''
                      }`}
                      style={{
                        height: `${percentage * 1.8}px`,
                        minHeight: '30px',
                        backgroundColor: cat.color
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-sm" style={{ color: cat.color }}>
                        {score}
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-6 h-6 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: cat.color }}
                      />
                      <p className="text-xs font-medium text-gray-700 hidden sm:block">{cat.label}</p>
                      <p className="text-xs text-gray-500 sm:hidden">{cat.key.charAt(0).toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strongest Intelligence */}
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="text-center">
            <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Strongest Intelligence</h3>
            <p className="font-urdu text-gray-600 mb-4">آپ کی مضبوط ترین ذہانت</p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {highestCategories.map((cat) => (
                <div
                  key={cat.key}
                  className="px-6 py-3 rounded-xl text-white font-bold text-xl"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.label}
                  <p className="font-urdu text-sm font-normal opacity-90">{cat.urdu}</p>
                </div>
              ))}
            </div>

            {highestCategories.length === 1 && (
              <p className="text-gray-600 max-w-2xl mx-auto">
                {highestCategories[0].description}
              </p>
            )}

            {highestCategories.length > 1 && (
              <p className="text-gray-600">
                You have a balanced intelligence profile with equal strengths in multiple areas.
                This gives you diverse career options across these fields.
              </p>
            )}
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="card p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Recommended Career Paths
          </h3>
          <p className="font-urdu text-gray-600 mb-6 text-center">
            تجویز کردہ کیریئر کے راستے
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highestCategories.flatMap((cat) =>
              cat.careers.map((career, idx) => (
                <div key={`${cat.key}-${idx}`} className="career-card flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{career}</span>
                    <span className="hidden sm:inline-block ml-2 text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: cat.color }}>
                      {cat.label}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-sm text-gray-600 italic">
              "This assessment is designed for career guidance only. It should not be considered a final career decision."
            </p>
            <p className="font-urdu text-sm text-gray-600 italic mt-1">
              "یہ تشخیص صرف کیریئر کی رہنمائی کے لیے ہے۔ اسے کیریئر کا حتمی فیصلہ نہیں سمجھا جانا چاہیے۔"
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="card p-4 mt-6 no-print">
        <div className="flex justify-end">
          <button onClick={onNext} className="btn-primary">
            Continue to Feedback
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
