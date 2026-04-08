export const SHIPPING_THRESHOLD = 100;

export const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  paid: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};
