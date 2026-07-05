export type Category = 'body' | 'picture' | 'word' | 'logic' | 'music' | 'people';

export interface QuizQuestion {
  id: number;
  english: string;
  urdu: string;
  category: Category;
  options: { value: number; english: string; urdu: string }[];
}

export interface CategoryInfo {
  key: Category;
  label: string;
  urdu: string;
  color: string;
  bgColor: string;
  lightBg: string;
  borderColor: string;
  careers: string[];
  description: string;
}

const defaultOptions = [
  { value: 1, english: 'Never', urdu: 'شاذ و نادر' },
  { value: 2, english: 'Sometimes', urdu: 'کبھی کبھی' },
  { value: 3, english: 'Often', urdu: 'عام طور پر' },
  { value: 4, english: 'Always', urdu: 'ہمیشہ' },
];

export const questions: QuizQuestion[] = [
  // Section 1: Body Smart
  {
    id: 1,
    english: 'I enjoy physical activity.',
    urdu: 'مجھے جسمانی کام کرنے میں مزہ آتا ہے۔',
    category: 'body',
    options: defaultOptions,
  },
  {
    id: 2,
    english: "I don't like sitting idle.",
    urdu: 'مجھے بے کار بیٹھنا پسند نہیں ہے۔',
    category: 'body',
    options: [
      { value: 1, english: 'Never', urdu: 'کبھی نہیں (میں فارغ بیٹھنا پسند کرتا ہوں)' },
      { value: 2, english: 'Sometimes', urdu: 'کبھی کبھی' },
      { value: 3, english: 'Often', urdu: 'عام طور پر' },
      { value: 4, english: 'Always', urdu: 'ہمیشہ (میں فارغ بیٹھنا بالکل پسند نہیں کرتا)' },
    ],
  },
  {
    id: 3,
    english: 'I prefer learning by doing.',
    urdu: 'میں خود سے کر کے سیکھنے کو ترجیح دیتا ہوں۔',
    category: 'body',
    options: defaultOptions,
  },
  {
    id: 4,
    english: 'I like to keep my hands busy.',
    urdu: 'مجھے کام کے دوران اپنے ہاتھ پیر ہلانا پسند ہے۔',
    category: 'body',
    options: defaultOptions,
  },
  {
    id: 5,
    english: 'I like working with my hands.',
    urdu: 'مجھے ہاتھ سے کام کرنا پسند ہے۔',
    category: 'body',
    options: defaultOptions,
  },
  {
    id: 6,
    english: 'I think and read in silence.',
    urdu: 'میں سوچنا اور پڑھنا پسند کرتا/کرتی ہوں۔',
    category: 'body',
    options: defaultOptions,
  },

  // Section 2: Picture Smart
  {
    id: 7,
    english: 'I use maps easily.',
    urdu: 'میں نقشوں کو آسانی سے استعمال کر لیتا ہوں۔',
    category: 'picture',
    options: defaultOptions,
  },
  {
    id: 8,
    english: 'I express thoughts with pictures/shapes.',
    urdu: 'میں اپنے خیالات کے اظہار کے لیے تصاویر اور اشکال بناتا ہوں۔',
    category: 'picture',
    options: defaultOptions,
  },
  {
    id: 9,
    english: 'I visualize easily.',
    urdu: 'میں کسی تصویر کو دیکھ کر چیزیں بنا لیتا ہوں۔',
    category: 'picture',
    options: defaultOptions,
  },
  {
    id: 10,
    english: 'I enjoy photography.',
    urdu: 'مجھے ڈرائنگ اور فوٹو گرافی میں مزہ آتا ہے۔',
    category: 'picture',
    options: defaultOptions,
  },
  {
    id: 11,
    english: 'I dislike long paragraphs.',
    urdu: 'مجھے طویل پیراگراف پڑھنا پسند نہیں ہے۔',
    category: 'picture',
    options: [
      { value: 1, english: 'Never', urdu: 'کبھی نہیں (مجھے لمبے پیراگراف پسند ہیں)' },
      { value: 2, english: 'Sometimes', urdu: 'کبھی کبھی' },
      { value: 3, english: 'Often', urdu: 'عام طور پر' },
      { value: 4, english: 'Always', urdu: 'ہمیشہ (میں لمبے پیراگراف بالکل پسند نہیں کرتا)' },
    ],
  },
  {
    id: 12,
    english: 'I prefer pictures to instructions.',
    urdu: 'میں تحریری ہدایات کی بہ نسبت نقشے بنانے کو ترجیح دیتا ہوں۔',
    category: 'picture',
    options: defaultOptions,
  },

  // Section 3: Word Smart
  {
    id: 13,
    english: 'I like listening to stories.',
    urdu: 'مجھے کہانیاں سننا پسند ہے۔',
    category: 'word',
    options: defaultOptions,
  },
  {
    id: 14,
    english: 'I like writing.',
    urdu: 'مجھے لکھنا پسند ہے۔',
    category: 'word',
    options: defaultOptions,
  },
  {
    id: 15,
    english: 'I like reading books/magazines.',
    urdu: 'مجھے کتب اور رسالے پڑھنا پسند ہے۔',
    category: 'word',
    options: defaultOptions,
  },
  {
    id: 16,
    english: 'I can talk about myself easily.',
    urdu: 'میں اپنے متعلق آسانی سے بات کر سکتا ہوں۔',
    category: 'word',
    options: defaultOptions,
  },
  {
    id: 17,
    english: 'I am good at mediation/negotiation.',
    urdu: 'میں آسانی سے ثالثی/صلح کروا لیتا ہوں۔',
    category: 'word',
    options: defaultOptions,
  },
  {
    id: 18,
    english: 'I am interested in debating topics.',
    urdu: 'مجھے دلچسپ موضوعات پر بات کرنا پسند ہے۔',
    category: 'word',
    options: defaultOptions,
  },

  // Section 4: Logic/Math Smart
  {
    id: 19,
    english: 'I like Math.',
    urdu: 'مجھے حساب کا مضمون پسند ہے۔',
    category: 'logic',
    options: defaultOptions,
  },
  {
    id: 20,
    english: 'I like Science.',
    urdu: 'مجھے سائنس کا مضمون پسند ہے۔',
    category: 'logic',
    options: defaultOptions,
  },
  {
    id: 21,
    english: 'I can solve various problems easily.',
    urdu: 'میں مختلف مسائل کو آسانی سے حل کر لیتا ہوں۔',
    category: 'logic',
    options: defaultOptions,
  },
  {
    id: 22,
    english: 'I want to know how things work.',
    urdu: 'میں جاننا چاہتا ہوں کہ کوئی بھی چیز کیسے کام کرتی ہے؟',
    category: 'logic',
    options: defaultOptions,
  },
  {
    id: 23,
    english: 'I like planning things.',
    urdu: 'مجھے نئی اشیاء بنانا اور منصوبہ بندی کرنا پسند ہے۔',
    category: 'logic',
    options: defaultOptions,
  },
  {
    id: 24,
    english: 'I fix things easily.',
    urdu: 'میں چیزوں کو آسانی سے ٹھیک کر لیتا ہوں۔',
    category: 'logic',
    options: defaultOptions,
  },

  // Section 5: Music Smart
  {
    id: 25,
    english: 'I enjoy music.',
    urdu: 'میں موسیقی سنتا ہوں۔',
    category: 'music',
    options: defaultOptions,
  },
  {
    id: 26,
    english: 'I move my feet while listening to music.',
    urdu: 'موسیقی سنتے ہوئے میں ہاتھ پیر حرکت کرتا ہوں۔',
    category: 'music',
    options: defaultOptions,
  },
  {
    id: 27,
    english: 'I have a good ear for music.',
    urdu: 'مجھے موسیقی کی اچھی سمجھ بوجھ ہے۔',
    category: 'music',
    options: defaultOptions,
  },
  {
    id: 28,
    english: 'I like singing along.',
    urdu: 'میں موسیقی کے ساتھ گنگنانا پسند کرتا ہوں۔',
    category: 'music',
    options: defaultOptions,
  },
  {
    id: 29,
    english: 'I have the ability to sing.',
    urdu: 'لوگوں کا خیال ہے کہ میں گانا گانے کی صلاحیت رکھتا ہوں۔',
    category: 'music',
    options: defaultOptions,
  },
  {
    id: 30,
    english: 'I express myself through music.',
    urdu: 'میں اپنے خیالات کا اظہار موسیقی سے پسند کرتا ہوں۔',
    category: 'music',
    options: defaultOptions,
  },

  // Section 6: People Smart
  {
    id: 31,
    english: 'I like working with people.',
    urdu: 'مجھے لوگوں کے ساتھ مل کر کام کرنا پسند ہے۔',
    category: 'people',
    options: defaultOptions,
  },
  {
    id: 32,
    english: 'People come to me for solutions.',
    urdu: 'لوگ میرے پاس اپنے مسائل کے حل کے لیے آتے ہیں۔',
    category: 'people',
    options: defaultOptions,
  },
  {
    id: 33,
    english: 'I enjoy spending time with others.',
    urdu: 'مجھے لوگوں کے ساتھ وقت گزارنا اچھا لگتا ہے۔',
    category: 'people',
    options: defaultOptions,
  },
  {
    id: 34,
    english: 'I understand people well.',
    urdu: 'میں لوگوں کو سمجھنے کی صلاحیت رکھتا ہوں۔',
    category: 'people',
    options: defaultOptions,
  },
  {
    id: 35,
    english: 'I feel comfortable interacting and working with other people.',
    urdu: 'میں دوسروں کے ساتھ بات چیت کرنے اور مل کر کام کرنے میں آرام محسوس کرتا/کرتی ہوں۔',
    category: 'people',
    options: defaultOptions,
  },
  {
    id: 36,
    english: 'I enjoy helping others.',
    urdu: 'میں دوسروں کی مدد کر کے خوشی محسوس کرتا/کرتی ہوں۔',
    category: 'people',
    options: defaultOptions,
  },
];

