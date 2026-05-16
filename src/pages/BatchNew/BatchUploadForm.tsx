import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/FileUpload'
import { useImportBatch } from '@/hooks/useImportBatch'
import type { BatchAction } from '@/types/batch'

export function BatchUploadForm() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<BatchAction>('TO_ACTIVE')
  const [file, setFile] = useState<File | null>(null)

  const mutation = useImportBatch(activeTab)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    mutation.mutate(file, {
      onSuccess: (batch) => navigate(`/batches/${batch.id}`),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BatchAction)}>
        <TabsList className="w-full">
          <TabsTrigger
            value="TO_ACTIVE"
            className="flex-1 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Ativar Parceiros
          </TabsTrigger>
          <TabsTrigger
            value="TO_INACTIVE"
            className="flex-1 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Inativar Parceiros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="TO_ACTIVE" className="mt-4">
          <FileUpload onFileSelect={setFile} selectedFile={file} />
        </TabsContent>

        <TabsContent value="TO_INACTIVE" className="mt-4">
          <FileUpload onFileSelect={setFile} selectedFile={file} />
        </TabsContent>
      </Tabs>

      {mutation.isError && (
        <p className="text-sm text-red-600">{mutation.error?.message}</p>
      )}

      <Button type="submit" disabled={!file || mutation.isPending} className="w-full">
        {mutation.isPending ? 'Enviando...' : 'Enviar arquivo'}
      </Button>
    </form>
  )
}
