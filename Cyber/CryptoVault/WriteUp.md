# CryptoVault — Write-up

---

## Stage 1 — Caesar Cipher

### What concept it implements
Caesar cipher is one of the oldest encryption techniques.
It shifts every letter in a file forward by a fixed number called the shift key.
With shift 3, A becomes D, B becomes E, and "Hello" becomes "Khoor".
To decrypt, we shift every letter backwards by the same number.

### What it protects against
It hides the meaning of a message from someone who glances at it casually.
A non-technical person cannot read it directly.

### What its limitations are
Caesar cipher is trivially breakable for two reasons:

First, only 26 possible shifts exist. A computer can try all 26 in milliseconds.
This is called a brute force attack.

Second, every language has patterns. In English, the letter E appears more than
any other letter in any paragraph. So in the encrypted text, whatever letter
appears most is probably E in disguise. The gap between that letter and E
reveals the shift without even trying all 26. This is called frequency analysis.

### Cracking the given ciphertext
The ciphertext given in the task was:
"Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj.
Fubswrjudskb lv wkh duw ri zulwlqj dqg vroylqj frghv."

Our crack command found shift 3 as the top result, which decrypts to:
"The quick brown fox jumps over the lazy dog.
Cryptography is the art of writing and solving codes."

---

## Stage 2 — Hash Guard

### What concept it implements
SHA-256 hashing for file integrity verification.
Before encrypting, we compute a SHA-256 hash of the original file.
A hash is a unique 64-character fingerprint of the file content.
Change even one letter and the fingerprint completely changes.
We store this fingerprint on line 1 of the .enc file.
On decryption, we recompute the hash and compare it to the stored one.
If they match, the file is safe. If they do not match, we print a tamper warning.

### What it protects against
Tampering. If anyone opens the .enc file and changes even one character,
the fingerprint will not match and we immediately know the file was modified.

Encryption gives confidentiality — it hides the content.
Hashing gives integrity — it detects if the content was changed.
You need both because encryption alone does not tell you if someone
secretly modified the encrypted file before you decrypted it.

### What its limitations are
SHA-256 alone is not enough in a real system. If an attacker modifies
the file AND recomputes a new hash to replace the stored one, we would
not detect it. A production system would use HMAC — a hash that requires
a secret key — so only someone with the key can produce a valid hash.

---

## Stage 3 (Bonus) — AES-256 Encryption

### What concept it implements
AES-256-CBC symmetric encryption with PBKDF2 key derivation.
This replaces Caesar cipher with real encryption used by banks,
WhatsApp, and governments. AES scrambles the entire file using
complex math with a 32-byte key. Breaking it by brute force
would take longer than the age of the universe.

### What it protects against
It protects against anyone reading the file without the password.
Even if someone steals the .enc file, they cannot read it without
knowing the exact password used to encrypt it.

### Why we do not use the raw password as the key
You cannot use "hello123" directly as an AES key.
It is too short (AES needs exactly 32 bytes) and too weak.
PBKDF2 solves this by taking your password, mixing in a random salt,
and running a hash function 100,000 times to produce a strong 32-byte key.
This makes brute force attacks 100,000 times slower.

### What Salt is and why we need it
Salt is a random 16-byte value generated fresh every single encryption.
It is mixed with the password during key derivation.
Even if two people use the exact same password, different salts give
completely different keys. This prevents rainbow table attacks where
an attacker precomputes hashes of common passwords.
Salt is stored in the .enc file so we can recreate the same key during decryption.

### What IV is and why we need it
IV stands for Initialization Vector. AES-CBC mode needs a random
starting point for each encryption. Without it, encrypting the same
file twice with the same key gives identical output every time.
An attacker who sees two identical outputs knows the files are the same.
With a random IV, the same file encrypted twice gives completely
different output every time. IV is stored in the .enc file because
we need it during decryption.

### What goes wrong if IV is reused
If you use the same IV and the same key to encrypt two different files,
an attacker can XOR the two ciphertexts together and extract information
about both original files. This is why we always generate a fresh
random IV for every single encryption.

### What PBKDF2 adds that plain hashing does not
A plain SHA-256 hash of a password is instant to compute.
An attacker with a powerful computer can try billions of passwords
per second until they find the right one.
PBKDF2 with 100,000 iterations takes about 0.1 seconds per guess.
This reduces the attack speed by 100,000 times.
Combined with the salt, it makes brute force attacks completely impractical.

### What its limitations are
AES is symmetric — both the sender and receiver need the same password.
The problem is: how do you share that password safely in the first place?
If you send it over the internet, someone can intercept it.
This is called the key exchange problem and is what Stage 4 (RSA) solves.
