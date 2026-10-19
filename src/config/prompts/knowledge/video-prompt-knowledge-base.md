# Knowledge Base: วิธีคิดและการเขียน Prompt สำหรับเจนวิดีโอ

> สกัดจาก final prompt ที่มีในโฟลเดอร์นี้ ณ วันที่ 21 สิงหาคม 2026 เพื่อใช้เป็นบริบทให้ AI ผู้ช่วยสร้าง prompt วิดีโอ ไม่ใช่คู่มือการใช้โมเดลใดโมเดลหนึ่งโดยเฉพาะ

## ขอบเขตและหลักฐานที่สำรวจ

| กลุ่ม | ไฟล์ | สิ่งที่ใช้สกัด |
|---|---|---|
| Thai sci-fi action | `flux3_ramakien_20s_prompt.txt` | ฉากต่อสู้ 20 วินาทีที่คุม choreography, ตำแหน่ง, ฟิสิกส์ และเสียง |
| Thai recovered news | `flux3_thai_news_yaksha_18s_prompt.txt`, `flux3_thai_news_mural_15s_prompt.txt` | ความสมจริงเชิงยุคสมัย, ภาษากล้อง, escalation และจุดจบแบบ physical cause |
| Thai VCD serial | `clip-01-payload.json`, `clip-02-payload.json` | prompt แบบต่อเนื่องข้ามคลิป, character anchor, dialogue และ tonal contrast |
| Educational visual project | `project/` ทั้งชุด | การล็อก CI, style guide, checklist, source discipline และการผลิตเป็นลำดับ |

ไม่รวมไฟล์ HTML เพราะเป็นหน้าอ้างอิงต้นทาง ไม่ใช่ final prompt

## ลายเซ็นวิธีคิดของผู้สร้าง

1. **เริ่มจากประสบการณ์ที่คนดูต้องรู้สึก ไม่ใช่รายการภาพสวย** — เช่น “ข่าวหลุดจากเทปจริง”, “หนัง VCD ไทยจริงจังเกินเหตุ”, หรือ “ศิลปะไทยโบราณทำงานเป็นเทคโนโลยี” แล้วให้ทุกองค์ประกอบรับใช้ experience เดียวกัน
2. **ความเฉพาะทางวัฒนธรรมต้องเป็นโครงสร้าง ไม่ใช่ของตกแต่ง** — Ramakien, kranok, yantra, วัดไทย, สำเนียงใต้, VCD และ ENG camera ถูกกำหนดทั้งในโลกเรื่อง ภาพ เสียง การแสดง และวัสดุ
3. **เวลาเป็น budget ที่ต้องออกแบบ** — แบ่งเป็นช่วงวินาที, ระบุจุดเริ่มทันที, การตัด, preparation → contact/evasion → recovery และ final frame ที่ชัดเจน
4. **ล็อกสิ่งที่โมเดลมักเปลี่ยนเอง** — จำนวนคน, อายุ, ใบหน้า, costume, scale, ตำแหน่งซ้าย-ขวา, มือข้างที่มีอุปกรณ์, และ action count ล้วนต้องเขียนซ้ำอย่างมีเจตนา
5. **ใช้เหตุและผลทางกายภาพสร้างความน่าเชื่อ** — กล้องสั่นเพราะอะไร, ฝุ่นและเศษปูนตกอย่างไร, camera เสียเพราะอะไร, ตัวใหญ่เคลื่อนน้ำหนักแบบใด; หลีกเลี่ยงเหตุการณ์ที่ “เกิดขึ้นเอง”
6. **negative prompt คือขอบเขตสร้างสรรค์** — ไม่ใช่ถุงรวมคำห้าม: ใช้กัน genre drift, artifact, camera logic ที่ผิด และพฤติกรรมที่อ่านไม่ออก
7. **อารมณ์มาจาก escalation ที่อ่านออก ไม่ใช่ความโกลาหล** — ปกติ → หลักฐานเล็กน้อย → อันตรายชัด → ผลลัพธ์ที่หลีกเลี่ยงไม่ได้ โดยคั่นจังหวะเงียบเมื่อจำเป็น
8. **แยกสิ่งที่ต้องเจนออกจากสิ่งที่ควรทำภายหลัง** — เช่น ไม่ให้โมเดลเจน subtitle/text; ภาพ raw ไม่มีข้อความ แล้วประกอบตัวอักษรด้วย workflow ภายหลัง
9. **ความจริงเชิงข้อมูลต้องมีขอบเขต** — เมื่องานความรู้ใช้ตัวเลข จะเก็บแหล่งอ้างอิง, ระบุว่าเป็นค่าโดยประมาณ และหลีกเลี่ยงการสรุปเหตุ-ผลเกินหลักฐาน

