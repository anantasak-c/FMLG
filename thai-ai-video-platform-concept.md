# Thai AI Video Platform — Product Concept

## ภาพรวม

แพลตฟอร์ม AI Video สำหรับคนไทยที่รวม 3 ส่วนหลักไว้ในเว็บเดียวกัน แต่แยก Product/พื้นที่ใช้งานออกจากกันอย่างชัดเจน

1. **Learn** — พื้นที่เรียนคอร์ส AI Video
2. **AI Coach** — Chatbot ช่วยคิดและปรับ Prompt
3. **Video Studio** — พื้นที่ Generate AI Video

ทั้ง 3 ส่วนใช้ **Account เดียวกัน** และเชื่อมกันผ่าน **Coin Wallet** สำหรับบริการ AI โดยผู้ใช้สามารถเติม Coin ด้วยเงินบาทผ่าน **PromptPay**

แนวคิดหลักคือ:

> **Learn · Coach · Create**

ผู้ใช้ไม่จำเป็นต้องซื้อคอร์สก่อน สามารถเข้ามาใช้ AI Coach หรือ Generate Video ได้ทันที

---

# 1. Product Structure

```text
                     YOUR BRAND
────────────────────────────────────────────
     Learn          AI Coach       Video Studio
      🎓               ✨               🎬
     เรียน          ช่วยทำ Prompt       Gen VDO

                         ↓

                 Account เดียวกัน
                         ↓
                   Coin Wallet
                         ↓
                  My Workspace
```

---

# 2. Learn — Online Academy

พื้นที่สำหรับคอร์สเรียนเกี่ยวกับ AI Video ที่สร้างขึ้นเอง

ตัวอย่างคอร์ส:

- AI Video Beginner
- Prompt Engineering for Video
- Character Consistency
- Cinematic Camera & Movement
- AI Commercial / TVC
- AI Short Film Workflow
- Workshop / Case Study

## หลักการสำคัญ

Course ต้องเป็น Product แยกจาก AI Studio

ผู้ใช้ที่ไม่ได้ซื้อคอร์สยังสามารถ:

- สมัครสมาชิก
- ใช้ AI Coach
- เติม Coin
- Generate Video
- ดู Video History

ได้ตามปกติ

## Course Pricing

แนะนำให้ขายคอร์สด้วยเงินบาทโดยตรง เช่น:

```text
AI Video Beginner
฿990

AI Video Mastery
฿1,990
```

ไม่ควรใช้ Coin ซื้อคอร์สโดยตรงในช่วงแรก

แต่สามารถใช้ Coin เป็น Promotion เช่น:

```text
AI Video Mastery
฿1,290

Bonus
+500 Coins สำหรับทดลอง Generate
```

ทำให้ผู้เรียนสามารถเรียนแล้วทดลองสร้างผลงานจริงในเว็บเดียวกันได้ทันที

---

# 3. AI Coach — Prompt Assistant

AI Chatbot ที่ถูกออกแบบและเทรนจากองค์ความรู้ / Workflow / เทคนิคการทำ AI Video ของเรา

หน้าที่หลักคือช่วยผู้ใช้ที่:

- ไม่รู้จะเริ่ม Prompt ยังไง
- ไม่รู้ว่าควรใช้ Model ไหน
- ไม่เข้าใจ Camera Movement
- ไม่รู้เรื่อง Shot / Scene
- อยากทำ Character Consistency
- ต้องการ Prompt ภาษาอังกฤษ
- ต้องการ Storyboard
- ต้องการ Prompt ให้เหมาะกับแต่ละ Model

## Example Flow

User:

> อยากทำคลิปขายอาหารทะเล 15 วิ ดูแพง ๆ

AI Coach ถามต่อ:

```text
ต้องการมีคนในฉากไหม?
↓
ต้องการเสียงพูดภาษาไทยหรือไม่?
↓
ต้องการ TVC หรือ UGC?
↓
มีภาพสินค้า Reference หรือไม่?
↓
ต้องการ 9:16 / 16:9?
↓
ต้องการความสมจริงระดับไหน?
```

จากนั้นสร้าง Final Prompt ให้

```text
FINAL PROMPT

A cinematic Thai seafood commercial...
...
```

พร้อมปุ่ม:

```text
[ Copy Prompt ]
[ Save Prompt ]
[ Generate Video ]
```

เมื่อกด Generate Video จะส่ง Prompt เข้า Video Studio ให้อัตโนมัติ

---

# 4. AI Coach Coin Model

ไม่แนะนำให้คิด Coin ต่อข้อความ เพราะผู้ใช้จะรู้สึกกังวลเวลาคุยกับ Bot

แนะนำให้คิด Coin ตอนสร้าง Output ที่มีมูลค่า เช่น:

