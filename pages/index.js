import {useState, useCallback} from 'react'
import Head from 'next/head'
import useSWR from 'swr'
import {useForm} from 'react-hook-form'
import {FaDiscord, FaGithub, FaTwitter, FaExternalLinkAlt} from 'react-icons/fa'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const [search, setSearch] = useState('')
  const {data, error} = useSWR(
    'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
    fetcher,
  )

  const {register, handleSubmit, errors, watch} = useForm()
  const watchTokenName = watch('tokenName', '')
  const onSubmit = (data) => console.log(data)

  if (error) return <div>failed to load</div>

  if (!data)
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen font-sans text-4xl antialiased text-gray-200 ">
        Loading...
      </div>
    )

  const handleError = (event) => {
    event.target.src = '/poop.png'
  }

  return (
    <div className="relative min-h-screen font-sans antialiased text-gray-100 bg-gray-900">
      <div className="absolute top-0 items-center justify-end w-full bg-blue-300 h-1/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-end h-full"
        >
          <div className="mb-4 text-6xl font-semibold text-center text-indigo-600">
            Soul Search
          </div>
          <label className="font-light text-center ">
            Search for your shit coin on Solana
          </label>
          <p className="text-sm font-light">Currently {data.tokens.length} tokens</p>
          <input
            {...register('tokenName')}
            placeholder="Type your shit coin..."
            className="w-1/2 p-2 text-indigo-100 placeholder-gray-300 bg-indigo-400 border border-transparent rounded my-7 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </form>
      </div>
      <div className="absolute w-full min-h-full p-3 bg-warmGray-50 top-1/3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {data.tokens
            .filter((token) => {
              if (!watchTokenName) {
                return true
              }
              return token.name
                .toLowerCase()
                .includes(watchTokenName.toLowerCase())
            })
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .slice(0, 100)
            .map(
              ({
                chainId,
                address,
                name,
                symbol,
                logoURI,
                tags,
                extensions: {twitter, discord, website} = {},
              }) => (
                <div
                  key={`${address}-${name}-${symbol}-${chainId}`}
                  className="flex p-5 space-x-5 text-sm border border-gray-200 rounded-md shadow-md bg-warmGray-100 hover:bg-warmGray-100"
                >
                  <div className="flex items-center justify-center min-w-max">
                    <img
                      src={logoURI}
                      onError={handleError}
                      className="h-12 rounded-full -16 "
                    />
                  </div>
                  <div className="border border-gray-200 border-1" />
                  <div className="flex flex-col justify-center space-y-1">
                    <div className="text-blue-700 text-md">{name}</div>
                    <div className="text-xs font-semibold text-gray-500">
                      {symbol}
                    </div>
                    <div className="flex items-center space-x-2">
                      {discord && (
                        <a
                          href={discord}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaDiscord className="text-xl text-indigo-400 cursor-pointer stroke-current" />
                        </a>
                      )}
                      {twitter && (
                        <a
                          href={twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter className="text-xl cursor-pointer stroke-current text-sky-400" />
                        </a>
                      )}
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="text-xs text-blue-700 cursor-pointer stroke-current" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
        </div>
      </div>
    </div>
  )
}
