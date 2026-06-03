import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react'
import { checkout } from '../../services/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearCart, closeCart, removeItem } from '../../store/reducers/cart'
import { formatCurrency } from '../../utils/format'
import {
  CartAction,
  CartAside,
  CartCard,
  CartContent,
  CartImage,
  CartItemPrice,
  CartItemText,
  CartItemTitle,
  CartList,
  CartOverlay,
  CartTotal,
  CartTotalLabel,
  CartTotalValue,
  DeleteButton,
  EmptyText,
  ErrorText,
  FieldError,
  FormActions,
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
  FormTitle,
  SuccessText
} from './styles'

type DeliveryForm = {
  receiver: string
  address: string
  city: string
  zip: string
  number: string
  complement: string
}

type PaymentForm = {
  cardName: string
  cardNumber: string
  cvv: string
  expMonth: string
  expYear: string
}

const initialDelivery: DeliveryForm = {
  receiver: '',
  address: '',
  city: '',
  zip: '',
  number: '',
  complement: ''
}

const initialPayment: PaymentForm = {
  cardName: '',
  cardNumber: '',
  cvv: '',
  expMonth: '',
  expYear: ''
}

const onlyDigits = (value: string) => value.replace(/\D/g, '')

const CartSidebar = () => {
  const dispatch = useAppDispatch()
  const { isOpen, items } = useAppSelector((state) => state.cart)
  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + item.price, 0),
    [items]
  )
  const [step, setStep] = useState<'cart' | 'delivery' | 'payment' | 'success'>(
    'cart'
  )
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [delivery, setDelivery] = useState<DeliveryForm>(initialDelivery)
  const [payment, setPayment] = useState<PaymentForm>(initialPayment)
  const [deliveryErrors, setDeliveryErrors] = useState<Record<string, string>>(
    {}
  )
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) {
      setStep('cart')
      setOrderId(null)
      setIsSubmitting(false)
      setSubmitError('')
      setDelivery(initialDelivery)
      setPayment(initialPayment)
      setDeliveryErrors({})
      setPaymentErrors({})
    }
  }, [isOpen])

  const finishOrder = () => {
    dispatch(clearCart())
    dispatch(closeCart())
  }

  const changeDelivery =
    (field: keyof DeliveryForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setDelivery((state) => ({ ...state, [field]: event.target.value }))
    }

  const changeDeliveryDigits =
    (field: keyof DeliveryForm, max: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setDelivery((state) => ({
        ...state,
        [field]: onlyDigits(event.target.value).slice(0, max)
      }))
    }

  const changePayment =
    (field: keyof PaymentForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setPayment((state) => ({ ...state, [field]: event.target.value }))
    }

  const changePaymentDigits =
    (field: keyof PaymentForm, max: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setPayment((state) => ({
        ...state,
        [field]: onlyDigits(event.target.value).slice(0, max)
      }))
    }

  const validateDelivery = () => {
    const errors: Record<string, string> = {}

    if (!delivery.receiver.trim()) errors.receiver = 'Informe quem irá receber'
    if (!delivery.address.trim()) errors.address = 'Informe o endereço'
    if (!delivery.city.trim()) errors.city = 'Informe a cidade'

    if (!delivery.zip.trim()) {
      errors.zip = 'Informe o CEP'
    } else if (onlyDigits(delivery.zip).length !== 8) {
      errors.zip = 'CEP deve ter 8 dígitos'
    }

    if (!delivery.number.trim()) {
      errors.number = 'Informe o número'
    } else if (!/^\d+$/.test(delivery.number.trim())) {
      errors.number = 'Número inválido'
    }

    setDeliveryErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    const errors: Record<string, string> = {}

    if (!payment.cardName.trim()) errors.cardName = 'Informe o nome no cartão'

    const cardDigits = onlyDigits(payment.cardNumber)
    if (!cardDigits) {
      errors.cardNumber = 'Informe o número do cartão'
    } else if (cardDigits.length < 13 || cardDigits.length > 19) {
      errors.cardNumber = 'Cartão inválido'
    }

    const cvvDigits = onlyDigits(payment.cvv)
    if (!cvvDigits) {
      errors.cvv = 'Informe o CVV'
    } else if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      errors.cvv = 'CVV inválido'
    }

    const month = Number(onlyDigits(payment.expMonth))
    if (!payment.expMonth.trim()) {
      errors.expMonth = 'Informe o mês'
    } else if (!Number.isInteger(month) || month < 1 || month > 12) {
      errors.expMonth = 'Mês inválido'
    }

    const yearDigits = onlyDigits(payment.expYear)
    const year =
      yearDigits.length === 2 ? 2000 + Number(yearDigits) : Number(yearDigits)
    const currentYear = new Date().getFullYear()
    if (!yearDigits) {
      errors.expYear = 'Informe o ano'
    } else if (yearDigits.length !== 2 && yearDigits.length !== 4) {
      errors.expYear = 'Ano inválido'
    } else if (year < currentYear || year > currentYear + 20) {
      errors.expYear = 'Ano inválido'
    }

    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  const submitOrder = async () => {
    if (!validatePayment()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const yearDigits = onlyDigits(payment.expYear)
      const year =
        yearDigits.length === 2 ? 2000 + Number(yearDigits) : Number(yearDigits)

      const response = await checkout({
        products: items.map((item) => ({
          id: item.productId,
          price: item.price
        })),
        delivery: {
          receiver: delivery.receiver.trim(),
          address: {
            description: delivery.address.trim(),
            city: delivery.city.trim(),
            zipCode: onlyDigits(delivery.zip),
            number: Number(delivery.number),
            complement: delivery.complement.trim()
          }
        },
        payment: {
          card: {
            name: payment.cardName.trim(),
            number: onlyDigits(payment.cardNumber),
            code: Number(onlyDigits(payment.cvv)),
            expires: {
              month: Number(onlyDigits(payment.expMonth)),
              year
            }
          }
        }
      })

      setOrderId(response.orderId)
      setStep('success')
    } catch (error) {
      setSubmitError('Não foi possível finalizar o pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <CartOverlay onClick={() => dispatch(closeCart())}>
      <CartAside
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <CartContent>
          {step === 'cart' ? (
            <>
              {items.length > 0 ? (
                <>
                  <CartList>
                    {items.map((item) => (
                      <CartCard key={item.cartId}>
                        <CartImage src={item.image} alt={item.title} />
                        <CartItemText>
                          <CartItemTitle>{item.title}</CartItemTitle>
                          <CartItemPrice>
                            {formatCurrency(item.price)}
                          </CartItemPrice>
                        </CartItemText>
                        <DeleteButton
                          type="button"
                          onClick={() => dispatch(removeItem(item.cartId))}
                          aria-label="Remover item"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M3 6H21M8 6V4H16V6M7 6V20H17V6M10 10V17M14 10V17"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </DeleteButton>
                      </CartCard>
                    ))}
                  </CartList>

                  <CartTotal>
                    <CartTotalLabel>Valor total</CartTotalLabel>
                    <CartTotalValue>
                      {formatCurrency(totalPrice)}
                    </CartTotalValue>
                  </CartTotal>

                  <CartAction type="button" onClick={() => setStep('delivery')}>
                    Continuar com a entrega
                  </CartAction>
                </>
              ) : (
                <EmptyText>Seu carrinho está vazio.</EmptyText>
              )}
            </>
          ) : step === 'delivery' ? (
            <>
              <FormTitle>Entrega</FormTitle>

              <FormField>
                <FormLabel>Quem irá receber</FormLabel>
                <FormInput
                  value={delivery.receiver}
                  onChange={changeDelivery('receiver')}
                  $hasError={!!deliveryErrors.receiver}
                  placeholder="Ex: Joao Paulo de Souza"
                />
                {deliveryErrors.receiver && (
                  <FieldError>{deliveryErrors.receiver}</FieldError>
                )}
              </FormField>

              <FormField>
                <FormLabel>Endereço</FormLabel>
                <FormInput
                  value={delivery.address}
                  onChange={changeDelivery('address')}
                  $hasError={!!deliveryErrors.address}
                  placeholder="Ex: Rua das Flores, 123"
                />
                {deliveryErrors.address && (
                  <FieldError>{deliveryErrors.address}</FieldError>
                )}
              </FormField>

              <FormField>
                <FormLabel>Cidade</FormLabel>
                <FormInput
                  value={delivery.city}
                  onChange={changeDelivery('city')}
                  $hasError={!!deliveryErrors.city}
                  placeholder="Ex: São Paulo"
                />
                {deliveryErrors.city && (
                  <FieldError>{deliveryErrors.city}</FieldError>
                )}
              </FormField>

              <FormGrid>
                <FormField>
                  <FormLabel>CEP</FormLabel>
                  <FormInput
                    value={delivery.zip}
                    onChange={changeDeliveryDigits('zip', 8)}
                    $hasError={!!deliveryErrors.zip}
                    placeholder="00000000"
                  />
                  {deliveryErrors.zip && (
                    <FieldError>{deliveryErrors.zip}</FieldError>
                  )}
                </FormField>
                <FormField>
                  <FormLabel>Número</FormLabel>
                  <FormInput
                    value={delivery.number}
                    onChange={changeDeliveryDigits('number', 10)}
                    $hasError={!!deliveryErrors.number}
                    placeholder="123"
                  />
                  {deliveryErrors.number && (
                    <FieldError>{deliveryErrors.number}</FieldError>
                  )}
                </FormField>
              </FormGrid>

              <FormField>
                <FormLabel>Complemento (opcional)</FormLabel>
                <FormInput
                  value={delivery.complement}
                  onChange={changeDelivery('complement')}
                  placeholder="Apto, bloco, referência"
                />
              </FormField>

              <FormActions>
                <CartAction
                  type="button"
                  onClick={() => {
                    if (validateDelivery()) {
                      setStep('payment')
                    }
                  }}
                >
                  Continuar com o pagamento
                </CartAction>
                <CartAction type="button" onClick={() => setStep('cart')}>
                  Voltar para o carrinho
                </CartAction>
              </FormActions>
            </>
          ) : step === 'payment' ? (
            <>
              <FormTitle>
                Pagamento - Valor a pagar {formatCurrency(totalPrice)}
              </FormTitle>

              <FormField>
                <FormLabel>Nome no cartão</FormLabel>
                <FormInput
                  value={payment.cardName}
                  onChange={changePayment('cardName')}
                  $hasError={!!paymentErrors.cardName}
                  placeholder="Como está no cartão"
                />
                {paymentErrors.cardName && (
                  <FieldError>{paymentErrors.cardName}</FieldError>
                )}
              </FormField>

              <FormGrid>
                <FormField>
                  <FormLabel>Número do cartão</FormLabel>
                  <FormInput
                    value={payment.cardNumber}
                    onChange={changePaymentDigits('cardNumber', 19)}
                    $hasError={!!paymentErrors.cardNumber}
                    placeholder="0000 0000 0000 0000"
                  />
                  {paymentErrors.cardNumber && (
                    <FieldError>{paymentErrors.cardNumber}</FieldError>
                  )}
                </FormField>
                <FormField>
                  <FormLabel>CVV</FormLabel>
                  <FormInput
                    value={payment.cvv}
                    onChange={changePaymentDigits('cvv', 4)}
                    $hasError={!!paymentErrors.cvv}
                    placeholder="123"
                  />
                  {paymentErrors.cvv && (
                    <FieldError>{paymentErrors.cvv}</FieldError>
                  )}
                </FormField>
              </FormGrid>

              <FormGrid>
                <FormField>
                  <FormLabel>Mes de vencimento</FormLabel>
                  <FormInput
                    value={payment.expMonth}
                    onChange={changePaymentDigits('expMonth', 2)}
                    $hasError={!!paymentErrors.expMonth}
                    placeholder="MM"
                  />
                  {paymentErrors.expMonth && (
                    <FieldError>{paymentErrors.expMonth}</FieldError>
                  )}
                </FormField>
                <FormField>
                  <FormLabel>Ano de vencimento</FormLabel>
                  <FormInput
                    value={payment.expYear}
                    onChange={changePaymentDigits('expYear', 4)}
                    $hasError={!!paymentErrors.expYear}
                    placeholder="AAAA"
                  />
                  {paymentErrors.expYear && (
                    <FieldError>{paymentErrors.expYear}</FieldError>
                  )}
                </FormField>
              </FormGrid>

              {submitError && <ErrorText>{submitError}</ErrorText>}

              <FormActions>
                <CartAction
                  type="button"
                  onClick={submitOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Finalizando...' : 'Finalizar pagamento'}
                </CartAction>
                <CartAction
                  type="button"
                  onClick={() => setStep('delivery')}
                  disabled={isSubmitting}
                >
                  Voltar para a edição de endereço
                </CartAction>
              </FormActions>
            </>
          ) : (
            <>
              <FormTitle>Pedido realizado - {orderId ?? ''}</FormTitle>

              <SuccessText>
                Estamos felizes em informar que seu pedido já está em processo
                de preparação e, em breve, será entregue no endereço fornecido.
              </SuccessText>
              <SuccessText>
                Gostaríamos de ressaltar que nossos entregadores não estão
                autorizados a realizar cobranças extras.
              </SuccessText>
              <SuccessText>
                Lembre-se da importância de higienizar as mãos após o
                recebimento do pedido, garantindo assim sua segurança e
                bem-estar durante a refeição.
              </SuccessText>
              <SuccessText>
                Esperamos que desfrute de uma deliciosa e agradavel experiencia
                gastronômica. Bom apetite!
              </SuccessText>

              <FormActions>
                <CartAction type="button" onClick={finishOrder}>
                  Concluir
                </CartAction>
              </FormActions>
            </>
          )}
        </CartContent>
      </CartAside>
    </CartOverlay>
  )
}

export default CartSidebar
