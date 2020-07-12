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
					margin-bottom: 100px;
				}

				.package-manager {
					display: flex;
					align-items: center;
					color: white;
					text-align: center;
					background-color: #000000;
					border: 1px solid rgba(255, 255, 255, 0.5);
					margin: 10px auto;
					width: 200px;
					border-radius: 14px;
					font-size: 20px;
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
					margin: 6px 0 6px 6px;
					background-size: contain;
				}

				.package-manager.cydia::before {
					background-image: url('/assets/package-managers/Cydia.png');
				}
				.package-manager.zebra::before {
					background-image: url('/assets/package-managers/Zebra.png');
				}
				.package-manager.sileo::before {
					background-image: url('/assets/package-managers/Sileo.png');
				}

				.input-container {
					width: 320px;
					max-width: 90%;
					position: relative;
					margin: 32px auto;
				}

				.input-container > input {
					border: 0 none;
					padding: 0 68px 0 12px;
					font-size: 18px;
					height: 50px;
					width: 100%;
					border-radius: 12px;
					flex-grow: 1;
					background-color: #333333;
					color: #ffffff;
				}

				.input-container > button {
					font-size: 16px;
					position: absolute;
					height: 30px;
					right: 10px;
					top: 10px;
					padding: 6px 8px;
					border-radius: 6px;
					background-color: #1e90ff;
					color: #ffffff;
					border: 0 none;
					line-height: 16px;
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