```text
Chat / ปรับไอเดีย
FREE

Final Prompt
5 Coins

Advanced Model-specific Prompt
10 Coins

Storyboard 6 Shots
15 Coins

Full Commercial Prompt Pack
20 Coins
```

แนวคิดคือให้ User รู้สึกว่าจ่ายเงินเพื่อซื้อ “ผลลัพธ์” ไม่ใช่ซื้อจำนวนข้อความ

---

# 5. Video Studio — AI Video Generator

พื้นที่ Generate Video ที่ออกแบบสำหรับคนไทยและ Mobile-first

ผู้ใช้ทั่วไปไม่จำเป็นต้องรู้ว่า Backend ใช้ Provider หรือ Model อะไร

## Beginner Mode

```text
Create Video

[ Upload Image ]

Prompt
┌─────────────────────────────┐
│ A cinematic Thai commercial│
└─────────────────────────────┘

Quality

○ ประหยัด
● สมจริง
○ คุณภาพสูง

Duration

5s   10s   15s   20s

Aspect Ratio

9:16   16:9   1:1

Cost

🪙 75 Coins

[ Generate ]
```

---

# 6. Advanced Mode

สำหรับผู้ใช้ที่เข้าใจ AI Video แล้ว

สามารถเปิดตัวเลือกเพิ่มเติม เช่น:

- FLUX 3
- Seedance 2.5
- Kling
- WAN
- Veo
- Resolution
- Duration
- Aspect Ratio
- Seed
- Audio
- Negative Prompt
- Reference Images

Concept:

```text
Beginner Mode
= เลือกจากผลลัพธ์ที่ต้องการ

Advanced Mode
= เลือก Model และ Parameter เอง
```

---

# 7. Coin Wallet

AI Coach และ Video Studio ใช้ Coin Wallet เดียวกัน

Navbar:

```text
Learn     AI Coach     Create

                    🪙 340
                  [ เติม Coin ]
```

## ตัวอย่าง Coin Package

```text
100 Coins
฿99

550 Coins
฿499

1,200 Coins
฿999

2,700 Coins
฿1,999
```

Payment:

```text
เงินบาท
   ↓
PromptPay QR
   ↓
Payment Success
   ↓
เพิ่ม Coin เข้า Wallet
```

---

# 8. Coin ไม่ใช่ Cryptocurrency

Coin ควรเป็นเพียง Internal Usage Credit ในระบบ

ตัวอย่าง Database:

```text
user_id: 123
coin_balance: 850
```

ไม่จำเป็นต้องใช้:

- Blockchain
- Token Contract
- Crypto Wallet
- On-chain Transaction

เพื่อให้ระบบง่ายสำหรับผู้ใช้ทั่วไป

แนวทาง Coin:

- ใช้ได้เฉพาะใน Platform
- ไม่สามารถถอนเป็นเงินสด
- ไม่สามารถโอนระหว่าง User
- ไม่สามารถนำไปใช้ร้านอื่น
- ใช้สำหรับ AI Coach และ AI Generation

---

# 9. User Account Structure

User หนึ่งคนมีสิทธิ์หลายประเภทแยกจากกัน

```text
USER
 │
 ├── Course Entitlements
 │      └── เรียน Course ไหนได้บ้าง
 │
 ├── Coin Wallet
 │      └── เหลือกี่ Coin
 │
 ├── AI Coach History
 │      └── Prompt / Conversation
 │
 └── Video Library
        └── Generated Videos
```

ตัวอย่าง Profile:

```text
User: Anantasak

Coin Balance
🪙 745

COURSES
AI Video Beginner     ✅ Purchased
Advanced AI Video     🔒 Not Purchased

AI COACH
Last Prompt:
Product TVC

MY VIDEOS
28 Generations

Storage
640 MB
```

---

# 10. My Videos

หลัง Generate สำเร็จ ไฟล์ Video จะถูกเก็บใน Cloud Storage ของเรา

User สามารถ:

- Preview
- Download
- Delete
- Reuse Prompt
- Generate Again
- ดู Model ที่ใช้
- ดู Coin ที่ใช้
- ดูวันที่สร้าง

ตัวอย่าง:

```text
My Videos

┌──────────────┐
│ ▶ Video 01   │
│ FLUX 3       │
│ 80 Coins     │
└──────────────┘

┌──────────────┐
│ ▶ Video 02   │
│ Seedance     │
│ 45 Coins     │
└──────────────┘
```

---

# 11. Video Storage

แนะนำให้ใช้ Cloudflare R2 สำหรับเก็บ Generated Video

Flow:

```text
FLUX / Seedance / Provider
          ↓
Generate Video
          ↓
Temporary Provider URL
          ↓
Backend Download
          ↓
Cloudflare R2
          ↓
Permanent Video Library
```

