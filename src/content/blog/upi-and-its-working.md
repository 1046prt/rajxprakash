---
title: 'How UPI Actually Works: From NEFT and IMPS to Real-Time Payments'
date: '2026-06-05'
excerpt: 'Before UPI changed everything, India had NEFT, RTGS, and IMPS. This article traces the full journey of digital payments in India and explains exactly what happens behind the scenes every time you tap Pay.'
description: 'A deep dive into Indian payment infrastructure — NEFT, RTGS, IMPS, and how UPI actually authenticates and transfers money in real time.'
author: 'Prakash Raj'
image: '/assets/images/blog/blog-14.png'
---

## Before UPI, There Was a Different India

To understand why UPI is remarkable, you have to understand what existed before it.

India's digital payment story doesn't start in 2016. It starts much earlier, with systems that were groundbreaking at the time but came with real limitations.

---

## NEFT — National Electronic Funds Transfer

NEFT was launched by the Reserve Bank of India in 2005.

For the first time, Indians could transfer money between banks electronically without physically visiting a branch. You didn't need to carry a demand draft or wait for a cheque to clear.

That was genuinely revolutionary for its era.

**How NEFT works:**

NEFT operates on a batch settlement system. When you initiate a transfer, your instruction doesn't go directly to the recipient's bank. Instead it gets bundled with thousands of other transfer instructions and sent in batches.

RBI processes these batches at scheduled intervals throughout the day. The recipient's bank receives the instruction in the next batch cycle and credits the amount.

**The catch:**

Batches. Everything depends on batches.

If you initiated a transfer at 3:45 PM and the next batch was at 4:00 PM, your money might arrive by evening. If you transferred after banking hours on a Friday, the recipient might not see the credit until Monday morning.

NEFT was also unavailable on bank holidays and had limited weekend hours for years, though RBI later made it 24/7 in 2019.

NEFT operates on hourly settlement cycles, with transfers typically completing in 30 minutes to a few hours. There's no minimum or maximum amount, and the service has run 24/7 since December 2019.

**Advantages:**

- Safe and bank-regulated
- No upper transaction limit
- Good for large non-urgent transfers

**Disadvantages:**

- Batch processing means delays
- Not suitable for urgent transfers
- Required internet banking setup which most people lacked

---

## RTGS — Real Time Gross Settlement

RTGS was designed for one specific use case: large, urgent transfers.

Launched in 2004, it processes transactions individually and in real time, not in batches. Each transaction settles on its own, immediately.

The word "gross" in the name means exactly that. Gross settlement. One transaction at a time, settled completely before moving to the next.

**How RTGS works:**

When you initiate an RTGS transfer, the instruction goes directly to RBI's central system. The system debits your bank and credits the destination bank immediately, transaction by transaction. There is no waiting for a batch.

**The catch:**

RTGS has a minimum transfer amount of ₹2 lakh.

It was never designed for everyday transactions. Buying groceries, paying rent to a friend, splitting a dinner bill — RTGS wasn't built for any of that. It was built for high-value corporate transactions, property deals, and institutional transfers.

RTGS settles individual transactions in real time (within minutes), carries a minimum transfer amount of ₹2,00,000 with no upper limit, and has been available 24/7 since December 2020.

**Advantages:**

- Truly real-time for high-value transfers
- Zero settlement risk
- Ideal for corporate and institutional use

**Disadvantages:**

- ₹2 lakh minimum makes it useless for everyday payments
- Not accessible to most retail users
- Required full internet banking access

---

## IMPS — Immediate Payment Service

IMPS is where things started shifting toward what we have today.

Launched by NPCI in 2010, IMPS was the first system that allowed instant, 24/7 bank transfers for everyday amounts. No batch processing. No minimum of ₹2 lakh. No banking hours restriction.

You could transfer ₹500 to a friend at 11 PM on a Sunday and it would arrive in seconds.

**How IMPS works:**

IMPS uses a combination of the recipient's mobile number and MMID (Mobile Money Identifier), a 7-digit code issued by the bank — or directly uses the account number and IFSC code.

When you initiate a transfer, the instruction goes through NPCI's central switch. NPCI routes it to the destination bank, which credits the amount immediately. The settlement happens in real time, similar to RTGS, but without the high minimum amount.

