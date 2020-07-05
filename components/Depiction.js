import Page from './Page'

import { icons } from '../loader!../repo'

export default function Depiction({ children, name }) {
	return (
		<Page title={name}>
			<style jsx global>{`
				body {
					padding: 16px;
				}
			`}</style>
			<h1 className="title">{name}</h1>
			{children}
		</Page>
	)
}
