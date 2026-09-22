import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Coupon,
  CustomerOrder,
  CustomerProfile,
  DeliveryAddress,
  FoodCategory,
  MenuItem,
  OrderStatus,
  OrderType,
  Rider,
  StaffMember,
  HeroBanner,
  CategoryConfig,
  GlobalAddon,
  PaymentGatewayConfig,
  AppBrandConfig,
  OsmMapConfig,
} from '../types';
import {
  INITIAL_COUPONS,
  INITIAL_CUSTOMER_PROFILE,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_RIDERS,
  INITIAL_STAFF,
  INITIAL_HERO_BANNERS,
  INITIAL_CATEGORIES_CONFIG,
  INITIAL_GLOBAL_ADDONS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_BRAND_CONFIG,
  INITIAL_OSM_CONFIG,
  RESTAURANT_LOCATION,
} from '../data/mockData';
import { orderService } from '../services/orderService';
import { soundService } from '../services/soundService';
import { supabase } from '../lib/supabase';
export type AppView = 'customer' | 'admin' | 'kds' | 'pos' | 'rider';
export type CustomerScreen = 'home' | 'menu' | 'cart' | 'checkout' | 'tracking' | 'orders' | 'profile' | 'offers';
export type AdminScreen =
  | 'dashboard'
  | 'orders'
  | 'kitchen'
  | 'pos'
  | 'menu'
  | 'categories'
  | 'banners'
  | 'addons'
  | 'coupons'
  | 'gateways'
  | 'map-osm'
  | 'brand'
  | 'customers'
  | 'riders'
  | 'staff'
  | 'reports';

interface AppContextType {
  // Navigation & Views
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  customerScreen: CustomerScreen;
  setCustomerScreen: (screen: CustomerScreen) => void;
  adminScreen: AdminScreen;
  setAdminScreen: (screen: AdminScreen) => void;

  // Selected Order for Tracking or Inspection
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (orderId: string | null) => void;

  // Customer Filtering & Order Flow
  selectedCategory: FoodCategory;
  setSelectedCategory: (cat: FoodCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;

  // Cart & Modifiers
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, addOns?: { id: string; name: string; price: number }[], instructions?: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string, activeOrderType?: OrderType) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Customization Bottom Sheet Modal
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;

  // Core Data Collections
  menuItems: MenuItem[];
  orders: CustomerOrder[];
  riders: Rider[];
  coupons: Coupon[];
  staff: StaffMember[];
  customerProfile: CustomerProfile;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => void;
  addCustomerAddress: (address: DeliveryAddress) => void;
  updateCustomerAddress: (id: string, updates: Partial<DeliveryAddress>) => void;
  deleteCustomerAddress: (id: string) => void;

  // Demo staff access gate. Not production authentication.
  isStaffAuthenticated: boolean;
  setIsStaffAuthenticated: (auth: boolean) => void;
verifyStaffPin: (email: string, password: string) => Promise<boolean>;
  // Dynamic Content & Settings
 heroBanners: HeroBanner[];
addHeroBanner: (banner: Omit<HeroBanner, 'id'>) => Promise<void>;
updateHeroBanner: (id: string, updates: Partial<HeroBanner>) => Promise<void>;
deleteHeroBanner: (id: string) => Promise<void>;
toggleHeroBannerStatus: (id: string) => Promise<void>;
  
  categoriesConfig: CategoryConfig[];
 updateCategoryConfig: (
  id: string,
  updates: Partial<CategoryConfig>
) => Promise<void>;

  globalAddons: GlobalAddon[];
  addGlobalAddon: (addon: Omit<GlobalAddon, 'id'>) => void;
  updateGlobalAddon: (id: string, updates: Partial<GlobalAddon>) => void;
  deleteGlobalAddon: (id: string) => void;
  toggleAddonAvailability: (id: string) => void;

  paymentGateways: PaymentGatewayConfig[];
  updatePaymentGateway: (id: string, updates: Partial<PaymentGatewayConfig>) => void;
  togglePaymentGateway: (id: string) => void;

  brandConfig: AppBrandConfig;
  updateBrandConfig: (updates: Partial<AppBrandConfig>) => void;

  osmConfig: OsmMapConfig;
  updateOsmConfig: (updates: Partial<OsmMapConfig>) => void;

