import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
} from '@react-email/components';

interface WelcomeProps {
  name: string;
}

export default function Welcome({ name }: WelcomeProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{ backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif', padding: '40px 0' }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <Heading style={{ color: '#1a1a2e', fontSize: '24px', textAlign: 'center' as const }}>
            ¡Bienvenido a NovaStore!
          </Heading>
          <Text style={{ color: '#6b7280', textAlign: 'center' as const }}>
            Hola {name}, gracias por crear tu cuenta. Estás listo para explorar nuestros productos.
          </Text>
          <Section style={{ textAlign: 'center' as const, margin: '32px 0' }}>
            <Button
              href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028'}/products`}
              style={{
                backgroundColor: '#6C63FF',
                color: '#ffffff',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Ver productos
            </Button>
          </Section>
          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Text style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const }}>
            NovaStore — Desarrollado por Kodexa Solutions
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