## ลำดับคิดก่อนเขียน prompt

1. ระบุ **format และ promise**: ความยาว, aspect ratio, ยุค/medium, และคนดูควรเชื่อหรือรู้สึกอะไรในประโยคเดียว
2. ระบุ **anchor ที่ห้ามเปลี่ยน**: ตัวละคร, สถานที่, visual grammar, กล้อง, เสียง, safety/content boundary
3. ออกแบบ **beat sheet ตามเวลา**: ทุก beat ต้องมีภาพหลัก, การกระทำเดียวหรือชุดที่อ่านออก, เสียง/คำพูด, และผลที่พาไป beat ถัดไป
4. ระบุ **continuity และ spatial logic**: ใครอยู่ตรงไหน, มองไปทางใด, อะไรเกิดก่อน-หลัง, ใครปลอดภัยเมื่อมีอันตราย
5. เติม **physical causality**: น้ำหนัก, แรง, camera response, debris, exposure/focus หรือการเปลี่ยนสถานะอื่นที่เห็นได้
6. เขียน **negative constraints แบบจัดกลุ่ม** และตรวจว่าห้ามอะไรเพราะอะไร
7. ตรวจความพร้อมใช้งาน: ไม่มีคำสั่งขัดกัน, เวลาไม่ล้น, action ไม่มากเกินความยาว และ dialogue มีเวลาพูดจริง

## โครง prompt มาตรฐาน

```text
Create a [duration] [format] video. [one-sentence experience/promise].

FORMAT / LOOK:
- aspect ratio, resolution/medium, era, image defects or rendering intent

WORLD / LOCATION:
- culturally and materially specific place, time of day, atmosphere

CHARACTER LOCK:
- exact count; age; face; clothing; proportions; signature prop/body feature
- continuity rule / supplied reference anchor, if available

CAMERA + AUDIO LOGIC:
- who/what records it; framing and movement; what causes each imperfection
- language, voices, ambience, music policy

TIMELINE:
0.0–Xs — [shot/framing]. [one readable action]. [dialogue/audio]. [result].
Xs–Ys — ...

PHYSICS / PERFORMANCE:
- weight, contact, recovery, reactions, safety and spatial continuity

STYLE:
- materials, lighting, color, culturally-native visual motifs

AVOID / NEGATIVE:
- genre drift, camera violations, unwanted effects, artifacts, text/logo/watermark,
  identity changes, unsafe or prohibited content
```

### กฎการเขียน beat

- เปิดภาพที่ “เรื่องเริ่มแล้ว” ไม่เสียเวลากับ montage เว้นแต่ montage คือรูปแบบของงาน
- หนึ่ง action ที่สำคัญต้องมี: เตรียม → สัมผัส/หลบ → ผลตอบสนอง/กลับสู่สมดุล
- ถ้าต้องนับ ให้ใช้คำว่า `exactly one`, `exactly two`, `for one full second` และตามด้วยผลลัพธ์
- ระบุมุมกล้องเมื่อมุมคือเงื่อนไขของการอ่าน action ไม่ต้องบังคับทุกช็อตโดยไม่มีเหตุผล
- บทพูดต้องสั้น เป็นภาษาที่คนในโลกนั้นพูด และระบุผู้พูดที่มองเห็นได้
- เมื่อมีคนเด็กหรือผู้ไม่เกี่ยวข้องกับ action ให้ระบุการย้ายสู่จุดปลอดภัย **ก่อน** danger beat

## ระบบถามแบบ Grill สำหรับ AI ผู้ช่วย

เป้าหมายคือช่วยผู้ใช้ตัดสินใจ ไม่ใช่รีบผลิต prompt ที่สวยแต่คลุมเครือ ถามทีละ 1–3 คำถามที่มีผลต่อ output มากที่สุด แล้วสรุปสิ่งที่ล็อกไว้ก่อนถามรอบถัดไป

### ลำดับการถาม

1. **แก่นเรื่อง:** “หลังดูจบ คนดูต้องเชื่อ/รู้สึก/จำอะไรหนึ่งอย่าง?”
2. **รูปแบบ:** “ทำให้เหมือนสื่อชนิดไหน, ยุคใด, อัตราส่วนและความยาวเท่าไร?”
3. **จุดเปลี่ยน:** “เหตุการณ์ผิดปกติเริ่มเมื่อไร และหลักฐานแรกที่เห็น/ได้ยินคืออะไร?”
4. **ตัวล็อก:** “อะไรห้ามเปลี่ยน—คน, ชุด, เพศ/วัย, prop, สัตว์, จำนวน, สถานที่ หรือ reference image?”
5. **การกระทำ:** “มี action สำคัญกี่ครั้ง; แต่ละครั้งเริ่ม-กระทบ-จบอย่างไร?”
6. **กล้องและเสียง:** “ใครถือกล้อง, กล้องตอบสนองต่อแรงหรือเหตุการณ์อย่างไร, มีภาษา/บทพูด/เพลงหรือไม่?”
7. **ขอบเขต:** “มีอะไรที่ห้ามเด็ดขาด เช่น text, โลโก้, gore, comedy, cyberpunk, shaky cam, หรือกล้องมุมที่ผิดโลก?”
8. **เกณฑ์จบ:** “final image หรือ final sound อะไรที่พิสูจน์ว่าคลิปสำเร็จ?”

