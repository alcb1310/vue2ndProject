<template>
  <div :class="[$style.component, 'container-fluid']">
    <div class="row">
      <aside class="col-xs-12 col-lg-3">
        <cart-side-bar
          v-if="featuredProduct"
          :featured-product="featuredProduct"
          :allow-add-to-cart="cart !== null"
          :add-to-cart-success="addToCartSuccess"
          :add-to-cart-loading="addToCartLoading"
          @add-to-cart="
            addProductToCart(
              featuredProduct,
              $event.selectedColorId,
              $event.quantity
            )
          "
        />
      </aside>
      <div class="col-xs col-lg-9">
        <transition name="fade" mode="out-in">
          <title-component :key="currentState" :text="pageTitle" />
        </transition>
        <div class="content p-3">
          <loading v-show="completeCart === null" />

          <transition name="fade" mode="out-in">
            <shopping-cart-list
              v-if="completeCart && currentState === 'cart'"
              :items="completeCart.items"
              @update-quantity="updateQuantity"
              @remove-from-cart="
                removeProductFromCart($event.productId, $event.colorId)
              "
            />
            <checkout-form v-if="completeCart && currentState === 'checkout'" />
          </transition>
          <div v-if="completeCart && completeCart.items.length > 0">
            <button class="btn btn-primary" @click="switchState">
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleComponent from '@/components/title';
import ShoppingCartMixing from '@/mixins/get-shopping-cart.js';
import Loading from '@/components/loading';
import {
  fetchProductsById,
  fetchFeaturedProducts,
} from '@/services/products-service.js';
import { fetchColors } from '@/services/colors-service.js';
import ShoppingCartList from '@/components/shopping-cart/';
import CartSideBar from '@/components/shopping-cart/cart-sidebar';
import CheckoutForm from '@/components/checkout/';

export default {
  name: 'ShoppingCart',
  components: {
    TitleComponent,
    Loading,
    ShoppingCartList,
    CartSideBar,
    CheckoutForm,
  },
  mixins: [ShoppingCartMixing],
  data() {
    return {
      products: null,
      colors: null,
      featuredProduct: null,
      currentState: 'cart',
    };
  },
  computed: {
    pageTitle() {
      return this.currentState === 'cart' ? 'Shopping Cart' : 'Checkout';
    },
    buttonText() {
      return this.currentState === 'cart' ? 'Check out >>' : '<< Back';
    },
    completeCart() {
      if (!this.cart || !this.products || !this.colors) {
        return null;
      }

      const completeItems = this.cart.items.map((cartItem) => {
        const product = this.products.find(
          (productItem) => productItem['@id'] === cartItem.product
        );
        const color = this.colors.find(
          (colorItem) => colorItem['@id'] === cartItem.color
        );

        return {
          id: `${cartItem.product}_${cartItem.color ? cartItem.color : 'none'}`,
          product,
          color,
          quantity: cartItem.quantity,
        };
      });

      return {
        // filter out missing products: they may stil be loading
        items: completeItems.filter((item) => item.product),
      };
    },
  },
  watch: {
    'cart.items.length': function watchCartItemsLength() {
      this.loadProducts();
    },
    // cart: {
    //   deep: true,
    //   handler() {
    //     this.loadProducts();
    //   },
    // },
  },
  async created() {
    this.loadFeaturedProducts();
    this.colors = (await fetchColors()).data['hydra:member'];
  },
  methods: {
    async loadProducts() {
      const productIds = this.cart.items.map((item) => item.product);
      const productsResponse = await fetchProductsById(productIds);
      // const colorsResponse = await fetchColors();
      // const [productsResponse, colorsResponse] = await Promise.all([
      //   fetchProductsById(productIds),
      //   fetchColors(),
      // ]);

      this.products = productsResponse.data['hydra:member'];
    },

    switchState() {
      this.currentState = this.currentState === 'cart' ? 'checkout' : 'cart';
    },

    async loadFeaturedProducts() {
      const featureProducts = (await fetchFeaturedProducts()).data[
        'hydra:member'
      ];

      if (featureProducts.length === 0) {
        return;
      }

      [this.featuredProduct] = featureProducts;
    },

    updateQuantity({ productId, colorId, quantity }) {
      this.updateProductQuantity(productId, colorId, quantity);
    },
  },
};
</script>

<style lang="sass" module>
@import '~styles/components/light-component.scss';
.component :global {
     .content {
          @include light-component;
     }

     .fade-enter-active, .faed-leave-active {
       transition: opacity 1s;
     }
     .fade-enter, fade-leave-to {
       opacity: 0;
     }
}
</style>
