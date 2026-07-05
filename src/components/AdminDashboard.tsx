import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  X,
  LogOut,
  Users,
  BarChart3,
  Calendar,
  Mail,
  Trophy,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface Submission {
  id: string;
  full_name: string;
  email: string;
  answers: Record<number, number>;
  body_score: number;
  picture_score: number;
  word_score: number;
  logic_score: number;
  music_score: number;
  people_score: number;
  highest_intelligence: string;
  recommended_careers: string[];
  feedback_easy: string | null;
  feedback_interesting: string | null;
  feedback_quick: string | null;
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const ADMIN_PASSWORD = 'admin123';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    avgScores: { body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 },
    distribution: {} as Record<string, number>,
  });
  const itemsPerPage = 20;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin-api?action=stats`, {
        headers: {
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          total: data.totalCount || 0,
          avgScores: data.avgScores || { body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 },
          distribution: data.distribution || {},
        });
      }
    } catch {
      console.error('Error fetching stats');
    }
  }, [supabaseUrl]);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(itemsPerPage),
      });

      if (search) params.append('search', search);
      if (filter) params.append('filter', filter);

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-api?${params}`, {
        headers: {
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setTotalCount(data.totalCount || 0);
      } else {
        console.error('Error fetching submissions');
      }
    } catch {
      console.error('Error fetching submissions');
    }
    setLoading(false);
  }, [supabaseUrl, search, filter, page]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Body Score',
      'Picture Score',
      'Word Score',
      'Logic Score',
      'Music Score',
      'People Score',
      'Highest Intelligence',
      'Recommended Careers',
      'Website Easy to Use',
      'Enjoyed Test',
      'Quick Feedback',
      'Submitted At',
    ];

    const rows = submissions.map((s) => [
      s.full_name,
      s.email,
      s.body_score,
      s.picture_score,
      s.word_score,
      s.logic_score,
      s.music_score,
      s.people_score,
      s.highest_intelligence,
      Array.isArray(s.recommended_careers) ? s.recommended_careers.join('; ') : '',
      s.feedback_easy || '',
      s.feedback_interesting || '',
      s.feedback_quick || '',
      new Date(s.created_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categoryColors: Record<string, string> = {
    'Body Smart': '#ef4444',
    'Picture Smart': '#8b5cf6',
    'Word Smart': '#3b82f6',
    'Logic/Math Smart': '#10b981',
    'Music Smart': '#ec4899',
    'People Smart': '#f97316',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Career Intelligence Assessment</p>
              </div>
            </div>
            <button onClick={onLogout} className="btn-secondary">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter((s) => new Date(s.created_at).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Common Intelligence</p>
                <p className="text-lg font-bold text-gray-900">
                  {Object.entries(stats.distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Total Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(stats.avgScores).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="input-field pl-12"
                placeholder="Search by name or email..."
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(0);
                  }}
                  className="input-field pl-12 pr-8 min-w-[180px]"
                >
                  <option value="">All Intelligences</option>
                  <option value="Body Smart">Body Smart</option>
                  <option value="Picture Smart">Picture Smart</option>
                  <option value="Word Smart">Word Smart</option>
                  <option value="Logic/Math Smart">Logic/Math Smart</option>
                  <option value="Music Smart">Music Smart</option>
                  <option value="People Smart">People Smart</option>
                </select>
              </div>
              <button onClick={exportToCSV} className="btn-secondary">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Highest Intelligence</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Scores</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Submitted</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{s.full_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {s.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: categoryColors[s.highest_intelligence] || '#6b7280' }}
                        >
                          {s.highest_intelligence}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700">{s.body_score}</span>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">{s.picture_score}</span>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">{s.word_score}</span>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-700">{s.logic_score}</span>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-pink-100 text-pink-700">{s.music_score}</span>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">{s.people_score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(s.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedSubmission(s)}
                          className="btn-secondary text-sm py-2 px-4"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="btn-secondary py-2 px-3 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn-secondary py-2 px-3 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto animate-scaleIn">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-semibold text-gray-900">{selectedSubmission.full_name}</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-semibold text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-500">Highest Intelligence</p>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white inline-block"
                    style={{ backgroundColor: categoryColors[selectedSubmission.highest_intelligence] || '#6b7280' }}
                  >
                    {selectedSubmission.highest_intelligence}
                  </span>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Scores */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Intelligence Scores</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Body Smart', score: selectedSubmission.body_score },
                    { label: 'Picture Smart', score: selectedSubmission.picture_score },
                    { label: 'Word Smart', score: selectedSubmission.word_score },
                    { label: 'Logic/Math Smart', score: selectedSubmission.logic_score },
                    { label: 'Music Smart', score: selectedSubmission.music_score },
                    { label: 'People Smart', score: selectedSubmission.people_score },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-32 text-sm text-gray-700">{item.label}</div>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.score / 24) * 100}%`,
                            backgroundColor: categoryColors[item.label] || '#6b7280',
                          }}
                        />
                      </div>
                      <div className="w-12 text-right font-semibold" style={{ color: categoryColors[item.label] || '#6b7280' }}>
                        {item.score}/24
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Careers */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recommended Careers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(Array.isArray(selectedSubmission.recommended_careers) ? selectedSubmission.recommended_careers : []).map((career, idx) => (
                    <div key={idx} className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                      {career}
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Answers */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Raw Answers (Q1-Q36)</h3>
                <div className="grid grid-cols-6 gap-2 text-center text-sm">
                  {Object.entries(selectedSubmission.answers)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([qId, value]) => (
                      <div key={qId} className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-500 text-xs">Q{qId}</div>
                        <div className="font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Website easy to use?</p>
                    <p className="font-medium text-gray-900">{selectedSubmission.feedback_easy || 'Not provided'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Enjoyed the test?</p>
                    <p className="font-medium text-gray-900">{selectedSubmission.feedback_interesting || 'Not provided'}</p>
                  </div>
                </div>
                {selectedSubmission.feedback_quick && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Quick Feedback</p>
                    <p className="font-medium text-gray-900">{selectedSubmission.feedback_quick}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
