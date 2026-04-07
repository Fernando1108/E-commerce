import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

const privacyHighlights = [
  {
    title: 'Uso responsable',
    description:
      'Los datos se tratan con criterio operativo, enfocados en mejorar la compra, el soporte y la trazabilidad del pedido.',
  },
  {
    title: 'Minima exposicion',
    description:
      'Solo se solicita la informacion necesaria para procesar ordenes, atender requerimientos y mantener el servicio funcionando.',
  },
  {
    title: 'Control informado',
    description:
      'El usuario puede conocer como se recolecta y para que se usa su informacion dentro del ecosistema NovaStore.',
  },
];

const privacyPolicies = [
  {
    label: 'Recoleccion',
    title: 'Solicitamos datos para compra, contacto y soporte',
    description:
      'NovaStore puede recopilar nombre, correo, telefono, direccion y detalles necesarios para procesar pedidos, responder solicitudes y mantener la operacion comercial.',
  },
  {
    label: 'Uso de informacion',
    title: 'Los datos se utilizan para fines operativos y de experiencia',
    description:
      'La informacion se usa para confirmar compras, coordinar envios, gestionar devoluciones, brindar soporte y mejorar la experiencia general del cliente dentro de la tienda.',
  },
  {
    label: 'Proteccion',
    title: 'Aplicamos criterios razonables de seguridad y acceso',
    description:
      'El acceso a la informacion se limita a contextos necesarios para la operacion. Tambien se adoptan medidas tecnicas y organizativas para reducir exposiciones indebidas.',
  },
];

const privacyPrinciples = [
  {
    title: 'Transparencia',
    description:
      'Explicamos que datos se utilizan y por que intervienen en procesos como checkout, soporte o seguimiento del pedido.',
    icon: 'EyeIcon',
  },
  {
    title: 'Necesidad',
    description:
      'Evitamos pedir informacion que no aporte al funcionamiento real del servicio o a la atencion del cliente.',
    icon: 'DocumentTextIcon',
  },
  {
    title: 'Seguridad',
    description:
      'Protegemos el acceso a la informacion con una aproximacion proporcional al tipo de dato y al flujo donde participa.',
    icon: 'ShieldCheckIcon',
  },
  {
    title: 'Trazabilidad',
    description:
      'Relacionamos los datos con procesos concretos para que la operacion sea auditable y mas facil de explicar.',
    icon: 'ClipboardDocumentCheckIcon',
  },
];

const faqItems = [
  {
    question: 'Que informacion personal recopila NovaStore?',
    answer:
      'Normalmente datos de contacto, entrega y compra. Esto incluye informacion necesaria para confirmar pedidos, coordinar envios y responder solicitudes de soporte.',
  },
  {
    question: 'NovaStore comparte mis datos con terceros?',
    answer:
      'Puede compartir informacion estrictamente necesaria con proveedores vinculados a pagos, logistica o soporte, siempre en el contexto operativo de la compra.',
  },
  {
    question: 'Puedo solicitar aclaraciones sobre el uso de mis datos?',
    answer:
      'Si. El usuario puede contactar soporte para conocer mejor el alcance del tratamiento de su informacion y resolver dudas sobre procesos relacionados.',
  },
];

export default function PrivacidadPage() {
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
                  Politica de privacidad
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Tus datos,
                <br />
                <span
                  className="inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.22)',
                    color: 'transparent',
                  }}
                >
                  usados con
                </span>
                <br />
                criterio.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Esta pagina explica como NovaStore recopila, utiliza y protege la informacion
                personal dentro de la experiencia de compra, soporte y relacion con el cliente.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {privacyHighlights.map((item, index) => (
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
                      Marco general
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
                  {privacyPolicies.map((policy) => (
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
              Principios de privacidad
            </p>
            <h2 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C]">
              Datos tratados con enfoque operativo y claridad.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5A5A5A]">
              La informacion personal no debe convertirse en ruido. Debe tener una finalidad
              concreta, ser gestionada con criterio y mantenerse vinculada al servicio que el
              cliente espera recibir.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {privacyPrinciples.map((item) => (
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
              Aclaraciones clave sobre privacidad y uso de informacion.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5A5A5A]">
              Un resumen breve para resolver las dudas mas habituales sobre recopilacion,
              intercambio y proteccion de datos dentro de NovaStore.
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
                Necesitas una aclaracion puntual?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
                Si necesitas resolver una duda relacionada con informacion personal, pedidos o uso
                de datos dentro del servicio, soporte puede orientarte.
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
