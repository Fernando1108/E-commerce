'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { accountService } from '@/features/account/services/account.service';
import type { UserProfile } from '@/features/account/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await accountService.getProfile();
        setProfile(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'No fue posible cargar el perfil.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden px-6 pb-20 pt-[120px] lg:px-12">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 h-[360px] w-[360px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.05] pointer-events-none" />

        <div className="relative mx-auto flex max-w-[1440px] justify-center">
          <div className="w-full max-w-2xl border border-[#DDD9D3] bg-white/90 p-8 shadow-[0_24px_80px_rgba(28,28,28,0.08)] backdrop-blur-xl lg:p-12">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
              NovaStore Account
            </p>
            <h1 className="mt-4 text-center text-4xl font-display font-900 uppercase italic text-[#1C1C1C] lg:text-5xl">
              Mi perfil
            </h1>

            {isLoading && (
              <p className="mt-8 text-center text-base leading-relaxed text-[#8A8A8A]">
                Cargando perfil...
              </p>
            )}

            {!isLoading && errorMessage && (
              <div className="mt-8 border border-[#F1C8C2] bg-[#FFF7F5] px-5 py-4 text-center text-sm text-[#C33D2F]">
                {errorMessage}
              </div>
            )}

            {!isLoading && !errorMessage && profile && (
              <div className="mt-10 flex flex-col items-center">
                <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border border-[#DDD9D3] bg-[#EFEDE9]">
                  <img
                    src={profile.avatar}
                    alt={`Avatar de ${profile.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-8 w-full space-y-4">
                  <div className="border border-[#E6E1DA] bg-[#FCFBF9] px-5 py-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                      Nombre
                    </p>
                    <p className="mt-2 text-xl font-display font-900 text-[#1C1C1C]">{profile.name}</p>
                  </div>

                  <div className="border border-[#E6E1DA] bg-[#FCFBF9] px-5 py-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                      Email
                    </p>
                    <p className="mt-2 text-base text-[#1C1C1C]">{profile.email}</p>
                  </div>

                  <div className="border border-[#E6E1DA] bg-[#FCFBF9] px-5 py-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                      Direccion
                    </p>
                    <p className="mt-2 text-base text-[#1C1C1C]">{profile.address}</p>
                  </div>
                </div>

                <Link
                  href="/profile/settings"
                  className="mt-8 inline-flex h-14 items-center justify-center bg-[#1C1C1C] px-8 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB]"
                >
                  Editar perfil
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
