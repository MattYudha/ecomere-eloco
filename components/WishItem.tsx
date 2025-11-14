import React from 'react';

interface WishItemProps {
  product: ProductInWishlist; // Assuming ProductInWishlist interface is globally available or imported
}

const WishItem: React.FC<WishItemProps> = ({ product }) => {
  return (
    <div className="wish-item-placeholder">
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      {/* Add more details or actions here */}
    </div>
  );
};

export default WishItem;
