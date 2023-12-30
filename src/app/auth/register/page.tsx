"use client";

import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inputs = {
	email: string;
	password: string;
}

const Register = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState:{errors}
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> =async (data) => {
		// console.log(data);
		await createUserWithEmailAndPassword(auth, data.email, data.password)
		.then((userCredential) => {
			// Signed in 
			const user = userCredential.user;
			// console.log(user);
			router.push("/auth/login")
		})
		.catch((error) => {
			if (error.code == "auth/email-already-in-use") {
				alert("既に存在するユーザーです。");
			} else {
				alert(error.message);
			}
		});
	
	}
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
				<h1 className="mb-4 text-2xl text-gray-700 font-medium">新規登録</h1>
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-medium text-gray-600">
						Email
					</label>
					<input {...register("email", {
						// required: true,
						required: "メールアドレスは必須です。",
						pattern: {
							value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
							message: "不適切なメールアドレスです。",
						}
					})} type="text" id='email' className="mt-1 border-2 rounded-md w-full p-2" />
					{errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-600">
						Password
					</label>
					<input {...register("password", {
						// required: true,
						required: "パスワードは必須です。",
						minLength:{
							value: 6,
							message: "6文字以上を設定してください。"
						}
					})}					
					type="password" id='password' className="mt-1 border-2 rounded-md w-full p-2"/>
					{errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}
				</div>
				<div className="flex justify-end">
					<button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
						新規登録
					</button>
				</div>
				<div className="mt-4">
					<span className="text-gray-600 text-xs">既にアカウントをお持ちですか？</span>
					<Link href={"/auth/login"} className="text-blue-500 text-xs font-bold ml-1 hover:text-blue-700">ログインページへ</Link>
				</div>
			</form>
		</div>
	)
}

export default Register