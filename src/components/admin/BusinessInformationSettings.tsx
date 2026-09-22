import React, { useEffect, useState } from 'react';
import {
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  IndianRupee,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BusinessSettings {
  id?: string;
  brand_name: string;
  legal_business_name: string;
  business_address: string;
  kitchen_address: string;
  phone: string;
  whatsapp: string;
  support_email: string;
  fssai_number: string;
  gstin: string;
  operating_hours: string;
  delivery_radius_km: string;
  minimum_order: string;
  delivery_charge: string;
}

const DEFAULT_SETTINGS: BusinessSettings = {
  brand_name: 'SYZLO',
  legal_business_name: '',
  business_address: '',
  kitchen_address: '',
  phone: '',
  whatsapp: '',
  support_email: '',
  fssai_number: '20326101003500',
  gstin: '',
  operating_hours: '',
  delivery_radius_km: '',
  minimum_order: '0',
  delivery_charge: '0',
};

const BusinessInformationSettings: React.FC = () => {
  const [settings, setSettings] =
    useState<BusinessSettings>(DEFAULT_SETTINGS);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          'Failed to load business settings:',
          error
        );
        return;
      }

      if (data) {
        setSettings({
          id: data.id,
          brand_name:
            data.brand_name || 'SYZLO',
          legal_business_name:
            data.legal_business_name || '',
          business_address:
            data.business_address || '',
          kitchen_address:
            data.kitchen_address || '',
          phone:
            data.phone || '',
          whatsapp:
            data.whatsapp || '',
          support_email:
            data.support_email || '',
          fssai_number:
            data.fssai_number || '20326101003500',
          gstin:
            data.gstin || '',
          operating_hours:
            data.operating_hours || '',
          delivery_radius_km:
            data.delivery_radius_km != null
              ? String(data.delivery_radius_km)
              : '',
          minimum_order:
            data.minimum_order != null
              ? String(data.minimum_order)
              : '0',
          delivery_charge:
            data.delivery_charge != null
              ? String(data.delivery_charge)
              : '0',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof BusinessSettings,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setMessage('');
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage('');

      const payload = {
        brand_name:
          settings.brand_name.trim(),

        legal_business_name:
          settings.legal_business_name.trim() ||
          null,

        business_address:
          settings.business_address.trim() ||
          null,

        kitchen_address:
          settings.kitchen_address.trim() ||
          null,

        phone:
          settings.phone.trim() ||
          null,

        whatsapp:
          settings.whatsapp.trim() ||
          null,

        support_email:
          settings.support_email.trim() ||
          null,

        fssai_number:
          settings.fssai_number.trim() ||
          null,

        gstin:
          settings.gstin.trim() ||
          null,

        operating_hours:
          settings.operating_hours.trim() ||
          null,

        delivery_radius_km:
          settings.delivery_radius_km
            ? Number(settings.delivery_radius_km)
            : null,

        minimum_order:
          settings.minimum_order
            ? Number(settings.minimum_order)
            : 0,

        delivery_charge:
          settings.delivery_charge
            ? Number(settings.delivery_charge)
            : 0,

        updated_at:
          new Date().toISOString(),
      };

      let error;

      if (settings.id) {
        const result = await supabase
          .from('business_settings')
          .update(payload)
          .eq('id', settings.id);

        error = result.error;
      } else {
        const result = await supabase
          .from('business_settings')
          .insert(payload)
          .select()
          .single();

        error = result.error;

        if (result.data) {
          setSettings((prev) => ({
            ...prev,
            id: result.data.id,
          }));
        }
      }

      if (error) {
        console.error(
          'Failed to save business settings:',
          error
        );

        setMessage(
          error.message ||
            'Failed to save settings.'
        );

        return;
      }

      setMessage(
        'Business information saved successfully.'
      );
    } catch (error) {
      console.error(
        'Business settings save failed:',
        error
      );

      setMessage(
        'Something went wrong while saving.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E5DDCE] p-8 text-center text-[#666]">
          Loading business information...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#20221A]">
          Business Information
        </h2>

        <p className="text-sm text-[#777] mt-1">
          Manage the business information displayed
          across SYZLO.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-[#E5DDCE] p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#7A7B26]/10 flex items-center justify-center">
            <Building2
              size={20}
              className="text-[#7A7B26]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#20221A]">
              Business Details
            </h3>
            <p className="text-xs text-[#888]">
              Basic information about SYZLO
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Brand Name"
            value={settings.brand_name}
            onChange={(value) =>
              updateField('brand_name', value)
            }
          />

          <Field
            label="Legal Business Name"
            value={settings.legal_business_name}
            onChange={(value) =>
              updateField(
                'legal_business_name',
                value
              )
            }
          />

          <Field
            label="Phone"
            value={settings.phone}
            onChange={(value) =>
              updateField('phone', value)
            }
            icon={<Phone size={16} />}
          />

          <Field
            label="WhatsApp"
            value={settings.whatsapp}
            onChange={(value) =>
              updateField('whatsapp', value)
            }
            icon={<Phone size={16} />}
          />

          <Field
            label="Support Email"
            value={settings.support_email}
            onChange={(value) =>
              updateField(
                'support_email',
                value
              )
            }
            icon={<Mail size={16} />}
          />

          <Field
            label="Operating Hours"
            value={settings.operating_hours}
            onChange={(value) =>
              updateField(
                'operating_hours',
                value
              )
            }
            icon={<Clock size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <TextAreaField
            label="Business Address"
            value={settings.business_address}
            onChange={(value) =>
              updateField(
                'business_address',
                value
              )
            }
            icon={<MapPin size={16} />}
          />

          <TextAreaField
            label="Kitchen Address"
            value={settings.kitchen_address}
            onChange={(value) =>
              updateField(
                'kitchen_address',
                value
              )
            }
            icon={<MapPin size={16} />}
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5DDCE] p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#7A7B26]/10 flex items-center justify-center">
            <ShieldCheck
              size={20}
              className="text-[#7A7B26]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#20221A]">
              Compliance Information
            </h3>
            <p className="text-xs text-[#888]">
              Registration and tax information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="FSSAI License Number"
            value={settings.fssai_number}
            onChange={(value) =>
              updateField(
                'fssai_number',
                value
              )
            }
          />

          <Field
            label="GSTIN"
            value={settings.gstin}
            onChange={(value) =>
              updateField('gstin', value)
            }
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5DDCE] p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#7A7B26]/10 flex items-center justify-center">
            <Truck
              size={20}
              className="text-[#7A7B26]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#20221A]">
              Delivery Settings
            </h3>
            <p className="text-xs text-[#888]">
              Basic delivery configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberField
            label="Delivery Radius (km)"
            value={settings.delivery_radius_km}
            onChange={(value) =>
              updateField(
                'delivery_radius_km',
                value
              )
            }
          />

          <NumberField
            label="Minimum Order (₹)"
            value={settings.minimum_order}
            onChange={(value) =>
              updateField(
                'minimum_order',
                value
              )
            }
          />

          <NumberField
            label="Delivery Charge (₹)"
            value={settings.delivery_charge}
            onChange={(value) =>
              updateField(
                'delivery_charge',
                value
              )
            }
          />
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm">
          {message && (
            <span
              className={
                message.includes('successfully')
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {message}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#7A7B26] text-white font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <Save size={18} />

          {saving
            ? 'Saving...'
            : 'Save Business Information'}
        </button>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  icon,
}) => (
  <label className="block">
    <span className="block text-sm font-medium text-[#333] mb-1.5">
      {label}
    </span>

    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]">
          {icon}
        </span>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full rounded-xl border border-[#DDD4C4] bg-[#FFFCF7] px-3 py-3 text-sm outline-none focus:border-[#7A7B26] ${
          icon ? 'pl-10' : ''
        }`}
      />
    </div>
  </label>
);

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const TextAreaField: React.FC<
  TextAreaFieldProps
> = ({
  label,
  value,
  onChange,
  icon,
}) => (
  <label className="block">
    <span className="block text-sm font-medium text-[#333] mb-1.5">
      {label}
    </span>

    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-3 text-[#888]">
          {icon}
        </span>
      )}

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={3}
        className={`w-full rounded-xl border border-[#DDD4C4] bg-[#FFFCF7] px-3 py-3 text-sm outline-none focus:border-[#7A7B26] resize-none ${
          icon ? 'pl-10' : ''
        }`}
      />
    </div>
  </label>
);

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const NumberField: React.FC<
  NumberFieldProps
> = ({
  label,
  value,
  onChange,
}) => (
  <label className="block">
    <span className="block text-sm font-medium text-[#333] mb-1.5">
      {label}
    </span>

    <div className="relative">
      <IndianRupee
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"
      />

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-[#DDD4C4] bg-[#FFFCF7] pl-10 pr-3 py-3 text-sm outline-none focus:border-[#7A7B26]"
      />
    </div>
  </label>
);

export default BusinessInformationSettings;
