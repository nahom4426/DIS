import { ref } from 'vue'
import { useApiRequest } from '@/composables/useApiRequest'

export function useDashboardData() {
  const loading = ref(false)
  const error = ref(null)
  const apiRequest = useApiRequest()

  const dashboardData = ref({
    users: [],
    roles: [],
    privileges: [],
    drugRequests: [],
    systemHealth: {
      uptime: '99.9%',
      responseTime: '120ms',
      activeConnections: 0
    }
  })

  async function fetchAllData() {
    loading.value = true
    error.value = null
    
    try {
      const [usersRes, rolesRes, privilegesRes] = await Promise.all([
        getAllUsers({ pageSize: 1000 }),
        getAllRole({ pageSize: 1000 }),
        getAllPrivileges({ pageSize: 1000 })
      ])

      if (usersRes.success) dashboardData.value.users = usersRes.data
      if (rolesRes.success) dashboardData.value.roles = rolesRes.data
      if (privilegesRes.success) dashboardData.value.privileges = privilegesRes.data

    } catch (err) {
      error.value = err.message
      console.error('Dashboard data fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    dashboardData,
    loading,
    error,
    fetchAllData
  }
}