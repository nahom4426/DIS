<script setup>
import Input from '@/components/new_form_elements/Input.vue';
import Privileges from '../../privilege/pages/Privileges.vue';
import Textarea from '@/components/new_form_elements/Textarea.vue';
import Form from '@/components/new_form_builder/Form.vue';
import SelectPrivilegeInput from '../components/SelectPrivilegeInput.vue';
import { ref, watch } from 'vue';

const props = defineProps({
    roles: {
        type: Object,
    },
    privileges: {
        type: Array,
        Required: true,
    },
    selectPrivilege: {
        type: Array,
    }
});

const selectedPrivileges = ref(props.selectPrivilege || []);
console.log(selectedPrivileges.value);


watch(() => props.selectPrivilege, (newVal) => {
    if (newVal) {
        selectedPrivileges.value = newVal;
    }
}, { immediate: true });

</script>

<template>
    <Form class="grid grid-cols-3 gap-4 p-6" :inner="false" id="roleForm">
        <Input name="roleName" validation="required" label="roleName" :value="roles?.roleName || ''" :attributes="{
            placeholder: 'Enter Role Name',
        }" />
        <Textarea validation="required" name="roleDescription" :value="roles?.roleDescription || ''"
            label="Role Description" :attributes="{
                placeholder: 'Enter Role Description',
            }" />
        <div class="col-span-3">
            <SelectPrivilegeInput 
                label="Select Privileges" 
                validation="required" 
                name="privilegeUuids"
                :options="privileges" 
                :selectedPrivilege="selectPrivilege || []" 
            />
        </div>
    </Form>
</template>