### วิธี challenge แบบสุภาพแต่ตรง

- ถ้าผู้ใช้ขอ “cinematic” ให้ถามว่า cinematic แบบไหน: ภาพยนตร์, รายการข่าว, VCD, documentary หรือโฆษณา เพราะคำนี้ขัดกับภาษากล้องบางแบบ
- ถ้ามีหลายเหตุการณ์ในเวลาสั้น ให้บอกจำนวน beat ที่สมจริงและให้เลือก “เก็บอะไร / ตัดอะไร”
- ถ้าต้องรักษาหน้า/ชุดข้ามช็อตหรือข้ามคลิป ให้เสนอสร้าง reference anchor ก่อนเจนวิดีโอ
- ถ้าแอ็กชันอ่านยาก ให้เปลี่ยนจาก combo เป็น action เดียวที่มีทิศทาง, contact และ recovery ชัดเจน
- ถ้าอ้างอิงวัฒนธรรมไทย ให้ถามว่าต้องการความถูกต้องระดับไหน และห้ามแทนที่ด้วย visual shorthand แบบ generic Asian/cyberpunk
- ถ้าเป็นงานความรู้ ให้ถาม source, ระดับความมั่นใจ, และถ้อยคำที่ต้องใช้เพื่อกันการกล่าวเกินจริง

## Output ที่ AI ควรส่งมอบ

1. **Creative brief ที่ล็อกแล้ว** — 6–10 บรรทัด สำหรับผู้ใช้ตรวจทิศทาง
2. **Final generation prompt ภาษาอังกฤษ** — เพราะ prompt ตัวอย่างใช้ภาษาอังกฤษเป็นแกน แต่คง dialogue/คำเฉพาะไทยตามต้นฉบับ
3. **Thai dialogue sheet** — แยกผู้พูดและ timestamp หากมีคำพูด
4. **Negative prompt** — เฉพาะความเสี่ยงของงานนั้น ไม่คัดลอกยาวโดยไม่ปรับ
5. **Continuity checklist** — ใช้เมื่อหลายคลิป/หลายฉาก หรือมี character CI
6. **Assumptions ที่เหลือ** — ระบุชัดเมื่อผู้ใช้ยังไม่ตอบ แทนการแอบเดา

## Quality gate ก่อนส่ง Final Prompt

- [ ] ภาพรวมตอบ promise ในบรรทัดแรกได้
- [ ] duration รวมตรงกับ timeline และไม่มี beat มากเกินไป
- [ ] มีตัวละคร/สิ่งมีชีวิตตามจำนวนที่กำหนดเท่านั้น
- [ ] identity, costume, age, scale และทิศทางสำคัญถูกล็อก
- [ ] ทุก action ที่สำคัญมี cause, contact/evasion และ result
- [ ] กล้อง, เสียง, การตัด และความเสียหายมี physical logic
- [ ] dialogue สั้น พูดได้ทันเวลา และ synchronized กับผู้พูดที่เห็น
- [ ] cultural references เป็นรูปธรรมและสอดคล้องทั้งภาพ-เสียง-โลกเรื่อง
- [ ] มี negative constraints ป้องกัน drift/artifact ที่สัมพันธ์กับงาน
- [ ] ไม่สั่งให้โมเดลสร้าง typography หาก workflow ตั้งใจใส่ภายหลัง

## ข้อยกเว้นตามรูปแบบงาน

- **ข่าวหลุด/footage พบภายหลัง:** ห้ามกล้องภาพยนตร์; ทุก shake, focus hunt, lens damage และ signal loss ต้องมีสาเหตุใน frame
- **แอ็กชันแฟนตาซี:** ให้พลังงานขยายแรงทางกายภาพ ไม่แทนที่มัน; คุมตำแหน่งและจำนวนท่า
- **ซีรีส์หลายคลิป:** ประกาศจุดต่อจากคลิปก่อน, ใช้ character anchor เดียว และย้ำ signature feature ที่มักถูกสลับข้าง
- **ภาพความรู้หลายฉาก:** สร้าง/ล็อก CI และ style guide ก่อนงาน production; สร้าง raw clean แล้วใส่ข้อความด้วยขั้นตอนควบคุมได้
