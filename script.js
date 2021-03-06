let cart = JSON.parse(localStorage.getItem('cart')) || [];
const btnCart = document.querySelector('.cart-btn');
const btnCloseCart = document.querySelector('.btn-close-cart');
const cartContainer = document.querySelector('.cart-products');
const popup = document.querySelector('.popup');
const totalContainer = document.querySelector('.total');
const qtyPdtInfo = document.querySelector('.qty-pdt-info');
const overlay = document.querySelector('.overlay');
const btnClearCart = document.querySelector('.btn-clear-cart');

document.addEventListener('DOMContentLoaded', init);

//initialise all products
function init(e) {
  const df = new DocumentFragment();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const product = document.createElement('div');
    product.classList.add('product');
    product.id = `product-${item._id}`;
    const imgBox = document.createElement('div');
    imgBox.classList.add('img-box');
    const img = document.createElement('img');
    img.src = item.img;
    const btnAddToCart = document.createElement('div');
    btnAddToCart.className = 'btn-add-to-cart';
    btnAddToCart.innerHTML = '<i class="fas fa-cart-plus"></i> add to cart';
    btnAddToCart.addEventListener('click', putIncart);
    imgBox.append(img, btnAddToCart);
    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = item.name;
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = item.price;
    product.append(imgBox, name, price);
    df.appendChild(product);
  }

  document.querySelector('.products-grid').appendChild(df);
  renderCartUI();
}

//put a product in the cart
function putIncart(e) {
  const selectedPdtId = e.target
    .closest('.product')
    .getAttribute('id')
    .split('-')[1];

  const product = items.find((pdt) => pdt._id === Number(selectedPdtId));
  const existItem = cart.find((item) => item._id === product._id);
  if (existItem) {
    cart = cart.map((item) => {
      if (existItem._id === item._id) {
        item.qty++;
        return item;
      }
      return item;
    });
  } else {
    cart.push({ ...product, qty: 1 });
  }
  setCart();
  //open the popup
  popup.classList.add('open');
  setTimeout(() => {
    popup.classList.remove('open');
  }, 2000);

  renderCartUI();
}
//open and close the overlay
btnCart.addEventListener('click', () => {
  overlay.classList.add('open');
});
btnCloseCart.addEventListener('click', () => {
  overlay.classList.remove('open');
});
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('overlay')) {
    overlay.classList.remove('open');
  }
});

//render the cart
function renderCart() {
  cartContainer.innerHTML = '';
  const df = new DocumentFragment();
  for (product of cart) {
    const pdtDiv = document.createElement('div');
    pdtDiv.className = 'cart-pdt';
    pdtDiv.setAttribute(`data-pdt`, product._id);
    const img = document.createElement('img');
    img.src = product.img;
    img.className = 'cart-pdt-img';
    const nameContainer = document.createElement('p');
    nameContainer.textContent = product.name;
    nameContainer.classList.add('cart-pdt-name');
    const priceContainer = document.createElement('p');
    priceContainer.className = 'cart-pdt-price';
    priceContainer.textContent = product.price * product.qty;
    const qtyContainer = document.createElement('p');
    qtyContainer.className = 'cart-pdt-qty';
    qtyContainer.textContent = product.qty;
    const buttonRemovePdt = document.createElement('div');
    buttonRemovePdt.classList.add('fas', 'fa-times', 'btn-times');
    pdtDiv.append(
      img,
      nameContainer,
      priceContainer,
      qtyContainer,
      buttonRemovePdt
    );
    df.appendChild(pdtDiv);
  }

  cartContainer.appendChild(df);
}

//calculate the total amount to pay
function calcTotal() {
  return cart.reduce((acc, item) => {
    return acc + item.qty * item.price;
  }, 0);
}
//calculate the total product in cart
function calcTotalNumberPdt() {
  return cart.reduce((acc, item) => {
    return acc + item.qty;
  }, 0);
}
//remove product in the cart
cartContainer.addEventListener('click', removePdtInCart);
function removePdtInCart(e) {
  if (e.target.classList.contains('btn-times')) {
    if (confirm('Are you sure you want to remove this product in the cart?')) {
      const removePdtId = e.target
        .closest('.cart-pdt')
        .getAttribute('data-pdt');
      cart = cart.filter((pdt) => pdt._id != removePdtId);
      setCart();
      renderCartUI();
    }
  }
}

//clear cart
btnClearCart.addEventListener('click', (e) => {
  if (confirm('You will remove all products from the cart')) {
    cart = [];
    setCart();
    renderCartUI();
  }
});

//keep in the local storage
function setCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

//call all the functions responsible for update the UI
function renderCartUI() {
  renderCart();
  totalContainer.textContent = calcTotal();
  qtyPdtInfo.textContent = calcTotalNumberPdt();
}

//deploy url
//https://jolly-cocada-28c45e.netlify.app
