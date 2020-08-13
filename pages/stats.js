import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { useMemo, useRef, useState, createContext, useContext, useEffect } from 'react'
import TimeAgo from 'timeago-react'

import Page from '../components/Page'

import { packages, icons } from '../loader!../repo'
import { urlRegexp } from '../utils'

let apolloClient

function createApolloClient(token) {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: new HttpLink({
			uri: 'https://api.github.com/graphql', // Server URL (must be absolute)
			// credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
			headers: {
				authorization: `bearer ${token}`,
			},
		}),
		cache: new InMemoryCache(),
		shouldBatch: true,
	})
}

function initializeApollo(token, initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient(token)

	if (initialState) {
		_apolloClient.cache.restore(initialState)
	}
	// For SSG and SSR always create a new Apollo Client
	if (typeof window === 'undefined') return _apolloClient
	// Create the Apollo Client once in the client
	if (!apolloClient) apolloClient = _apolloClient

	return _apolloClient
}

function useApollo(token, initialState) {
	return useMemo(() => initializeApollo(token, initialState), [token, initialState])
}

function hashCode(string) {
	var hash = 0,
		i,
		chr
	for (i = 0; i < string.length; i++) {
		chr = string.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return ('a' + hash).replace('a-', 'az')
}

function setObjectIfNotSet(object, key) {
	const currentValue = object[key]
	if (currentValue) return currentValue
	return (object[key] = {})
}

// owner -> repo -> tag -> asset
const resources = {}
const nodes = []
for (const i in packages) {
	const p = packages[i]

	for (const version in p) {
		const url = p[version].url
		const matches = url.match(urlRegexp)
		if (!matches) throw new Error(`Bad URL: ${url}`)

		const [, owner, repoName, tagName, assetName] = matches

		const ownerObject = setObjectIfNotSet(resources, owner)
		const repoObject = setObjectIfNotSet(ownerObject, repoName)
		const tagObject = setObjectIfNotSet(repoObject, tagName)
		tagObject[assetName] = hashCode(url)
	}

	nodes.push(<Package key={i} name={i} package={p} />)
}

const buildReleaseQuery = (hash, tagName, assetName) =>
	`${hash}: release(tagName: "${tagName}") {
		releaseAssets(name: "${assetName}", first: 1) {
			nodes {
				downloadCount
			}
		}
	}`

const queryParts = []
for (const owner in resources) {
	const ownerObject = resources[owner]
	for (const repoName in ownerObject) {
		const repoObject = ownerObject[repoName]
		queryParts.push(`${hashCode(`${owner}/${repoName}`)}: repository(owner: "${owner}", name: "${repoName}") {`)
		for (const tagName in repoObject) {
			const tagObject = repoObject[tagName]
			for (const assetName in tagObject) {
				const hash = tagObject[assetName]
				queryParts.push(buildReleaseQuery(hash, tagName, assetName))
			}
		}
		queryParts.push(`}`)
	}
}

const query = gql`
	query GetDownloads {
		${queryParts.join('')}

		rateLimit {
			limit
			cost
			remaining
			resetAt
		}
	}
`

const DataContext = createContext()

function Version({ version, url }) {
	const data = useContext(DataContext)

	return (
		<li>
			Version {version} has {data[hashCode(url)].releaseAssets.nodes[0].downloadCount} downloads
		</li>
	)
}

function Package({ package: p, name }) {
	const versions = []
	for (const i in p) {
		versions.push(<Version key={i} version={i} url={p[i].url} />)
	}

	return (
		<div className="tweak">
			<style jsx>{`
				.tweak {
					background-color: #272727;
					padding: 12px;
					margin: 10px 0;
					border-radius: 10px;
				}

				.tweakName {
					display: flex;
					align-items: center;
				}

				.tweakName > img {
					margin-right: 8px;
				}

				.tweakName > h3 {
					margin: 0;
				}

				ul {
					margin: 8px 0 0;
					padding-left: 20px;
					font-size: 18px;
				}
			`}</style>
			<div className="tweakName">
				{icons[name] && <img src={icons[name]} alt={`${name} icon`} width="40" height="40" />}
				<h3>{name}</h3>
			</div>
			<ul>{versions}</ul>
		</div>
	)
}

function Stats({ setState }) {
	const { loading, error, data } = useQuery(query)

	const flatData = useMemo(() => {
		const object = {}
		for (const i in data) {
			if (i === 'rateLimit') continue
			Object.assign(object, data[i])
		}
		return object
	}, [data])

	return (
		<>
			<style jsx>{`
				h1 {
					text-align: center;
				}

				details {
					opacity: 0.8;
				}

				details > ul {
					margin-top: 6px;
				}

				details > summary {
					cursor: pointer;
					padding: 4px;
					user-select: none;
				}
			`}</style>
			<h1>Statistics</h1>

			{error ? (
				<>
					<p style={{ color: 'red' }}>Error: {error.message}</p>
					<button
						onClick={() => {
							setState({ token: '' })
							destroyCookie(undefined, 'token')
						}}
					>
						Delete saved token
					</button>
				</>
			) : loading ? (
				'Loading…'
			) : (
				<DataContext.Provider value={flatData}>
					{nodes}
					<details>
						<summary>Rate limit</summary>
						<ul>
							<li>Limit: {data.rateLimit.limit}</li>
							<li>Cost: {data.rateLimit.cost}</li>
							<li>Remaining: {data.rateLimit.remaining}</li>
							<li>
								Remaining resets <TimeAgo datetime={data.rateLimit.resetAt} />
							</li>
						</ul>
					</details>
				</DataContext.Provider>
			)}
		</>
	)
}

function Provider({ state, children }) {
	const apolloClient = useApollo(state.token, state.initialState)
	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export default function GetToken({ token, initialState }) {
	const [state, setState] = useState({ token, initialState })
	const inputRef = useRef()

	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [setIsMounted])

	return (
		<Page title="Statistics">
			{state.token ? (
				<Provider state={state}>
					<Stats setState={setState} />
				</Provider>
			) : (
				<div>
					<style jsx>{`
						div {
							text-align: center;
							font-size: 18px;
						}
						div > * {
							margin: 8px 0;
						}
						a {
							display: block;
							margin: 32px 0 !important;
						}

						form {
							display: flex;
							align-items: center;
							justify-content: center;
						}

						input {
							border-radius: 16px;
							border: 0;
							padding: 0
								${typeof window !== 'undefined' && isMounted && navigator.clipboard ? '68px' : '16px'} 0
								12px;
							font-size: 16px;
							height: 32px;
							background-color: #222222;
							color: #ffffff;
							width: 248px;
							font-family: monospace;
						}

						button[type='button'] {
							height: 26px;
							border-radius: 13px;
							border: 0;
							padding: 0;
							width: 60px;
							font-size: 15px;
							margin-left: -63px;
							text-align: center;
							background-color: #000000;
							border: 1px solid #666666;
							color: #ffffff;
						}

						button[type='submit'] {
							height: 32px;
							border-radius: 16px;
							border: 0;
							padding: 0 16px;
							font-size: 16px;
							margin-left: 8px;
							background-color: #1e90ff;
							color: #ffffff;
						}
					`}</style>
					<a href="https://github.com/settings/tokens" target="_blank">
						Get a GitHub personal access token
					</a>
					<div>Enter your GitHub personal access token:</div>
					<form
						onSubmit={(event) => {
							event.preventDefault()
							const token = inputRef.current.value
							setCookie(undefined, 'token', token, { maxAge: 500000000 })
							setState({ token, initialState: state.initialState })
						}}
					>
						<input
							type="text"
							ref={inputRef}
							placeholder="76d80224611fc919a5d54f0ff9fba446cdec93ec"
							autoCorrect="off"
							autoComplete="off"
							autoCapitalize="off"
						/>
						{typeof window !== 'undefined' && isMounted && navigator.clipboard && (
							<button
								type="button"
								onClick={() =>
									navigator.clipboard
										.readText()
										.then((text) => (inputRef.current.value = text))
										.catch(() =>
											alert(
												'Please allow access to your clipboard in order for the paste button to work',
											),
										)
								}
							>
								Paste
							</button>
						)}
						<button type="submit">Save</button>
					</form>
				</div>
			)}
		</Page>
	)
}

GetToken.getInitialProps = async (ctx) => {
	const token = parseCookies(ctx).token
	const apolloClient = initializeApollo(token)

	try {
		if (token) {
			await apolloClient.query({
				query,
			})
		}
	} catch (error) {
		console.error(error)
	}

	return { token, initialState: apolloClient.cache.extract() }
}
