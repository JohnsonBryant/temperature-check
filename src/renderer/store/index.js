import Vue from 'vue'
import Vuex from 'vuex'
// import { createPersistedState, createSharedMutations } from 'vuex-electron'
// import { createPersistedState } from 'vuex-electron'

const state = {
  isOnTest: false, // 系统是否在测试状态标志
  cycle: 120, // 测试周期，启动测试
  isSendding: true, // 测试是否周期获取字节点数据
  selectedEquipments: [], // 选择的测试仪器数据
  equipments: [], // 打包后的测试数据结构
  IDS: [], // 测试仪器配置的传感器ID集合
  duplicatedEquipment: {}, // 复制传感器时，临时存储位置
  searchedSensorIDs: [], // 搜索传感器，收到应答结果的存储位置
  TestTime: '', // 测试开始时间
  sensorDataNotInTest: []
}

const mutations = {
  // 更改当前系统测试状态标识
  setIsOnTest: (state, isOnTest) => {
    state.isOnTest = isOnTest
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
    const equipmentsSelected = state.selectedEquipments
    // 检查当前已选择的仪器中是否存在ID与新选择仪器相同的
    const duplicated = equipmentsSelected.some((ele, index, all) => {
      return ele.id === equipment.id
    })
    if (equipmentsSelected.length === 0 || !duplicated) {
      equipmentsSelected.push(equipment)
    }
  },
  // 从当前选择测试仪器中删减
  dropFromSelectedEquipments: (state, equipment) => {
    const equipmentsSelected = state.selectedEquipments
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
  // 设置测试仪器配置的传感器ID集合
  setIDS: (state, IDS) => {
    state.IDS.splice(0, state.IDS.length, ...IDS)
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
  },
  // 接收到搜索传感器应答时， 将传感器ID增加到 searchedSensorIDs
  addToSearchedSensorIDs: (state, deviceID) => {
    const searchedSensorIDs = state.searchedSensorIDs
    if (!searchedSensorIDs.includes(deviceID)) {
      searchedSensorIDs.push(deviceID)
    }
  },
  // 清空 searchedSensorIDs
  clearSearchedSensorIDs: (state) => {
    state.searchedSensorIDs = []
  },
  // setTestTime 测试开始时间
  setTestTime: (state, timeStr) => {
    state.TestTime = timeStr
  },
  addToSensorDataNotInTest: (state, pack) => {
    state.sensorDataNotInTest.push(pack)
  },
  clearSensorDataNotInTest: (state) => {
    state.sensorDataNotInTest.splice(0, state.state.sensorDataNotInTest.length)
  }
}

const actions = {
  setIsOnTestTask ({ commit }, isOnTest) {
    // do something async
    commit('setIsOnTest', isOnTest)
  },
  setCycleTask ({ commit }, cycle) {
    commit('setCycle', cycle)
  },
  setIsSenddingTask ({ commit }, isSendding) {
    commit('setIsSendding', isSendding)
  },
  addToSelectedEquipmentsTask ({ commit }, equipment) {
    commit('addToSelectedEquipments', equipment)
  },
  dropFromSelectedEquipmentsTask ({ commit }, equipment) {
    commit('dropFromSelectedEquipments', equipment)
  },
  clearAllSelectedEquipmentsTask ({ commit }) {
    commit('clearAllSelectedEquipments')
  },
  setSelectedEquipmentsTask ({ commit }, equipments) {
    commit('setSelectedEquipments', equipments)
  },
  setIDSTask ({ commit }, IDS) {
    commit('setIDS', IDS)
  },
  setEquiptmentsTask ({ commit }, equipments) {
    commit('setEquiptments', equipments)
  },
  resetEquipmentsTask ({ commit }) {
    commit('resetEquipments')
  },
  setDuplicatedEquipmentTask ({ commit }, equipment) {
    commit('setDuplicatedEquipment', equipment)
  },
  reSetDuplicatedEquipmentTask ({ commit }) {
    commit('reSetDuplicatedEquipment')
  },
  addToSearchedSensorIDsTask ({ commit }, deviceID) {
    commit('addToSearchedSensorIDs', deviceID)
  },
  clearSearchedSensorIDsTask ({ commit }) {
    commit('clearSearchedSensorIDs')
  },
  setTestTimeTask ({ commit }, timeStr) {
    commit('setTestTime', timeStr)
  },
  addToSensorDataNotInTestTask ({ commit }, pack) {
    commit('addToSensorDataNotInTest', pack)
  },
  clearSensorDataNotInTestTask ({ commit }) {
    commit('clearSensorDataNotInTest')
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