  // Order Operations
  placeCustomerOrder: (orderPayload: Partial<CustomerOrder>) => CustomerOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignRider: (orderId: string, riderId: string) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

 // Rider Operations
activeRiderId: string;
setActiveRiderId: (id: string) => void;

addRider: (rider: {
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber?: string;
}) => Promise<void>;

updateRider: (
  riderId: string,
  updates: {
    name?: string;
    phone?: string;
    vehicle?: string;
    vehicleNumber?: string;
  }
) => Promise<void>;

deleteRider: (riderId: string) => Promise<void>;

updateRiderLocation: (
  riderId: string,
  coords: { lat: number; lng: number }
) => void;

toggleRiderStatus: (
  riderId: string,
  status: 'ONLINE' | 'OFFLINE' | 'BUSY'
) => void;

toggleRiderAvailability: (
  riderId: string,
  isAvailable: boolean
) => Promise<void>;
  
  // Menu Operations
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  toggleItemAvailability: (id: string) => void;
  deleteMenuItem: (id: string) => void;

  // Coupon Operations
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponStatus: (code: string) => void;

  // Audio / KDS Controls
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('customer');
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('home');
  const [adminScreen, setAdminScreen] = useState<AdminScreen>('dashboard');

  // Active tracking
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('SYZ/09/18/02');

  // Customer filters
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');

  // Customizing Bottom Sheet modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Entities
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
 useEffect(() => {
  const loadMenuFromSupabase = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('SUPABASE SESSION:', session);
  console.log('SUPABASE USER:', session?.user?.email);

  const { data, error } = await supabase
    .from('menu_items')
      .select(`
        id,
        name,
        description,
        image_url,
        price,
        is_veg,
        is_available,
        is_featured,
        sort_order,
        categories (
          name,
          slug
        )
      `)
      .eq('is_available', true);

    if (error) {
      console.error('Failed to load menu from Supabase:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase menu_items is empty.');
      return;
    }

    const { data: addonRelations, error: addonError } = await supabase
      .from('menu_item_addons')
      .select(`
        menu_item_id,
        addons (
          id,
          name,
          price
        )
      `);

    if (addonError) {
      console.error('Failed to load menu add-ons from Supabase:', addonError);
    }

    const categoryOrder: Record<string, number> = {
      BAO: 1,
      COMBOS: 2,
      DRINKS: 3,
      CHINESE: 4,
      STARTERS: 5,
    };

    data.sort((a: any, b: any) => {
      const categoryA =
        categoryOrder[a.categories?.slug?.toUpperCase()] ?? 99;

      const categoryB =
        categoryOrder[b.categories?.slug?.toUpperCase()] ?? 99;

      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }

      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
    });

    const supabaseMenu: MenuItem[] = data.map((item: any) => {
      const categorySlug = item.categories?.slug?.toUpperCase();

      const category =
        categorySlug === 'BAO' ||
        categorySlug === 'COMBOS' ||
        categorySlug === 'CHINESE' ||
        categorySlug === 'STARTERS' ||
        categorySlug === 'DRINKS'
          ? categorySlug
          : 'CHINESE';

      return {
        id: item.id,
        name: item.name,
        category,
        description: item.description || '',
        price: Number(item.price) || 0,
        rating: 0,
        reviewsCount: 0,
        isVeg: Boolean(item.is_veg),
        isBestseller: Boolean(item.is_featured),
        image: item.image_url || '',
        addOns: (addonRelations || [])
          .filter(
            (relation: any) =>
              relation.menu_item_id === item.id
          )
          .map((relation: any) => relation.addons)
          .filter(Boolean)
          .map((addon: any) => ({
            id: addon.id,
            name: addon.name,
            price: Number(addon.price) || 0,
          })),
        isAvailable: Boolean(item.is_available),
      };
    });

    console.log(
      'Supabase menu loaded:',
      supabaseMenu.length,
      'items'
    );

    setMenuItems(supabaseMenu);
  };

loadMenuFromSupabase();

const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
    setTimeout(() => {
      loadMenuFromSupabase();
    }, 0);
  }
});

