import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { config } from '@/shared/config'
import type { BaseError } from '@/shared/types'
import { logger } from '@/shared/lib/logger'

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
      logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
      return config
    },
    (error: AxiosError) => {
      logger.error('API Request Error', error)
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const preview = (() => {
        const data = response.data
        if (data == null) return data
        try {
          const str = JSON.stringify(data)
          return str.length > 500 ? str.slice(0, 500) + '…(truncated)' : data
        } catch {
          return undefined
        }
      })()
      logger.info(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: preview,
      })
      return response
    },
    (error: AxiosError) => {
      logger.error('API Response Error', error)

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
  },
})

export type { AxiosResponse, AxiosError }
export { createApiClient } 