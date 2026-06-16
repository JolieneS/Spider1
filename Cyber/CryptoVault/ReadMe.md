# CryptoVault

A command-line file encryption tool built in Python.
Implements cryptographic concepts from Caesar cipher to AES-256.

## Setup

Install the required library:

pip install cryptography

## How to use

### Encrypt a file
python cryptovault.py encrypt message.txt

### Decrypt a file
python cryptovault.py decrypt message.txt.enc

### Crack a Caesar cipher
python cryptovault.py crack cipher.txt

## What is built

| Stage | What it does | Status |
|-------|-------------|--------|
| Stage 1 | Caesar cipher with frequency analysis cracker | Done |
| Stage 2 | SHA-256 hash integrity check | Done |
| Stage 3 | AES-256-CBC encryption with PBKDF2 key derivation | Done (Bonus) |

## Files

- cryptovault.py — the main tool
- Jolie_RollNo_CryptoVault.md — write-up explaining each stage
