<script setup>
import Form from "@/components/new_form_builder/Form.vue";
import Input from "@/components/new_form_elements/Input.vue";
import Select from "@/components/new_form_elements/Select.vue";
import { ref, watch, onMounted } from "vue";
import vPrivilege from "@/directives/vPrivilage";

const props = defineProps({
  privilege: {
    type: Object,
    default: () => ({}),
  },
});


</script>
<template>
  <Form
    class="grid grid-cols-2 gap-x-20 gap-y-4"
    :inner="false"
    id="privilegeForm"
  >
    <Input
      name="name"
      validation="required|minmax-3,50 (Minimum length is 3 characters.)"
      label="Privilege Name"
      :value="props.privilege?.privilegeName || ''"
      :attributes="{
        placeholder: 'Enter Privilege',
      }"
    />  
    <Input
      validation="required|minmax-3,50 (Minimum length is 3 characters.)"
      name="description"
      :value="props.privilege?.description || ''"
      label="Privilege Description"
      :attributes="{
        placeholder: 'Enter Privilege description',
      }"
    />
    <Input
      :value="props.privilege?.category || ''"
      name="category"
      label="Privilege Category"
      validation="required|minmax-3,50 (Minimum length is 3 characters.)"
      :attributes="{
        placeholder: 'Enter Privilege Category',
      }"
    />
     
   
  </Form>
</template>
