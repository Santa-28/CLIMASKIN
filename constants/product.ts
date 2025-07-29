export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  type: 'Moisturizer' | 'Sunscreen' | 'Cleanser';
  suitableFor: string[]; // e.g., ['Oily Skin', 'Dry Skin']
  price: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Hydrating Moisturizer',
    description: 'Provides deep hydration for dry skin.',
    price: 14.99,
    image: 'https://media6.ppl-media.com/tr:h-235,w-235,c-at_max,dpr-2,q-40/static/img/product/387639/deconstruct-oil-free-moisturizer-for-oily-skin-3-percentage-nmf-complex-0-2-percentage-panthenol-10g_2_display_1738911526_82c0487e.jpg',
    type: 'Moisturizer',
    suitableFor: ['Dry Skin', 'Normal Skin'],
  },
  {
    id: '2',
    name: 'SPF 50 Sunscreen',
    description: 'Protects your skin from harmful UV rays.',
    price: 19.99,
    image: 'https://aqualogica.in/cdn/shop/files/Photoshoot_ec4b0fe4-6a6b-4aaf-b73d-1ca39a0be2cd.jpg?v=1746683149&width=533',
    type: 'Sunscreen',
    suitableFor: ['All Skin Types'],
  },
  {
    id: '3',
    name: 'Acne Cleanser',
    description: 'Cleans and reduces acne with daily use.',
    price: 10.5,
    image: 'https://w7.pngwing.com/pngs/566/41/png-transparent-cleanser-acne-skin-face-soap-oil-control-cream-oil-sunscreen.png',
    type: 'Cleanser',
    suitableFor: ['Oily Skin', 'Acne-Prone Skin'],
  },
{
        id: '4',
        name: 'Brightening Serum',
        description: 'Enhances skin radiance and reduces dark spots.',
        price: 24.99,
        image: 'https://manipuraayurveda.com/wp-content/uploads/SKIN-BRIGHTENING.png',
        type: 'Moisturizer',
        suitableFor: ['All Skin Types'],
    },
    {
        id: '5',
        name: 'Hydrating Sunscreen Gel',
        description: 'Lightweight gel sunscreen with hydration.',
        price: 18.99,
        image: 'https://img.freepik.com/free-photo/applying-spf-50-sunscreen-beach_23-2151991970.jpg?semt=ais_hybrid&w=740',
        type: 'Sunscreen',
        suitableFor: ['All Skin Types'],
    },
];