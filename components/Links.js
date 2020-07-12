import Section from './Section'

export default function Links({ children }) {
	return (
		<Section>
			<div className="links">
				<style jsx>{`
					.links > a {
						height: 44px;
						padding: 0 12px;
						display: flex;
						align-items: center;
						border-bottom: 1px solid #333;
						font-size: 16px;
						font-weight: 300;
					}

					.links > a:last-child {
						border-bottom: 0 none;
					}

					.links > a > img {
						width: 29px;
						height: 29px;
						margin-right: 8px;
					}
				`}</style>
				{children.map(
					(link, i) =>
						link.href && (
							<a href={link.href} key={i} target="_blank">
								<img src={link.icon} alt={`${link.label} icon`} />
								<span>{link.label}</span>
							</a>
						),
				)}
			</div>
		</Section>
	)
}
