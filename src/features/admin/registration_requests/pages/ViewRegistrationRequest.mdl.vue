<script setup>
import ModalParent from "@/components/ModalParent.vue";
import { closeModal, openModal } from "@customizer/modal-x";
import { ref, onMounted } from "vue";
import { useRegistrationRequestStore } from "../store/registrationRequestStore";
import { useToast } from '@/toast/store/toast';
import Button from "@/components/Button.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const requestStore = useRegistrationRequestStore();
const { addToast } = useToast();
const processing = ref(false);
const requestData = ref(null);

onMounted(() => {
  console.log('ViewRegistrationRequest mounted with props:', props.data);
  console.log('Available requests in store:', requestStore.requests);
  
  if (props.data?.requestId) {
    requestData.value = requestStore.requests.find(req => req.requestId === props.data.requestId);
    console.log('Found request data:', requestData.value);
  } else {
    console.error('No requestId provided in props.data');
  }
});

function handleApprove() {
  openModal('Confirmation', {
    title: 'Approve Request',
    message: `Approve ${requestData.value?.fullName}'s registration?`
  }, (confirmed) => {
    if (confirmed) {
      processing.value = true;
      setTimeout(() => {
        addToast({
          type: 'success',
          title: 'Approved',
          message: `${requestData.value.fullName} approved`
        });
        requestStore.update(requestData.value.requestId, { status: 'approved' });
        processing.value = false;
        closeModal();
      }, 800);
    }
  });
}

function handleReject() {
  openModal('Confirmation', {
    title: 'Reject Request',
    message: `Reject ${requestData.value?.fullName}'s registration?`
  }, (confirmed) => {
    if (confirmed) {
      processing.value = true;
      setTimeout(() => {
        addToast({
          type: 'success',
          title: 'Rejected',
          message: `${requestData.value.fullName} rejected`
        });
        requestStore.update(requestData.value.requestId, { status: 'rejected' });
        processing.value = false;
        closeModal();
      }, 800);
    }
  });
}
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-lg p-4 max-w-md mx-auto">
      <div v-if="requestData">
        <!-- Header -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold">{{ requestData.fullName }}</h3>
          <p class="text-sm text-gray-600">{{ requestData.userType }} • {{ requestData.email }}</p>
        </div>

        <!-- Info -->
        <div class="space-y-2 mb-4 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">License:</span>
            <span>{{ requestData.licenseNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span :class="{
              'text-yellow-600': requestData.status === 'pending',
              'text-green-600': requestData.status === 'approved',
              'text-red-600': requestData.status === 'rejected'
            }" class="capitalize font-medium">
              {{ requestData.status }}
            </span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2">
          <Button @click="closeModal()" class="flex-1 px-3 py-2 border text-gray-700 rounded text-sm">
            Close
          </Button>
          <template v-if="requestData.status === 'pending'">
            <Button @click="handleReject" :disabled="processing" 
                    class="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
              Reject
            </Button>
            <Button @click="handleApprove" :disabled="processing"
                    class="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              Accept
            </Button>
          </template>
        </div>
      </div>
    </div>
  </ModalParent>
</template>

can