IMPS supports transfers starting from as low as ₹1 up to around ₹5,00,000 depending on the bank, and is available 24/7 throughout the year.

**Advantages:**

- Instant transfers at any hour
- No minimum amount restriction
- Available on mobile and internet banking
- Works on holidays and weekends

**Disadvantages:**

- Required knowing the recipient's account number and IFSC or their MMID
- Banks charged transaction fees (usually ₹2.5 to ₹25)
- No unified interface — every bank had its own app or USSD flow
- Still required you to add a beneficiary and wait for activation in many cases

IMPS solved the speed problem. But it didn't solve the usability problem.

You still needed account numbers. You still paid fees. You still dealt with bank-specific apps that ranged from decent to genuinely painful to use.

And that gap — between what was technically possible and what was actually usable for a billion people — is exactly what UPI was built to close.

---

## Enter UPI

UPI (Unified Payments Interface) was launched by NPCI in April 2016.

The name tells you a lot. _Unified._ One interface. One system. Across every bank.

The goal wasn't to build another payment method. The goal was to build the layer that sits on top of all existing payment infrastructure and makes it invisible.

With UPI, you don't need to know someone's account number. You don't need their IFSC code. You don't need their MMID.

You just need their VPA.

---

## What Is a VPA?

VPA stands for Virtual Payment Address.

It looks something like `prakash@okicici` or `987654xxxx@paytm` or `name@ybl`.

It's an alias. A human-readable identifier that maps to a real bank account behind the scenes.

When someone shares their VPA with you, they're not sharing their account number. They're sharing a pointer that the UPI system knows how to resolve.

This single idea — the VPA — is arguably the most important design decision in UPI's architecture. It means:

- **Privacy:** your account number stays hidden
- **Simplicity:** people remember a VPA far more easily than a 16-digit account number
- **Flexibility:** one VPA can be linked to multiple bank accounts

---

## The Players in Every UPI Transaction

Before walking through a real transaction, you need to understand the four entities involved in every UPI payment.

**Payer:** The person sending money.

**Payee:** The person receiving money.

**PSP — Payment Service Provider:** The app you use. PhonePe, Google Pay, Paytm, BHIM — these are all PSPs. They provide the interface but they don't hold your money. They're licensed intermediaries.

**NPCI — National Payments Corporation of India:** The central switch. NPCI is the backbone of the entire UPI system. Every transaction passes through NPCI regardless of which PSP or bank is involved.

**Payer's Bank:** The bank where the sender's account lives.

**Payee's Bank:** The bank where the recipient's account lives.

All of these entities communicate with each other in a specific sequence every single time you make a UPI payment.

---

## How a UPI Payment Actually Works

Let me walk through exactly what happens from the moment you tap Pay to the moment you see "Payment Successful."

I'll use a real scenario. You're paying ₹500 to a friend. You open PhonePe, enter their VPA, type the amount, and hit Pay.

Here is what happens next.

---

### Step 1 — VPA Resolution

PhonePe (your PSP) takes the VPA you entered and sends a resolution request to NPCI.

NPCI looks up its VPA registry and identifies which bank that VPA belongs to. This is similar to a DNS lookup — you give it a readable address, it returns the actual destination.

NPCI responds with the payee bank details. PhonePe now knows where the money needs to go.

---

### Step 2 — You Enter Your UPI PIN

PhonePe prompts you to enter your UPI PIN.

This PIN was set by you when you registered your bank account on UPI. It never leaves your device in plain text.

Your UPI PIN is encrypted on-device using your bank's public key before it goes anywhere. The PSP (PhonePe) never sees your actual PIN. Only your bank can decrypt it.

---

### Step 3 — Transaction Request Sent to NPCI

PhonePe packages the transaction details:

- Your VPA (payer)
- Recipient's VPA (payee)
- Amount
- Encrypted UPI PIN
- Transaction reference ID
- Timestamp

This entire package is sent to NPCI over a secure encrypted channel.

---

### Step 4 — NPCI Routes to Payer's Bank

NPCI receives the request and routes it to your bank — the payer's bank.

Your bank receives the encrypted UPI PIN and decrypts it using its private key. This is where authentication actually happens. Your bank verifies:

