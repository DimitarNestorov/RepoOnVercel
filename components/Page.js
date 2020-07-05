import Head from 'next/head'

import { name as repoName } from '../loader!../repo'

export default function Page({ children, title }) {
	return (
		<>
			<Head>
				<title>{title ? `${title} - ${repoName}` : repoName}</title>
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
