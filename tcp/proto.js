



const head = [
  ['start','uint8',1],
  ['length','uint8',2],
  ['cmd','uint8',1],
]

const body = {
  connection: {
    cmd: 0xFF,
    data: {
      d: [
        ['version','cbcd',1],
        ['equipmentId','cbcd',8],
        ['moduleNum','cbcd',1],
        ['chargeMode','uint8',1],
        ['stationAddr','cbcd',1],
        ['end','uint8',1]
      ]
    },
  },
  hearbeat: {
    cmd: 0x0E,
    data: {
      e: [
        ['infos','int',1],
        ['reason','int',2],
        ['stationAddr','cbcd',1],
        ['infoAddr1','int',3],
        ['infoAddr2','int',8],
        ['end','int',1],
      ]
    }
  }

}


module.exports = {
  head,
  body
}
