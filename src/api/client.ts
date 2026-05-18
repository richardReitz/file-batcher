import axios from 'axios'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const status = error.response?.status

    const message =
      data?.message ??
      data?.detail ??
      (data?.title && data.title !== 'Bad Request' && data.title !== 'Not Found' ? data.title : null) ??
      (status === 400 ? 'Requisição inválida. Verifique os dados enviados.' :
       status === 404 ? 'Recurso não encontrado.' :
       status === 409 ? 'Conflito: o recurso já existe ou está em uso.' :
       status === 500 ? 'Erro interno do servidor. Tente novamente.' :
       error.message) ??
      'Erro inesperado'

    return Promise.reject(new Error(message))
  }
)
