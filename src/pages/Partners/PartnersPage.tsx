import { useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PartnerFilters } from './PartnerFilters'
import { usePartners } from '@/hooks/usePartners'
import { useActivatePartner } from '@/hooks/useActivatePartner'
import { useDeactivatePartner } from '@/hooks/useDeactivatePartner'
import { PARTNER_STATUS_LABEL } from '@/lib/enums'
import { formatCpf } from '@/lib/format'
import type { PartnerListParams, Partner } from '@/types/partner'

const PAGE_SIZE = 15

type PartnerAction = { partner: Partner; type: 'activate' | 'deactivate' }

export function PartnersPage() {
  const [filters, setFilters] = useState<PartnerListParams>({ page: 1, pageSize: PAGE_SIZE })
  const [confirm, setConfirm] = useState<PartnerAction | null>(null)

  const { data, isLoading, isError } = usePartners(filters)
  const activate = useActivatePartner()
  const deactivate = useDeactivatePartner()

  const isPending = activate.isPending || deactivate.isPending

  function handleConfirm() {
    if (!confirm) return
    const mutation = confirm.type === 'activate' ? activate : deactivate
    mutation.mutate(confirm.partner.id, { onSuccess: () => setConfirm(null) })
  }

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Parceiros</h1>

      <PartnerFilters value={filters} onChange={setFilters} />

      {isError && <p className="text-sm text-red-600">Erro ao carregar parceiros.</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className={`h-4 rounded ${i % 3 === 0 ? 'w-32' : i % 3 === 1 ? 'w-40' : 'w-28'}`} /></TableCell>
              <TableCell><Skeleton className="h-4 w-28 rounded" /></TableCell>
              <TableCell><Skeleton className={`h-4 rounded ${i % 2 === 0 ? 'w-48' : 'w-40'}`} /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24 rounded" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-8 w-16 rounded-md" /></TableCell>
            </TableRow>
          ))}

          {!isLoading && (data?.items?.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                Nenhum parceiro encontrado.
              </TableCell>
            </TableRow>
          )}

          {data?.items?.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.name ?? '—'}</TableCell>
              <TableCell className="font-mono text-sm">{partner.document ? formatCpf(partner.document) : '—'}</TableCell>
              <TableCell className="text-sm text-gray-600">{partner.email ?? '—'}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-gray-600">{partner.phone ?? '—'}</TableCell>
              <TableCell>
                <StatusBadge status={partner.status} label={PARTNER_STATUS_LABEL[partner.status]} />
              </TableCell>
              <TableCell>
                {partner.status === 'INACTIVE' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-700"
                    onClick={() => setConfirm({ partner, type: 'activate' })}
                  >
                    Ativar
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => setConfirm({ partner, type: 'deactivate' })}
                  >
                    Inativar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Total: {data?.totalCount} parceiros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600 px-2 py-1">
              {filters.page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          open
          title={confirm.type === 'activate' ? 'Ativar parceiro' : 'Inativar parceiro'}
          description={`Tem certeza que deseja ${confirm.type === 'activate' ? 'ativar' : 'inativar'} ${confirm.partner.name ?? 'este parceiro'}?`}
          confirmLabel={confirm.type === 'activate' ? 'Ativar' : 'Inativar'}
          loading={isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
