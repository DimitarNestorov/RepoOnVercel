import Links from './Links'
import Page from './Page'
import Section, { SectionPadding } from './Section'

import { icons } from '../loader!../repo'

export default function Depiction({ children, name, subtitle, github }) {
	return (
		<Page title={name}>
			<style jsx>{`
				.title {
					margin: 16px 0;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.title > img {
					width: 48px;
					height: 48px;
				}

				.titles {
					margin: 0 0 0 8px;
					text-align: center;
				}

				.titles > h1 {
					font-size: 24px;
					margin: 0;
				}

				.titles > h2 {
					font-size: 12px;
					margin: 0;
					font-weight: 400;
				}
			`}</style>
			<div className="title">
				<img src={icons[name]} alt={`${name} icon`} />
				<div className="titles">
					<h1>{name}</h1>
					{subtitle && <h2>{subtitle}</h2>}
				</div>
			</div>
			<Section>
				<SectionPadding>{children}</SectionPadding>
			</Section>
			<Links>
				{[
					{ icon: '/assets/link-icons/PayPal.png', label: 'PayPal', href: 'https://www.paypal.me/' },
					{ icon: '/assets/link-icons/Discord.png', label: 'Discord', href: 'https://discord.gg/' },
					{ icon: '/assets/link-icons/Twitter.png', label: 'Twitter', href: 'https://twitter.com/' },
					{ icon: '/assets/link-icons/GitHub.png', label: 'GitHub', href: github },
				]}
			</Links>
		</Page>
	)
}
