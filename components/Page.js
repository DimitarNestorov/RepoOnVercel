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
				* {
					box-sizing: border-box;
				}

				html {
					background-color: black;
					color: white;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
						'Open Sans', 'Helvetica Neue', sans-serif;
				}

				body {
					margin: 0;
				}
			`}</style>
			{children}
		</>
	)
}
