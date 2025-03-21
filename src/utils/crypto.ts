import bcrypt from "bcryptjs";

export const sha256 = async (message: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const randomHex = (length: number) => {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(length))).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const toBase64 = (buffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export const toBcrypt = async (password: string) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hashSync(password, salt);
}

export const generateKeyPair = async () => {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512"
        },
        true,
        ["encrypt", "decrypt"]
    );

    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);

    return {
        publicKey: toBase64(exportedPublicKey),
        privateKey: toBase64(exportedPrivateKey)
    }
}