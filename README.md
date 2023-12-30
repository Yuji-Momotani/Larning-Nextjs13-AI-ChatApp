This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 学んだこと

Udemy 教材で学習したソースコードです。
[【AI チャットアプリ開発】Next.js & Firebase & ChatGPT API を使った Web アプリ開発講座](https://www.udemy.com/course/chatgpt-api-chatapplication-webapp/)

### Next.js-13

#### ルーティング

src/app ディレクトリ配下に page.tsx(js)ファイルを作成すればディレクトリ構成から自動でルーティングしてくれる。
例：src/app/auth/login/page.tsx → localhost:3000/auth/login

##### useRouter

- import

```js
import { useRouter } from "next/navigation";
```

app ディレクトリ配下では、next/router ではなく、next/navigation から import する必要がある。
[参考記事](https://zenn.dev/masaya0521/articles/5bb95c5ac593b9)
[ドキュメント](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-4-migrating-routing-hooks:~:text=next/router.-,The,directory%20but%20can%20continue%20to%20be%20used%20in%20the%20pages%20directory.,-The%20new%20useRouter)
pages ディレクトリ配下（Nextjs13 より前のバージョンのディレクトリ構成）では引き続き next/router が使用できる。

- 使用方法

```js
const router = useRouter();
...

// /auth/loginに遷移
router.push("/auth/login");
```

##### Link

- import

```js
import Link from "next/link";
```

- 使用方法

```js
// /auth/loginに遷移
<Link href={"/auth/login"}>ログインページへ</Link>
```

### react-hook-form

#### Install

[ドキュメント参照](https://react-hook-form.com/get-started)

```sh
npm install react-hook-form
```

- 使い方
  メールアドレス•パスワードの場合

```js
// 定義
type Inputs = {
		email: string;
		password: string;
	}
const {
	register,
	handleSubmit,
	formState:{errors}
} = useForm<Inputs>();

...

// formのonSubmitにhandleSubmitを仕込む
<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
...
// onSubmitは定義する
const onSubmit: SubmitHandler<Inputs> = async(data) => {
	// ここでsubmitが飛んだ時の処理をつらつら
	...
}
....

// input属性に仕込む　＆　エラーがあったらメッセージを表示
<input {...register("email", {
		required: true,
	})} type="text" id='email' className="mt-1 border-2 rounded-md w-full p-2" />
	{errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}

...

// requiredにエラーメッセージも定義できる。
<input {...register("email", {
		// required: true,
		required: "メールアドレスは必須です。",
	})} type="text" id='email' className="mt-1 border-2 rounded-md w-full p-2" />
	{errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
```

＊注意：useForm は CSR でないと使用できないため、Next.js を使用している場合は、"use client"を定義してやること。
ds

### icon 系

#### [react-icons](https://react-icons.github.io/react-icons/)

Font-Awesome よりもっと手軽に使える。

##### 使用方法

- プロジェクトにインストール

```sh
npm install react-icons --save
```

- import と使用

```js
// import
import { FaBeer } from "react-icons/fa";

// use
<FaBeer />;
```

#### [react-loading-icons](https://www.npmjs.com/package/react-loading-icons)

React で使用できるローディング用の icon。

##### 使用方法

- プロジェクトにインストール

```sh
npm i react-loading-icons
```

- import と使用

```js
// import
import LoadingIcons from "react-loading-icons";

// use
<LoadingIcons.Bars />;
```

### OpneAI API（メイン）

#### 準備

- [OpneAI のトップページ](https://openai.com/)に遷移し、ログイン後、[API のページ](https://platform.openai.com/docs/overview)へ遷移する。
- [API keys](https://platform.openai.com/api-keys)でシークレットキーを取得
- 環境変数ファイル（.env）にシークレットキーを任意の名称で追加。ただし、今回のアプリケーションは基本的に CSR で開発した。Next.js ではデフォルトで環境変数は Node.js 環境でのみ使用できる。環境変数をクライアント側で使用するには、`NEXT_PUBLIC_`を先頭につける必要がある。→[参考](https://zenn.dev/hisayuki_mori/articles/environment-variables-for-nextjs)

#### Install してインスタンス化

- [ドキュメント](https://platform.openai.com/docs/api-reference/introduction)を参考にインストールする。

```sh
npm install openai@^4.0.0
npm install openai
```

- import する

```js

```

- インスタンス化

```js
const opneai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});
```

`apiKey`は先ほど作成したシークレットキーのこと。
`dangerouslyAllowBrowser`はクライアント側でシークレットキーを使用する場合は、true にしてあげないとエラーが発生する。

#### 使用例

```js
const gpt3Response = await opneai.chat.completions.create({
  messages: [{ role: "user", content: inputMessage }],
  model: "gpt-3.5-turbo",
});
```

model に gpt の他モデルを指定することで別のモデルも使用可。

### その他参考になったこと。

#### アプリケーション全体の状態管理

- createContext, useContext の使用方法について、AppContext 内で両方関数を使って使いやすくしている。
  src/context/AppContext.tsx

#### チャットが追加されるたびに自動でスクロールする。

src/app/components/Chat.tsx

```js
// useRefと以下の組み合わせていける

useEffect(() => {
  if (scrollDiv.current) {
    const element = scrollDiv.current;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }
}, [messages]);
```
