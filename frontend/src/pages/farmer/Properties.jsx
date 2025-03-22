import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function Properties() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Properties</h2>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: "North Farm",
            area: "5.5 acres",
            location: "Punjab",
            soilType: "Alluvial",
            value: "₹2,500,000"
          },
          {
            id: 2,
            name: "South Plot",
            area: "3.2 acres",
            location: "Haryana",
            soilType: "Black",
            value: "₹1,800,000"
          }
        ].map(property => (
          <div key={property.id} className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-800">{property.name}</h3>
            </div>
            <div className="space-y-2 text-slate-600">
              <p>Area: {property.area}</p>
              <p>Location: {property.location}</p>
              <p>Soil Type: {property.soilType}</p>
              <p className="text-lg font-semibold text-slate-800 mt-4">
                Value: {property.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Add New Property</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Area (in acres)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Soil Type
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option>Alluvial</option>
                  <option>Black</option>
                  <option>Red</option>
                  <option>Laterite</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Add Property
                </button>
                <button
                  type="button"
                  className="btn flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}