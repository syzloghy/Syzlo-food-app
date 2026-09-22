import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { locationService } from '../../services/locationService';
import { DeliveryAddress, OrderType, PaymentMethod, SupportedPaymentGateway } from '../../types';
import { OpenStreetMap } from '../common/OpenStreetMap';
import confetti from 'canvas-confetti';
import {
  Compass,
  ChevronLeft,
  ShieldCheck,
  QrCode,
  Banknote,
  Bike,
  ShoppingBag,
  Utensils,
  ArrowRight,
  CreditCard,
  Building,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    orderType,
    setOrderType,
    appliedCoupon,
    placeCustomerOrder,
    customerProfile,
    setCustomerScreen,
    paymentGateways,
    osmConfig,
    brandConfig,
  } = useApp();

  // Form Fields
  const [customerName, setCustomerName] = useState(customerProfile.name);
  const [customerPhone, setCustomerPhone] = useState(customerProfile.phone);

  // Address
  const [addressLabel, setAddressLabel] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [houseNo, setHouseNo] = useState('Flat 402, Lotus Tower');
  const [street, setStreet] = useState('14th Road, Off Turner Road');
  const [areaLandmark, setAreaLandmark] = useState('Near Carter Road Promenade, Bandra West');
  const [pinCode, setPinCode] = useState('400050');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: osmConfig.centerLat + 0.005,
    lng: osmConfig.centerLng + 0.004,
  });

  const [isLocating, setIsLocating] = useState(false);

  // Dine-in fields
  const [dineInTable, setDineInTable] = useState('Table 02');
  // Takeaway / Dine-in selection