return () => {
  subscription.unsubscribe();
};
}, []);
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  useEffect(() => {
  const loadRidersFromSupabase = async () => {
    const { data, error } = await supabase
      .from('riders')
      .select(`
        id,
        user_id,
        name,
        phone,
        vehicle_type,
        vehicle_number,
        is_online,
        is_available,
        current_latitude,
        current_longitude,
        status
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load riders from Supabase:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase riders table is empty.');
      return;
    }

    const supabaseRiders: Rider[] = data.map((rider: any) => ({
      id: String(rider.id),
      userId: rider.user_id || undefined,
      name: rider.name || '',
      phone: rider.phone || '',
      vehicle: rider.vehicle_type || 'Scooter',
      vehicleNumber: rider.vehicle_number || '',
      status:
        String(rider.status || 'offline').toUpperCase() as
          | 'ONLINE'
          | 'OFFLINE'
          | 'BUSY',
      isAvailable: Boolean(rider.is_available),
      currentOrderId: undefined,

      // Kept only for compatibility.
      // SYZLO does not use live rider tracking.
      location: {
        lat: Number(rider.current_latitude || 0),
        lng: Number(rider.current_longitude || 0),
      },

      completedDeliveries: 0,
      totalDeliveries: 0,
      rating: 0,
      batteryLevel: undefined,
    }));

    console.log(
      'Supabase riders loaded:',
      supabaseRiders.length,
      supabaseRiders
    );

    setRiders(supabaseRiders);
  };

  loadRidersFromSupabase();
}, []);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(INITIAL_CUSTOMER_PROFILE);

 // Supabase staff authentication
const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(false);

const verifyStaffPin = async (
  email: string,
  password: string
): Promise<boolean> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    console.error('Admin login failed:', error);
    return false;
  }

  setIsStaffAuthenticated(true);
  return true;
};
  const updateCustomerProfile = (updates: Partial<CustomerProfile>) => {
    setCustomerProfile((prev) => ({ ...prev, ...updates }));
  };

  const addCustomerAddress = (address: DeliveryAddress) => {
    const newId = address.id || `addr-${Date.now()}`;
    setCustomerProfile((prev) => ({
      ...prev,
      addresses: [{ ...address, id: newId }, ...prev.addresses],
    }));
  };

  const updateCustomerAddress = (id: string, updates: Partial<DeliveryAddress>) => {
    setCustomerProfile((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) => (addr.id === id ? { ...addr, ...updates } : addr)),
    }));
  };

  const deleteCustomerAddress = (id: string) => {
    setCustomerProfile((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== id),
    }));
  };

  // Dynamic configurations
 const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
const [categoriesConfig, setCategoriesConfig] = useState<CategoryConfig[]>([]);

useEffect(() => {
  const loadHeroBannersFromSupabase = async () => {
    const { data, error } = await supabase
      .from('hero_banners')
      .select(`
        id,
        created_at,
        badge,
        title,
        subtitle,
        coupon_code,
        image_url,
        button_text,
        button_link,
        cta_category,
        bg_color,
        is_active,
        sort_order
      `)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error('Failed to load hero banners from Supabase:', error);
      return;
    }

    if (!data) {
      return;
    }

    const supabaseHeroBanners: HeroBanner[] = data.map((banner: any) => ({
      id: String(banner.id),
      badge: banner.badge || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      couponCode: banner.coupon_code || undefined,
      imageUrl: banner.image_url || '',
      ctaText: banner.button_text || 'Order Now',
      ctaCategory: banner.cta_category || 'BAO',
      bgColor:
        banner.bg_color ||
        'from-[#20221A] via-[#2D3021] to-[#393D28]',
      isActive: Boolean(banner.is_active),
    }));

    console.log(
      'HERO BANNERS FROM SUPABASE:',
      supabaseHeroBanners
    );

    setHeroBanners(supabaseHeroBanners);
  };

  loadHeroBannersFromSupabase();
}, []);

useEffect(() => {
  const loadCategoriesFromSupabase = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        image_url,
        is_active,
        sort_order
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to load categories from Supabase:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase categories is empty.');
      return;
    }

    const supabaseCategories: CategoryConfig[] = data.map((category: any) => ({
      id: category.slug.toUpperCase(),
      name: category.name,
      description: category.description || '',
      icon:
        category.slug === 'bao'
          ? '🥟'
          : category.slug === 'combos'
          ? '🍱'
          : category.slug === 'chinese'
          ? '🍜'
          : category.slug === 'drinks'
          ? '🥤'
          : category.slug === 'starters'
          ? '🍟'
          : '🍽️',
      image: category.image_url || '',
      isActive: Boolean(category.is_active),
    }));
console.log('CATEGORY IMAGES FROM SUPABASE:', supabaseCategories);
    console.log(
      'Supabase categories loaded:',
      supabaseCategories
    );

    setCategoriesConfig(supabaseCategories);
  };

  loadCategoriesFromSupabase();
}, []);
  const [globalAddons, setGlobalAddons] = useState<GlobalAddon[]>(INITIAL_GLOBAL_ADDONS);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(INITIAL_PAYMENT_GATEWAYS);
  const [brandConfig, setBrandConfig] = useState<AppBrandConfig>(INITIAL_BRAND_CONFIG);
  const [osmConfig, setOsmConfig] = useState<OsmMapConfig>(INITIAL_OSM_CONFIG);

  // Active rider profile for the Rider App view
  const [activeRiderId, setActiveRiderId] = useState<string>('RDR-01');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Sound
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Continuous alert for KDS when there are pending NEW orders
  useEffect(() => {
    const hasUnacceptedOrders = orders.some((o) => o.status === 'ORDER_PLACED');
    if (hasUnacceptedOrders && currentView === 'kds' && !isAudioMuted) {
      soundService.startContinuousAlert();
    } else {
      soundService.stopContinuousAlert();
    }
  }, [orders, currentView, isAudioMuted]);

  const toggleAudioMute = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    soundService.setMuted(nextState);
  };

  // Cart actions
  const addToCart = (
    item: MenuItem,
    quantity: number,
    addOns: { id: string; name: string; price: number }[] = [],
    instructions?: string
  ) => {
    soundService.playChime('pop');
    setCart((prev) => {
      const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = item.price + addOnsTotal;

      // Unique hash for items with same addOns & instructions
      const addOnKey = addOns.map((a) => a.id).sort().join('-');
      const matchIndex = prev.findIndex(
        (ci) =>
          ci.menuItem.id === item.id &&
          ci.specialInstructions === (instructions || '') &&
          ci.selectedAddOns.map((a) => a.id).sort().join('-') === addOnKey
      );

      if (matchIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[matchIndex].quantity + quantity;
        updated[matchIndex] = {
          ...updated[matchIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItem: item,
          quantity,
          selectedAddOns: addOns,
          specialInstructions: instructions,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => {
        if (ci.cartItemId === cartItemId) {
          return {
            ...ci,
            quantity: newQty,
            totalPrice: ci.unitPrice * newQty,
          };
        }
        return ci;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string, activeOrderType?: OrderType): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === trimmed);

    if (!found || (!found.active && found.isActive === false)) {
      return { success: false, message: 'Invalid or inactive coupon code' };
    }

    const currentMode = activeOrderType || orderType;
    if (found.applicableMode && found.applicableMode !== 'ALL' && found.applicableMode !== currentMode) {
      return {
        success: false,
        message: `Coupon "${found.code}" is valid only for ${found.applicableMode} orders. (Current mode is ${currentMode})`,
      };
    }

    const currentTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    if (currentTotal < found.minOrder) {
      return {
        success: false,
        message: `Add items worth ₹${found.minOrder - currentTotal} more to apply ${found.code}`,
      };
    }

    setAppliedCoupon(found);
    soundService.playChime('success');
    return { success: true, message: `${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

 // Content & Settings handlers
const addHeroBanner = async (
  banner: Omit<HeroBanner, 'id'>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert({
        badge: banner.badge || '',
        title: banner.title,
        subtitle: banner.subtitle || '',
        coupon_code: banner.couponCode || null,
        image_url: banner.imageUrl,
        button_text: banner.ctaText || 'Order Now',
        button_link: null,
        cta_category: banner.ctaCategory || 'BAO',
        bg_color:
          banner.bgColor ||
          'from-[#20221A] via-[#2D3021] to-[#393D28]',
        is_active: banner.isActive !== false,
        sort_order: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add hero banner:', error);
      throw error;
    }

    const newBanner: HeroBanner = {
      id: String(data.id),
      badge: data.badge || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      couponCode: data.coupon_code || undefined,
      imageUrl: data.image_url || '',
      ctaText: data.button_text || 'Order Now',
      ctaCategory: data.cta_category || 'BAO',
      bgColor:
        data.bg_color ||
        'from-[#20221A] via-[#2D3021] to-[#393D28]',
      isActive: Boolean(data.is_active),
    };

    setHeroBanners((prev) => [newBanner, ...prev]);
  } catch (error) {
    console.error('Add hero banner failed:', error);
    throw error;
  }
};

const updateHeroBanner = async (
  id: string,
  updates: Partial<HeroBanner>
): Promise<void> => {
  try {
    const dbUpdates: Record<string, any> = {};

    if (updates.badge !== undefined) {
      dbUpdates.badge = updates.badge;
    }

    if (updates.title !== undefined) {
      dbUpdates.title = updates.title;
    }

    if (updates.subtitle !== undefined) {
      dbUpdates.subtitle = updates.subtitle;
    }

    if (updates.couponCode !== undefined) {
      dbUpdates.coupon_code = updates.couponCode || null;
    }

    if (updates.imageUrl !== undefined) {
      dbUpdates.image_url = updates.imageUrl;
    }

    if (updates.ctaText !== undefined) {
      dbUpdates.button_text = updates.ctaText;
    }

    if (updates.ctaCategory !== undefined) {
      dbUpdates.cta_category = updates.ctaCategory;
    }

    if (updates.bgColor !== undefined) {
      dbUpdates.bg_color = updates.bgColor;
    }

    if (updates.isActive !== undefined) {
      dbUpdates.is_active = updates.isActive;
    }

    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      throw new Error(`Invalid hero banner ID: ${id}`);
    }

    const { error } = await supabase
      .from('hero_banners')
      .update(dbUpdates)
      .eq('id', numericId);

    if (error) {
      console.error('Failed to update hero banner:', error);
      throw error;
    }

    setHeroBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? { ...banner, ...updates }
          : banner
      )
    );
  } catch (error) {
    console.error('Update hero banner failed:', error);
    throw error;
  }
};

const deleteHeroBanner = async (
  id: string
): Promise<void> => {
  try {
    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      throw new Error(`Invalid hero banner ID: ${id}`);
    }

    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', numericId);

    if (error) {
      console.error('Failed to delete hero banner:', error);
      throw error;
    }

    setHeroBanners((prev) =>
      prev.filter((banner) => banner.id !== id)
    );
  } catch (error) {
    console.error('Delete hero banner failed:', error);
    throw error;
  }
};

const toggleHeroBannerStatus = async (
  id: string
): Promise<void> => {
  try {
    const banner = heroBanners.find(
      (item) => item.id === id
    );

    if (!banner) {
      throw new Error(`Hero banner not found: ${id}`);
    }

    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      throw new Error(`Invalid hero banner ID: ${id}`);
    }

    const newStatus = !banner.isActive;

    const { error } = await supabase
      .from('hero_banners')
      .update({
        is_active: newStatus,
      })
      .eq('id', numericId);

    if (error) {
      console.error(
        'Failed to toggle hero banner status:',
        error
      );
      throw error;
    }

    setHeroBanners((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isActive: newStatus }
          : item
      )
    );
  } catch (error) {
    console.error(
      'Toggle hero banner status failed:',
      error
    );
    throw error;
  }
};
  const updateCategoryConfig = async (
  id: string,
  updates: Partial<CategoryConfig>
) => {
  try {
    const dbUpdates: Record<string, any> = {};

    if (updates.name !== undefined) {
      dbUpdates.name = updates.name;
    }

    if (updates.description !== undefined) {
      dbUpdates.description = updates.description;
    }

    if (updates.image !== undefined) {
      dbUpdates.image_url = updates.image;
    }

    if (updates.isActive !== undefined) {
      dbUpdates.is_active = updates.isActive;
    }

    const { error } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('slug', id.toLowerCase());

    if (error) {
      console.error('Failed to update category:', error);
      throw error;
    }

    setCategoriesConfig((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      )
    );
  } catch (error) {
    console.error('Update category failed:', error);
    throw error;
  }
};
  const addGlobalAddon = (addon: Omit<GlobalAddon, 'id'>) => {
    const id = `ga-${Date.now()}`;
    setGlobalAddons((prev) => [...prev, { ...addon, id }]);
  };

  const updateGlobalAddon = (id: string, updates: Partial<GlobalAddon>) => {
    setGlobalAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteGlobalAddon = (id: string) => {
    setGlobalAddons((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAddonAvailability = (id: string) => {
    setGlobalAddons((prev) => prev.map((a) => (a.id === id ? { ...a, isAvailable: !a.isAvailable } : a)));
  };

  const updatePaymentGateway = (id: string, updates: Partial<PaymentGatewayConfig>) => {
    setPaymentGateways((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const togglePaymentGateway = (id: string) => {
    setPaymentGateways((prev) => prev.map((g) => (g.id === id ? { ...g, isEnabled: !g.isEnabled } : g)));
  };

  const updateBrandConfig = (updates: Partial<AppBrandConfig>) => {
    setBrandConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateOsmConfig = (updates: Partial<OsmMapConfig>) => {
    setOsmConfig((prev) => ({ ...prev, ...updates }));
  };

  // Order Placement
  const placeCustomerOrder = (orderPayload: Partial<CustomerOrder>): CustomerOrder => {
    const isPOS = orderPayload.source === 'POS';
    const orderId = orderPayload.id || orderService.generateOrderId(isPOS);
    const orderItems = orderPayload.items && orderPayload.items.length > 0 ? orderPayload.items : cart;

    const breakdown = orderService.calculateOrderBreakdown(
      orderItems,
      orderPayload.orderType || orderType,
      appliedCoupon,
      orderPayload.deliveryFee ?? 40,
      brandConfig
    );

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: CustomerOrder = {
      id: orderId,
      source: orderPayload.source || 'ONLINE',
      orderType: orderPayload.orderType || orderType,
      items: orderItems,
      itemTotal: breakdown.itemTotal,
      discount: breakdown.discount,
      deliveryFee: breakdown.deliveryFee,
      packagingFee: breakdown.packagingFee,
      tax: breakdown.tax,
      grandTotal: breakdown.grandTotal,
      couponCode: appliedCoupon?.code,
      paymentMethod: orderPayload.paymentMethod || 'UPI',
      paymentStatus: 'PAID',
      status: 'ORDER_PLACED',
      createdAt: now.toISOString(),
      customerName: orderPayload.customerName || customerProfile.name,
      customerPhone: orderPayload.customerPhone || customerProfile.phone,
      deliveryAddress: orderPayload.deliveryAddress,
      dineInTable: orderPayload.dineInTable,
      specialInstructions: orderPayload.specialInstructions,
      estimatedMinutes: orderPayload.orderType === 'DELIVERY' ? 30 : 15,
      logs: [
        {
          status: 'ORDER_PLACED',
          timestamp: timeFormatted,
          note: `Order placed via ${orderPayload.source || 'ONLINE'} (${orderPayload.paymentMethod || 'UPI'})`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    soundService.playChime('success');

    if (!isPOS) {
      clearCart();
      setActiveTrackingOrderId(orderId);
      setCustomerScreen('tracking');
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedLogs = [
            ...ord.logs,
            { status, timestamp: timeFormatted, note: note || `Status updated to ${status}` },
          ];

          return {
            ...ord,
            status,
            logs: updatedLogs,
          };
        }
        return ord;
      })
    );

    soundService.playChime('pop');
  };

  const assignRider = (orderId: string, riderId: string) => {
    const targetRider = riders.find((r) => r.id === riderId);
    if (!targetRider) return;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const now = new Date();
          const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            status: 'RIDER_ASSIGNED',
            riderId: targetRider.id,
            riderName: targetRider.name,
            riderPhone: targetRider.phone,
            riderLocation: { ...targetRider.location },
            logs: [
              ...ord.logs,
              { status: 'RIDER_ASSIGNED', timestamp: timeFormatted, note: `Assigned to rider ${targetRider.name}` },
            ],
          };
        }
        return ord;
      })
    );

    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status: 'BUSY', currentOrderId: orderId } : r))
    );

    soundService.playChime('alert');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'CANCELLED',
            logs: [
              ...ord.logs,
              { status: 'CANCELLED', timestamp: timeFormatted, note: reason || 'Order cancelled' },
            ],
          };
        }
        return ord;
      })
    );
  };
