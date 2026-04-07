'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import AuthField from '@/components/ui/AuthField';
import StatusMessage from '@/components/ui/StatusMessage';

type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

type ContactFormValues = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const contactHighlights = [
  {
    title: 'Atencion clara',
    description:
      'El formulario centraliza consultas sobre pedidos, soporte, tiempos y procesos posteriores a la compra.',
  },
  {
    title: 'Respuesta organizada',
    description:
      'Buscamos que cada solicitud llegue con el contexto suficiente para responder de forma mas precisa y util.',
  },
  {
    title: 'Canal directo',
    description:
      'La pagina esta pensada para facilitar contacto inicial sin perder el tono editorial y limpio del sitio.',
  },
];

const supportTopics = [
  {
    title: 'Pedidos y seguimiento',
    description:
      'Consultas relacionadas con confirmaciones, estados de orden y trazabilidad operativa.',
    icon: 'ShoppingBagIcon',
  },
  {
    title: 'Envios y devoluciones',
    description:
      'Dudas sobre tiempos, cobertura, cambios, validaciones logisticas o solicitudes posteriores a la entrega.',
    icon: 'TruckIcon',
  },
  {
    title: 'Cuenta y acceso',
    description:
      'Ayuda con inicio de sesion, recuperacion de acceso o informacion relacionada con el perfil.',
    icon: 'UserIcon',
  },
  {
    title: 'Soporte general',
    description:
      'Cualquier otra consulta comercial o informativa sobre el funcionamiento de NovaStore.',
    icon: 'ChatBubbleLeftRightIcon',
  },
];

export default function ContactoPage() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus('loading');
    setFeedbackMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          subject: values.subject,
          message: values.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setStatus('success');
      setFeedbackMessage(
        'Tu mensaje fue enviado correctamente. El equipo de NovaStore te respondera pronto.'
      );
      toast.success('Mensaje enviado');
      reset();
    } catch (error: any) {
      setStatus('error');
      setFeedbackMessage(error.message || 'Error al enviar el mensaje');
      toast.error(error.message || 'Error al enviar el mensaje');
    }
  });

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
                  Contacto NovaStore
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Habla con
                <br />
                <span
                  className="inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.22)',
                    color: 'transparent',
                  }}
                >
                  nosotros
                </span>
                <br />
                sin friccion.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Esta pagina esta pensada para consultas comerciales, dudas operativas y
                requerimientos relacionados con pedidos, soporte o informacion general sobre
                NovaStore.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {contactHighlights.map((item, index) => (
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
                      Formulario de contacto
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                      Escribenos
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    Disponible
                  </span>
                </div>

                <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <AuthField
                      label="Nombre Completo"
                      type="text"
                      placeholder="Ingresa tu nombre"
                      registration={register('fullName', {
                        required: 'El nombre es obligatorio.',
                        minLength: {
                          value: 3,
                          message: 'Ingresa un nombre mas completo.',
                        },
                      })}
                      error={errors.fullName}
                      className="sm:col-span-2"
                    />

                    <AuthField
                      label="Email"
                      type="email"
                      placeholder="correo@novastore.com"
                      registration={register('email', {
                        required: 'El email es obligatorio.',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Ingresa un email valido.',
                        },
                      })}
                      error={errors.email}
                    />

                    <AuthField
                      label="Telefono"
                      type="tel"
                      placeholder="+57 300 000 0000"
                      registration={register('phone', {
                        required: 'El telefono es obligatorio.',
                        minLength: {
                          value: 7,
                          message: 'Ingresa un telefono valido.',
                        },
                      })}
                      error={errors.phone}
                    />

                    <AuthField
                      label="Asunto"
                      type="text"
                      placeholder="Motivo de tu consulta"
                      registration={register('subject', {
                        required: 'El asunto es obligatorio.',
                        minLength: {
                          value: 4,
                          message: 'Describe mejor el asunto.',
                        },
                      })}
                      error={errors.subject}
                      className="sm:col-span-2"
                    />

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-[#5A5A5A]">
                        Mensaje
                      </span>
                      <textarea
                        rows={6}
                        placeholder="Cuéntanos el contexto de tu solicitud"
                        {...register('message', {
                          required: 'El mensaje es obligatorio.',
                          minLength: {
                            value: 15,
                            message: 'Agrega un poco mas de contexto.',
                          },
                        })}
                        className={`w-full border px-4 py-4 text-[15px] text-[#1C1C1C] outline-none transition resize-none ${
                          errors.message
                            ? 'border-[#C33D2F] bg-[#FFF7F5] focus:border-[#C33D2F]'
                            : 'border-[#DDD9D3] bg-[#FCFBF9] focus:border-[#1C1C1C] focus:bg-white'
                        }`}
                      />
                      {errors.message && (
                        <span className="mt-2 block text-sm text-[#C33D2F]">
                          {errors.message.message}
                        </span>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
                    <Link
                      href="/envios"
                      className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:text-[#2563EB]"
                    >
                      Ver envios
                    </Link>
                    <Link
                      href="/devoluciones"
                      className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] transition hover:text-[#1C1C1C]"
                    >
                      Ver devoluciones
                    </Link>
                  </div>

                  <StatusMessage
                    type={status === 'error' ? 'error' : 'success'}
                    message={status !== 'idle' ? feedbackMessage : null}
                  />

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
                  >
                    {status === 'loading' ? 'Enviando mensaje...' : 'Enviar mensaje'}
                  </button>

                  <p className="text-sm leading-relaxed text-[#8A8A8A]">
                    Tu mensaje será enviado directamente al equipo de NovaStore.
                  </p>

                  <a
                    href="https://wa.me/50766449530"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-14 w-full items-center justify-center gap-3 border border-[#25D366]/30 bg-[#EAFBF1] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-[#1C1C1C] transition hover:border-[#25D366] hover:bg-[#DDF8E9]"
                  >
                    <Icon
                      name="ChatBubbleLeftRightIcon"
                      size={18}
                      variant="outline"
                      className="text-[#25D366]"
                    />
                    +507 6644-9530
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#DDD9D3] bg-[#EFEDE9]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-20">
          <div className="max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
              Temas de soporte
            </p>
            <h2 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C]">
              Elige el contexto correcto y la respuesta llega mejor.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5A5A5A]">
              Aunque el formulario es unico, estas son las areas mas frecuentes que atiende el
              equipo para organizar mejor cada mensaje.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {supportTopics.map((topic) => (
              <div key={topic.title} className="border border-[#DDD9D3] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center bg-[#EFF6FF] text-[#2563EB]">
                    <Icon name={topic.icon} size={20} variant="outline" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C]">
                    {topic.title}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#5A5A5A]">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