const [pickupMode, setPickupMode] = useState<'TAKEAWAY' | 'DINE-IN' | ''>('');

  // Payment Selection: defaults to first enabled gateway or RAZORPAY
  const [selectedGatewayId, setSelectedGatewayId] = useState<SupportedPaymentGateway>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState<string | null>(null);

  const breakdown = orderService.calculateOrderBreakdown(cart, orderType, appliedCoupon, 40);

  // Geolocation detection
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const position = await locationService.getCurrentPosition();
      setCoords(position);
      setAreaLandmark('Detected via GPS Live Fix');
      setPinCode('400050');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectSavedAddress = (addr: DeliveryAddress) => {
    setAddressLabel(addr.label);
    setHouseNo(addr.houseNo);
    setStreet(addr.street);
    setAreaLandmark(addr.areaLandmark);
    setPinCode(addr.pinCode);
    if (addr.latitude && addr.longitude) {
      setCoords({ lat: addr.latitude, lng: addr.longitude });
    }
  };

  const handlePlaceOrder = () => {
  if (orderType !== 'DELIVERY' && !pickupMode) {
    alert('Please select Takeaway or Dine-in before placing your order.');
    return;
  }

  setIsProcessing(true);

    const activeGateway = paymentGateways.find((g) => g.id === selectedGatewayId);

    // Simulate payment processing flow (Razorpay/Cashfree/UPI/COD)
    if (activeGateway?.id === 'RAZORPAY') {
      setGatewayMessage(`Opening Razorpay Checkout Modal (Key: ${activeGateway.keyId || 'rzp_test_...'})`);
    } else if (activeGateway?.id === 'CASHFREE') {
      setGatewayMessage(`Connecting to Cashfree Order Session (Key: ${activeGateway.keyId || 'CF_APP_...'})`);
    } else if (activeGateway?.id === 'UPI_QR') {
      setGatewayMessage(`Generating Dynamic UPI QR Code for ${activeGateway.merchantVpa || activeGateway.keyId || 'syzlo@upi'}`);
    } else {
      setGatewayMessage('Processing Cash on Delivery booking...');
    }

    setTimeout(() => {
      setIsProcessing(false);
      setGatewayMessage(null);

      const deliveryAddr: DeliveryAddress | undefined =
        orderType === 'DELIVERY'
          ? {
              label: addressLabel,
              houseNo,
              street,
              areaLandmark,
              pinCode,
              latitude: coords.lat,
              longitude: coords.lng,
            }
          : undefined;

      let paymentMethod: PaymentMethod = 'UPI';
      if (selectedGatewayId === 'CASH_ON_DELIVERY') paymentMethod = 'CASH';
      else if (selectedGatewayId === 'RAZORPAY') paymentMethod = 'RAZORPAY';
      else if (selectedGatewayId === 'CASHFREE') paymentMethod = 'CASHFREE';

      placeCustomerOrder({
        source: 'ONLINE',
        orderType,
        customerName,
        customerPhone,
        deliveryAddress: deliveryAddr,
        dineInTable: orderType === 'DINE-IN' ? dineInTable : undefined,
        paymentMethod,
        paymentStatus: selectedGatewayId === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      });

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7A7B26', '#EED7B5', '#20221A', '#22C55E'],
        });
      } catch {
        // no-op if canvas is restricted
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-16 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back link */}
        <button
          onClick={() => setCustomerScreen('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-syzlo-charcoal mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-black text-syzlo-charcoal tracking-tight mb-5">
          Checkout & Final Review
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Details & Address & Payments */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Contact Details */}
            <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
              <span className="text-xs font-extrabold text-olive-700 uppercase tracking-wider block">
                1. Customer Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                  />
                </div>
              </div>
            </div>

           {/* Step 2: Fulfillment Mode */}
<div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
  <span className="text-xs font-extrabold text-olive-700 uppercase tracking-wider block">
    2. Order Fulfillment Mode
  </span>

  <div className="grid grid-cols-2 gap-2">
    {/* Delivery */}
    <button
      type="button"
      onClick={() => {
        setOrderType('DELIVERY');
        setPickupMode('');
      }}
      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
        orderType === 'DELIVERY'
          ? 'bg-olive-500 text-white border-olive-600 shadow-xs'
          : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-100'
      }`}
    >
      <Bike className="w-4 h-4" />
      <span>Delivery</span>
    </button>

    {/* Takeaway / Dine-in */}
    <button
      type="button"
      onClick={() => {
        setOrderType('PICKUP');
        setPickupMode('');
      }}
      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
        orderType === 'PICKUP' || orderType === 'DINE-IN'
          ? 'bg-olive-500 text-white border-olive-600 shadow-xs'
          : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-100'
      }`}
    >
      <ShoppingBag className="w-4 h-4" />
      <span>Takeaway / Dine-in</span>
    </button>
  </div>

  {/* Compulsory Takeaway / Dine-in Selection */}
  {(orderType === 'PICKUP' || orderType === 'DINE-IN') && (
    <div className="pt-2 border-t border-cream-200 space-y-2">
      <span className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider block">
        Choose Order Type *
      </span>

      <div className="grid grid-cols-2 gap-2">
        {/* Takeaway */}
        <button
          type="button"
          onClick={() => {
            setPickupMode('TAKEAWAY');
            setOrderType('PICKUP');
          }}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
            pickupMode === 'TAKEAWAY'
              ? 'bg-olive-500 text-white border-olive-600 shadow-xs'
              : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Takeaway</span>
        </button>

        {/* Dine-in */}
        <button
          type="button"
          onClick={() => {
            setPickupMode('DINE-IN');
            setOrderType('DINE-IN');
          }}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
            pickupMode === 'DINE-IN'
              ? 'bg-olive-500 text-white border-olive-600 shadow-xs'
              : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Dine-in</span>
        </button>
      </div>

      {!pickupMode && (
        <p className="text-[11px] font-semibold text-red-600">
          Please select Takeaway or Dine-in to continue.
        </p>
      )}
    </div>
  )}
