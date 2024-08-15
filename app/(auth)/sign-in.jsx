import { View, Text, ScrollView, Image, Dimensions, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'

import { images } from '../../constants'
import { signIn } from '../../lib/appwrite'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'

export default function SignIn() {
	const [form, setForm] = useState({
		email: '',
		password: '',
	})

	const [isSubmitting, setIsSubmitting] = useState(false)

	const { setUser, setIsLoggedIn } = useGlobalContext()

	const submit = async () => {
		if (form.email === '' || form.password === '') {
			Alert.alert('Error', 'Please fill in all fields')
		}

		setIsSubmitting(true)

		try {
			await signIn(form.email, form.password)
			const result = await getCurrentUser()
			setUser(result)
			setIsLoggedIn(true)

			Alert.alert('Success', 'User signed in successfully')
			router.replace('/home')
		} catch (error) {
			Alert.alert('Error', error.message)
		} finally {
			setIsSubmitting(false)
		}
	}
	return (
		<SafeAreaView className='bg-primary h-full'>
			<ScrollView>
				<View
					className='w-full flex justify-center h-full px-4 my-6'
					style={{
						minHeight: Dimensions.get('window').height - 100,
					}}
				>
					<Image
						source={images.logo}
						resizeMode='contain'
						className='w-[115px] h-[34px]'
					/>

					<Text className='text-2xl font-semibold text-white mt-10 font-psemibold'>
						Sign in to Aora
					</Text>

					<FormField
						title='Email'
						value={form.email}
						handleChangeText={(e) => setForm({ ...form, email: e })}
						otherStyles='mt-7'
						keyboardType='email-address'
					/>

					<FormField
						title='Password'
						value={form.password}
						handleChangeText={(e) => setForm({ ...form, password: e })}
						otherStyles='mt-7'
					/>

					<CustomButton
						title='Sign in'
						handlePress={submit}
						containerStyles='mt-7'
						isLoading={isSubmitting}
					/>

					<View className='flex justify-center pt-5 flex-row gap-2'>
						<Text className='text-lg text-gray-100 font-pregular'>
							Don't have an account?
						</Text>
						<Link
							href='/sign-up'
							className='text-lg font-psemibold text-secondary'
						>
							Sign up
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
