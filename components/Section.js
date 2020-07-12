export default function Section({ children }) {
	return (
		<div className="section">
			<style jsx>{`
				.section {
					background-color: #222222;
					margin: 16px 0;
					border-radius: 8px;
				}
			`}</style>
			{children}
		</div>
	)
}

export function SectionPadding({ children }) {
	return (
		<div className="padding">
			<style jsx>{`
				.padding {
					padding: 12px;
				}
			`}</style>
			{children}
		</div>
	)
}
