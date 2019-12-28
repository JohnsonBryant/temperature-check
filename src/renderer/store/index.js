import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'
// import { createPersistedState } from 'vuex-electron'

const state = {
  isOnTest: false,
  cycle: 10,
  isSendding: true,
  isTestPreparing: false,
  selectedEquipments: [],
  equipments: [],
  deviceTestData: [],
  duplicatedEquipment: {}
}

const mutations = {
  // 更改当前系统测试状态标识
  setIsOnTest: (state, isOnTest) => {
    state.isOnTest = isOnTest
  },
  // 更改当前是否启动进入测试
  switchIsTestPreparing: (state, isPreparing) => {
    state.isTestPreparing = isPreparing
  },
  // 更改周期
  setCycle: (state, cycle) => {
    state.cycle = cycle
  },
  // 更改是否发送
  setIsSendding: (state, isSendding) => {
    state.isSendding = isSendding
  },
  // 新增选择仪器
  addToSelectedEquipments: (state, equipment) => {
    let equipmentsSelected = state.selectedEquipments
    // 检查当前已选择的仪器中是否存在ID与新选择仪器相同的
    let duplicated = equipmentsSelected.some((ele, index, all) => {
      return ele.id === equipment.id
    })
    if (equipmentsSelected.length === 0 || !duplicated) {
      equipmentsSelected.push(equipment)
    }
  },
  // 从当前选择测试仪器中删减
  dropFromSelectedEquipments: (state, equipment) => {
    let equipmentsSelected = state.selectedEquipments
    equipmentsSelected.splice(equipmentsSelected.indexOf(equipment), 1)
  },
  // 清空选择仪器
  clearAllSelectedEquipments: (state) => {
    state.selectedEquipments.splice(0, state.selectedEquipments.length)
  },
  // 设置选择仪器
  setSelectedEquipments: (state, equipments) => {
    state.selectedEquipments.splice(0, state.selectedEquipments.length, ...equipments)
  },
  // 启动测试时， 初始化设置测试仪器数组
  setEquiptments: (state, equipments) => {
    state.equipments.splice(0, state.equipments.length, ...equipments)
  },
  // 启动测试失败、或者停止测试时触发， 用于清空测试仪器信息数组
  resetEquipments: (state) => {
    state.equipments = []
  },
  // 复制设备时，使用选中的设备信息更新 duplicatedEquipment
  setDuplicatedEquipment: (state, equipment) => {
    state.duplicatedEquipment = equipment
  },
  // 使用完后，重置duplicatedEquipment
  reSetDuplicatedEquipment: (state) => {
    state.duplicatedEquipment = {}
  }
}

const actions = {
  setIsOnTestTask ({commit}, isOnTest) {
    // do something async
    commit('setIsOnTest', isOnTest)
  },
  setCycleTask ({commit}, cycle) {
    commit('setCycle', cycle)
  },
  switchIsTestPreparingTask ({commit}, isPreparing) {
    commit('switchIsTestPreparing', isPreparing)
  },
  setIsSenddingTask ({commit}, isSendding) {
    commit('setIsSendding', isSendding)
  },
  addToSelectedEquipmentsTask ({commit}, equipment) {
    commit('addToSelectedEquipments', equipment)
  },
  dropFromSelectedEquipmentsTask ({commit}, equipment) {
    commit('dropFromSelectedEquipments', equipment)
  },
  clearAllSelectedEquipmentsTask ({commit}) {
    commit('clearAllSelectedEquipments')
  },
  setSelectedEquipmentsTask ({commit}, equipments) {
    commit('setSelectedEquipments', equipments)
  },
  setEquiptmentsTask ({commit}, equipments) {
    commit('setEquiptments', equipments)
  },
  resetEquipmentsTask ({commit}) {
    commit('resetEquipments')
  },
  setDuplicatedEquipmentTask ({commit}, equipment) {
    commit('setDuplicatedEquipment', equipment)
  },
  reSetDuplicatedEquipmentTask ({commit}) {
    commit('reSetDuplicatedEquipment')
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [
    // createPersistedState()
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