export const categories: CategoryInfo[] = [
  {
    key: 'body',
    label: 'Body Smart',
    urdu: 'جسمانی ذہانت',
    color: '#ef4444',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    borderColor: 'border-red-200',
    careers: ['Army Officer', 'Police Officer', 'Surgeon', 'Physiotherapist', 'Athlete', 'Physical Trainer', 'Firefighter'],
    description: 'You excel in physical coordination, movement, and hands-on learning. Your body awareness and athletic abilities make you ideal for roles requiring physical skill, precision, and stamina.',
  },
  {
    key: 'picture',
    label: 'Picture Smart',
    urdu: 'تصویری ذہانت',
    color: '#8b5cf6',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    borderColor: 'border-purple-200',
    careers: ['Architect', 'Graphic Designer', 'Animator', 'Interior Designer', 'Photographer', 'Fashion Designer'],
    description: 'You have a powerful ability to think visually and spatially. Your talent for creating and interpreting images, designs, and visual patterns leads naturally to creative and design-oriented professions.',
  },
  {
    key: 'word',
    label: 'Word Smart',
    urdu: 'لغوی ذہانت',
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    careers: ['Teacher', 'Lawyer', 'Journalist', 'Writer', 'Author', 'Public Speaker', 'Content Creator'],
    description: 'You possess strong linguistic intelligence with a natural gift for words, storytelling, and communication. Your ability to articulate ideas clearly makes you highly effective in language-based careers.',
  },
  {
    key: 'logic',
    label: 'Logic/Math Smart',
    urdu: 'ریاضی اور منطقی ذہانت',
    color: '#10b981',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    careers: ['Software Engineer', 'Data Scientist', 'Civil Engineer', 'Mechanical Engineer', 'Scientist', 'Accountant', 'AI Engineer'],
    description: 'You have a sharp analytical mind with exceptional reasoning and problem-solving skills. Your logical thinking and mathematical ability position you perfectly for technical and scientific careers.',
  },
  {
    key: 'music',
    label: 'Music Smart',
    urdu: 'موسیقی کی ذہانت',
    color: '#ec4899',
    bgColor: 'bg-pink-500',
    lightBg: 'bg-pink-50',
    borderColor: 'border-pink-200',
    careers: ['Singer', 'Music Producer', 'Composer', 'Music Teacher', 'Sound Engineer'],
    description: 'You are highly attuned to rhythm, melody, and musical patterns. Your sensitivity to sound and strong musical memory make you a natural fit for careers in the music and audio industry.',
  },
  {
    key: 'people',
    label: 'People Smart',
    urdu: 'سماجی ذہانت',
    color: '#f97316',
    bgColor: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    borderColor: 'border-orange-200',
    careers: ['Psychologist', 'Teacher', 'HR Manager', 'Social Worker', 'Counselor', 'Marketing Manager', 'Business Manager'],
    description: 'You have exceptional interpersonal skills and a deep understanding of people. Your empathy, leadership, and communication abilities make you outstanding in people-focused and helping professions.',
  },
];
