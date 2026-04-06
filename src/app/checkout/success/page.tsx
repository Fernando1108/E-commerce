'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore((state) => state.clearCart)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (sessionId && !cleared) {
      clearCart()
      setCleared(true)
    }
  }, [sessionId, cleared, clearCart])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-600 mb-8">
          Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
        </p>
        <div className="space-y-3">
          <Link href="/account/orders" className="block w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Ver mis pedidos
          </Link>
          <Link href="/products" className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Seguir comprando
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
