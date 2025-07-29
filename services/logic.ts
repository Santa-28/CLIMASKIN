export function getRecommendedProducts(quiz: any, weather: any) {
  const products = [];

  if (quiz.skinType === 'Oily' && weather.humidity > 70) {
    products.push({ name: 'Oil-Free Moisturizer', id: 1 });
  }

  if (quiz.sunExposure === 'More than 2 hours') {
    products.push({ name: 'SPF 50 Sunscreen', id: 2 });
  }

  if (weather.temp < 20) {
    products.push({ name: 'Hydrating Serum', id: 3 });
  }

  return products;
}
