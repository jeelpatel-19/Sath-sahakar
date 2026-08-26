// Data Store — સાથ સહકાર Gujarati Marketplace

export const CATEGORIES = [
  {
    id: 'electronics',
    name: 'ઇલેક્ટ્રોનિક્સ',
    nameEn: 'Electronics',
    icon: 'Tv',
    description: 'ફોન, લેપટોપ, ચાર્જર, હેડફોન અને ગેજેટ્સ',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
    color: '#dbeafe',
    iconColor: '#2563eb'
  },
  {
    id: 'furniture',
    name: 'ફર્નિચર',
    nameEn: 'Furniture',
    icon: 'Armchair',
    description: 'ટેબલ, ખુરશી, ડેસ્ક, પલંગ અને શેલ્ફ',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    color: '#fef3c7',
    iconColor: '#d97706'
  },
  {
    id: 'books',
    name: 'પુસ્તકો',
    nameEn: 'Books',
    icon: 'BookOpen',
    description: 'ટેક્સ્ટ બુક, નવલકથા, ગાઇડ અને પ્રતિ-સ્પર્ધ સામગ્રી',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    color: '#dcfce7',
    iconColor: '#16a34a'
  },
  {
    id: 'home-essentials',
    name: 'ઘરવપરાશની વસ્તુઓ',
    nameEn: 'Home Essentials',
    icon: 'Home',
    description: 'પડદા, દીવા, સ્ટોરેજ અને ઘર સજાવટ',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop&q=80',
    color: '#fce7f3',
    iconColor: '#db2777'
  },
  {
    id: 'kitchen',
    name: 'રસોડાની વસ્તુઓ',
    nameEn: 'Kitchen',
    icon: 'Utensils',
    description: 'કેટલ, ઇન્ડક્શન, વાસણ અને ઘઉ-ઘંટી',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80',
    color: '#fff7ed',
    iconColor: '#ea580c'
  },
  {
    id: 'fashion',
    name: 'કપડાં',
    nameEn: 'Fashion',
    icon: 'Shirt',
    description: 'કપડાં, ફૂટવેર, જેકેટ અને એક્સેસરીઝ',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    color: '#f5f3ff',
    iconColor: '#7c3aed'
  }
];

export const CONDITIONS = [
  { value: 'નવી', label: 'નવી' },
  { value: 'લગભગ નવી', label: 'લગભગ નવી' },
  { value: 'સારી સ્થિતિ', label: 'સારી સ્થિતિ' },
  { value: 'સામાન્ય સ્થિતિ', label: 'સામાન્ય સ્થિતિ' }
];

export const GUJARAT_CITIES = [
  'અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ભાવનગર', 'જામનગર', 'ગાંધીનગર', 'આણંદ'
];

// Starts completely empty — users post all listings!
export const INITIAL_PRODUCTS = [];

export const INITIAL_USER_PROFILE = {
  id: 'usr-sath-sahkar',
  name: 'રાજ પટેલ',
  email: 'raj.patel@example.com',
  phone: '+91 98765 43210',
  location: 'અમદાવાદ',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};
