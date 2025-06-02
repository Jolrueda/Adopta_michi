import React from 'react';
import type { ImageGalleryProps } from '../../types/CatProfile/ImageGallery';

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 ">
    {images.map((src, idx) => (
      <img
        key={idx}
        src={src}
        alt={`${name} photo ${idx + 1}`}
        className="object-cover w-full h-48 rounded-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    ))}
  </div>
);

export default ImageGallery;