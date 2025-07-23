<script setup>
import Form from "@/components/new_form_builder/Form.vue";
import Input from "@/components/new_form_elements/Input.vue";
import Textarea from "@/components/new_form_elements/Textarea.vue";

const props = defineProps({
  drugs: {
    type: Object,
    Required: false,
  },
});
console.log(props.drugs);
</script>
<template>
  <Form class="grid grid-cols-3 gap-4" :inner="false" id="drugForm" v-slot="{}">
    <div class="col-span-3">
      <Input
        name="drugName"
        validation="required"
        label="Drug Name"
        :value="props.drugs?.drugName || ''"
        :attributes="{
          placeholder: 'Enter Drug Name',
        }"
      />
    </div>
    <Input
      name="drugCode"
      validation="required"
      label="Drug Code"
      :value="props.drugs?.drugCode || ''"
      :attributes="{
        placeholder: 'Enter Drug Code',
      }"
    />

    <Input
      name="category"
      validation="required"
      label="Category"
      :value="props.drugs?.category || ''"
      :attributes="{
        placeholder: 'Category',
      }"
    />
    <Input
      name="subCategory"
      validation="required"
      label="Sub Category"
      :value="props.drugs?.subCategory || ''"
      :attributes="{
        placeholder: 'Enter Sub Category',
      }"
    />

    <Input
      name="dosage"
      validation="required"
      label="Dosage"
      :value="props.drugs?.dosage || ''"
      :attributes="{
        placeholder: 'Dosage',
      }"
    />
    <Input
      name="storage"
      validation="required"
      label="Storage"
      :value="props.drugs?.storage || ''"
      :attributes="{
        placeholder: 'Storage Requirements',
      }"
    />
    <Input
      name="indication"
      validation="required"
      label="Indication"
      :value="props.drugs?.indication || ''"
      :attributes="{
        placeholder: 'Drug Indication',
      }"
    />

    <div class="col-span-3">
      <Textarea
        name="caution"
        label="Caution"
        :value="props.drugs?.caution || ''"
        :attributes="{
          placeholder: 'Enter Caution Information',
        }"
      />
    </div>

    <div class="col-span-3">
      <Textarea
        name="drugInteraction"
        label="Drug Interaction"
        :value="props.drugs?.drugInteraction || ''"
        :attributes="{
          placeholder: 'Enter Drug Interaction Details',
        }"
      />
    </div>

    <div class="col-span-3">
      <Textarea
        name="contraindication"
        label="Contraindication"
        :value="props.drugs?.contraindication || ''"
        :attributes="{
          placeholder: 'Enter Contraindication Information',
        }"
      />
    </div>

    <div class="col-span-3">
      <Textarea
        name="sideEffects"
        label="Side Effects"
        :value="props.drugs?.sideEffects || ''"
        :attributes="{
          placeholder: 'Enter Side Effects',
        }"
      />
    </div>

    <div class="col-span-3">
      <Textarea
        name="doseAdministration"
        label="Dose & Administration"
        :value="props.drugs?.doseAdministration || ''"
        :attributes="{
          placeholder: 'Enter Dose & Administration Guidelines',
        }"
      />
    </div>
  </Form>
</template>
