import { useState } from 'react';
import { User, Building2, Mail, Phone, MapPin, Save, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const [role, setRole] = useState<'household' | 'business'>('household');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock Data
  const [householdData, setHouseholdData] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 234 567 8900',
  });

  const [businessData, setBusinessData] = useState({
    restaurantName: 'Burger King - Downtown',
    contactName: 'Sarah Smith',
    email: 'manager@bkdowntown.com',
    phone: '+1 987 654 3210',
    address: '123 Main St, Downtown',
    pickupPreference: 'Weekly',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Profile</h1>
        </div>
        <button className="text-gray-500 hover:text-red-600 transition-colors p-2">
          <LogOut size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Role Toggle (For Demo Purposes) */}
        <div className="bg-white p-1 rounded-xl flex border border-gray-200">
          <button 
            onClick={() => setRole('household')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${role === 'household' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Household View
          </button>
          <button 
            onClick={() => setRole('business')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${role === 'business' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Business View
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${role === 'household' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            {role === 'household' ? <User size={40} /> : <Building2 size={40} />}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {role === 'household' ? householdData.name : businessData.restaurantName}
          </h2>
          <p className="text-sm text-gray-500 capitalize">{role} Account</p>
        </div>

        {saved && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} />
            Profile updated successfully!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900">Account Details</h3>
            {!isEditing && (
              <button type="button" onClick={() => setIsEditing(true)} className="text-sm font-medium text-blue-600">
                Edit
              </button>
            )}
          </div>

          {role === 'household' ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={householdData.name}
                    onChange={(e) => setHouseholdData({...householdData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="email" 
                    value={householdData.email}
                    onChange={(e) => setHouseholdData({...householdData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="tel" 
                    value={householdData.phone}
                    onChange={(e) => setHouseholdData({...householdData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={businessData.restaurantName}
                    onChange={(e) => setBusinessData({...businessData, restaurantName: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={businessData.contactName}
                    onChange={(e) => setBusinessData({...businessData, contactName: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="email" 
                    value={businessData.email}
                    onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    disabled={!isEditing}
                    type="tel" 
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Business Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea 
                    disabled={!isEditing}
                    rows={2}
                    value={businessData.address}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Preference</label>
                <select 
                  disabled={!isEditing}
                  value={businessData.pickupPreference}
                  onChange={(e) => setBusinessData({...businessData, pickupPreference: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all appearance-none"
                >
                  <option value="On-Demand">On-Demand</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </>
          )}

          {isEditing && (
            <div className="pt-4 flex gap-3">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${role === 'household' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
