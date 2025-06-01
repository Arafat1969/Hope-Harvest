import React from 'react';
import './gallery.css';

const GalleryComponent = () => {
  const images = [
    {
      id: 1,
      url: "https://plus.unsplash.com/premium_photo-1683134055585-3d84cb07b60e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D",
      alt: "Children in a classroom smiling"
    },
    {
      id: 2,
      url: "https://plus.unsplash.com/premium_photo-1663040178972-ee1d45d33899?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D",
      alt: "Volunteers distributing food"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D",
      alt: "Hand holding a heart"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Children playing together"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Volunteers working together"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Donation boxes"
    },
    {
      id: 7,
      url: "https://plus.unsplash.com/premium_photo-1661769800950-a36da6a69d44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Community support"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Helping hands"
    }
  ];

  return (
    <div className="container mt-4 gallery-container">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="text-center gallery-title">Hope Harvest Gallery</h2>
          <p className="text-center gallery-subtitle">A glimpse of our impact and activities</p>
        </div>
      </div>
      
      <div className="row">
        {images.map((image) => (
          <div key={image.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="gallery-item">
              <img 
                src={image.url} 
                alt={image.alt} 
                className="img-fluid gallery-image" 
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryComponent;