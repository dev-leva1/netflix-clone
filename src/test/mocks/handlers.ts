import type { DefaultBodyType, PathParams } from 'msw'
import { http, HttpResponse } from 'msw'

const base = 'https://api.kinopoisk.dev'

export const handlers = [
  http.get(base + '/movie', ({ request }) => {
    const url = new URL(request.url)
    void url
    const docs = [
      { id: 1, name: 'Test Movie 1', year: 2020, rating: { kp: 7.5 }, poster: { url: '' } },
      { id: 2, name: 'Test Movie 2', year: 2021, rating: { kp: 8.1 }, poster: { url: '' } },
    ]
    return HttpResponse.json({ docs, total: docs.length, limit: 20, page: 1, pages: 1 })
  }),
  http.get(base + '/movie/search', () => {
    const docs = [
      { id: 3, name: 'Search Result', year: 2022, rating: { kp: 7.2 }, poster: { url: '' } },
    ]
    return HttpResponse.json({ docs, total: docs.length, limit: 20, page: 1, pages: 1 })
  }),
  http.get<PathParams<'id'>, DefaultBodyType>(base + '/movie/:id', ({ params }) => {
    const id = Number((params as unknown as { id: string }).id)
    if (id === 404) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    return HttpResponse.json({ id, name: 'Detail Movie', year: 2020, rating: { kp: 7.9 }, poster: { url: '' } })
  }),
  http.get(base + '/movie/:id/similars', () => {
    return HttpResponse.json({ docs: [], total: 0, limit: 12, page: 1, pages: 1 })
  }),
]


