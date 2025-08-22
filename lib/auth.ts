import bcrypt from 'bcryptjs'
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

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

// New utility functions for user management
export async function getCurrentUser() {
	const token = getTokenFromCookie()
	if (!token) return null
	
	const payload = verifyJwt<{ uid: string; email: string }>(token)
	if (!payload) return null
	
	try {
		const user = await prisma.user.findUnique({
			where: { id: payload.uid },
			select: {
				id: true,
				email: true,
				name: true,
				premium: true,
				stripeCustomerId: true,
				createdAt: true
			}
		})
		return user
	} catch (error) {
		console.error('Error fetching user:', error)
		return null
	}
}

export async function createUser(email: string, password: string, name?: string) {
	try {
		const passwordHash = await hashPassword(password)
		const user = await prisma.user.create({
			data: {
				email,
				name: name || '',
				passwordHash
			},
			select: {
				id: true,
				email: true,
				name: true,
				premium: true,
				createdAt: true
			}
		})
		return user
	} catch (error) {
		console.error('Error creating user:', error)
		throw error
	}
}

export async function authenticateUser(email: string, password: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				name: true,
				premium: true,
				passwordHash: true
			}
		})
		
		if (!user || !user.passwordHash) {
			return null
		}
		
		const isValid = await verifyPassword(password, user.passwordHash)
		if (!isValid) {
			return null
		}
		
		const { passwordHash, ...userWithoutPassword } = user
		return userWithoutPassword
	} catch (error) {
		console.error('Error authenticating user:', error)
		return null
	}
}

export async function updateUserPremiumStatus(userId: string, premium: boolean, stripeCustomerId?: string) {
	try {
		const updateData: any = { premium }
		if (stripeCustomerId) {
			updateData.stripeCustomerId = stripeCustomerId
		}
		
		const user = await prisma.user.update({
			where: { id: userId },
			data: updateData,
			select: {
				id: true,
				email: true,
				name: true,
				premium: true,
				stripeCustomerId: true
			}
		})
		return user
	} catch (error) {
		console.error('Error updating user premium status:', error)
		throw error
	}
}
