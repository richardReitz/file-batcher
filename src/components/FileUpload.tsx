import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  onFileSelect: (file: File) => void
  selectedFile?: File | null
}

export function FileUpload({ accept = '.csv', onFileSelect, selectedFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Área de upload de arquivo"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label="Arquivo CSV"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
        }}
      />
      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      {selectedFile ? (
        <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
      ) : (
        <>
          <p className="text-sm text-gray-600">Arraste o arquivo aqui ou clique para selecionar</p>
          <p className="text-xs text-gray-400 mt-1">Formato: CSV com cabeçalho NOME;EMAIL;CPF;TELEFONE</p>
        </>
      )}
    </div>
  )
}
