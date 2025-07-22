const res = await fetch('https://localhost:7231/api/Product')
const PRODUCTS = await res.json();


export default PRODUCTS;