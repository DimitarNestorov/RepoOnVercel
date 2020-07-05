import { useRef } from 'react'

import Page from '../components/Page'
import { getRepoUrl } from '../utils'

export default function Home({ repoURL }) {
	const inputRef = useRef()
	return (
		<Page>
			<a href={`cydia://url/https://cydia.saurik.com/api/share#?source=${repoURL}`}>Add to Cydia</a>
			<a href={`zbra://sources/add/${repoURL}`}>Add to Zebra</a>
			<a href={`sileo://source/${repoURL}`}>Add to Sileo</a>
			{/* <a href={`installer://add/repo=${repoURL}`}>Add to Installer</a> */}

			<input
				value={repoURL}
				readOnly
				ref={inputRef}
				onClick={() => inputRef.current.setSelectionRange(0, repoURL.length)}
			/>
			<button onClick={() => navigator.clipboard.writeText(repoURL)}>Copy</button>
		</Page>
	)
}

Home.getInitialProps = ({ req }) => ({
	repoURL: getRepoUrl(req),
})
