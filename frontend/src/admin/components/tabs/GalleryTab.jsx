import React from "react";
import { Plus, Trash, Image, Search, Pencil } from "lucide-react";

export function GalleryTab({ albums, albumSearch, setAlbumSearch, filteredAlbums, handleOpenAlbumModal, handleDeleteAlbum, handleOpenPhotosModal }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Interactive Photo Gallery</h2>
          <p className="text-gray-500 text-xs mt-1">Manage school photo albums and images.</p>
        </div>
        <button onClick={() => handleOpenAlbumModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all shrink-0">
          <Plus className="h-4 w-4" />
          <span>Create New Album</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search photo albums..."
          value={albumSearch}
          onChange={(e) => setAlbumSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500 text-sm font-medium">
            No albums found.
          </div>
        ) : (
          filteredAlbums.map((album) => (
            <div key={album.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group relative">
              <img src={album.coverImageUrl} alt={album.title} className="w-full h-44 object-cover" />
              <div className="p-4 space-y-1">
                <p className="font-bold text-sm text-gray-900 group-hover:text-school-primary transition-colors">{album.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{album.description}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-2">{album.images?.length || 0} Photos</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-sm">
                <button onClick={() => handleOpenPhotosModal(album)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700" title="Manage Photos">
                  <Image className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenAlbumModal(album)}
                  className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-700"
                  title="Edit Album"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteAlbum(album.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-700" title="Delete Album">
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
