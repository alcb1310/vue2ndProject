<template>
  <div class="form-group">
    <label :for="id" class="col-form-label">{{ label }}: </label>
    <input
      :type="type"
      :id="id"
      :name="id"
      :value="value"
      :class="{
        'form-control': true,
        'is-invalid': !isValid,
      }"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event)"
    />
    <span v-show="!isValid" class="invalid-feedback">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  computed: {
    isValid() {
      return !this.errorMessage;
    },
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
};
</script>
