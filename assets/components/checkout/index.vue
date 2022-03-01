<template>
  <div class="row p-3">
    <div class="col-12">
      <form @submit.prevent="onSubmit">
        <div v-show="serverError" class="alert alert-danger">
          Well this is embarrassing ... something went wrong! Please try again!
        </div>
        <div class="form-row">
          <form-input
            v-bind="getFieldProps('customerName', 'Name')"
            v-model="form.customerName"
            class="col"
            @blur="validateField"
          />

          <form-input
            v-bind="getFieldProps('customerEmail', 'Email')"
            v-model="form.customerEmail"
            class="col"
            type="email"
            @blur="validateField"
          />
        </div>
        <div class="form-row">
          <form-input
            v-bind="getFieldProps('customerAddress', 'Address')"
            v-model="form.customerAddress"
            class="col"
            @blur="validateField"
          />
        </div>
        <div class="form-row">
          <form-input
            v-bind="getFieldProps('customerZip', 'Zip Code')"
            v-model="form.customerZip"
            class="col"
            @blur="validateField"
          />

          <form-input
            v-bind="getFieldProps('customerCity', 'City')"
            v-model="form.customerCity"
            class="col"
            @blur="validateField"
          />

          <form-input
            v-bind="getFieldProps('customerPhone', 'Phone Number')"
            v-model="form.customerPhone"
            class="col"
            type="tel"
            @blur="validateField"
          />
        </div>
        <div class="form-row justify-content-end align-items-center">
          <loading v-show="isLoading" />
          <div class="col-auto">
            <button
              type="submit"
              class="btn btn-info btn-lg"
              :disabled="isLoading"
            >
              Order!
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import FormInput from '@/components/checkout/form-input';
import Loading from '@/components/loading.vue';
import { createOrder } from '@/services/asset-service';
import { clearCart } from '@/services/cart-service';

export default {
  name: 'CheckoutForm',
  components: {
    FormInput,
    Loading,
  },
  data() {
    return {
      form: {
        customerName: '',
        customerEmail: '',
        customerAddress: '',
        customerZip: '',
        customerCity: '',
        customerPhone: '',
      },
      validationErrors: {
        customerName: null,
        customerEmail: null,
        customerAddress: null,
        customerZip: null,
        customerCity: null,
        customerPhone: null,
      },
      isLoading: false,
      serverError: false,
    };
  },
  props: {
    cart: {
      type: Object,
      required: true,
    },
  },
  methods: {
    validateField(event) {
      const validationMessage = {
        customerName: 'Please, enter your full name',
        customerEmail: ' Please, enter your email address',
        customerAddress: ' Please, enter your street address',
        customerZip: 'Please, enter your ZIP code',
        customerCity: 'Please, enter your city',
        customerPhone: 'Please, provide a phone number',
      };

      const validationField = event.target.id;

      if (!this.form[validationField]) {
        this.validationErrors[validationField] =
          validationMessage[validationField];
      } else {
        this.validationErrors[validationField] = null;
      }
    },
    getFieldProps(id, label) {
      return {
        id,
        label,
        errorMessage: this.validationErrors[id],
      };
    },
    async onSubmit() {
      this.isLoading = true;
      this.serverError = false;
      this.validationErrors = {
        customerName: null,
        customerEmail: null,
        customerAddress: null,
        customerZip: null,
        customerCity: null,
        customerPhone: null,
      };

      try {
        const response = await createOrder({
          ...this.form, //expands all the form data
          purchaseItems: this.cart.items,
        });

        await clearCart();

        window.location = `/confirmation/${response.data.id}`;
      } catch (error) {
        const { response } = error;

        if (response.status !== 400) {
          this.serverError = true;
        } else {
          response.data.violations.forEach((violation) => {
            this.validationErrors[violation.propertyPath] = violation.message;
          });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