// Rider CRUD
const addRider = async (rider: {
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('riders')
      .insert({
        name: rider.name.trim(),
        phone: rider.phone.trim(),
        vehicle_type: rider.vehicle.trim() || 'Scooter',
        vehicle_number: rider.vehicleNumber?.trim() || null,
        is_online: false,
        is_available: true,
        status: 'offline',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add rider:', error);
      throw error;
    }

    const newRider: Rider = {
      id: String(data.id),
      userId: data.user_id || undefined,
      name: data.name,
      phone: data.phone,
      vehicle: data.vehicle_type || 'Scooter',
      vehicleNumber: data.vehicle_number || '',
      status: 'OFFLINE',
      isAvailable: Boolean(data.is_available),
      currentOrderId: undefined,

      // Not used for live tracking.
      location: {
        lat: Number(data.current_latitude || 0),
        lng: Number(data.current_longitude || 0),
      },

      completedDeliveries: 0,
      totalDeliveries: 0,
      rating: 0,
    };

    setRiders((prev) => [...prev, newRider]);
  } catch (error) {
    console.error('Add rider failed:', error);
    throw error;
  }
};

const updateRider = async (
  riderId: string,
  updates: {
    name?: string;
    phone?: string;
    vehicle?: string;
    vehicleNumber?: string;
  }
) => {
  try {
    const dbUpdates: Record<string, any> = {};

    if (updates.name !== undefined) {
      dbUpdates.name = updates.name.trim();
    }

    if (updates.phone !== undefined) {
      dbUpdates.phone = updates.phone.trim();
    }

    if (updates.vehicle !== undefined) {
      dbUpdates.vehicle_type = updates.vehicle.trim();
    }

    if (updates.vehicleNumber !== undefined) {
      dbUpdates.vehicle_number =
        updates.vehicleNumber.trim() || null;
    }

    const { error } = await supabase
      .from('riders')
      .update(dbUpdates)
      .eq('id', riderId);

    if (error) {
      console.error('Failed to update rider:', error);
      throw error;
    }

    setRiders((prev) =>
      prev.map((rider) =>
        rider.id === riderId
          ? {
              ...rider,
              ...(updates.name !== undefined
                ? { name: updates.name }
                : {}),
              ...(updates.phone !== undefined
                ? { phone: updates.phone }
                : {}),
              ...(updates.vehicle !== undefined
                ? { vehicle: updates.vehicle }
                : {}),
              ...(updates.vehicleNumber !== undefined
                ? { vehicleNumber: updates.vehicleNumber }
                : {}),
            }
          : rider
      )
    );
  } catch (error) {
    console.error('Update rider failed:', error);
    throw error;
  }
};

const deleteRider = async (riderId: string) => {
  try {
    const { error } = await supabase
      .from('riders')
      .delete()
      .eq('id', riderId);

    if (error) {
      console.error('Failed to delete rider:', error);
      throw error;
    }

    setRiders((prev) =>
      prev.filter((rider) => rider.id !== riderId)
    );
  } catch (error) {
    console.error('Delete rider failed:', error);
    throw error;
  }
};

const toggleRiderAvailability = async (
  riderId: string,
  isAvailable: boolean
) => {
  try {
    const { error } = await supabase
      .from('riders')
      .update({
        is_available: isAvailable,
      })
      .eq('id', riderId);

    if (error) {
      console.error(
        'Failed to update rider availability:',
        error
      );
      throw error;
    }

    setRiders((prev) =>
      prev.map((rider) =>
        rider.id === riderId
          ? {
              ...rider,
              isAvailable,
            }
          : rider
      )
    );
  } catch (error) {
    console.error(
      'Toggle rider availability failed:',
      error
    );
    throw error;
  }
};
  // Rider updates
  const updateRiderLocation = (riderId: string, coords: { lat: number; lng: number }) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, location: coords } : r))
    );

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.riderId === riderId) {
          return {
            ...ord,
            riderLocation: coords,
          };
        }
        return ord;
      })
    );
  };

  const toggleRiderStatus = (riderId: string, status: 'ONLINE' | 'OFFLINE' | 'BUSY') => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status } : r))
    );
  };

 // Menu updates
