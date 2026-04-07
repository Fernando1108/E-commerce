import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

const termsHighlights = [
  {
    title: 'Uso claro',
    description:
      'Los terminos definen como interactua el usuario con la tienda, los servicios y los procesos comerciales asociados.',
  },
  {
    title: 'Compra informada',
    description:
      'Las condiciones permiten entender el alcance de pedidos, pagos, soporte y validaciones operativas dentro de NovaStore.',
  },
  {
    title: 'Reglas visibles',
    description:
      'El objetivo es reducir ambiguedades y dejar claro el marco bajo el cual se presta el servicio.',
  },
];

const termsPolicies = [
  {
    label: 'Aceptacion',
    title: 'El uso del sitio implica aceptar las condiciones publicadas',
    description:
      'Al navegar, registrarse o comprar en NovaStore, el usuario reconoce que ha leido y acepta los terminos aplicables a la experiencia digital y comercial.',
  },
  {
    label: 'Operacion comercial',
    title: 'Los pedidos estan sujetos a validacion y disponibilidad',
    description:
      'La recepcion de una orden no implica aceptacion automatica definitiva. NovaStore puede validar stock, informacion de pago y condiciones logisticas antes de confirmar el proceso.',
  },
  {
    label: 'Alcance del servicio',
    title: 'Las condiciones cubren compra, soporte y procesos posteriores',
    description:
      'Estos terminos aplican a interacciones relacionadas con catalogo, checkout, envios, devoluciones, comunicaciones de soporte y cualquier uso funcional del sitio.',
  },
];

const termsAreas = [
  {
    title: 'Pedidos y confirmacion',
    description:
      'Toda orden puede requerir verificacion adicional antes de pasar a preparacion o despacho.',
    icon: 'ShoppingBagIcon',
  },
  {
    title: 'Pagos y validaciones',
    description:
      'El procesamiento del pago depende de la informacion suministrada y de la aprobacion del operador correspondiente.',
    icon: 'CreditCardIcon',
  },
  {
    title: 'Contenido y disponibilidad',
    description:
      'Precios, descripciones y referencias pueden ajustarse sin previo aviso cuando la operacion lo requiera.',
    icon: 'DocumentTextIcon',
  },
  {
    title: 'Soporte y seguimiento',
    description:
      'El equipo de soporte atiende novedades operativas dentro del alcance real del servicio ofrecido por la tienda.',
    icon: 'ChatBubbleLeftRightIcon',
  },
];

const faqItems = [
  {
    question: 'NovaStore puede cancelar un pedido?',
    answer:
      'Si. En ciertos casos la tienda puede cancelar o pausar una orden por validacion de pago, indisponibilidad, inconsistencia de datos o limitaciones logisticas.',
  },
  {
    question: 'Los precios publicados siempre son definitivos?',
    answer:
      'Los precios visibles pueden cambiar antes de que una compra sea completada. Una vez confirmada correctamente la orden, se toma como referencia la informacion validada en ese momento.',
  },
  {
    question: 'Que pasa si no estoy de acuerdo con una condicion del sitio?',
    answer:
      'Si el usuario no esta de acuerdo con los terminos aplicables, lo razonable es abstenerse de continuar usando el servicio o completar procesos comerciales dentro de la plataforma.',
  },
];

export default function TerminosPage() {
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
                  Terminos y condiciones
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Reglas claras
                <br />
                <span
                  className="inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.22)',
                    color: 'transparent',
                  }}
                >
                  para una
                </span>
                <br />
                compra seria.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Esta pagina resume los terminos y condiciones que regulan el uso del sitio, las
                compras, el alcance del servicio y las validaciones operativas dentro de NovaStore.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {termsHighlights.map((item, index) => (
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
                      Marco contractual
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
                  {termsPolicies.map((policy) => (
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
              Alcance de los terminos
            </p>
            <h2 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C]">
              Condiciones que acompañan toda la experiencia comercial.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5A5A5A]">
              Los terminos no solo cubren el momento de compra. Tambien atraviesan pagos,
              validaciones, contenidos del sitio y la relacion operativa posterior con el cliente.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {termsAreas.map((item) => (
              <div key={item.title} className="border border-[#DDD9D3] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                    <Icon name={item.icon} size={20} variant="outline" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                    {item.title}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">{item.description}</p>
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
              Aclaraciones utiles sobre uso del sitio y condiciones de compra.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5A5A5A]">
              Un bloque breve para resolver inquietudes comunes sobre aceptacion de terminos,
              pedidos y limites del servicio.
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
                Necesitas revisar una condicion puntual?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
                Si tienes dudas sobre el alcance de los terminos, validaciones comerciales o reglas
                aplicables a un pedido, soporte puede orientarte.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:bg-[#EFF6FF]"
                >
                  Ir a soporte
                </Link>
                <Link
                  href="/privacidad"
                  className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:border-white hover:bg-white/5"
                >
                  Ver privacidad
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
