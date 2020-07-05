import Page from './Page'

export default function Depiction({ children, name }) {
	return (
		<Page title={name}>
			<h1 className="title">{name}</h1>
			{children}
		</Page>
	)
}
