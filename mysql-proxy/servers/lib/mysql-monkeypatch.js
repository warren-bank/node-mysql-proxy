const Packet = require('mysql2/lib/packets/packet')

const rs = Packet.prototype.readString

Packet.prototype.readString = function(len, encoding) {
  if ((typeof len === 'string') && (typeof encoding === 'undefined')) {
    encoding = len
    len = undefined
  }
  return rs.call(this, len, encoding)
}
