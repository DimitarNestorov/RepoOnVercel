import Head from 'next/head'

import { title as repoTitle } from '../loader!../repo'

export default function Page({ children, title }) {
	return (
		<>
			<Head>
				<title>{title ? `${title} - ${repoTitle}` : repoTitle}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<style jsx global>{`
				html {
					background-color: black;
					color: white;
				}

				body {
					margin: 0;
				}
			`}</style>
			{children}
		</>
	)
}
