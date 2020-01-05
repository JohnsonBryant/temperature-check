const state = {
  isOnTest: false,
  cycle: 10,
  isSendding: true,
  isTestPreparing: false,
  selectedEquipments: [],
  equipments: [],
  deviceTestData: []
}

const mutations = {
  // 更改当前系统测试状态标识
  setIsOnTest: (state, testState) => {
    state.isOnTest = testState
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
  // 启动测试时， 初始化设置测试仪器数组
  setEquiptments: (state, equipments) => {
    state.equipments.splice(0, state.equipments.length, ...equipments)
  },
  // 启动测试失败、或者停止测试时触发， 用于清空测试仪器信息数组
  resetEquipments: (state) => {
    state.equipments = []
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