const getCategoryId = async (category: FoodCategory) => {
  const slug = category.toLowerCase();

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Failed to find category:', error);
    throw error;
  }

  return data.id;
};

const createMenuSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  try {
    const categoryId = await getCategoryId(item.category);

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: item.name,
        slug: createMenuSlug(item.name),
        description: item.description || '',
        image_url: item.image || '',
        price: item.price,
        is_veg: item.isVeg,
        is_available: item.isAvailable,
        is_featured: Boolean(item.isBestseller),
        category_id: categoryId,
        sort_order: 999,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add menu item:', error);
      throw error;
    }
    
    const newItem: MenuItem = {
      ...item,
      id: data.id,
      image: data.image_url || '',
      isAvailable: Boolean(data.is_available),
      isBestseller: Boolean(data.is_featured),
      addOns: [],
    };

    setMenuItems((prev) => [newItem, ...prev]);
} catch (error) {
  console.error('Add menu item failed:', error);
  throw error;
}
};

const updateMenuItem = async (
  id: string,
  updates: Partial<MenuItem>
) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error(
      'This menu item is still using demo data. Please refresh the menu from Supabase before editing it.'
    );
  }

  try {
    const dbUpdates: Record<string, any> = {};

    if (updates.name !== undefined) {
      dbUpdates.name = updates.name;
      dbUpdates.slug = createMenuSlug(updates.name);
    }

    if (updates.description !== undefined) {
      dbUpdates.description = updates.description;
    }

    if (updates.price !== undefined) {
      dbUpdates.price = updates.price;
    }

    if (updates.image !== undefined) {
      dbUpdates.image_url = updates.image;
    }

    if (updates.isVeg !== undefined) {
      dbUpdates.is_veg = updates.isVeg;
    }

    if (updates.isAvailable !== undefined) {
      dbUpdates.is_available = updates.isAvailable;
    }

    if (updates.isBestseller !== undefined) {
      dbUpdates.is_featured = updates.isBestseller;
    }

    if (updates.category !== undefined) {
      dbUpdates.category_id = await getCategoryId(updates.category);
    }

    const { error } = await supabase
      .from('menu_items')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Failed to update menu item:', error);
      throw error;
    }

    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  } catch (error) {
    console.error('Update menu item failed:', error);
    throw error;
  }
};

