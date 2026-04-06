import { Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column } from '@react-email/components'

interface OrderConfirmationProps {
  customerName: string
  orderId: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}

export default function OrderConfirmation({ customerName, orderId, total, items }: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <Heading style={{ color: '#1a1a2e', fontSize: '24px', textAlign: 'center' as const }}>
            ¡Pedido confirmado!
          </Heading>
          <Text style={{ color: '#6b7280', textAlign: 'center' as const }}>
            Hola {customerName}, tu pedido ha sido procesado exitosamente.
          </Text>
          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Text style={{ color: '#1a1a2e', fontWeight: 'bold' }}>
            Pedido #{orderId.slice(0, 8).toUpperCase()}
          </Text>
          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: '8px' }}>
              <Column>
                <Text style={{ color: '#374151', margin: '0' }}>
                  {item.name} x{item.quantity}
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ color: '#374151', margin: '0' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </Column>
            </Row>
          ))}
          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Row>
            <Column>
              <Text style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>Total</Text>
            </Column>
            <Column align="right">
              <Text style={{ color: '#6C63FF', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>
                ${total.toFixed(2)}
              </Text>
            </Column>
          </Row>
          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Text style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const }}>
            NovaStore — Desarrollado por Kodexa Solutions
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
