import type {LoaderArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import ChordSheetJS from 'chordsheetjs'
import React from 'react'
import invariant from 'tiny-invariant'
import {supabase} from '~/utils/supabase'

export async function loader({params}: LoaderArgs) {
  invariant(params.songId, 'songId not found')
  const songRecord = await supabase
    .from('songs')
    .select('*')
    .eq('id', params.songId)
    .single()

  if (!songRecord) {
    throw new Error('Song not found')
  }
  const song = new ChordSheetJS.ChordProParser().parse(songRecord.data.lyrics)
  const disp = new ChordSheetJS.TextFormatter().format(song)
  return {song: disp}
}

export default function Song() {
  const [isEdit, setIsEdit] = React.useState(false)
  const [currentSong, setCurrentSong] = React.useState('')
  const {song} = useLoaderData<typeof loader>()

  console.log(currentSong)

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {/* {song?.metadata.title} */}
        </h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Replace with your content */}
        <div className="">
          <button
            type="button"
            className="my-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              setIsEdit(!isEdit)
              if (isEdit) {
                setCurrentSong('')
              } else {
                setCurrentSong(song)
              }
            }}
          >
            {isEdit ? 'Edit' : 'View'}
          </button>
          {isEdit ? (
            <textarea
              className="h-screen w-full resize-none border-none bg-green-50 py-10  text-gray-700 outline-0 focus:outline-0 focus:ring-0"
              value={currentSong}
              onChange={e => {
                setCurrentSong(e.target.value)
              }}
              onSelect={e => {
                console.log(e.target)
              }}
            />
          ) : (
            <textarea
              readOnly
              className="h-screen w-full resize-none border-none bg-slate-50 py-10  text-gray-700 outline-0 focus:outline-0 focus:ring-0"
              value={song}
            />
          )}
        </div>
        {/* /End replace */}
      </div>
    </div>
  )
}
