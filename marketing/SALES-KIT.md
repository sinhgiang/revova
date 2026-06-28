# Revova — Bộ công cụ tìm khách hàng đầu tiên

> Mục tiêu: 10-20 người dùng thử trong 14 ngày → 1-3 khách trả tiền đầu tiên.
> Nguyên tắc vàng giai đoạn này: **thành thật là founder đang tìm vài khách đầu** — đừng giả vờ đã có nghìn khách. Founder khác RẤT thích giúp founder mới.

---

## 🎯 POSITIONING (câu chốt 1 dòng — học thuộc)

> "Mỗi tháng SaaS mất ~15% doanh thu vì thẻ khách bị lỗi. Revova tự động đòi lại 40-60% số đó bằng email AI — cài 3 phút, $29/tháng."

---

## A. BÀI ĐĂNG LAUNCH

### A1. Indie Hackers (đăng ở "Share your product" / Milestone)

**Tiêu đề:** I built an AI that recovers failed Stripe payments (looking for my first users)

**Nội dung:**
```
Hey IH 👋

Every SaaS quietly loses ~15% of revenue to failed payments — expired cards,
insufficient funds, bank declines. Most founders never even see it happening.

I got tired of writing dunning emails by hand, so I built Revova: it watches your
Stripe (or Paddle/Braintree/Chargebee/Recurly), and when a payment fails it sends
AI-written recovery emails that actually sound human — not the robotic "your payment
failed" template everyone ignores.

- Connects in ~3 minutes (paste your API key, done)
- AI reads the exact decline reason and writes a unique email for each customer
- 5-email sequence + smart retries, in 8 languages
- $29/mo (Churnkey/ChurnBuster charge $150-200)

I'm looking for my first handful of users. If you run a subscription business,
I'll set it up with you personally and you get 14 days free — no card needed.
Would genuinely love your feedback.

revova.io — happy to answer anything in the comments.
```

### A2. Reddit (r/SaaS, r/microsaas, r/Entrepreneur)

> ⚠️ Reddit GHÉT quảng cáo. Đăng kiểu chia sẻ giá trị, link để ở cuối/comment. Đọc rule mỗi sub trước.

**Tiêu đề:** Most SaaS lose ~15% of MRR to failed payments and never notice — here's what I learned building a recovery tool

**Nội dung:**
```
Spent the last few months deep in "involuntary churn" — when customers don't
cancel, their card just fails (expired, insufficient funds, bank decline) and they
silently disappear. A few things that surprised me:

1. It's usually 10-15% of all recurring charges that fail each month.
2. ~40-60% of those are recoverable just by emailing the customer at the right time
   with the right tone — most failures aren't "no money," they're "card expired."
3. Generic "your payment failed" emails get ignored. Personalized, human-sounding
   ones convert far better.
4. Timing matters a lot (retrying on payday, in the customer's timezone, etc.)

I ended up building a tool around this (Revova) but honestly the principles work
even if you DIY it. Happy to share the email templates/sequence that worked best in
testing if anyone wants them — just comment.
```
(Khi có người comment hỏi → mới thả link. Đây là cách Reddit chấp nhận.)

### A3. Twitter/X (thread)

```
1/ Your SaaS is probably losing 15% of revenue right now — and you can't see it.

Not churn. Not refunds. Failed payments. Expired cards, insufficient funds, bank
declines. The customer didn't quit — their card just died.

Here's how much it's costing you 🧵

2/ At $20K MRR, a 15% failure rate = ~$3,000/mo slipping away.
Most of it is recoverable. Most founders never try.

3/ The fix isn't complicated: email the customer, at the right time, in a tone that
sounds human — not "PAYMENT FAILED. UPDATE NOW."

~40-60% come back when you do this right.

4/ I got tired of doing it by hand so I built Revova — AI writes a unique recovery
email for each failed payment, reads the exact decline reason, retries smartly.

Works with Stripe, Paddle, Braintree, Chargebee, Recurly. 3-min setup.

5/ I'm looking for my first users. 14 days free, no card. I'll set it up with you.

If you run a subscription business, DM me or try it: revova.io

What % of your payments fail each month? Most people have no idea 👇
```

---

## B. COLD DM / EMAIL (cá nhân hóa từng người — đừng spam hàng loạt)