</div>
            {/* Step 3: Address / Table according to mode */}
            {orderType === 'DELIVERY' && (
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-olive-700 uppercase tracking-wider">
                    3. Delivery Location & Free OSM Map
                  </span>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="text-xs font-bold text-olive-700 hover:text-olive-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isLocating ? 'Locating...' : 'Use GPS'}</span>
                  </button>
                </div>

                {/* Free OpenStreetMap Component */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Click anywhere on the map to place drop pin:</span>
                    <span className="font-mono text-[11px] text-olive-800 font-bold">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  </div>
                  <OpenStreetMap
                    pinCoords={coords}
                    onPinSelect={(newCoords) => setCoords(newCoords)}
                    heightClass="h-60"
                  />
                </div>

                {/* Saved Address Presets */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Saved Addresses
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {customerProfile.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          addressLabel === addr.label && street === addr.street
                            ? 'border-olive-500 bg-olive-50/50'
                            : 'border-cream-300 hover:bg-cream-50'
                        }`}
                      >
                        <span className="font-bold text-syzlo-charcoal block">{addr.label}</span>
                        <span className="text-stone-500 truncate block text-[11px]">
                          {addr.houseNo}, {addr.street}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      House / Flat Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Building / Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Area / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={areaLandmark}
                      onChange={(e) => setAreaLandmark(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {orderType === 'PICKUP' && (
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
                <span className="text-xs font-extrabold text-olive-700 uppercase tracking-wider block">
                  3. Pickup Counter Details
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your fresh bao order will be ready at the {brandConfig.brandName || 'SYZLO'} Kitchen Hub counter in approx{' '}
                  <span className="font-bold text-syzlo-charcoal">15 minutes</span>.
                </p>
                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 text-xs">
                  <span className="font-bold text-syzlo-charcoal block">Pickup Kitchen Address:</span>
                  <span className="text-stone-600">{osmConfig.kitchenAddress || brandConfig.restaurantAddress}</span>
                </div>
              </div>
            )}

            {orderType === 'DINE-IN' && (
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
                <span className="text-xs font-extrabold text-olive-700 uppercase tracking-wider block">
                  3. Dine-In Table Selection
                </span>
                <label className="block text-xs font-bold text-stone-600">
                  Select your table number:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {['Table 01', 'Table 02', 'Table 03', 'Table 04', 'Table 05', 'Table 06'].map((tbl) => (
                    <button
                      key={tbl}
                      type="button"
                      onClick={() => setDineInTable(tbl)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                        dineInTable === tbl
                          ? 'bg-olive-500 text-white shadow-xs'
                          : 'bg-cream-100 text-stone-700 hover:bg-cream-200'
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Payment Gateways Settings from Admin */}
            <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
              <span className="text-xs font-extrabold text-olive-700 uppercase tracking-wider block">
                4. Select Payment Gateway & Method
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentGateways
                  .filter((g) => g.isEnabled)
                  .map((gateway) => {
                    const isSelected = selectedGatewayId === gateway.id;

                    const getGatewayIcon = (id: SupportedPaymentGateway) => {
                      if (id === 'RAZORPAY') return <CreditCard className="w-5 h-5 text-blue-600" />;
                      if (id === 'CASHFREE') return <Building className="w-5 h-5 text-emerald-600" />;
                      if (id === 'UPI_QR') return <QrCode className="w-5 h-5 text-purple-600" />;
                      return <Banknote className="w-5 h-5 text-amber-600" />;
                    };

                    return (
                      <div
                        key={gateway.id}
                        onClick={() => setSelectedGatewayId(gateway.id)}
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-olive-600 bg-olive-50/50 shadow-xs'
                            : 'border-cream-300 hover:border-cream-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-cream-200 flex items-center justify-center shrink-0">
                            {getGatewayIcon(gateway.id)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs sm:text-sm text-syzlo-charcoal block">
                                {gateway.name}
                              </span>
                              {gateway.isTestMode && (
                                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                                  Test
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500 block leading-tight">
                              {gateway.description}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-olive-600 bg-olive-600' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Gateway details helper */}
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex items-center gap-2 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  All payments are securely handled with 256-bit encryption compliant with RBI and ISO 27001 standards.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider block">
                Final Bill ({orderType})
              </span>

              {/* Items recap */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between text-xs py-1 border-b border-cream-100 last:border-none"
                  >
                    <div>
                      <span className="font-bold text-syzlo-charcoal">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.selectedAddOns.length > 0 && (
                        <span className="block text-[10px] text-stone-400">
                          +{item.selectedAddOns.map((a) => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-syzlo-charcoal">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-cream-200">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-syzlo-charcoal">₹{breakdown.itemTotal}</span>
                </div>

                {breakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>
                      Discount ({appliedCoupon?.code || 'OFFER'})
                      {appliedCoupon?.applicableMode && ` [${appliedCoupon.applicableMode}]`}
                    </span>
                    <span>-₹{breakdown.discount}</span>
                  </div>
                )}

                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-syzlo-charcoal">₹{breakdown.deliveryFee}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Govt GST (5%) & Packaging</span>
                  <span className="font-bold text-syzlo-charcoal">
                    ₹{breakdown.tax}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
                <div>
                  <span className="font-extrabold text-sm text-syzlo-charcoal block">Total Amount</span>
                  <span className="text-[10px] text-stone-400">Via {selectedGatewayId}</span>
                </div>
                <span className="text-2xl font-black text-syzlo-charcoal">
                  ₹{breakdown.grandTotal}
                </span>
              </div>

              {gatewayMessage && (
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0" />
                  <span>{gatewayMessage}</span>
                </div>
              )}

              <button
                type="button"
                id="place-order-final-btn"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 bg-olive-600 hover:bg-olive-700 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Secure Order...</span>
                ) : (
                  <>
                    <span>PAY & PLACE ORDER (₹{breakdown.grandTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
