import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

const shippingHighlights = [
  {
    title: 'Cobertura nacional',
    description:
      'Realizamos envíos a las principales ciudades y zonas intermedias con operadores aliados de alta confiabilidad.',
  },
  {
    title: 'Preparación editorial',
    description:
      'Cada pedido pasa por verificación manual de empaque, accesorios y protección antes de salir de bodega.',
  },
  {
    title: 'Seguimiento continuo',
    description:
      'Compartimos actualización de despacho y trazabilidad para que el cliente tenga visibilidad del proceso.',
  },
];

const shippingPolicies = [
  {
    label: 'Tiempos estándar',
    title: 'Despacho entre 24 y 48 horas hábiles',
    description:
      'Los pedidos confirmados antes de la 1:00 p. m. suelen procesarse el mismo día hábil. En temporadas de alta demanda, el despacho puede extenderse ligeramente sin comprometer la calidad del empaque.',
  },
  {
    label: 'Cobertura y operadores',
    title: 'Mensajería aliada para ciudades principales y secundarias',
    description:
      'Trabajamos con transportadoras con cobertura nacional. Si una dirección presenta restricciones logísticas, el equipo de soporte contactará al cliente antes de despachar.',
  },
  {
    label: 'Costos',
    title: 'Tarifa calculada según destino y volumen',
    description:
      'El valor del envío se muestra antes de finalizar la compra. En campañas especiales o pedidos seleccionados, NovaStore puede asumir total o parcialmente ese costo.',
  },
];

const faqItems = [
  {
    question: '¿Cuánto tarda en llegar un pedido?',
    answer:
      'En ciudades principales, la entrega suele completarse entre 2 y 5 días hábiles después del despacho. En trayectos especiales puede tomar un poco más.',
  },
  {
    question: '¿Qué pasa si mi producto llega con empaque afectado?',
    answer:
      'Recomendamos registrar evidencia visual al momento de recibir y contactar soporte lo antes posible para activar revisión prioritaria.',
  },
  {
    question: '¿Puedo cambiar la dirección después de comprar?',
    answer:
      'Sí, siempre que el pedido no haya sido entregado al operador logístico. Una vez despachado, el cambio depende de la transportadora.',
  },
];

export default function EnviosPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden pt-[72px]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-dot-pattern" />
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.05] pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="max-w-2xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 border border-[#DDD9D3] bg-white/70 px-5 py-2.5 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Políticas de envíos
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Recibe con
                <br />
                <span
                  className="inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.22)',
                    color: 'transparent',
                  }}
                >
                  claridad,
                </span>
                <br />
                no con dudas.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Esta página resume cómo NovaStore procesa, empaca y despacha cada pedido. La
                intención es dar contexto claro sobre tiempos, cobertura y condiciones del servicio.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {shippingHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="border border-[#DDD9D3] bg-white/75 px-5 py-5 backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                      0{index + 1}
                    </p>
                    <p className="mt-3 text-xl font-display font-900 text-[#1C1C1C]">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#5A5A5A]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-[#DDD9D3]/70 via-transparent to-transparent pointer-events-none" />
              <div className="relative border border-[#DDD9D3] bg-white/90 p-6 shadow-[0_24px_80px_rgba(28,28,28,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A]">
                      Resumen operativo
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                      Lo esencial
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    Actualizado
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  {shippingPolicies.map((policy) => (
                    <article
                      key={policy.title}
                      className="border border-[#E6E1DA] bg-[#FCFBF9] p-5"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                        {policy.label}
                      </p>
                      <h3 className="mt-3 text-xl font-display font-900 text-[#1C1C1C]">
                        {policy.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#5A5A5A]">
                        {policy.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#DDD9D3] bg-[#EFEDE9]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-20">
          <div className="max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
              Condiciones del servicio
            </p>
            <h2 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C]">
              Transparencia desde la compra hasta la entrega.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5A5A5A]">
              Buscamos que el proceso logístico sea tan claro como la curaduría de producto. Si
              necesitas una validación puntual, el equipo de soporte puede acompañarte antes del
              despacho.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-[#DDD9D3] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                  <Icon name="TruckIcon" size={20} variant="outline" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                  Entregas urbanas
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">
                La mayoría de pedidos a ciudades principales se entregan con trazabilidad activa y
                confirmación de estado durante el trayecto.
              </p>
            </div>

            <div className="border border-[#DDD9D3] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                  <Icon name="ShieldCheckIcon" size={20} variant="outline" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                  Protección de empaque
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">
                Priorizamos materiales de protección para electrónica, accesorios delicados y
                referencias de alto valor percibido.
              </p>
            </div>

            <div className="border border-[#DDD9D3] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                  <Icon name="ClockIcon" size={20} variant="outline" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                  Ventana de preparación
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">
                Las órdenes aprobadas fuera de horario hábil se procesan en el siguiente ciclo
                operativo disponible.
              </p>
            </div>

            <div className="border border-[#DDD9D3] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                  <Icon name="ChatBubbleLeftRightIcon" size={20} variant="outline" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                  Soporte previo
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">
                Si hay una novedad operativa, el equipo contacta al cliente antes de ejecutar
                cualquier cambio relevante sobre el envío.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C]">
              Respuestas útiles antes de comprar.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5A5A5A]">
              Una guía breve para resolver las dudas más comunes sobre logística, tiempos de entrega
              y ajustes posteriores a la compra.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <article key={item.question} className="border border-[#DDD9D3] bg-white p-6">
                <h3 className="text-lg font-display font-900 text-[#1C1C1C]">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5A5A5A]">{item.answer}</p>
              </article>
            ))}

            <div className="border border-[#1C1C1C] bg-[#1C1C1C] p-6 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60">
                Soporte NovaStore
              </p>
              <h3 className="mt-3 text-2xl font-display font-900 uppercase italic">
                ¿Necesitas revisar un caso puntual?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
                Si tu pedido requiere validación especial por cobertura, tiempos o cambios de
                dirección, puedes comunicarte con soporte antes del despacho.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:bg-[#EFF6FF]"
                >
                  Ir a soporte
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:border-white hover:bg-white/5"
                >
                  Volver a tienda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
