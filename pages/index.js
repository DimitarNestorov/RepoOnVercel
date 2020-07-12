import { useRef } from 'react'

import { name as repoName } from '../loader!../repo'
import Page from '../components/Page'
import { getRepoUrl } from '../utils'

export default function Home({ repoURL }) {
	const inputRef = useRef()
	return (
		<Page>
			<style jsx>{`
				h1 {
					text-align: center;
					margin-bottom: 40px;
				}

				.package-manager {
					display: flex;
					align-items: center;
					color: white;
					text-align: center;
					background-color: #1b5538;
					margin: 16px auto;
					width: 220px;
					border-radius: 14px;
					font-size: 22px;
					text-decoration: none;
				}

				.package-manager > span {
					flex-grow: 1;
					margin-right: 8px;
				}

				.package-manager::before {
					content: '';
					background-repeat: no-repeat;
					width: 36px;
					height: 36px;
					margin: 8px 0 8px 8px;
					background-size: contain;
				}

				.package-manager.cydia::before {
					background-image: url('/package-managers/Cydia.png');
				}
				.package-manager.zebra::before {
					background-image: url('/package-managers/Zebra.png');
				}
				.package-manager.sileo::before {
					background-image: url('/package-managers/Sileo.png');
				}

				.input-container {
					width: 300px;
					position: relative;
					margin: 32px auto;
				}

				.input-container > input {
					border: 0 none;
					padding: 0;
					padding: 12px;
					font-size: 18px;
					height: 54px;
					width: 100%;
					border-radius: 12px;
					flex-grow: 1;
				}

				.input-container > button {
					font-size: 16px;
					position: absolute;
					height: 30px;
					right: 12px;
					top: 12px;
					padding: 4px 6px;
					border-radius: 6px;
					border: 1px solid black;
				}
			`}</style>

			<h1>{repoName}</h1>

			<a
				href={`cydia://url/https://cydia.saurik.com/api/share#?source=${repoURL}`}
				className="package-manager cydia"
			>
				<span>Add to Cydia</span>
			</a>
			<a href={`zbra://sources/add/${repoURL}`} className="package-manager zebra">
				<span>Add to Zebra</span>
			</a>
			<a href={`sileo://source/${repoURL}`} className="package-manager sileo">
				<span>Add to Sileo</span>
			</a>
			{/* <a href={`installer://add/repo=${repoURL}`}>Add to Installer</a> */}

			<div className="input-container">
				<input
					value={repoURL}
					readOnly
					ref={inputRef}
					onClick={() => {
						inputRef.current.select()
						inputRef.current.setSelectionRange(0, repoURL.length)
					}}
				/>
				<button
					onClick={() => {
						if (navigator.clipboard && navigator.clipboard.writeText) {
							navigator.clipboard.writeText(repoURL)
						} else {
							inputRef.current.select()
							inputRef.current.setSelectionRange(0, repoURL.length)
							document.execCommand('copy')
						}
					}}
				>
					Copy
				</button>
			</div>
		</Page>
	)
}

Home.getInitialProps = ({ req }) => ({
	repoURL: getRepoUrl(req),
})
