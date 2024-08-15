import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	Query,
} from 'react-native-appwrite'

export const appwriteConfig = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.smart.aora',
	projectId: '66bc780b00193dda1a49',
	databaseId: '66bc7a69000d2036a2a3',
	userCollectionId: '66bc7aa200120a59982a',
	videoCollectionId: '66bc7ad9001ea0b155ae',
	storageId: '66bc7d160001b3031aeb',
}

// Init your react-native SDK
const client = new Client()

client
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId)
	.setPlatform(appwriteConfig.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

// Register user
export async function createUser(email, password, username) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		)

		if (!newAccount) throw Error

		const avatarUrl = avatars.getInitials(username)

		await signIn(email, password)

		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email: email,
				username: username,
				avatar: avatarUrl,
			}
		)

		return newUser
	} catch (error) {
		throw new Error(error)
	}
}

// Sign In
export async function signIn(email, password) {
	try {
		const session = await account.createEmailSession(email, password)

		return session
	} catch (error) {
		throw new Error(error)
	}
}

// Get Account
export async function getAccount() {
	try {
		const currentAccount = await account.get()

		return currentAccount
	} catch (error) {
		throw new Error(error)
	}
}

// Get Current User
export async function getCurrentUser() {
	try {
		const currentAccount = await getAccount()
		if (!currentAccount) throw Error

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		)

		if (!currentUser) throw Error

		return currentUser.documents[0]
	} catch (error) {
		console.log(error)
		return null
	}
}
