import Page from '../components/Page'
import { getRepoUrl } from '../utils'

export default function Home({ repoURL }) {
	return (
		<Page>
			<a href={`cydia://url/https://cydia.saurik.com/api/share#?source=${repoURL}`}>Add to Cydia</a>
			<a href={`zbra://sources/add/${repoURL}`}>Add to Zebra</a>
			<a href={`installer://add/repo=${repoURL}`}>Add to Installer</a>
			<a href={`sileo://source/${repoURL}`}>Add to Sileo</a>
		</Page>
	)
}

Home.getInitialProps = ({ req }) => ({
	repoURL: getRepoUrl(req),
})
