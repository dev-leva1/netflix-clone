import type { ApiResponse } from '@/shared/types'

// Mock данные для разработки
export const mockMovies = [
  {
    id: 1,
    name: 'Интерстеллар',
    alternativeName: 'Interstellar',
    year: 2014,
    rating: { kp: 8.6, imdb: 8.6 },
    poster: {
      url: 'https://i.ibb.co/NgxVZdXf/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    },
    genres: [{ name: 'фантастика' }, { name: 'драма' }],
    countries: [{ name: 'США' }],
    description: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису...'
  },
  {
    id: 2,
    name: 'Начало',
    alternativeName: 'Inception',
    year: 2010,
    rating: { kp: 8.8, imdb: 8.8 },
    poster: {
      url: 'https://i.ibb.co/0VrT8XVT/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    },
    genres: [{ name: 'фантастика' }, { name: 'боевик' }],
    countries: [{ name: 'США' }],
    description: 'Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения...'
  },
  {
    id: 3,
    name: 'Темный рыцарь',
    alternativeName: 'The Dark Knight',
    year: 2008,
    rating: { kp: 8.9, imdb: 9.0 },
    poster: {
      url: 'https://i.ibb.co/xtRF3rgK/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    genres: [{ name: 'боевик' }, { name: 'криминал' }],
    countries: [{ name: 'США' }],
    description: 'Бэтмен поднимает ставки в войне с криминалом...'
  },
  {
    id: 4,
    name: 'Побег из Шоушенка',
    alternativeName: 'The Shawshank Redemption',
    year: 1994,
    rating: { kp: 9.1, imdb: 9.3 },
    poster: {
      url: 'https://i.ibb.co/zHRGd4Qz/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'
    },
    genres: [{ name: 'драма' }],
    countries: [{ name: 'США' }],
    description: 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника...'
  },
  {
    id: 5,
    name: 'Форрест Гамп',
    alternativeName: 'Forrest Gump',
    year: 1994,
    rating: { kp: 8.9, imdb: 8.8 },
    poster: {
      url: 'https://i.ibb.co/JWrgYNMg/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg'
    },
    genres: [{ name: 'драма' }, { name: 'комедия' }],
    countries: [{ name: 'США' }],
    description: 'Сидя на скамейке в парке, Форрест Гамп — не очень умный, но добрый и открытый парень...'
  },
  {
    id: 6,
    name: 'Матрица',
    alternativeName: 'The Matrix',
    year: 1999,
    rating: { kp: 8.7, imdb: 8.7 },
    poster: {
      url: 'https://i.ibb.co/jP0vTRdf/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
    },
    genres: [{ name: 'фантастика' }, { name: 'боевик' }],
    countries: [{ name: 'США' }],
    description: 'Жизнь Томаса Андерсона разделена на две части: днём он — самый обычный офисный работник...'
  },
  {
    id: 7,
    name: 'Крестный отец',
    alternativeName: 'The Godfather',
    year: 1972,
    rating: { kp: 8.7, imdb: 9.2 },
    poster: {
      url: 'https://i.ibb.co/39vM0n31/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'
    },
    genres: [{ name: 'криминал' }, { name: 'драма' }],
    countries: [{ name: 'США' }],
    description: 'Глава семьи Дон Вито Корлеоне выдаёт замуж свою дочь...'
  },
  {
    id: 8,
    name: 'Список Шиндлера',
    alternativeName: "Schindler's List",
    year: 1993,
    rating: { kp: 8.8, imdb: 8.9 },
    poster: {
      url: 'https://i.ibb.co/Rp60Dx5D/image.png',
      previewUrl: 'https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg'
    },
    genres: [{ name: 'драма' }, { name: 'история' }],
    countries: [{ name: 'США' }],
    description: 'Фильм рассказывает реальную историю загадочного Оскара Шиндлера...'
  }
]

export const createMockResponse = <T>(data: T[], page = 1, limit = 20): ApiResponse<T> => ({
  docs: data.slice((page - 1) * limit, page * limit),
  total: data.length,
  limit,
  page,
  pages: Math.ceil(data.length / limit)
})

export const getMockTrendingMovies = () => createMockResponse(mockMovies.slice(0, 6))
export const getMockNewMovies = () => createMockResponse(mockMovies.slice(2, 8))
export const getMockTopMovies = () => createMockResponse(mockMovies.slice(0, 8)) 