R2 เหมาะสำหรับ:

- Preview Video
- Download
- User History
- Generated Asset Storage

ช่วงแรกสามารถใช้ HTML `<video>` player ได้โดยไม่ต้องใช้ Streaming Platform แพง ๆ

---

# 12. AI Provider Architecture

ไม่ควรผูกกับ Provider เดียว

ใช้ Model Router เพื่อเลือก Provider ที่คุ้มที่สุด

```text
                 Video Studio
                      │
                      ▼
                 Model Router
          ┌───────────┼───────────┐
          │           │           │
       FLUX 3     Seedance      Kling
          │           │           │
          ▼           ▼           ▼
      BFL Direct   Provider A   Provider B
```

ตัวอย่าง:

```text
FLUX 3
→ Black Forest Labs Direct API

Seedance
→ Provider ที่ต้นทุนต่ำที่สุด

Kling
→ Provider ที่ต้นทุนต่ำที่สุด

Veo
→ Google / Aggregator
```

ระบบ Coin ทำให้สามารถเปลี่ยน Provider หลังบ้านได้โดย User ไม่ต้องรู้

---

# 13. Provider Cost vs Coin

ไม่ควรแสดงต้นทุน API จริงให้ User

User เห็นแค่:

```text
⚡ Quick
25 Coins

🎬 Realistic
80 Coins

💎 Premium
150 Coins
```

Backend คำนวณ:

```text
Provider Cost
+
Storage
+
Payment Fee
+
Infrastructure
+
Margin
=
Coin Price
```

ทำให้สามารถปรับ Margin ได้โดยไม่เปลี่ยน UX

---

# 14. Payment Flow

```text
User
 ↓
เลือก Coin Package
 ↓
PromptPay QR
 ↓
ชำระเงินบาท
 ↓
Payment Webhook
 ↓
เพิ่ม Coin
 ↓
Coin Wallet Updated
```

Example:

```text
550 Coins
฿499

[ Pay with PromptPay ]

      QR CODE

Payment Successful ✓

+550 Coins

Current Balance
🪙 730
```

---

# 15. Mobile-first UX

เป้าหมายคือให้คนทั่วไปสามารถ Generate AI Video ได้จากโทรศัพท์

Bottom Navigation:

```text
🏠 Home

🎓 Learn

✨ Coach

🎬 Create

👤 Me
```

AI Video Flow:

```text
อยากสร้างอะไร?
      ↓
คุยกับ AI Coach
      ↓
ได้ Prompt
      ↓
[ ใช้ Prompt นี้ ]
      ↓
เพิ่ม Reference Image
      ↓
เลือก Duration
      ↓
เลือก Quality
      ↓
ดูราคา Coin
      ↓
Generate
      ↓
Preview
      ↓
Save / Download
```

---

# 16. Homepage Positioning

ไม่ควร Position ตัวเองเป็นเพียง Online School

ควรเป็น:

> **AI Video Platform สำหรับคนไทย**

หรือ

> **เรียน · คิด Prompt · สร้าง AI Video — ครบในที่เดียว**

Homepage:

```text
สร้าง AI Video ง่าย ๆ
สำหรับคนไทย

[ 🎬 สร้างวิดีโอ ]

────────────────────

🎓 LEARN

เรียนทำ AI Video
ตั้งแต่พื้นฐานถึงระดับ Pro

[ ดูคอร์ส ]

────────────────────

✨ AI COACH

ไม่รู้จะเขียน Prompt ยังไง?
ให้ AI ช่วยถาม ช่วยคิด และจัด Prompt ให้

[ เริ่มคุย ]

────────────────────

🎬 VIDEO STUDIO

มี Prompt แล้ว?
สร้าง AI Video ได้ทันที

[ Generate ]

────────────────────

🪙 เติม Coin

PromptPay
ไม่ต้องใช้บัตรเครดิต
```

---

# 17. Customer Entry Points

ข้อดีของระบบนี้คือมี 3 ทางเข้าในการหาลูกค้า

## Entry 1 — Course

```text
เห็นคอนเทนต์สอน AI
       ↓
ซื้อ Course
       ↓
ได้ Bonus Coin
       ↓
ทดลอง Generate
       ↓
กลายเป็น Studio User
```

## Entry 2 — Video Generator

```text
เห็นผลงาน AI Video
       ↓
อยากลอง Gen
       ↓
สมัครฟรี
       ↓
ซื้อ Coin ฿99
       ↓
Generate
       ↓
เห็น Course
       ↓
ซื้อ Course เพิ่ม
```

## Entry 3 — AI Coach

```text
เขียน Prompt ไม่เป็น
       ↓
ใช้ AI Coach
       ↓
ได้ Final Prompt
       ↓
กด Generate
       ↓
ซื้อ Coin
       ↓
กลายเป็น Studio User
```

