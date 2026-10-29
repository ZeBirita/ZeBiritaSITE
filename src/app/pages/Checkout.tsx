import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Wallet, MessageCircle, Check, MapPin, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { Address, typePaymentMethod, PaymentMethods, newAddress } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/price';

const useGeolocation = () => {
  const [loading, setLoading] = useState(false);

  const getCurrentPositionAsync = (options?: PositionOptions): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error('Geolocalização não suportada pelo navegador'));
      else navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const getLocation = async (): Promise<GeolocationPosition> => {
    setLoading(true);
    try {
      const position = await getCurrentPositionAsync({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      return position;
    } finally {
      setLoading(false);
    }
  };

  return { getLocation, loading };
};

const getAddressFromCoords = async (lat: number, lng: number): Promise<Address> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
  const response = await fetch(url, { headers: { 'Accept': 'application/json' } });

  if (!response.ok) throw new Error('Erro ao obter endereço');

  const data = await response.json();
  if (!data.address || data.address.length === 0) throw new Error('Nenhum endereço encontrado');

  return {
    street: data.address.road || '',
    number: '',
    complement: '',
    city: data.address.city || data.address.city_district || data.address.municipality || '',
    postalCode: data.address.postcode || '',
    coordinates: { lat: parseFloat(data.lat), lng: parseFloat(data.lon) },
  };
};