const toggleItemAvailability = async (id: string) => {
  try {
    const currentItem = menuItems.find((item) => item.id === id);

    if (!currentItem) return;

    const newAvailability = !currentItem.isAvailable;

    const { error } = await supabase
      .from('menu_items')
      .update({
        is_available: newAvailability,
      })
      .eq('id', id);

    if (error) {
      console.error('Failed to update availability:', error);
      throw error;
    }

    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isAvailable: newAvailability }
          : item
      )
    );
  } catch (error) {
    console.error('Toggle availability failed:', error);
  }
};

const deleteMenuItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete menu item:', error);
      throw error;
    }

    setMenuItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  } catch (error) {
    console.error('Delete menu item failed:', error);
  }
};
  // Coupon updates
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active, isActive: !c.active } : c))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        customerScreen,
        setCustomerScreen,
        adminScreen,
        setAdminScreen,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        orderType,
        setOrderType,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        customizingItem,
        setCustomizingItem,
        menuItems,
        orders,
        riders,
        coupons,
        staff,
        customerProfile,
        updateCustomerProfile,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        isStaffAuthenticated,
        setIsStaffAuthenticated,
        verifyStaffPin,
        heroBanners,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        toggleHeroBannerStatus,
        categoriesConfig,
        updateCategoryConfig,
        globalAddons,
        addGlobalAddon,
        updateGlobalAddon,
        deleteGlobalAddon,
        toggleAddonAvailability,
        paymentGateways,
        updatePaymentGateway,
        togglePaymentGateway,
        brandConfig,
        updateBrandConfig,
        osmConfig,
        updateOsmConfig,
        placeCustomerOrder,
        updateOrderStatus,
        assignRider,
        assignRiderToOrder: assignRider,
        cancelOrder,
       activeRiderId,
setActiveRiderId,
addRider,
updateRider,
deleteRider,
updateRiderLocation,
toggleRiderStatus,
toggleRiderAvailability,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        isAudioMuted,
        toggleAudioMute,
      }}
    >
      {children}
        </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};