### B1. Twitter/X DM (ngắn, thân thiện)
```
Hey [name] — saw you're building [product]. Quick q: do you track how many of your
Stripe payments fail each month? It's usually ~15% and most are recoverable.

I built a tool that auto-recovers them with AI emails. Looking for my first few
users — happy to set it up for you free for 14 days if you're curious. No pitch,
genuinely want feedback 🙏
```

### B2. Cold email (problem-first)
**Subject:** ~15% of [Company]'s payments are probably failing
```
Hi [name],

Quick one — most subscription businesses lose 10-15% of revenue to failed payments
(expired cards, declines) without realizing it. The customer doesn't cancel; their
card just stops working.

I built Revova to fix exactly this: it watches your Stripe and auto-sends AI-written
recovery emails when a payment fails. ~40-60% come back.

I'm onboarding my first users and would love [Company] to be one. 14 days free, no
card, 3-min setup — I'll even set it up with you on a quick call.

Worth a look? revova.io

[Your name]
```

### B3. Follow-up (sau 3-4 ngày nếu không trả lời)
```
Hi [name] — bumping this up in case it got buried. No worries if not relevant!
Even if you don't use Revova, happy to show you how to estimate how much you're
losing to failed payments — takes 2 min in your Stripe dashboard. Just say the word.
```

---

## C. NƠI TÌM KHÁCH (SaaS founders dùng Stripe)

| Kênh | Cách dùng |
|------|-----------|
| **Indie Hackers** | indiehackers.com — đăng A1, comment giúp đỡ người khác, DM founder có MRR |
| **Twitter/X** | Search: "MRR", "build in public", "Stripe", "$X MRR". Follow + DM founder nhỏ |
| **Reddit** | r/SaaS, r/microsaas, r/Entrepreneur, r/EntrepreneurRideAlong — đăng A2 |
| **Product Hunt** | Xem SaaS mới launch → họ chắc chắn dùng Stripe → DM/email |
| **Communities** | Slack/Discord: "SaaS Growth Hacks", "Indie Worldwide", "MicroConf Connect" |
| **Directories** | SaaSHub, BetaList, StarterStory — list các SaaS nhỏ để cold email |
| **LinkedIn** | Search "Founder" + "SaaS" + "subscription" → kết nối + nhắn B1 |
| **Stripe ecosystem** | Ai khoe "powered by Stripe" / có trang pricing subscription = khách tiềm năng |

**Mẹo lọc khách tốt:** SaaS có **pricing định kỳ công khai** ($10-200/tháng), **đang chạy** (không phải mới ý tưởng), **founder nhỏ/solo** (dễ tiếp cận, quyết nhanh).

---

## D. KẾ HOẠCH 7 NGÀY

| Ngày | Việc làm |
|------|----------|
| **1** | Đăng bài A1 lên Indie Hackers. Lập danh sách 30 SaaS tiềm năng (Twitter/PH). |
| **2** | Đăng thread A3 lên Twitter. DM 10 founder (B1). Trả lời mọi comment. |
| **3** | Đăng A2 lên 1 subreddit (đọc rule trước). DM thêm 10 founder. |
| **4** | Gửi 10 cold email (B2). Follow-up ai đã nhắn ngày 2. |
| **5** | Đăng A2 lên subreddit khác. DM 10 người nữa. Lên lịch call với ai quan tâm. |
| **6** | Follow-up (B3) tất cả chưa trả lời. Set up trực tiếp cho khách đầu tiên. |
| **7** | Tổng kết: bao nhiêu lượt xem, đăng ký, phản hồi. Nhân đôi kênh nào hiệu quả nhất. |

**Chỉ số theo dõi:** lượt truy cập revova.io → đăng ký trial → kết nối Stripe → trả tiền.
Mục tiêu tuần 1: **10-20 trial**. Đừng nản nếu chậm — bán hàng là trò chơi số lượng + kiên trì.

---

## ⚠️ Lưu ý quan trọng về sự thật
- Giai đoạn này: **đừng bịa testimonial/con số khách**. Hãy nói thật "đang tìm vài khách đầu" — nó đáng tin và hiệu quả hơn.
- Con số "40-60% recoverable" / "15% fail" là số liệu NGÀNH (đúng), không phải số khách của bạn.
- Khi có khách thật + kết quả thật → cập nhật testimonial thật lên trang (mạnh hơn nhiều).
