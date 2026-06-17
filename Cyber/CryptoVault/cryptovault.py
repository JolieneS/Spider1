import sys
import collections
import hashlib
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.backends import default_backend

def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
        else:
            result += char
    return result

def caesar_decrypt(text, shift):
    return caesar_encrypt(text, -shift)

def crack_caesar(ciphertext):
    counts = collections.Counter(c.lower() for c in ciphertext if c.isalpha())
    most_common = counts.most_common(1)[0][0]
    print("\nTop 3 likely plaintexts:\n")
    for assumed in ['e', 't', 'a']:
        shift = (ord(most_common) - ord(assumed)) % 26
        result = caesar_encrypt(ciphertext, -shift)
        print(f"  Shift {shift}: {result[:120]}")
        print()

def compute_hash(text):
    return hashlib.sha256(text.encode()).hexdigest()

def derive_key(password, salt):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

def aes_encrypt(data, password):
    salt = os.urandom(16)
    iv   = os.urandom(16)
    key  = derive_key(password, salt)
    padder = padding.PKCS7(128).padder()
    padded = padder.update(data.encode()) + padder.finalize()
    cipher    = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded) + encryptor.finalize()
    return salt, iv, encrypted

def aes_decrypt(salt, iv, encrypted, password):
    key = derive_key(password, salt)
    cipher    = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded    = decryptor.update(encrypted) + decryptor.finalize()
    unpadder   = padding.PKCS7(128).unpadder()
    data_bytes = unpadder.update(padded) + unpadder.finalize()
    return data_bytes.decode()

def main():
    command  = sys.argv[1]
    filename = sys.argv[2]

    if command == "encrypt":
        password = input("Enter password: ")
        with open(filename, 'r') as f:
            text = f.read()
        file_hash           = compute_hash(text)
        salt, iv, encrypted = aes_encrypt(text, password)
        outfile = filename + ".enc"
        with open(outfile, 'w') as f:
            f.write(file_hash  + "\n")
            f.write(salt.hex() + "\n")
            f.write(iv.hex()   + "\n")
            f.write(encrypted.hex())
        print(f"Encrypted -> {outfile}")
        print(f"Hash: {file_hash[:30]}...")

    elif command == "decrypt":
        password = input("Enter password: ")
        with open(filename, 'r') as f:
            stored_hash = f.readline().strip()
            salt        = bytes.fromhex(f.readline().strip())
            iv          = bytes.fromhex(f.readline().strip())
            encrypted   = bytes.fromhex(f.read().strip())
        decrypted   = aes_decrypt(salt, iv, encrypted, password)
        actual_hash = compute_hash(decrypted)
        print("Decrypted:")
        print(decrypted)
        if actual_hash == stored_hash:
            print("\n Integrity check PASSED - file not tampered")
        else:
            print("\n  TAMPER WARNING - file has been modified!")

    elif command == "crack":
        with open(filename, 'r') as f:
            text = f.read()
        crack_caesar(text)

main()
