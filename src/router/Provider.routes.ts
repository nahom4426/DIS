import createinstitution from "@/features/instution_settings/pages/CreateInstutitions.vue";
import ActiveInstitution from "@/features/instution_settings/pages/ActiveInstutitions.vue";
import SuspendedInstitution from "@/features/instution_settings/pages/SuspendedInstutitions.vue";

export default [
	{
		path: '/create_institution',
		name: 'Create Institution',
		component: createinstitution
	},
	{
		path: '/drug-management',
		name: 'Drug Management',
		component: ActiveInstitution,
		meta: {
		  requiresAuth: true,
		  privilege: ['Create Employees'],
		},
	},
	{
		path: '/suspended_institution',
		name: 'suspended institution',
		component: SuspendedInstitution
	}
]
