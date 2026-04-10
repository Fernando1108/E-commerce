import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

const returnHighlights = [
  {
    title: 'Proceso claro',
    description:
      'Definimos condiciones, plazos y validaciones para que cada solicitud tenga un recorrido comprensible desde el inicio.',
  },
  {
    title: 'Revisión cuidadosa',
    description:
      'Cada devolución se analiza con criterio técnico y visual para proteger tanto al cliente como a la integridad del producto.',
  },
  {
    title: 'Respuesta ágil',
    description:
      'Buscamos confirmar recepción y siguientes pasos en el menor tiempo posible una vez se radica la solicitud.',
  },
];

const returnPolicies = [
  {
    label: 'Plazo de solicitud',
    title: 'Cambios o devoluciones dentro del periodo informado',
    description:
      'La solicitud debe realizarse dentro del plazo definido por NovaStore desde la fecha de entrega. Es importante conservar empaque, accesorios y evidencia del estado inicial del producto.',
  },
  {
    label: 'Estado del producto',
    title: 'La referencia debe regresar en condiciones revisables',
    description:
      'Para aprobar una devolución, el artículo debe llegar completo, sin intervenciones no autorizadas y con señales razonables de cuidado según su categoría.',
  },
  {
    label: 'Validación operativa',
    title: 'La aprobación depende de inspección física o soporte documental',
    description:
      'En algunos casos se solicitarán fotos, videos o número de orden antes de autorizar el retorno. Esto permite reducir tiempos y evitar rechazos posteriores.',
  },
];

const returnSteps = [
  {
    title: '1. Radica tu caso',
    description:
      'Comparte número de pedido, motivo y evidencia inicial para que el equipo pueda clasificar correctamente la solicitud.',
  },
  {
    title: '2. Recibe validación',
    description:
      'NovaStore confirma si aplica devolución, cambio o revisión técnica y comunica el siguiente paso operativo.',
  },
  {
    title: '3. Envía el producto',
    description:
      'Si el caso es aprobado, se coordina la entrega del artículo al punto o transportadora definida para inspección.',
  },
  {
    title: '4. Cierre del caso',
    description:
      'Tras la revisión final, se confirma reposición, saldo a favor o decisión correspondiente según el resultado de la validación.',
  },
];

const faqItems = [
  {
    question: '¿Puedo devolver un producto si simplemente no era lo que esperaba?',
    answer:
      'Depende del estado del artículo, la categoría y el plazo transcurrido. El equipo revisa cada caso con base en las condiciones publicadas y la evidencia disponible.',
  },
  {
    question: '¿Qué pasa si el producto presenta una falla al recibirlo?',
    answer:
      'Debes reportarlo cuanto antes con evidencia visual. Esto acelera la apertura del caso y permite definir si procede cambio inmediato o revisión técnica.',
  },
  {
    question: '¿La devolución del dinero es automática?',
    answer:
      'No. Primero debe completarse la validación logística y técnica del artículo. Luego se comunica el resultado y el mecanismo de cierre aplicable.',
  },
];

export default function DevolucionesPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.05] pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="max-w-2xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 border border-[#DDD9D3] bg-white/70 px-5 py-2.5 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Políticas de devoluciones
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Devuelve con
                <br />
                <span
                  className="inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.22)',
                    color: 'transparent',
                  }}
                >
                  criterio,
                </span>
                <br />
                no a ciegas.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Esta página explica cómo NovaStore gestiona solicitudes de devolución, cambios y
                revisiones posteriores a la entrega. La meta es ofrecer reglas claras y expectativas
                realistas.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {returnHighlights.map((item, index) => (
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
                      Política base
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                      Lo esencial
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    Vigente
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  {returnPolicies.map((policy) => (
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
              Flujo de devolución
            </p>
            <h2 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C]">
              Un proceso ordenado desde la solicitud hasta el cierre.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5A5A5A]">
              La experiencia de devolución debe ser comprensible y trazable. Por eso estructuramos
              cada caso con pasos claros y puntos de validación concretos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {returnSteps.map((step) => (
              <div key={step.title} className="border border-[#DDD9D3] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                    <Icon name="ArrowPathIcon" size={20} variant="outline" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                    {step.title}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">{step.description}</p>
              </div>
            ))}
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
              Lo que conviene saber antes de solicitar una devolución.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5A5A5A]">
              Respuestas cortas para anticipar dudas comunes sobre plazos, estado del producto y
              validación del caso.
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
                ¿Necesitas revisar una devolución puntual?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
                Si tu caso requiere confirmación previa, evidencia adicional o acompañamiento antes
                de enviar el producto, soporte puede ayudarte a encaminarlo.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:bg-[#EFF6FF]"
                >
                  Ir a soporte
                </Link>
                <Link
                  href="/envios"
                  className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:border-white hover:bg-white/5"
                >
                  Ver envíos
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
