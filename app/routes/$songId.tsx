import type {LoaderArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import invariant from 'tiny-invariant'
import {supabase} from '~/utils/supabase'

export async function loader({params}: LoaderArgs) {
  invariant(params.songId, 'songId not found')
  const song = await supabase
    .from('songs')
    .select('*')
    .eq('id', params.songId)
    .single()

  if (!song) {
    throw new Error('Song not found')
  }

  return {song: song.data}
}

export default function Song() {
  const {song} = useLoaderData<typeof loader>()

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{song?.title}</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <ul>
            {song?.lyrics.split('\n').map((line, i) => (
              <li key={i} className="py-1 text-gray-700">
                {line}
              </li>
            ))}
          </ul>
        </div>
        {/* /End replace */}
      </div>
    </div>
  )
}