---

# 18. Main Navigation

แนะนำ Navigation หลัก:

```text
Home
Learn
AI Coach
Create
My Videos

🪙 Coin Balance
Profile
```

หรือใช้ Product Naming สั้น ๆ:

```text
Learn · Coach · Create
```

---

# 19. MVP

Version แรกไม่ต้องสร้างทุกอย่างพร้อมกัน

## MVP Phase 1

### Account
- Sign up / Login
- User Profile

### Wallet
- Coin Balance
- Coin Transaction History

### Payment
- PromptPay
- Coin Packages
- Payment Webhook

### AI Coach
- Chat
- Final Prompt Generator
- Save Prompt
- Send Prompt to Studio

### Video Studio
- Text to Video
- Image to Video
- Duration
- Aspect Ratio
- Model / Quality Selection
- Coin Calculation

### Video Library
- Preview
- Download
- Delete
- Generation History

### Course
- Course Listing
- Purchase
- Lesson Page
- Course Access Control

---

# 20. Technical Architecture

Suggested Stack:

```text
Frontend
Next.js
React
Tailwind

Backend
Next.js API / Node.js

Database
PostgreSQL / Supabase

Auth
Supabase Auth / Clerk

Payment
PromptPay Gateway

Storage
Cloudflare R2

AI Chatbot
LLM API + Knowledge Base / RAG

Video AI
Multi-provider API

Hosting
Vercel / Cloudflare
```

---

# 21. Example Database

```text
users
 ├─ id
 ├─ email
 ├─ name
 └─ created_at

wallets
 ├─ user_id
 └─ coin_balance

coin_transactions
 ├─ id
 ├─ user_id
 ├─ amount
 ├─ type
 ├─ reference_id
 └─ created_at

payments
 ├─ id
 ├─ user_id
 ├─ amount_thb
 ├─ coins
 ├─ provider
 ├─ status
 └─ created_at

courses
 ├─ id
 ├─ title
 └─ price_thb

course_entitlements
 ├─ user_id
 ├─ course_id
 └─ purchased_at

coach_sessions
 ├─ id
 ├─ user_id
 ├─ prompt
 ├─ final_prompt
 └─ created_at

generations
 ├─ id
 ├─ user_id
 ├─ prompt
 ├─ model
 ├─ provider
 ├─ duration
 ├─ provider_cost
 ├─ coin_cost
 ├─ video_url
 ├─ status
 └─ created_at
```

---

# 22. Product Moat

สิ่งที่สร้างความแตกต่างระยะยาวไม่ใช่เพียง Video Model เพราะคู่แข่งสามารถใช้ API เหมือนกันได้

Moat ของ Platform คือ:

1. **Thai-first UX**
2. **PromptPay**
3. **AI Coach ที่เทรนจากความรู้จริง**
4. **Prompt Workflow**
5. **Course Content**
6. **Model Router**
7. **Prompt Template**
8. **Thai Use Cases**
9. **Community / User Generated Knowledge**
10. **Dataset ว่า Prompt แบบไหนทำงานได้ดีกับแต่ละ Model**

---

# 23. Core Product Philosophy

Platform ควรทำให้คนทั่วไปไม่ต้องเข้าใจ:

- API
- USD pricing
- Model Provider
- GPU
- Seed
- Technical Prompt Engineering

User เพียงแค่:

```text
บอกว่าอยากทำอะไร
        ↓
AI ช่วยคิด
        ↓
เลือกคุณภาพ
        ↓
ดูราคา Coin
        ↓
จ่าย PromptPay
        ↓
Generate
```

เป้าหมายคือ:

> **ทำให้ AI Video เป็นเรื่องง่ายสำหรับคนไทย แม้ไม่เคยใช้ AI Video มาก่อน และสามารถใช้งานทั้งหมดผ่านโทรศัพท์ได้**

---

# Final Concept

```text
                     PLATFORM
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      LEARN            COACH           CREATE
       🎓                ✨                🎬
        │                │                │
      Course          AI Prompt        AI Video
        │                │                │
        └────────────────┼────────────────┘
                         │
                     ACCOUNT
                         │
                    COIN WALLET
                         │
                  PROMPTPAY / THB
                         │
                    MY WORKSPACE
                         │
               Prompt + Video History
```

### Positioning

> **AI Video Platform สำหรับคนไทย**

### Product Message

> **เรียน · คิด Prompt · สร้าง AI Video — ครบในที่เดียว**

### Key Principle

> **ไม่ต้องซื้อคอร์สก็ใช้งาน AI Coach และ Video Studio ได้**
>
> **เติม Coin ด้วยเงินบาทผ่าน PromptPay แล้วใช้งาน AI ได้ทันที**
