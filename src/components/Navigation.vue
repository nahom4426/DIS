<template>
  <!-- Add to your navigation menu -->
  <nav-item 
    icon="prescription" 
    label="E-Prescriptions" 
    :routes="[
      { name: 'Prescriptions', label: 'All Prescriptions' },
      { name: 'CreatePrescription', label: 'Create Prescription' },
      { name: 'Patients', label: 'Patient Management' }
    ]"
  />
</template>