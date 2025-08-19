import bcrypt from 'bcryptjs'
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev_secret_change_me'
const COOKIE_NAME = 'sf_token'

export async function hashPassword(plain: string): Promise<string> {
	const salt = await bcrypt.genSalt(10)
	return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return bcrypt.compare(plain, hash)
}

export function signJwt(payload: object, expiresIn: number = 60 * 60 * 24 * 7): string {
	const options: SignOptions = { expiresIn }
	return jwt.sign(payload as any, JWT_SECRET, options)
}

export function verifyJwt<T = any>(token: string): T | null {
	try {
		return jwt.verify(token, JWT_SECRET) as T
	} catch {
		return null
	}
}

export function setAuthCookie(token: string) {
	cookies().set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
}

export function clearAuthCookie() {
	cookies().delete(COOKIE_NAME)
}

export function getTokenFromCookie(): string | null {
	return cookies().get(COOKIE_NAME)?.value || null
}
