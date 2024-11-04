
const bpmTxt = document.querySelector('.bpm');

function parseHeartRate(value: any) {
  let is16Bits = value.getUint8(0) & 0x1;
  if (is16Bits) return value.getUint16(1, true);
  return value.getUint8(1);
}
function handleRateChange(event: any) {
  bpmTxt!.textContent = parseHeartRate(event.target.value);
}
