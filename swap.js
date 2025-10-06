function reorderTo450E49B2(raw) {
   // raw = [0x0E45, 0xB249]
   let hexValues = raw.map((x) => "0x" + x.toString(16).toUpperCase());
   // แยกแต่ละ word ออกมาเป็น byte
   let word0_hi = (hexValues[0] >> 8) & 0xff; // 0E
   let word0_lo = hexValues[0] & 0xff; // 45
   let word1_hi = (hexValues[1] >> 8) & 0xff; // B2
   let word1_lo = hexValues[1] & 0xff; // 49

   // จัดเรียงใหม่ -> 45 0E 49 B2
   return Buffer.from([word0_lo, word0_hi, word1_lo, word1_hi]);
}

// ตัวอย่างการใช้
let raw = [3653, 45641];
let buf = reorderTo450E49B2(raw);

console.log(
   "Original:",
   raw.map((x) => x.toString(16))
);
console.log("Reordered bytes:", buf);
