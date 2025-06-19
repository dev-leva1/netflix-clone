import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { config } from '@/shared/config'
import type { BaseError } from '@/shared/types'

const createApiClient = () => {
  const client = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': config.api.apiKey,
    },
  })

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        })
      }
      return config
    },
    (error: AxiosError) => {
      if (import.meta.env.DEV) {
        console.error('❌ API Request Error:', error)
      }
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        })
      }
      return response
    },
    (error: AxiosError) => {
      if (import.meta.env.DEV) {
        console.error('❌ API Response Error:', error)
      }

      const customError: BaseError = {
        message: error.message || 'Произошла ошибка при запросе к серверу',
        ...(error.code && { code: error.code }),
        ...(error.response?.status && { status: error.response.status }),
      }

      if (error.response?.status === 401) {
        customError.message = 'Неавторизованный доступ'
      } else if (error.response?.status === 403) {
        customError.message = 'Доступ запрещен'
      } else if (error.response?.status === 404) {
        customError.message = 'Ресурс не найден'
      } else if (error.response?.status === 429) {
        customError.message = 'Превышен лимит запросов'
      } else if (error.response?.status === 500) {
        customError.message = 'Внутренняя ошибка сервера'
      } else if (error.code === 'ECONNABORTED') {
        customError.message = 'Превышено время ожидания запроса'
      } else if (error.code === 'ERR_NETWORK') {
        customError.message = 'Ошибка сети'
      }

      return Promise.reject(customError)
    }
  )

  return client
}

export const apiClient = createApiClient()

export const createRequestConfig = (params?: Record<string, unknown>) => ({
  params: {
    ...params,
    token: config.api.apiKey,
  },
})

export type { AxiosResponse, AxiosError }
export { createApiClient } 