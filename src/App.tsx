import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { BatchListPage } from '@/pages/BatchList/BatchListPage'
import { BatchNewPage } from '@/pages/BatchNew/BatchNewPage'
import { BatchDetailPage } from '@/pages/BatchDetail/BatchDetailPage'
import { PartnersPage } from '@/pages/Partners/PartnersPage'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

function makeQueryClient(toast: ReturnType<typeof useToast>['toast']) {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
      mutations: {
        onError: (error: unknown) => {
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: error instanceof Error ? error.message : 'Erro inesperado',
          })
        },
      },
    },
  })
}

function AppRoutes() {
  const { toast } = useToast()
  const [queryClient] = useState(() => makeQueryClient(toast))

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/batches" replace />} />
            <Route path="batches" element={<BatchListPage />} />
            <Route path="batches/new" element={<BatchNewPage />} />
            <Route path="batches/:id" element={<BatchDetailPage />} />
            <Route path="partners" element={<PartnersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}
