// import React from 'react';
// import ProductCard from '../../components/skinProducts/ProductCard';

// interface ProductDetailsProps {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   onBack?: () => void;
//   onAddToCart?: (id: string) => void;
// }

// const ProductDetails: React.FC<ProductDetailsProps> = ({
//   id,
//   name,
//   description,
//   price,
//   imageUrl,
//   onBack,
//   onAddToCart,
// }) => {
//   return (
//     <div style={styles.container}>
//       {onBack && (
//         <button style={styles.backButton} onClick={onBack}>
//           &larr; Back
//         </button>
//       )}
//       <ProductCard
//         id={id}
//         name={name}
//         description={description}
//         price={price}
//         imageUrl={imageUrl}
//         onAddToCart={onAddToCart}
//       />
//       <div style={styles.details}>
//         <h2>Product Details</h2>
//         <p>{description}</p>
//         {/* Additional product details can be added here */}
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     maxWidth: 600,
//     margin: '20px auto',
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//   },
//   backButton: {
//     marginBottom: 16,
//     backgroundColor: '#eee',
//     border: 'none',
//     padding: '8px 12px',
//     borderRadius: 4,
//     cursor: 'pointer',
//     fontSize: 14,
//   },
//   details: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#444',
//   },
// };

// export default ProductDetails;
