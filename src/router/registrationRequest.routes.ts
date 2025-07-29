import RegistrationRequests from "@/features/admin/registration_requests/pages/RegistrationRequests.vue";
import ViewRegistrationRequest from "@/features/admin/registration_requests/pages/ViewRegistrationRequest.mdl.vue";

export default [
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationRequests,
    meta: {
    //  privilege: ['MANAGE_REGISTRATION_REQUESTS'],
     // requiresAuth: true
    }
  },
  {
    path: '/registration-requests/:requestId',
    name: 'View Registration Request',
    component: ViewRegistrationRequest,
    meta: {
      //privilege: ['MANAGE_REGISTRATION_REQUESTS'],
     // requiresAuth: true
    }
  }
];
