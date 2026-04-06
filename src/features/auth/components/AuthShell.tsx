import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FeatureCard = {
  label: string;
  value: string;
};

type AuthShellProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  features: FeatureCard[];
  panelEyebrow: string;
  panelTitle: string;
  panelBadge?: string;
  children: React.ReactNode;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  features,
  panelEyebrow,
  panelTitle,
  panelBadge = 'Seguro',
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.06] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-start">
            <div className="max-w-2xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-[#DDD9D3] bg-white/70 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  {eyebrow}
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                {title}
              </h1>

              <p className="mt-6 max-w-xl text-base lg:text-lg leading-relaxed text-[#5A5A5A]">
                {description}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.label}
                    className="border border-[#DDD9D3] bg-white/75 px-5 py-5 backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                      {feature.label}
                    </p>
                    <p className="mt-3 text-2xl font-display font-900 text-[#1C1C1C]">{feature.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-[#DDD9D3]/70 via-transparent to-transparent pointer-events-none" />
              <div className="relative border border-[#DDD9D3] bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(28,28,28,0.08)]">
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A]">
                      {panelEyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                      {panelTitle}
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    {panelBadge}
                  </span>
                </div>

                <div className="mt-8">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
