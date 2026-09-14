import apiSourceInfo from './api-source-info'
import { userApiManager } from '@/core/userApi/sandbox'
// import api_temp_kw from './kw/api-temp'
// // import api_test_bd from './bd/api-test'
// import api_test_tx from './tx/api-test'
// import api_test_kg from './kg/api-test'
// import api_test_kw from './kw/api-test'
// import api_test_mg from './mg/api-test'
// import api_test_wy from './wy/api-test'

const allApi = {
  // temp_kw: api_temp_kw,
  // // test_bd: api_test_bd,
  // test_tx: api_test_tx,
  // test_kg: api_test_kg,
  // test_kw: api_test_kw,
  // test_mg: api_test_mg,
  // test_wy: api_test_wy,
}

const apiList = {}
const supportQuality = {}

for (const api of apiSourceInfo) {
  supportQuality[api.id] = api.supportQualitys
  for (const source of Object.keys(api.supportQualitys)) {
    apiList[`${api.id}_api_${source}`] = allApi[`${api.id}_${source}`]
  }
}

const apis = source => {
  return {
    async getMusicUrl(songInfo, type) {
      const res = await userApiManager.invokeSource('musicUrl', { source, songInfo, type })
      if (res && res.url) return res
      return { url: '' }
    }
  }
}

export { apis, supportQuality }
