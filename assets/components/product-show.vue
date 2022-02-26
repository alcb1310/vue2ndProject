<template>
  <div>
    <loading v-if="loading" />
    <div v-if="product">
      <title-component :text="product.name" />
      <div v-if="product" :class="$style.product" class="row">
        <div class="col-4 pt-3">
          <img class="d-block" :src="product.image" :alt="product.name" />
          <div class="p-2">
            <small>brought to you by </small>
            <small class="d-inline" v-text="product.brand" />
          </div>
        </div>
        <div class="col-8 p-3">
          <div v-text="product.description" />
          <div class="row mt-4 align-items-center">
            <div class="col-4">
              Price: <strong>${{ price }}</strong>
            </div>
            <div class="col-8 p-3">
              <div class="d-flex align-items-center justify-content-center">
                <color-selector
                  v-if="product.colors.length !== 0"
                  @color-selected="updateSelectedColor"
                />
                <input
                  v-model.number="quantity"
                  class="form-control mx-3"
                  type="number"
                  min="1"
                />
                <button
                  class="btn btn-info btn-sm"
                  :disabled="cart === null"
                  @click="addToCart"
                >
                  Add to Cart
                  <i
                    v-show="addToCartLoading"
                    class="fas fa-spinner fa-spin"
                  ></i>
                  <i v-show="addToCartSuccess" class="fas fa-check "></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchOneProduct } from '@/services/products-service.js';
import Loading from '@/components/loading.vue';
import TitleComponent from '@/components/title.vue';
import ColorSelector from '@/components/color-selector.vue';
import formatPrice from '@/helpers/format-price.js';
import ShoppingCartMixin from '@/mixins/get-shopping-cart.js';

export default {
  name: 'ProductShow',
  components: {
    Loading,
    TitleComponent,
    ColorSelector,
  },
  mixins: [ShoppingCartMixin],
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      product: null,
      quantity: 1,
      loading: true,
      selectedColorId: null,
    };
  },
  computed: {
    /**
     * Returns a formatted price for the product
     * @returns {string}
     */
    price() {
      return formatPrice(this.product.price);
    },
  },
  async created() {
    try {
      this.product = (await fetchOneProduct(this.productId)).data;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    addToCart() {
      this.addProductToCart(this.product, this.selectedColorId, this.quantity);
    },
    updateSelectedColor(iri) {
      this.selectedColorId = iri;
    },
  },
};
</script>

<style lang="scss" module>
@import '~styles/components/light-component';
.product {
  @include light-component;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  input {
    width: 60px;
  }
}
</style>
