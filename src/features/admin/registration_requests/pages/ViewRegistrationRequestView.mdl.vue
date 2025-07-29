<script setup>
import { useApiRequest } from '@/composables/useApiRequest';
import { getRegistrationRequestDocumentView } from '../Api/RegistrationRequestApi';
import { closeModal } from '@customizer/modal-x';
import { ref } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
})
   
const req = useApiRequest();
const src = ref('')

req.send(
    () => getRegistrationRequestDocumentView(props.data.fileName),
    (res) => {
        if (res.success) {
            src.value = URL.createObjectURL(res.data)
        }
    }
)
</script>

<template>
    <div @keydown.esc='closeModal()' @click.self='closeModal()'
        class="min-h-full w-full grid place-items-center bg-black/50 p-4">
        <button @click="closeModal()"
            class="bg-gray-400 text-white size-6 rounded-full grid place-items-center fixed top-2 right-2">
            X
        </button>
        <p v-if="req.pending.value" class="m-auto text-lg text-white">Loading...</p>
        <embed v-else class="w-full min-h-full h-screen" :src="src" />
    </div>
</template>