- Is this the correct PIN for this account?
- Does this account have sufficient balance?
- Is this device registered for UPI on this account?
- Are there any fraud flags on this transaction?

If all checks pass, your bank sends an authentication success response back to NPCI. If anything fails — wrong PIN, insufficient balance, suspicious activity — your bank sends a failure response and the transaction stops here.

---

### Step 5 — NPCI Sends Debit Instruction

Once NPCI receives authentication success from your bank, it sends a debit instruction back to your bank.

Your bank deducts ₹500 from your account.

The money is now in transit — debited from your side but not yet credited to the recipient.

---

### Step 6 — NPCI Sends Credit Instruction

Simultaneously, NPCI sends a credit instruction to the payee's bank.

The payee's bank receives the instruction and credits ₹500 to the recipient's account.

---

### Step 7 — Confirmation Flow

Both banks send confirmation messages back to NPCI.

NPCI consolidates the confirmations and sends a final success response to PhonePe. PhonePe shows you "Payment Successful." Your friend's phone buzzes with a credit notification.

Total time elapsed: 2 to 5 seconds.

### Transaction timeline

To make the flow concrete, here is a tighter timeline for a ₹500 payment that typically finishes in under five seconds:

- **0.0s** — You open your PSP, enter the payee VPA and amount, and tap Pay.
- **0.1s** — The PSP sends a VPA resolution request to NPCI and receives the payee bank identifier (similar to a DNS lookup).
- **0.2s** — PSP prompts for your UPI PIN; you enter it and the PSP encrypts it with the payer bank's public key on-device.
- **0.3s** — PSP sends a signed/encrypted transaction packet to NPCI containing payer/payee VPAs, amount, timestamp, and the encrypted PIN.
- **0.4s** — NPCI forwards an authentication request to the payer bank. The payer bank decrypts the PIN, validates device binding and balance, and replies with success or failure.
- **0.6s** — On success, NPCI issues a debit instruction to the payer bank and a credit instruction to the payee bank (processed in parallel).
- **0.8s** — Both banks update their ledgers; confirmations are sent back to NPCI.
- **1.0s** — NPCI aggregates confirmations and returns a final success to the PSP, which displays "Payment Successful." (Network conditions, load, and bank processing can extend this to a few seconds.)

This example simplifies retries, timeouts, and queuing that can occur under high load, but it captures the critical, time-sensitive path of a typical UPI payment.

---

## The Authentication Layer

The UPI PIN mechanism is worth understanding more deeply because it's what makes UPI both secure and usable at scale.

When you first set up UPI on any PSP, you go through a one-time device binding process:

- You enter your debit card's last 6 digits and expiry date
- Your bank sends an OTP to your registered mobile number
- You verify the OTP
- You set a 4 or 6-digit UPI PIN

From this point forward, your device is registered. Your SIM is verified. Your PIN is set.

Every transaction uses this PIN encrypted with your bank's public key. The PSP is just a messenger. It carries the encrypted payload but cannot read it.

This design means even if a PSP is compromised, your bank credentials remain safe. The actual authentication always happens between your bank and NPCI — not inside the PSP app.

## Security & Fraud Mitigation

UPI's security model combines device binding, on-device encryption, and strong bank-side checks:

- **Device binding & SIM verification:** the initial UPI setup ties a device (and usually the SIM) to your bank account, reducing remote account takeovers.
- **Encrypted UPI PIN:** your PIN is encrypted with the bank's public key on the device; PSPs relay but cannot read it.
- **Transaction limits & velocity checks:** banks and NPCI enforce per-transaction and daily limits, and inspect transaction velocity to detect anomalies.
- **Tokenization and merchant authorization:** many PSPs use one-time tokens or QR-derived transaction references, so merchant systems never see your raw credentials.
- **Dispute & reversal flow:** if a merchant fails to deliver or a wrong transfer occurs, banks and NPCI provide dispute resolution channels; preserve transaction IDs and timestamps when filing disputes.

Even with these layers, users should keep their devices updated, avoid installing untrusted apps, and never share OTPs or UPI PINs.

