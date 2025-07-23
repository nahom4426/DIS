<script setup>
import {ref, computed, onMounted } from 'vue';
import Input from '@/components/new_form_elements/Input.vue';
import InputPassword from '@/components/new_form_elements/InputPassword.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';
import { getAllRole } from '../../role/Api/RoleApi';
import Spinner from '@/components/Spinner.vue';
import InputLayout from '@/components/new_form_elements/NewInputLayout.vue';
const props = defineProps({
  initialData: {
    type: Object ,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  pending: {
    type: Boolean,
    default: false
  },
  onSubmit: {
    type: Function ,
    required: true
  },
  onCancel: {
    type: Function ,
    required: true
  },
  roles: {
    type: Array ,
    default: () => []
  }
});

// Form data
const email = ref('');
const password = ref('');
const title = ref('');
const firstName = ref('');
const fatherName = ref('');
const grandFatherName = ref('');
const gender = ref('');
const mobilePhone = ref('');
const roleUuid = ref('');
const rolesError = ref('');
// Role fetching state
const roles = ref([]);
const fetchRolesPending = ref(false);

// Add new refs for provider and role
const providerUuid = ref('');
const providersError = ref('');
const providers = ref([]);
const fetchProvidersPending = ref(false);

// Ethiopian Hospital List
const ethiopianHospitalList = [
  { label: 'Tikur Anbessa Specialized Hospital', value: 'tikur-anbessa' },
  { label: 'St. Paul\'s Hospital Millennium Medical College', value: 'st-pauls' },
  { label: 'Zewditu Memorial Hospital', value: 'zewditu' },
  { label: 'Alert Hospital', value: 'alert' },
  { label: 'Yekatit 12 Hospital Medical College', value: 'yekatit-12' },
  { label: 'Ras Desta Damtew Memorial Hospital', value: 'ras-desta' },
  { label: 'Gandhi Memorial Hospital', value: 'gandhi' },
  { label: 'Tirunesh Beijing Hospital', value: 'tirunesh-beijing' },
  { label: 'Bethzatha General Hospital', value: 'bethzatha' },
  { label: 'Hayat Medical College Hospital', value: 'hayat' },
  { label: 'Myungsung Christian Medical Center', value: 'myungsung' },
  { label: 'Korean Hospital', value: 'korean' },
  { label: 'Cure Ethiopia Children\'s Hospital', value: 'cure-ethiopia' },
  { label: 'International Clinical Laboratories', value: 'icl' },
  { label: 'Hallelujah General Hospital', value: 'hallelujah' },
  { label: 'St. Peter Specialized Hospital', value: 'st-peter' },
  { label: 'Armed Forces Comprehensive Specialized Hospital', value: 'armed-forces' },
  { label: 'Police Hospital', value: 'police' },
  { label: 'Minilik II Hospital', value: 'minilik-ii' },
  { label: 'Adera Medical Center', value: 'adera' }
];

// Provider options computation
const providerOptions = computed(() => {
  return ethiopianHospitalList;
});

// Role options with predefined roles including superadmin
const predefinedRoles = [
  { label: 'Super Admin', value: 'superadmin' },
  
];

// Role options computation - combine API roles with predefined roles
const roleOptions = computed(() => {
  const apiRoles = roles.value.map(role => ({
    label: role.roleName,
    value: role.roleUuid
  }));
  
  return [...predefinedRoles, ...apiRoles];
});


// Fetch roles function
async function fetchRoles() {
  try {
    fetchRolesPending.value = true;
    rolesError.value = null;
    
    const response = await getAllRole({ page: 1, limit: 500 });
    
    if (!response?.data?.content || !Array.isArray(response.data.content)) {
      throw new Error('Invalid data format: missing content array');
    }

    roles.value = response.data.content.map(item => ({
      roleUuid: item.roleUuid,
      roleName: item.roleName,
      roleDescription: item.roleDescription || '',
      privilegeList: item.privilegeList || []
    }));

    if (roles.value.length === 0) {
      rolesError.value = 'No roles available';
    }
  } catch (err) {
    rolesError.value = 'Failed to load roles. Please try again.';
  } finally {
    fetchRolesPending.value = false;
  }
}

// Title options
const titleOptions = ['Mr', 'Ms.', 'Dr.', 'Prof'];
const genderOptions = ['Female', 'Male'];

// Initialize form data from props
onMounted(async () => {
  await fetchRoles();

  if (props.initialData && Object.keys(props.initialData).length > 0) {
    email.value = props.initialData.email || '';
    password.value = props.initialData.password || '';
    title.value = props.initialData.title || '';
    firstName.value = props.initialData.firstName || '';
    fatherName.value = props.initialData.fatherName || '';
    grandFatherName.value = props.initialData.grandFatherName || '';
    gender.value = props.initialData.gender || '';
    mobilePhone.value = props.initialData.mobilePhone || '';
    roleUuid.value = props.initialData.roleUuid || '';
    providerUuid.value = props.initialData.providerUuid || '';
  }
});

function handleSubmit() {
  const formData = {
    email: email.value,
    title: title.value,
    firstName: firstName.value,
    fatherName: fatherName.value,
    grandFatherName: grandFatherName.value,
    gender: gender.value,
    mobilePhone: mobilePhone.value,
    roleUuid: roleUuid.value,
    providerUuid: providerUuid.value
  };

  props.onSubmit(formData);
}
</script>

<template>
  <Form 
    ref="formEl"
    :inner="false" 
    class="bg-white p-6 space-y-6" 
    id="user-form"
    @submit.prevent="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Email -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Email <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="email"
          name="email"
          validation="required|email"
          :attributes="{
            placeholder: 'Enter user email',
            required: true
          }"
        />
      </div>

      <!-- Password -->
      <!-- <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Password <span v-if="!isEdit" class="text-red-500">*</span>
        </label>
        <InputPassword
          v-model="password"
          name="password"
          :validation="isEdit ? '' : 'required'"
          :attributes="{
            placeholder: 'Enter password',
            required: !isEdit,
            autocomplete: 'new-password'
          }"
        />
      </div> -->

      <!-- Title -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Title <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="title"
          name="title"
          validation="required"
          :options="titleOptions"
          :attributes="{
            placeholder: 'Select title',
            required: true
          }"
        />
      </div>

      <!-- First Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          First Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="firstName"
          name="firstName"
          validation="required|alpha"
          :attributes="{
            placeholder: 'Enter first name',
            required: true
          }"
        />
      </div>

      <!-- Father Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Father Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="fatherName"
          name="fatherName"
          validation="required|alpha"
          :attributes="{
            placeholder: 'Enter father name',
            required: true
          }"
        />
      </div>

      <!-- Grandfather Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Grandfather Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="grandFatherName"
          name="grandFatherName"
          validation="required|alpha"
          :attributes="{
            placeholder: 'Enter grandfather name',
            required: true
          }"
        />
      </div>

      <!-- Gender -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Gender <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="gender"
          name="gender"
          validation="required"
          :options="genderOptions"
          :attributes="{
            placeholder: 'Select gender',
            required: true
          }"
        />
      </div>

      <!-- Mobile Phone -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Mobile Phone <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="mobilePhone"
          name="mobilePhone"
          validation="required|phone"
          :attributes="{
            placeholder: 'Enter mobile phone',
            required: true
          }"
        />
      </div>

      <!-- Provider -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Provider <span class="text-red-500">*</span>
        </label>
        <InputLayout>
          <select
            v-model="providerUuid"
            name="providerUuid"
            required
            :disabled="!providerOptions.length"
            class="custom-input"
          >
            <option value="" disabled>
              {{ providerOptions.length ? 'Select provider' : 'No providers available' }}
            </option>
            <option
              v-for="option in providerOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </InputLayout>
        <p v-if="providersError" class="mt-2 text-sm text-red-600">{{ providersError }}</p>
      </div>

      <!-- Role -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Role <span class="text-red-500">*</span>
        </label>
        <InputLayout>
          <select
            v-model="roleUuid"
            name="roleUuid"
            required
            :disabled="!roleOptions.length"
            class="custom-input"
          >
            <option value="" disabled>
              {{ roleOptions.length ? 'Select role' : 'No roles available' }}
            </option>
            <option
              v-for="option in roleOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </InputLayout>
        <p v-if="rolesError" class="mt-2 text-sm text-red-600">{{ rolesError }}</p>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="pt-4 border-t border-[#DFDEF2] flex justify-end space-x-4">
      <button
        type="button"
        @click="onCancel"
        class="text-[#75778B] px-6 py-2 border border-[#75778B] rounded-lg hover:bg-gray-50"
        :disabled="pending"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-[#02676B] hover:bg-[#014F4F] text-white px-6 py-2 rounded-lg"
        :disabled="pending || fetchRolesPending"
      >
        {{ isEdit ? 'Update User' : 'Add User' }}
      </button>
    </div>
  </Form>
</template>

<style scoped>
/* Additional styling for the form */
:deep(.form-control) {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5;
}

:deep(.form-select) {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5;
}
</style>
