import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BatchUploadForm } from './BatchUploadForm'

export function BatchNewPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/batches"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Novo Lote</h1>
      </div>
      <BatchUploadForm />
    </div>
  )
}
