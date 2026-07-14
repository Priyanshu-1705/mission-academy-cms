import React from "react";
import { Plus, Trash, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, Pencil } from "lucide-react";

export function BannersTab({ banners, handleOpenBannerModal, handleToggleBannerActive, handleDeleteBanner, handleReorderBanner }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Banners</h2>
          <p className="text-gray-500 text-xs mt-1">Manage slides displayed on the homepage slider.</p>
        </div>
        <button onClick={() => handleOpenBannerModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
          <Plus className="h-4 w-4" />
          <span>Add Slider Banner</span>
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {banners.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm font-medium">
            No banners found.
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={banner.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img src={banner.imageUrl} alt={banner.title} className="w-24 h-16 object-cover rounded-lg border border-gray-150" />
                <div>
                  <p className="font-bold text-sm text-gray-900">{banner.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{banner.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <button onClick={() => handleToggleBannerActive(banner)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500">
                  {banner.active ? <ToggleRight className="h-6 w-6 text-emerald-600" /> : <ToggleLeft className="h-6 w-6 text-gray-400" />}
                </button>
                <button onClick={() => handleReorderBanner(banner.id, "up")} disabled={index === 0} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => handleReorderBanner(banner.id, "down")} disabled={index === banners.length - 1} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenBannerModal(banner)}
                  className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-400 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteBanner(banner.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
