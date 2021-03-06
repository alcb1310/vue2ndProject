import {
  fetchCart,
  addItemToCart,
  getCartTotalItems,
} from '@/services/cart-service.js';
import {
  updateCartItemQuantity,
  removeItemFromCart,
} from '@/services/cart-service.js';

export default {
  data() {
    return {
      cart: null,
      addToCartLoading: false,
      addToCartSuccess: false,
    };
  },
  async created() {
    this.cart = await fetchCart();
  },
  methods: {
    async addProductToCart(product, selectedColorId, quantity) {
      if (product.colors.length !== 0 && selectedColorId === null) {
        alert('Please select a color first');

        return;
      }

      this.addToCartLoading = true;
      this.addToCartSuccess = false;
      await addItemToCart(this.cart, {
        product: product['@id'],
        color: selectedColorId,
        quantity,
      });
      this.addToCartLoading = false;
      this.addToCartSuccess = true;

      this.updateCartHeaderTotal();
    },

    async updateProductQuantity(prodctId, colorId, quantity) {
      await updateCartItemQuantity(this.cart, prodctId, colorId, quantity);

      this.updateCartHeaderTotal();
    },

    updateCartHeaderTotal() {
      document.getElementById(
        'js-shopping-cart-items'
      ).innerHTML = getCartTotalItems(this.cart).toString();
    },

    async removeProductFromCart(prodctId, colorId) {
      await removeItemFromCart(this.cart, prodctId, colorId);

      this.updateCartHeaderTotal();
    },
  },
};