const getDeliveryFee = (address: Address): number | null => {
  const normalizedAddress = `${address.city} ${address.street}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase();

  const hasCity = (city: string) => normalizedAddress.includes(city);
  const isPortimaoAlvorRoad = hasCity('portimao') &&
    (normalizedAddress.includes('estrada de alvor') ||
      normalizedAddress.includes('estr de alvor') ||
      normalizedAddress.includes('estr. de alvor'));

  if (isPortimaoAlvorRoad) return 1;
  if (
    hasCity('alvor') ||
    hasCity('auvor') ||
    hasCity('parchal') ||
    hasCity('parchau') ||
    hasCity('parxau') ||
    hasCity('parshal') ||
    hasCity('ferragudo')
  ) return 3;
  if (hasCity('portimao')) return 1;
  return null;
};

export function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address>(newAddress);
  const [paymentMethod, setPaymentMethod] = useState<typePaymentMethod>(null);
  const [needChange, setNeedChange] = useState(true);
  const [payingAmountInput, setPayingAmountInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  //const [mbwayPhone, setMbwayPhone] = useState('');

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const deliveryBoxRef = useRef<HTMLDivElement>(null);
  const paymentBoxRef = useRef<HTMLDivElement>(null);
  const cashDetailsBoxRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<any>(null);
  const marker = useRef<any>(null);

  const { cart, getTotal, clearCart } = useCart();
  const { getLocation, loading: loadingLocation } = useGeolocation();
  const { t } = useLanguage();

  const total = getTotal();
  const subtotal = total >= 10 ? 0 : 10 - total;
  const baseTotal = total + subtotal;
  const deliveryFee = getDeliveryFee(address);
  const deliveryFeeText = deliveryFee === null
    ? `${formatPrice(1)} (${t('a confirmar')})`
    : formatPrice(deliveryFee);
  const orderTotal = baseTotal + (deliveryFee ?? 1);
  const payingAmount = Number(payingAmountInput.replace(',', '.')) || 0;

  useEffect(() => {
    localStorage.removeItem('address');
  }, []);

  useEffect(() => {
    if (!cart.length) navigate('/');
  }, [cart, navigate])

  // Carrega o Leaflet (CSS e JS) dinamicamente
  useEffect(() => {
    if ((window as any).L) {
      setIsMapLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setIsMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Inicializa e atualiza o mapa/marcador
  useEffect(() => {
    if (isMapLoaded && mapRef.current && address.coordinates && !googleMap.current) {
      const L = (window as any).L;
      const pos = { lat: address.coordinates.lat, lng: address.coordinates.lng };

      googleMap.current = L.map(mapRef.current).setView([pos.lat, pos.lng], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(googleMap.current);

      // Fix para ícone padrão do Leaflet que as vezes não carrega via CDN
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      marker.current = L.marker([pos.lat, pos.lng], { draggable: true, icon }).addTo(googleMap.current);

      marker.current.on('dragend', async (event: any) => {
        const { lat, lng } = event.target.getLatLng();
        try {
          const newAddressData = await getAddressFromCoords(lat, lng);
          setAddress(prev => ({ ...newAddressData, number: prev.number, complement: prev.complement }));
        } catch (e) {
          console.error("Erro ao atualizar endereço via arraste", e);
        }
      });
    } else if (googleMap.current && marker.current && address.coordinates) {
      const pos = { lat: address.coordinates.lat, lng: address.coordinates.lng };
      googleMap.current.setView([pos.lat, pos.lng]);
      marker.current.setLatLng([pos.lat, pos.lng]);
    }

    return () => {
      if (googleMap.current) {
        googleMap.current.remove();
        googleMap.current = null;
      }
    };
  }, [isMapLoaded, address.coordinates]);

  const handleUseMyLocation = async () => {
    try {
      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      const realAddress = await getAddressFromCoords(latitude, longitude);
      setAddress(realAddress);
      toast.success(t('Localização obtida com sucesso!'));
    } catch (error: any) {
      if (error.code === 1) {
        toast.error(t('Permissão negada. Preencha manualmente.'));
      } else {
        console.error(error);
        if (error.code === 2) toast.error(t('Localização indisponível. Preencha manualmente.'));
        else if (error.code === 3) toast.error(t('Tempo esgotado. Tente novamente.'));
        else toast.error(error.message || t('Não foi possível obter sua localização.'));
      }
    }
  };

  const highlightMissingBox = (boxRef: React.RefObject<HTMLDivElement | null>) => {
    const box = boxRef.current;
    if (!box) return;

    const header = document.querySelector('header');
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const top = window.scrollY + box.getBoundingClientRect().top - headerHeight - 16;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    box.classList.remove('checkout-attention');
    void box.offsetWidth;
    box.classList.add('checkout-attention');
  };

  const handleWhatsAppCheckout = () => {
    // Se o botão estiver desabilitado, exibe o toast com a mensagem específica
    if (isConfirmDisabled) {
      if (!address.street) {
        toast.error(t('Por favor, preencha o endereço de entrega para continuar.'));
        highlightMissingBox(deliveryBoxRef);
      } else if (paymentMethod === null) {
        toast.error(t('Por favor, selecione uma forma de pagamento para continuar.'));
        highlightMissingBox(paymentBoxRef);
      } else if (paymentMethod === 'cash' && needChange && payingAmount < minPayingAmount) {
        toast.error(t('Por favor, insira um valor para troco ou selecione "Não" para troco.'));
        highlightMissingBox(cashDetailsBoxRef);
      }
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Verifica novamente se o botão está desabilitado antes de prosseguir com a lógica de envio
      // Isso é uma salvaguarda caso o estado mude rapidamente
      if (isConfirmDisabled) {
        setIsProcessing(false); // Reseta o estado de processamento
        // O toast já foi exibido acima, então apenas retorna
        return;
      }

      const addressText = `${address.street}${address.number ? ', ' + address.number : ''}\n${address.postalCode} ${address.city}`;

      const paymentText =
        paymentMethod == 'mbway' ? 'MB Way' :
          paymentMethod == 'multibanco' ? 'Multibanco' :
            'Dinheiro'
        ;

      let message = `Olá! Gostaria de fazer um pedido:`;
      message += `\n\nPRODUTOS:`;

      cart.forEach((item) => {
        message += `\n\n- ${item.quantity} x ${item.drink.name} - ${formatPrice(item.drink.price)} cada (${formatPrice(item.drink.price * item.quantity)})`;
      });

      message += `\n\nTOTAL: ${formatPrice(orderTotal)}`;
      message += `\nForma de pagamento: ${paymentText}`;

      if (paymentText === 'Dinheiro') {
        if (needChange) {
          message += `\nValor que irá pagar: ${formatPrice(payingAmount)}`;
          message += `\nTroco a devolver: ${formatPrice(payingAmount - orderTotal)}`;
        } else {
          message += `\nTroco: Não necessário`;
        }
      }

      if (subtotal > 0) {
        message += `\nValor de taxa mínima pago pelo cliente: ${formatPrice(subtotal)}`;
      }

      message += `\nTaxa de entrega: ${deliveryFeeText}`;

      message += `\n\nENDEREÇO DE ENTREGA:\n${addressText}`;

      if (address.coordinates) {
        message += `\nLocalização (Google Maps): https://www.google.com/maps?q=${address.coordinates.lat},${address.coordinates.lng}`;
      }

      const whatsappUrl = `https://wa.me/351931835337?text=${encodeURIComponent(message)}`;
      clearCart();
      toast.success(t('Pedido confirmado! Redirecionando para o WhatsApp...'), { duration: 3000 });

      setTimeout(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = whatsappUrl; // abre app no celular
        } else {
          window.open(whatsappUrl, '_blank'); // abre Web WhatsApp no desktop
        }
      }, 1500);
    }, 2000);
  };

  const minPayingAmount = orderTotal;
  const isConfirmDisabled = !address.street || paymentMethod == null || isProcessing || (paymentMethod === 'cash' && needChange && payingAmount < minPayingAmount);

  return (
    <div className="min-h-screen py-14 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h1 className="text-4xl font-bold mb-2 text-primary">{t('Finalizar Compra')}</h1>
          <p className="text-muted-foreground">{t('Preencha os dados de entrega e escolha a forma de pagamento')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Delivery & Payment */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <motion.div ref={deliveryBoxRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="shrink-0 text-xl font-bold">{t('Entrega')}</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUseMyLocation}
                  disabled={loadingLocation}
                  className="flex shrink-0 items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('Obtendo...')}
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      {t('Usar Minha Localização')}
                    </>
                  )}
                </motion.button>
              </div>

              {address.coordinates && (
                <div
                  ref={mapRef}
                  className="relative z-0 w-full h-55 rounded-lg mb-6 border border-border overflow-hidden shadow-inner"
                  style={{ background: '#242424' }}
                />
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm mb-2">{t('Endereço:')}</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder={t('Ex: Rua das cervejas, Ed. Vista Mar')}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  {/*                   <div>
                    <label className="block text-sm mb-2">Número</label>
                    <input
                      type="text"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                    />
                  </div> */}
                </div>

                {/*                 <div className="grid gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm mb-2">Complemento</label>
                    <input
                      type="text"
                      value={address.complement || ''}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      placeholder="Ex: Lote 1 quadra 15"
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div> */}

                {/*                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Código Postal *</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="1250-096"
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Cidade *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Lisboa"
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div> */}
              </div>
            </motion.div>

            <motion.div ref={paymentBoxRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">{t('Forma de Pagamento')}</h2>
              <div className="space-y-3">
                {PaymentMethods.map((method) => (
                  <motion.a
                    key={method.id}
                    href={`#${method.id}`}
                    className="flex gap-4"
                  >
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold">{t(method.name)}</h3>
                        <p className="text-sm text-muted-foreground">{t(method.description)}</p>
                      </div>
                      {paymentMethod === method.id && <Check className="w-6 h-6 text-primary" />}
                    </motion.button>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* {paymentMethod === 'mbway' && (
                <div>
                  <label className="block text-sm mb-2">Número de Telefone MB Way *</label>
                  <input
                    type="tel"
                    value={mbwayPhone}
                    onChange={(e) => setMbwayPhone(e.target.value)}
                    placeholder="+351 912 345 678"
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Receberá uma notificação no app MB Way para confirmar o pagamento
                  </p>
                </div>
              )} */}

            {/* {paymentMethod === 'multibanco' && (
                <div className="bg-secondary/50 rounded-lg p-6 text-center">
                  <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Após a confirmação do pedido, receberá uma referência Multibanco via WhatsApp.
                  </p>
                  <div className="mt-4 p-4 bg-card rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      Entidade: <span className="text-foreground font-semibold">12345</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Referência e valor serão gerados após confirmação</p>
                  </div>
                </div>
              )} */}

            {paymentMethod === 'cash' && (
              <motion.div ref={cashDetailsBoxRef} id="cash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">{t('Detalhes do Pagamento')}</h2>
                <div className="bg-secondary/50 rounded-lg p-6 text-center">
                  <Wallet className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('O pagamento será efetuado em dinheiro no momento da entrega.')}
                  </p>
                  <div className="mt-4 p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-center gap-4">
                      <span>
                        {t('Preciso de troco?')}
                      </span>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setNeedChange(true)}>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${needChange ? 'bg-primary border-primary' : 'bg-card border-border'
                              }`}
                          >
                            {needChange && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={needChange ? 'text-primary font-medium' : 'text-muted-foreground'}>
                            {t('Sim')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setNeedChange(false)}>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${!needChange ? 'bg-primary border-primary' : 'bg-card border-border'
                              }`}
                          >
                            {!needChange && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={!needChange ? 'text-primary font-medium' : 'text-muted-foreground'}>
                            {t('Não')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {needChange && (
                      <div className="flex items-center justify-center gap-4">
                        <span>
                          {t('Troco para quanto ?')}
                        </span>
                        <div className="relative w-20 mt-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={payingAmountInput}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,3}([.,]\d{0,2})?$/.test(value)) {
                                setPayingAmountInput(value);
                              }
                            }}
                            className="w-full pl-8 py-2 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
                          />
                          {payingAmount > 0 && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>}
                        </div>
                      </div>
                    )}
                    <p className="text-red-500 mt-1">
                      ⚠️ {t('Valor mínimo cobrado:')} {formatPrice(minPayingAmount)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">{t('Resumo do Pedido')}</h2>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.drink.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 break-words text-muted-foreground">
                      {item.quantity}x {item.drink.name.replaceAll('Combo', t('Combo'))}
                    </span>
                    <span className="shrink-0 whitespace-nowrap">{formatPrice(item.drink.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {paymentMethod === 'cash' && needChange && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('Troco a receber')}</span>
                    <span>{formatPrice(Math.max(0, payingAmount - orderTotal))}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('Taxa pedido mínimo')}</span>
                  <span className="text-primary">{subtotal == 0 ? t('Grátis') : formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground whitespace-nowrap">{t('Taxa de entrega')}</span>
                  <span className="text-primary text-right whitespace-nowrap">
                    {deliveryFeeText}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppCheckout}
                className={`w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isConfirmDisabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('Processando...')}
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    {t('Confirmar via WhatsApp')}
                  </>
                )}
              </motion.button>

              {(!isProcessing && isConfirmDisabled) && (
                <p className="text-sm text-red-500 text-center mt-2">
                  {!address.street
                    ? t('Por favor, preencha o endereço de entrega para continuar.')
                    : paymentMethod === null
                      ? t('Por favor, selecione uma forma de pagamento para continuar.')
                      : paymentMethod === 'cash' && needChange && payingAmount < minPayingAmount
                        ? t('Por favor, insira um valor para troco ou selecione "Não" para troco.')
                        : ''
                  }
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center mt-4">
                {t('Você será redirecionado para o WhatsApp para confirmar seu pedido')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}