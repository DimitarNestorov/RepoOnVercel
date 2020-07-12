import Depiction from '../components/Depiction'

export default function Red() {
	return (
		<Depiction
			name="Red"
			github="https://github.com/dimitarnestorov/RepoOnVercel/tree/example-tweak-red"
			subtitle="Reddest of them all"
		>
			Red is a <span style={{ color: 'red' }}>red</span> package.
		</Depiction>
	)
}