Scale has brought fraud along with it: industry reporting on UPI fraud losses shows they fell from roughly ₹1,087 crore in FY2023–24 to about ₹485 crore in FY2024–25, even as transaction volumes grew sharply — suggesting fraud-control measures are improving faster than fraud attempts, though incident counts (over 6.32 lakh cases reported in the early months of FY2024–25) remain high in absolute terms.

---

## UPI in 2026: The Numbers, and Where It's Headed

The original UPI story ends around 2020. It's worth updating, because the system hasn't stood still.

**Scale today:** UPI processed roughly 23.2 billion transactions worth about ₹29.9 lakh crore in May 2026 alone — an all-time high at the time, averaging over 737 million transactions a day. June 2026 pushed volumes past 22 billion transactions for the month, up 23% year-on-year. Zoom out further and FY2025-26 volume reached about 24,162 crore (241.62 billion) transactions for the year, roughly a 12,000-fold increase from UPI's first year of operation in FY2016-17.

**Who's using it:** More than 700 banks are now live on UPI, up from just 44 in its first year. UPI now accounts for roughly 85% of India's retail digital payments by FY2025-26, and India alone represents close to half of the world's real-time payment transaction volume globally — more than three times the share of Brazil's Pix system.

**The duopoly is cracking:** For years, PhonePe and Google Pay together controlled well over 90% of UPI volume. That combined share slipped below 80% for the first time in May 2026, partly due to NPCI's push to cap any single app's market share at 30% (a rule scheduled to take effect from late 2026) and its approval of 20 additional third-party app providers to diversify the ecosystem.

**Beyond India's borders:** UPI now works in eight-plus countries including the UAE, Singapore, France, Mauritius, Sri Lanka, Nepal, Bhutan, and Greece, with a UPI-based remittance corridor recently launched connecting Greece to India. The IMF has formally recognized UPI as the world's largest retail fast-payment system by transaction volume.

**Filling in the gaps:** Newer additions like UPI Lite (for small offline-friendly transactions without hitting a bank's per-transaction processing load), UPI 123PAY (IVR-based payments for feature phones), and Credit Line/Credit Card on UPI (letting credit products ride the same rails) show the system is still being extended to users and use-cases the original 2016 design didn't fully cover.

None of this changes the mechanics described above — VPA resolution, PIN encryption, and the NPCI-mediated debit/credit dance are still exactly how a transaction settles. What's changed is reach: more banks, more countries, more apps, and more of daily life running through this one interface.

---

## Why UPI Succeeded Where Others Didn't

- NEFT required knowing account numbers and IFSC codes.
- IMPS required either MMID or account details and still charged fees.
- RTGS required a ₹2 lakh minimum.
- UPI required none of that. A VPA. A PIN. Done.

The abstraction layer UPI introduced — VPAs sitting on top of account numbers, PSPs sitting on top of banks, all connected through NPCI — made the complexity invisible.

The tea stall owner with his printed QR code doesn't know what NPCI is. He doesn't know what VPA resolution means. He doesn't know his payment flows through IMPS rails underneath.

He just knows money arrives in three seconds.

That's the real achievement.

---

## Conclusion

Every time you tap Pay on PhonePe or Google Pay, a surprisingly deep chain of events fires in under five seconds.

Your VPA gets resolved. Your PIN gets encrypted on your device. NPCI authenticates through your bank. Two instructions travel simultaneously — one to debit your account, one to credit theirs. Confirmations flow back. You see a green checkmark.

NEFT gave India digital transfers. IMPS gave India instant transfers. UPI gave India invisible transfers — and a decade later, it's on its way to becoming a global one.

The infrastructure evolved over two decades to reach a point where a retired tea stall owner and a software engineer can use the exact same system without either of them needing to understand it.

That's what good infrastructure looks like.

And the next time your payment succeeds in three seconds, you'll know exactly what happened.

---

## References

- NPCI official UPI page: https://www.npci.org.in
- RBI payments system overview: https://www.rbi.org.in
- BHIM information: https://www.mygov.in
- NPCI product statistics: https://www.npci.org.in/product/upi/product-statistics
- NPCI, "UPI completes 10 glorious years" (decade report), via PIB Ministry of Finance, 2026
- IBEF UPI transaction reporting, May–June 2026

---

_Prakash Raj_
